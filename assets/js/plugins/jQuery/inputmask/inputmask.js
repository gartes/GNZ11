window.mobOperator = [
    {
        k: '050',
        o: 'mtc'
    }, {
        k: '099',
        o: 'mtc'
    }, {
        k: '066',
        o: 'mtc'
    }, {
        k: '095',
        o: 'mtc'
    }, {
        k: '067',
        o: 'kyivstar'
    }, {
        k: '098',
        o: 'kyivstar'
    }, {
        k: '096',
        o: 'kyivstar'
    }, {
        k: '097',
        o: 'kyivstar'
    }, {
        k: '093',
        o: 'live'
    }, {
        k: '063',
        o: 'live'
    }, {
        k: '073',
        o: 'live'
    }, {
        k: '068',
        o: 'Beeline'
    }, {
        k: '091',
        o: 'Utel'
    }, {
        k: '092',
        o: 'peoplenet'
    }, ];

var GNZ11_Inputmask = function ( elSelector , Settings ) {
    var $ = jQuery ;
    var self = this;
    this._defaults = {
        mask : '+38(111)000-00-00' ,
        placeholder :   true ,
        country:'UA',
        type : 'phone' ,
        onChange : function () {} ,
        onKeyPress : function () {} ,
        onComplete : function () {} ,
    } ;




    this.Inint = function ( elSelector , Settings ) {
        self.opts = Object.assign({}  , self._defaults , Settings  );
        self.addWrap(elSelector);
        self.setMask[self.opts.type](elSelector) ;
        return self ;
    }
    this.isComplete = false ;
    /**
     * Установка маски
     * @type {{phone: GNZ11_Inputmask.setMask.phone}}
     */
    this.setMask = {
        /**
         * Для телефонов
         * @param elSelector
         */
        phone : function (elSelector) {
            self.opts ;
            $( elSelector ).mask(self.opts.mask ,{
                onChange: function( val , event ){
                    self._setOperatorIcon(event.target )
                },
                onKeyPress:function(val,event,currentField,options){
                    currentField[0].style.setProperty("--c", "blue");

                    console.log( val )
                    console.log( currentField[0] )
                    console.log( $(currentField).attr('placeholder') )

                    if ( typeof self.opts.onKeyPress ==='function' ) {
                        self.opts.onKeyPress( val,event,currentField,options );
                    }
                },
                onComplete : function ( val , event , currentField , d  ) {
                    console.log('setMask onComplete')
                    if ( typeof self.opts.onComplete ==='function' && !self.isComplete ) {
                        self.opts.onComplete( val , event , currentField , d );
                        self.isComplete = true ;
                        setTimeout(function () {
                            self.isComplete = false ;
                        },3000 )
                    }else {
                        $( elSelector ).addClass('Mask-Complete');
                    }
                }
            });
        },
    };

    this._placeholderModified = function (){

    }

    /**
     * Добавить обвертку к маркеруемому полю
     * @param elSelector str - селектрор поля
     */
    this.addWrap = function (elSelector) {
        var wrp = $('<div />' , {
            class : 'wrapMaskPhone'
        });
        var $maskEl = $(elSelector);
        var $parent = $maskEl.parent();
        // var $labelElPrev = $maskEl.prev('label')
        // var $labelElNext = $maskEl.next('label')

        $parent.wrap( wrp );
        $maskEl.attr('placeholder' , self.opts.mask)
    }
    /**
     * Установщик иконки мобильного оператора для полей телефонов
     * @param Settings
     * @param currentField
     * @private
     */
    this._setOperatorIcon = function (  currentField) {

        // console.log( self.opts )

        if (self.opts.country != 'UA') return;
        var v = $(currentField).val();
        if (v.length >= 7) {
            var result = v.match(/\d+/g);
            $.each(mobOperator, function (i, o) {
                if (result[1] == +o.k) {
                    $(currentField)
                        .addClass('oprValid')
                        .parent()
                        .attr('op', o.o)
                        .addClass('on');
                }
            });
        } else {
            $(currentField)
                .removeClass('oprValid')
                .parent()
                .attr('op', '')
                .removeClass('on')
        }
    }
};
(function () {
    window.Inputmask =  new GNZ11_Inputmask()
})()


/*var mergeOpts = function (opts1, opts2) {
        var rez = $.extend(true, {}, opts1, opts2);
        $.each(opts2, function (key, value) {
            if ($.isArray(value)) {
                rez[key] = value;
            }
        });
        return rez;
    };*/

