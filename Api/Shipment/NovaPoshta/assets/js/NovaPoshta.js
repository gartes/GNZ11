var ShipmentNovaPoshta = function () {
    var self = this ;
    self.DEBAG = true ;
    /**
     * Список выбора складов
     * @type {null}
     */
    self.DropLinkWarehouses = null ;
    /*----------------------------------------------------------------------------*/


    /**
     * Хранение двнных Геолакации
     * @type {boolean}
     */
    self.GeolocationData = false ;
    /**
     * Хранение складов для выбранного города !
     * @type {*[]}
     */
    self.WarehousesInSelectCity = [];
    var $ = jQuery ;
    var selectorBlockPickupNovaPoshta = '[name="select_block_pickups"]';
    /**
     * _defaults
     * @type {{pickups_data_element: JQuery<HTMLElement> | jQuery.fn.init | jQuery | HTMLElement, block_warehouse_descript: string, locale: null, selectors: {element_block: string}}}
     * @private
     */
    this._defaults = {
        locale : null ,
        // pickups_block:'.pickups-select-dropdown-l',
        pickups_data_element:$('<a />' , {
            href:'#' ,
            name:'pickups_drop_element' ,
            class:'pickups-select-dropdown-l-i-link' ,
        }),
        pickups_data_wrap:'<li class="pickups-select-dropdown-l-i"></li>',
        block_warehouse_descript : '[name="description"]', // Блок для вывода описания склада
        selectors:{
            element_block : selectorBlockPickupNovaPoshta ,
        }
    };
    /**
     * Идентификатор Инициализации карты для выбора складов Новой Почты
     * @type {boolean}
     */
    this.NovaPoshtaMapInitialise = false ;
    /**
     * Блок для вывода описания склада
     */
    var $BlockWarehouseDescript ;
    /**
     * Модель Новая Почта - Адреса
     */
    var AddressGeneral ;
    /**
     * Елемент - Выбора складов
     */
    var PickupsDropDown ;
    /**
     * Список сохраняемых полей  для метода "самовывоз из Новой Почты"
     * @type {string[]}
     */
    this.fieldArr = [
        'description' ,
        'descriptionru' ,
        'shortaddress' ,
        'shortaddressru' ,
        'phone' ,
        'typeofwarehouse' ,
        'ref' ,
        'number' ,
        'cityref' ,
        'settlementdescription' ,
        'settlementareadescription' ,
        'settlementregionsdescription' ,
        'settlementtypedescription' ,
        'longitude' ,
        'latitude' ,
        'postfinance' ,
        'bicycleparking' ,
        'paymentaccess' ,
        'posterminal' ,
        'totalmaxweightallowed' ,
        'placemaxweightallowed' ,
        'reception' ,
        'delivery' ,
        'schedule' ,
        'districtcode' ,
        'warehousestatus' ,
        'categoryofwarehouse' ,
        'direct' ,
    ];
    this.Init = function(){
        wgnz11.load.css('/libraries/GNZ11/Api/Shipment/NovaPoshta/assets/css/nova_poshta.shipment.css')
        // Событие - Выбор ГОРОДА из списка
        document.addEventListener('onBeforeSetTextToInput', self.onBeforeSetTextToInput , false);
        // Событие - Выбор СКЛАДА из списка
        document.addEventListener('onBeforeSetTextToLink', self.showDescriptionWarehouse , false);
        document.addEventListener('onAfterSetTextToLink', self.AfterSetWarehouse , false);

        // Событие очистить поле с выбранным складом
        // document.addEventListener('onAfterDestroyDropLink', self.hiddeDescriptionWarehouse , false);

        // Событие - после получения данных локации
        document.addEventListener('onAfterGeolocationDataSet', self.onGeolocationDataSet , false);
        /**
         * Событие потеря фокуса для поля выбора города
         */
        // document.addEventListener('onAfterDropDownBlur', self.onAfterDropDownBlur ,false);

        // EVT - Выбор отделения на карте
        document.addEventListener('onAfterSelectWarehouses', self.onAfterSelectWarehouses , false);
        // EVT Изменение способа доставки
        $('ul.check-method-subl').on('click' , '.check-method-subl-label' , self.EvtChangeRadio ) ;

        // EVT- Потеря фокуса на элементе выбора города
        $('body').on('blur' , '#suggest_locality' , self.onAfterDropDownBlur );
        // EVT-нажатие кнопок ввода города
        $('body').on('keyup' , '#suggest_locality' , self.onAfterDropDownKeyup );
        /**
         * Инициализ. Выбор складов!
         */
        self.initPickupsDropDown();

        // Изменения на элементе самовывоз из Новой Почты
        // $('.check-method-subl-label[name="nova_pochta_pickups"]>input[type="radio"]').on('change' , self.EvtChangeRadio )
    };
    /**
     * EVT-нажатие кнопок ввода города
     */
    this.onAfterDropDownKeyup = function () {
        self.SelectCyty = false
    }
    /**
     * EVT-потеря фокуса списка выбора города
     * вызывается из модуля gnz11.DropdownInput.js
     * @param event
     */
    this.onAfterDropDownBlur = function (event) { }
    /**
     * EVT-H onAfterSelectWarehouses - Событие после выбора склада доставки
     * @param event
     */
    this.onAfterSelectWarehouses = function (event) {
        if(self.DEBAG) console.log( 'EVT-H onAfterSelectWarehouses => event' , event );
        var warehousesData = event.detail.warehousesData ;
        $('.pickups-select-dropdown-l').find('[data-number="'+warehousesData.Number+'"]').trigger('click')
    }
    /**
     * EVT-H - После того как выбран склад доставки
     * @param event -
     *              event.detail.elem - Элемент из списка сладов доставки
     * @constructor
     */
    this.AfterSetWarehouse = function (event) {
        if(self.DEBAG) console.log( 'EVT-H : AfterSetWarehouse => event',  event);
        var $element = $(event.detail.elem) ;
        var $input_radio = $element
            .closest('li.check-method-subl-i')
            .find('input.input-radio');
        var $parent = $input_radio.parent();
        var type = $input_radio.val();
        var valData ;
        var $hiddenInput ;

        self.fieldArr.forEach(function (currentValue, index, array) {
            valData = $element.data(currentValue);
            $hiddenInput =   $parent
                .find('[name="order[1][delivery_service]['+type+']['+currentValue+']"]') ;
            $hiddenInput.val(valData) ;
        });

        $input_radio.addClass('is-valid');

        /**
         * Валидатор способов доставки и оплаты
         */
        methodsValid(event);
    }
    /**
     * EVT-H - Получена геолокация Получить склады для выбранного города
     * @param city str - название города
     */
    this.onGeolocationDataSet = function ( event ) {
        if(self.DEBAG) console.log( 'EVT-H : onGeolocationDataSet => event' , event );
        self.GeolocationData = event.detail.locality[0] ;
        var city = self.GeolocationData.address_components[0].long_name;
        if(self.DEBAG) console.log( 'Geolocation result data' ,  self.GeolocationData );
        // Валидация контактов
        contactsValid();

        // Todo - Избавиться от Timeout
        setTimeout(function () {
            AddressGeneral = new winApiShipmentNovaPoshta.AddressGeneral();
            AddressGeneral.getWarehouses(city , self.resultGetWarehouses)
        },2000)
    };
    this.DropDownLink = {
        element : '.dropdown-link' , // Элемент управления
        suggestions : 'ul.pickups-select-dropdown-l' , // список выбора ( ul.suggestions )
        //
        selectors: {

            // Селектор - Главная ссылка DropDownLink
            link: '[name=pickups_drop_link]',
            // Текст ссылки приглашение выбрать из списка
            link_text: 'Выберите подходящее отделение',



            suggestions : 'ul.pickups-select-dropdown-l' ,
        },

        not_found : 'Город не найден.<br>Проверьте написание или введите ближайший к вам!',
    }
    /**
     * Инициализ. Выбор складов!
     */
    this.initPickupsDropDown = function () {
        /**
         * Создать DropLink элемент для выбора складов
         */
        wgnz11.getModul('Dropdown'  ).then(function (Dropdown) {
            var options = {

                selectors : {
                    link : '#nova-poshta-warehouses' ,
                    dropdownHiddenBlock : '[name="pickups_drop_block_wrap"]' ,
                },
                placeholder : 'Выберите подходящее отделение',

            };
            self.DropLinkWarehouses = new DropLink(options);
            self.DropLinkWarehouses.Init();
        });

    };
    /**
     * СОБЫТИЕ : Изменения на элементе "самовывоз из Новой Почты"
     * @param event
     * @constructor
     */
    this.EvtChangeRadio = function (event) {
        if(self.DEBAG) console.log( 'EVT-H : EvtChangeRadio  => event' , event );

        var name = $(event.target).parent().attr( 'name' ) ;
        if(self.DEBAG) console.log( name );

        // Если выбран способ "самовывоз из Новой Почты"
        switch (name) {
            case 'nova_pochta_pickups' :
                // Инит Карты
                self.InitMap();

                break ;
            case 'nova_pochta_couriers' :

                self.initNovaPochtaCouriers();
                break ;
            case 'kiev_couriers_couriers' :
                self.initKievCouriersCouriers();
                break ;
            default :

        }
        /**
         * Валидатор способов доставки и оплаты
         */
        methodsValid(event);
    };
    this.initKievCouriersCouriers = function () {
        var $= jQuery ;
        var options = {
            suggest: {
                CityRef : self.WarehousesInSelectCity[0].CityRef ,
                tpl: '',
                language: null,
                styles: {
                    'z-index': 2
                }
            }
        };
        var input_selectors = {street_input: '[name="order[1][delivery_service][kiev_couriers][address][street]"]'};
        new RozetkaStreetSuggest_class().setOptions(options.suggest).init(input_selectors['street_input']);
        $(input_selectors.street_input).closest('li')
            .find('[name="kiev_couriers_delivery_address"]')
            .removeClass('hidden') ;
        var CouriersOpt = {
            selectors: {
                //  Контейнер фомы выбора/ввода нового адреса доставки
                delivery_address: '[name="kiev_couriers_delivery_address"]',
                input_select: '#kiev_couriers_address1_select',
                // Контейнер полей для ввода нового адреса
                form_new_addr: '#kiev_couriers_address1_field',
            }
        };
        var Couriers = new NovaPoshtaMrthodCouriers( CouriersOpt );
        Couriers.showAddressRecipient();
        // Валидация полей нового адреса для способа "курьер Новая Почта"

    }
    this.initNovaPochtaCouriers = function () {
        var CouriersOpt = {
            selectors: {
                //  Контейнер фомы выбора/ввода нового адреса доставки
                delivery_address: '[name="delivery_address"]',
                input_select: '#address1_select',
                // Контейнер полей для ввода нового адреса
                form_new_addr: '#address1_field',

            }
        };



       var options = {

            selectors: {
                delivery_address: '[name="delivery_address"]',
                    address_block: '.check-f-i-address',
                    delivery_block: '[name="delivery_block"]'
            },
            tpl: '',
                streets_suggest_enabled: false,
                address_block_without_delivery_date_class: 'check-f-i-address-without-delivery-date',
                delivery_block_with_time_class: 'check-method-subl-with-time',
                patterns: {
                street_input: '[data-receiver-street-order-id="%order_index%"]',
                    house_input: '[data-receiver-house-order-id="%order_index%"]',
                    flat_input: '[data-receiver-flat-order-id="%order_index%"]'
            },
            suggest: {
                CityRef : self.WarehousesInSelectCity[0].CityRef ,
                tpl: '',
                    language: null,
                    styles: {
                    'z-index': 2
                }
            }
        };
        var input_selectors = {street_input: '[name="order[1][delivery_service][couriers][address][street]"]'};
        new RozetkaStreetSuggest_class().setOptions(options.suggest).init(input_selectors['street_input'])

        var Couriers = new NovaPoshtaMrthodCouriers( CouriersOpt );
        Couriers.showAddressRecipient();
        if(self.DEBAG) console.log( Couriers );
    }
    /**
     * Инит карты Отделений
     * @constructor
     */
    this.InitMap = function () {
        if(self.DEBAG) console.log( 'Before Map Init' );


        // Идентификатор Инициализации карты для выбора складов Новой Почты
        if ( this.NovaPoshtaMapInitialise ) return ;
        this.NovaPoshtaMapInitialise = true ;

        var options = {
            DEBAG : self.DEBAG ,
            Geolocation : self.GeolocationData ,

            // mapEventLink : document.getElementById('delivery-nova_poshta-map-link'),
        } ;
        wgnz11.getModul('ShipmentMaps' , options ).then(function (ShipmentMaps) {
            if(self.DEBAG) console.log( 'Before start GNZ11ShipmentMaps' );

            var moduleShipmetMaps =  function(){
                this.Geolocation = self.GeolocationData ;
            };
            moduleShipmetMaps.prototype = new GNZ11ShipmentMaps(options)
            moduleShipmetMaps.prototype.MAP_PARAMS = {
                // Кнопка для открытия карты
                mapEventLink : document.getElementById('delivery-nova_poshta-map-link'),
                // Хранение двнных Геолакации
                Location : self.GeolocationData ,
                // Хранение складов для выбранного города
                WarehousesInSelectCity : self.WarehousesInSelectCity ,
                // HTML - элемент с картой Новой почты
                map_wrapper : '#npw-map-wrapper',
                Fancybox : {
                    baseClass : 'map_ShipmentNovaPoshta' ,
                }
            }

            var mShipmetMaps = new moduleShipmetMaps();
            mShipmetMaps.getShipmetMap();
            // ShipmetMaps.Init();
        }) ;


    };
    this.getHtmlListMap = function(marker){
       return  '<div class="">'
        +'<div class="popup-map-baloon-number" >Отделение №'+marker.warehousesData.Number+'</div>'
        +'<address class="popup-map-baloon-address">'+marker.warehousesData.ShortAddressRu+'</address>'
        +'<span class="popup-map-baloon-text">'
        // +'Грузоподъемность до '+marker.warehousesData.TotalMaxWeightAllowed+' кг'
        //  +'<br>'
        +'<br>'
        +'График работы отделения:<br>'
        + marker.warehousesData.Schedule
        +'<br>'
        + marker.warehousesData.Phone
        +'<p></p>'
        +'</span>'
        +'</div>'
    }
    /**
     * MAP - Процедуры
     * @type {{changeSidebarState: ShipmentNovaPoshta.map.changeSidebarState, addMarkers: ShipmentNovaPoshta.map.addMarkers, markers: [], convertWarehouseHash: ShipmentNovaPoshta.map.convertWarehouseHash}}
     */
    this.map = {

        /**
         * Преобразование типов отделений
         * @param hash
         * @returns {string}
         */
        convertWarehouseHash : function (hash) {
            switch (hash) {
                case "6f8c7162-4b72-4b0a-88e5-906948c6a92f":
                    return "Міні-відділення";
                    break;
                case "841339c7-591a-42e2-8233-7a0a00f0ed6f":
                    return "Поштове відділення";
                    break;
                case "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc":
                    return "Поштомат приват банку";
                    break;
                case "9a68df70-0267-42a8-bb5c-37f427e36ee4":
                    return "Вантажне відділення";
                    break;
                case "cab18137-df1b-472d-8737-22dd1d18b51d":
                    return "Поштомат InPost";
                    break;
                case "f9316480-5f2d-425d-bc2c-ac7cd29decf0":
                    return "Поштомат";
                    break;
                default:
                    return "";
            }
        },


    }
    /**
     * Очистить и скрыть блок описание для склада
     * @param event
     */
    this.hiddeDescriptionWarehouse = function (event) {
        var $element = $( event.detail.elem ) ;
        $BlockWarehouseDescript = $element
            .closest(self.opts.selectors.element_block)
            .parent()
            .find(self.opts.block_warehouse_descript)
        $BlockWarehouseDescript.empty();
        $BlockWarehouseDescript.addClass('hidden')
    }
    /**
     * Событие - Выбор СКЛАДА из списка - Показать информацию о складе !
     * @param event
     */
    this.showDescriptionWarehouse = function (event) {

        var html ;
        var $element = $( event.detail.elem ) ;
        // График работы отделения
        var scheduleText = $element.data('schedule');
        var warehouseDescript = '' ;

        self.hiddeDescriptionWarehouse(event) ;

        if (scheduleText !== '-: Пн-Вс<br>'){
            warehouseDescript +='<span class="np-sprite schedule">График работы отделения:<br>' + scheduleText +'<span><br>';
        }
        if ( warehouseDescript !== '' ) {
            $BlockWarehouseDescript.append( warehouseDescript );
            $BlockWarehouseDescript.removeClass('hidden');
        }
    };

    /**
     * Событие - Выбор ГОРОДА из списка
     * TODO Передать во все службы доставки
     * @param event
     */
    this.onBeforeSetTextToInput = function (event) {
        var element = event.detail.$elem ;
        var delivery_city = $(element).attr('delivery_city');
        var city = (typeof delivery_city === 'undefined'?$(element).text().trim():delivery_city )

        if(self.DEBAG) console.log( '@onBeforeSetTextToInput city', city  );

        if (!city.length) if (self.DEBAG) {
            console.warn('@onBeforeSetTextToInput CITY NOT FOUND', city.length);
            return ;
        }

        AddressGeneral = new winApiShipmentNovaPoshta.AddressGeneral();
        AddressGeneral.getWarehouses(city , self.resultGetWarehouses)

        /*if (typeof delivery_city === 'undefined' ){
            var city = $(element).attr('text');
            AddressGeneral.getWarehouses(city , self.resultGetWarehouses)
        }else{
            AddressGeneral.getWarehouses( $(element).text() , self.resultGetWarehouses , delivery_city )
        }*/


    };
    /**
     * CollBack - загрузка складов
     * @param Warehouses
     */
    this.resultGetWarehouses = function ( Warehouses ) {
        // Очистить список выбора складов перед загрузкой новых
        // self.DropLinkWarehouses.DestroyDropLink();
        // self.DropLinkWarehouses.emptyDropdownList();
        var arrElement =[];

        var Utilits = new winApiShipmentNovaPoshta.Utilits();
        // Ul
        var $pickups_block =  $(self.opts.pickups_block) ;

        var $newElement ;

        // Создание списка с выбором склада
        $.each(Warehouses.data , function (i, Warehouse ) {

            // Время прибытия отправления
            Warehouse.Reception = Utilits.getShortReception(Warehouse.Reception, self.opts.locale)  ;
            // Прием отправления для отправки в тот же день
            Warehouse.Delivery = Utilits.getShortReception(Warehouse.Delivery , self.opts.locale ) ;
            // График работы
            Warehouse.Schedule = Utilits.getShortReception(Warehouse.Schedule , self.opts.locale ) ;

            $newElement = $(self.opts.pickups_data_element).clone() ;
            var $wrap = $(self.opts.pickups_data_wrap).clone();

            $.each(Warehouse ,function (attr , val) {
                if (attr!=='Reception') { }
                $newElement.attr('data-'+attr , val) ;
            });

            $newElement.text(Warehouse.DescriptionRu) ;


            arrElement.push($newElement) ;

            // $pickups_block.append($newElement)
            // $pickups_block.children('a').wrap($wrap);


            // Записать в глобальнеую переменную для запоминания
            self.WarehousesInSelectCity[i] = Warehouse ;
        })
        self.DropLinkWarehouses.AppendToDropdown(arrElement );
        if(self.DEBAG) console.log( self.WarehousesInSelectCity );
    };
    /**
     * Установка параметров модуля
     * @param setting
     */
    this.setOptionsConfig = function (setting) {
        self.opts = Object.assign({}  , self._defaults , setting  );
    }

};
(function () {
    window.winShipmentMethodNovaPoshta = new ShipmentNovaPoshta();
    winShipmentMethodNovaPoshta.Init();

})();

/*-------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------------*/


var NovaPoshtaMrthodCouriers = function ( options ) {
    var $ = jQuery;
    var self = this ;
    this.DEBAG = true ;

    this.selectors = options.selectors ;

    this.showAddressRecipient = function () {
        // select - выбора адресов
        var $select = $(this.selectors.input_select) ;

        var $parentSelect = $select.parent();
        var $selectOptions = $select.children();

        var $formNewAddr = $( this.selectors.form_new_addr )


        if(self.DEBAG) console.log(  $selectOptions );

        if ( $selectOptions.length < 2 ) {
            $parentSelect.addClass('hidden') ;
            $formNewAddr.removeClass('hidden') ;

           // Валидация полей нового адреса для способа "курьер Новая Почта"
           $formNewAddr.on('focusout' , this.validFormNewAddr )
        }
        console.log(this.selectors)
        $(this.selectors.delivery_address).removeClass('hidden')

    };
    /**
     * Валидация полей нового адреса для способа "курьер Новая Почта"
     * @param event
     */
    this.validFormNewAddr = function (event) {

        var $addressForm =  $(event.target).closest(self.selectors.form_new_addr);
        var $methodRadioElement = $addressForm
            .closest('li')
            .find('.check-method-subl-label > input') ;
        var requiredFieldErr = $addressForm.find('input[_required="required"]').filter(function() {
            return !this.value;
        });
        if (!requiredFieldErr.length){
            $methodRadioElement.addClass('is-valid');
        }else {
            $methodRadioElement.removeClass('is-valid') ;
        }

        methodsValid(event) ;

        if(self.DEBAG) console.log( 'Field Err => ' ,requiredFieldErr );
        if(self.DEBAG) console.log( 'NovaPoshtaMrthodCouriers::validFormNewAddr => event' , event );
    }
}




/**
 * Класс для работы с API Новой почты
 * @constructor
 */
var ApiShipmentNovaPoshta = function () {
    var $ = jQuery ;
    var self = this ;
    self.DEBAG = true ;
    self.setting = {
        url : 'https://api.novaposhta.ua/v2.0/json/' ,
    };
    this.ref_curent
    this.apiKey ;
    /**
     * Модель AddressGeneral
     * @constructor
     */
    this.AddressGeneral = function () {
        var AddressGeneral = this ;

        /**
         * Получить склады для выбранного города
         * @param city
         * @param callBack
         * @param Ref
         */
        AddressGeneral.getWarehouses = function (city , callBack , Ref ) {
            var params = {
                modelName: "AddressGeneral",
                calledMethod: "getWarehouses",
                methodProperties: {
                    // DEMO - Key
                    MarketplacePartnerToken: "005056887b8d-856b-11e6-9121-25f3f736",
                }
            };
            params.methodProperties.CityName = city

           /* if ( typeof Ref !== 'undefined') {
                params.methodProperties.CityRef = Ref
            }else{
                params.methodProperties.CityName = city
            }*/
            self.send('POST', self.setting.url, JSON.stringify(params),
                true, function (response){
                // if(self.DEBAG) console.log( response.data );
                callBack(response) ;
            })
        }
    };
    /**
     * Модель Address
     * @constructor
     */
    this.Address = function () {
        var Address = this ;
        this.modelName = 'Address' ;
        /**
         * Онлайн поиск в справочнике населенных пунктов
         * @param findString str- название города
         * @param callback  function
         */
        Address.searchSettlements = function ( findString , callback ) {
            var params = {
                "modelName": "Address",
                "calledMethod": "searchSettlements",
                "methodProperties": {
                    // "Language": "ru" ,
                    "CityName": findString ,
                    "Limit": 5
                }
            };
            $.ajax({
                type: "POST",
                url: "https://api.novaposhta.ua/v2.0/json/",
                data: JSON.stringify(params),
                success: callback
            });
        }
        /**
         * Онлайн поиск улиц в справочнике населенных пунктов
         * @param options
         * @param callback
         */
        Address.searchSettlementStreets = function ( options , callback) {
            var params = {
                "apiKey": "28e9f4b72a218df4b7e6dcb051afab6b",
                "modelName": this.modelName,
                "calledMethod": "searchSettlementStreets",
                "methodProperties": {
                    // DEMO - Key
                    // Название улицы
                    "StreetName": options.findString,
                    // REF населенного пункта из справочника населенных пунктов Украины
                    "SettlementRef": options.CityRef ,
                    "Limit": 12
                }
            };
            $.ajax({
                type: "POST",
                url: "https://api.novaposhta.ua/v2.0/json/",
                data: JSON.stringify(params),
                success: callback
            });
        };
        /**
         * Справочник улиц компании
         * @param methodProperties {
         *     "StreetName" : str ,
         *     "FindByString" : str
         * }
         * @param callback
         */
        Address.getStreet = function ( methodProperties , callback , completeCallback ) {
            var params = {
                "apiKey": "28e9f4b72a218df4b7e6dcb051afab6b",
                "modelName": this.modelName ,
                "calledMethod": "getStreet",
                "methodProperties":  methodProperties
            };
           $.ajax({
               type: "POST",
               url: "https://api.novaposhta.ua/v2.0/json/",
               data: JSON.stringify(params),
               success: callback ,
               complete  : completeCallback
            });


        };

    }
    /**
     * Отправка данных
     * @param method
     * @param url
     * @param body
     * @param sync
     * @param callback
     */
    this.send = function(method, url, body, sync, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, sync);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var result = JSON.parse(this.responseText);
                    return callback(result);
                }
            }
        };
        xhr.send(body);
    }
    /**
     * Уитлиты для работы с данными НП
     * @constructor
     */
    this.Utilits = function () {
        var Utilits = this ;
        this.Loc = 'RU'
        this.Days = {
            RU: {
                Short:{
                    Monday : 'Пн' ,
                    Tuesday : 'Вт' ,
                    Wednesday : 'Ср' ,
                    Thursday : 'Чт' ,
                    Friday : 'Пт' ,
                    Saturday : 'Сб' ,
                    Sunday : 'Вс' ,
                }
            }
        }
        /**
         * Вычесление графика работы отделения
         * @param Reception
         * @returns {
         *  10:00-20:00: "Пн-Пт"
         *  10:00-17:00: "Сб"
         *  11:30-17:00: "Вс"
         * }
         */
        this.getShortReception = function (Reception , locale ) {
            var UtLoc = Utilits.Loc
            if (locale) {
                UtLoc = locale ;
            }
            var f_day_t = {} ;
            var startDay ;
            $.each(Reception , function ( dayEn, time ) {

                var day =  Utilits.Days[UtLoc]['Short'][dayEn]
                if (typeof f_day_t[time] === 'undefined' ){
                    f_day_t[time] = day ;
                }else{
                    startDay = f_day_t[time].split('-')[0] ;
                    f_day_t[time] = startDay + '-' + day;
                }
            })
            var text = '' ;
            $.each(f_day_t , function (t,day) {
                text += t+': '+day+'<br>'

            })

            return text
        }
    };




};
(function () {
    window.winApiShipmentNovaPoshta = new ApiShipmentNovaPoshta();
})();