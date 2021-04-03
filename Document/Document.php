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
    const IncludeScriptParams = [
        'debug' => false ,  // Отображать в стилях пути к файлу из которого они вставлены
        'asFile' => true , // Загрузить как сcs файл  <link rel="stylesheet" />
    ] ;

    public static $instance;
    public static $preloaderData;
    public static $ManifestVersion = [] ;

    protected static $svgSymbols = [] ;

    private $_commentStart = '' ;


    /**
     * Document constructor.
     * @throws \Exception
     * @since 3.9
     */
    private function __construct($options = array())
    {
        return $this;
    }#END FN

    /**
     * @param array $options
     *
     * @return Document
     * @throws \Exception
     * @since 3.9
     */
    public static function instance($options = array())
    {
        if (self::$instance === null)
        {
            self::$instance = new self($options);
        }
        return self::$instance;
    }#END FN

    public static function addSvgSymbol(){  }

    /**
     * Загрузка стилей в тег <style /> из файла
     * Для элементов в критической области видимости !
     * @param string $path - относительный путь к файлу от корня сайта !!!
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
        $_params = array_merge(self::IncludeScriptParams , $params );


        $root = Uri::root() ;
        $doc = Factory::getDocument();

        if( $_params['asFile']  )
        {
            // удаляем Uri::root() мз пути
            $path = str_replace( $root , '' , $path );

            // Убираем путь от корня сервера
            $path = str_replace(JPATH_ROOT , '' , $path );

            // Убираем ведущий слеш + домен (ссылка обсалютная)
            $path =  preg_replace( '/^\//' , '' ,  $path ) ;

            $path = $root . $path ;

            # Если  строка начинается с домена
            if( stripos( $path , $root ) == 0  )
            {
//                echo'<pre>';print_r( $path );echo'</pre>'.__FILE__.' '.__LINE__;
//                die(__FILE__ .' '. __LINE__ );


                $doc->addScript($path);
            }#END IF
            return ;
        }


        ob_start();
        echo  ( !$_params['debug']? null : PHP_EOL . '/* ******* '.$path.' */' . PHP_EOL ) ;
        include $path  ;
        echo  ( !$_params['debug']? null : PHP_EOL . '/* ******* END '.$path.' */' . PHP_EOL ) ;

        $script_output = ob_get_contents();
        ob_end_clean();
        $doc->addScriptDeclaration( $script_output ) ;
    }

    /**
     * Получить версию из файла манифест расширения
     * @param $filePath
     *
     * @return string
     * @since  3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date   27.03.2021 09:46
     *
     */
    public static function getManifestVersion( $filePath ): string
    {
        if( array_key_exists( $filePath , self::$ManifestVersion ) )
        {
            return self::$ManifestVersion[$filePath] ;
        }#END IF
        $xml_file = JPATH_ROOT .  $filePath ;
        $dom = new \DOMDocument("1.0", "utf-8");
        $dom->load($xml_file);
        $v =  $dom->getElementsByTagName('version')->item(0)->textContent;
        self::$ManifestVersion[$filePath] = $v ;
        return $v ;
    }

    /**
     * Добавить Preload Link tag
     * @param $url
     * @param $options
     *
     * @since  3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date   27.03.2021 09:43
     *
     */
    public static function addPreloadLink( $url , $options ){
        $doc = \Joomla\CMS\Factory::getDocument();

        $GNZ11_OPT =  $doc->getScriptOptions('GNZ11' ) ;

        $cloneUrl = $url ;

        if( !isset( $options['version'] ) ) $options['version'] = '' ; #END IF

        if( $options['version'] == 'GNZ11' )
        {
            $version = self::getManifestVersion('/libraries/GNZ11/gnz11.xml');
            $options['version'] = md5( $version ) ;
            $url .= '?' . $options['version'] ;
        }#END IF

        if( $doc->getType() == 'html' )
        {
            $html = '<link rel="preload" href="' . $url . '" as="' . $options['as'] . '">';
            $doc->addCustomTag($html);
            $GNZ11_OPT['Document']['_preload'][$cloneUrl] = $options ;
            $doc->addScriptOptions('GNZ11' , $GNZ11_OPT) ;
        }#END IF
    }















}
