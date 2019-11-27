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
var GNZ11 = function () {
    var $=jQuery ;
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

    /**
     * получить строку между двумя символами
     */
    this.getBetween = function (str,start,finish ) {
        return str.substring(
            str.lastIndexOf(start) + 1,
            str.lastIndexOf(finish)
        )
    };



    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    /**
     * Загрузка Ajax модуля (GNZ11Ajax)
     * @return {*}
     */
    this.getAjax = function () {
        return this.getModul('Ajax');
/*
        var $this = this ;
        if ( typeof GNZ11Ajax !== 'function' ) {
            return new Promise(function (resolve, reject) {
                Promise.all([
                    $this.load.js( $this.Options.gnzlib_path_modules+'/gnz11.Ajax.js')
                ]).then(function (r) {
                    var i = setInterval(function () {
                        if (typeof GNZ11Ajax === 'function') {
                            clearInterval(i);
                            resolve(new GNZ11Ajax());
                        }
                    }, 1)
                })
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve(new GNZ11Ajax());
            });
        }*/
    };

    this.getModul = function (moduleName , setting) {

        var $this = this ;
        var siteUrl = Joomla.getOptions('siteUrl') ;
        var pathModules =  siteUrl + this.Options.gnzlib_path_modules;
        var Module = 'GNZ11'+moduleName ;
        var returnModule ;
        // console.log( typeof Module );
        if ( typeof Module !== 'function' ) {

            return new Promise(function (resolve, reject) {
                console.log(pathModules +'/gnz11.'+moduleName+'.js');
                Promise.all([
                    $this.load.js( pathModules+'/gnz11.'+moduleName+'.js')
                ]).then(function (r) {
                    console.log( typeof Module );
                    var i = setInterval(function () {
                        if (typeof window[Module] === 'function') {
                            clearInterval(i);
                            returnModule = new window[Module]();
                            if ( typeof setting === 'undefined' ) resolve(returnModule);
                            returnModule.setConfig(setting) ;
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


    this.getSpeechRecognition = function () {
        var $this = this ;
        var siteUrl = Joomla.getOptions('siteUrl') ;


    };

    /*
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

    /*
     * Load  module
     *
     * var gnz11 = new gn_z11;
     *
     * gnz11.__loadModul.Noty().then(function(a){})
     * gnz11.__loadModul.Fancybox().then(function(a){})
     * gnz11.__loadModul.Bootstrap().then(function(a){})
     *
     *
     * @type {{Noty: gn_z11.__loadModul.Noty, Fancybox: gn_z11.__loadModul.Fancybox}}
     * @private
     */
    this.__loadModul = {

        Noty :  function (param) {
            //
            var $this = new GNZ11();
            var NotySettingDefault = $this.Options.Noty ;
            var setting = {};
            $.extend(  true , setting ,  NotySettingDefault  , param   );

            console.log( setting )

            if ( typeof  Noty === 'undefined' ){
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        $this.load.css('/libraries/zaz/Core/js/assets/lib/noty/noty.css'),
                        $this.load.css('/libraries/zaz/Core/js/assets/lib/noty/themes/metroui.css'),
                        $this.load.js('/libraries/zaz/Core/js/assets/lib/noty/noty.js'),
                    ]).then(function (a) {
                        var i = setInterval(function () {
                            if (typeof  Noty === 'function'){
                                clearInterval(i);
                                console.log( 'Noty - Loaded')
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

            if ( typeof $().emulateTransitionEnd == 'function' ){
                return new Promise(function (resolve, reject) {
                    resolve( true );
                })
            }else{
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        zazLA.js('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'),
                    ]).then(function (a) {
                        resolve( true );
                    })
                })
            }
        },
        Fancybox : function () {
            var $this = new GNZ11() ;
            if (  typeof $.fancyboxqqq === 'undefined' ) {
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        $this.load.css('https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css'),
                        $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/fancybox/thems/protect.css'),
                        $this.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/fancybox/jquery.fancybox.js'),
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


                gnz11.load[item.t](item.u).then(function (a) {
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
    gnz11 = new GNZ11();
    gnz11.loadJpro();
    document.dispatchEvent(new Event('GNZ11Loaded'))
})();




















