<?php
	namespace GNZ11\Api\Optimize ;
	use Exception;

	
	/**
	 *
     *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 * @package     GNZ11\Api\Optimize
     * @since 3.9
	 */
	
	class Js_css
	{
		
		private $params ;
		/**
		 * Js_css constructor.
		 * @since 3.9
		 */
		public function __construct ($params = [] )
		{
			$this->params = $params ;
		}
		
		/**
		 * @param $url
		 * @param $content
		 *
		 * @return array
		 *
		 * @throws Exception
		 * @since version
		 */
		public function Minified($url, $content){
			
			$res = [] ;
			
			$resContent = $this->getMinified($url, $content) ;
			# Емли в ответе сообщение об ошибки
			if (preg_match("/^\/\/ Error :/i", $resContent )) {
				$find =['// Error :' , '//'];
				$replace =['Error :' , '<br>'];
				$mes = str_replace($find , $replace, $resContent );
				throw new Exception(  $mes , 500);
			}
			
			
			$inSize = round( ( mb_strlen(  $content , '8bit') /1000) , 2 ) ;
			$outSize = round( ( mb_strlen(  $resContent , '8bit') /1000) , 2 ) ;
			
			$res['content'] = $resContent;
			$res['sizes'] = [
				'in'=>  $inSize ,
				'out'=> $outSize ,
				'zip_percent' => round( 100-($outSize/$inSize*100) , 1 ) ,
            ];
			
			
			
			
			return $res ;
			
		}
		
		/**
		 * @param $url  - адрес запроса
		 * @param $content - содержимое JS или CSS
		 *
		 * @return false|string
		 * @author    Gartes
		 *
		 * @since     3.8
		 * @copyright 08.01.19
		 */
		public function getMinified($url, $content) {
			$postdata = array('http' => array(
				'method'  => 'POST',
				'header'  => 'Content-type: application/x-www-form-urlencoded',
				'content' => http_build_query( array('input' => $content) ) ) );
			return file_get_contents($url, false, stream_context_create($postdata));
		}#END FN



        /**
         * @var Minify\CSS
         */
//        private $minifier;

        public static function mergeCss( $fileArr ){

/*
            \JLoader::registerNamespace('MatthiasMullie\Minify',JPATH_LIBRARIES.'/GNZ11/Api/Optimize/Assets/Js_css/MatthiasMullie',$reset=false,$prepend=false,$type='psr4');
            $minifier = new \MatthiasMullie\Minify\CSS($fileArr[0]) ;


            echo'<pre>';print_r(  $minifier->minify()  );echo'</pre>'.__FILE__.' '.__LINE__;
            die(__FILE__ .' '. __LINE__ );*/

            
            




		    return true ;
        }
		
	}