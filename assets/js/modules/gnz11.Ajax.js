/**
 * @typedef {Object} jQuery
 * @constructor
 *
 */
GNZ11Ajax = function () {
    var $ = jQuery;
    var self = this ;
    this.Init = function () { };


    this.Loader = false ;

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
    };


    this._startLoader = function (   ){
        $appendTo = $('body')
        var $tElemet = $('<div />', {id: 'progress', class: 'waiting', html: '<dt></dt><dd></dd>',})
        $tElemet.appendTo( $appendTo );
        $({property: 0}).animate({property: 105}, {
            // время выполнения
            duration: 5000 ,
            step: function () {

                console.log( this )
                var _percent = Math.round(this.property);
                var $progress = $('#progress');
                $progress.css('width', _percent + "%");
                if (_percent === 105) {
                    $progress.addClass("done");
                }
            },
            complete: function () {
                /*if (typeof params.complete === 'function') {
                    params.complete();
                }*/
            }
        });
    }

    /**
     Для Правильной отправки понадобится установить переменные

     gnz11.getModul('Ajax').then(function( Ajax ){
               Joomla.loadOptions({
               GNZ11:{
                    Ajax:{
                        'siteUrl' : Joomla.getOptions('siteUrl'), //php=> $doc->addScriptOptions('siteUrl',JUri::root());
                        'csrf.token' : Joomla.getOptions('csrf.token'),
                        'isClient' : 1 , // если отправка на администратора
                    }
               }
               });
               var data = {
                    option : 'com_virtuemart' ,
                    view : 'vm_admin_tools' ,
                    model : 'helper' ,
                    helperName : 'helper' ,
                    m_static : 1 ,
                    opt : {
                       task : 'productCalc'
                    }
               };
               Ajax.send(data).then(function (res) {
                    console.log(res) ;
               },function (err) {
                    console.log(err)
               });
            });


     */

    /**
     * Отправить AJAX запрос
     * @param obj - Объект с данными
     * @param namespace - пространства имен будет добавлен к URL
     * @param params
     * @returns {Promise<unknown>}
     */
    this.send = function (obj, namespace , params , addToGet ) {
        var $this = this;

        var paramsDef = {
            method : 'POST' ,
            dataType : 'json' ,
            Loader : self.Loader ,
        };

        if ( self.Loader ){
            self._startLoader();
        }

        var paramsAjax = Joomla.extend(paramsDef , params ) ;
        // console.log( paramsAjax );

        if ( paramsAjax.Loader ){

        }



        return new Promise(function (succeed, fail) {
            var Options = Joomla.getOptions('GNZ11');

            // var siteUrl = (typeof Options.Ajax.siteUrl);

            var siteUrl = ( ( typeof Options.Ajax !== "undefined" && typeof Options.Ajax.siteUrl !== 'undefined' && Options.Ajax.siteUrl ) ? Options.Ajax.siteUrl : '/');

            var token = false ;
            if ( typeof Options.Ajax !== "undefined" ){
                token = Options.Ajax['csrf.token'];
            }

            if (!token){
                token = Joomla.getOptions('csrf.token')
            }
            var admin = ( ( typeof Options.Ajax !== "undefined" && typeof Options.Ajax.isClient !== 'undefined' && Options.Ajax.isClient ) ? 'administrator/' : '');


            // var Uri = siteUrl + admin + "index.php?"
            var Uri = window.location.pathname + '?' ;

            if ( typeof paramsAjax.URL !== 'undefined' ){

                // console.log( paramsAjax.URL.indexOf('?') );
                
                if ( paramsAjax.URL.indexOf('?') !== -1 ){
                    Uri = paramsAjax.URL + '&' ;
                }else{
                    Uri = paramsAjax.URL + '?' ;
                }
                // console.log(  paramsAjax.URL );


            }

            // console.log( paramsAjax );
            // console.log( Uri );


            $.ajax({
                type: paramsAjax.method,
                cache: false,
                dataType: typeof paramsAjax.dataType !== 'undefined' ? paramsAjax.dataType : "json" ,
                timeout: "20000",
                url: Uri
                    + (typeof namespace !== 'undefined' ? "namespace=" + namespace + '&' : '')
                    + "format=json"
                    + (typeof token !== 'undefined' ? "&" + token + "=1" : '' )
                    + "&t=" + Date.now() ,
                data: obj ,
                error: function (jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status === 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status === 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    console.log( msg ) ;
                    fail( msg , jqXHR, exception   )
                }
            }).done(function (datas, textStatus) {
                // TODO - упрастить создание простых ответов
                // Если обьекту Ajax разрешено создавать соообщения во время запроса
                if ($this.Setting.Ajax.auto_render_message) {
                    // Отправить полученные данные для поиска и создания сообщений
                    $this.renderMessages(datas);
                }
                // Вернуть результат запроса вызвашему методу
                succeed( datas , textStatus );
            });
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







