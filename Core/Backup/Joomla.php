<?php

	namespace GNZ11\Core\Backup;

	use Exception;
	use Joomla\CMS\Factory;
	use Joomla\CMS\Filesystem\Folder;
	use ParagonIE\Sodium\File;

	class Joomla
	{

		/**
		 * @var \Joomla\CMS\Application\CMSApplication|null
		 * @since 3.9
		 */
		private $app;
		/**
		 * @var \JDatabaseDriver|null
		 * @since 3.9
		 */
		private $db ;
		public static $instance;
		/**
		 * Массив таблиц для которых создается Backup
		 * @var string[]
		 * @since 3.9
		 */
		private $backup_tables_array;
		/**
		 * Способ создания Backup'a
		 * @var string
		 * @since 3.9
		 */
		private $backup_type;
		/**
		 * Имя Файла Backup
		 * @var string
		 * @since 3.9
		 */
		private $backup_filename;
		/**
		 * Путь для сохранения копий
		 * @var string
		 * @since 3.9 
		 */
		private $backup_path;
		/**
		 * Копмоненты таблицы копонентов
		 * @var \string[][]
		 * @since 3.9
		 */
		private $components ;
		/**
		 * @var array Массив таблиц компонента для создания точки восстановления
		 * @since 3.9
		 */
		private $backup_component_table;
		/**
		 * @var string простарнство имен для бекап попераций
		 * @since 3.9
		 */
		private $backup_namespace;

		/**
		 * helper constructor.
		 * @throws Exception
		 * @since 3.9
		 */
		private function __construct( $options = array() )
		{
			$this->app = Factory::getApplication();
			$this->db = Factory::getDbo();

			try
			{
			    // Code that may throw an Exception or Error.
				$component = isset($options['component'])?$options['component']:false ;
				$backup_path = isset($options['backup_path'])?$options['backup_path']:JPATH_ROOT.'/backup' ;

				$this->backup_path = $backup_path ;
				$this->backup_namespace = isset($options['backup_namespace'])?$options['backup_namespace']:null ;
				$this->_Def();
				$this->backup_tables_array = $this->_getTableList( $component );
				$this->backup_type = isset($options['backup_type'])?$options['backup_type']:'sql' ;
				$this->backup_filename = "backup_com_".$component.'_' . date( "d.m.Y_H_i_s" ) . ".sql";

			}
			catch (Exception $e)
			{
				$Message = $e->getMessage();
				$Code = $e->getCode();
				throw new Exception( $Message , $Code);
			}
			return $this;
		}#END FN

		/**
		 * @param array $options
		 * @return Joomla
		 * @throws Exception
		 * @since 3.9
		 */
		public static function instance( $options = array() )
		{
			if( self::$instance === null )
			{
				self::$instance = new self( $options );
			}
			return self::$instance;
		}#END FN

		/**
		 * Создать дамп таблиц для компонента
		 * @return bool
		 * @throws Exception
		 * @since 3.9
		 */
		public function backup()
		{
			$fp = fopen( $this->backup_path . DS . $this->backup_filename , "a" );
			foreach( $this->backup_component_table as $table )
			{
				$table = str_replace( '#__' , $this->db->getPrefix() , $table );
				$fields_list_array = $this->db->getTableColumns( $table );
				$fields_list = [];
				foreach( $fields_list_array as $key => $field )
				{
					$fields_list[] = $key;
				}
				$this->db->setQuery( "SELECT COUNT(*) FROM `{$table}`" );
				$total = $this->db->loadResult();
				fwrite( $fp , "TRUNCATE TABLE `{$table}`;\n" );
				$i = 0;
				for( ; ; )
				{
					if( $i >= $total )
						break;
					$this->db->setQuery( "SELECT * FROM `{$table}`" , $i , 200 );
					$data = $this->db->loadAssocList();
					$i += 200;
					if( !$data )
						break;
					if( count( $fields_list ) )
					{
						fwrite( $fp , "INSERT INTO `{$table}` (`" . implode( "`,`" , $fields_list ) . "`) VALUES\n" );
					} else
					{
						fwrite( $fp , "INSERT INTO `{$table}` VALUES\n" );
					}
					$rows = [];
					foreach( $data as $key => $row )
					{
						$fields = [];
						foreach( $row as $field )
						{
							$field = str_replace( ";\n" , ";" , $field );
							$fields[] = $this->db->Quote( $field );
						}
						$rows[] = "(" . implode( "," , $fields ) . ")";
					}
					if( count( $rows ) )
					{
						fwrite( $fp , implode( ",\n" , $rows ) . ";\n\n" );
					} else
						fwrite( $fp , ";\n\n" );
				}
			}
			fclose( $fp );
			$size = filesize( $this->backup_path . DS . $this->backup_filename );
			if( $size )
			{
				try
				{
					# Сохранить данные о файле резервного копирования в БД .
					$this->_saveDataFileDb( $size );
				}
				catch (Exception $e)
				{
					$code = $e->getCode();
					$mes = $e->getMessage();
				    switch($code ){
						# Если отсутствует таблица для хранения информации о резервном копировании - Создать !!!
				    	case 1146 :
							$mes_success = 'Создана таблица `#__gnz11_core_backups` для хранения результатов резервного копирования ';
							$res_restore = $this->restore(__DIR__ . '/sql/backup.table.sql' , $mes_success );
							$MessageQueue = $this->app->getMessageQueue();
							# Сохранить данные о файле резервного копирования в БД .
							$this->_saveDataFileDb( $size );
							break ;
						default :
							throw $e ;
					}
				}
				$this->app->enqueueMessage('Backup completed successfully');
				return true;
			} else
				return false;

		}

		/**
		 * Получить список точек восстановления
		 * @return array
		 * @since 3.9
		 */
		public function getBackups() {
			$query = $this->db->getQuery(true);
			$query->select('*' );
			$query->select("DATE_FORMAT(date, '%d.%m.%Y %H:%i:%s') AS date2" );
			$query->from($this->db->quoteName('#__gnz11_core_backups'));
			if( $this->backup_namespace )
			{
				$query->where( $this->db->quoteName('namespace') .'='.$this->db->quote( $this->backup_namespace ) );
			}#END IF
			$query->order( $this->db->quoteName('date') . 'DESC');
			$this->db->setQuery($query);
			try
			{
			    $AssocList =  $this->db->loadAssocList();
			}
			catch ( Exception $e)
			{
				$code = $e->getCode();
				$mes = $e->getMessage();
				switch($code ){
					# Если отсутствует таблица для хранения информации о резервном копировании !!!
					case 1146 :
						return [] ;
						break ;
					default :
						throw $e ;
				}

			}

			$layout = new \Joomla\CMS\Layout\FileLayout('backupsList');
			$layout->addIncludePaths(JPATH_LIBRARIES . '/GNZ11/Core/Backup/tmpl');
			$html  =   $layout->render([ 'data' => $AssocList ]);
			return ['data' => $AssocList , 'html' => $html ] ;
		}

		/**
		 * Восстановить резервную копию по id
		 * @since 3.9
		 */
		public function restoreById ($backupId){
			$query = $this->db->getQuery(true);
			$query->select('*' );
			$query->from($this->db->quoteName('#__gnz11_core_backups'));
			$query->where( $this->db->quoteName('backup_id') .'='. $this->db->quote( $backupId ) );
			$this->db->setQuery($query);
			$data = $this->db->loadAssoc();

			$this->restore($data['file']) ;
			echo'<pre>';print_r( $data );echo'</pre>'.__FILE__.' '.__LINE__;
			die(__FILE__ .' '. __LINE__ );


		}
		function restore( $file , $mes_success = false ) {

			$query        = '';
			$success      = 0;
			$counter      = 0;


//			$this->table->load($this->id);
//			$this->table->dateFormat('date', 'd.m.Y H:i:s');
			if ( substr( $file , -3) == 'sql' ) {
				if ( !\Joomla\CMS\Filesystem\File::exists( $file ) ) {
					throw new Exception('Файл '.$file.' не существует' , 500 );
				}
				$file_handler = fopen($file, "r");




				while (!feof($file_handler)) {
					$counter++;
					$query .= fgets($file_handler, 16192);

					echo'<pre>';print_r( $file );echo'</pre>'.__FILE__.' '.__LINE__;
					echo'<pre>';print_r( $file_handler );echo'</pre>'.__FILE__.' '.__LINE__;
					echo'<pre>';print_r( substr(trim($query), -1) == ";" );echo'</pre>'.__FILE__.' '.__LINE__;
					echo'<pre>';print_r( $query );echo'</pre>'.__FILE__.' '.__LINE__;



					if ( substr(trim($query), -1) == ";" ) {

						if( $query != 'TRUNCATE TABLE `dveri_jshopping_categories`;' )
						{
							echo'<pre>';print_r( $query );echo'</pre>'.__FILE__.' '.__LINE__;
							die(__FILE__ .' '. __LINE__ );
						}#END IF



						$this->db->setQuery($query);
						$query = '';
						/*if ( $this->db->execute() ) {
							$success++;
							$query = '';
						}*/
					}
				}
				die(__FILE__ .' '. __LINE__ );

				if( $success )
				{
					$mes = 'Данные восстановлены: TIME OF('. $this->table->date .')'. '<br>Количество запросов -' . $success ;
					if( $mes_success )
					{
						$mes = $mes_success ;
					}#END IF
					$this->app->enqueueMessage( $mes , $type = 'Notice');
					return true ;
				}
				else
				{

				}
			}
			# TODO - Доделать работу с архивами!
			else {
				$mainframe = JFactory::getApplication();
				$command   = "gunzip < " . JPATH_ROOT . DS . 'administrator' . DS . 'components' . DS . 'com_excel2js' . DS . 'backup' . DS . $this->table->file_name . " | mysql -h" . $mainframe->get('host') . " -u" . $mainframe->get('user') . " -p" . $mainframe->get('password') . " " . $mainframe->get('db');

				system($command, $output);
				if ( $output === 0 )
					echo JText::_('DATA_SUCCESSFULLY_RECOVERED_AT_THE_TIME_OF') . $this->table->date;
				else
					echo '<b><span style="color:#FF0000">' . JText::_('DATA_WAS_NOT_RESTORED') . '</span></b><br />' . $this->_db->ErrorMsg();
				exit();
			}

		}

		/**
		 * Сохранить данные о файле резервного копирования в БД .
		 * @param $size int Размер файла бекапа
		 * @since 3.9
		 */
		private function _saveDataFileDb ( $size ){
			$file = $this->backup_path . DS . $this->backup_filename ;
			$date = new \Joomla\CMS\Date\Date();
			$now = $date->toSql();
			$this->db->setQuery( "
				INSERT INTO #__gnz11_core_backups 
				SET 
					file = '".$file."',
					namespace = '".$this->backup_namespace."',
					size='$size',
					date='$date'
					" );
			$this->db->execute();
		}


		/**
		 * Установка значений по умолчанию
		 * @since 3.9
		 */
		private function _Def(){
			$this->components = [
				'jshopping' => [ "#__jshopping_categories" , "#__jshopping_products" , "#__jshopping_products_attr" , "#__jshopping_products_attr2" , "#__jshopping_products_images" , "#__jshopping_products_prices" , "#__jshopping_products_relations" , "#__jshopping_products_to_categories" , "#__jshopping_products_free_attr" , "#__jshopping_products_files" , "#__jshopping_manufacturers" , "#__jshopping_attr" , "#__jshopping_attr_values" ]
			];
			if( !Folder::exists( $this->backup_path ) )
			{
				Folder::create($this->backup_path , 0755) ;
			}#END IF
			

		}

		/**
		 * Установить список таблиц для компонента
		 * @param $component
		 * @return string[]
		 * @throws Exception
		 * @since 3.9
		 */
		private function _getTableList($component){
			if( !array_key_exists($component , $this->components ) )
			{
				$keys = array_keys($this->components) ;
				$mes = 'Не указан компонент для копирования.'."\n" ;
				$mes .= 'Возможно использовать следующие компоненты: ' . implode(',' , $keys ) ;
				throw new Exception( $mes , 500);
			}#END IF
			$this->backup_component_table = $this->components[ $component ];


		}



	}