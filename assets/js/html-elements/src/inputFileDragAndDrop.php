<?php
    /*******************************************************************************************************************
     *     ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗        ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
     *     ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝        ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
     *     ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗        ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
     *     ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║        ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
     *     ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║        ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
     *     ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝        ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
     *------------------------------------------------------------------------------------------------------------------
     *
     * @author     Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date       25.11.2021 20:33
     * @copyright  Copyright (C) 2005 - 2021 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     ******************************************************************************************************************/




    $FileDragAndDrop = new inputFileDragAndDrop();


    if( !isset($_POST['method']) ) $FileDragAndDrop->inputFileDragAndDropExistDrag( 'Method not found'); #END IF

    switch($_POST['method']){
        case 'deleteImages':
            $FileDragAndDrop->deleteImages();
            break;
        case 'saveImages':
            $FileDragAndDrop->saveImages();
            break;
        default :
            $FileDragAndDrop->inputFileDragAndDropExistDrag( 'Access die' );
    }

    class inputFileDragAndDrop{

        protected $DefaultSettings = [
            'uploadsDir' => '/image/uploads_users'
        ];

        /**
         * Путь для корня сайта
         */
        protected  $dirRoot ;

        /**
         * Директория для сохранения файлов
         * по умолчанию '/image/uploads_users'
         * может быть изменена в атрибуте тега lib-gnz11-input-file-drag-and-drop
         *
         * example : <lib-gnz11-input-file-drag-and-drop
         *              data-save-images-dir="uploads_users"></lib-gnz11-input-file-drag-and-drop>
         *
         *
         * или в форме с помощью <input type="hidden" />
         *
         * example : <input type="hidden" name="save-images-dir" value="uploads_users">
         *
         */
        protected $saveImagesDir   ;


        public function __construct( )
        {
            $this->dirRoot =  dirname(__DIR__, 6);
            $this->saveImagesDir = $this->dirRoot . '/image/uploads_users' ;


            if( isset($_POST['saveImagesDir']) )
            {
                $saveImagesDir = $_POST['saveImagesDir'];
                $this->saveImagesDir =   $this->dirRoot . '/'. $saveImagesDir ;
                $this->checkDir($this->saveImagesDir);

                $this->DefaultSettings['uploadsDir'] = $saveImagesDir ;


            }#END IF



        }

        /**
         * Удаление файла
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   26.11.2021 00:28
         *
         */
        public function deleteImages(){
            $fileName = basename($_POST['file'] ) ;
            $deleteFile = $this->saveImagesDir .'/'. $fileName ;
            unlink( $deleteFile );

            $res = [
                'success' => true,
                'data' => [
                    'file' => $fileName ,
                    'uploadsDir' => $this->DefaultSettings['uploadsDir']

                ],
                'message' => 'Файл удален.' ,
            ];
            $this->inputFileDragAndDropExistDrag( $res   );





        }

        /**
         * Загрузить фото на сервер
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   26.11.2021 00:15
         *
         */
        public function saveImages()
        {
            $fileName = basename($_FILES['file']['name']) ;
            $uploadfile = $this->saveImagesDir .'/'. $fileName ;

            if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
                $res = [
                    'success' => true,
                    'data' => [
                        'file' => $fileName ,
                        'uploadsDir' => $this->DefaultSettings['uploadsDir']

                    ],
                    'message' => 'Файл успешно загружен.' ,
                ];
                $this->inputFileDragAndDropExistDrag( $res   );

            } else {
                $res = [
                    'success' => false,
                    'message' => 'Возможная атака с помощью файловой загрузки!' ,
                ];
                $this->inputFileDragAndDropExistDrag(  $res  );

            }
//            return $uploadfile ;


            echo'<pre>';print_r( $this->saveImagesDir );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            echo'<pre>';print_r( $uploadfile );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            echo'<pre>';print_r( $_POST );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            echo'<pre>';print_r( $_FILES );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            die(__FILE__ .' '. __LINE__ );
        }




        /**
         * Выход из скрипта
         *
         * @param array|string $message - сообщение или данные
         *
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   25.11.2021 21:03
         *
         */
        public function inputFileDragAndDropExistDrag( $message ){
            if( !is_array($message) )
            {
                echo $message ;
                die();
            }#END IF

            echo json_encode( $message );
            die();

        }

        /**
         * Проверить директорию на существование и на доступность для записи
         *
         * @param string $folder
         *
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   25.11.2021 22:05
         *
         */
        protected function checkDir( $folder ){
            if( !file_exists($this->saveImagesDir) )
                $this->inputFileDragAndDropExistDrag( 'Directory does not exist - ' . $folder   ); #END IF

            if( substr(sprintf('%o', fileperms($folder)), -4) != "0775" ) #END IF
                $this->inputFileDragAndDropExistDrag( 'Directory does not writable - ' . $folder   ); #END IF



        }

    }










