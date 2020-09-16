### GNZ11\Joomla\Uri
***
 [Создать ссылку](createLink)
 
#### <a name="createLink"><a> createLink
 Создать ссылку
 ```php
/**
* @param array $params массив с параметрами запроса e.c.( 'option'=>'com_search' ,  'view'=>'search'  )
* @param bool  $isSef  true если нужна SEF ссылка
* @return string
* @since 3.9
*/

$res = \GNZ11\Joomla\Uri\Uri::createLink( $params,  $isSef );
```