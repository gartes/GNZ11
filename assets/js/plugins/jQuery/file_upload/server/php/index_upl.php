<?php
	/*
	 * jQuery File Upload Plugin PHP Example
	 * https://github.com/blueimp/jQuery-File-Upload
	 *
	 * Copyright 2010, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * https://opensource.org/licenses/MIT
	 */
	error_reporting( E_ALL | E_STRICT );
	require('UploadHandler.php');
	$options = array();
	$_default_request = array();
	$_default = [
//		'upload_dir' => __DIR__ .'/upload/' ,
//		'upload_url' => '/upload/' ,
		'print_response' => false ,
		// Определяет, какие файлы (на основе их имен) принимаются для загрузки.
		// По умолчанию разрешены только загрузки файлов с расширениями файлов изображений.
		// Измените этот параметр только после того, как убедитесь, что любой разрешенный файл
		// типы не могут быть выполнены веб-сервером в каталоге файлов,
		// например Скрипты PHP, а также не выполняются браузером при загрузке,
		// например HTML-файлы со встроенным кодом JavaScript.
		// Пожалуйста, прочтите также документ SECURITY.md в этом репозитории.
		'accept_file_types' => '/\.(zip|gif|jpe?g|png)$/i',
	] ;
	
	if( isset( $_REQUEST[ '_default' ] ) )
	{
		$_default_request = json_decode( $_REQUEST[ '_default' ] );
		if( isset( $_default_request->upload ) )
		{
			$_default_request->upload = (array)$_default_request->upload ;
			$find = ['.'];
			$replase = ['\.'];
			$_default_request->upload['accept_file_types'] = str_replace($find , $replase , $_default_request->upload['accept_file_types'] ) ;
			if( isset( $_default_request->upload['accept_file_types_arr'] ) )
			{
				$_default_request->upload['accept_file_types'] = '/\.('.implode( '|', $_default_request->upload['accept_file_types_arr'] ) .')$/i' ;
				unset( $_default['accept_file_types'] ) ;
				$_default_request->accept_file_types = $_default_request->upload['accept_file_types'] ;
				//
			}#END IF
		}#END IF
		$_default_request->upload_dir = str_replace( '/libraries/GNZ11/assets/js/plugins/jQuery/file_upload/server/php' , '' ,__DIR__  ) . $_default_request->upload_dir;
		$task = ( isset( $_REQUEST[ 'task' ] ) ? $_REQUEST[ 'task' ] : false );
		

	}#END IF




	if( $_SERVER['REQUEST_METHOD'] == 'DELETE' )
	{
		$task = '_delete' ;
	}#END IF

    if( $_REQUEST['task'] == 'loadForm' )
    {
        $task = 'loadForm' ;
    }#END IF


//    echo'<pre>';print_r( $_REQUEST['task'] );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
//    echo'<pre>';print_r( $task );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
//    die(__FILE__ .' '. __LINE__ );


	$options = array_merge_recursive( (array)$_default_request, $_default );
	
	
	
	$initialize = true ;
	$upload_handler = new UploadHandler($options , $initialize );
	
	/**
	 * Установить заголовки для ответа
	 */
	$upload_handler->head();
	$response = $upload_handler->get_response();
	$indexUploadHandler = new indexUploadHandler();
	
	switch ($task)
	{
		case '_delete':
			$indexUploadHandler->deliteFile( $response ) ;
			
			
			break;
		# Если добавление файла
		case 'fileuploadsubmit':
			






			
			/**
			 * Получить данные о файлах
			 * если установлен параметр 'print_response' => false ,
			 * возвращает массив - без печати ответа в body
			 */
			
//			$product = $indexUploadHandler->addFileProduct( $product , $response );


//            echo'<pre>';print_r( $product );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
//            die(__FILE__ .' '. __LINE__ );

			$dirRoot = str_replace( '/libraries/GNZ11/assets/js/plugins/jQuery/file_upload/server/php' , '' ,__DIR__  ) ;
			
			$json = json_encode($response);
			echo $json ;
			die( );
			break;

		default :
			/**
			 * Получить данные о файлах
			 * если установлен параметр 'print_response' => false ,
			 * возвращает массив - без печати ответа в body
			 */
			$response = $upload_handler->get_response();
			$json = json_encode($response);
			echo $json ;
			die( );
	
	
	}
	
	
	
	
	class indexUploadHandler
	{
		
		/**
		 * indexUploadHandler constructor.
		 *
		 * @since 3.9
		 */
		public function __construct ()
		{
		}
		function deliteFile( $response ){
		
		}
		
		
		function addFileProduct ( $product, $response )
		{
			$files = $response[ 'files' ][ 0 ];
			
			$product[ 'files' ][ $product[ 'product_id' ] ][ $files->name ] = $files;
			return $product;
		}
		
	}























	
