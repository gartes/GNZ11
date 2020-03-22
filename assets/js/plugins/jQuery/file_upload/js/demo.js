/*
 * jQuery File Upload Demo
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global $ */

$(function () {
    'use strict';
    var $ = jQuery ;
    this.DEBAG = false ;

    this._default = {
        domain : window.location.protocol +'//'+ window.location.host ,
        urlHandler: '/index_upload.php',
        window :{
            head : 'Добавить фотографии',
        },
        upload:{
            dir : "" ,
            url : "" ,
            accept_file_types: '/\.(zip|gif|jpe?g|png)$/i' ,
            accept_file_types_arr : [
                'zip' , 'gif' , 'jpe?g' , 'png' , 'xlsx'
            ]
        },
        DEBAG : false ,
        upload_dir : null ,
        upload_url : null ,
    } ;
    var self = this ;
    this.Init = function(){
        var fileUploadCoreSetting = parent.Joomla.getOptions('fileUploadCoreSetting') ;
        this._default = $.extend(true , this._default, fileUploadCoreSetting );

        if (typeof parent.window.fileUploadCoreSetting === 'object' ){
            this._default = $.extend(true , this._default,  parent.window.fileUploadCoreSetting );
        }
        if (this._default.urlHendler === '/index_upload.php' ){
            console.warn('Deprecated:' , 'urlHendler : /index_upload.php Must be installed in'  )
        }
        this.DEBAG = this._default.DEBAG ;

        this._htmlInit();
    };
    /**
     * Натройка View Html!
     * @private
     */
    this._htmlInit = function(){
        if(self.DEBAG) console.log( '@_htmlInit this._default' , this._default  );
        var file_types ='';
        $('h3.fileupload__heading').text(this._default.window.head);
        if ( typeof this._default.upload.accept_file_types_arr !== 'undefined' ){

            $.each( this._default.upload.accept_file_types_arr , function (i,a) {
                if (i>0) file_types += ',';
                if (a === 'jpe?g') a = 'jpeg, .jpg' ;
                file_types += ' .'+a
            });
            $('i.file_types').html(file_types)
        }

    };
    this.Init();


    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        // xhrFields: {withCredentials: true},
        // url: 'server/php/index.php'
        url: this._default.urlHandler,
        // Enable image resizing, except for Android and Opera,
        // which actually support image resizing, but fail to
        // send Blob objects via XHR requests:
        //disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator && navigator.userAgent),
        //imageMaxWidth: 800,
        // imageMaxHeight: 800,
        //imageCrop: true , // Force cropped images
        sequentialUploads : true ,
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(/\/[^/]*$/, '/cors/result.html?%s')
    );


    $('#fileupload')
        /**
         * EVT - Добавление файла в форму загрузки
         */
        .on('fileuploadadd', function (e, data) {
            console.log('EVT-fileuploadadd',data);

            console.log(data)
            addFormEmptyClass(true );



        })
        .on('fileuploadprocessstart', function (e, data){
            console.log('EVT-fileuploadprocessstart',data)
        })
        /**
         * EVT - отправление формы - загрузка файла
         */
        .on('fileuploadsubmit', function (e, data) {
            $('#fileupload')
            data.formData = {
                task : 'fileuploadsubmit' ,
                productId : window.parent.product_id ,
                _default : JSON.stringify( self._default ) ,
            } ;

            console.log('EVT-fileuploadsubmit',data)
        })
        .on('fileuploaddone', function (e, data) {
            var resultName = data.result.files[0].name;
            var thumbnailUrl = data.result.files[0].thumbnailUrl;
            var $elementImg = $('<img />' , {
                name : resultName ,
                src : thumbnailUrl ,
                class : 'del_up_img' ,
            });
            $(window.parent.document).find('#gods').append($elementImg);


            console.log( data.result.files[0].name)
            console.log( data.result.files[0].thumbnailUrl)
            console.log('EVT-fileuploaddone',data)
        })


        /**
         *  - При загрузке окна формы
         *  - При отправке файла на сервер
         *  - При нажатии кнопки CENCEL
         */
        .on('fileuploadfinished', function (e, data) {
            console.log('EVT-fileuploadfinished',data)  ;
            var toggle = true ;
            if (typeof data.result === 'undefined' || !data.result.length ){
                toggle = false ;
            }
            addFormEmptyClass( toggle , 'EVT-fileuploadfinished'  );
            data.formData = {
                productId : window.parent.product_id ,
            } ;
            data._default = self._default



        })
        /**
         * Окончание закрузки файла FILEUPLOAD
         */
        .on('fileuploadstopped', function (e, data) {
            console.log('EVT-fileuploadstopped',data)

            addFormEmptyClass(true,'EVT-fileuploadstopped');
            // Проверить если все файлы загружены подсказка для выхода!
            checkTemplateUpload();


        })
        /**
         * Новый файл добавлен в форму
         */
        .on('fileuploadadded', function (e, data) {
            addFormEmptyClass(true , 'EVT-fileuploadadded' );
            console.log('EVT-fileuploadadded',data)

        })
        /**
         * после удаление файла
         */
        .on('fileuploaddestroyed', function (e, data) {
            addFormEmptyClass( );
            console.log('EVT-fileuploaddestroyed',data)

        })


        /**
         * Заход файла в поле дроп
         */
        .on('fileuploaddragenter', function (e, data) {
            addFormDropClass( );
            console.log('EVT-fileuploaddragenter',data)
        })
        /**
         * Движение файла над полем дроп
         */
        .on('fileuploaddragover', function (e, data) {
            addFormDropClass( );
            console.log('EVT-fileuploaddragover',data)
        })
        /**
         * Бросание файла над полем дроп
         */
        .bind('fileuploaddrop', function (e, data) {
            addFormDropClass( );
            data.formData = {
                productId : window.parent.product_id ,
            } ;
            console.log('EVT-fileuploaddrop' , data)
        })

        .on('fileuploadprocessalways', function (e, data) {
            data.formData = {
                productId : window.parent.product_id ,
            } ;
            console.log('EVT-fileuploadprocessalways',data)
        });

    /**
     * Проверить если все файлы загружены подсказка для выхода!
     */
    function checkTemplateUpload() {
        var $= jQuery ;
        var $form = $('#fileupload');
        var $fileLine = $('#fileupload').find('tr.template-upload');
        var $wrpHeading = $('.wrp__heading');
        var $btn = $('<button />',{
            type : 'button' ,
            class : 'btn btn-success exit' ,
            html : ' <i class="glyphicon glyphicon-ok"></i><span> Готово!</span>',
        }).on('click' , function () {
            $(window.parent.document)
                .find('.fancybox-container.Upload_Modal .fancybox-button--close')
                .trigger('click');
        });
        if ( $fileLine.length ) return ;
        $wrpHeading.append($btn);

        console.log('FN-checkTemplateUpload',  $fileLine );

    };

    function addFormDropClass(toggle, trigger) { }

    /**
     * Если в форме нет файлов - вывод описания для формы
     * @param toggle
     * @param trigger
     */
    function addFormEmptyClass(toggle, trigger) {
        var $ = jQuery;
        var $form = $('#fileupload');
        var $fileLine = $('#fileupload').find('tr.template-upload , tr.template-download');
        if (typeof toggle !== 'undefined' && toggle) {
            $form.removeClass('empty');
            return;
        }


        console.log('FN-addFormEmptyClass', $('#fileupload').find('tr.template-upload'));


        if (!$fileLine.length) {
            $form.addClass('empty')
        } else {
            $form.removeClass('empty')
        }
        if (typeof toggle === 'undefined') {

        } else {

        }
    }


    /**
     * Событие после удаления файла
     */
    $('#fileupload').bind('fileuploaddestroy', function(e, data) {

        // If you edit the default template, you can acquire some other
        // information about the uploaded file (for example the file size)
        var fileName = data.context.find('a[download]').attr('download');
        data.formData = { productId : window.parent.product_id ,  } ;
        $(window.parent.document).find('[name="'+fileName+'"]').remove();
        console.log('EVT-fileuploaddestroy',data)
        /*$.post(
            '/removePictureFromDatabase.php',
            {
                fileName: fileName
            },
            function(data, textStatus) {
                // Process result
            },
            'json'
        );*/

    });

    /**
     * Если форма не загружалась или повторная загрузка формы
     * @type {boolean}
     */
    var loadForm = false ;
    var objData = {} ;
    if (!loadForm){
        loadForm = true ;
        objData = {
            task : 'loadForm' ,
            productId : window.parent.product_id ,
        }
    }
    /*--------------------------------------------------------*/




    if (window.location.hostname === 'blueimp.github.io') {
        // Demo settings:
        $('#fileupload').fileupload('option', {
            url: '//jquery-file-upload.appspot.com/',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(
                window.navigator.userAgent
            ),
            maxFileSize: 999000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        });
        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: '//jquery-file-upload.appspot.com/',
                type: 'HEAD'
            }).fail(function () {
                $('<div class="alert alert-danger"/>')
                    .text('Upload server currently unavailable - ' + new Date())
                    .appendTo('#fileupload');
            });
        }
    }
    else {
        var $fileuploadElem =  $('#fileupload')
        // Load existing files:
        $fileuploadElem.addClass('fileupload-processing');


        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $fileuploadElem.fileupload('option', 'url'),
            data: objData ,
            dataType: 'json',
            context: $fileuploadElem[0]
        })
            .always(function () {
                $(this).removeClass('fileupload-processing');
            })
            .done(function (result) {

                $(this)
                    .fileupload('option', 'done')
                    // eslint-disable-next-line new-cap
                    .call(this, $.Event('done'), {result: result});
            });
    }
});




























