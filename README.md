# GNZ11
<!-- ## Table of Contents -->

## Instal : 
1. Joomla : https://github.com/gartes/GNZ11/archive/master.zip
 
## Содержание
 
-----------------------------------  


1. [Javascript and jQuery.](#JavascriptjQuery)
    + [Text - текстовые операции в JS.](#JavascriptjQueryText)
    + [Отложенная загрузка ресурсов из js.](#JavascriptjQueryLoad)
 
2. [\GNZ11\Document\Text  текстовые операции .](https://github.com/gartes/GNZ11/blob/master/Document/Text.md)
   
3. [Плагины]()
    + [GNZ11 Fancybox](https://github.com/gartes/GNZ11/blob/master/assets/js/plugins/jQuery/fancybox/README.md#gnz11-fancybox) 
    + [Noty Сообщения.](#notyСообщения)

4. [Модули.](#модули)<!-- @IGNORE PREVIOUS: link -->
    + [Ajax](#ajax)<!-- @IGNORE PREVIOUS: link -->
    + [Fancybox](#Fancybox)<!-- @IGNORE PREVIOUS: link -->
    + [bxSlider.](#bxSlider)
    + [Noty Сообщения](#notyСообщения)<!-- @IGNORE PREVIOUS: link -->
    + [Mini Menu.](#miniMenu)
    + [Storage Class](#storage-class-)<!-- @IGNORE PREVIOUS: anchor,link --> (Локальное хранилище браузера).
5. [Joomla](Joomla)
6. [Core](Core)
    + [Backup](Core\Backup)
    + [Joomla\com_jshopping](Core\Backup\Joomla\com_jshopping)<!-- @IGNORE PREVIOUS: link -->
7. [Document](https://github.com/gartes/GNZ11/blob/master/Document/DOCUMENT-README.md) 

[Содержание](#top)
 ***
**************************************************
## <a name="Core"></a> Core
### <a name="Core\Backup"></a> Backup
INIT :
````php
$options = [
    'component' => 'jshopping',
    'backup_type'=>'sql',           // Def sql
];
try
{
    $JoomlaBackup = \GNZ11\Core\Backup\Joomla::instance($options);
}
catch ( Exception $e)
{
	echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
	echo'<pre>';print_r( $e );echo'</pre>'.__FILE__.' '.__LINE__;
	die(__FILE__ .' '. __LINE__ );
}
```` 

#### <a name="Core\Backup\Joomla\com_jshopping"></a> Joomla\com_jshopping
Backup DB For Joomla Component Jshopping
## <a name="Joomla"></a> Joomla
### <a name="Joomla-plugins"></a> Взаимодействие с плагинами Joomla

#### Передача параметров плагином на front-end
Загрузка данных плагином
```php
public function setJsData (){
    $pluginName = 'country_filter' ;
    $JsData['siteUrl'] = \Joomla\CMS\Uri\Uri::root();
    \GNZ11\Document\Options::addPluginOptions(  $pluginName , $JsData );
}
```
Получение данных в Javascript
```javascript
var juri = wgnz11.JoomlaStoragePlugin( 'siteUrl' ) ;
```
******
## <a name="JavascriptjQuery"></a> Javascript and jQuery
### <a name="JavascriptjQueryText"></a>Text - текстовые операции в JS

+ implode - Объединяет элементы массива в строку
```javascript
var sting = wgnz11.TEXT.implode(',' , arr )
```
###  <a name="JavascriptjQueryLoad"></a>Отложенная загрузка ресурсов из js ( после загрузки DOM )
+ [Simple application](#JavascriptjQuerySimpleLoad)<!-- @IGNORE PREVIOUS: anchor -->
1.  Simple application
`javascript`
```javascript
wgnz11.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/inputmask.css');
```
Для CSS файлов вторым параметром можно передать атрибут media (к примеру для размера устройств)
```javascript
wgnz11.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/inputmask.css' , 'only screen and (max-width:480px)' );
```
```javascript
wgnz11.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/jquery.mask.min.js');
```
Если для javascript файлов нужен конкретный CallBack после загрузки его можно получить как Promise : 
```javascript
wgnz11.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/jquery.mask.min.js').then(function (r){
    alert('Файл ' + r + ' загружен');            
},function (err){
    // обработка ошибок загрузки файла
    console.log(err)
});
```
****************************
`PHP`
```php
<?php
/**
* Загрузка ядра JS !!!!
*/
try
{
    JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );
    $GNZ11_js =  \GNZ11\Core\Js::instance();
}
catch( Exception $e )
{
    if( !\Joomla\CMS\Filesystem\Folder::exists( $this->patchGnz11 ) && $this->app->isClient('administrator') )
    {
        $this->app->enqueueMessage('The GNZ11 library must be installed' , 'error');
    }#END IF
}
?>
```
```php
/**
* Добавить в отложенную загрузку файлы ресурсов ( CSS or JS )
* @param $Assets   string Url - ресурса
* @param $Callback string|null Callback после загрузки ( для JS файлов )
* @param bool $Trigger string  Trigger - для ожидания загрузки
*/
\GNZ11\Core\Js::addJproLoad(\Joomla\CMS\Uri\Uri::root().'assets/file.core.js' ,   false ,   false );

//@depecated  
$doc = \Joomla\CMS\Factory::getDocument();
$Jpro = $doc->getScriptOptions('Jpro') ;
$Jpro['load'][] = [
    'u' => '/libraries/GNZ11/assets/js/alert_test.js' , // Путь к файлу
    't' => 'js' ,                                       // Тип загружаемого ресурса
    'c' => 'testCallback' ,                             // метод после завершения загрузки
];
$doc->addScriptOptions('Jpro' , $Jpro ) ;
```


*********************************************************************************

## События GNZ11
**GNZ11Loaded** - Библиотека загружена и готова к работе
```javascript
/*
* USE : 
*/
document.addEventListener('GNZ11Loaded', function () {
    wgnz11.load.js('').then(function () {})
} );
```
***



### Загрузка плагинов
```javascript
wgnz11.getPlugin('Inputmask' , {} );
```
Список доступных плагинов:
* Inputmask

## Плагины
###  Inputmask (маски для тестовых полей)
Загрузка
```javascript
wgnz11.getPlugin('Inputmask' , Settings );
```
Параметры :
```javascript
var Settings = {
    //  Шаблон маски поля
    // Can be '+38(000)000-00-00'   
    mask  : '+38(000)000-00-00' ,

    // Can be true , false
    // Создавать placeholder из маски поля
    placeholder :   true ,

    // Используется для масок телефонов 
    // предназначен для загрузки иконок мобильных операторов
    // Can be 'UA'
    country :   'UA',

} 
```
***
 
 [comment]: <> (----------------------------------------------------------)
   ## Модули <a name="модули"></a>
   * [Ajax.](#ajax)
   * [Fancybox](Fancybox)
     
   * [Mini Menu.](#miniMenu)

 [comment]: <> (* []&#40;#&#41;)
 ***
 [comment]: <> (----------------------------------------------------------)
 ***
 [Содержание](#top)


 ***
   ### Ajax <a name="ajax"></a>
```javascript
/*
AjaxDefaul для плагина
*/
this.AjaxDefaultData = {
    group : this.__group,
    plugin : this.__plugin ,
    option : 'com_ajax' ,
    format : 'json' ,
    task : null ,
};


wgnz11.getModul("Ajax").then(function (Ajax) {
    var DATA = {
        param1 : 'test1',
        param2 : 'test2',
    }
    var requestData = $.extend(true, self.AjaxDefaultData, DATA );
    // Не обрабатывать сообщения
    Ajax.ReturnRespond = true ;
    // Отправить запрос 
    Ajax.send(requestData).then(function (r) {
        console.log(r)
    },function(err) {
        console.error(err)
    })
});
```
   [Содержание](#top)
   ***

   ### Fancybox <a name="Fancybox"></a>
fancybox, вероятно, самый популярный в мире скрипт лайтбокса.
```javascript
var html = $('#npw-map-wrapper');
wgnz11.__loadModul.Fancybox().then(function (Modal) {
   Modal.open(html, {
       // Класс основного элемента 
       baseClass: "gjContactPhones",
       // полностью отключить сенсорные жесты default : true
       touch: false, 				 

      // Эффект перехода между слайдами false - disable
      // "fade" "slide" "circular" "tube" "zoom-in-out" "rotate"
      transitionEffect: "slide",


      /**
       * Events
       */
      // После инициализации 
      onInit: function (instance) {
         // время смены слайда ms.
         var duration = 0;
         // Переход к выбранному элементу галереи
         if (typeof indexImgGoTo !== "undefined" && indexImgGoTo) {
            instance.jumpTo(indexImgGoTo, duration);
         }
      },
      // Перед началом анимации открытия 
      beforeShow: function (instance, current) { 
          
      },
      // Когда контент загружен и анимирован
      afterShow: function (instance, current) {
         Modal.setTimeOut(8000); // Окно будет закрыто через 8 секунд 
      },
      // Прежде чем экземпляр пытается закрыть. Верните false, чтобы отменить закрытие.
      beforeClose: function () {
      },
      // После того, как экземпляр был закрыт
      afterClose: function () {
      },
   });
});
```

Параметры :
* baseClass - Класс основного элемента
* touch  (смавхивание)
 ```javascript
// Set `touch: false` to disable panning/swiping
touch: {
    vertical: true , // Разрешить перетаскивать содержимое по вертикали
     momentum : true // Продолжайте движение после отпускания мыши / касания при панорамировании
}

/**
 * Запретить скрол страницы при открытом модальном окне
 */
beforeShow: function(){
    $("body").css({'overflow':'hidden'});
    $('body').css('position','fixed');
},
afterClose: function(){
    $("body").css({'overflow-y':'visible'});
    $('body').css('position','initial');
}, 
/*******************************************************/  

// Пример програмного создания галереи
this.onClickGalleryContainer = function (){
    var indexJumpTo = 0 ;
    var durationJumpTo = 500 ;
    var $imgCollection = $('ul.gallery-thumbnails img')

    var _srcArr = [];

    $imgCollection.each(function(i,a){
        // Находим Активный Слайд
        var $parentLi = $(a).closest('li.gallery-thumbnails__item')
        if ( $parentLi.hasClass('gallery-thumbnails__item--active') ) indexJumpTo = i ;
        var o = {
            // Основное изображение
            src : $(a).data('popup-src'),
            opts : {
                // Подпись
                caption : '',
                // Превью
                thumb : $(a).attr('src'),
            },
        };
        _srcArr.push(o);
    });

    self.__loadModul.Fancybox().then(function (Modal) {
        Modal.open( _srcArr , {
            afterShow : function( instance, current ) {
                // Если активное не первое - прыгаем
                if ( indexJumpTo){
                    instance.jumpTo( indexJumpTo, durationJumpTo );
                    indexJumpTo = false ;
                }
            }
        })
    });


}


```
  [Содержание](#top)
   ***

 
 ###### bxSlider <a name="bxSlider"></a> (2021-12-21, 17:36)
 ```javascript
 Promise.all([
    wgnz11.load.css('/libraries/GNZ11/assets/js/modules/Bxslider/4.2.15/jquery.bxslider.min.css'),
    /**
     * TODO При  использовании локальной версии - плохо работает драг
     */
    // wgnz11.load.js('/libraries/GNZ11/assets/js/modules/Bxslider/4.2.15/jquery.bxslider.min.js'),
    wgnz11.load.js('https://cdnjs.cloudflare.com/ajax/libs/bxslider/4.2.15/jquery.bxslider.min.js'),
]).then(function (r) {
    
    $('.scrollbar__inner').bxSlider({
        /**
         * @see https://bxslider.com/options/
         */
        
        /**
         * ----------------------------
         * + General -->> START
         * ----------------------------
         */
        /**
         * + General
         * Тип перехода между слайдами
         * 'horizontal', 'vertical', 'fade'
         * default : 'horizontal'
         */
        mode: (window.outerWidth <= 1024 ? 'horizontal' : 'vertical' ),
        /**
         * + General
         * Продолжительность перехода между слайдами (в мс)
         * integer
         * default : 500
         */
        // speed: 500,
        /**
         * + General
         * Поле между слайдами
         * integer
         * default : 0
         */
        slideMargin: 0,
        /**
         * + General
         * Начать слайдер на случайном слайде
         * boolean
         * default : false
         */
        // randomStart: false,
        /**
         * + General
         * Элемент для использования в качестве слайдов (например, "div.slide").
         * Примечание: по умолчанию bxSlider будет использовать всех непосредственных
         * дочерних элементов элемента слайдера.
         * jQuery selector
         * default : ''
         */
        //slideSelector: '',
        /**
         * + General
         * Если true, бесконечный слайдер .
         * boolean
         * default : true
         */
        infiniteLoop: false,
        /**
         * + General
         * Если true, элементы управления «Prev» и «Next» получат отключенный класс, когда слайд является
         * первым или последним.
         * Примечание. Используется только при infiniteLoop: false.
         * boolean
         * default : false
         */
        // hideControlOnEnd : false ,
        /**
         * + General
         * Тип «easing» для использования во время переходов.
         * При использовании переходов CSS включите значение для свойства transition-time-function.
         * Если переходы CSS не используются, вы можете включить plugins/jquery.easing.1.3.js для многих параметров.
         * См. http://gsgd.co.uk/sandbox/jquery/easing/ для получения дополнительной информации.
         *
         *  if using CSS: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(n,n,n,n)'.
         *  If not using CSS: 'swing', 'linear' (see the above file for more options)
         * default : null
         */
        // easing : null ,
        /**
         * + General
         * Включите подписи к изображениям.
         * Подписи являются производными от атрибута title изображения.
         * boolean
         * default : false
         */
        // captions : false ,
        /**
         * + General
         * (Бегущая строка) Используйте ползунок в режиме тикера (аналогично ленте новостей)
         * boolean
         * default : false
         */
        // ticker : false ,
        /**
         * + General
         * Тикер приостанавливается при наведении курсора мыши на ползунок.
         * Примечание: эта функция НЕ работает при использовании переходов CSS!
         * boolean
         * default : false
         */
        // tickerHover : false ,
        /**
         * + General
         * Динамически регулируйте высоту слайдера в зависимости от высоты каждого слайда
         * boolean
         * default : false
         */
        // adaptiveHeight : false ,
        /**
         * + General
         * Продолжительность смены высоты слайда (в мс).
         * Примечание: используется только если adaptiveHeight: true
         * integer
         * default : 500
         */
        // adaptiveHeightSpeed : 500 ,
        /**
         * + General
         * Если какие-либо слайды содержат видео, установите значение true.
         * Также включите плагины / jquery.fitvids.js
         * См. Http://fitvidsjs.com/ для получения дополнительной информации.
         * boolean
         * default : false
         */
        // video : false ,
        /**
         * + General
         * Включите или отключите автоматическое изменение размера слайдера.
         * Полезно, если вам нужно использовать слайдеры фиксированной ширины.
         * boolean
         * default : true
         */
        responsive : false ,
        /**
         * + General
         * Если true, переходы CSS будут использоваться для горизонтальной и вертикальной анимации слайдов
         * (при этом используется собственное аппаратное ускорение).
         * Если false, будет использоваться jQuery animate ().
         * boolean
         * default : true
         */
        // useCSS : true ,
        /**
         * + General
         * Если «all», предварительно загружает все изображения перед запуском слайдера.
         * Если "visible", предварительно загружает только изображения на изначально видимых слайдах
         * перед запуском слайдера (совет: используйте "видимый", если все слайды имеют одинаковые размеры)
         * 'all', 'visible'
         * default : 'visible'
         */
        // preloadImages : 'visible' ,
        /**
         * + General
         * Если true, переходы при касании.
         * boolean
         * default : true
         */
        // touchEnabled : true ,
        /**
         * + General
         * Если true, сенсорный экран не будет перемещаться по оси x при смахивании пальцем.
         * boolean
         * default : true
         */
        // preventDefaultSwipeX : true ,
        /**
         * + General
         * Если true, сенсорный экран не будет перемещаться по оси Y при смахивании пальцем.
         * boolean
         * default : false
         */
        // preventDefaultSwipeY : false ,
        /**
         * + General
         * Класс для обертывания ползунка.
         * Измените, чтобы запретить использование стилей bxSlider по умолчанию.
         * string
         * default : 'bx-wrapper'
         */
        // wrapperClass : 'bx-wrapper' ,
        /**
         * ----------------------------
         * + General -->> END
         * ----------------------------
         */
        
        /**
         * + Pager
         * Если true, будет добавлены точки навигации
         * boolean
         * default : true
         */
        pager:false ,
        
        /**
         * + Auto
         * Слайды автоматически переходят
         * boolean
         * default : false
         */
        auto:false,
        
        
        /**
         * ----------------------------
         * + Carousel -->> START
         * ----------------------------
         */
        /**
         * + Carousel
         * Минимальное количество слайдов для показа.
         * Размер слайдов будет уменьшен, если размер карусели станет меньше исходного.
         * integer
         * default : 1
         */
        minSlides: 3,
        /**
         * + Carousel
         * Максимальное количество слайдов для показа.
         * Слайды будут увеличены, если карусель станет больше исходного размера.
         * integer
         * default : 1
         */
        maxSlides: (window.outerWidth <= 1024 ? 3 : 1 ),
        /**
         * + Carousel
         * Количество слайдов, которые нужно переместить при переходе.
         * Это значение должно быть >= minSlides и <= maxSlides.
         * Если ноль (по умолчанию), будет использовано количество полностью видимых слайдов.
         * integer
         * default : 0
         */
        moveSlides : 1,
        /**
         * + Carousel
         * Ширина каждого слайда.
         * Эта настройка обязательна для всех горизонтальных каруселей!
         * integer
         * default : 0
         */
        slideWidth : (window.outerWidth <= 1024 ? 350 : 0 ) ,
        /**
         * + Carousel
         * Карусель будет показывать только целые элементы и сжимать изображения,
         * чтобы они соответствовали области просмотра на основе maxSlides / minSlides.
         * boolean
         * default : false
         */
        shrinkItems : true ,
      
        /**
         * ----------------------------
         * + Carousel -->> END
         * ----------------------------
         */
        
        
        
        
        
        
        /**
         * ----------------------------
         * + Controls -->> START
         * ----------------------------
         */
        /**
         * + Controls
         * Если true, будут добавлены элементы управления "Далее" / "Назад".
         * boolean
         * default : true
         */
        controls:true,
        /**
         * + Controls
         * Текст, который будет использоваться для элемента управления «Далее»
         * string
         * default : 'Next'
         */
        nextText : 'Next' ,
        /**
         * + Controls
         * Текст, который будет использоваться для элемента управления "Назад"
         * string
         * default : 'Prev'
         */
        prevText : 'Prev' ,
        /**
         * + Controls
         * Элемент, используемый для заполнения элемента управления «Next»
         * jQuery selector
         * default : null
         */
        nextSelector : null ,
        /**
         * + Controls
         * Элемент, используемый для заполнения элемента управления "Prev"
         * jQuery selector
         * default : null
         */
        prevSelector : null ,
        /**
         * + Controls
         * Если true, будут добавлены элементы управления "Start" / "Stop".
         * boolean
         * default : false
         */
        autoControls : false ,
        /**
         * + Controls
         * Текст, который будет использоваться для элемента управления "Start"
         * string
         * default : 'Start'
         */
        startText : 'Start' ,
        /**
         * + Controls
         * Текст, который будет использоваться для элемента управления "Stop"
         * string
         * default : 'Stop'
         */
        stopText : 'Stop' ,
        /**
         * + Controls
         * При воспроизведении слайд-шоу отображается только элемент управления «Stop» и наоборот.
         * boolean
         * default : false
         */
        autoControlsCombine : false ,
        /**
         * + Controls
         * Элемент, используемый для заполнения автоматических элементов управления
         * jQuery selector
         * default : null
         */
        autoControlsSelector : null ,
        /**
         * + Controls
         * Включить навигацию с клавиатуры для видимых слайдеров
         * boolean
         * default : false
         */
        keyboardEnabled : false ,
        /**
         * ----------------------------
         * + Controls -->> END
         * ----------------------------
         */
        
        
        onSliderLoad : function ( currentIndex ){
            $( '.thumbnail__link' ).on('mousedown', function(){
                console.log('Hello Word');
            })
        },
    
    });


})
 ```
 [Содержание](#top)
 ***

   ### Noty Сообщения <a name="notyСообщения"></a> (2021-04-18, 21:4)
   [https://ned.im/noty](https://ned.im/noty/#/api)
 ```javascript
 var param = {
    /**
    * Тип сообщений - alert, success, warning, error, info/information
    */
    type: 'info',
    /**
    * Позиция вывода top, topLeft, topCenter, topRight,
    * center, centerLeft, centerRight, bottom, bottomLeft, bottomCenter, bottomRight
    */
    layout:'bottomRight' ,
    /**
    * Время отображения
    */
    timeout : 10000  ,
}
self.__loadModul.Noty(param).then(function(Noty){
   Noty.options.text = 'Товар добавлен в Список желаний' ;
   Noty.show();
})
 ```
   [Содержание](#top)
   ***
   
 
 ### Mini Menu <a name="miniMenu"></a> (2021-05-5, 1:53)
 Создать меню под кнопкой  
 ```javascript
/**
 * $el  - jQuery елемент под которым отобразить меню
 * html - string - UL список 
 *  
 */

// Слушаем click на группе кнопок context-menu__toggle
$('body').on('click', '.Gartes-Cart button.context-menu__toggle', function (e) {
    console.log('gartes_scripts:->e >>> ' , $(e.target) );
    // Получаем ту кнопку по которой кликнули
    var $el = $(e.target);
    // Загружаем html контекстного меню
    var htmlContextMenu =  GartesCart.contextMenu();
    // Создаем контекстное меню
    wgnz11.getModul('MiniMenu').then(function (MiniMenu){
        MiniMenu.createMenu( $el , htmlContextMenu )
    },function (err){console.log(err)});
});

 ```
Пример UL : 
```html
<ul _ngcontent-c88="" class="cart-actions__list" id="shoppingCartActions">
    <li _ngcontent-c88="" class="cart-actions__item">
        <button _ngcontent-c88="" data-action="removeFromList"
                class="button button--medium button--with-icon button--link cart-actions__button"
                type="button">
            <svg _ngcontent-c88="" aria-hidden="true" height="24" pointer-events="none" width="24">
                <use _ngcontent-c88="" pointer-events="none" xmlns:xlink="http://www.w3.org/1999/xlink"
                     xlink:href="#icon-trash"></use>
            </svg>
            Удалить из списка
        </button>
    </li><!---->
    <li _ngcontent-c88="" data-action="cancel" class="cart-actions__item">
        <button _ngcontent-c88=""  class="button button--medium button--with-icon button--link cart-actions__button"
                type="button">
            <svg _ngcontent-c88="" aria-hidden="true" height="24" pointer-events="none" width="24">
                <use _ngcontent-c88="" pointer-events="none" xmlns:xlink="http://www.w3.org/1999/xlink"
                     xlink:href="#icon-remove"></use>
            </svg>
            Отменить
        </button>
    </li>
</ul>
```
Для создания пункта для закрытя меню (самим модулем ) - Ul список должен содержать li такого вида 
```html
<li _ngcontent-c88="" data-action="cancel" class="cart-actions__item">
        <button _ngcontent-c88="" class="button button--medium button--with-icon button--link cart-actions__button" type="button">
            <svg _ngcontent-c88="" aria-hidden="true" height="24" pointer-events="none" width="24">
                <use _ngcontent-c88="" pointer-events="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-remove"></use>
            </svg>
            Отменить
        </button>
    </li>
```
Options :

**self.ContextMenu.Close()** - закрыть все открытые меню
**self.ContextMenu.Close(e.target)** - закрыть меню с элементом 
 



   [Содержание](#top)
   ***











***
   [Содержание](#top)
   ***



### Tippy.js
полное решение для всплывающих подсказок, всплывающих окон,
выпадающих меню и меню для веб-сайтов, созданное на основе Popper
https://atomiks.github.io/tippyjs/
```javascript
wgnz11.__loadModul.Tippy().then(function(a){
    tippy( '.selector' , {
        content: 'Tooltip',
    });
})
``` 
***

### Storage Class [<img width="50" src="http://178.209.70.115/images/logos/gist_github_large.png">](https://gist.github.com/gartes/30819b797838ce277ca6519cee730703)
простой класс хранения для JavaScript
```javascript
wgnz11.getModul('Storage_class').then(function () {
    Storage_class.set( 'object' , { a: 1 , b: 2 } );
})
```
### Geolocation
События :
* onAfterGeolocationDataSet - После получения данных геолокации
```javascript
document.addEventListener('onAfterGeolocationDataSet', self.GeolocationDataSet , false);
this.GeolocationDataSet = function (event) {
    // Данные - геолокации 
    var locality = $( event.detail.locality ) ;
}
```
### Dropdown
Вызвать :
```javascript
options = {
    element : '.dropdown-link' , // Элемент управления
    suggestions : 'ul.pickups-select-dropdown-l' , // список выбора ( ul.suggestions )
}
wgnz11.getModul('DropdownInput' , options ).then(function (Dropdown) {
    var PickupsDropDown = Dropdown.Inint() ;
}) ;
```
События
* onAfterDropDownBlur потеря фокуса на элементе DropInput
* onBeforeSetTextToInput - Выбор ГОРОДА из списка
* onBeforeSetTextToLink
* onAfterDestroyDropLink
```javascript
// Событие - 
document.addEventListener('onBeforeSetTextToInput', self.onBeforeSetTextToInput , false);

/*-------------------------------------------------*/
// после того как текст управляющей ссылки обновлен
document.addEventListener('onBeforeSetTextToLink', self.showDescriptionWarehouse , false);

this.showDescriptionWarehouse = function (event) {
    // Получить элемент на котором сработало событие
    var $element = $( event.detail.elem ) ;
}

/*-------------------------------------------------*/
// после обнуление управляющего элемента
document.addEventListener('onAfterDestroyDropLink', self.afterDestroyDropLink , false);

this.afterDestroyDropLink = function (event) {
    // Получить элемент на котором сработало событие
    var $element = $( event.detail.elem ) ;
}


```





***










## JS - Objects : <a name="JSObjects"></a>
### ARRAY :

***
### FILE_SYSTEM :
 [Получить расшерение файла из пути .](#получитьРасшерениеФайлаИзПути)
 ###### Получить расшерение файла из пути  <a name="получитьРасшерениеФайлаИзПути"></a> (2021-01-27, 19:58)
 ```javascript
var path = '/path/to/file.ext' 
 wgnz11.FILE_SYSTEM.getExtensionInPath(path) // return : "ext"
 ```
 [Содержание](#top)
 ***
***

***



## API
###Shipment
####NovaPoshta
Загрузка :
```javascript
wgnz11.getApi( 'Shipment' , 'NovaPoshta' , {} )
```
Методы :
* 1
* 2
####


***

##Optimize
```javascript
//
```
##


initDropElements: function() { }
*****

Отметить совпадения
```javascript
_markupSuggestion: function(el) {
    var et_regex = new RegExp('(^' + this.input.value + ')','i');
    return el.setHTML(el.getText().replace(et_regex, '<span class="queriedValue">$1</span>'))
},
```

***
## PHP
Подключение для Joomla
```php
JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );
```

### Api - Optimize
Конвертирует изображения в формате PNG в JPG
> безопасно с прозрачностью белого цвета.
```php
\GNZ11\Api\Optimize\Img::png2jpg (  $filePath , $Quality = 50 );
```




Versions :
0.3.2 - Добавлен объект `GNZ11\Document\Document` 
