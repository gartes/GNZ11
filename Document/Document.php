<?php
/**
 * @package     GNZ11\Document
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */

namespace GNZ11\Document;


use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;

class Document
{
    const IncludeStyleParams = [
        'debug' => false ,  // Отображать в стлях пути к файлу из которого они вставлены
        'asFile' => false , // Загрузить как сcs файл  <link rel="stylesheet" />
    ] ;
    private $_commentStart = '' ;

    /**
     * Загрузка стилей в тег <style /> из файла
     * Для элементов в критической области видимости !
     * @param string $path - отновсительный путь к файлу от корня сайта !!!
     *                      e.c. /modules/mod_rokajaxsearch/assets/css/rokajaxsearch-critical.css
     * @param array $params - параметры
     * @since 3.9
     */
    public static function addIncludeStyleDeclaration( $path , $params = [] ){
        $root = Uri::root() ;
        $doc = Factory::getDocument();

        $_params = array_merge(self::IncludeStyleParams , $params );

        if( $_params['asFile']  )
        {
            // удаляем Uri::root() мз пути
            $path = str_replace( $root , '' , $path );

            // Убираем путь от корня сервера
            $path = str_replace(JPATH_ROOT , '' , $path );

            // Убираем ведущий слеш + домен (ссылка обсалютная)
            $path =  preg_replace( '/^\//' , '' ,  $path ) ;

            $path = $root . $path ;




          /*  echo'<pre>';print_r( $root );echo'</pre>'.__FILE__.' '.__LINE__;
            echo'<pre>';print_r( $path );echo'</pre>'.__FILE__.' '.__LINE__;
            die(__FILE__ .' '. __LINE__ );*/

            # Если  строка начинается с домена
            if( stripos( $path , $root ) == 0  )
            {
                $doc->addStyleSheet($path);
            }#END IF
            return ;

        }else{

            # Если  строка начинается с домена
            if( stripos( $path , $root ) === 0  )
            {
                $path = JPATH_ROOT . '/'.str_replace(  $root , '' , $path ) ;
                if( count( $params ) > 1 ){

//                    echo'<pre>';print_r( $path );echo'</pre>'.__FILE__.' '.__LINE__;
//                    die(__FILE__ .' '. __LINE__ );
                }#END IF
            }#END IF
        }#END IF



        ob_start();
            echo  ( !$_params['debug']? null : PHP_EOL . '/* ******* '.$path.' */' . PHP_EOL ) ;
            include $path  ;
            echo  ( !$_params['debug']? null : PHP_EOL . '/* ******* END '.$path.' */' . PHP_EOL ) ;

            $css_output = ob_get_contents();
        ob_end_clean();
        $doc->addStyleDeclaration( $css_output );
    }

    /**
     * Загрузка скрипта в тег <script />
     * @param $path - путь к файлу от корня сайта
     * @param array $params - параметры
     *
     *
     * @since version
     */
    public static function addIncludeScriptDeclaration( $path , $params = [] ){
        $_params = array_merge(self::IncludeStyleParams , $params );
        $doc = Factory::getDocument();
        ob_start();
        echo  ( !$_params['debug']? null : PHP_EOL . '/* ******* '.$path.' */' . PHP_EOL ) ;
        include $path  ;
        echo  ( !$_params['debug']? null : PHP_EOL . '/* ******* END '.$path.' */' . PHP_EOL ) ;

        $script_output = ob_get_contents();
        ob_end_clean();
        $doc->addScriptDeclaration( $script_output ) ;
    }

}
