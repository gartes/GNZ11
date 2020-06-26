# GNZ11 DOM
## Содержание
 1. [DOM](#DOM)
    + [Подключение](#DOM/Install)
    
    
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