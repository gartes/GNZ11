function Gnz11AppGoogleMap (options){
    "use strict";
    var self = this ;
    self.DEBAG = true;
    this.GoogleMapsApiKey = options.GoogleMapsApiKey ;
    this.mapElement = options.mapElement ;
    this.myLocation = options.myLocation ;
    this.map;
    this.markers = [],
    this.kiev = {lat: 50.4501, lng: 30.5234, coords: {latitude: 50.4501, longitude: 30.5234}, name: "Київ"} ;
    /**
     * Иницифлизация карты Google
     * @param elementSelector - Селектор элемента на котором создавать карту
     */
    this.initMap = function ( elementSelector ) {
        // Если элемент не передан - то берем из глобальных переменных
        if (typeof elementSelector === 'undefined') {
            elementSelector = this.mapElement ;
        }
        // найти элемент если его нет то создать !
        var elementMap = self.getElementMap( elementSelector );

        wgnz11.load.js('https://maps.googleapis.com/maps/api/js?language=ru&key=' + self.GoogleMapsApiKey ).then(function (a) {
            self.map = new google.maps.Map( elementMap , {
                center: self.getMapCenter(),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            });
            return self.map ;
        },function (err) {
            if(self.DEBAG) console.log( err );
        })
    };
    this.createMarker = function(place) {
        console.log( place)
        var marker = new google.maps.Marker({
            map: self.map,
            position: place
        });
    }


    /**
     * Определение центра карты
     * @returns {google.maps.LatLng}
     */
    this.getMapCenter =function () {
        var MapCenter ;
        if ( !this.myLocation   ) {
            MapCenter = new google.maps.LatLng(self.kiev.lat, self.kiev.lng)
        }else{
            MapCenter = new google.maps.LatLng(this.myLocation.geometry.location.lat, this.myLocation.geometry.location.lng)
            if(self.DEBAG) console.log( this.myLocation );
            this.createMarker({
                lat: this.myLocation.geometry.location.lat ,
                lng: this.myLocation.geometry.location.lng
            });
        }
        return MapCenter
    }
    /**
     * Получение или создание нового элемента для вставки карты
     * @param selector
     */
    this.getElementMap = function (selector) {
        var el = document.getElementById(selector);
        if (!el){
            var div = document.createElement('div');
            div.setAttribute( "id", selector );
            document.body.append(div);
            var el = document.getElementById(selector);
        }
        return el ;
    }
}



class Gnz11AppMap {
    "use strict";
    open_button = 'aaaaa';

    constructor(height, width) {
        this.DEBAG = true;
        this.map;
        this.apInitialized = false ;
        this.kiev = {lat: 50.4501, lng: 30.5234, coords: {latitude: 50.4501, longitude: 30.5234}, name: "Київ"} ;
        this.zeroLocalWarehousesFound = false ;
        this.markers = [] ;
        this.firstMarker = {} ;
    };
    filterWarehouses(searchString) {

        var searchInput = searchString.toLowerCase();
        var list = mapSidebarUl.children;

        for (var i = 0; i < list.length; i++) {
            if (list[i].innerHTML.toLowerCase().indexOf(searchInput) > -1 || searchInput == '') {
                list[i].style.display = "block";
            } else {
                list[i].style.display = "none";
            }
        }
    }
    _onMapToggle() {
        !this.mapWrapper.classList.contains('npw-display-block') ?
            this.mapWrapper.classList.add('npw-display-block') :
            this.mapWrapper.classList.remove('npw-display-block');

        !this.mapOpenButton.classList.contains('npw-map-open-button-opened') ?
            this.mapOpenButton.classList.add('npw-map-open-button-opened') :
            this.mapOpenButton.classList.remove('npw-map-open-button-opened');

        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var clientWidth = document.body.clientWidth || window.innerWidth;

        this.mapWrapper.style.top = (scrollTop + 15) + "px";
        this.mapWrapper.style.left = (clientWidth -  this.mapWrapper.offsetWidth) / 2 + "px";
    }
    _addListener(){
        var self = this ;
        this.mapOpenButton = document.getElementById('delivery-nova_poshta-map-link');
        this.mapWrapper = document.getElementById('npw-map-wrapper');
        this.mapSidebarUl = document.getElementById('npw-map-sidebar-ul');
        this.citiesList = document.getElementById('npw-cities');
        this.stateList = document.getElementById('npw-map-state-list');
        this.stateDetails = document.getElementById('npw-map-state-details');
        this.mapLogo = document.getElementById('npw-map-logo');
        this.mapBack = document.getElementById('npw-map-back');
        this.inputFilter = document.getElementById('npw-map-sidebar-search');
        this.closeButton = document.getElementById('npw-map-close-button');

        this.mapOpenButton.addEventListener("click", function () {
            self._onMapToggle();
            if (!self.mapInitialized) {
                self.initMap();
            }
        }, false);
        this.mapBack.addEventListener("click", function () {
            self.changeSidebarState('stateList');
        });
        this.inputFilter.addEventListener("input", function (e) {
            self.filterWarehouses(e.target.value);
        });
        this.closeButton.addEventListener("click", function () {
            self._onMapToggle();
            
        });
    }
    SetHtml() {
        /*var root = document.createElement("div");
        root.id = "npw-map-wrapper";

        var sidebar = document.createElement("div");
        sidebar.id = "npw-map-sidebar";

        var header = document.createElement("div");
        header.id = "npw-map-sidebar-header";

        var logo = document.createElement("div");
        logo.id = "npw-map-logo";

        var back = document.createElement("div");
        back.id = "npw-map-back";

        var input = document.createElement("input");
        input.id = "npw-map-sidebar-search";
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Введіть номер відділення");

        header.appendChild(logo);
        header.appendChild(back);
        header.appendChild(input);

        var stateList = document.createElement("div");
        stateList.id = "npw-map-state-list";

        var citiesSelect = document.createElement("select");
        citiesSelect.id = "npw-cities";
        citiesSelect.setAttribute("name", "npw-cities");
        citiesSelect.setAttribute("onchange", "NPWidgetMap.onCityChange(this.value)");

        var ul = document.createElement("ul");
        ul.id = "npw-map-sidebar-ul";

        stateList.appendChild(citiesSelect);
        stateList.appendChild(ul);

        var detailsList = document.createElement("div");
        detailsList.id = "npw-map-state-details";

        sidebar.appendChild(header);
        sidebar.appendChild(stateList);
        sidebar.appendChild(detailsList);

        var map = document.createElement("div");
        map.id = "npw-map";

        var closeButton = document.createElement("div");
        closeButton.id = "npw-map-close-button";

        root.appendChild(sidebar);
        root.appendChild(map);
        root.appendChild(closeButton);

        document.body.appendChild(root);*/
        this._addListener()
    }
    initMap() {
        var self = this ;
        this.mapInitialized = true;
        this.successCallback = function(loc) {
            self.setCurrentLocation(loc);
        }
        this.errorCallback = function(err){
            console.log(err);
            self.setCurrentLocation(self.kiev);
        }

        alert('initMap 1')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( this.successCallback , this.errorCallback );
        } else {
            alert('setCurrentLocation 2')
            self.setCurrentLocation(self.kiev);
        }



        this.map = new google.maps.Map(document.getElementById('npw-map'), {
            center: new google.maps.LatLng(this.kiev.lat, this.kiev.lng),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        });





    };
    setCurrentLocation(loc) {

        console.log(loc);

        this.map.setCenter(new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude));

        this.createMarker({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude
        });


        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", this.reverseGeocodingReady);
        oReq.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng="
            + loc.coords.latitude + ","
            + loc.coords.longitude
            + "&language=uk&result_type=locality&key=AIzaSyAPhm7Q29X5ldwjLtA7IMYHU_0xATiWK3A");
        oReq.send();


    }


    reverseGeocodingReady() {

        var r = JSON.parse(this.responseText);
        var localities = r['results'];

        console.log(localities);

        if (localities.length === 0) {
            userLocationCityName = kiev.name;
            getCities(userLocationCityName, true);
        } else {
            for (var i = 0; i < localities.length; i++) {
                if (localities[i].types.indexOf('locality') !== -1) {
                    userLocationCityName = localities[i]['address_components'][0]['long_name'];
                    getCities(userLocationCityName);
                    //console.log('found locality is : ' + userLocationCityName);
                    break;
                }
            }
        }

        renderWarehouses(userLocationCityName);
    }


}
/*--------------------------------------------------------------------------------------------------------------------*/
;window.onload = (function () {

    "use strict";

    /*var root = document.createElement("div");
    root.id = "npw-map-wrapper";

    var sidebar = document.createElement("div");
    sidebar.id = "npw-map-sidebar";

    var header = document.createElement("div");
    header.id = "npw-map-sidebar-header";

    var logo = document.createElement("div");
    logo.id = "npw-map-logo";

    var back = document.createElement("div");
    back.id = "npw-map-back";

    var input = document.createElement("input");
    input.id = "npw-map-sidebar-search";
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Введіть номер відділення");

    header.appendChild(logo);
    header.appendChild(back);
    header.appendChild(input);

    var stateList = document.createElement("div");
    stateList.id = "npw-map-state-list";

    var citiesSelect = document.createElement("select");
    citiesSelect.id = "npw-cities";
    citiesSelect.setAttribute("name", "npw-cities");
    citiesSelect.setAttribute("onchange", "NPWidgetMap.onCityChange(this.value)");

    var ul = document.createElement("ul");
    ul.id = "npw-map-sidebar-ul";

    stateList.appendChild(citiesSelect);
    stateList.appendChild(ul);

    var detailsList = document.createElement("div");
    detailsList.id = "npw-map-state-details";

    sidebar.appendChild(header);
    sidebar.appendChild(stateList);
    sidebar.appendChild(detailsList);

    var map = document.createElement("div");
    map.id = "npw-map";

    var closeButton = document.createElement("div");
    closeButton.id = "npw-map-close-button";

    root.appendChild(sidebar);
    root.appendChild(map);
    root.appendChild(closeButton);

    document.body.appendChild(root);*/
})();

var NPWidgetMap = (function () {
    "use strict";
    /*var map,
        userLocationCityName,
        mapWrapper = document.getElementById('npw-map-wrapper'),
        mapOpenButton = document.getElementById('npw-map-open-button'),
        mapSidebarUl = document.getElementById('npw-map-sidebar-ul'),
        citiesList = document.getElementById('npw-cities'),
        stateList = document.getElementById('npw-map-state-list'),
        stateDetails = document.getElementById('npw-map-state-details'),
        mapLogo = document.getElementById('npw-map-logo'),
        mapBack = document.getElementById('npw-map-back'),
        inputFilter = document.getElementById('npw-map-sidebar-search'),
        closeButton = document.getElementById('npw-map-close-button'),
        mapInitialized = false,
        kiev = {lat: 50.4501, lng: 30.5234, coords: {latitude: 50.4501, longitude: 30.5234}, name: "Київ"},
        zeroLocalWarehousesFound = false,
        markers = [],
        firstMarker = {};*/

    function send(method, url, body, sync, callback) {
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

    function setMapCenter(event, changeState) {
        /*
        var loc;

        if ('loc' in event.target.attributes) {
            loc = event.target.attributes.loc.value.replace('(', '').replace(')', '').split(',');
        } else {
            loc = event.target.parentNode.getAttribute("loc").replace('(', '').replace(')', '').split(',');
        }

        var locObj = {
            lat: loc[0] * 1,
            lng: loc[1] * 1
        };

        map.setCenter(new google.maps.LatLng(locObj));

        if (changeState) {

            var idx = 0;

            if ('data-idx' in event.target.attributes) {
                idx = event.target.attributes['data-idx'].value;
            } else {
                idx = event.target.parentNode.getAttribute("data-idx");
            }

            changeSidebarState('stateDetails', idx);
            markers[idx].setAnimation(google.maps.Animation.BOUNCE);

            setTimeout(function () {
                markers[idx].setAnimation(null);
            }, 2120)
        }*/
    }

    function changeSidebarState(type, idx) {

        var url = '';

        switch (type) {
            case 'stateDetails':

                stateList.style.display = "none";
                stateDetails.style.display = "block";

                mapLogo.style.display = "none";
                mapBack.style.display = "block";

                url = encodeURI("https://novaposhta.ua/ru/office/view/id/" + markers[idx].number + "/city/" + markers[idx].name);

                stateDetails.innerHTML = "<div class='npw-details-title'>" + "Відділення №" + markers[idx].number + "</div>"
                    + "<div>" + "Адреса: " + markers[idx].vicinity + "</div>"
                    + "<div>" + "Телефон: " + markers[idx].phone + "</div>"
                    + "<div>" + "Тип: " + markers[idx].type + "</div>"
                    + "<div>" + "Обмеження ваги: " + markers[idx].maxWeight + "</div>"
                    + "<div>" + "<a href=" + url + " target='_blank'>Більше інформації на сайті</a></div>";

                break;

            case 'stateList':

                stateList.style.display = "block";
                stateDetails.style.display = "none";

                mapLogo.style.display = "block";
                mapBack.style.display = "none";

                stateDetails.innerHTML = "";

                break;
        }

    }



    function getCities(city) {

        send('POST', 'https://api.novaposhta.ua/v2.0/json/', JSON.stringify({
            modelName: "Address",
            calledMethod: "getCities",
            methodProperties: {
                MarketplacePartnerToken: "005056887b8d-856b-11e6-9121-25f3f736"
            }
        }), true, function (res) {

            var data = res.data;

            //console.log('cities ', data);
            //console.log();

            for (var i = 0; i < data.length; i++) {

                var el = document.createElement("option");
                el.setAttribute("value", data[i]['Description']);
                el.appendChild(document.createTextNode(data[i]['Description']));
                citiesList.appendChild(el);

            }

            citiesList.value = city || kiev.name;
        });
    }

    function onCityChange(cityName) {
        console.log(cityName);

        document.getElementById('npw-map-sidebar-search').value = '';

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }

        markers.length = 0;

        renderWarehouses(cityName, true, true);
        changeSidebarState('stateList');
    }

    function renderWarehouses(city, isSetCenter, isFromCityChange) {
        send('POST', 'https://api.novaposhta.ua/v2.0/json/', JSON.stringify({
            modelName: "AddressGeneral",
            calledMethod: "getWarehouses",
            methodProperties: {
                // DEMO - Key
                MarketplacePartnerToken: "005056887b8d-856b-11e6-9121-25f3f736",
                CityName: city
            }
        }), true, function (response) {
            //console.log('userLocationCityName ' + city);

            var warehouses = response.data;
            //console.log('warehouses ', warehouses);

            if (warehouses.length === 0) {
                //console.log('warehouses.length === 0');
                userLocationCityName = kiev.name;
                renderWarehouses(kiev.name);
                zeroLocalWarehousesFound = true;
            }

            while (mapSidebarUl.firstChild) {
                mapSidebarUl.removeChild(mapSidebarUl.firstChild);
            }

            var sp = [];

            for (var i = 0; i < warehouses.length; i++) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(warehouses[i].Latitude, warehouses[i].Longitude),
                    map: map,
                    name: warehouses[i].CityDescription,
                    vicinity: warehouses[i].Description,
                    number: warehouses[i].Number,
                    phone: warehouses[i].Phone,
                    type: convertWarehouseHash(warehouses[i].TypeOfWarehouse),
                    maxWeight: warehouses[i].TotalMaxWeightAllowed,
                    icon: 'https://apimgmtstorelinmtekiynqw.blob.core.windows.net/content/MediaLibrary/Widget/img/np-marker.png',
                    index: i
                });

                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function () {
                    changeSidebarState('stateDetails', this.index);
                });

                sp = warehouses[i]['Description'].split(":");

                if (sp.length < 2) {
                    sp[1] = sp[0];
                }

                var node = document.createElement("li");
                node.addEventListener("click", function (event) {
                    NPWidgetMap.setMapCenter(event, true);
                });
                node.setAttribute("loc", "(" + warehouses[i].Latitude + "," + warehouses[i].Longitude + ")");
                node.setAttribute("data-idx", i);
                node.innerHTML = "<div class='npw-list-city'>" + warehouses[i]['CityDescription'] + "</div>" +
                    "<div class='npw-list-warehouse' >" + sp[0] + "</div>" +
                    "<div class='npw-list-address'>" + sp[1] + "</div>";

                mapSidebarUl.appendChild(node);

            }

            if (zeroLocalWarehousesFound && warehouses.length > 0 || isSetCenter === true) {

                firstMarker = {
                    target: {
                        attributes: {
                            loc: {
                                value: "(" + warehouses[0]['Latitude'] + "," + warehouses[0]['Longitude'] + ")"
                            }
                        }
                    }
                };

                setMapCenter(firstMarker);

                if (!isFromCityChange) {
                    citiesList.value = kiev.name;
                }

            }

        });
    }

    function convertWarehouseHash(hash) {

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

    }

    return {
        setMapCenter: setMapCenter,
        onCityChange: onCityChange,
        state: changeSidebarState
    }

})();