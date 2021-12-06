/*******************************************************************************************************************
 *     ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗        ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
 *     ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝        ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
 *     ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗        ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
 *     ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║        ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
 *     ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║        ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
 *     ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝        ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
 *------------------------------------------------------------------------------------------------------------------
 * @author Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 25.11.2021 15:15
 * @copyright  Copyright (C) 2005 - 2021 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 ******************************************************************************************************************/

/**
 * @see https://medium.com/devschacht/https-medium-com-kasimoka-joseph-zimmerman-drag-drop-file-uploader-vanilla-js-de850d74aa2f
 * @type {HTMLElement}
 */

let dropArea = document.getElementById ("drop-area")







// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach (eventName => {
    dropArea.addEventListener (eventName, preventDefaults, false)
    document.body.addEventListener (eventName, preventDefaults, false)
})
// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach (eventName => {
    dropArea.addEventListener (eventName, highlight, false)
})
;['dragleave', 'drop'].forEach (eventName => {
    dropArea.addEventListener (eventName, unhighlight, false)
})

/**
 * Handle dropped files
 * Обработка сброшенных файлов
 */
dropArea.addEventListener ('drop', handleDrop, false)

function preventDefaults (e) {
    e.preventDefault ()
    e.stopPropagation ()
}

function highlight (e) {
    dropArea.classList.add ('highlight')
}

function unhighlight (e) {
    dropArea.classList.remove ('active')
}

/**
 * Обрабатываем EVT Бросить файлов
 * @param e
 */
function handleDrop (e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    handleFiles (files)
}

let uploadProgress = []
let progressBar = document.getElementById ('progress-bar')

function initializeProgress (numFiles) {
    progressBar.value = 0
    uploadProgress = []
    
    for (let i = numFiles; i > 0; i--) {
        uploadProgress.push (0)
    }
}

function updateProgress (fileNumber, percent) {
    uploadProgress[fileNumber] = percent
    let total = uploadProgress.reduce ((tot, curr) => tot + curr, 0) / uploadProgress.length
    console.debug ('update', fileNumber, percent, total)
    progressBar.value = total
}

/**
 * Преобразуем FileList - TO Array
 * Innit прогресс
 * Загрузить на сервер
 * Создать привью
 * @param files
 */
function handleFiles (files) {
    // Преобразуем FileList - TO Array
    files = [...files]
    //
    initializeProgress (files.length)
    files.forEach (uploadFile)
    files.forEach (previewFile)
}

/**
 * Создать привью
 * @param file
 */
function previewFile (file) {
    let reader = new FileReader ()
    
    console.log('input-file-drag-and-drop:previewFile->file >>> ' , file.name );
    
    
    reader.readAsDataURL (file)
    reader.onloadend = function () {
        let li = document.createElement ('li')
        let img = document.createElement ('img')
        let input = document.createElement ('input')
        let svg = createIconTrash();
        
        img.src = reader.result
        
        li.dataset.fileName = file.name ;
        li.appendChild (img)
        li.appendChild (svg)
    
        input.type = 'hidden';
        input.name = 'files[]';
        input.value = file.name;
        li.appendChild (input)
        
        document.getElementById ('gallery').appendChild (li)
    }
    
    function createIconTrash(){
        var div = document.createElement ('div');
        div.setAttribute('class' , 'add-photos__actions' )
        div.setAttribute('_ngcontent-rz-client-c126' , '' )
        
        var button = document.createElement ('button')
        button.setAttribute('aria-label' , 'Удалить фото' );
        button.setAttribute('title' , 'Удалить фото' )
        button.setAttribute('class' , 'button button--small button--white' )
        button.setAttribute('_ngcontent-rz-client-c126' , '' )
        button.type = 'button';
        button.dataset.actionElement = 'deletePhoto'
        
        var svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            useElem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        
        svgElem.setAttribute('height' , '16' )
        svgElem.setAttribute('width' , '16' )
        svgElem.setAttribute('_ngcontent-rz-client-c126' , '' )
        // svgElem.setAttributeNS('http://www.w3.org/1999/xlink', 'height', '16');
        // svgElem.setAttributeNS('http://www.w3.org/1999/xlink', 'width', '16');
        useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#icon-trash');
        svgElem.appendChild(useElem);
        button.appendChild(svgElem);
        div.appendChild(button);
        
        return div ;
    }
    
}

/**
 * Удалить привью
 * @param file - Имя файла
 */
function previewFileDelete (file){
    let previewArr = document.getElementById ('gallery').querySelectorAll('li[data-file-name="'+file+'"]');
    previewArr.forEach( function (el , i , list ) {
        el.remove();
    } );
    console.log('input-file-drag-and-drop:previewFileDelete->previewArr >>> ' , previewArr );
    
    
}


// let uploadFileUrl = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload' ;
let uploadFileUrl = '/assets/form.php';

/**
 * Загружаем на сервер
 * @param file
 * @param i
 */
function uploadFile (file, i , deleteFile ) {
    return new Promise((resolve, reject)=>{
        let aditionalData = getAditionalData()
        const url = uploadFileUrl;
        const xhr = new XMLHttpRequest ();
        const formData = new FormData ();
        xhr.open ('POST', url, true)
        xhr.setRequestHeader ('X-Requested-With', 'XMLHttpRequest')
        // Update progress (can be used to show progress indicator)
        xhr.upload.addEventListener ("progress", function (e) {
            updateProgress (i, (e.loaded * 100.0 / e.total) || 100)
        })
        xhr.addEventListener ('readystatechange', function (e) {
            if (xhr.readyState === 4 && xhr.status === 200) {
                updateProgress (i, 100) // <- Add this
                let jsonResponse = JSON.parse(xhr.responseText);
                resolve(jsonResponse)
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                console.error( xhr )
                reject()
                // Error. Inform the user
            }
        })
    
        formData.append ('upload_preset', 'ujpu6gyk')
        if ( deleteFile === true ){
            formData.append ('method', 'deleteImages')
        }else {
            formData.append ('method', 'saveImages')
        }
        for (const Key in aditionalData) {
            formData.append ( Key , aditionalData[Key] );
        }
        formData.append ('file', file)
        xhr.send (formData)
    
        /**
         * Получить дополнительные данные для загрузки фотографии
         * @return {{}}
         */
        function getAditionalData () {
            let aditionalDataRet = {};
            let form = dropArea.closest('form');
            let libEl = dropArea.closest('lib-gnz11-input-file-drag-and-drop');
            let inputDir =  form.querySelector('input[name="save-images-dir"]')
            
            // console.log('input-file-drag-and-drop:getAditionalData->inputDir >>> ' , inputDir );
            
            
            uploadFileUrl = libEl.dataset.action
            /**
             * Директория сохранения файлов от корня сайта
             */
            if ( typeof libEl.dataset.saveImagesDir !== "undefined" ){
                aditionalDataRet.saveImagesDir = libEl.dataset.saveImagesDir
            }else if ( inputDir ){
                aditionalDataRet.saveImagesDir = inputDir.value;
            }
            
        
        
        
        
            console.log('input-file-drag-and-drop:getAditionalData->libEl >>> ' , aditionalDataRet );
            return aditionalDataRet ;
        }
    })
    
    
}


window._inputFileDragAndDrop = function(){
    let self = this;
    this.Init = function(){
    
        self.addEventListener();
    }
    /**
     * Установить обработчики событий
     */
    this.addEventListener = function(){
        dropArea.addEventListener ('click' , function (evt){
        
        
            switch (evt.target.dataset.actionElement) {
                /**
                 * Удалить фото из списка
                 */
                case 'deletePhoto':
                    self.onDeletePhoto(evt)
                    
                    break ;
                default : return ;
            }
            console.log('input-file-drag-and-drop:->evt >>> ' , evt.target.dataset );
        
        });
        
    }
    /**
     * Удаление файла из списка
     * @param evt
     */
    this.onDeletePhoto = function (evt) {
        let i = 0 ;
        let li = evt.target.closest ('li');
        let file = li.dataset.fileName
        uploadFile (file, i , true ).then(function (r) {
            if (r.success === true ){
                // let file = r.data.file
                // previewFileDelete (file)
                li.remove();
                self.messageNoty({txt : 'Файл ' + file + ' удален.'});
            }
            console.log('input-file-drag-and-drop:->r >>> ' , r );
        
        },function (err) {console.log('input-file-drag-and-drop:->err >>> ' , err );})
    }
    
    /**
     * Отображение сообщения Noty  #9B59B6
     * @param message
     * @use :
     *          var message = {};
     *          message.txt = 'Plugin Start';
     *          self.messageNoty(message);
     */
    this.messageNoty = function (message) {
        var param = {
            type: 'info',            // Тип сообщений - alert, success, warning, error, info/information
            layout: 'bottomRight',   // Позиция вывода top, topLeft, topCenter, topRight, center, centerLeft, centerRight,
                                     // bottom, bottomLeft, bottomCenter, bottomRight
            timeout: 5000,       // Время отображения
        }
        self.__loadModul.Noty (param).then (function (Noty) {
            Noty.options.text = message.txt;
            Noty.show ();
            console.log ('this.messageNoty >>> ', message.txt);
        })
        
    }
    this.Init();
}
window._inputFileDragAndDrop.prototype = new GNZ11();
window.inputFileDragAndDrop = new window._inputFileDragAndDrop();


























