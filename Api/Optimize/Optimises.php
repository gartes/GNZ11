<?php
namespace GNZ11\Api\Optimize ;
/**
 * @package     GNZ11\Api\Optimize
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */


use Joomla\Registry\Registry;
use Exception;
use Joomla\CMS\Factory;

class Optimises
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
    private $db;
    private $Params ;
    private $MyName ;
    private $Preload ;


    public static $instance;
    private $_scriptCollection = [] ;
    private $_scriptDeclarationCollection = [] ;



    /**
     * helper constructor.
     * @throws Exception
     * @since 3.9
     */
    private function __construct($options = array())
    {
        // Get the parameters.
        if ( !empty( $options ))
        {
            if ( $options instanceof Registry)
            {
                $this->Params = $options;
            }
            else
            {
                $this->Params = new Registry($options);
            }
        }
        $this->Preload = new Registry();
        $this->MyName = $this->Params->get('my_name' , 'Optimizer' )  ;
        $this->app = Factory::getApplication();
        $this->db = Factory::getDbo();
        return $this;
    }#END FN

    /**
     * @param array $options
     *
     * @return Optimises
     * @throws Exception
     * @since 3.9
     */
    public static function instance($options = array())
    {
        if (self::$instance === null) {
            self::$instance = new self($options);
        }
        return self::$instance;
    }#END FN

    /**
     * Добавить параметры в Optimises
     * @param array|Registry $Params
     * @since 3.9
     */
    public function setParams(  $Params)
    {
        $Params = new Registry($Params) ;
        $this->Params->merge( $Params ) ;
    }

    /**
     * Старт Optimises - Выполнить задания по оптимизации
     *
     * @throws Exception
     * @since version
     */
    public function Start (){
//        echo'<pre>';print_r( $this->Params );echo'</pre>'.__FILE__.' '.__LINE__;
//        die(__FILE__ .' '. __LINE__ );


        # Перенос скриптов вниз страницы
        if ( $this->Params->get('downScript' , 0 ))  $this->downScript() ;#END IF
        # Выгрузка части страницы в html файл
        if ( !empty($this->Params->get('to_html_file' , [] ))) $this->toHtmlFile() ;#END IF
        # Обворачивать элементы в тег <template /> : Array
        if ( !empty($this->Params->get('to_templates' , [] ))) $this->toTemplates() ;#END IF
    }

    /**
     * обварачивать элементы в тег <template /> : Array
     *
     * @since 3.9
     */
    protected function toTemplates(){
        $toTemplatesArr = $this->Params->get('to_templates' , [] );
        $body                = $this->app->getBody();
        $dom = new \GNZ11\Document\Dom();
        $dom->loadHTML($body) ;
        $xpath       = new \DOMXPath( $dom );
        $_template = $dom->createElement('template');
        foreach ( $toTemplatesArr as $selector => $item) {
            $XPath = new \GNZ11\Document\Dom\Translator(   $selector );
            $Nodes = $xpath->query( $XPath );
            foreach( $Nodes as $node )
            {
                $template_clone = $_template->cloneNode();
                $template_clone->setAttribute( 'id' , '__template' . $this->_cleanSelector( $selector ) );
                $template_clone->setAttribute( 'class' , 'lazy' );
                $node->parentNode->replaceChild( $template_clone , $node );
                $template_clone->appendChild( $node );
            }


            foreach ($Nodes as $node) {
               // $node->parentNode->removeChild($node);
            }#END FOREACH
        }
        $body =   $dom->saveHTML() ;
        $this->app->setBody($body);
    }


    protected function toHtmlFile(){
        $toHtmlFileArr =$this->Params->get('to_html_file' , [] );

        $body                = $this->app->getBody();
        $dom = new \GNZ11\Document\Dom();
        $dom->loadHTML($body) ;
        $xpath       = new \DOMXPath( $dom );

        foreach ( $toHtmlFileArr as $selector => $item) {

            $XPath = new \GNZ11\Document\Dom\Translator(   $selector );
            $Nodes = $xpath->query( $XPath );
            foreach ($Nodes as $node) {
//                $node->parentNode->removeChild($node);
            }#END FOREACH



            /*echo'<pre>';print_r( $XPath->__toString() );echo'</pre>'.__FILE__.' '.__LINE__;
            echo'<pre>';print_r( $Nodes );echo'</pre>'.__FILE__.' '.__LINE__;
            die(__FILE__ .' '. __LINE__ );*/

        }#END FOREACH
    }

    /**
     * Перенос сериптов вниз страницы
     *
     * @throws Exception
     * @since version
     */
    public function downScript(){
        $body                = $this->app->getBody();
        $dom = new \GNZ11\Document\Dom();
        $dom->loadHTML($body) ;
        $xpath       = new \DOMXPath( $dom );
        # Найти все скрипты в теле страницы
        $scriptNodes = $xpath->query( "//script" );
        foreach ( $scriptNodes as $i => $scriptNode) {

            #Получить атрибуты
            $excludeAttr=[];
            $attr = $dom::getAttrElement( $scriptNode , $excludeAttr ) ;

            if ( isset( $attr['src'] ) ) {
                $key =  md5( $attr['src'] ) ;
                $this->_scriptCollection[ $key ] = $attr  ;
            }else{
                $key =  md5($scriptNode->nodeValue) ;
                $attr['type'] = ( isset( $attr['type']) ? $attr['type'] : null ) ;

                switch ( $attr['type'] ){
                    case 'application/json':
                        $type = $attr['type'] ;
                        $this->_scriptDeclarationCollection[$type][$key]['nodeValue'] = $scriptNode->nodeValue ;
                        $this->_scriptDeclarationCollection[$type][$key]['attr'] = $attr ;
                        break ;
                    default :
                        $this->_scriptDeclarationCollection['javascript'][ $key ] = $scriptNode->nodeValue ;
                }
            }#END IF
            $scriptNode->parentNode->removeChild($scriptNode);
        }#END FOREACH


        # Создать тег DATA application/json
        foreach ($this->_scriptDeclarationCollection['application/json'] as $item) {
            \GNZ11\Document\Dom::writeDownTag( $dom , 'script', $item['nodeValue'], $item['attr']);
        }#END FOREACH

        # Создать ссылки на JS Файлы
        foreach ( $this->_scriptCollection as $item) {
            \GNZ11\Document\Dom::writeDownTag( $dom , 'script', '',  $item );
        }#END FOREACH

        #Созадть Тег Скрипт с собраными скриптами - разделенные переносом строк
        $scriptDeclaration = implode("\r\n" , $this->_scriptDeclarationCollection['javascript'] ) ;
        \GNZ11\Document\Dom::writeDownTag( $dom , 'script', $scriptDeclaration  );



        /*echo'<pre>';print_r( $this->_scriptCollection );echo'</pre>'.__FILE__.' '.__LINE__;
        die(__FILE__ .' '. __LINE__ );*/




        $body =   $dom->saveHTML() ;
        $this->app->setBody($body);


    }

    private function _cleanSelector($Selector){
        $arrSymbols = [' ','#','.','>'];
        $Selector = str_replace($arrSymbols , '_' , $Selector ) ;
        return $Selector ;
    }
}