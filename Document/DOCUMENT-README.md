# GNZ11 DOM
## Содержание
 1. [DOM](#DOM)
    + [Подключение](#DOM/Install)
 
 2. [Document](#Document) 
    + [Text](#Document/Text)
    
### <a name="DOM"></a> DOM
***   
#### <a name="DOM/Install"></a> DOM/Install 


#### Поиск элемента
```php
# Найти элементы <label class="uf_category">...</label>
$body = $this->app->getBody();
$dom = new \GNZ11\Document\Dom();
$dom->loadHTML( $body );
$xpath = new \DOMXPath( $dom );
$Nodes = $xpath->query( '//label[@class="uf_category"]' );

``` 
### <a name="Document"></a> DOM
#### <a name="Document/Text"></a> DOM/Text 
***
##### <a name="Document\Text::strpos_array"></a> Найти слово из массива в заданной строке
```php
$str = 'This is a test' ;
$pregArr = array('test', 'drive') ;  
$pos = \GNZ11\Document\Text::strpos_array( $str , $pregArr ) ; // Output is 10
```