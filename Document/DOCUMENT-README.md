# GNZ11 DOM
## Содержание
 1. [DOM](#DOM)
    + [Подключение](#Document/DOM/Install)
    + [Document/DOM](#Document/DOM)
        + [Поиск элемента](#Document/DOM/Поиск_элемента)
 
 2. [Document](#Document) 
    + [Text](#Document/Text)
        + [Найти слово из массива в заданной строке](#Document\Text__strpos_array)
    
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
#### <a name="Document/Text"></a> Document/Text 
***
##### <a name="Document\Text::strpos_array"></a> Найти слово из массива в заданной строке
```php
$str = 'This is a test' ;
$pregArr = array('test', 'drive') ;  
$pos = \GNZ11\Document\Text::strpos_array( $str , $pregArr ) ; // Output is 10
```