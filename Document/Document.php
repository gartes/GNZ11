<?php
/**
 * @package     GNZ11\Document
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */

namespace GNZ11\Document;


class Document
{
    const IncludeStyleParams = [
        'debug' => false ,
    ] ;
    private $_commentStart = '' ;


    public static function addIncludeStyleDeclaration( $path , $params = [] ){
        $_params = array_merge(self::IncludeStyleParams , $params );
        $doc = \Joomla\CMS\Factory::getDocument();
        ob_start();
            echo  ( !$_params['debug']?: PHP_EOL . '/* ******* '.$path.' */' . PHP_EOL ) ;
            include $path  ;
            echo  ( !$_params['debug']?: PHP_EOL . '/* ******* END '.$path.' */' . PHP_EOL ) ;

        $css_output = ob_get_contents();
        ob_end_clean();
        $doc->addStyleDeclaration( $css_output );
    }
}
