## GNZ11 Fancybox
[Home](https://github.com/gartes/GNZ11/blob/master/README.md#%D1%81%D0%BE%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D0%BD%D0%B8%D0%B5)
### Опции 
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
afterClose  : function () {},                       // После того, как экземпляр был закрыт

onInit  : function () {},                           // Когда экземпляр был инициализирован
onActivate  : function () {},                       // Когда экземпляр вынесен на фронт
onDeactivate  : function () {},                     // Когда другой экземпляр был активирован
```

### Создание окна с закрытием по таймеру 
```javascript
self.__loadModul.Fancybox().then(function (a) {
    a.open( html ,{
        afterShow   : function(instance, current)   {
            a.setTimeOut(8000) ; // Окно будет закрыто через 8 секунд 
        }
    })
});
```



