## GNZ11 Fancybox
<!-- ## Table of Contents -->
### Опции 
```javascript
baseClass : "quickorderForm"    // Класс оновного элемента
touch : false ,                 // полностью отключить сенсорные жесты (смавхивание) default : true
```
### Events
```javascript
beforeShow   : function(instance, current)   {},    // Перед началом анимации открытия 
afterShow   : function(instance, current)   {},     // Когда контент загружен и анимирован
beforeClose  : function () {},                      // Прежде чем экземпляр пытается закрыть. Верните false, чтобы отменить закрытие.
afterClose  : function () {},                       // После того, как экземпляр был закрыт
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



