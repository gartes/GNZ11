<?php
	
	namespace GNZ11\Document;
	
	use DOMDocument;
	use Exception;
	use stdClass;
	
	/**
	 * @since       3.9
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 * @package     GNZ11\Document
	 */
	class Dom extends DOMDocument
	{
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
		
		/**
		 * Получить атребуты узла
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
					case 'async' :
						$thisAttr = self::testAttribute( $nodeElement , $attr );
						break;
					case 'defer' :
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
		public static function writeBottomHeadTag ( $tag , $value , stdClass $attr = null , $params = [] ){
			$app = \JFactory::getApplication() ;
			
			$body                = $app->getBody();
			$dom = new self();
			
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
			$xpath = new \DomXPath($dom);
			$parent = $xpath->query( '//head');
			
			
			
			
			
			$newTag =  $dom->createElement( $tag , htmlentities( $value ) );
			
			# Установка атрибутов узла
			self::fetchAttr($dom ,$newTag , $attr );
			
			
			$parent->item(0)->appendChild( $newTag );
			
			
			
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
			
			
			
			
			$log = [] ;
			foreach ($attrs as $name => $attrVal  ){
				if ( !in_array($name , self::$attrArrName) ) { continue ;  }
				
				
				
				switch ($name){
					case 'id':
					case 'class':
					case 'media':
					case 'as' :
						if ( !$attrVal ) {continue ; }
						$log[$name] = $attrVal ;
						self::AddAttribute($dom, $elem, ''.$name , $attrVal );
						break ;
					case 'async':
					case 'defer':
					
					case 'crossorigin' :
						if ( !$attrVal ) { continue; }
						$log[$name] = $attrVal ;
						self::AddAttribute($dom, $elem, ''.$name , false );
						break ;
					case 'type':
						if ( $attrVal == 'text/javascript' ){ continue ;  }
						$log[$name] = $attrVal ;
						break ;
					default :
						self::AddAttribute($dom, $elem,    ''.$name      , $attrVal );
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
		
		
		
	}