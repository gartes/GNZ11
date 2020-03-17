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

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        // xhrFields: {withCredentials: true},
        // url: 'server/php/index.php'
        url: '/index_upload.php',
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
         * после удаление аф
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
        // Load existing files:
        $('#fileupload').addClass('fileupload-processing');


        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $('#fileupload').fileupload('option', 'url'),
            data: objData ,
            dataType: 'json',
            context: $('#fileupload')[0]
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
