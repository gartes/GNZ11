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
         * Распознавание речи -  голосовой набор текста (ввод текста голосом)
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
            lang : 'ru' ,
            /**
             * FALSE - Когда пользователь перестает говорить, распознавание речи заканчивается
             * Этот режим отлично подходит для простого текста, такого как короткие поля ввода .
             *
             * TRUE - распознавание продолжается, даже если пользователь делает паузу во время разговора.
             */
            continuous : false ,
            /**
             *  FALSE - Значение по умолчанию для interimResults false - это означает, что единственные результаты,
             *  возвращаемые распознавателем, являются окончательными и не изменятся.
             *
             *  TRUE - получаем ранние промежуточные результаты, которые могут измениться
             */
            interimResults :false ,
            /**
             * Триггер начала наспознавания речи
             * @param $target
             * @param $text
             */
            onStart : function ( $target , $text ) {},
            /**
             * Триггер окончания наспознавания речи
             * @param $target
             * @param $text
             */
            onend : function ( $target , $text ) {},

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
     * @param event
     */
    this.startRecognizer = function (event){

        var target = $(event.data.target)
        var self =  event.data.self


        /**
         * Делает первую букву UpperCase
         * @param s Строка
         * @returns {string}
         * @private
         */
        function _capitalize (s){
            var first_char = /\S/;
            return s.replace(first_char, function(m) { return m.toUpperCase(); });
        }

        /**
         * Установка распознаного текста в элемент Target
         * @param target - элемент Target
         * @param txt - распознаный текста
         */
        function setDataText( target , txt ) {
            self.Config.SpeechRecognition.beforeInsert(target , txt );
            // Если вставка в <div />
            if ( target.prop("tagName") === 'DIV'){
                target.text(txt);
                return ;
            }
            target.val( txt )
        }

        if ('webkitSpeechRecognition' in window) {
            /**
             * Индикатор - идет распознавание речи
             */
            var recognizing ;
            var final_transcript = '';

            var recognition = new webkitSpeechRecognition();
            recognition.lang = self.Config.SpeechRecognition.lang ;

            recognition.interimResults = self.Config.SpeechRecognition.interimResults  ;

            recognition.onstart = function() {
                recognizing = true;
                showInfo('info_speak_now');
                self.Config.SpeechRecognition.onStart(target);

            };
            recognition.onresult = function (event) {
                var interim_transcript = '';
                if (typeof(event.results) == 'undefined') {
                    recognition.onend = null;
                    recognition.stop();
                    upgrade();
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;

                    }
                }
                self.setDataText( target ,  interim_transcript );
                final_transcript = _capitalize(final_transcript);

                return;



                /*var result = event.results[event.resultIndex];
                // Получить содержимое целевого елемента
                var textBefore = self.getDataText(target) ;
                var addText ;

                addText = result[0].transcript ;
                if ( textBefore.match(/\.$/ig) || textBefore === ''  ) addText = _capitalize ( result[0].transcript );



                //  if (addText !== '.' && textBefore !== '' ) addText = ' ' + addText;

                var text = textBefore + addText  ;

                // Установка распознаного текста в элемент Target

                console.log(result[0].transcript);*/
            };
            recognition.onerror = function(event) {};
            /**
             * Событие Распознавание завершилось
             */
            recognition.onend = function() {

                recognizing = false;
                showInfo('');
                $(target).attr('value' , final_transcript );

                self.setDataText( target ,  final_transcript );
                self.Config.SpeechRecognition.onend(target);


                console.log('Распознавание завершилось.');
            };

            recognition.start();


            function showInfo(s) {
                if (s) {
                    for (var child = info.firstChild; child; child = child.nextSibling) {
                        if (child.style) {
                            child.style.display = child.id == s ? 'inline-block' : 'none';
                        }
                    }
                    info.style.visibility = 'visible';
                } else {
                    info.style.visibility = 'hidden';
                }
            }
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
    /**
     * Загрузка темы (html)
     * @param theme
     * @returns {Promise<unknown>}
     * Поддержка тем :
     *  Для кнопок :
     *      microphone - Button с изображением микрофона
     *
     */
    this.loadTheme = function (theme) {
        var siteUrl = Joomla.getOptions('siteUrlsiteUrl' , '' ) ;
        var pathModules =  siteUrl + wgnz11.Options.gnzlib_path_modules;
        var url = pathModules + '/Recognition/themes/'+theme+'.html'
        return new Promise(function ( resolve, reject ) {
             $.ajax( url , {
                success : function(html){
                    resolve(html)
                }
            });
        })
    }

};








///////////////////////////////////////////////
/**
 * метод для поиска промежутка
 * в случае если x в промежутке - return true else false
 * @param x
 * @param min
 * @param max
 * @returns {boolean|boolean}
 */
function between(x, min, max) {
    return x >= min && x <= max;
}



















