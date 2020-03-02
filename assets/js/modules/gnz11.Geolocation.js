var GNZ11Geolocation = function ( ) {
    var $ = jQuery ,
        map ,
        self = this ,
        kiev = {
            lat: 50.4501,
            lng: 30.5234,
            coords: {
                latitude: 50.4501,
                longitude: 30.5234
            },
            name: "Київ"
        };

    self.DEBAG = false ;

    self.location = false ;
    self.locality = false ;
    self._defaults = {
        language    : 'uk' , // язык - (uk,ru)
        validator   : function(){},
        onChange    : function(){} ,
    } ;

    this.Init = function () {
        if(self.DEBAG) console.log( 'Before start Geolocation' ); 
         


        if ( typeof self.opts.MapKey === 'undefined') console.warn('Отсутствует ключ Google Maps')
        if (navigator.geolocation) {
            // getCurrentPosition || watchPosition
            /**
             * https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
             */
            navigator.geolocation.getCurrentPosition(
                function successCallback(loc) {
                    if(self.DEBAG) console.log( "location" ,  self.location );
                    if (!self.location){
                        self.location =  loc ;
                        self.setCurrentLocation(loc);
                    }
                },
                function errorCallback(err) {
                    console.log(err);
                    // self.setCurrentLocation(kiev);
                });
        } else {
            if(self.DEBAG) console.log( 'Init - navigator.geolocation', navigator.geolocation );
            // self.setCurrentLocation(kiev);
        }

    }
    this.setCurrentLocation = function (loc) {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reverseGeocodingReady);
        oReq.open(
            "GET",
            "https://maps.googleapis.com/maps/api/geocode/json?latlng="
            + loc.coords.latitude + ","
            + loc.coords.longitude
            + "&language=" + self.opts.language
            +"&result_type=locality"
            +"&key=" + self.opts.MapKey
        );
        oReq.send();

        /**
         * CollBack - обратное геокодирование
         */
        function reverseGeocodingReady() {
            var r = JSON.parse(this.responseText);
            self.locality = r['results'];
            // Событие - После получения данных геолокации

            // Если указан элемент для вставки названия города - установить название
            if (typeof self.opts.element !== 'undefined') {
                self.setDataElem();
            }
            /**
             * Событие - после получения данных локации
             * @type {CustomEvent<{locality: (boolean|*)}>}
             */
            var event = new CustomEvent('onAfterGeolocationDataSet', {  'detail': { locality: self.locality , } });
            if(self.DEBAG) console.log( 'Method "reverseGeocodingReady" Custom Event' , event.type , self.locality  );
            document.dispatchEvent(event);



        }
    }
    /**
     * Установка города в элемент нв странице
     */
    this.setDataElem = function () {
        var element = self.opts.element ;
        var data_long_name = self.locality[0].address_components[0].long_name
        $(element).val(data_long_name);

    }
    /**
     * Установка параметров модуля gnz11.Geolocation
     * @param setting {}
     */
    this.setConfig = function (setting) {
        self.opts = Object.assign({}  , self._defaults , setting  );
        if(self.DEBAG) console.log( 'gnz11.Geolocation set Config' , self.opts );
    };

}



