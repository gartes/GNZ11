# GNZ11
<!-- ## Table of Contents -->


## Содержание
 1. [Using](#Using)
     
 
### <a name="Using"></a> Using 
```javascript
var Settings = {
    //  Шаблон маски поля
    // Can be '+38(000)000-00-00'
    mask  : '+7 (000) 000-00-00' ,
    element : '.jmp__input_tel' ,
    // Can be true , false
    // Создавать placeholder из маски поля
    // placeholder :   true ,

    // Используется для масок телефонов
    // предназначен для загрузки иконок мобильных операторов
    // Can be 'UA'
    // country :   'UA',

}
self.getPlugin('Inputmask' ,  Settings ).then(function (  ) {
    var Inputmask = new GNZ11_Inputmask( '.jmp__input_tel' ,  Settings )
    console.log(Inputmask  )
});
```




