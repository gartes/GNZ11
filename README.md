# GNZ11
<!-- ## Table of Contents -->


## Содержание
1. [Javascript and jQuery.](#JavascriptjQuery)
    + [Text - текстовые операции в JS.](#JavascriptjQueryText)
    + [Отложенная загрузка ресурсов из js.](#JavascriptjQueryLoad)

1. [\GNZ11\Document\Text ( текстовые операции ).](#GNZ11DocumentText)
    + [Транслитерация.](#rus2translite)
    + [Транслитерация для использования в Url.](#str2url)
    + [Склонение числительных.](#declOfNum)
    + [Обрезка строки до длины.](#truncation)
    + [Получить количество слов в строке.](#getCountWord)
    + [Замена в строке кавычек на умные|елочки.](#replaceQuotesWithSmart)
    + [Найти слово из массива в заданной строке.](#strpos_array)
    + [Проверит, что первая строка начинается со второй.](#isStart)
    + [Разбить много байтовую строку на отдельные символы. <br>
      Используется для разбиения строки состоящих из символов кириллицы в массив.](#mbStringToArray)
    + [Проверить имеет ли строка длину.](#checkString)
    + [Получить часть строки от первого появления $inthat.](#getAfter)
    + [Преобразовать строку в строку camelCase.](#camelCase)
    + [Удалить пробелы html - сущностей &nbsp ; .](#trimSpace)
    + [Удалить повторение слов в строке идущие друг за другом.](#removeNextDuplicate)

      
1. [Плагины]()
    + [GNZ11 Fancybox](https://github.com/gartes/GNZ11/blob/master/assets/js/plugins/jQuery/fancybox/README.md#gnz11-fancybox)
1. [Модули](#модули)
    + [Ajax](#Ajax);
    + [Storage Class](#storage-class-) (Локальное хранилище браузера).
1. [Joomla](Joomla)
1. [Core](Core)
    + [Backup](Core\Backup)
    + [Joomla\com_jshopping](Core\Backup\Joomla\com_jshopping)
1. [Document](https://github.com/gartes/GNZ11/blob/master/Document/DOCUMENT-README.md)
    +
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
+ [Simple application](#JavascriptjQuerySimpleLoad)
1.  Simple application
```javascript
    wgnz11.load.css('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/inputmask.css');
wgnz11.load.js('/libraries/GNZ11/assets/js/plugins/jQuery/inputmask/jquery.mask.min.js');
```
****************************
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
        $this->app->enqueueMessage('Должна быть установлена бибиотека GNZ11' , 'error');
    }#END IF
    throw new \Exception('Должна быть установлена бибиотека GNZ11' , 400 ) ; 
}
?>
```
```php
/**
* Добавить в отложенную загрузку файлы рессурсов ( CSS or JS )
* @param $Assets   string Url - ресурса
* @param $Callback string|null Callback после загрузки ( для JS файлов )
* @param bool $Trigger string  Trigger - для ожидания загрузки
*/
\GNZ11\Core\Js::addJproLoad(\Joomla\CMS\Uri\Uri::root().'assets/file.core.js' , 'Callback' = false , $Trigger = false );

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

## <a name="GNZ11DocumentText"></a>  \GNZ11\Document\Text
###Обработка строковых и числовых значений
##### Транслитерация <a name="rus2translite"></a>
```php
$string = 'Абвгдеж';
\GNZ11\Document\Text::rus2translite($string);
```
##### Транслитерация для использования в Url <a name="str2url"></a>
```php
$string = 'Абвгдеж';
\GNZ11\Document\Text::str2url($string) ; 
```
##### Склонение числительных <a name="declOfNum"></a>
```php
$titles = array(' %d товар', ' %d товара', ' %d товаров');
\GNZ11\Document\Text::declOfNum ( $number = 5 , $titles );
```
##### Проверит, что первая строка начинается со второй <a name="isStart"></a>
```php 
/**
 * Проверит, что первая строка начинается со второй
 * 
 * @param string $str      основная строка
 * @param string $substr   та, которая может содержаться внутри основной
 * @return bool  True -    Если сторка начинается с $substr
 */
\GNZ11\Document\Text::isStart($str, $substr)
```
##### Обрезка строки до длины <a name="truncation"></a>
```php
/**
 * @param $str      - строка
 * @param $length   - длина строки в сисволах
 * @return string
 */
\GNZ11\Document\Text::truncation($str, $length);
```
#####  <a name="getCountWord"></a>
```php
/**
 * @param string $string
 * @return int - Количество слов
 */
\GNZ11\Document\Text::getCountWord($string);
```
##### Замена в строке кавычек на умные|елочки <a name="replaceQuotesWithSmart"></a>
```php
/**
 * Замена в строке кавычек на умные|елочки
 * @param   string $datatext
 * @return  string
 */
GNZ11\Document\Text::replaceQuotesWithSmart($datatext);
```
##### Найти слово из массива в заданной строке <a name="strpos_array"></a>
 ```php
/**
 * ALIAS \GNZ11\Document\Arrays::strpos_array($haystack , $needles) ;
 * @param $haystack
 * @param $needles
 */
GNZ11\Document\Text::strpos_array($haystack , $needles) ;
 ```
##### Проверит, что первая строка начинается со второй <a name="isStart"></a>
 ```php
/**
 * @param string $str      основная строка
 * @param string $substr   та, которая может содержаться внутри основной
 * @return bool  True -    Если сторка начинается с $substr
 */
GNZ11\Document\Text::isStart($str, $substr) ; 
 ```
##### Разбить много байтовую строку на отдельные символы. <br>Используется для разбиения строки состоящих из символов кириллицы в массив <a name="mbStringToArray"></a>
 ```php
/**
 * @param string $string Строка с кирилицей
 * @param string $encofing Кодировка ( default - UTF-8 )
 * @return array массив символов строки
 */
GNZ11\Document\Text::mbStringToArray ($string , $encofing  ) ; 
 ```

##### Проверить имеет ли строка длину <a name="checkString"></a>
 ```php
/**
 * @param string $string The string to check
 * @return bool
 * @since 3.9
 */
\GNZ11\Document\Text::checkString($string) ; 
 ```

##### Получить часть строки от первого появления $inthat <a name="getAfter"></a>
 ```php
/**
 * @param $str
 * @param $inthat
 * @return false|string
 */
GNZ11\Document\Text::getAfter ('@', 'biohazard@online.ge');
//         returns 'online.ge'
```

##### Преобразовать строку в строку camelCase <a name="camelCase"></a>
 ```php
/**
 * @param $str
 * @param array $noStrip
 * @return string
 * @{url : http://www.mendoweb.be/blog/php-convert-string-to-camelcase-string/ }
 */
\GNZ11\Document\Text::camelCase($str, $noStrip) ;
 ```

##### Удалить пробелы html - сущностей &nbsp ; <a name="trimSpace"></a>
 ```php
/**
* @param string|array $stringHTML
* @return string|array
* @since  3.9
* @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
* @date   18.12.2020 12:11
*/
$stringHTML = 'Epson M3180&nbsp;';
\GNZ11\Document\Text::trimSpace($stringHTML) ;
// return Epson M3180
 ```

##### Удалить повторение слов в строке идущие друг за другом <a name="removeNextDuplicate"></a>
 ```php
/**
 * @param string $str строка
 * @param string $delimiter разделитель слов ( default ' ' )
 * @return string
 * @date   18.12.2020 12:47
 */
$str = 'Ремонт принтера Epson Epson M3180';
\GNZ11\Document\Text::removeNextDuplicate($str) ;
// return Ремонт принтера Epson M3180
 ```


***************************************************************************************




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
список доступных плагинов :
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
## Модули

### Ajax
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



### Fancybox
fancybox, вероятно, самый популярный в мире скрипт лайтбокса.
```javascript
var html = $('#npw-map-wrapper');
wgnz11.__loadModul.Fancybox().then(function (a) {
    a.open( html ,{
        baseClass: "gjContactPhones",	// Класс основного элемента 
        touch : false , 				// полностью отключить сенсорные жесты default : true
        // Events
        beforeShow   : function(instance, current)   {}, 	// Перед началом анимации открытия 
        afterShow   : function(instance, current)   {},		// Когда контент загружен и анимирован
        beforeClose  : function () {}, 						// Прежде чем экземпляр пытается закрыть. Верните false, чтобы отменить закрытие.
        afterClose  : function () {},						// После того, как экземпляр был закрыт


    });
});
```
Параметры :
* baseClass - Класс основного элемента
* touch  (смавхивание)
 ```javascript
// Set `touch: false` to disable panning/swiping
touch: {
    vertical: true, // Разрешить перетаскивать содержимое по вертикали
        momentum: true // Продолжайте движение после отпускания мыши / касания при панорамировании
}
```

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
