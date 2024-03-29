/**
 * IE9 fix console
 */
if(!window.console)var console={trace:function(){},info:function(){},log:function(){},warn:function(){},warn:function(){},error:function(){},time:function(){},timeEnd:function(){}};

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

// console.log('gnz11:->document.createElement >>> ' , document.createElement );

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

    // console.log('gnz11:->Joomla >>> ' , Joomla );

    Joomla.loadOptions();


    Jpro.load = function ( url ,  callback  ) {

        if ( typeof GNZ11 === 'undefined' )
        {
            var opt = Joomla.getOptions( 'Jpro' );
            var data = {
                'u' : url ,
                'c' : callback
            };
            opt.load.push( data );
            Joomla.loadOptions( { 'Jpro' : opt } );
        }
        else
        {
            var gnz11 = new GNZ11();
            gnz11.load[tag]( url ).then( function ( a ) {
                if ( typeof callback !== 'function' )
                {
                    return;
                }
                callback( a )
            } );
        }

    }
})(Joomla , Jpro);

var GNZ11_defSetting = {
    debug: false ,
    Ajax : {
        siteUrl :  window.location.origin + '/' ,
    },
    gnzlib_path_api: '/libraries/GNZ11/Api',
    gnzlib_path_file_corejs: "/libraries/GNZ11/assets/js/gnz11.js",
    gnzlib_path_file_corejs_min: "/libraries/GNZ11/assets/js/gnz11.min.js",
    gnzlib_path_modules: "/libraries/GNZ11/assets/js/modules",
    gnzlib_path_plugins: "/libraries/GNZ11/assets/js/plugins",
    gnzlib_path_sprite : "libraries/GNZ11/assets/img/_sprite1111.svg",
};
/**
 * Храненние SVG - Symbol
 * @type {{}}
 */
window._SpriteCollection = {} ;
/**
 * История Svg елементов которые уже были добавлены
 * @type {*[]}
 * @private
 */
window._SpriteHistory = [];


// TODO - Новое хранение коллекции SVG Sprites
window.__SpriteCollection =  {
    isLoaded : false ,
    load : false ,
    added : [] ,
};



window.GNZ11_isLoad = {
    script: [],
    link: [],
    img: [],
    // TODO------------------
    svg : [] ,
};
window.GNZ11_isLoad_module = [];

/**
 * @constructor
 */
window.GNZ11 = function (options_setting) {
    var $=jQuery ;
    var self = this ;
    self.DEBAG = true ;
    self.__v = "?v=0.5.5"
    /**
     * Хранение конфигурации библиотеки GNZ11
     * @type {{}}
     */
    this.WGNZ11INIT_OPTS = {
        PATH_API : null
    } ;
    this._defaults = {
        PATH_API: 'libraries/GNZ11/Api'
    };
    this.WGNZ11INIT = function () {

        if ( typeof options_setting === 'undefined') options_setting = {} ;
        self.WGNZ11INIT_OPTS = Object.assign({}  , self._defaults , options_setting  );

        //  console.log('gnz11:WGNZ11INIT->this._siteUrl >>> ' , this._siteUrl );





    };
    this._siteUrl = null ;

    this.set_siteUrl = function (Url) {
        this._siteUrl = Url ;
        Joomla.loadOptions({ 'siteUrl' : Url })
    };


    /**
     * Установка настроек для объекта GNZ11
     */
    this.Options = (function () {
        if ( typeof Joomla.getOptions('GNZ11') === 'undefined'){
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

    this.showAllIcon = function (  ){
        var $b = $('body');
        var S = window.__SpriteCollection ;
        var gnzlib_path_sprite = Joomla.getOptions('GNZ11').gnzlib_path_sprite ;
        var url =  Joomla.getOptions('GNZ11').Ajax.siteUrl + gnzlib_path_sprite ;
        // $b.empty();
        var t = new XMLHttpRequest;
        t.open('GET', url, !0);
        t.onload = function () {
            t.readyState === t.DONE && 200 === t.status && function (e) {
                // Загружаем svg обьекты в переменную
                for ( var t = (new DOMParser).parseFromString(e, 'text/xml')
                    .getElementsByTagName('symbol'), n = 0; n < t.length; n++) {
                    var o = t.item(n).cloneNode(!0);
                    var id = o.getAttribute('id');
                    var $a = $(o).children();
                    var html = '<svg style="width: 110px;" viewBox="0 0 100 100"   id="'+id+'"></svg>'
                    $b.append( html  )
                    $b.find( '#'+id ).append( $a  )
                    console.log('gnz11:->o >>> ' , id );
                    console.log('gnz11:->o >>> ' , html );

                    window.__SpriteCollection['#'+id] = o ;
                }
                window.__SpriteCollection.isLoaded = true ;
                // resolve(window.__SpriteCollection);
            }(t.responseText);
        }
        t.send();





    }

    /**
     * Загрузка css, img, js , svg
     *
     *  wgnz11.load.css('')
     *  wgnz11.load.js('')
     *  wgnz11.load.svg('')
     *  DOC :
     *      window.__SpriteCollection - объект коллекции SVG
     *
     * TODO добавить обработку изображений wgnz11.load.img('')
     * @type {{css, img, js}}
     */
    this.load = (function () {
        var selectorSpriteSymbols = '__SpriteSymbols'
        var element ;


        // Function which returns a function: https://davidwalsh.name/javascript-functions
        function _load(tag) {
            return function ( url , media ) {

                // This promise will be used by Promise.all to determine success or failure
                return new Promise(function(resolve, reject) {

                    var __url ;
                    if ( tag ==='script' ||tag ==='link' ||tag ==='script'   ){
                        __url = chckInPreloader( url );
                        if ( __url ) url = __url;
                    }

                   /* var m = url.match(/slick/)
                    if (tag === 'script' && m ){
                        if (url.match(/\.min/)){
                            console.log('gnz11:->url >>> min - ver' , m );
                        }else{
                            console.log('gnz11:->url >>> NO - min - ver' , m );
                        }
                        // console.log('gnz11:->url >>> ' , m );
                        // console.log('gnz11:->url >>> ' , url );
                        // console.log('gnz11:->url >>> ' , tag );
                    }*/



                    // Проверяем в истории
                    if ($.inArray( url , window.GNZ11_isLoad[tag] ) !== -1)  {
                        resolve(url) ;
                        return ;
                    }

                    // Добавить в историю
                    window.GNZ11_isLoad[tag].push(url);

                    /**
                     * Проверка если файл загружался в link preloader
                     * @param url
                     * @returns {boolean|*}
                     */
                    function chckInPreloader(url){
                        var Opt = Joomla.getOptions('GNZ11');

                        // TODO - добавить на стороне сервера по умолчанию Document
                        // TODO - Вызывает ошибку на стороне администратора
                        if ( typeof Opt.Document === "undefined") return false ;

                        // Проверяем если файл из JS модулей библиотеки
                        // то устанавливаем mediaVersion - от номера версии gnz11 lib
                        var m = url.match('libraries/GNZ11/assets/js/modules')
                        if ( m ){
                            return url + '?'+ Opt.mediaVersion
                        }
                        var opt_preload = Opt.Document._preload;

                        if ( typeof opt_preload[url] === "undefined" ) return false ;
                        if ( !opt_preload[url].version.length ) return url ;
                        url += '?'+ opt_preload[url].version
                        return url ;
                    }


                    element = document.createElement(tag);
                    var parent = 'body';
                    var attr = 'src';


                    // Need to set different attributes depending on tag type
                    switch (tag) {

                        case 'script':
                            element.async = true;

                            break;
                        case 'link':
                            if ( typeof media !== "undefined" ){
                                element.media = media ;
                                console.log('gnz11:_load->media >>> ' , url );
                                console.log('gnz11:_load->media >>> ' , media );
                            }
                            element.type = 'text/css';
                            element.rel = 'stylesheet';
                            attr = 'href';
                            parent = 'head';
                            break;
                        case 'style' :
                            // console.log('gnz11:add style tag' , url );
                            element.type = 'text/css';
                            element.appendChild(document.createTextNode(url));

                            break ;
                        case 'svg' :
                            if ( !window.__SpriteCollection.isLoaded ){
                                _loadSvgSprite().then(function (r) {
                                    // console.log( 'GNZ11.load:url' , url )
                                    setTimeout(function (){
                                        setSvg(  url );
                                        resolve(url);
                                    },500)
                                }, function (err) {
                                    console.log(err)
                                });
                            }else {
                                // console.log( 'GNZ11.load:url+' , url )
                                setSvg(  url );
                                resolve(url);
                            }
                            break ;
                        case 'json':
                            var t = new XMLHttpRequest;
                            t.open('GET', url , !0);
                            t.onload = function () {
                                t.readyState === t.DONE && 200 === t.status && function (e) {
                                    resolve({file : url , data : e });
                                }(t.responseText);
                            }
                            t.send();
                            console.log('gnz11:url' , url );

                            break ;
                    }


                    // Important success and error for the promise
                    element.onload = function () {

                        resolve(url);
                    };
                    element.onerror = function () {
                        reject(url);
                    };
                    // Inject into document to kick off loading
                    element[attr] = url;
                    document[parent].appendChild(element);
                });
            };
        }

        /**
         * Загрузка файла спрайта SVG
         * @private
         */
        function _loadSvgSprite(){
            return new Promise(function(resolve, reject) {
                if ( window.__SpriteCollection.isLoaded ) {
                    // console.trace('_loadSvgSprite:trace2');
                    resolve( window.__SpriteCollection );
                    return ;
                }

                if (window.__SpriteCollection.load)  {
                    resolve( window.__SpriteCollection );
                    return;
                }
                window.__SpriteCollection.load = true;

                // Путь к файлу SpriteSymbols
                var gnzlib_path_sprite = Joomla.getOptions('GNZ11').gnzlib_path_sprite ;
                var url =  Joomla.getOptions('GNZ11').Ajax.siteUrl + gnzlib_path_sprite ;

                var $defs = $('<defs />' , { id : '__SpriteSymbols', class : 'gnz11' });
                var $svg = $('<svg />' , {style : 'display: none;' , html : $defs ,});
                $('body').append($svg);

                var t = new XMLHttpRequest;
                t.open('GET', url, !0);
                t.onload = function () {
                    t.readyState === t.DONE && 200 === t.status && function (e) {
                        // Загружаем svg обьекты в переменную
                        for ( var t = (new DOMParser).parseFromString(e, 'text/xml')
                            .getElementsByTagName('symbol'), n = 0; n < t.length; n++) {
                            var o = t.item(n).cloneNode(!0);
                            var id = o.getAttribute('id');
                            window.__SpriteCollection['#'+id] = o ;
                        }
                        window.__SpriteCollection.isLoaded = true ;
                        resolve(window.__SpriteCollection);
                    }(t.responseText);
                }
                t.send();
            });
        }
        /**
         * Установка Svg в элемент хранения
         */
        function setSvg(   spriteId ) {
            // Элемент который хранит HTML SVG
            var $SpriteSymbols = $('#__SpriteSymbols');

            if ( typeof spriteId === 'object'){
                $.each( spriteId , function (i,Id){
                    if ( !window.__SpriteCollection.isLoaded ) {
                        window.__SpriteCollection.added.push( Id )
                    }
                    // Устанавливаем SVG в тело документа
                    __append (Id) ;
                })
                return ;
            }

            if ($.inArray(spriteId, window.GNZ11_isLoad['svg']) !== -1) return ;
            // Устанавливаем SVG в тело документа
            __append (spriteId) ;



            function __append (spriteId){
                if ($.inArray( spriteId , window.GNZ11_isLoad['svg']) !== -1) return ;

                var svgElement = window.__SpriteCollection[spriteId]
                if ( typeof svgElement === 'undefined'){
                    window.__SpriteCollection.added.push(spriteId)
                }
                // console.log( '_loadSvgSprite:svgElement', svgElement )

                $SpriteSymbols.append( svgElement );
                window.GNZ11_isLoad.svg.push(spriteId);
            }
        }
        return {
            style : _load('style'),
            css: _load('link'   ),
            js: _load('script'),
            script: _load('script'),
            svg : _load('svg'),
            initSvg : function (){
                var arr = [] ;
                $('svg use').each(function (i,a) {
                    var id = $(a).attr('xlink:href');
                    if ( !self.ARRAY.inArray( id , arr) ){
                        arr.push(id)
                    }
                });
                if ( !arr.length ) return ;
                self.load.svg(arr).then(function (r){

                },function (err){console.log(err)});
            },
            img: _load('img') ,
            json: _load('json')
        };
    })();

    /**
     * Загрузка GTagManager
     * TODO - доделать передачу GTagManager ID
     */
    this.setGTagManager = function() {
        var t = this.doc.createElement("script");
        t.type = "text/javascript",
            t.innerHTML = "(function (w, d, s, l, i) {w[l] = w[l] || [];w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js',});var f = d.getElementsByTagName(s)[0],j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';j.async = true;j.src ='https://www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j, f);})(window, document, 'script', 'dataLayer', 'GTM-XXXXXXXX');",
            this.doc.getElementsByTagName("head")[0].appendChild(t)
    }

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
        // склонение именительных рядом с числительным: число (typeof = string), корень (не пустой), окончание
        function declOfNum(n, t, o) {
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
     *  ## Joomla Plugins Обработка плагинов  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    /**
     * Получение данных из Joomla.LocalStorage - для плагинов которые наследуют объект GNZ11
     * TODO - добавить возможность для наследия модулями
     * @param key
     * @returns {mixed|*}
     * @constructor
     */
    this.JoomlaStoragePlugin = function ( key ){
        var opt =  Joomla.getOptions( this.__plugin );
        if (typeof key === 'undefined')  return  opt ;
        return  opt[key] ;
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


        //
        // Если модуль еще не был загружен
        if ( typeof Module !== "function" || typeof moduleName !== "function"  ) {

            var moduleUrl = pathModules+'/gnz11.'+moduleName+'.js'+self.__v ;

            /**
             * Проверка на класс
             * @type {void|*|RegExpMatchArray|Promise<Response | undefined>}
             */
            function _testClass(){
                var testClass = moduleName.match(/_class/);
                // console.log(testClass)
                if ( testClass && testClass[0] ){
                    return true ;
                }
                return false ;
            }



            return new Promise(function (resolve, reject) {

                if ($.inArray( Module, window.GNZ11_isLoad_module ) !== -1 ){
                    if (_testClass()){
                        setTimeout(function (){
                            resolve(moduleName);
                        },200)

                        return ;
                    }

                }
                window.GNZ11_isLoad_module.push( Module )


                Promise.all([
                    $this.load.js( moduleUrl )
                ]).then(function (r)
                {

                    if (_testClass()){
                        setTimeout(function (){
                            resolve(moduleName);
                        },200)
                        return ;
                    }

                    // console.log( typeof Module );
                    // console.log( returnModule )
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
                alert('window[Module]')
                resolve(new window[Module]());
            });
        }
    };
    /**
     * Загрузка элементов API
     * @param classApi
     * @param nameApi str Имя API  e.t. NovaPoshta
     * @param options obj ?????
     */
    this.getApi = function ( classApi , nameApi , options ) {
        const _JS_ = '/assets/js' ;
        const Host = Joomla.getOptions('siteUrl') ;
        console.log('gnz11:WGNZ11INIT' , wgnz11.WGNZ11INIT_OPTS )
        var file = Host + wgnz11.WGNZ11INIT_OPTS.PATH_API+'/'+classApi+'/'+nameApi + _JS_ +'/'+nameApi+'.js' ;

        console.log('gnz11:getApi' , file  )

        return new Promise(function (resolve, reject) {
            Promise.all([
                wgnz11.load.js( file ),
            ]).then(function (a) {
                resolve( true );
            },function (err) {
                reject(err);
            })
        })
    }
    /**
     * Загрузка плагинов библиотеки GNZ11
     *
     * @param pluginName    str - Имя плагина
     * @param setting       obj - Объект с конфигурацией плагина
     */
    this.getPlugin = function (pluginName , setting) {
        return new Promise(function (resolve, reject) {
            self.__loadModul[pluginName](setting).then(function (a)
            {
                resolve(a) ;
            },function (err)
            {
                reject(err) ;
            })
        })
    }
    /*
     * Load  module
     *
     * var gnz11 = new gn_z11;
     *
     * gnz11.__loadModul.Noty(param).then(function(a){})
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
            var Host = self.Options.Ajax.siteUrl
            function _init() {
                var Inputmask = new GNZ11_Inputmask();
                if (typeof param !== 'undefined' ){

                    console.log('gnz11:_init->contact-form >>> ' , param );

                    var elSelector = param.element ;
                    return  Inputmask.Inint( elSelector , param );
                }
                return Inputmask ;
            }
            if ( typeof  window.Inputmask === 'undefined' ){
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        wgnz11.load.css(Host+ 'libraries/GNZ11/assets/js/plugins/jQuery/inputmask/inputmask.css'),
                        wgnz11.load.js(Host+ 'libraries/GNZ11/assets/js/plugins/jQuery/inputmask/jquery.mask.min.js'),
                        wgnz11.load.js(Host+ 'libraries/GNZ11/assets/js/plugins/jQuery/inputmask/inputmask.js'),
                    ]).then(function (a) {
                        var res = _init();
                        resolve(res)
                    })
                })
            }else{
                return new Promise(function (resolve, reject) {
                    var res = _init();
                    resolve(res)
                })
            }
        },
        
        Noty :  function (param) {
            //
            var $this = new GNZ11();
            var NotySettingDefault = $this.Options.Noty ;
            var setting = {};
            $.extend(  true , setting ,  NotySettingDefault  , param   );
            console.log('gnz11:Noty->setting >>> ' , setting );



            if ( typeof  Noty === 'undefined' ){
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/noty/noty.css'),
                        $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/noty/themes/metroui.css'),
                        $this.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/noty/themes/mint.css'),
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
            var $ = jQuery
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
    /**
     * Запуск отложенной загрузки ресурсов Jpro
     */
    this.loadJpro = function () {
        var optJpro = Joomla.getOptions('Jpro');
        if (typeof optJpro === 'undefined' || typeof  optJpro.load !== 'object') return ;
        optJpro.load.forEach(function(item, i, arr) {
            setTimeout(function () {

                // console.log('gnz11:parseResult' , parseResult );

                if (typeof item.t === 'undefined' ){
                    var parseResult = wgnz11.parseURL(item.u  );
                    item.t = parseResult.extension;
                }

                var $body = $('body')
                // тип файла JS || CSS
                var type = item.t ;
                // URL Ресурса
                var url = item.u ;
                var media = item.m ;



                /**
                 * Если в параметрах ресурса установлен триггер для загрузки
                 */
                if (typeof item.r !=="undefined" ){
                    var tigger = item.r ;
                    $body.on( tigger , function(){
                        wgnz11.load[type](url , media ).then(function (r){
                            // $body.trigger('__loadLaterCss');
                            console.log('gnz11:item' , item );
                        },function (err){console.log(err)});
                    });

                }else{
                    // обычная загрузка ресурса
                    wgnz11.load[type]( url , media  ).then(function (a) {

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
                            // console.log( event )
                            document.dispatchEvent(event);
                        }else {
                            window[item.c](a);
                        }

                    });
                }



            },100)
        });
    };

    /**
     * Парсим сообщения из ответа APP - и вывод в Noty
     * для переопределения стандартного в метод this.Init добавить :
     *  - Joomla.renderMessages = self.renderMessages
     *  для переопределения за пределами obj
     *  - Joomla.renderMessages = PlgVmshipmentVmsdekCore.renderMessages
     *
     * @param messages - obj - c массивами сообщений от App
     * @param debug
     */
    this.renderMessages = function (messages , debug ) {
        if (typeof debug === "undefined") debug = false ;
        // Типы сообщений Joomla
        var TypesJoomla = ['error', 'message', 'notice', 'warning',];

        self.__loadModul.Noty({}).then(function () {
            var TypesMes, mess, indexTypesJoomla = 0;
            render();

            function render() {
                TypesMes = TypesJoomla[indexTypesJoomla];
                if (!messages.hasOwnProperty(TypesMes) && indexTypesJoomla < TypesJoomla.length - 1) {
                    indexTypesJoomla++;
                    render();
                    return;
                }
                if ( typeof messages[TypesMes] !== 'undefined' &&  messages[TypesMes].length){
                    printNoty(messages[TypesMes]);
                }

            }
            // Собрать из массива сообщений строку
            function printNoty(mess) {
                if (typeof mess === "undefined") return ;
                var _nType,
                    messageWrapper = ''
                ;
                // Add messages to the message box
                for (var i = mess.length - 1; i >= 0; i--) {
                    messageWrapper += mess[i] + "<br>\n";
                }

                switch (TypesMes) {
                    case 'notice':
                        // _nType = 'alert';
                        // _nType = 'success';
                        _nType = 'info';
                        break;
                    case 'warning':
                        _nType = 'warning'
                        break;
                    case 'error':
                        _nType = 'error'
                        break;
                    default :
                        _nType = 'success'
                }
                new window.Noty({
                    type: _nType,
                    text: (!debug?'': TypesMes + ' => ') + messageWrapper,
                    layout: 'bottomRight',
                    timeout: 8000,
                }).show();

                if (indexTypesJoomla < TypesJoomla.length - 1) {
                    indexTypesJoomla++;
                    setTimeout(render, 1000)
                }
            }
        })
    }

    /**
     * Вывод отладочной информации
     * Перед использованием включаем отладку для объекта wgnz11
     *    wgnz11.Options.debug = true
     *    wgnz11.debug(111111111 , 'test' )
     *
     * @param value     - значение для вывода
     * @param namespace - название для консольной группы
     *
     */
    this.debug = function ( value , namespace ) {
        if (!this.Options.debug) return ;
        if (typeof namespace === 'undefined' ){
            console.log( value );
            return;
        }
        console.groupCollapsed(namespace);
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
            // clear_filename : fileNameFromUrl(parser.pathname),
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash ,
            extension : filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
        };
        /*function fileNameFromUrl(url) {
            var matches = url.match(/\/([^\/?#]+)[^\/]*$/);
            if (matches.length > 1) {
                return matches[1];
            }
            return null;
        }*/
    };


    /**
     * Init radio Input btn - yes no
     * @param parenEl - Родительский элемент
     */
    this.checkBoxRadioInit = function  (parenEl){
        if (typeof parenEl === 'undefined' ){
            parenEl = document
        }
        // Turn radios into btn-group
        $(parenEl).find('.radio.btn-group label').addClass('btn')

        var $fieldsetBtnGroup = $(parenEl).find('fieldset.btn-group')
        $fieldsetBtnGroup.each(function() {
            // Handle disabled, prevent clicks on the container, and add disabled style to each button
            if ($(this).prop('disabled')) {
                $(this).css('pointer-events', 'none').off('click');
                $(this).find('.btn').addClass('disabled');
            }
        });
        var $labelNotActive = $(parenEl).find('.btn-group label:not(.active)')
        $labelNotActive.click(function(i,label)
        {
            var $label = $(label);
            var input = $('#' + $label.attr('for'));

            if (!input.prop('checked')) {
                $label.closest('.btn-group').find("label")
                    .removeClass('active btn-success btn-danger btn-primary');
                if (input.val() === '') {
                    $label.addClass('active btn-primary');
                } else if (input.val() === 0) {
                    $label.addClass('active btn-danger');
                } else {
                    $label.addClass('active btn-success');
                }
                input.prop('checked', true);
                input.trigger('change');
            }
        });
        var $inputChecked = $(parenEl).find('.btn-group input[checked=checked]')
        $inputChecked.each(function( i, inputChecked )
        {
            console.log( 'gnz11::' , inputChecked );
            
            if ($( inputChecked ).val() === '') {
                $("label[for=" + $(inputChecked).attr('id') + "]").addClass('active btn-primary');
            } else if ( +$(this).val() === 0 ) {
                $("label[for=" + $(inputChecked).attr('id') + "]").addClass('active btn-danger');
            } else {
                $("label[for=" + $(inputChecked).attr('id') + "]").addClass('active btn-success');
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

    this.Optimizing = {
        /**
         * Проверка полной видимости элемента
         * @param  $element
         * @url https://vk-book.ru/proverit-vidimost-elementa-s-pomoshhyu-jquery/
         */
        checkPosition   : function ($element){
            // координаты дива
            var div_position = $element.offset();
            // отступ сверху
            var div_top = div_position.top;
            // отступ слева
            var div_left = div_position.left;
            // ширина
            var div_width = $element.width();
            // высота
            var div_height = $element.height();

            // проскроллено сверху
            var top_scroll = $(document).scrollTop()  + 200 ;
            // проскроллено слева
            var left_scroll = $(document).scrollLeft();
            // ширина видимой страницы
            var screen_width = $(window).width();
            // высота видимой страницы
            var screen_height = $(window).height();

            // координаты углов видимой области
            var see_x1 = left_scroll;
            var see_x2 = screen_width + left_scroll; // Правый верхний угол
            var see_y1 = top_scroll;
            var see_y2 = screen_height + top_scroll;

            // координаты углов искомого элемента
            // ширина
            var div_x1 = div_left;
            // var div_x2 = div_left + div_height ;
            var div_x2 = div_left + div_width  ;

            // высота
            var div_y1 = div_top;
            // var div_y2 = div_top + div_width;
            var div_y2 = div_top + div_height;

            // проверка - виден див полностью или нет
            if( div_x1 >= see_x1 && div_x2 <= see_x2 && div_y1 >= see_y1 && div_y2 <= see_y2 ){
                // если виден
                return true;
                // $element.css({'background-color': 'green'});
            }else{
                // если не виден
                return false;
                // $element.css({'background-color': 'red'});
            }
        },
        /**
         * Извлечение из тега <Template /> - Разтеплатить єлемент
         * @param templateSelector
         * @param formSelector  - Селектор єлемента для вставки
         * @param repeatedUseTemplate - false - Если нужно удалить тег <template />
         */
        fromTemplate    : function ( templateSelector , formSelector , repeatedUseTemplate  ){
            return new Promise(function ( resolve, reject){
                if ( typeof repeatedUseTemplate === "undefined" ) repeatedUseTemplate = false ;
                var $template  = $( templateSelector ) ;
                if (!$template[0]){
                    console.warn('Tag <template /> selector ("'+templateSelector+'") not found!!!')
                    return ;
                }
                var htmlTemplate = $template.html().trim();
                var TemplateClone = $(htmlTemplate);

                if ( typeof formSelector === 'undefined' ){
                    $template.parent().append(TemplateClone);
                }else{
                    $(formSelector).append(TemplateClone);
                }
                if ( !repeatedUseTemplate ){
                    $template.remove();
                }
                resolve( TemplateClone )
            })



        }
    }

    /**
     *
     */
    this.fromTemplate = function ( templateSelector , formSelector ) {
        alert('fromTemplate')

    }




    /**
     * Обекты ---------------------------------------------------------------------------------------------------
     *
     * ----------------------------------------------------------------------------------------------------------
     */
    this.ARRAY = {
        /**
         * Эквивалент PHP in_array ()
         * @param needle str
         * @param haystack []
         * @returns {boolean}
         */
        inArray : function (needle, haystack){
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] === needle) return true;
            }
            return false;
        }
    };

    this.FILE_SYSTEM = {
        getExtensionInPath : function (path){
            path = path.replace(/\?.+/,'');
            var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
                // (supports `\\` and `/` separators)
                pos = basename.lastIndexOf('.');       // get last position of `.`

            if (basename === '' || pos < 1)            // if file name is empty or ...
                return "";                             //  `.` not found (-1) or comes first (0)

            return basename.slice(pos + 1);            // extract extension ignoring `.`
        }
    }
    /**
     * Обект работы с текстом
     */
    this.TEXT = {
        /**
         * специальное кодирование, требуемое для заголовков сервера
         * @param str
         */
        encodeRFC5987ValueChars : function (str){
            return encodeURIComponent(str).
                // Замечание: хотя RFC3986 резервирует "!", RFC5987 это не делает, так что нам не нужно избегать этого
                replace(/['()]/g, escape). // i.e., %27 %28 %29
                replace(/\*/g, '%2A').
                // Следующее не требуется для кодирования процентов для RFC5987, так что мы можем разрешить немного больше читаемости через провод: |`^
                replace(/%(?:7C|60|5E)/g, unescape);
        },
        /** Javascript and jQuery
         *  Аналог PHP функции implode Объединяет элементы массива в строку
         * @param glue
         * @param arr
         * @url https://javascript.ru/php/implode
         */
        implode : function (glue, arr ){
            return ( ( arr instanceof Array ) ? arr.join ( glue ) : arr );
        },
        /**
         * получить строку между двумя символами
         */
        getBetween : function (str,start,finish ) {
            return str.substring(
                str.lastIndexOf(start) + 1,
                str.lastIndexOf(finish)
            )
        },
        /**
         * Склонение числительных в javascript
         * @param number
         * @param titles
         * @returns {*}
         *
         * @url https://gist.github.com/realmyst/1262561
         */
        declOfNum : function(number, titles) {
            cases = [2, 0, 1, 1, 1, 2];
            return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
        }

    };
    this.DEVICE = {
        isMobile : function (){
            return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase() )
        }
    }
    /**
     * Объект работы с формами
     * @type {{serialize: (function(*=): *), getFormDataToJson: (function(*): {})}}
     */
    this.Form = {
        /**
         * Данные формы в Json
         * @param $form
         * @returns {{}}
         */
        getFormDataToJson : function ( $form ) {
            var unindexed_array = $form.serializeArray();
            var indexed_array = {};

            $.map( unindexed_array , function ( n , i ) {
                var name = n['name'];
                indexed_array[name] = n['value'];
            } );
            return indexed_array;
        } ,
        /**
         * Serializes - форм || элементов форм не вложенных в тег <form>
         * Serializes form or any other element with jQuery.serialize
         * @param el - <form> OR <div>
         */
        /*jslint continue:true*/
        /**
         * Adapted from {@link http://www.bulgaria-web-developers.com/projects/javascript/serialize/}
         * Changes:
         *     Ensures proper URL encoding of name as well as value
         *     Preserves element order
         *     XHTML and JSLint-friendly
         *     Disallows disabled form elements and reset buttons as per HTML4 [successful controls]{@link http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2}
         *         (as used in jQuery). Note: This does not serialize <object>
         *         elements (even those without a declare attribute) or
         *         <input type="file" />, as per jQuery, though it does serialize
         *         the <button>'s (which are potential HTML4 successful controls) unlike jQuery
         * @license MIT/GPL
         */
        serialize  : function ( form ) {
            'use strict';
            var i , j , len , jLen , formElement , q = [];

            function urlencode( str ) {
                // http://kevin.vanzonneveld.net
                // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
                // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
                return encodeURIComponent( str ).replace( /!/g , '%21' ).replace( /'/g , '%27' ).replace( /\(/g , '%28' ).replace( /\)/g , '%29' ).replace( /\*/g , '%2A' ).replace( /%20/g , '+' );
            }

            function addNameValue( name , value ) {
                q.push( urlencode( name ) + '=' + urlencode( value ) );
            }

            if ( !form || !form.nodeName || form.nodeName.toLowerCase() !== 'form' )
            {
                throw 'You must supply a form element';
            }

            for ( i = 0, len = form.elements.length; i < len; i++ )
            {
                formElement = form.elements[i];
                if ( formElement.name === '' || formElement.disabled )
                {
                    continue;
                }



                switch ( formElement.nodeName.toLowerCase() )
                {
                    case 'div' :
                        console.log('gnz11:serialize->formElement >>> ' , formElement );
                         alert('div')
                        break ;
                    case 'input':
                        switch ( formElement.type )
                        {
                            case 'text':
                            case 'hidden':
                            case 'password':
                            case 'button': // Not submitted when submitting form manually, though jQuery does serialize this and it can be an HTML4 successful control
                            case 'submit':
                                addNameValue( formElement.name , formElement.value );
                                break;
                            case 'checkbox':
                            case 'radio':
                                if ( formElement.checked )
                                {
                                    addNameValue( formElement.name , formElement.value );
                                }
                                break;
                            case 'file':
                                // addNameValue(formElement.name, formElement.value); // Will work and part of HTML4 "successful controls", but not used in jQuery
                                break;
                            case 'reset':
                                break;
                        }
                        break;
                    case 'textarea':
                        addNameValue( formElement.name , formElement.value );
                        break;
                    case 'select':
                        switch ( formElement.type )
                        {
                            case 'select-one':
                                addNameValue( formElement.name , formElement.value );
                                break;
                            case 'select-multiple':
                                for ( j = 0, jLen = formElement.options.length; j < jLen; j++ )
                                {
                                    if ( formElement.options[j].selected )
                                    {
                                        addNameValue( formElement.name , formElement.options[j].value );
                                    }
                                }
                                break;
                        }
                        break;
                    case 'button': // jQuery does not submit these, though it is an HTML4 successful control
                        switch ( formElement.type )
                        {
                            case 'reset':
                            case 'submit':
                            case 'button':
                                addNameValue( formElement.name , formElement.value );
                                break;
                        }
                        break;
                }
            }
            return q.join( '&' );
        } ,
        _serialize : function ( el ) {
            var serialized = $( el ).serialize();
            if ( !serialized ) // not a form
            {
                serialized = $( el ).find( 'input[name],select[name],textarea[name]' ).serialize();
            }
            return serialized;
        }
    };

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
    setTimeout(function (){
        // Загрузка спрайта
        // wgnz11.loadSprite();

        // TODO - Рвзобраться с запуском на сайтах без Joomla
        // wgnz11.load.initSvg();

        window.wgnz11.loadJpro();
        document.dispatchEvent(new Event('GNZ11Loaded'));
    },100);


})();
/*===========================================================*//*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/
/*===========================================================*/












