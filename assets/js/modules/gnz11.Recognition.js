GNZ11Recognition = function () {
    var $ = jQuery;

    this.Config = {
        /**
         * Голосовое произношение текста
         */
        speechUtterance :[
            {
                'parent' : '.postarea', // родительский блок где искать (msg_element)   
                'key' : '.keyinfo', // селектор элемента || jQuery объект  в которой устанавливать кнопки
                'msg_element' : '.post .inner', // селектор элемента или || jQuery объект откуда читать текст
            },
        ] ,
        /**
         * Распознавание речи -  голосовой набор текста
         */
        addSpeechRecognition : [
            {
                'parent' : false , // родительский блок где искать (msg_element)
                'key' : false, // селектор элемента || jQuery объект  в которой устанавливать кнопки
                'target_element' : '#message', // селектор элемента или || jQuery объект в который вставлять текст
            },
        ] ,
        /**
         * События Распознавание речи
         */
        SpeechRecognition : {
            /**
             * Перед установкой текста в Target Element
             * @param $target
             * @param $text
             */
            beforeInsert:function ( $target , $text ) {},
            /**
             * После установки кнопок Распознавание речи
             * @param $btns
             */
            afterInsertButton:function ($btns) {},
        },
        /**
         * Шаблоны кнопок
         */
        btn : {
            /**
             * Шаблон кнопки чтения текста
             */
            'speechUtterance' : '<input type="button" value="Speech" tabindex="3" class="btn btn-danger btn-sm">',
            /**
             * Шаблон кнопки обновить чтения текста
             */
            'speechUtteranceRefresh' : '<input type="button" value="Refresh" tabindex="3" class="btn btn-danger btn-sm">',
            /**
             * Шаблоны кнопки распознавание речи
             */
            'speechRecognition' : '<input type="button" value="Record" tabindex="3" onclick=""  class="btn btn-danger btn-mini btn-sm">',
            /**
             * Шаблон кнопки перевода
             */
            'translateBtn' : '<input type="button" value="Translate" onclick=""  class="btn btn-success btn-mini btn-sm">',
        },
    };

    this.setConfig = function (setting) {
        this.Config = $.extend( true , this.Config , setting )
    };
    /**
     * Создать и установить кнопки - Распознавание речи и чтения текста
     */
    this.bundle = function () {
        var self = this ;
        var Config = this.Config;
        var $btnTmpl ;

        /**
         * кнопка прочтения текста
         */
        $.each( Config.speechUtterance , function (i,a) {

            console.log( $(a.parent).find('.Speech')[0])

            if ( typeof ($(a.parent).find('.Speech')[0]) !==  'undefined' ) {


                return ;
            }




            $btnTmpl = $(Config.btn.speechUtterance);
            $btnTmpl.addClass('BTNSpeech').data('parent' , a.parent ).data('msg_element' , a.msg_element ) ;

            console.log($(a.parent))

            $(a.parent).find(a.key).append( $btnTmpl ) ;

            $btnTmpl = $(Config.btn.speechUtteranceRefresh);
            $btnTmpl.addClass('BTNrefresh');
            $(a.parent).find(a.key).append( $btnTmpl ) ;

            $(a.parent).on('click' , '.BTNSpeech' ,{ 'self' : self},self.startSpeech );
            $(a.parent).on('click' , '.BTNrefresh' , function(){ speechSynthesis.cancel()  });
        });
        /**
         * установка кнопки распознавание речи
         */
        $.each( Config.addSpeechRecognition , function (i,a) {
            $btnTmpl = $( Config.btn.speechRecognition );
            var $textarea = $(a.target_element);
            var $key ;

            if(typeof a.key === 'undefined' || !a.key){
                a.key = $textarea.parent();
            }
            $key = $(a.key)

            $btnTmpl.addClass('speechRecognition')
            $key.append($btnTmpl);

            $($key).on('click' , '.speechRecognition', {target:$textarea , 'self' : self }, self.startRecognizer  );

            self.Config.SpeechRecognition.afterInsertButton( self , $btnTmpl );
        });


    };
    /**
     * Начало воспроизведение текста
     * @param event
     */
    this.startSpeech = function(event){
        console.clear()
        var self = event.data.self ;
        var el = $(this) ;
        var parent = el.data('parent') ;
        var msg_element = el.data('msg_element') ;

        console.log(msg_element)

        var postText = el.closest(parent).find(msg_element).text().trim();
        console.log(postText)
        u = new SpeechSynthesisUtterance(postText);
        self.speechUtteranceChunker(u, { chunkLength: 120 }, function () {
            console.log('end');
        });
    };
    /**
     * Получить текст элемента
     * @param target
     * @returns {*|Promise<string>|string}
     */
    this.getDataText = function (target) {
        var t = $(target) ;
        if ( t.prop("tagName") === 'DIV'){ return t.text() }
        return  t.val();
    };
    /**
     * Установить текст элемента
     * @param t
     * @param txt
     */
    this.setDataText = function (t , txt ) {
        this.Config.SpeechRecognition.beforeInsert(t , txt );
        if ( t.prop("tagName") === 'DIV'){
            t.text(txt);
            return ;
        }
        t.val( txt )
    };
    /**
     * Старт записи
     * @param target
     */
    this.startRecognizer = function (event){

        var target = $(event.data.target)
        var self =  event.data.self

        console.log( target )

        function capitalize (s){
            console.log( typeof s );
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }

        /*function getDataText  (target){

        }*/
        function setDataText( t , txt ) {
            self.Config.SpeechRecognition.beforeInsert(t , txt );

            if ( t.prop("tagName") === 'DIV'){
                t.text(txt);
                return ;
            }
            t.val( txt )
        }

        if ('webkitSpeechRecognition' in window) {
            var recognition = new webkitSpeechRecognition();
            recognition.lang = 'ru';

            recognition.onresult = function (event) {
                var result = event.results[event.resultIndex];
                // Получить содержимое целевого елемента
                var textBefore = self.getDataText(target) ;
                var addText ;

                addText = result[0].transcript ;
                if ( textBefore.match(/\.$/ig) || textBefore === ''  ) addText = capitalize ( result[0].transcript );
                if (addText !== '.' && textBefore !== '' ) addText = ' ' + addText;

                var text = textBefore + addText  ;
                // Установить в целевой елемент текст
                self.setDataText( target ,  text );


                console.log(result[0].transcript);
            };
            recognition.onend = function() {
                console.log('Распознавание завершилось.');
            };
            recognition.start();
        } else alert('webkitSpeechRecognition не поддерживается :(')
    };
    /**
     * Обработчик чтения
     * @param utt       - Текст для произведения
     * @param settings
     * @param callback
     */
    this.speechUtteranceChunker = function (utt, settings, callback) {
        var self = this ;
        console.log( this )

        settings = settings || {};
        var newUtt;
        var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
        if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
            newUtt = utt;
            newUtt.text = txt;
            newUtt.addEventListener('end', function () {
                if (self.speechUtteranceChunker.cancel) {
                    self.speechUtteranceChunker.cancel = false;
                }
                if (callback !== undefined) {
                    callback();
                }
            });
        }
        else {
            var chunkLength = (settings && settings.chunkLength) || 160;
            var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
            var chunkArr = txt.match(pattRegex);

            if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
                //call once all text has been spoken...
                if (callback !== undefined) {
                    callback();
                }
                return;
            }
            var chunk = chunkArr[0];
            newUtt = new SpeechSynthesisUtterance(chunk);
            var x;
            for (x in utt) {
                if (utt.hasOwnProperty(x) && x !== 'text') {
                    newUtt[x] = utt[x];
                }
            }
            newUtt.addEventListener('end', function () {
                if (self.speechUtteranceChunker.cancel) {
                    self.speechUtteranceChunker.cancel = false;
                    return;
                }
                settings.offset = settings.offset || 0;
                settings.offset += chunk.length - 1;
                self.speechUtteranceChunker(utt, settings, callback);
            });
        }

        if (settings.modifier) {
            settings.modifier(newUtt);
        }
        console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
        //placing the speak invocation inside a callback fixes ordering and onend issues.
        setTimeout(function () {
            speechSynthesis.speak(newUtt);
        }, 0);
    };
    /**
     * Создать кнопку перевод
     * @param $source - елемент из которого взять текст
     * @param $target - елемент куда вставить текст
     * @param sourceLang - Исходный язык  ( en )
     * @param targetLang - Язык на который перевести ( ru )
     */
    this.getTranslateBtn = function ( $source , $target , sourceLang , targetLang ) {
        var self = this ;
        var Config = this.Config;
        var $btnTmpl ;


        if ( typeof sourceLang === 'undefined') sourceLang = 'en';
        if ( typeof targetLang === 'undefined') targetLang = 'ru';

        $btnTmpl = $( Config.btn.translateBtn );
        $btnTmpl.addClass('TranslateBtn').on('click' , { 'self':this,'source':$source,'target':$target,'sourceLang':sourceLang,'targetLang':targetLang}, this.evtTranslate );
        return $btnTmpl ;
    };
    /**
     * Выполнение перевода и установка результата
     * @param event
     */
    this.evtTranslate = function (event) {
        var self = event.data.self ;
        var d = event.data ;
        var resultText = '' ;

        var sourceText = self.getDataText( $(d.source) ) ;
        // sourceText = 'The insertAfter() is an inbuilt method in jQuery which is used to insert some HTML content after a specified element. The HTML content will be inserted after each occurrence of the specified element. Here the “content” is the HTML content which is to be inserted after the specified target.';

        var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
            + d.sourceLang + "&tl=" + d.targetLang + "&dt=t&q=" + encodeURI(sourceText);
        jQuery.ajax({
            url: url
        }).done(function (result, textStatus) {
            $.each(result[0] , function ( i , line ) {
                resultText  = resultText + line[0] ;

            });

            self.setDataText(d.target , resultText )
            console.log(d)
            console.log(resultText)
        }) ;
    }

};




























