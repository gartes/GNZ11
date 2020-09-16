### \GNZ11\Api\Optimize\Optimises
Класс оптимизации страниц

##### Instance 
Создание заданий для оптимизатора
```php
$Optimises = \GNZ11\Api\Optimize\Optimises::instance( $this->params ) ;
$Optimises->setParams([
    # Имя Оптимизатора
    'my_name' => 'HtmlOptimizer' ,
    # Переносить скрипты вниз страницы : Bool
    'downScript' => $this->params->get('downScript' , 0 ) ,
    'preload'=>[],
    'not_load'=>[],
    # обварачивать элементы в тег <template /> : Array
    'to_templates'=>[
        $top_menu_selector => [],
    ],
    'to_html_file'=>[],
]);
$Optimises->Start();
```