# GNZ11 Библиотека 
## События ядра 
**GNZ11Loaded** - после инициализации библиотеки  
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
### Fancybox
```javascript
var html = $('#npw-map-wrapper');
wgnz11.__loadModul.Fancybox().then(function (a) {
    a.open( html ,{
    baseClass: "gjContactPhones",
    afterShow   : function(instance, current)   {},
    afterClose  : function () {},
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
***
 
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
### DropdownInput
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
