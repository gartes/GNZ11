window.CoreBackupJoomlaRestore = function () {
    var $ = jQuery ;
    var self = this;
    this.__group = 'system';
    this.__plugin = 'joomshoping_prod_sys' ;
    this.selectors = {

            baseClass : 'Backup-list-modal' ,
            backupsList : '#backupsList' ,
            btnRestore : '#toolbar-backup-restore button',
            btnRemove : '#toolbar-backup-remove button',
    };
    this.AjaxDefaultData = {
        group : this.__group,
        plugin : this.__plugin ,
        option : 'com_jshopping' ,
        format : 'json' ,
        task : null ,
    }
    this.Init = function(){
        $(self.selectors.btnRestore).on('click' , self.processRestore )
        $(self.selectors.btnRemove).on('click' , self.RemoveBackupComponent )
    }
    /**
     * Удаление Резервной Копии
     * @constructor
     */
    this.RemoveBackupComponent = function () {
        var $f = $(this).closest(self.selectors.backupsList);
        var $checkBackup = $f.find('[type="checkbox"]:checked');
        var ID = [] ;
        $.each( $checkBackup , function (i,e) {
            ID.push( $(e).val() )
        })
        var data = self.AjaxDefaultData;
        data.task = 'removeBackup' ;
        data.Id  = ID ;
        self.getModul("Ajax").then(function (Ajax) {
            Ajax.send(data).then(function (r) {
                $.each( $checkBackup , function (i,e) {
                    $(e).closest('.row-line').remove();
                    console.log(e)
                }) ;
                console.log( r.data );
            });
        })
        console.log(ID);
        console.log( this )
    }

    this.processRestore = function (event) {
        event.preventDefault();
        var $f = $(this).closest(self.selectors.backupsList);
        var $checkBackup = $f.find('[type="checkbox"]:checked');
        var backupId = $checkBackup.val();
        var data = self.AjaxDefaultData;
        var $Line = $checkBackup.closest('.row-line');

        $Line.removeClass('_error').addClass('_loading');

        data.task = 'restoreBackup' ;
        data.backupId = backupId ;


        console.log( $checkBackup )



        self.getModul("Ajax").then(function (Ajax) {
            Ajax.send(data).then(function (r) {
                $Line.removeClass('_loading')
                console.log( r );
                console.log( backupId );
            },function (err) {
                $Line.removeClass('_loading').addClass('_error')
                console.log(err);
            })
        });

    }
};
(function () {
    var I = setInterval(function () {
        if (typeof GNZ11 !== 'function') return ;
        clearInterval(I);
        window.CoreBackupJoomlaRestore.prototype = new GNZ11();
        window.Joomshoping_CoreBackupJoomlaRestore = new CoreBackupJoomlaRestore();
        window.Joomshoping_CoreBackupJoomlaRestore.Init();
    },1000)
})()