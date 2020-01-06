Inetglobal = window.Inetglobal || {};
Inetglobal.Seting = Inetglobal.Seting || {} ;
/**
 * Количество попыток получения настроек
 * @type {number}
 * @private
 */
Inetglobal._getSettingCount = 0 ;
/**
 * Объект библиотеки GNZ11
 * @type {GNZ11}
 */
Inetglobal.gnz11 = new  GNZ11();
/**
 * object   параметы для добваления в GET метода
 * @type {{plugin: string, option: string, group: string}}
 */
Inetglobal.paramUrl = { option: 'com_ajax', group: 'system', plugin: 'inetglobal', };




Inetglobal.TargetFormSelector = 'div.form:first > form';
Inetglobal.TargetNameSelector = '[name="name"]';
Inetglobal.TargetPhoneSelector = '[name="phone"]';



Inetglobal.Init = function () {


    if ( Inetglobal.gnz11.isEmpty(Inetglobal.Seting) && !Inetglobal._getSettingCount ){
        Inetglobal.getSetting();
        return ;
    }
    Inetglobal.getNewName()



};
/**
 * Установка настройки для задания
 * @param data
 */
Inetglobal.setSetting = function(data){
    Inetglobal.Seting = data ;
    Inetglobal.Init();

};
/**
 * Получить настройки для задания
 */
Inetglobal.getSetting = function() {
    Inetglobal.getSetting_count +=1;
    var postData = {
        model: '\\Setting',
        task: 'getSetting' ,
    };
    Inetglobal.gnz11.getModul('Ajax').then(function () {
        Ajax = new GNZ11Ajax();
        Ajax.sendPostCrosDomen( Inetglobal.paramUrl, postData , Inetglobal.setSetting   );
    });
};

Inetglobal.setShoper = function(data){
    var $ = jQuery ;
    var $form = $( Inetglobal.TargetFormSelector );
    $form.find(Inetglobal.TargetNameSelector).val(data.last_name);
    $form.find(Inetglobal.TargetPhoneSelector).val(data.phone_1);

    // Если ручное выполнение
    if (!Inetglobal.Seting.send_auto_form) return ;

    // Если автоматическое выполнение и время позволяет
    if ( Inetglobal.Seting.send_auto_form && Inetglobal.checkTime() ){
        // устанавливаем свежу дату
        Inetglobal.Seting.last_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        Inetglobal.updatePluginSetting( Inetglobal.Seting )





        console.log( Inetglobal.Seting );
        //  $form.submit();
    }else{
       setTimeout(function () {
            ////////
       },11)
    }
};
/**
 * Проверка времени возможености выполнения задачи
 * @returns {boolean}
 */
Inetglobal.checkTime = function(){

    if (!Inetglobal.Seting.last_time) return true ;

    var now = new Date();
    var today = new Date( Inetglobal.Seting.last_time );








    var tD = now - today;

    var pause = new Date( 0 , 0 , 0, 0 , 0 , 100 );

    olddates = Inetglobal.Seting.last_time // прошедшая дата на английском
    d0 = new Date(olddates);
    d1 = new Date();
    dt = (d1.getTime() - d0.getTime()) / (1000*60*60); // *24
    document.write(''
        +   '<br />Последнее действие ' + d0
        +   '<br />Сейчас___________ ' + d1
        +   '<br />Количество секунд  ' + dt * 1000
        +   '<br />Количество мин___  ' + dt * 1000 / 60
        +   '<br />Количество час___  ' + dt * 1000 / 60 / 60
        +   '<br />'
        +   '<br />Стартовая дата - <B>' + olddates + '</B> <br />'
        +   'От начала стартовой даты уже наступил <B>' + ( Math.round(dt  ) )  + '</B> день ' +dt   );


    console.log(   new Date( ( new Date() ).toDateString() ) )

    console.log( tD/1000 )




    // return true ;

    return  false

    var delta = ( today.getTime() ) - ( now.getTime() );

    //  Inetglobal.Seting.automatic_pause * 1000

    console.log( delta )
    console.log( today.getTime() )
    console.log( now.getTime() )
    console.log( now.getTime() - Inetglobal.Seting.automatic_pause * 10000  )

    console.log( typeof now.getTime() )

    // var pause = new Date()

   //  console.log(   Inetglobal.Seting.automatic_pause.getTime()    )
    console.log( today < now - Inetglobal.Seting.automatic_pause * 1000 )



    //  if ( today < now - Inetglobal.Seting.automatic_pause * 1000 ) return true ;
    //




    console.log( Inetglobal.Seting ) ;
    console.log( now ) ;
    console.log( today ) ;
    console.log( today < now - Inetglobal.Seting.automatic_pause * 1000 ) ;



};

/**
 * Обновление параметров плагина
 * @param PluginSetting
 */
Inetglobal.updatePluginSetting = function ( PluginSetting ) {
    var postData = {
        model: '\\Setting',
        task: 'updatePluginSetting' ,
        setting: PluginSetting ,
    };
    Inetglobal.gnz11.getModul('Ajax').then(function () {
        Ajax = new GNZ11Ajax();
        Ajax.sendPostCrosDomen( Inetglobal.paramUrl, postData , Inetglobal.setSetting   );
    });



};


/**
 * Получить данные о пользователе из базы
 * вызывает коллбэк Inetglobal.setShoper
 */
Inetglobal.getNewName = function () {

    var postData = {
        model: '\\People',
        task: 'getPeople' ,
    };

    Inetglobal.gnz11.getModul('Ajax').then(function () {
        Ajax = new GNZ11Ajax();
        Ajax.sendPostCrosDomen( Inetglobal.paramUrl, postData , Inetglobal.setShoper   );
    });
};


(function () {
    console.clear();
    Inetglobal.Init();
})();