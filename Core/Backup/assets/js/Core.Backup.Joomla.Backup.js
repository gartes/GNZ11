window.CoreBackupJoomlaBackup = function () {
    var $ = jQuery ;
    var self = this;
    this.__group = 'system';
    this.__plugin = 'joomshoping_prod_sys' ;
    this.selectors = {
            baseClass : 'Backup-list-modal' ,
            btnRestore : '#toolbar-backup-restore button',

    };
    this.AjaxDefaultData = {
        group : this.__group,
        plugin : this.__plugin ,
        option : 'com_jshopping' ,
        format : 'json' ,
        task : null ,
    }
    this.BackupComponent = false ;
    this.SavedFile = false ;
    this.Colback = function () {}
    this.Init = function(){
        $(self.selectors.btnRemove).on('click' , self.RemoveBackupComponent )
    }

    this.RunBackupComponent = function (r) {
        var Data = {} ;
        Data.BackupComponent = self.BackupComponent ;
        if ( typeof r !== 'undefined' ){
            Data.InfoStatic = r.data ;
        }
        this.getModul("Ajax").then(function (Ajax) {
            var data = $.extend(true, self.AjaxDefaultData, Data);
            data.task = 'RunBackupComponent';
            Ajax.send(data).then(function (r) {
                if (r.data.Timeout){
                    alert('Timeout');
                    self.Colback();
                    return ;
                }
                if ( !r.data.table ) {
                    if ( !self.SavedFile ){
                        r.data.SavedFile = true ;
                        self.SavedFile = true ;
                        self.RunBackupComponent(r);
                        return;
                    }
                    if (self.SavedFile){
                        console.log( r.messages )
                        alert(r.messages.message[0]);
                        self.Colback();
                    }
                    return ;
                }

                self.RunBackupComponent(r)
                console.log(r)
            },function(err) {
                console.error(err)
            })
        });
    }

};
(function () {
    var I = setInterval(function () {
        if (typeof GNZ11 !== 'function') return ;
        clearInterval(I);
        window.CoreBackupJoomlaBackup.prototype = new GNZ11();
        window.Joomshoping_CoreBackupJoomlaBackup = new CoreBackupJoomlaBackup();
        window.Joomshoping_CoreBackupJoomlaBackup.Init();
    },1000)
})()