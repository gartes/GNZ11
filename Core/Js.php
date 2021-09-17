<?php
	namespace GNZ11\Core;
	/**
	 * @package     GNZ11\Core
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 */

	use Exception;
	use JFactory;
    use Joomla\Registry\Registry;
    use JSession;
	use JUri;
	use RegularLabs\AdvancedModules\Document;

	class Js
	{
	    private static $GNZ11_params ;

		private $app;
		public static $instance;
		private $paramsComponent ;
		public static $timeOut ;
		public static $GNZ11 = [
			'gnzlib_path_file_corejs'=>'/libraries/GNZ11/assets/js/gnz11.js',
			'gnzlib_path_file_corejs_min'=>'/libraries/GNZ11/assets/js/gnz11.min.js',
			'gnzlib_path_modules'=>'/libraries/GNZ11/assets/js/modules' ,
			'gnzlib_path_plugins'=>'/libraries/GNZ11/assets/js/plugins' ,
            'gnzlib_path_sprite' => "libraries/GNZ11/assets/img/_sprite1111.svg",
			'gnzlib_debug'=>false ,

		] ;
		
		
		
		/**
		 * helper constructor.
		 * @throws Exception
		 * @since 3.9
		 */
		protected function __construct ( $params = null )
		{
            self::$GNZ11_params = new Registry() ;
            $Manifest = \GNZ11\Extensions\Manifest::instance();
            $Manifest->addPath(JPATH_LIBRARIES . '/GNZ11/gnz11.xml');
//            \Joomla\CMS\Profiler\Profiler::getInstance('Application')->mark('beforeLoad');
            $version = $Manifest->getValue();
            self::$GNZ11_params->set('version' , $version ) ;
            self::$GNZ11_params->set('versionHash' , md5( $version ) ) ;
            $debug = $Manifest->getValue('debug');
            self::$GNZ11_params->set('debug' , $debug ) ;



            $this->app = JFactory::getApplication() ;
			if( !$params )
			{
				$params = new Registry;
			}#END IF
			$this->paramsComponent = $params ;

			if( $this->CoreJs_isLoaded ) return  null ;  #END IF

			$this->setConfig_GNZ11 ();

			return $this;
		}#END FN
		
		/**
		 * @param   null  $params
		 *
		 * @return Js
		 * @throws Exception
		 * @since 3.9
		 */
		public static function instance ( $params = null  )
		{

			if( self::$instance === null )
			{
				self::$instance = new self( $params  );
			}
			return self::$instance;
		}#END FN
		
		function url(){
			return sprintf(
				"%s://%s%s",
				isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
				$_SERVER['SERVER_NAME']
				,$_SERVER['REQUEST_URI']
			);
		}
		
		private function getUriRoot(){
			return sprintf(
				"%s://%s/",
				isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http' ,
				$_SERVER['SERVER_NAME']
			);
		}
		
		/**
		 *
		 * @return bool
		 *
		 * @since version
		 */
		private function setConfig_GNZ11 ()
		{
			$doc = JFactory::getDocument();

			$debug = self::$GNZ11_params->get('debug' , 0 ) ;
			



			
			$gnzlib_path_file_corejs     = $this->paramsComponent->get( 'gnzlib_path_file_corejs' , self::$GNZ11[ 'gnzlib_path_file_corejs' ] );
            $gnzlib_path_file_corejs .= '?v='.self::$GNZ11_params->get('versionHash' , 1 );







			
			$gnzlib_path_file_corejs_min = $this->paramsComponent->get( 'gnzlib_path_file_corejs_min' , self::$GNZ11[ 'gnzlib_path_file_corejs_min' ] );
			$gnzlib_path_modules         = $this->paramsComponent->get( 'gnzlib_path_modules' , self::$GNZ11[ 'gnzlib_path_modules' ] );
			$gnzlib_path_plugins         = $this->paramsComponent->get( 'gnzlib_path_plugins' , self::$GNZ11[ 'gnzlib_path_plugins' ] );
			$gnzlib_path_sprite         = $this->paramsComponent->get( 'gnzlib_path_sprite' , self::$GNZ11[ 'gnzlib_path_sprite' ] );

			$GNZ11_options =  $doc->getScriptOptions('GNZ11') ;
			$version = \GNZ11\Document\Document::getManifestVersion('/libraries/GNZ11/gnz11.xml') ;
			$data = [
                'gnzlib_path_sprite' => $gnzlib_path_sprite ,
				'gnzlib_path_file_corejs' => $gnzlib_path_file_corejs ,
				'gnzlib_path_modules' => $gnzlib_path_modules ,
				'gnzlib_path_plugins' => $gnzlib_path_plugins ,
				'gnzlib_path_file_corejs_min' => $gnzlib_path_file_corejs_min ,
				'debug' => $debug ,
				'Ajax' => [
					'siteUrl' => \GNZ11\Core\Uri\Uri::root() ,
					'noty_auto_render_message' => false   ,
				],
				'Noty' =>[
					'timeout' =>5000 ,
					'layout' => 'bottomLeft' ,
				],
				'Document' => [
					'Host' =>\JURI::root(true),
                    '_preload' => [] ,

				],
                'version' => $version ,
                'mediaVersion' => md5( $version ) ,
			];
			$new_options = array_merge($GNZ11_options , $data ) ;

			$doc->addScriptOptions('GNZ11'  , $new_options ) ;
			$doc->addScriptOptions('Jpro'  , [ 'load'=>[] ] ) ;
			

			
			
			if( $debug )
			{
				$gnzlib_path_file_corejs = $gnzlib_path_file_corejs_min ;
			}#END IF
			$sriptLoader = null ;
			# TODO : LOAD GNZ11 CORE
			$sriptLoader .= $this->_getLoaderCoreJs( $gnzlib_path_file_corejs );
			
			$sriptLoader .="
				Joomla = window.Joomla || {};
				Jpro = window.Jpro || {};
				(function (Joomla , Jpro ) {
						    
						        Joomla.optionsStorage = Joomla.optionsStorage || null;
						        Joomla.loadOptions = function( options ) {
						            // Load form the script container
						            if (!options) {
						                var elements = document.querySelectorAll('.joomla-script-options.new'),
						                    str,
						                    element,
						                    option,
						                    counter = 0;
						
						                for (var i = 0, l = elements.length; i < l; i++) {
						                    element = elements[i];
						                    str     = element.text || element.textContent;
						                    option  = JSON.parse(str);
						
						                    if (option) {
						                        Joomla.loadOptions(option);
						                        counter++;
						                    }
											element.className = element.className.replace(' new', ' loaded');
						                }
						
						                if (counter) {
						                    return;
						                }
						            }
						            // Initial loading
						            if (!Joomla.optionsStorage) {
						                Joomla.optionsStorage = options || {};
						            }
						            // Merge with existing
						            else if ( options ) {
						                for (var p in options) {
						                    if (options.hasOwnProperty(p)) {
						                        Joomla.optionsStorage[p] = options[p];
						                    }
						                }
						            }
						        };
						        Joomla.loadOptions();
						        
 
						        Jpro.load = function ( url ,  callback  ) {
						            
						            if (typeof GNZ11 === 'undefined'){
						                var opt = Joomla.getOptions('Jpro');
						                var data = {
						                    'u':url ,
						                    'c' : callback
						                };
						                opt.load.push(data);
						                Joomla.loadOptions({'Jpro':opt});
						            }else{
						                var gnz11 = new GNZ11();
						                gnz11.load[tag](url).then(function (a) {
						                if (typeof callback !== 'function') return ;
						                    callback(a)
						                });
						            }
						            
						        }
						    })(Joomla , Jpro);";
			
			
			$doc->addScriptDeclaration($sriptLoader);
			
			
			return true ;
		}
		
		private $CoreJs_isLoaded = false ;
		
		/**
		 * @param $gnzlib_path_file_corejs
		 *
		 * @return string
		 *
		 * @since version
		 */
		private function _getLoaderCoreJs ( $gnzlib_path_file_corejs )
		{
			$domain = null ;
			if( class_exists('\Joomla\CMS\Uri\Uri') )
			{
				$domain = \Joomla\CMS\Uri\Uri::root(true) ;
			}#END IF

            $hashVer = self::$GNZ11_params->get('versionHash') ;
            $fileCoreJs = $domain . self::$GNZ11['gnzlib_path_file_corejs'] .'?'.$hashVer ;

            /*echo'<pre>';print_r( $fileCoreJs );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            echo'<pre>';print_r( self::$GNZ11['gnzlib_path_file_corejs'] );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            echo'<pre>';print_r( self::$GNZ11_params );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            echo'<pre>';print_r( $gnzlib_path_file_corejs );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
            die(__FILE__ .' '. __LINE__ );*/

			
			$sriptLoader = "document.addEventListener('DOMContentLoaded', function () {";
			$sriptLoader .= "var n = document.createElement('script');";
			$sriptLoader .= "n.setAttribute('type', 'text/javascript');";
			$sriptLoader .= "n.setAttribute('src', '" . $fileCoreJs . "');";
			$sriptLoader .= "n.setAttribute('async', true);";
			$sriptLoader .= "n.onerror = function() { n.onerror = null; };";
			$sriptLoader .= "n.onload = n.onreadystatechange = function() {
                                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                                    n.onload = n.onreadystatechange = null;
                                }
                            };";
			$sriptLoader .= "document.body.appendChild(n);";
			$sriptLoader .= "});";
			
			$sriptLoader .= "window.CoreGnz11 = {" ;
				$sriptLoader .= " 'Status' : 'loading'," ;
				$sriptLoader .= " 'SiteUrl' : '".\GNZ11\Core\Uri\Uri::root() ."'," ;
			$sriptLoader .=  "};";



			
			return $sriptLoader;
		}

        /**
         * TODO - УДАЛИТЬ !!!
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   08.05.2021 06:29
         *
         */
		public static function addTaskLazy(){
		    die(__FILE__ .' '. __LINE__ );

			$doc = JFactory::getDocument();
			$Jpro = $doc->getScriptOptions('Jpro') ;
			$Jpro['load'][] = [
				'u' => 'https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.4.0/dist/lazyload.min.js' ,
				't' => 'js' ,
				'c' => 'onLazyIsLoad' ,
			];
			$doc->addScriptOptions('Jpro' , $Jpro ) ;
		}
        protected static $JproLoaded = [] ;

        /**
         * Добавить в отложенную загрузку файлы рессурсов ( CSS or JS )
         * @param $Assets   string Url - ресурса
         * @param bool $Callback string Callback после загрузки ( для JS файлов )
         * @param bool $Trigger string  Trigger - для ожидания загрузки
         * @since 3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date 07.10.2020 18:21
         * @depecated
         */
		public static function addJproLoad(string $Assets, $Callback = false , $Trigger = false , $__params = false ){
            $doc = \Joomla\CMS\Factory::getDocument();
            $Jpro = $doc->getScriptOptions('Jpro') ;

            
		    $_assets=[];
            $_assets[] = $Assets ;
		    if ( is_array( $Assets ))
            {
                $_assets = $Assets ;
            }#END IF

            $_exlArr = [
                'https://www.googletagmanager.com/gtag/js'
            ];

            foreach ( $_assets as $asset)
            {
                if ( in_array( $asset , self::$JproLoaded  )) continue ;  #END IF

                $assetExt = strtok( $asset, '?') ;

                $Ext = \Joomla\CMS\Filesystem\File::getExt($assetExt);

                if( in_array( $assetExt , $_exlArr ) )
                {
                    $Ext = 'js' ;
                }#END IF
                
               /* if( $Assets == 'https://www.googletagmanager.com/gtag/js?id=UA-90953502-1' )
                {
                    echo'<pre>';print_r( $Ext );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
                    echo'<pre>';print_r( $assetExt );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
                    echo'<pre>';print_r( $Assets );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;
                    die(__FILE__ .' '. __LINE__ );
                }#END IF*/

                $params =[
                    'u' => $asset ,     // Путь к файлу
                    't' => $Ext ,       // Тип загружаемого ресурса
                ];

                if ( $Callback  ) $params['c'] = $Callback  ; #END IF
                if ( $Trigger   ) $params['r'] = $Trigger   ; #END IF


                if( isset( $__params['media'] ) &&  $__params['media'] != 'all'  )
                {
                    $params['m'] = $__params['media'] ;
                }#END IF



                $Jpro['load'][] = $params ;

                $doc->addScriptOptions('Jpro' , $Jpro ) ;

                self::$JproLoaded[] = $asset ;

            }#END FOREACH


        }

		/**
		 * создать загрузчик javascript файла
		 *
		 * @param $file string - ссылка на javascript файл
		 *
		 * 02.02.2020
		 * @return string - wgnz11.load.js('/modules/mod_gj_contact_phones/assets/js/mod_.js')
		 * @throws Exception
		 * @since 3.9
		 */
		public static function getLoadJs( $file ){
			if( self::$instance === null )
			{
				self::$instance = new self();
			}
			return "wgnz11.load.js('$file')" ;
		}
		
	}