var GNZ11Dropdown = function ( elSelector , Settings ) {
    var self = this;
    /**
     * Отладка --------
     * @type {boolean}
     */
    self.DEBAG = true ;
    var $ = jQuery ;

    this.param = {
        get _classUl(){
            return self._ulClassPrefix+'-ul' ;
        },
        get _classLi(){
            return self._ulClassPrefix+'-ul-li' ;
        }
    }

    /**
     * Префикс класса для elements списка UL
     * @type {string}
     * @private
     */
    this._ulClassPrefix = 'suggestions';
    /*----------------------------------------------------------------*/
    /**
     * Перегрузить Елемент DropDownLink
     * Используется при пересоздании выподающего списка
     * устанавливает приглашение выбрать из списка пр.: "Выберите подходящее отделение"
     * создает событие: "onAfterDestroyDropLink"
     * @constructor
     */
    this.DestroyDropLink = function () {
        var evt ;
        // [name="pickups_drop_link"]
        var $link = $(this.opts.$el);
        // Выберите подходящее отделение
        var txt = this.opts.$placeholder ;
        $link.text(txt);
        evt = new CustomEvent('onAfterDestroyDrop', {  'detail': { elem: $link , name:this.name } });
        document.dispatchEvent(evt);
    };
    /**
     * Очистить  Dropdown List
     */
    this.emptyDropdownList = function () {
        this._hideDropDownHiddenBlock();
        var $ul = this.opts.$dropdownHiddenBlock.find('.'+this._ulClassPrefix+'-ul');
        $ul.empty();
    }
    /**
     * Установить элнменты Dropdown списка
     * @param content
     * @private
     */
    this._AppendToDropdown = function (content) {
        this.DestroyDropLink();
        this.emptyDropdownList();
        var $ul = this.opts.$dropdownHiddenBlock.find( '.'+this._ulClassPrefix+'-ul');
        var li ;
        content.forEach(function( item , i , arr ){
            var htmlLi = item[0]
            var text = htmlLi.text
            li = $('<li />' , {
                class : self._ulClassPrefix+'-ul-li' ,
                html : htmlLi ,
                attr : {
                    text : htmlLi.text
                }
            });
            $ul.append( li ) ;
        });

    }
    /*----------------------------------------------------------------*/
    /**
     * Показать раскрывающийся список
     * @param event
     * @private
     */
    this._showDropDownHiddenBlock = function (event) {
        var self
        event.preventDefault();
        self = event.data.self ;
        var $dropdownHiddenBlock = self.opts.$dropdownHiddenBlock;
        $dropdownHiddenBlock.removeClass('hidden')
        var el = $dropdownHiddenBlock[0] ;
        // if ( el.style.display !== 'none'  ) return ;
        el.style.display = '' ;
    }
    /**
     * Скрыть раскрывающийся список
     * @param event
     * @private
     */
    this._hideDropDownHiddenBlock = function (event) {
        var self , el ;

        if ( typeof event === 'undefined'){
            self = this ;
        }else{
            self = event.data.self ;
        }
        el = self.opts.$dropdownHiddenBlock[0] ;
        //if ( el.style.display === 'none'  ) return ;
        el.style.display = 'none' ;

    }
    /**
     * Показать || скрыть раскрывающийся список
     * @private
     */
    this._toggleDropDownHiddenBlock = function () {
        this.opts.$dropdownHiddenBlock[0].style.display = this.opts.$dropdownHiddenBlock[0].style.display === 'none' ? '' : 'none';
    }
    /**
     * Инициализация элементов списка - UL .
     * Добавить класс для  UL
     * Добавить класс для UL > LI
     * Добавить обработчик события Hover нв элемент LI
     * @private
     */
    this._initUlLiDropElement = function () {

        var self = this ;
        var $ul = this.opts.$dropdownHiddenBlock.find('ul')
        var _classUl = self.param._classUl ;
        var _classLi = self.param._classLi ;
        var idElement = this.opts.idElement ;

        if (idElement) $ul.attr('id' , idElement )

        $ul.addClass( _classUl )
            .on('mousedown.'+this.name, 'li' , {self:self} ,   this._liClick);

        $ul.children().addClass(_classLi);

        /**
         * Hover на елементе выпадающего спискаHover на елементе выпадающего списка
         */
        this._initHoverSuggestion();
    };
    /**
     * Клик на элементе списка
     * @param event
     * @private
     */
    this._liClick = function (event) {
        var self ,  $li , _class , $target , text , evt , evtName;
        self = event.data.self;
        _class = self.param._classLi ;

        $target = $(event.target);
        $li = $target ;
        if (!$target.hasClass(_class)){
            $li = $target.closest('.'+_class )
        }
        var attrText = $li.attr('text');
        text = (attrText.length ? attrText : $li.text());
        if ($li.hasClass('another')) text = null ;

        switch (self.name) {
            case 'DropLink' :
                evt = new CustomEvent('onBeforeSetTextToLink',{'detail':{$elem:$(this),name:self.name}});
                document.dispatchEvent(evt);

                self.opts.$el.text(text);

                break ;
            case 'DropInput':
                evt = new CustomEvent('onBeforeSetTextToInput',{'detail':{$elem:$(this),name:self.name}});
                document.dispatchEvent(evt);
                self.opts.$el.val(text);

                break ;
        }
        self._hideDropDownHiddenBlock()

        /**
         * Скрыть раскрывающийся список
         */
        //self._hideDropDownHiddenBlock()
    }
    /**
     * Hover на елементе выпадающего списка
     * @private
     */
    this._initHoverSuggestion = function () {
        var $hiddenBlock = this.opts.$dropdownHiddenBlock ;
        $hiddenBlock.on('hover.'+this.name , '.'+this._ulClassPrefix+'-ul > li:not(.not-found)' , function () {
            $(this).parent().find('.active').removeClass('active')
            $(this).addClass('active');
        });
    }





    /**
     * Ссылка активирующая Выпадающий список
     */
    var $dropdownLink ;
    /**
     * Блок обвертка
     */
    var $dropBlockWrap ;
    /**
     * Елемент Выпадающего списка LI
     */
    // var $dropElement ;
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
            hovered_elem_name : '[name="pickups_drop_element"]' ,
            link : null ,
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
     * Установка параметров модуля
     * @param setting
     */
    this.setConfig = function (setting) {
        // self.opts = Object.assign({}  , self._defaults , setting  );
        // self.opts =  wgnz11.extend(  setting , self._defaults);
        self.opts =  jQuery.extend( true , self._defaults , setting  );
        if(self.DEBAG) console.log( 'GNZ11DropdownInput module set Config' , self.opts );
    };

    /**
     * Установка списка
     * @param el
     * @constructor
     */
    this.Inint = function ( el  ) {
        if ( typeof elSelector === 'undefined')  el = $(self.opts.element) ;
        if ( typeof self.opts.selectors !== 'undefined'){
            if (typeof self.opts.selectors.link !== 'undefined'){
                // ИНИТ Ссылки со списком
                self.InintDropLink();
                return ;
            }
        }

        if(self.DEBAG) console.log( 'GNZ11Dropdown Inint self.opts=>', self.opts );

        el.each(function ( i , a ) {

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

        /**
         * Главная ссылка DropDownLink
         * ect.: [name=pickups_drop_link]
         * @type {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        var $dropdownLink = $(self.opts.selectors.link);

        /**
         * Главная обвертка элемента Drop-Link-Element
         * Если не передана - то родительский елемент от ссылки  DropDownLink
         * @type {this}
         */
        self.opts.selectors.element_block = self.opts.selectors.element_block || $dropdownLink.parent() ;
        var $parent =  $(self.opts.selectors.element_block) ;

        /**
         * Обвертка в которой искать блок со списком подсказок
         * @type {jQuery|[]}
         */
        var $dropWrap = $parent.find('[name="pickups_drop_block_wrap"]')
        self.opts.selectors.drop_block_wrap = self.opts.selectors.drop_block_wrap||$dropWrap;

        /**
         * Поле поиска для выподающего списка input
         * @type {jQuery|[]}
         */
        var $search_element = $parent.find('[name="pickups_search_element"]');
        if ($search_element[0]){
            // EVT - ввод в поле поиска складов
            $search_element.on('keyup' , self.onKeyUp );
        }

        /**
         * Ссылки для выбора в выпадающем меню ( [name="pickups_drop_element"] )
         * @type {jQuery|[]} <a />
         */
        //var $hoveredElem =  '[name="pickups_drop_element"]'
        //self.opts.selectors.hovered_elem_name=self.opts.selectors.hovered_elem_name||$hoveredElem;


        // Клик по ссылке с выподающем списком
        // $dropdownLink.on('click', self.showDropBlockWrap );

        // EVT - Установка обработчика клик по пункту выподающего меню
        // $(self.opts.selectors.drop_block_wrap).on('click' , self.onClickDropDawnElement );



        if(self.DEBAG) console.log( 'Drop Link element initialized'  );

    };

    /**
     * Установить обработчик Hover элементы спсиска LI>A
     * @constructor
     */
    this.InitHoverElement = function ($hoveredElemName) {
        $hoveredElemName
            .off('hover')
            .on('hover' , function (event) {
                var elem = event.target;
                // if ( self._hovered_element ) self._hovered_element = elem
                // self.toggleHoverClass( elem ) ;
            });
    };
    /**
     * Переключение класса HOVER - на ссылке при наведении
     * @param elem - event.target || jQuery element
     */
    /*this.toggleHoverClass = function (elem) {
        // название класса для выбранной ссылки
        var hoverClassName = self.opts.cssClasses.hover
        $(elem).closest('ul')
            .find('.'+hoverClassName)
            .removeClass(hoverClassName);
        $(elem).addClass(hoverClassName);
    };*/

    /**
     * EVT - Обработка клик по пункту выподающего меню
     * Обработка события
     * @constructor
     */
    this.onClickDropDawnElement = function ( event ) {
        event.preventDefault();
        var onEvt ;
        var text , value ;
        var element =  event.target ;
        // Ссылка из списка подсказок по которой кликнули
        var $link = $(element);
        // Находим главный WRAP
        var $wrap = $link.closest(self.opts.selectors.element_block)
        // Главная ссылка DropDownLink
        var $dropdownLink = $wrap.find(self.opts.selectors.link)



        // клик по полю поиска в выпадающем списке
        if (element.name === 'pickups_search_element') return ;
        if ( $link.hasClass('pickups-select-input-wrap') ) return ;


        // Создать Событие -  Выбор из списка предложений
        onEvt = new CustomEvent('onBeforeSetTextToLink', {'detail': {elem: $link , } });
        document.dispatchEvent(onEvt);



        text = $link.text();
        value= $link.data('value');

        $dropdownLink.text(text);
        $dropdownLink.attr('data-value',text);

        // Создать Событие - Выбор из списка предложений
        onEvt = new CustomEvent('onAfterSetTextToLink', {'detail': {elem: $link , } });
        document.dispatchEvent(onEvt);

        if(self.DEBAG) console.log( 'this.onClickDropDawnElement : $dropdownLink' ,  $dropdownLink );
        if(self.DEBAG) console.log( 'this.onClickDropDawnElement : text => ' ,  text );
        // self.hiddeDropBlockWrap(event);

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

        $parenWrap.find('.pickups-select-dropdown-l > li')
            .each(function (i,element) {
                // Поиск совпадений в строке подсказок
                self._markupSuggestion( element , str )
            });
        if(self.DEBAG) console.log( event.target  );
    }
    /**
     * Поиск совпадений в строке подсказок
     * @param el
     * @param str
     * @private
     */
    this._markupSuggestion = function(el, str) {
        var classMarkup = self.opts.cssClasses.query_value ;
        var et_regex = new RegExp('(' + str + ')','i');
        var text = $(el).text();
        var result = text.replace(et_regex,'<span class="'+classMarkup+'">$1</span>') ;

        // Если совпадение с вводом не найдено - Скрываем поле выбора
        if (result === text ){
            $(el).addClass('hidden')
        }else {
            $(el).removeClass('hidden');
        }
        $(el).children().html( result )
    };

    this._markupSuggestionClear = function() {}
    /**
     * Скрыть выпадающий список
     * @param event
     */
    this.hiddeDropBlockWrap = function(event){
        var $ = jQuery ;
        var closeng = false ;
        var $suggestions ;
        var $elemClick = $(event.target) ;
        var $rootBlock = $elemClick.closest(self.opts.selectors.element_block);
        var target_name = $elemClick.attr('name') ;

        $suggestions = $( self.opts.selectors.suggestions+'.suggestions-active' );

        switch (target_name) {
            case 'pickups_search_element' : // Если клик в поле поиска списка
            case 'pickups_search_element_wrap' :

                break ;
            case 'pickups_drop_element' :
                if ( !$elemClick.hasClass('arrows-evt') ) {
                    closeng = true ;
                }else {
                    $elemClick.removeClass('arrows-evt');
                }
                break ;
            default:
                closeng = true ;

        }
        if ( !closeng ) return ;
        $hoveredElemName = $suggestions.find( self.opts.selectors.hovered_elem_name );
        $hoveredElemName.off('hover') ;
        var $dropBlockWrap = $(self.opts.selectors.drop_block_wrap);

        $dropBlockWrap.addClass('hidden')
        $suggestions.removeClass('suggestions-active');

        // снять -  обработчик событий кнопки стрелок вверх вниз
        $(window).off( 'keydown.hiddeDropBlockWrap'  );
        $(window).off('click.hiddeDropBlockWrap');

    };
    /**
     * Показать выпадающий список
     * Todo заменено выше
     * @param event
     */
    this.showDropBlockWrap = function(event){
        event.preventDefault();

        var $target = $(event.target);
        var $parent = $target.parent();
        /**
         * Обверка выподающего списка
         * @type {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        var $dropBlockWrap = $parent.find( self.opts.selectors.drop_block_wrap );
        /**
         * UL - Список выпадающего меню
         * @type {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        var $suggestions = $parent.find( self.opts.selectors.suggestions );
        /**
         * Массив ссылок в выпадающем списке
         * @type {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        var $hoveredElem = $dropBlockWrap.find(self.opts.selectors.hovered_elem_name)

        $dropBlockWrap.removeClass('hidden');
        $suggestions.addClass('suggestions-active');

        // Установить обработчик Hover элементы спсиска LI>A
        self.InitHoverElement($hoveredElem);


        $(window)
            .off('keydown.hiddeDropBlockWrap')
            .off('click.hiddeDropBlockWrap');

        // Установить обработчик событий кнопки стрелок вверх || вниз || ENTER
        $(window).on( 'keydown.hiddeDropBlockWrap', self.keysUpDownInit );

        setTimeout(function () {
            // Скрыть выпадающий список
            $(window).on('click.hiddeDropBlockWrap', self.hiddeDropBlockWrap)
        },1000)
    };
    /**
     * Обработка кнопки в вверх вниз энтер
     * @param event
     */
    this.keysUpDownInit = function (event) {

        if ([13 , 38, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }
        var $prevLI,
            $next,
            $active,
            $firstElement;
        /**
         * Ul - список выподающих подсказок
         * @type {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        var $listSuggestions = $(self.opts.selectors.suggestions);
        /**
         * Получить активную ссылку в списке подсказок
         * @returns {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        var getActive = function () {
            return $listSuggestions.find('.hover')
        }
        /**
         * Сделать выбранной ссулку li>a в выподающем списке
         * @param $ElementLI
         */
        var addHover = function ($ElementLI) {
            $ElementLI.children()
                .addClass('hover arrows-evt')
                .trigger('click' );
            return;
        }
        /**
         * Скролл к элементу списка если он находиться за приделами списка
         */
        var scroll_LI = function(){
            $active = getActive();
            $active[0].focus();
        }
        /**
         * Поиск предедущего элемента в списке подсказок
         * @param el
         * @returns {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        var prev = function( el , direction ) {
            var $=jQuery ;
            var $prev ;
            if ( typeof direction == 'undefined') direction = 'prev'

            if (direction === 'prev'){
                $prev = $(el).prev();
            }else{
                $prev = $(el).next();
            }
            if ($prev.hasClass('hidden')){
                return  prev($prev , direction ) ;
            }else{
                return $prev ;
            }
        }

        $active = getActive();
        switch (event.which) {
            case 38: // up

                $prevLI = prev($active.parent(), 'prev');
                if (!$prevLI[0]) return;
                addHover( $prevLI ) ;
                $active.removeClass('hover');
                scroll_LI();
                break;
            case 40: // down
                // Если нет выбранного елемента в выпадающем списке - делаем выбранный первый
                if (!$active[0]) {
                    $firstElement = $listSuggestions.first();
                    addHover($firstElement);
                    return;
                }
                $next = prev( $active.parent(), 'next');
                if (!$next[0]) return;
                addHover($next);
                $active.removeClass('hover');
                scroll_LI();
                break;
            case 13:
                $active.trigger('click');
                break ;
        }
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

            console.log($(this))

            var event = new CustomEvent('onBeforeSetTextToInput', {'detail': {elem: $(this) ,} });
            document.dispatchEvent(event);
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


}

var DropLink = function (opt) {
    this.name = 'DropLink' ;
    var self = this ;
    var $ = jQuery ;
    this._defaults = {
        idElement : null ,
        selectors : {
            /**
             * селектор для <a  />
             * к которому привязывается выпадающий список
             */
            link : null ,
            /**
             * Обертка DropInputElement
             */
            parentWrap : null ,
            /**
             * Скрытый блок для раскрывающегося списка
             */
            dropdownHiddenBlock : null ,
        },
        /**
         * Placeholder для <input type="text" />
         */
        placeholder : null ,
        validator : null ,

        // ------------------------------
        /**
         * <input type="text" /> к которому привязывается выпадающий список
         * @returns {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        get $el(){
            var $el = $(this.selectors.link) ;
            if (!$el[0]) {
                alert('options.selectors.link Required option');
                return ;
            }
            return $el;
        },
        get $parentWrap(){
            var selector = this.selectors ;
            var pWrap = $(selector.parentWrap);
            if ( !pWrap[0] ) pWrap = $( selector.link ).parent() ;
            return pWrap
        },
        get $dropdownHiddenBlock() {
            var selector = this.selectors ;
            if (selector.dropdownHiddenBlock) return $(this.$parentWrap).find(selector.dropdownHiddenBlock) ;
            var r = this.$parentWrap.find('ul');
            return  r ;
        },
        get $placeholder(){

            return this.placeholder  ;
        },
    };
    this.opts = $.extend( true , self._defaults , opt  );
    this.Init = function () {
        /**
         * Инициализация элементов списка - UL .
         */
        this._initUlLiDropElement();

        self.setPlaceholder( self.opts.$el ) ;
        // Показать || скрыть раскрывающийся список
        self.opts.$el.on('click' , {self:self} , self._showDropDownHiddenBlock );
        if(self.DEBAG) console.log( '@DropLink-> @Init', self.opts  );
        if(self.DEBAG) console.log( '@DropLink-> @Init $el', self.opts.$el  );
        if(self.DEBAG) console.log( '@Init------------',   );
    };
    /**
     * Установка Placeholder
     * @param $el
     */
    this.setPlaceholder = function ($el) {
        var placeholder = self.opts.placeholder ;
        if (placeholder){
            $el.attr('placeholder' , placeholder )
        }
    }

    /**
     * Установить элнменты Dropdown списка
     * @param content
     * @constructor
     */
    this.AppendToDropdown = function (content) {
       this._AppendToDropdown(content);
       if(self.DEBAG) console.log( '@AppendToDropdown self',  self );
    }

}


var DropInput = function (opt) {
    wgnz11.load.css(['/libraries/GNZ11/assets/js/modules/Dropdown/dropdown_block.css'])
    var self = this ;
    var $ = jQuery ;
    this.name = 'DropInput' ;
    this._defaults = {
        selectors : {
            /**
             * селектор для <input type="text" />
             * к которому привязывается выпадающий список
             */
            input : null ,
            /**
             * Обертка DropInputElement
             */
            parentWrap : null ,
            /**
             * Скрытый блок для раскрывающегося списка
             */
            dropdownHiddenBlock : null ,
        },
        /**
         * Placeholder для <input type="text" />
         */
        placeholder : null ,
        validator : null ,

        // ------------------------------
        /**
         * <input type="text" /> к которому привязывается выпадающий список
         * @returns {JQuery<HTMLElement> | jQuery | HTMLElement}
         */
        get $el(){
            var $el = $(this.selectors.input) ;
            if (!$el[0]) {
                alert('options.selectors.input Required option');
                return ;
            }
            return $el;
        },
        get $parentWrap(){
            var selector = this.selectors ;
            var pWrap = $(selector.parentWrap);
            if ( !pWrap[0] ) pWrap = $( selector.input ).parent() ;
            return pWrap
        },
        get $dropdownHiddenBlock() {
            var selector = this.selectors ;
            if (selector.dropdownHiddenBlock) return $(selector.dropdownHiddenBlock) ;
            var r = this.$parentWrap.find('ul');
            return  r ;
        },

    };

    this.opts = $.extend( true , self._defaults , opt  );

    this.Init = function () {
        /**
         * Инициализация элементов списка - UL .
         */
        this._initUlLiDropElement()

        // Показать || скрыть раскрывающийся список
        self.opts.$el.on('click' , {self:self} , self._showDropDownHiddenBlock );
        self.opts.$el.on('focusout.'+this.name , {self:self} , self._hideDropDownHiddenBlock );

        self.opts.$el.on('focusout' , self.onFocusout );
        self.setPlaceholder( self.opts.$el ) ;
    }

    /**
     * Evt-потеря фокуса на элементе DropInput //
     * @param event
     */
    this.onFocusout = function (event) {

        var $el = $(event.target);
        var evt = new CustomEvent('onAfterDropDownBlur', {  'detail': event });
        document.dispatchEvent(evt);
        console.log('FN-onBlur',event.target)
    }

    /**
     * Установка Placeholder
     * @param $el
     */
    this.setPlaceholder = function ($el) {
        var placeholder = self.opts.placeholder ;
        if (placeholder){
            $el.attr('placeholder' , placeholder )
        }
    }

}

DropLink.prototype = new GNZ11Dropdown();
DropInput.prototype = new GNZ11Dropdown();


























