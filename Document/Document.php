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
    public static function addIncludeStyleDeclaration( $path ){
        $doc = \Joomla\CMS\Factory::getDocument();
        ob_start();
            include $path ;
        $css_output = ob_get_contents();
        ob_end_clean();
        $doc->addStyleDeclaration( $css_output );
    }
}