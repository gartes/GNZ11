/**
 * IE9+
 * You can polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher with the following code:
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
(function () {
    if ( typeof window.CustomEvent === "function" ) return false;
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    window.CustomEvent = CustomEvent;
})();
// IE9 fix console
if (!window.console) {
    var console = {
        trace: function () {
        }, info: function () {
        }, log: function () {
        }, warn: function () {
        }, warn: function () {
        }, error: function () {
        }, time: function () {
        }, timeEnd: function () {
        }
    }
}



// TODO Добавить for ES6-style Promises
// https://github.com/stefanpenner/es6-promise
//
// ES6 Promise polyfill
// Browser Support IE8+, Chrome, Firefox, IOS 4+, Safari 5+, Opera
// https://www.npmjs.com/package/promise-polyfill


Joomla = window.Joomla || {};
Jpro = window.Jpro || {};
(function (Joomla , Jpro ) {
    /**
     * Get script(s) options
     *
     * @param  {String}  key  Name in Storage
     * @param  {mixed}   def  Default value if nothing found
     *
     * @return {mixed}
     *
     * @since 3.7.0
     */
    Joomla.getOptions = function( key, def ) {
        // Load options if they not exists
        if (!Joomla.optionsStorage) {
            Joomla.loadOptions();
        }

        return Joomla.optionsStorage[key] !== undefined ? Joomla.optionsStorage[key] : def;
    };
    Joomla.optionsStorage = Joomla.optionsStorage || null;
    Joomla.loadOptions = function( options ) {
        // Load form the script container
        if (!options) {
            var elements = document.querySelectorAll('.joomla-script-options.new'),
                str,
                element,
                option,
                counter = 0;

            for (var i = 0, l = elements.length; i < l; i++) {
                element = elements[i];
                str     = element.text || element.textContent;
                option  = JSON.parse(str);

                if (option) {
                    Joomla.loadOptions(option);
                    counter++;
                }
                element.className = element.className.replace(' new', ' loaded');
            }

            if (counter) {
                return;
            }
        }
        // Initial loading
        if (!Joomla.optionsStorage) {
            Joomla.optionsStorage = options || {};
        }
        // Merge with existing
        else if ( options ) {
            for (var p in options) {
                if (options.hasOwnProperty(p)) {
                    Joomla.optionsStorage[p] = options[p];
                }
            }
        }
    };
    /**
     * Метод объеденения двух объектов
     * Возвращает первый
     * Method to Extend Objects
     *
     * @param  {Object}  destination
     * @param  {Object}  source
     *
     * @return Object    destination
     */
    Joomla.extend = function (destination, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                destination[p] = source[p];
            }
        }

        return destination;
    };
    Joomla.loadOptions();


    Jpro.load = function ( url ,  callback  ) {

        if (typeof GNZ11 === 'undefined'){
            var opt = Joomla.getOptions('Jpro');
            var data = {

                'u':url ,
                'c' : callback

            };
            opt.load.push(data);
            Joomla.loadOptions({'Jpro':opt});
        }else{
            var gnz11 = new GNZ11();
            gnz11.load[tag](url).then(function (a) {
                if (typeof callback !== 'function') return ;
                callback(a)
            });
        }

    }
})(Joomla , Jpro);

var GNZ11_defSetting = {
    debug: false ,
    gnzlib_path_file_corejs: "/libraries/GNZ11/assets/js/gnz11.js",
    gnzlib_path_file_corejs_min: "/libraries/GNZ11/assets/js/gnz11.min.js",
    gnzlib_path_modules: "/libraries/GNZ11/assets/js/modules",
    gnzlib_path_plugins: "/libraries/GNZ11/assets/js/plugins",
};

/**
 * @constructor
 */
window.GNZ11 = function (options_setting) {
    var $=jQuery ;
    var self = this ;
    self.DEBAG = true ;
    /**
     * Хранение конфигурации библиотеки GNZ11
     * @type {{}}
     */
    this.WGNZ11INIT_OPTS = {
        PATH_API : null
    } ;
    this._defaults = {
        PATH_API: '/libraries/GNZ11/Api'

    };

    this.WGNZ11INIT = function () {
        if ( typeof options_setting === 'undefined') options_setting = {} ;
        self.WGNZ11INIT_OPTS = Object.assign({}  , self._defaults , options_setting  );
    };

    (function () { })();

    this._siteUrl = null ;

    this.set_siteUrl = function (Url) {
        this._siteUrl = Url ;
        Joomla.loadOptions({ 'siteUrl' : Url })
    };

    this.Options = (function () {
        var opt = Joomla.getOptions('GNZ11')
        if ( typeof opt === 'undefined'){
            Joomla.loadOptions({ 'GNZ11' : GNZ11_defSetting })
        }
        return Joomla.getOptions('GNZ11')
    })();
    this.init = function () {};
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    /**
     * Загрузка Ajax модуля (GNZ11Ajax)
     * @return {*}
     */
    this.getAjax = function () {
        console.warn('GNZ11.getAjax is deprecated!!! Use GNZ11.getModul("Ajax")');
        return this.getModul('Ajax');
    };
    /**
     * Загрузка css, img, js
     * @type {{css, img, js}}
     */
    this.load = (function () {
        var LIB = this;
        // Function which returns a function: https://davidwalsh.name/javascript-functions
        function _load(tag) {
            return function (url) {
                // This promise will be used by Promise.all to determine success or failure
                return new Promise(function(resolve, reject) {
                    if (typeof window.GNZ11_isLoad === 'undefined'){
                        window.GNZ11_isLoad = {
                            script: [],
                            link: [],
                            img: []
                        };
                    }
                    // console.log( url )
                    if ( $.inArray(url, window.GNZ11_isLoad[tag]) !== -1 )  return resolve( url );
                    window.GNZ11_isLoad[tag].push( url );
                    var element = document.createElement(tag);
                    var parent = 'body';
                    var attr = 'src';
                    // Important success and error for the promise
                    element.onload = function() { resolve(url);  };
                    element.onerror = function() { reject(url); };

                    // Need to set different attributes depending on tag type
                    switch( tag ) {
                        case 'script':
                            element.async = true;
                            break;

                        case 'link':
                            element.type = 'text/css';
                            element.rel = 'stylesheet';
                            attr = 'href';
                            parent = 'head';
                    }
                    // Inject into document to kick off loading
                    element[attr] = url;
                    document[parent].appendChild(element);
                });
            };
        }

        return {
            css: _load('link'),
            js: _load('script'),
            script: _load('script'),
            img: _load('img')
        };
    })();

    /**
     * Склонение числительных в javascript
     * @param number
     * @param titles
     * @returns {*}
     *
     * @url https://gist.github.com/realmyst/1262561
     */
     this.declOfNum = function(number, titles) {
        cases = [2, 0, 1, 1, 1, 2];
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
     };
    /**
     * Переписать числа словами
     * @param Summ
     * @param currency
     * @returns {*}
     */
     this.getLettersSumm = function (Summ , currency ) {
         return sum_letters( Summ ) ;
         function num_letters(k, d) {  // целое число прописью, это основа
             var i = '', e = [
                 ['','тысяч','миллион','миллиард','триллион','квадриллион','квинтиллион','секстиллион','септиллион','октиллион','нониллион','дециллион'],
                 ['а','и',''],
                 ['','а','ов']
             ];
             if (k == '' || k == '0') return ' ноль'; // 0
             k = k.split(/(?=(?:\d{3})+$)/);  // разбить число в массив с трёхзначными числами
             if (k[0].length == 1) k[0] = '00'+k[0];
             if (k[0].length == 2) k[0] = '0'+k[0];
             for (var j = (k.length - 1); j >= 0; j--) {  // соединить трёхзначные числа в одно число, добавив названия разрядов с окончаниями
                 if (k[j] != '000') {
                     i = (((d && j == (k.length - 1)) || j == (k.length - 2)) && (k[j][2] == '1' || k[j][2] == '2') ? t(k[j],1) : t(k[j])) + declOfNum(k[j], e[0][k.length - 1 - j], (j == (k.length - 2) ? e[1] : e[2])) + i;
                 }
             }
             function t(k, d) {  // преобразовать трёхзначные числа
                 var e = [
                     ['',' один',' два',' три',' четыре',' пять',' шесть',' семь',' восемь',' девять'],
                     [' десять',' одиннадцать',' двенадцать',' тринадцать',' четырнадцать',' пятнадцать',' шестнадцать',' семнадцать',' восемнадцать',' девятнадцать'],
                     ['','',' двадцать',' тридцать',' сорок',' пятьдесят',' шестьдесят',' семьдесят',' восемьдесят',' девяносто'],
                     ['',' сто',' двести',' триста',' четыреста',' пятьсот',' шестьсот',' семьсот',' восемьсот',' девятьсот'],
                     ['',' одна',' две']
                 ];
                 return e[3][k[0]] + (k[1] == 1 ? e[1][k[2]] : e[2][k[1]] + (d ? e[4][k[2]] : e[0][k[2]]));
             }
             return i;
         }
         function declOfNum(n, t, o) {  // склонение именительных рядом с числительным: число (typeof = string), корень (не пустой), окончание
             var k = [2,0,1,1,1,2,2,2,2,2];
             return (t == '' ? '' : ' ' + t + (n[n.length-2] == "1"?o[2]:o[k[n[n.length-1]]]));
         }
         function razUp(e) {  // сделать первую букву заглавной и убрать лишний первый пробел
             return e[1].toUpperCase() + e.substring(2);
         }
         function sum_letters(a) {
             a = Number(a).toFixed(2).split('.');  // округлить до сотых и сделать массив двух чисел: до точки и после неё

             if (typeof currency ==='undefined' )  a[1] = '' ;
             switch (currency) {
                 case 'р' :
                     currencyText = [
                         declOfNum(a[0], 'рубл', ['ь', 'я', 'ей']),
                         declOfNum(a[1], 'копе', ['йка', 'йки', 'ек']),
                     ];
                     break;
                 default :
                     currencyText = [ '' , '' ];
             }

             return razUp(num_letters(a[0]) + currencyText[0] + ' ' + a[1] + currencyText[1]);
         }
     }


    /**
     * Звгрузка модулей GNZ11
     * @param moduleName
     * @param setting
     * @returns {Promise<unknown>}
     */
    this.getModul = function (moduleName , setting) {

        var $this = this ;
        var siteUrl = Joomla.getOptions('siteUrlsiteUrl' , '' ) ;

        var pathModules =  siteUrl + this.Options.gnzlib_path_modules;
        var Module = 'GNZ11'+moduleName ;
        var returnModule ;
        console.log( typeof Module );
        console.log( moduleName );


        //
        // Если модуль еще не был загружен
        if ( typeof Module !== 'function' ) {
            return new Promise(function (resolve, reject) {
                console.log(pathModules +'/gnz11.'+moduleName+'.js');
                Promise.all([
                    $this.load.js( pathModules+'/gnz11.'+moduleName+'.js')
                ]).then(function (r) {

                    /**
                     * Проверка на класс
                     * @type {void|*|RegExpMatchArray|Promise<Response | undefined>}
                     */
                    var testClass = moduleName.match(/_class/);
                    console.log(testClass)
                    if ( testClass && testClass[0] ){
                        resolve(moduleName);
                        return ;
                    }

                    console.log( typeof Module );
                    console.log( returnModule )
                    var i = setInterval(function () {

                        if (typeof window[Module] === 'function') {
                            clearInterval(i);
                            returnModule = new window[Module](  );

                            if ( typeof setting === 'undefined' ) resolve(returnModule);
                            if ( typeof returnModule.setConfig !== 'undefined' ) returnModule.setConfig(setting) ;
                            resolve(returnModule);
                        }
                    }, 300)
                })
            });
        }else {
            return new Promise(function (resolve, reject) {
                resolve(new window[Module]());
            });
        }
    };
    /**
     * Загрузка елементов API
     * @param nameApi str Имя API  e.t. NovaPoshta
     * @param options obj ?????
     */
    this.getApi = function ( classApi , nameApi , options ) {
        const _JS_ = '/assets/js' ;
        var file = self.WGNZ11INIT_OPTS.PATH_API+'/'+classApi+'/'+nameApi + _JS_ +'/'+nameApi+'.js' ;
        return new Promise(function (resolve, reject) {
            Promise.all([
                wgnz11.load.js( file ),
            ]).then(function (a) {
                resolve( true );
            },function (reject) {
                reject();
            })
        })



        /*return new Promise(function(resolve, reject) {
            return wgnz11.load.js( file ).then( function (res) {
                return resolve ;
            },function (err) {
                return reject ;
            }) ;
        });*/

    }
    /**
     * Загрузка плагинов библиотеки GNZ11
     *
     * @param pluginName    str - Имя плагина
     * @param setting       obj - Объект с конфигурацией плагина
     */
    this.getPlugin = function (pluginName , setting) {
       this.__loadModul[pluginName](setting)
    }
    /*
     * Load  module
     *
     * var gnz11 = new gn_z11;
     *
     * gnz11.__loadModul.Noty().then(function(a){})
     * gnz11.__loadModul.Fancybox().then(function(a){})
     * gnz11.__loadModul.Bootstrap().then(function(a){})
     *
     * Tippy.js - это полное решение для всплывающих подсказок, всплывающих окон,
     * выпадающих меню и меню для веб-сайтов, созданное на основе Popper .
     * gnz11.__loadModul.Tippy().then(function(a){})
     *
     *
     * @type {{Noty: gn_z11.__loadModul.Noty, Fancybox: gn_z11.__loadModul.Fancybox}}
     * @private
     */
    this.__loadModul = {
        Inputmask : function(param){
            if ( typeof  Inputmask === 'undefined' ){
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        wgnz11.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/inputmask.css'),
                        wgnz11.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/jquery.mask.min.js'),
                        wgnz11.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/inputmask.js'),
                    ]).then(function (a) {
                        console.info( 'Inputmask loaded' )
                        var $ =jQuery ;
                        var elSelector = param.element ;
                        Inputmask.Inint( elSelector , param );

                        /*function Inint (elSelector , Settings){
                            var wrp = $('<div />' , {
                                class : 'wrapMaskPhone'
                            });
                            $(elSelector)
                                .attr('placeholder' , Settings.mask)
                                .wrap( wrp )
                        }*/

                        /*$( elSelector ).mask(Settings.mask ,{
                            onKeyPress:function(v,event,currentField,options){
                                _setOperatorIcon( Settings , currentField )
                            },
                            onChange: function(cep){
                                console.log('cep changed! ', cep);
                            },
                        });*/


                    })
                })
            }

        },
        Noty :  function (param) {
            //
            var $this = new GNZ11();
            var NotySettingDefault = $this.Options.Noty ;
            var setting = {};
            $.extend(  true , setting ,  NotySettingDefault  , param   );

            console.log( setting );

            if ( typeof  Noty === 'undefined' ){
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/noty/noty.css'),
                        $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/noty/themes/metroui.css'),
                        $this.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/noty/noty.js'),
                    ]).then(function (a) {
                        var i = setInterval(function () {
                            if (typeof  Noty === 'function'){
                                clearInterval(i);
                                console.log( 'Noty - Loaded');
                                resolve(new Noty( setting ));
                            }
                        },1);
                    })
                })
            }else {
                return new Promise(function (resolve, reject) {
                    resolve(new Noty( setting ));
                })
            }
        },
        Bootstrap:function(){

            if ( typeof $().emulateTransitionEnd === 'function' ){
                return new Promise(function (resolve, reject) {
                    resolve( true );
                })
            }else{
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        wgnz11.load.js('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'),
                    ]).then(function (a) {
                        resolve( true );
                    })
                })
            }
        },
        Fancybox : function () {
            var $this = new GNZ11() ;
            var siteUrl = Joomla.getOptions('siteUrlsiteUrl' , '' ) ;
            if (  typeof $.fancyboxqqq === 'undefined' ) {
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        $this.load.css('https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css'),
                        $this.load.css(siteUrl+'/libraries/GNZ11/assets/js/plugins/jQuery/fancybox/thems/protect.css'),
                        $this.load.js(siteUrl+'/libraries/GNZ11/assets/js/plugins/jQuery/fancybox/jquery.fancybox.js'),
                    ]).then(function (a) {
                        var css = '.fancybox-content {' +
                            //   'min-width: 100%;' +
                            //    'min-height: 250px;' +
                            'background: url(/templates/t3_bs3_blank/images/logos/logo_benks.png) no-repeat;' +
                            'background-color: #fff;' +
                            'background-position: 10px 10px;' +
                            'background-size: 80px 25px;' +
                            '}';
                        // $this.__addCss(css);
                        resolve($.fancyboxqqq);
                    });
                })
            }else{
                return new Promise(function (resolve, reject) {
                    resolve( $.fancyboxqqq );
                })
            }
        },
        Chosen : function () {
            var $this = new GNZ11() ;
            return new Promise(function (resolve, reject) {
                Promise.all([
                    $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/chosen/chosen.min.css'),
                    $this.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/chosen/chosen.jquery.min.js'),
                ]).then(function (a) {
                    resolve(a);
                });
            })
        },
        Ui:function () {
            var $this = new GNZ11() ;
            return new Promise(function (resolve, reject) {
                Promise.all([
                    $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/jquery-ui/jquery-ui.css'),
                    $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/jquery-ui/jquery-ui.structure.css'),
                    $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/jquery-ui/jquery-ui.theme.css'),
                    $this.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/jquery-ui/jquery-ui.js'),
                ]).then(function (a) {
                    if (jQuery.ui) {

                        resolve(a);
                        // UI loaded
                    }

                });
            })
        },
        Tippy:function (){
            return new Promise(function (resolve, reject) {
                var $this = new GNZ11() ;
                Promise.all([
                    /*$this.load.css('https://unpkg.com/tippy.js@6/animations/scale.css'),
                    $this.load.js('https://unpkg.com/@popperjs/core@2'),
                    $this.load.js('https://unpkg.com/tippy.js@6'),*/
                    $this.load.css('https://unpkg.com/tippy.js@6/animations/scale.css'),
                    $this.load.js('https://unpkg.com/@popperjs/core@2.4.0/dist/umd/popper.min.js'),
                    $this.load.js('https://unpkg.com/tippy.js@6.2.3/dist/tippy-bundle.umd.min.js'),
                ]).then(function (a) {
                    console.log( typeof tippy )
                    resolve(a);
                },function (err)
                {
                    console.error('Ошибка загрузки модуля "Tippy.js"');
                    console.log(err);
                });
            })
        }

    };
    this.loadJpro = function () {
        var optJpro = Joomla.getOptions('Jpro');
        if (typeof optJpro === 'undefined' || typeof  optJpro.load !== 'object') return ;
        optJpro.load.forEach(function(item, i, arr) {
            setTimeout(function () {


                if (typeof item.t === 'undefined' ){
                    var parseResult = gnz11.parseURL(item.u  );
                    item.t = parseResult.extension;

                }


                wgnz11.load[item.t](item.u).then(function (a) {
                    /*if ( item.u  === '/modules/mod_virtuemart_zif_filter/assets/js/mod_virtuemart_zif_filter.js' ){
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
                        console.log(parseResult)
                        console.log(item )
                        console.log(item.t)
                        console.log(item.u)
                        console.log(item.c)
                        console.log(typeof window[item.c])
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

                    }*/
                    // Если fnCallback - не функция создаем событие fnCallback
                    if (typeof window[item.c] !== 'function') {
                        // Create the event
                        var event = new CustomEvent(item.c, {'file': a});
                        console.log( event )
                        document.dispatchEvent(event);
                    }else {
                        window[item.c](a);
                    }

                });
            },500)
        });
    };

    this.debug=function ( value , namespase ) {
        if (!this.Options.debug) return ;
        if (typeof namespase === 'undefined' ){
            console.log( value );
            return;
        }
        console.groupCollapsed(namespase);
        console.log( value );
        console.groupEnd();

    };
    /**
     * Парсинг Url Строки
     * @param url
     * @returns {{searchObject: *, protocol: *, hostname: *, search: *, extension: *, port: *, host: *, hash: *, pathname: *}}
     */
    this.parseURL = function(url) {
        var parser = document.createElement('a'),
            searchObject = {},
            queries, split, i;
        // Let the browser do the work
        parser.href = url;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        var filename = parser.pathname ;
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash ,
            extension : filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
        };
    };
     // radio btn - init
    this.checkBoxRadioInit = function  (){
        var $=jQuery;
        // Turn radios into btn-group
        $('.radio.btn-group label').addClass('btn');

        $('fieldset.btn-group').each(function() {
            // Handle disabled, prevent clicks on the container, and add disabled style to each button
            if ($(this).prop('disabled')) {
                $(this).css('pointer-events', 'none').off('click');
                $(this).find('.btn').addClass('disabled');
            }
        });

        $(".btn-group label:not(.active)").click(function()
        {
            var label = $(this);
            var input = $('#' + label.attr('for'));

            if (!input.prop('checked')) {
                label.closest('.btn-group').find("label")
                    .removeClass('active btn-success btn-danger btn-primary');
                if (input.val() === '') {
                    label.addClass('active btn-primary');
                } else if (input.val() === 0) {
                    label.addClass('active btn-danger');
                } else {
                    label.addClass('active btn-success');
                }
                input.prop('checked', true);
                input.trigger('change');
            }
        });
        $(".btn-group input[checked=checked]").each(function()
        {
            if ($(this).val() === '') {
                $("label[for=" + $(this).attr('id') + "]").addClass('active btn-primary');
            } else if ($(this).val() === 0) {
                $("label[for=" + $(this).attr('id') + "]").addClass('active btn-danger');
            } else {
                $("label[for=" + $(this).attr('id') + "]").addClass('active btn-success');
            }
        });
    };
    /**
     * Обработчик форм SHOWON
     * @type {{Init: GNZ11.SHOWON.Init, linkedoptions: GNZ11.SHOWON.linkedoptions}}
     */
    this.SHOWON = {
        Init : function  (){
            var $ = jQuery;
            var self = new GNZ11();
            $('[data-showon]').each(function() {
                var target = $(this), jsondata = $(this).data('showon');

                // Attach events to referenced element
                $.each(jsondata, function(j, item) {
                    var $fields = $('[name="' + jsondata[j]['field'] + '"], [name="' + jsondata[j]['field'] + '[]"]');
                    // Attach events to referenced element
                    $fields.each(function() {
                        self.SHOWON.linkedoptions(target);
                    }).bind('change', function() {
                        // var self = new GNZ11();
                        self.SHOWON.linkedoptions(target);
                    });

                });
            });
        },// end function
        linkedoptions : function(target) {
            var $ = jQuery;
            var showfield = true, itemval, jsondata = target.data('showon');

            // Check if target conditions are satisfied
            $.each(jsondata, function(j, item) {
                $fields = $('[name="' + jsondata[j]['field'] + '"], [name="' + jsondata[j]['field'] + '[]"]');
                jsondata[j]['valid'] = 0;

                // Test in each of the elements in the field array if condition is valid
                $fields.each(function() {
                    // If checkbox or radio box the value is read from proprieties
                    if (['checkbox','radio'].indexOf($(this).attr('type')) !== -1)
                    {
                        itemval = $(this).prop('checked') ? $(this).val() : '';
                    }
                    else
                    {
                        itemval = $(this).val();
                    }

                    // Convert to array to allow multiple values in the field (e.g. type=list multiple) and normalize as string
                    if (!(typeof itemval === 'object'))
                    {
                        itemval = JSON.parse('["' + itemval + '"]');
                    }

                    // Test if any of the values of the field exists in showon conditions
                    for (var i in itemval)
                    {
                        if (jsondata[j]['values'].indexOf(itemval[i]) !== -1)
                        {
                            jsondata[j]['valid'] = 1;
                        }
                    }
                });

                // Verify conditions
                // First condition (no operator): current condition must be valid
                if (jsondata[j]['op'] === '')
                {
                    if (jsondata[j]['valid'] === 0)
                    {
                        showfield = false;
                    }
                }
                // Other conditions (if exists)
                else
                {
                    // AND operator: both the previous and current conditions must be valid
                    if (jsondata[j]['op'] === 'AND' && jsondata[j]['valid'] + jsondata[j-1]['valid'] < 2)
                    {
                        showfield = false;
                    }
                    // OR operator: one of the previous and current conditions must be valid
                    if (jsondata[j]['op'] === 'OR'  && jsondata[j]['valid'] + jsondata[j-1]['valid'] > 0)
                    {
                        showfield = true;
                    }
                }
            });

            // If conditions are satisfied show the target field(s), else hide
            (showfield) ? target.slideDown() : target.slideUp();
        },
    }
    /**
     * Объединение объектов
     * @param obj1
     * @param obj2
     * @returns {*}
     */
    this.extend = function ( obj1 , obj2 ) {
        var keys = Object.keys(obj2);
        for (var i = 0; i < keys.length; i += 1) {
            var val = obj2[keys[i]];
            obj1[keys[i]] = ['string', 'number', 'array', 'boolean'].indexOf(typeof val) === -1 ? extend(obj1[keys[i]] || {}, val) : val;
        }
        return obj1;
    }
    /**
     * получить строку между двумя символами
     */
    this.getBetween = function (str,start,finish ) {
        return str.substring(
            str.lastIndexOf(start) + 1,
            str.lastIndexOf(finish)
        )
    };
    /**
     * Serializes - форм || элементов форм не вложенных в тег <form>
     * Serializes form or any other element with jQuery.serialize
     * @param el - <form> OR <div>
     */
    this.serialize = function(el) {
        var serialized = $(el).serialize();
        if (!serialized) // not a form
            serialized = $(el).find('input[name],select[name],textarea[name]').serialize();
        return serialized;
    }
};


/**
 * Предварительная установка загрузки файла - до загрузки самой библиотеки GNZ11
 * var fnCallback = function(a){
 *      // метод в файле
 *      alertTast.Init();
 *      };
 *
 *
 * param fnCallback - function OR trigger event window
 *
 * Jpro.load('/libraries/GNZ11/assets/js/alert_test.js'  , fnCallback );
 *
 */
(function () {
    window.wgnz11 = new GNZ11();
    wgnz11.WGNZ11INIT();

    window.wgnz11.loadJpro();
    document.dispatchEvent(new Event('GNZ11Loaded'))
})();
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*//*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*//*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*//*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/












