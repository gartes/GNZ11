# GNZ11 js/plugins/jQuery/jquery-ui
<!-- ## Table of Contents -->


## Содержание
 1. [Общие настройки](#General_settings)
    + [Загрузка](#Load)
 2. [Sortable](#Sortable)
    + 2.1 [Свойства](#Sortable.Properties)
    + 2.2 [Методы](#Sortable.Methods)
    + 2.3 [События](#Sortable.Events)
        + 2.3.1 [create](#Sortable.Events.Create)
        + 2.3.2 [start](#Sortable.Events.start)
        + 2.3.3 [sort](#Sortable.Events.sort)
        + 2.3.4 [change](#Sortable.Events.change)
        + 2.3.5 [beforeStop](#Sortable.Events.beforeStop)
        + 2.3.6 [stop](#Sortable.Events.stop)
        + 2.3.7 [update](#Sortable.Events.update)
        + 2.3.8 [receive](#Sortable.Events.receive)
        + 2.3.9 [over](#Sortable.Events.over)
        + 2.3.10 [out](#Sortable.Events.out)
        + 2.3.11 [activate](#Sortable.Events.activate)
        + 2.3.12 [deactivate](#Sortable.Events.deactivate)


### 1.Общие настройки <a name="General_settings"></a>

#### 1.1 Загрузка <a name="Load"></a>
```javascript
this.__loadModul['Ui']().then(function (a) {

    alert('jquery-ui Is Load');

},function(error){console.error(error)});
```

***

### 2.Sortable <a name="Sortable"></a>
#### 2.1 Свойства <a name="Sortable.Properties"></a>
#### 2.2 Методы   <a name="Sortable.Methods"></a>
#### 2.3 События  <a name="Sortable.Events"></a>
##### 2.3.1 Create <a name="Sortable.Events.Create"></a>
Событие create происходит в момент инициализации sortable на элементе.
```javascript
// обработка события create
$("selector").sortable({
   create: function(event, ui) { /*...*/ }
});
// еще один способ (используя метод bind)
$("selector").bind( "sortcreate", function(event, ui){ /*...*/ });
```
##### 2.3.2 start <a name="Sortable.Events.start"></a>
Событие start происходит в момент начала перетаскивания элемента.
##### 2.3.3 sort <a name="Sortable.Events.sort"></a>
Событие sort происходит при каждом движении (изменении координат) перетаскиваемого элемента.
##### 2.3.4 change <a name="Sortable.Events.change"></a>
Событие change происходит во время перетаскивания группируемого элемента, в моменты смены вакантной 
позиции (места, на которое встанет перетаскиваемый элемент, если его отпустить в данный момент).
##### 2.3.5 beforeStop <a name="Sortable.Events.beforeStop"></a>
Это событие происходит после отпускания перетаскиваемого элемента, но до удаления вспомогательных 
элементов (helper и placeholder).
##### 2.3.6 stop <a name="Sortable.Events.stop"></a>
Событие происходит после отпускания перетаскиваемого элемента.
##### 2.3.7 update <a name="Sortable.Events.update"></a>
Событие происходит после отпускания перетаскиваемого элемента, в случае, 
если порядок группируемых элементов поменялся.
##### 2.3.8 receive <a name="Sortable.Events.receive"></a>
Это событие происходит, когда в набор группируемых элементов помещают элемент из 
другого (связанного) набора.
##### 2.3.9 over <a name="Sortable.Events.over"></a>
Это событие происходит, если элемент из связанного группируемого набора оказывается над текущим набором. Это событие 
произойдет и в случае, если схватить элемент из текущего набора, перетащить его в область связного 
набора и не отпуская возвратить обратно в зону текущего набора 
(однако, это поведение не указано в документации и возможно является ошибочным, поэтому может быть и исправлено в будущем).
##### 2.3.10 out <a name="Sortable.Events.out"></a>
Судя по документации, это событие должно происходить в случае, если элемент из текущего группируемого набора, 
окажется над областью другого (связанного) набора. 
Но на деле, это событие происходит по довольно запутанному принципу.
##### 2.3.11 activate <a name="Sortable.Events.activate"></a>
Это событие срабатывает в начале перетаскивания элемента, находящегося в текущем или связанном наборе.
##### 2.3.12 deactivate <a name="Sortable.Events.deactivate"></a>
Это событие срабатывает при завершении перетаскивания элемента, находящегося в текущем или связанном наборе.

