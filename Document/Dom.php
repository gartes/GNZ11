<?php
	namespace GNZ11\Document;
	use Akeeba\Engine\Driver\Joomla;
	use DOMDocument;
	use Exception;
	use JFactory;
	use stdClass;
	use DomXPath;


	/**
	 *
     *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 * @package     GNZ11\Document
     * @since       3.9
	 */
	class Dom extends DOMDocument
	{
		public static $CMS = 'Joomla' ;
		/**
		 * @since 3.9
		 * @var array Список атрибутов для получения || установки
		 */
		private static $attrArrName = [
			'id' ,
			'class' ,
			'type' ,
			'defer' ,
			'async' ,
			'src' ,
			'rel' ,
			'href' ,
			'as' ,
			'crossorigin' ,
			'media' ,
			'onload'
		];
		
		public function __construct ( $version = '1.0' , $encoding = 'utf-8' )
		{
		    parent::__construct( $version , $encoding );
            return $this;
		}


        public  function loadHTML( $source,   $encoding = 'utf-8') {
            $_source = mb_convert_encoding( $source, 'HTML-ENTITIES', $encoding);
            @parent::loadHTML(''.$_source);
        }
        public function saveHTML(){
            return html_entity_decode( parent::saveHTML() );
        }

        /**
         * Создать новый тег в экз.Dom перед закрывающемся тегом </body>
         *
         * @param Dom       $dom
         * @param string    $tag название нового тега
         * @param string    $value контент тега
         * @param array     $attr атребуты тега
         *
         * @since     3.8
         * @author    Gartes
         *
         * @copyright 02.01.19
         */
        public static function writeDownTag ( $dom , $tag , $value , $attr=[] , $params = []  ){

            $newTag =  $dom->createElement( $tag , htmlentities( $value ) );
            # add class attribute
            self::fetchAttr($dom ,$newTag , $attr );
            $xpath = new DomXPath($dom);
            $parent = $xpath->query( '//body');
            $parent->item(0)->appendChild( $newTag );
        }#END FN

        /**
         * Подключить phpQuery
         * @param $html
         * @param bool $debug
         *
         * @return
         *
         * @since version
         */
		public static function getPhpQuery( $html , $debug = false ){
            if ( !class_exists('phpQuery') ) {
                require ( JPATH_LIBRARIES . '/GNZ11/Document/Dom/phpQuery.php');
            }#END IF
            \phpQuery::$debug = $debug ;
            return \phpQuery::newDocument( $html );
        }
		
		/**
		 * Получить атрибуты узла
		 *
		 * @param          $nodeElement  - DOM Node
		 * @param   array  $excludeAttr  - ислючить attr
		 *
		 * @return array
		 * @since     3.8
		 * @author    Gartes
		 *
		 * @copyright 05.01.19
		 */
		public static function getAttrElement ( $nodeElement , $excludeAttr = [] )
		{
			$retAttr = [];
			foreach( self::$attrArrName as $attr )
			{
				if( in_array( $attr , $excludeAttr ) ) continue; #END IF
				switch( $attr )
				{
					case 'defer':
					case 'async' :
						$thisAttr = self::testAttribute( $nodeElement , $attr );
						break;
					default :
						$thisAttr = $nodeElement->getAttribute( $attr );
				}#END SWITCH
				
				if( !empty( $thisAttr ) )
				{
					$retAttr[ $attr ] = $thisAttr;
				}#END IF
				
			}#END FOREACH
			return $retAttr;
		}#END FN

		/**
		 * Добавить узел в конец тега  <head>
		 *
		 * @param   string  $tag    - Tag Name
		 * @param   string  $value  - Tag value
		 * @param   array   $attr   - Tag attributes
		 *
		 * @throws Exception
		 * @since     3.8
		 * @copyright 05.01.19
		 * @author    Gartes
		 *
		 */
		public static function writeBottomHeadTag ( $tag , $value ,  $attr = null , $params = [] ){
			$app = JFactory::getApplication() ;
			
			$body                = $app->getBody();
			$dom = new self();
			
			# TODO - Установить в метод перед рендингом страницы
		    if( isset( $params['formatOutput'] ) && $params['formatOutput'] )
			{
				# форматирует вывод страницы добавляет знаки переноса строк к тегам
				# TODO - Сделать зависимым от настроек компонента
				# Форматирует вывод, добавляя отступы и дополнительные пробелы.
				$dom->formatOutput = true;
				# Указание не убирать лишние пробелы и отступы. По умолчанию TRUE
				$dom->preserveWhiteSpace = false;
			}#END IF
			
			$dom->loadHTML( $body );

            self::_setBottomHeadTag($dom, $tag, $value, $attr);


            $body =   $dom->saveHTML() ;
			$app->setBody($body);
		}#END FN

        /**
         * Создать новый тег и вставить его в экз. DOM Перед закрываеющеемся тегом </head>
         * @param Dom $dom
         * @param string $tag
         * @param string $value
         * @param array $attr
         * @return \DOMElement
         * @since 3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date 25.08.2020 21:03
         *
         */
        public static function _setBottomHeadTag(Dom $dom, string $tag, string $value, array $attr = null ): \DOMElement
        {
            $xpath = new DomXPath($dom);
            $parent = $xpath->query('//head');
            $newTag = $dom->createElement($tag, htmlentities($value));
            # Установка атрибутов узла
            self::fetchAttr($dom, $newTag, $attr);
            $parent->item(0)->appendChild($newTag);
            return $newTag;
        }


		/**
		 * Добавить тег в тело документа перед закрывающемся тегом </noscript>
		 *
		 * @param   string  $tag    название тега
		 * @param   string  $value  контент тега
		 * @param   array   $attr   атребуты тега
		 *
		 * @throws Exception
		 * @since 3.9
		 */
		public static function writeDownNosciptTag($tag , $value , $attr=[]){
			$app = JFactory::getApplication() ;
			$body                = $app->getBody();
			$dom = new self();
			$dom->loadHTML( $body );
			
			$newTag =  $dom->createElement( $tag , htmlentities( $value ) );
			
			# add class attribute
			self::fetchAttr($dom ,$newTag , $attr );
			
			$xpath = new DomXPath($dom);
			$parent = $xpath->query( '//noscript');
			
			$parent->item(0)->appendChild( $newTag );
			$body =   $dom->saveHTML() ;
			
			$app->setBody($body);
		}#END FN

		/**
		 * Создание тегов в начале тега <head>
		 *
		 * @param       $tag
		 * @param       $value
		 * @param array $attr
		 *
		 * @throws Exception
		 * @author    Gartes
		 *
		 * @since     3.8
		 * @copyright 05.01.19
		 */
		public static function writeTopHeadTag ( $tag , $value , $attr=[]){
			$app = JFactory::getApplication() ;
			$body                = $app->getBody();
			$dom = new self();
			$dom->loadHTML( $body );
			
			$xpath = new DomXPath($dom);
			$parent = $xpath->query( '//head');
			
			$firstSibling = $parent->item(0)->firstChild;
			
			$newTag =  $dom->createElement( $tag , htmlentities( $value ) );
			# add class attribute
			self::fetchAttr($dom ,$newTag , $attr );
			$parent->item(0)->insertBefore( $newTag , $firstSibling ) ;
			$body =   $dom->saveHTML() ;
			$app->setBody($body);
		}#END FN
		
		/**
		 * Установка атрибутов узла
		 * @param       $dom
		 * @param       $elem
		 * @param array $attrs
		 *
		 * @author    Gartes
		 *
		 * @since     3.8
		 * @copyright 02.01.19
		 */
		public static function fetchAttr ( $dom , &$elem , $attrs=[] ){
			if ( !count( (array)$attrs ) ) { return ; }
			$exclTypeArr = ['text/javascript','text/css'] ;
			$log = [] ;
			foreach ($attrs as $name => $attrVal  ){
				if ( !in_array($name , self::$attrArrName) )  continue ;
				
				switch ($name){
					case 'id':
					case 'class':
					case 'media':
					case 'as' :
					case 'onload' :
						if ( !$attrVal ) {continue ; }
						$log[$name] = $attrVal ;
						self::AddAttribute($dom, $elem, ''.$name , $attrVal );
					break ;
					
					case 'crossorigin' :
						if ( !$attrVal ) { continue; }
						self::AddAttribute($dom, $elem, ''.$name , 'anonymous' );
						
						break ;
					
					case 'async':
					case 'defer':
						if ( !$attrVal ) { continue; }
						$log[$name] = $attrVal ;
						self::AddAttribute($dom, $elem, ''.$name , false );
					break ;
					case 'type':
						if ( in_array( $attrVal , $exclTypeArr) || empty( $attrVal )  ) continue ;
						self::AddAttribute($dom, $elem,    ''.$name      , $attrVal );
						$log[$name] = $attrVal ;
					break ;
					
					default :
						
						if( isset( $attrs->href ) && $name == 'onload'  )
						{
//							echo'<pre>';print_r( $name );echo'</pre>'.__FILE__.' '.__LINE__;
//							echo'<pre>';print_r( $attrVal );echo'</pre>'.__FILE__.' '.__LINE__;
//							echo'<pre>';print_r( $attrs );echo'</pre>'.__FILE__.' '.__LINE__;
							
							
						}#END IF
						
						
						self::AddAttribute($dom, $elem,    ''.$name ,$attrVal );
						$log[$name] = $attrVal ;
						
				}
			}#END FOREACH
		}#END FN
		
		/**
		 * Добавить атребуты к элементу
		 *
		 * @param   Object  $dom      - GNZ11\Document\Dom
		 * @param   Object  $element  - DOMElement
		 * @param   string  $name     - Attribute Name
		 * @param   string  $value    - Attribute value
		 *
		 * @since     3.8
		 * @author    Gartes
		 *
		 * @copyright 01.12.18
		 */
		public static function AddAttribute($dom, &$element, $name, $value = null ) {
			$value = str_replace('&', "&amp;",  $value );
			$attr = $dom->createAttribute($name);
			if ($value)
			{
				$attr->value = $value;
			}#END IF
			
			/*if( $name == 'onload' )
			{
				echo'<pre>';print_r( $attr );echo'</pre>'.__FILE__.' '.__LINE__;
				echo'<pre>';print_r( $name );echo'</pre>'.__FILE__.' '.__LINE__;
				echo'<pre>';print_r( $value );echo'</pre>'.__FILE__.' '.__LINE__;
			}#END IF*/
			
			$element->appendChild($attr);
		}#END FN
		
		public static function DOMinnerHTML ( $element )
		{
			$innerHTML = "";
			$children  = $element->childNodes;
			foreach ( $children as $child )
			{
				$tmp_dom = new self();
				$tmp_dom->appendChild( $tmp_dom->importNode( $child, true ) );
				$innerHTML .= trim( $tmp_dom->saveHTML() );
			}
			return $innerHTML;
		}

        /**
         * Проверить наличие атрибута async
         *
         * @param $nodeElement
         * @param $attr
         *
         * @return bool true если атребут присутствует
         *
         * @since version
         */
        private static function testAttribute ( $nodeElement , $attr )
        {
            $newdoc               = new DOMDocument;
            $newdoc->formatOutput = true;
            $newdoc->loadXML( "<test><yyyy></yyyy></test>" );
            $newdoc->saveXML();

            $node = $newdoc->importNode( $nodeElement , true );

            $newdoc->documentElement->appendChild( $node );
            $testAsync = $newdoc->saveXML();
            $pos       = strpos( $testAsync , $attr );

            if( $pos )
            {
                return true;
            }#END IF

            return false;
        }#END FN




    }