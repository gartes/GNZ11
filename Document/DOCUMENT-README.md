# GNZ11 DOM
## Содержание
 1. [DOM](#DOM)
    + [Подключение](#Document/DOM/Install)
    + [Document/DOM](#Document/DOM)
        + [Поиск элемента](#Document/DOM/Поиск_элемента)
 
 2. [Document](#Document) 
    + [Document](#Document/Document)
        + [Добавить Style содержимое CSS файла](https://github.com/gartes/GNZ11/blob/master/Document/DOCUMENT-README.md#-%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D1%82%D1%8C-style-%D1%81%D0%BE%D0%B4%D0%B5%D1%80%D0%B6%D0%B8%D0%BC%D0%BE%D0%B5-css-%D1%84%D0%B0%D0%B9%D0%BB%D0%B0)
        
    + [Text](#Document/Text)
        + [Найти слово из массива в заданной строке](https://github.com/gartes/GNZ11/blob/master/Document/DOCUMENT-README.md#-%D0%BD%D0%B0%D0%B9%D1%82%D0%B8-%D1%81%D0%BB%D0%BE%D0%B2%D0%BE-%D0%B8%D0%B7-%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D0%B0-%D0%B2-%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%B9-%D1%81%D1%82%D1%80%D0%BE%D0%BA%D0%B5)
        + [PHP Склонение числительных](https://github.com/gartes/GNZ11/blob/master/Document/DOCUMENT-README.md#-php-%D1%81%D0%BA%D0%BB%D0%BE%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5-%D1%87%D0%B8%D1%81%D0%BB%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D1%85)
        + [PHP Разбить строку с кирилицей в массив]()
 
 
    
### <a name="DOM"></a> DOM
***   
#### <a name="DOM/Install"></a> DOM/Install 
***
### <a name="Document"></a> Document
#### <a name="Document/DOM"></a> Document/DOM 
***

##### <a name="Document/DOM/Поиск_элемента"></a> Поиск элемента
```php
# Найти элементы <label class="uf_category">...</label>
$body = $this->app->getBody();
$dom = new \GNZ11\Document\Dom();
$dom->loadHTML( $body );
$xpath = new \DOMXPath( $dom );
$Nodes = $xpath->query( '//label[@class="uf_category"]' );
``` 
***
#### <a name="Document/Document"></a> Document/Document 
***
##### <a name="Document\Document::addIncludeStyleDeclaration"></a> Добавить Style содержимое CSS файла
Параметры : 
 + 'debug' => false ,  // Отображать в стлях пути к файлу из которого они вставлены
 + 'asFile' => false , // Загрузить как сcs файл  <link rel="stylesheet" /> 
```php
JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );

$pathCss = JPATH_THEMES . '/elektro/assets/css/com_jshopping.category.critical.css' ;
$params = [ 'debug' => true ]
/**
* @param string $path - путь к файлу от корня сайта
* @param array $params - параметры
* @since 3.9
*/
\GNZ11\Document\Document::addIncludeStyleDeclaration( $pathCss , $params ) ;

```

#### <a name="Document/Text"></a> Document/Text 
***
##### <a name="Document\Text::strpos_array"></a> Найти слово из массива в заданной строке
```php
$str = 'This is a test' ;
$pregArr = array('test', 'drive') ;  
$pos = \GNZ11\Document\Text::strpos_array( $str , $pregArr ) ; // Output is 10
```
##### <a name="Document\Text::declOfNum"></a> PHP Склонение числительных
```php
/**
* $titles = array(' %d товар', ' %d товара', ' %d товаров');
* $number = INT ;
* @return string ( 1 товар| 2 товара | 8 товаров )
*/
$checkText = \GNZ11\Document\Text::declOfNum( $number , $titles );
```
```php
/**
* Разбить многобайтовую строку на отдельные символы.
* Используется для разбиения строки состоящих из символов кирилицы в массив
* @param $string Строка с кирилицей
* @param string $encofing Кодировка ( default - UTF-8 )
* @return array массив символов строки
*/
$arr = \GNZ11\Document\Text::mbStringToArray($str , $encofing = "UTF-8" ) ; 
```
