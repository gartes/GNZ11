/***********************************************************************************************************************
 * ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗  ╔╗╔╗╔╗ ╔═══╗ ╔══╗   ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
 * ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝  ║║║║║║ ║╔══╝ ║╔╗║   ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
 * ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗  ║║║║║║ ║╚══╗ ║╚╝╚╗  ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
 * ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║  ║║║║║║ ║╔══╝ ║╔═╗║  ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
 * ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║  ║╚╝╚╝║ ║╚══╗ ║╚═╝║  ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
 * ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝  ╚═╝╚═╝ ╚═══╝ ╚═══╝  ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
 *----------------------------------------------------------------------------------------------------------------------
 * @author Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 07.09.2020 21:04
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 **********************************************************************************************************************/
window.CompressScripts = function (){
    var $ = jQuery ;
    var self = this;
    this.__group = 'system';
    this.__plugin = 'joomshoping_prod_sys' ;
    /**
     * Стандартные параметры Ajax запроса
     * @type {{plugin: string, option: string, group: string}}
     */
    this.defAjaxParam = {
        option: 'com_ajax',
        group: 'system',
        plugin: 'pro_critical',
    };

    this.INNIT = function (){
        this.addEventListener();
    }
    this.addEventListener = function (){
        var $rCompress =  $('.CompressScripts');
        $rCompress.on('change' , self.CompressScriptsMethod )
    }
    this.CompressScriptsMethod = function (event){
        var $target = $(event.delegateTarget);
        var file = $target.data('file')
        var task = ( +$target.find('input:checked').val()?'minify':'remove_minify' )
        // Отправить запрос для создания min файла
        self.sendCompressFile( file , task );
    }
    /**
     * Отправить запрос для создания min файла или его удаления
     * @param  file string - путь к файлу от корня сайта без ведущего слеша
     * @param _task string - Задача minify || remove_minify (Для удаления)
     */
    this.sendCompressFile = function ( file , _task){

        var objData = {
            model: '\\Optimize\\Js_css',
            task: _task,
            data: '/'+file,
        };
        $.extend(objData, self.defAjaxParam);
        self.getAjax().then(function (Ajax) {
            Ajax.Setting.Ajax.auto_render_message = true ;
            Ajax.Setting.Noty.timeout = 3000 ;
            Ajax.send(objData , 'admin_script').then(function (result) {

            });
        });
        console.log( file)
        console.log( _task)
    }
    this.INNIT();
}

window.CompressScripts.prototype = new GNZ11() ;
new CompressScripts();


























