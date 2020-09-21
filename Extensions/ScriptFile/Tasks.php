<?php
/**
 * @package     ${NAMESPACE}
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */

namespace GNZ11\Extensions\ScriptFile;

use Exception;
use GNZ11\Core\Filesystem\File;
use Joomla\CMS\Factory;

class Tasks
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
    public static $instance;

    /**
     * Tasks constructor.
     * @throws Exception
     * @since 3.9
     */
    private function __construct($options = array())
    {
        $this->app = Factory::getApplication();
        $this->db = Factory::getDbo();
        return $this;
    }#END FN

    /**
     * @param array $options
     *
     * @return Tasks
     * @throws Exception
     * @since 3.9
     */
    public static function instance($options = array())
    {
        if( self::$instance === null )
        {
            self::$instance = new self($options);
        }
        return self::$instance;
    }#END FN

    /**
     * Выполненние задач для события preflight
     * Метод, запускаемый перед методом install/update/uninstall
     *
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 21.09.2020 05:00
     *
     */
    public function preflight( $preflight ){

        /**
         * Если есть файлы для удаления
         * @see https://github.com/gartes/GNZ11/tree/master/Extensions
         */
        if (isset( $preflight->delite ))
        {
            $Registry = new \Joomla\Registry\Registry();
            $this->DelFiles($preflight->delite->files);

        }#END IF


    }


    /**
     * Удалить файлы перечисленные в массиве
     * @param $filesArr
     *
     *
     * @since version
     * TODO - перенести выполнение в  namespace GNZ11\Core\Platform;
     */
    public function DelFiles($filesArr){

        foreach ((array)$filesArr as $file ){
            $DS = DIRECTORY_SEPARATOR ;
            $pos1 = stripos($file, $DS);
            if ($pos1 === false)
            {
                $file = $DS . $file ;
            }#END IF
            $filePath = JPATH_ROOT . $file ;

            if( \Joomla\CMS\Filesystem\File::exists( $filePath ) )
            {
                if( \Joomla\CMS\Filesystem\File::delete( $filePath ) )
                {
                    $this->app->enqueueMessage( 'Файл удален ' . $filePath  . PHP_EOL   );
                }else{
                    $this->app->enqueueMessage( 'Не удалось удалить файл ' . $filePath  . PHP_EOL   );
                }#END IF
            }#END IF
        }
    }

    /**
     * подключение файлов Include PHP
     *
     * @param $Files
     * @throws Exception
     * @since version
     */
    public function IncludeFiles($Files){
        foreach ( $Files as $file)
        {
            $tmp_path = Factory::getApplication()->get('tmp_path');

            if( stristr( $file, 'gist.githubusercontent.com')||stristr( $file, 'gist.github.com')   )
            {
                $fileData = File::getFileContents( $file );
                $filePath = $tmp_path . '/' . md5($fileData).'.php' ;
                File::write( $filePath , $fileData );
                $Message = 'Include File from Gist Github ' . PHP_EOL ;
                $Message .= 'From URL : <a target="_blank" href ="'.$file.'">Open in a new window.</a>' ;
                Factory::getApplication()->enqueueMessage( $Message );

                include $filePath ;
                continue ;
            }#END IF
            $filePath = JPATH_ROOT . $file ;
            include $filePath ;
        }#END FOREACH


    }

}