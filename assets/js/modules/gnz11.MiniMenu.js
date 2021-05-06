/*******************************************************************************************************************
 *     ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗        ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
 *     ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝        ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
 *     ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗        ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
 *     ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║        ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
 *     ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║        ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
 *     ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝        ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
 *------------------------------------------------------------------------------------------------------------------
 * @author Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 12.01.2021 17:07
 * @copyright  Copyright (C) 2005 - 2021 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 * Модуль (синглтон) - Управления мини меню
 ******************************************************************************************************************/
/* global jQuery , Joomla   */
window.GNZ11MiniMenu = function () {
    var $ = jQuery;
    var self = this;
    // Домен сайта
    var host = Joomla.getOptions('GNZ11').Ajax.siteUrl;
    // Медиа версия
    var __v = '';

    this.__type = false;
    this.__plugin = false;
    this.__name = false;
    this._params = {
        __module: null
    };
    // Параметры Ajax по умолчвнию
    this.AjaxDefaultData = {
        group: null,
        plugin: null,
        module: null,
        method: null,
        option: 'com_ajax',
        format: 'json',
        task: null,
    };
    // Default object parameters
    this.ParamsDefaultData = {
        // Медиа версия
        __v: '1.0.0',
        // Режим разработки 
        development_on: false,
    }

    /**
     * Start Init
     * @constructor
     */
    this.Init = function () {
        GNZ11.MiniMenu_Loaded = true ;
        this._params = Joomla.getOptions('GNZ11MiniMenu', this.ParamsDefaultData);
        __v = self._params.development_on ? '' : '?v=' + self._params.__v;
        // Загрузка ресурсов
        this.loadAssets();
        // Параметры Ajax Default
        this.setAjaxDefaultData();
        // Добавить слушателей событий
        this.addEvtListener();

    }
    /**
     * Создание мини меню
     * @param btn
     * @param menuHtml
     */
    this.createMenu = function ( btn , menuHtml ){
        self.load.css(host + 'libraries/GNZ11/assets/js/modules/MiniMenu/MiniMenu.css').then(function (r){
            var $btn = $(btn) ;
            if ( $btn.data( 'expanded') ) return ;
            $btn.data( 'expanded',true );
            $btn.append( $(menuHtml) );
            self.addBodyWaitClose();
        },function (err){console.log(err)});
    };
    /**
     * Снять ожидающий клика при открытом меню
     */
    this.removeBodyWaitClose = function (){
        var $body = $('body') ;
        $body.off('click.MiniMenuWait');
    };
    /**
     * После открытия клик по любому элементу кроме открытого меню
     * закрываем меню
     */
    this.addBodyWaitClose = function (){
        var $body = $('body') ;
        $body.on('click.MiniMenuWait' , function (event){
            var $expandedEl
            var $parentBtn = $(event.target).closest('button[data-expanded]')
            if ($parentBtn[0]) return;
            $expandedEl = $body.find('button[data-expanded] ul.cart-actions__list');
            $expandedEl.closest('button[data-expanded]').data('expanded' , false ) ;
            $expandedEl.remove();
            self.removeBodyWaitClose();

       })
    };

    /**
     * Добавить слушателей событий
     */
    this.addEvtListener = function () {
        var $body = $('body');

        // Кнопка отмена в действиях меню
        $body.on('click.CartAjaxCore' , '[data-action="cancel"]' , self.onClickRemoveActionList );

    };

    /**
     * Удалить Меню список действий у товара в списке
     */
    this.onClickRemoveActionList = function (){
        $(this).closest('button').data( 'expanded' , false );
        $(this).closest('ul').remove();
        self.removeBodyWaitClose();
        return false ;
    }

    /**
     * Загрузка ресурсов
     */
    this.loadAssets = function (){
       console.log('gnz11.MiniMenu:loadAssets' , 'Загрузка ресурсов' );
        
        var iconsArr = [
            '#icon-vertical-dots' ,// Вертикальные точки
            '#icon-trash', // Мусорная корзина
            '#icon-remove', // Крестик
        ];
        self.load.svg(iconsArr);

    };

    /**
     * Отправить запрос
     * @param Data - отправляемые данные
     * Должен содержать Data.task = 'taskName';
     * @returns {Promise}
     * @constructor
     */
    this.AjaxPost = function (Data) {
        var data = $.extend(true, this.AjaxDefaultData, Data);
        return new Promise(function (resolve, reject) {
            self.getModul("Ajax").then(function (Ajax) {
                // Не обрабатывать сообщения
                Ajax.ReturnRespond = true;
                // Отправить запрос
                Ajax.send(data, self._params.__name).then(function (r) {
                    resolve(r);
                }, function (err) {
                    console.error(err);
                    reject(err);
                })
            });
        });
    };
    /**
     * Параметры Ajax Default
     */
    this.setAjaxDefaultData = function () {
        this.AjaxDefaultData.group = this._params.__type;
        this.AjaxDefaultData.plugin = this._params.__name;
        this.AjaxDefaultData.module = this._params.__module;
        this._params.__name = this._params.__name || this._params.__module;
    }
    if (!GNZ11.MiniMenu_Loaded ) this.Init();
};

window.GNZ11MiniMenu.prototype = new GNZ11();
// Модуль как синглтон
GNZ11.MiniMenu_Loaded = false ;

