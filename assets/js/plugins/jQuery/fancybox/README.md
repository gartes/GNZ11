## GNZ11 Fancybox 
[Home](https://github.com/gartes/GNZ11/blob/master/README.md#%D1%81%D0%BE%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%BD%D0%B8%D0%B5)

### Содержание
1. [Option](#Option)

2. [jQuery-AutocompleteDevBridge](#auto_complete_dev_bridge)
***
- [Version](#Version)
***

-----------------------------------
### <a name="#auto_complete_dev_bridge"></a> jQuery-AutocompleteDevBridge
-----------------------------------
 
### <a name="#Option"></a> Option
```javascript
baseClass : "quickorderForm"    // Класс оновного элемента
touch : false ,                 // полностью отключить сенсорные жесты (смавхивание) default : true
```
### Events
```javascript
beforeLoad   : function()   {},                     // Перед загрузкой содержимого слайда
afterLoad   : function()   {},                      // Когда содержимое слайда будет загружено

beforeShow   : function(instance, current)   {},    // Перед началом анимации открытия 
afterShow   : function(instance, current)   {},     // Когда контент загружен и анимирован

beforeClose  : function () {},                      // Прежде чем экземпляр пытается закрыть. Верните false, чтобы отменить закрытие.
afterClose  : function () {},                       // После того как экземпляр был закрыт

onInit  : function () {},                           // Когда экземпляр был инициализирован
onActivate  : function () {},                       // Когда экземпляр вынесен на фронт
onDeactivate  : function () {},                     // Когда другой экземпляр был активирован

onInitAutoComplete : function ( FancyBox, current ) {}
```

### Создание окна с закрытием по таймеру 
```javascript
self.__loadModul.Fancybox().then(function (Modal) {
    Modal.open( html ,{
        afterShow   : function(instance, current)   {
            Modal.setTimeOut(8000) ; // Окно будет закрыто через 8 секунд 
        }
    })
});
```

### <a name="#auto_complete_dev_bridge"></a> jQuery-AutocompleteDevBridge
```js
/**
 * Init AutoComplete
 * ---
 * для запуска этого метода параметр baseClass должен содержать класс "devBridge-AutoComplete"
 * @param FancyBox - объект модального окна
 * @param current - текущее модальное окно
 */
onInitAutoComplete : function ( FancyBox, current ) {
    var $ = jQuery ,
        $AutoCompleteElem ;

    // Находим требуемый элемент
    $AutoCompleteElem = $(current.$content[0]).find('[name="jform[parent_area]"]')

    // Запускаем devBridgeAutocomplete на найденном элементе
    $AutoCompleteElem.devbridgeAutocomplete({
        /**
         * jQuery-AutocompleteDevBridge
         * Загружаем предлагаемые результаты
         * ---
         * Docs : https://github.com/gartes/jQuery-AutocompleteDevBridge
         * @param query - Строка запроса - value Input Element
         * @param done  - call the callback для установки результата
         */
        lookup: function (query, done) {
            // Выполняем Ajax-вызов или поиск локально, когда закончим,
            // вызываем обратный вызов и передаем ваши результаты:
            // ----
            // Do Ajax call or lookup locally, when done,
            // call the callback and pass your results:
            var result = {
                suggestions: [
                    { "value": "United Arab Emirates", "data": "AE" },
                    { "value": "United Kingdom",       "data": "UK" },
                    { "value": "United States",        "data": "US" }
                ]
            };
            done(result);
        },
        /**
         * Функция обратного вызова вызывается, когда пользователь выбирает предложение из списка.
         * this внутренний обратный вызов относится к вводу HtmlElement.
         * @param suggestion
         */
        onSelect: function (suggestion) {
            alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });
}
``` 

### <a name="#Version"></a> Version GNZ11
- 0.6.10  Добавлена поддержка jQuery-AutocompleteDevBridge параметр baseClass должен содержать класс "devBridge-AutoComplete" 
- 0.6.8 - Добавлена поддержка jQuery Chosen в модальном окне для элементов `<select/>`. Элемент должен иметь класс `chosen-select` <br>
- 
- 0.6.4 - Добавлена поддержка Joomla SubForm Repeatable при создании модального окно если в нем находиться SubForm
  Repeatable она будет автоматически запущена

[В начало](#top) <hr>

 
