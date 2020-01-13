Inetglobal = window.Inetglobal || {};
Inetglobal.Seting = Inetglobal.Seting || {};

/**
 *  Целевой домен
 */
Inetglobal.TargetDomen ;
// формат даты
Inetglobal._f = "YYYY-MM-DD HH:mm:ss";

/**
 * Таймаут до возвращения на главную
 * @type {number}
 */
Inetglobal.return_wait = 30 ;

/**
 * Таймаут перед отправкой формы с заказои
 * @type {number}
 */
Inetglobal.apply_order_wait = 10 ;

/**
 * Количество попыток получения настроек
 * @type {number}
 * @protected
 */
Inetglobal._getSettingCount = 0;

/**
 * Объект библиотеки GNZ11
 * @type {GNZ11}
 */
Inetglobal.gnz11 = new GNZ11();
/**
 * object   параметы для добваления в GET метода
 * @type {{plugin: string, option: string, group: string}}
 */
Inetglobal.paramUrl = {option: 'com_ajax', group: 'system', plugin: 'inetglobal',};


Inetglobal.TargetFormSelector = 'div.form:first > form';
Inetglobal.TargetNameSelector = '[name="name"]';
Inetglobal.TargetPhoneSelector = '[name="phone"]';

/**
 * Инициалазация задания
 * @constructor
 */
Inetglobal.Init = function () {

    Inetglobal.TargetDomen = window.location.host


    if (Inetglobal.gnz11.isEmpty(Inetglobal.Seting) && !Inetglobal._getSettingCount) {
        Inetglobal.getSetting();
        return;
    }
    var pathname = window.location.pathname ;

    if (window.location.host === Inetglobal.TargetDomen ){
        switch (pathname) {
            case '/' :
                Inetglobal.getNewName() ;
                break ;
            case '/send.php' :
                Inetglobal.GoToFront();
                break ;
        }
    }
};

Inetglobal.StartReload = function(){
    setTimeout(function () {
        window.location.reload();
    },120000)
};


/**
 * Возващение на страницу заказа
 * @constructor
 */
Inetglobal.GoToFront = function(){
    var wt = Inetglobal.return_wait + Inetglobal.Seting.ofset ;
    console.clear();
    setInterval(function () {

        console.clear();
        console.log( '%c\n\n\nЩа вернемся прямо через ' + wt + ' секунд!\n\n\n' , "color:green; font-size: 20px"  )
        wt--;
    },1000)
    setTimeout(function () {
        window.location.href = 'http://'+Inetglobal.TargetDomen+'/?fbclid=IwAR11lTCTY1cYYx5zgZ0MHMIZxu_Q3IB6tYxIGlS_fy5NS_i5J5Up-tXMmSY' ;
    } , wt * 1000 );

};




Inetglobal.Seting = {};




/**
 * Установка настройки для задания
 * @param data
 */
Inetglobal.setSetting = function (data) {
    Inetglobal.Seting = data;
    Inetglobal.Init();
};
/**
 * Получить настройки для задания
 */
Inetglobal.getSetting = function () {
    Inetglobal.getSetting_count += 1;
    var postData = {
        model: '\\Setting',
        task: 'getSetting',
    };
    Inetglobal.Ajax.sendPostCrosDomen(Inetglobal.paramUrl, postData, Inetglobal.setSetting);
};
/**
 * Установка Данных в форму
 * @param data
 */
Inetglobal.setShoper = function (data) {
    var $ = jQuery;
    var $form = $(Inetglobal.TargetFormSelector);
    $form.find(Inetglobal.TargetNameSelector).val(data.last_name);
    $form.find(Inetglobal.TargetPhoneSelector).val(data.phone_1);

    // Если ручное выполнение
    if (!Inetglobal.Seting.send_auto_form) return;

    // Если автоматическое выполнение
    if (Inetglobal.Seting.send_auto_form) {

        new Promise(function (resolve, reject) {
            Inetglobal.checkTime().then(function (res) {
                console.log(res)

                // Получить сегодняшнюю дату в формате
                Inetglobal.Seting.last_time = moment().utcOffset(120).format(Inetglobal._f);

                // Inetglobal.Seting.count ++ ;
                console.log( Inetglobal.Seting ) ;

                // Обновить настройки плагина
                Inetglobal.updatePluginSetting(Inetglobal.Seting);

                setTimeout(function () {
                    window.location.reload();
                }, 6000);

                // Показать Лого!!!
                getLogoSUBMIT_FORM();

                // Отправить форму
                 $form.submit();


                // resolve('End');
            });
        })


    } else {
        setTimeout(function () {
            ////////
        }, 11)
    }
};
/**
 * Проверка времени возможености выполнения задачи
 * @returns {boolean}
 */
Inetglobal.checkTime = function () {
    var previous,

        // Пауза между выполнениями
        pause = +Inetglobal.Seting.automatic_pause,

        // Получить сегодняшнюю дату в формате
        now = moment().utcOffset(120).format(Inetglobal._f);


    return new Promise(function (resolve, reject) {
        if (!Inetglobal.Seting.last_time) resolve(true);
        var today = new Date(Inetglobal.Seting.last_time);

        // предыдущая дата
        previous = Inetglobal.Seting.last_time;

        // var utcMoment = moment.utc();

        /*console.log( utcMoment )
        console.log( new Date() )
        console.log( now )
        console.log( previous )*/

        // Получить объект MOMENT сегодняшней даты
        var a = moment(now, Inetglobal._f);
        // Получить объект MOMENT предыдущий даты
        var b = moment(previous, Inetglobal._f);
        // Получить продолжительность между предыдущий и сегодняшней даты
        var duration = a.diff(b, 'seconds');


        console.log( duration )
        console.log( pause )

        if (duration > pause) {
            resolve(true);
            return;
        }

        var t = pause - duration;

        var wt = t;

        var I = setInterval(function () {

            console.clear();
            console.log('До выполнения задания - ' + wt + ' секунд.');
            wt--;
        }, 1000);


        delay(t * 1000).then(function (e) {});

        function delay(ms) {
            return new Promise(function (resolveWait, rejectWait) {
                setTimeout(function () {
                    clearInterval(I);
                    resolve(true);
                    return resolveWait(true);
                }, ms);
            });
        }

        /*setTimeout(function () {



            Inetglobal.checkTime();

        } , 1000 );*/
    });


};

/**
 * Обновление параметров плагина
 * @param PluginSetting
 */
Inetglobal.updatePluginSetting = function (PluginSetting) {
    var postData = {
        model: '\\Setting',
        task: 'updatePluginSetting',
        setting: PluginSetting,
    };
    Inetglobal.Ajax.sendPostCrosDomen(Inetglobal.paramUrl, postData, Inetglobal.setSetting);



};


/**
 * Получить данные о пользователе из базы
 * вызывает коллбэк Inetglobal.setShoper
 */
Inetglobal.getNewName = function () {

    var postData = {
        model: '\\People',
        task: 'getPeople',
    };
    Inetglobal.Ajax.sendPostCrosDomen(Inetglobal.paramUrl, postData, Inetglobal.setShoper);
};

/*####################################################################################################################*/
/**
 * ВХОД В ПРОЦЕДУРУ
 */
(function () {
    console.clear();
    Promise.all([
        Inetglobal.gnz11.load.js('https://nobd.ga/libraries/GNZ11/assets/js/libraries/moment/node_modules/moment/moment.js'),
        Inetglobal.gnz11.load.js('https://nobd.ga/libraries/GNZ11/assets/js/modules/gnz11.Ajax.js'),

    ]).then(function () {

        Inetglobal.Ajax = new GNZ11Ajax();

        console.log(Inetglobal.Ajax)

        Inetglobal.Init();
    });

})();


/**
 * Создание Логотипа перед отпракой формы
 */
function getLogoSUBMIT_FORM() {
    console.clear();
    var Str;
    Str = "%c\n\n\nSUBMIT A FORM (ツ)╭∩╮ \n"
        + "=======>🅴🅽🅳<=======\n"
        + "              ᴳᵃʳᵗᵉˢ@\n\n\n\n\n";
    console.log(Str, "color:green; font-size: 20px");
}


