/**
 * @typedef {Object} jQuery
 * @constructor
 *
 */
GNZ11Ajax = function () {
    var $ = jQuery;

    this.Init = function () { };

    this.Setting = {
        Ajax: {
            auto_render_message: false,
        },
        Noty: {
            timeout: 26000,
            layout: 'bottomLeft',
            theme: 'metroui',
        },
    };

    this.setConfig = function (setting) {
        this.set(setting);
    };

    this.set = function (param  ) {
        $.extend(true , this.Setting , param  );
        console.log(this.Setting )

    };


    /*
     * Для Правильной отправки понадобится установить переменные
     *
     * ```
     * gnz11.getModul('Ajax').then(function( Ajax ){
     *
     * Joomla.loadOptions({
     *  GNZ11:{
     *      Ajax:{
     *          //php=> $doc->addScriptOptions('siteUrl',JUri::root());
     *          'siteUrl' : Joomla.getOptions('siteUrl'),
     *          'csrf.token' : Joomla.getOptions('csrf.token'),
     *          // если отправка на администратора
     *          'isClient' : 1 ,
     *      }
     *  }
     *});
     *
     * var data = {
     *      option : 'com_virtuemart' ,
     *      view : 'vm_admin_tools' ,
     *      model : 'helper' ,
     *      helperName : 'helper' ,
     *      m_static : 1 ,
     *      opt : {
     *          task : 'productCalc'
     *      }
     *  };
     *
     *  Ajax.send(data).then(function (res) {
     *      console.log(res) ;
     *  },
     *  function (err) {
     *      console.log(err)
     *  });
     *});
     *
     *
     * @param obj
     * @param namespace
     * @param params
     * @returns {Promise<unknown>}
     */
    this.send = function (obj, namespace , params) {
        var $this = this;

        var paramsDef = {
            method : 'POST' ,
        };

        var paramsAjax = Joomla.extend(paramsDef , params ) ;
        return new Promise(function (succeed, fail) {
            var Options = Joomla.getOptions('GNZ11');

            // var siteUrl = (typeof Options.Ajax.siteUrl);
            var siteUrl = ( (typeof Options.Ajax.siteUrl !== 'undefined' && Options.Ajax.siteUrl ) ? Options.Ajax.siteUrl : '/');
            var token = Options.Ajax['csrf.token'];
            if (typeof token === 'undefined'){
                token = Joomla.getOptions('csrf.token')
            }
            var admin = ( (typeof Options.Ajax.isClient !== 'undefined' && Options.Ajax.isClient ) ? 'administrator/' : '');
            $.ajax({
                type: paramsAjax.method,
                cache: false,
                dataType: "json",
                timeout: "20000",
                url: siteUrl + admin + "index.php?"
                    + (typeof namespace !== 'undefined' ? "namespace=" + namespace + '&' : '')
                    + "format=json"
                    + (typeof token !== 'undefined' ? "&" + token + "=1" : '' ),
                data: obj
            }).done(function (datas, textStatus) {

                console.log($this.Setting);

                // Если обьекту Ajax разрешено создавать соообщения во время запроса
                if ($this.Setting.Ajax.auto_render_message) {
                    // Отправить полученные данные для поиска и создания сообщений
                    $this.renderMessages(datas);
                }
                // Вернуть результат запроса вызвашему методу
                succeed(datas);
            });
        });
    };



    /*
     * Отправка запроса Post Cros Domen
     * @param paramUrl object   параметы для добваления в GET
     * @param postData object   параметы для добваления в POST
     * @param calback  function фунция calback
     */
     this.sendPostCrosDomen = function( paramUrl , postData , calback ) {
        // Todo domen - получать из настроек
        var domen = 'https://nobd.ga/' ;
        var $ = jQuery;
        // Добавление данных в GET данные
        var urlString = '';
        $.each(paramUrl, function (k, v) {
            urlString += '&' + k + '=' + v;
        });
        var urlIndex = 'index.php?format=json' + urlString;
        $.ajax({
            url: domen + urlIndex,
            data: postData,
            contentType: 'text/plain',
            type: 'POST',
            dataType: 'json'
        }).done(function (data) {
            calback(data);
        }).fail(function (err) {
            console.log(err) ;
            console.log(new Error("Network Error")) ;
        }).always(function (r) {

        });
    };




    this.typesMessages = ['alert', 'success', 'error', 'warning', 'info', 'message', 'messages'];

    /**
     * Поиск сообщений из (this.typesMessages)
     * @param data - обьект с данными
     */
    this.findMessages = function (data) {

        var $this = this;

        $.each(this.typesMessages, function (i, type) {

            if (data[type] === null || typeof data[type] === 'undefined') return;

            var t = type;

            // Если обьект то искать в обьекте
            if (typeof data[type] === 'object') {
                $this.findMessages(data[type])
            }

            // Если массив - Перебираем массив
            if (Array.isArray(data[type])) {
                data[type].forEach(function (item, i, arr) {
                    $this.renderNoty( item  , type )
                })
            }
            // Если строка - отправляем создавать сообщение
            if (typeof data[type] === 'string') {
                var txt = data[type] ;
                if (!data.success) type = 'error';

                console.log( txt )
                console.log( type )

                $this.renderNoty( txt ,  type   )
            }
        })
    };


    this.renderMessages = function (data) {
        this.findMessages(data);
    };

    /*
     * Отобразить сообщение
     * @param mess - Текст сообщения || Html Сообщения
     * @param type - Тип сообщения - alert, success, error, warning, info
     */
    this.renderNoty = function (  mess , type   ) {
        var $this = this ;
        var gnz11 = new GNZ11();
        //
        if (typeof type === 'undefined')type = 'info';

        // Todo дописать нормальный стиль к типу сообщения alert - он по дефолту
        if (type === 'message') type = 'info';

        var setting = this.Setting.Noty;
        var notySet = this.Setting.Noty;

        // TODO Разобраться с передоваемыми настройками и настройками по умолчанию

        console.log(setting.timeout);
        console.log(typeof setting.timeout);

        gnz11.__loadModul.Noty(setting).then(function (n) {
            console.log( $this.Setting['Noty'] )
            console.log(setting)
            var n = new Noty( setting );
            n.setText(mess, true);
            n.setType(type, true);
            // n.setTheme('metroui' , true );
            // n.setTimeout(setting.timeout, true);
            // n.options.timeout = notySet.timeout;
            n.options.timeout = setting.timeout;
            // n.options.layout = setting.Layout ;
            n.show();
            gnz11.debug(n, 'Noty');

        });
    };



};



/*!
    * jQuery-ajaxTransport-XDomainRequest - v1.0.1 - 2013-10-17
    *
    * Exsample : https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
    *
    * https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest
    * Copyright (c) 2013 Jason Moon (@JSONMOON)
    * Licensed MIT (/blob/master/LICENSE.txt)
    */
(function($){if(!$.support.cors&&$.ajaxTransport&&window.XDomainRequest){var n=/^https?:\/\//i;var o=/^get|post$/i;var p=new RegExp('^'+location.protocol,'i');var q=/text\/html/i;var r=/\/json/i;var s=/\/xml/i;$.ajaxTransport('* text html xml json',function(i,j,k){if(i.crossDomain&&i.async&&o.test(i.type)&&n.test(i.url)&&p.test(i.url)){var l=null;var m=(j.dataType||'').toLowerCase();return{send:function(f,g){l=new XDomainRequest();if(/^\d+$/.test(j.timeout)){l.timeout=j.timeout}l.ontimeout=function(){g(500,'timeout')};l.onload=function(){var a='Content-Length: '+l.responseText.length+'\r\nContent-Type: '+l.contentType;var b={code:200,message:'success'};var c={text:l.responseText};try{if(m==='html'||q.test(l.contentType)){c.html=l.responseText}else if(m==='json'||(m!=='text'&&r.test(l.contentType))){try{c.json=$.parseJSON(l.responseText)}catch(e){b.code=500;b.message='parseerror'}}else if(m==='xml'||(m!=='text'&&s.test(l.contentType))){var d=new ActiveXObject('Microsoft.XMLDOM');d.async=false;try{d.loadXML(l.responseText)}catch(e){d=undefined}if(!d||!d.documentElement||d.getElementsByTagName('parsererror').length){b.code=500;b.message='parseerror';throw'Invalid XML: '+l.responseText;}c.xml=d}}catch(parseMessage){throw parseMessage;}finally{g(b.code,b.message,c,a)}};l.onprogress=function(){};l.onerror=function(){g(500,'error',{text:l.responseText})};var h='';if(j.data){h=($.type(j.data)==='string')?j.data:$.param(j.data)}l.open(i.type,i.url);l.send(h)},abort:function(){if(l){l.abort()}}}}})}})(jQuery);








