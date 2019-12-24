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
	use JSession;
	use JUri;
	
	class Js
	{
		private $app;
		public static $instance;
		private $paramsComponent ;
		public static $timeOut ;
		public static $GNZ11 = [
			'gnzlib_path_file_corejs'=>'/libraries/GNZ11/assets/js/gnz11.js',
			'gnzlib_path_file_corejs_min'=>'/libraries/GNZ11/assets/js/gnz11.min.js',
			'gnzlib_path_modules'=>'/libraries/GNZ11/assets/js/modules' ,
			'gnzlib_path_plugins'=>'/libraries/GNZ11/assets/js/plugins' ,
			'gnzlib_debug'=>false ,
		] ;
		
		
		
		/**
		 * helper constructor.
		 * @throws Exception
		 * @since 3.9
		 */
		protected function __construct ( $params = null )
		{
			$this->app = JFactory::getApplication() ;
			if( !$params )
			{
				$params = new \Joomla\Registry\Registry;
			}#END IF
			
			$this->paramsComponent = $params ;
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
			
			$gnzlib_debug = $this->paramsComponent->get( 'gnzlib_debug' , self::$GNZ11['gnzlib_debug'] );
			$gnzlib_path_file_corejs     = $this->paramsComponent->get( 'gnzlib_path_file_corejs' , self::$GNZ11[ 'gnzlib_path_file_corejs' ] );
			$gnzlib_path_file_corejs_min = $this->paramsComponent->get( 'gnzlib_path_file_corejs_min' , self::$GNZ11[ 'gnzlib_path_file_corejs_min' ] );
			$gnzlib_path_modules         = $this->paramsComponent->get( 'gnzlib_path_modules' , self::$GNZ11[ 'gnzlib_path_modules' ] );
			$gnzlib_path_plugins         = $this->paramsComponent->get( 'gnzlib_path_plugins' , self::$GNZ11[ 'gnzlib_path_plugins' ] );
			$GNZ11_options =  $doc->getScriptOptions('GNZ11') ;
			$data = [
				'gnzlib_path_file_corejs' => $gnzlib_path_file_corejs ,
				'gnzlib_path_modules' => $gnzlib_path_modules ,
				'gnzlib_path_plugins' => $gnzlib_path_plugins ,
				'gnzlib_path_file_corejs_min' => $gnzlib_path_file_corejs_min ,
				'debug' => $gnzlib_debug ,
				'Ajax' => [
					'siteUrl' => \GNZ11\Core\Uri\Uri::root() ,
					'noty_auto_render_message' => false   ,
				],
				'Noty' =>[
					'timeout' =>5000 ,
					'layout' => 'bottomLeft' ,
				],
			];
			
			$new_options = array_merge($GNZ11_options , $data ) ;
			$doc->addScriptOptions('GNZ11'  , $new_options ) ;
			$doc->addScriptOptions('Jpro'  , [ 'load'=>[] ] ) ;
			
			$Jpro = $doc->getScriptOptions('Jpro') ;
			$Jpro['load'][] = [
				'u' => '/libraries/GNZ11/assets/js/alert_test.js' ,
				't' => 'js' ,
				'c' => 'testCallback' ,
			];
			$doc->addScriptOptions('Jpro' , $Jpro ) ;
			
			
			if( $gnzlib_debug )
			{
				$gnzlib_path_file_corejs = $gnzlib_path_file_corejs_min ;
			}#END IF
			$sriptLoader = null ;
			
			$sriptLoader = $this->_getLoaderCoreJs( $gnzlib_path_file_corejs );
			
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
		
		/**
		 * @param $gnzlib_path_file_corejs
		 *
		 * @return string
		 *
		 * @since version
		 */
		private function _getLoaderCoreJs ( $gnzlib_path_file_corejs )
		{
			$sriptLoader = "document.addEventListener('DOMContentLoaded', function () {";
			$sriptLoader .= "var n = document.createElement('script');";
			$sriptLoader .= "n.setAttribute('type', 'text/javascript');";
			$sriptLoader .= "n.setAttribute('src', '" . $gnzlib_path_file_corejs . "');";
			$sriptLoader .= "n.setAttribute('async', true);";
			$sriptLoader .= "n.onerror = function() { n.onerror = null; };";
			$sriptLoader .= "n.onload = n.onreadystatechange = function() {
                                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                                    n.onload = n.onreadystatechange = null;
                                }
                            };";
			$sriptLoader .= "document.body.appendChild(n);";
			$sriptLoader .= "});";
			
			return $sriptLoader;
		}
		
		public static function addTaskLazy(){
			$doc = JFactory::getDocument();
			$Jpro = $doc->getScriptOptions('Jpro') ;
			$Jpro['load'][] = [
				'u' => 'https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.4.0/dist/lazyload.min.js' ,
				't' => 'js' ,
				'c' => 'onLazyIsLoad' ,
			];
			$doc->addScriptOptions('Jpro' , $Jpro ) ;
		}
		
	}