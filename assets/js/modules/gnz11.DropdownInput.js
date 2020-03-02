var GNZ11DropdownInput = function ( elSelector , Settings ) {
    var $ = jQuery ;
    var self = this;

    /**
     * Отладка --------
     * @type {boolean}
     */
    self.DEBAG = true ;

    /**
     * Родительский блок DeopElement
     */
    var $ElementBlock ;
    /**
     * Ссылка активирующая Выпадающий список
     */
    var $dropdownLink ;
    /**
     * Блок обвертка
     */
    var $dropBlockWrap ;
    /**
     * Елемент Выпадающего списка
     */
    var $dropElement ;
    /**
     * Имя элеента с Hover
     */
    var $hoveredElemName ;
    /**
     * input - на котором создать список
     */
    var $dropdownInputElement ;
    /**
     * Wrap - елемента
     */
    var $dropdownElementParent ;
    /**
     * Одиночная подсказака для списка
     */
    var $dropdownElementSign ;
    /**
     * Предложения список Ul - елемент
     */
    var $dropdownElementSuggestions ;

    this._defaults = {
        selectors: {
            // link_text : null ,
            // обвертка в которой искать блок со списком подсказок
            // drop_block_wrap: '[name="pickups_drop_block_wrap"]',

            /*block: null,
            element_block: null,
            drop_block: null,
            drop_block_wrap: null,
            drop_element: null,
            link: null,
            input: null,
            search_element: null,
            search_element_wrap: null,
            drop_element_not_found: null,
            hovered_elem_name: null,*/
        },
        suggestions : 'ul.suggestions' ,
        // Посказка для списка
        sign : true ,
        not_found : 'Город не найден.<br>Проверьте написание или введите ближайший к вам!',
        cssClasses:{
            query_value: 'queriedValue',
            hover : 'hover',
        },
        onChange : function () {} ,
        onKeyPress : function () {} ,
        // EVT : Обработка события Клик по одиночной подсказке
        onSignEvtClick : function () {}
    } ;
    /**
     * Элемент под Hover
     */
    this._hovered_element =  null ;
    /**
     * Установка списка
     * @param el
     * @constructor
     */
    this.Inint = function ( el  ) {



        if ( typeof elSelector === 'undefined')  var el = $(self.opts.element) ;
        if(self.DEBAG) console.log( 'GNZ11Dropdown Inint self.opts=>', self.opts );



        el.each(function ( i , a ) {
           if ( typeof self.opts.selectors !== 'undefined'){
               if (typeof self.opts.selectors.link !== 'undefined'){
                   self.InintDropLink();
                   return ;
               }

               // $dropdownInputElement = $(self.opts.selectors) ;
           }
           if ($(a).hasClass('dropdown-link'))
           {
               $dropdownInputElement = $(a) ;
               $dropdownElementParent = $dropdownInputElement.parent();
           }
           else{
               switch ($(a).tagName) {
                   case 'A':
                       $dropdownInputElement = $(a) ;
                       break ;
                   case 'INPUT':
                       $dropdownInputElement = $(a) ;
                       break ;
                   default :
                       $dropdownInputElement = $(a).find('input');
               }
               $dropdownElementParent = $dropdownInputElement.parent();
           }

            self.initSuggestions();

            if (self.opts.sign){
                self.initSign() ;
            }

        });
    };
    /**
     * Drop-Link-Element
     * @constructor
     */
    this.InintDropLink = function () {
        $ElementBlock = $(self.opts.selectors.element_block);
        $dropdownLink = $(self.opts.selectors.link);
        $dropBlockWrap = $(self.opts.selectors.drop_block_wrap);
        $dropElement = $(self.opts.selectors.drop_element);

        // Обработка события клик по пункту выподающего меню
        self.InitDropElement();
        $dropdownLink.on('click', self.showDropBlockWrap );

        // EVT - ввод в поле поиска складов
        $('[name="pickups_search_element"]').on('keyup' , self.onKeyUp )
        $('[name="suggest_locality"]').on('keyup' , self.onKeyUp )


        if(self.DEBAG) console.log( 'Drop Link element initialized'  );

    };
    /**
     * Обнулить Елемент DropDown
     * @constructor
     */
    this.DestroyDropLink = function () {
        $dropdownLink.text(self.opts.selectors.link_text);
        var event = new CustomEvent('onAfterDestroyDropLink', {  'detail': { elem: $dropdownLink , } });
        document.dispatchEvent(event);
        // self.UnHoverElement();
        // self.hiddeDropBlockWrap();
    }
    /**
     * Установить обработчик Hover элементы спсиска
     * @constructor
     */
    this.InitHoverElement = function () {
        var  oldEl ;
        $hoveredElemName.on('hover' , function (event) {
            var elem = event.target;
            if ( self._hovered_element ) self._hovered_element = elem
            $(this).closest('ul')
                .find('.'+self.opts.cssClasses.hover)
                .removeClass(self.opts.cssClasses.hover)

            $(this).addClass(self.opts.cssClasses.hover);
        });
    };
    /**
     * Снять обработчик Hover с пунтов списка
     * @constructor
     */
    this.UnHoverElement = function () {
        $hoveredElemName.off('hover') ;
    }
    /**
     * Обработка события клик по пункту выподающего меню
     * @constructor
     */
    this.InitDropElement = function () {
        $dropBlockWrap.on('click' , $dropElement ,  function (event) {
            event.preventDefault();
            var element =  event.target ;
            if (element.name === 'pickups_search_element') return ;
            if ( $(element).hasClass('pickups-select-input-wrap') ) return ;

            var $link = $(element);

            // Создать Событие - Выбор из списка предложений
            var newEvent = new CustomEvent('onBeforeSetTextToLink', {'detail': {elem: $link , } });
            document.dispatchEvent(newEvent);


            var text = $link.text();
            var value = $link.data('value');
            $dropdownLink.text(text);
            $dropdownLink.attr('data-value',text);

            // Создать Событие - Выбор из списка предложений
            var newEvent = new CustomEvent('onAfterSetTextToLink', {'detail': {elem: $link , } });
            document.dispatchEvent(newEvent);


            if(self.DEBAG) console.log( 'this.InitDropElement : $dropdownLink' ,  $dropdownLink );
            if(self.DEBAG) console.log( 'this.InitDropElement : text => ' ,  text );

            self.hiddeDropBlockWrap();
        });
        function addingAttr($link){
           console.log($link)
        }

    }
    /**
     * EVT - Handler оработчик события - ввод в поле поиска выпадающего списка
     * @param event
     */
    this.onKeyUp = function (event) {
        var $target = $(event.target) ;

        var str = $target.val();

        // получить обвертку в которой Искать блок со списком подсказок
        // var $parenWrap = $target.closest('.pickups-select-suggest-wrap');
        var $parenWrap = $target.closest(self.opts.selectors.drop_block_wrap);



        if(self.DEBAG) console.log( '$parenWrap-->', $parenWrap );

        if(self.DEBAG) console.log( str );
        if(self.DEBAG) console.log( self.opts.selectors.drop_block_wrap );
        if(self.DEBAG) console.log( $target );
        if(self.DEBAG) console.log( $parenWrap );


        $parenWrap.find('.pickups-select-dropdown-l > li').removeClass('hidden');
        $parenWrap.find('.pickups-select-dropdown-l > li').each(function (i,element) {
            self._markupSuggestion( element , str )
        })
        if(self.DEBAG) console.log( event.target  );
    }
    /**
     * Поиск совпадений в строке подсказок
     * @param el
     * @param str
     * @private
     */
    this._markupSuggestion = function(el, str) {
        var et_regex = new RegExp('(' + str + ')','i');
        var text = $(el).text();
        var result = text.replace(et_regex, '<span class="' + self.opts.cssClasses.query_value + '">$1</span>') ;

        // Если совпадение с вводом не найдено - Скрываем поле выбора
        if (result === text ){
            $(el).addClass('hidden')
        }else {

        }


        $(el).children().html( result )

    };

    this._markupSuggestionClear = function() {}

    /**
     * Скрыть выпадающий список
     * @param event
     */
    this.hiddeDropBlockWrap = function(event){

        $dropBlockWrap.addClass('hidden')
        $(window).off('click.hiddeDropBlockWrap');
        self.UnHoverElement();
    };
    /**
     * Показать выпадающий список
     * @param event
     */
    this.showDropBlockWrap = function(event){
        event.preventDefault();
        $dropBlockWrap.removeClass('hidden')

        $hoveredElemName = $('[name="'+self.opts.selectors.hovered_elem_name+'"]');
        self.InitHoverElement();

        setTimeout(function () {
            // Скрыть выпадающий список
            $(window).on('click.hiddeDropBlockWrap', self.hiddeDropBlockWrap)
        },1000)
    }

    /**
     * Добавить оработчики событий для списка подсказок
     */
    this.addEvtSuggestions = function () {
        $dropdownElementParent.on("mousedown" , '.suggestion-i' , function () {
            // клик по строке -  Введите другой город...
            if ( $(this).is(':last-child') && $(this).hasClass('another') ){
                $dropdownInputElement.val('');
                $dropdownInputElement.focus();
                return ;
            }
            $text = $(this).attr('text');
            $dropdownInputElement.val( $text );
            // EVT - onBeforeSetTextToInput
            var event = new CustomEvent('onBeforeSetTextToInput', {'detail': {elem: $(this) ,} });
            document.dispatchEvent(event)

        });
    }

    /**
     * init списка подсказок
     */
    this.initSuggestions = function () {

        $dropdownElementSuggestions = $dropdownElementParent.find( self.opts.suggestions );


        if ( !$dropdownElementSuggestions[0] ) self.addSuggestions();
        // Добавить оработчики событий для списка подсказок
        self.addEvtSuggestions();
    };
    /**
     * Создание списка подсказок
     */
    this.addSuggestions = function () {}
    /**
     * Установка списка подсказок
     * @param data - массив объектов с атребутами элемента подсказки
     */
    this.renderSuggestions = function( data  ){
        if (typeof notNew === 'undefined') notNew = false ;
        var $li  ;
        $dropdownElementSuggestions.empty();
        if(self.DEBAG) console.log( 'renderSuggestions (Данные для списка подсказок)' , data );

        if (!data.length) {
            var SuggestionData={};
            SuggestionData.class = 'suggestion-i not-found' ;
            SuggestionData.html ='Город не найден.<br>Проверьте написание или введите ближайший к вам!';
            $li = $('<li />' , SuggestionData );
            $dropdownElementSuggestions.append($li)
            return ;
        };


        $.each(data,function (i, SuggestionData ) {
            SuggestionData.class = 'suggestion-i' ;
            $li = $('<li />' , SuggestionData );
            $dropdownElementSuggestions.append($li);
            if(self.DEBAG) console.log( 'Добавлено поле в список подсказок ', SuggestionData );
        })
        $dropdownElementSuggestions.parent().css("display" , "" )




        // console.log( data )
        // console.log( $dropdownElementSuggestions )
    };
    /**
     * Init одиночной посказки под списком
     *
     */
    this.initSign = function(){
        $dropdownElementSign = $dropdownInputElement.parent().next('.f-i-sign');
        if ( !$dropdownElementSign[0] ) self.addSign()
        $dropdownElementSign.on('click' , { evt : event } , self.SignEvtClick  )
        if(self.DEBAG) console.log( 'INIT - single solitude (инициализация одиночной подсказки)' );
    };
    /**
     * EVT - клик по одоночной подсказки
     * @constructor
     */
    this.SignEvtClick = function (event) {
        var text ;
        var li ;
        var $my_a = $dropdownElementSign.find('a');
        event.preventDefault() ;

        text = $my_a.text();


        // Список подказок у dropDawn елемента
        $dropdownElementSuggestions.children().removeClass('active');

        li = $dropdownElementSuggestions.find('[text="'+text+'"]').addClass('active');
        $dropdownInputElement.val(text);
        $dropdownInputElement.trigger('change')
        console.log( $dropdownInputElement )
        self.opts.onSignEvtClick( text , li );

        console.log(this)

        // EVT -
        var cEvt = new CustomEvent(
            'onBeforeSetTextToInput',
            {
                'detail':{ elem: $my_a , }
            });
        document.dispatchEvent(cEvt)

        var _cdata = {
            'Елмент одиночной подсказки' : $dropdownElementSign ,
            'Список подказок у dropDawn елемента' : $dropdownElementSuggestions ,
            'dropDawn елемент' : $dropdownInputElement ,
            'CustomEvent': 'onBeforeSetTextToInput'
        };
        if(self.DEBAG) console.log( 'EVT - клик по одоночной подсказки' , _cdata );

    }
    /**
     * Создание одоночной подсказки для списка
     */
    this.addSign = function () {}


    /**
     * Установка параметров модуля
     * @param setting
     */
    this.setConfig = function (setting) {
        self.opts = Object.assign({}  , self._defaults , setting  );
        if(self.DEBAG) console.log( 'GNZ11DropdownInput module set Config' , self.opts );
    };

}