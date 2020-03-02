/**
 * Создание карт для служб доставки с выбором отделений
 * @constructor
 */
var GNZ11ShipmentMaps = function ( options ) {

    var opt = {
        DEBAG : false ,
        GOOGLE_MAP_API_KEY : window.GoogleMapsApiKey
    }
    if (typeof options === 'undefined' ) options = opt ;
    if (typeof options.GOOGLE_MAP_API_KEY === 'undefined' ) options.GOOGLE_MAP_API_KEY = window.GoogleMapsApiKey ;
    var self = this ;

    // Массив текущих маркеров на карте
    this.CurrentsMarkers = [] ;
    /**
     * открытое Info Window
     */
    this._opened_info_window;

    this.MAP_PARAMS = { } ;
    this.mapElementSelector = 'npMapsCanv' ;
    this.DEBAG = options.DEBAG ;
    this.GOOGLE_MAP_API_KEY = options.GOOGLE_MAP_API_KEY  ;
    /**
     * Координвты для киева - город по умолчанию
     * @type {{lng: number, name: string, lat: number, coords: {latitude: number, longitude: number}}}
     */
    this.kiev = {lat: 50.4501, lng: 30.5234, coords: {latitude: 50.4501, longitude: 30.5234}, name: "Київ"} ;
    /**
     * Объект карты
     * @type {boolean}
     */
    this.GoogloMap = false ;

    var $ = jQuery ;

  /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * Создать разметку и карту для способа доставки
     */
    this.getShipmetMap = function () {
        // Загрузить ресурсы карты
        self._loadMap().then(function (GoogleMap) {
            self._Listener();

            console.log( GoogleMap )

        },function (err) { console.log(err) });
    };
    /**
     * Создать обработчика событий
     * @private
     */
    this._Listener = function(){
        // Клик на элементе для открытия карты
        self.MAP_PARAMS.mapEventLink.addEventListener("click", function (event) {
            event.preventDefault();
            var html = $(self.MAP_PARAMS.map_wrapper) ;
            wgnz11.__loadModul.Fancybox().then(function (a) {
                a.open( html ,{
                    baseClass: self.MAP_PARAMS.Fancybox.baseClass + ' shipment_maps' ,
                    touch : false ,
                    beforeShow  : function (instance, current){
                        // Добавление маркеров складов на карту для выбранного города
                        self._addMarkers();
                        self._centrMap()
                    },
                    afterShow   : function(instance, current)   {
                        document.getElementById("npw-map-sidebar-ul").addEventListener("click",function(e) {
                            var idx ;
                            if (e.target && e.target.matches("li") ){

                                $( e.target ).addClass('selected');

                                idx = e.target.getAttribute( 'data-idx' ) ;
                                self.changeSidebarState('stateList' ,  idx );
                            }
                        });
                    },
                    afterClose  : function () {
                        // Убрать все маркеры с карты !
                        var markers = self.CurrentsMarkers ;
                        for (var i = 0; i < markers.length; i++) {
                            markers[i].setMap(null);
                        }
                        markers.length = 0;
                        self.CurrentsMarkers = markers ;

                        // Очищаем список сладов
                        var li_element = document.getElementById("npw-map-sidebar-ul");
                        while (li_element.firstChild) {
                            li_element.removeChild(li_element.firstChild);
                        }

                    },
                });
            });
        }) ;
    };
    this.selectors = {
        $select_dropdown_ul : $('.pickups-select-dropdown-l'),
        // WRAP - Списка сладов на карте
        sidebar_ul : 'npw-map-sidebar-ul' ,
    }
    /**
     * Отцентровать карту по
     * @private
     */
    this._centrMap = function () {
        var idx = 0;
        var Map = self.GoogloMap ;
        var marker ;
        var $children_LI = self.selectors.$select_dropdown_ul.children('li');
        var $selctWarehouses = self.selectors.$select_dropdown_ul.find('a.hover').parent('li');
        if ($selctWarehouses[0]){
            idx = $children_LI.index($selctWarehouses)
        }
        if(self.DEBAG) console.log( idx );

        marker = self.CurrentsMarkers[idx] ;

        // Центровка карты по маркеру с анимацией
        Map.panTo(marker.getPosition());
        Map.setZoom(12);

    }

    /**
     * Добавление маркеров складов на карту для выбранного города
     * @private
     */
    this._addMarkers = function () {
        var map = self.GoogloMap ;
        var Warehouses = self.MAP_PARAMS.WarehousesInSelectCity;
        var mapSidebarUl = document.getElementById( self.selectors.sidebar_ul );
        for (var i = 0; i < Warehouses.length; i++) {
            var warehouses = Warehouses[i] ;

            // Создание элементв списка сладов
            var node = document.createElement("li");
            node.addEventListener("click", function (event) {
                self.setMapCenter(event, true);
            });
            node.setAttribute("loc", "(" + warehouses.Latitude + "," + warehouses.Longitude + ")");
            node.setAttribute("data-idx", i);
            // Создание элемета списка для выбора склада
            node.innerHTML = self.getHtmlListMap({ warehousesData : warehouses }) ;
            mapSidebarUl.appendChild(node);

            // Создание маркеров
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(warehouses.Latitude, warehouses.Longitude),
                map: map,
                name: warehouses.CityDescription,
                vicinity: warehouses.Description,
                number: warehouses.Number,
                phone: warehouses.Phone,
                // type: self.map.convertWarehouseHash(warehouses.TypeOfWarehouse),
                maxWeight: warehouses.TotalMaxWeightAllowed,
                icon: 'https://apimgmtstorelinmtekiynqw.blob.core.windows.net/content/MediaLibrary/Widget/img/np-marker.png',
                index: i,
                warehousesData : warehouses ,
            });
            self.CurrentsMarkers.push(marker);
            /**
             * Обработчик события - клик по маркеру
             */
            google.maps.event.addListener( marker , 'click', function () {
                self.changeSidebarState('stateDetails', this.index);
            });
        }
    };

     /**
     *
     * @param event
     * @param changeState
     */
    this.setMapCenter = function (event, changeState) {

        // Закрыть другие Info Window
        self._closeOpenedInfoWindow();

        var idx = 0;
        var map = self.GoogloMap ;
        var li = event.target.closest('li') ;
        var loc;
        loc =li.getAttribute("loc").replace('(', '').replace(')', '').split(',');
        idx = li.getAttribute ('data-idx');

        $(li).parent().find('li.selected').removeClass('selected')
        $(li).addClass('selected')

        var marker = self.CurrentsMarkers[idx] ;

        var eventSelectWarehouses = new CustomEvent('onAfterSelectWarehouses', {  'detail': { warehousesData: marker.warehousesData , } });
        if(self.DEBAG) console.log( 'Method "gnz11.ShipmentMaps::setMapCenter" Custom Event' , marker.warehousesData , );
        document.dispatchEvent(eventSelectWarehouses);

        var locObj = {  lat: loc[0] * 1, lng: loc[1] * 1 };
        map.setCenter(new google.maps.LatLng(locObj));
        map.setZoom(16);


        if (changeState) {
            self._touchMarker(marker)
        }
    }

    this._touchMarker = function (marker) {
        var map = self.GoogloMap ;
        marker.setAnimation(google.maps.Animation.BOUNCE);

        setTimeout(function () {
            // Создать Html для Info Window
            var hrmlMarker = self.getHtmlListMap(marker) ;
            marker.info = new google.maps.InfoWindow({
                content: hrmlMarker
            });

            self._opened_info_window = marker.info ;
            self._opened_info_window.open( map , marker );
            // остановить анимацию маркера !
            marker.setAnimation(null);
        }, 2120);
    }

    /**
     * EVT - Клик по складу
     * @param type
     * @param idx
     */
    this.changeSidebarState = function  (type, idx) {
        var url = '';
        switch (type) {
            // Клик по маркеру
            case 'stateDetails':

                // Закрыть другие Info Window
                self._closeOpenedInfoWindow();

                self.animationListMapWarehouse(idx);

                var Map = self.GoogloMap ;
                var marker = self.CurrentsMarkers[idx] ;

                var eventSelectWarehouses = new CustomEvent('onAfterSelectWarehouses', {  'detail': { warehousesData: marker.warehousesData , } });
                if(self.DEBAG) console.log( 'Method "gnz11.ShipmentMaps::setMapCenter" Custom Event' , marker.warehousesData , );
                document.dispatchEvent(eventSelectWarehouses);

                var hrmlMarker = self.getHtmlListMap(marker) ;

                // Центровка карты по маркеру с анимацией
                Map.panTo(marker.getPosition());
                Map.setZoom(15);


                marker.info = new google.maps.InfoWindow({
                    content: hrmlMarker
                });
                self._opened_info_window = marker.info ;
                self._opened_info_window.open(Map, marker);

                if(self.DEBAG) console.log( self._opened_info_window );

                if(self.DEBAG) console.log( self.CurrentsMarkers[idx] );



                /*stateList.style.display = "none";
                stateDetails.style.display = "block";

                mapLogo.style.display = "none";
                mapBack.style.display = "block";

                url = encodeURI("https://novaposhta.ua/ru/office/view/id/" + markers[idx].number + "/city/" + markers[idx].name);

                stateDetails.innerHTML = "<div class='npw-details-title'>" + "Відділення №" + markers[idx].number + "</div>"
                    + "<div>" + "Адреса: " + markers[idx].vicinity + "</div>"
                    + "<div>" + "Телефон: " + markers[idx].phone + "</div>"
                    + "<div>" + "Тип: " + markers[idx].type + "</div>"
                    + "<div>" + "Обмеження ваги: " + markers[idx].maxWeight + "</div>"
                    + "<div>" + "<a href=" + url + " target='_blank'>Більше інформації на сайті</a></div>";*/

                break;
            case 'stateList':

                console.log()

                /*stateList.style.display = "block";
                stateDetails.style.display = "none";

                mapLogo.style.display = "block";
                mapBack.style.display = "none";

                stateDetails.innerHTML = "";*/

                break;
        }
    };

    /**
     * Скролл списка складов к выбранному складу
     * @param idx
     */
    this.animationListMapWarehouse = function (idx) {
        var $parentUl = $('#npw-map-sidebar-ul') ;
        var $silectLi = $parentUl.find('[data-idx="'+idx+'"]') ;
        $silectLi.addClass('selected');
        $parentUl.animate({
            scrollTop: $silectLi.offset().top - $parentUl.offset().top +
                $parentUl.scrollTop()
        });
    }

    /**
     * Закрыть активные Info windows !!!
     */
    this._closeOpenedInfoWindow = function() {
        if(self.DEBAG) console.log( '_closeOpenedInfoWindow', self._opened_info_window );
        if (self._opened_info_window) {
            self._opened_info_window.close()
        }
    },
    /**
     * Создание элемета списка для выбора склада
     * @param marker
     * @returns {string} - HTML <LI />
     */
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
     * Создать карту
     * @returns {Promise<unknown>}
     * @private
     */
    this._loadMap =  function () {
        return new Promise(function (resolve , reject) {
            if (self.GoogloMap) resolve ( self.GoogloMap );
            if(self.DEBAG) console.log(self.GoogloMap  );
            Promise.all([
                wgnz11.load.css('/libraries/GNZ11/Api/Shipment/NovaPoshta/assets/css/nova_poshta_map.css') ,
                wgnz11.load.js('/libraries/GNZ11/Api/Shipment/NovaPoshta/assets/js/nova_poshta_map.js'),
                wgnz11.load.js('https://maps.googleapis.com/maps/api/js?language=ru&key=' + self.GOOGLE_MAP_API_KEY ) ,
            ]).then(function ( a)
            {
                // найти элемент если его нет то создать !
                var elementMap = self.getElementMap( self.mapElementSelector );
                if ( typeof google === 'object'){
                    self.GoogloMap = new google.maps.Map( elementMap , {
                        center: self.getMapCenter(),
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true
                    });
                    // Создать HTML разметку для карт способов доставки
                    self._addHtmlMapBlock();
                    resolve ( self.GoogloMap );
                }
            },function (error) { reject(error) }) ;
        });
    }

    /**
     * Получение или создание нового элемента для вставки карты
     * @param selector
     */
    this.getElementMap = function (selector) {
        var el ;
        el = document.getElementById(selector);
        if (!el){
            var div = document.createElement('div');
            div.setAttribute( "id", selector );
            document.body.append(div);
            el = document.getElementById(selector);
        }
        return el ;
    };

    /**
     * Определение центра карты
     * @returns {google.maps.LatLng}
     */
    this.getMapCenter =function () {
        var MapCenter ;
        if ( !self.MAP_PARAMS.Location   ) {
            MapCenter = new google.maps.LatLng(self.kiev.lat, self.kiev.lng) ;
        }else{
            MapCenter = new google.maps.LatLng( self.MAP_PARAMS.Location.geometry.location.lat , self.MAP_PARAMS.Location.geometry.location.lng ) ;
            if(self.DEBAG) console.log( this.myLocation );
            this.createMarker({
                lat: self.MAP_PARAMS.Location.geometry.location.lat ,
                lng: self.MAP_PARAMS.Location.geometry.location.lng
            });
        }
        return MapCenter
    }

    this.createMarker = function(place) {
        /*var marker = new google.maps.Marker({
            map: map,
            position: place
        });*/

    }


    /**
     * Создать HTML разметку для модальных карт способов доставки
     * @private
     */
    this._addHtmlMapBlock = function () {
         var root = document.createElement("div");
         root.id = "npw-map-wrapper";

         var sidebar = document.createElement("div");
         sidebar.id = "npw-map-sidebar";

        var header = document.createElement("div");
        header.id = "npw-map-sidebar-header";

        var logo = document.createElement("div");
        logo.id = "npw-map-logo";
        var content = document.createTextNode('Новая Почта');
        logo.appendChild( content );

        header.appendChild(logo);

         var MapsCanv = document.getElementById( self.mapElementSelector );
         if ( !MapsCanv ){
             MapsCanv = document.createElement("div");
             MapsCanv.id = self.mapElementSelector;
         }



        var stateList = document.createElement("div");
        stateList.id = "npw-map-state-list";

        /*var citiesSelect = document.createElement("select");
        citiesSelect.id = "npw-cities";
        citiesSelect.setAttribute("name", "npw-cities");
        citiesSelect.setAttribute("onchange", "NPWidgetMap.onCityChange(this.value)");
        stateList.appendChild(citiesSelect);*/

         var ul = document.createElement("ul");
         ul.id = "npw-map-sidebar-ul";

         sidebar.appendChild(header);
         stateList.appendChild(ul);
         sidebar.appendChild(stateList);

         root.appendChild(sidebar);
         root.appendChild(MapsCanv);
         document.body.appendChild(root);
    }


}