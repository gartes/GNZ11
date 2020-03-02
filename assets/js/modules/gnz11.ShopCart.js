var GNZ11ShopCart = function ( options ) {

    var self = this ;
    /**
     * EVENT - После того выбора отделение доставки
     * @param event
     * @constructor
     */
    this.AfterSetWarehouse = function (event) {
        if(self.DEBAG) console.log( 'EVT-H : AfterSetWarehouse => ',  event);
    }
}