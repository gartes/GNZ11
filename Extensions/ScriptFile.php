<?php
/**
 * @package     GNZ11\Extensions
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */

namespace GNZ11\Extensions;

/**
 * Класс для работы с файлом ScriptFile - расшерений
 * @package     GNZ11\Extensions
 *
 * @since version
 */
class ScriptFile
{
    /**
     * Создать Json файл для удаления ненужных файлов при обновлении расшерения
     * @param $fileJson string - путь где сосдать файл files.json
     * @param $arrFiles array  - Массив с данными
     *  # Файлы которые удалить при обновлени
     *  # Указываем путь от корня сайта
     *  'DelFiles' => [
     *      '/language/en-GB/en-GB.mod_rokajaxsearch.ini' ,
     *  ],
     *
     * @since version
     */
    public static function addFilesToUpdateExt($fileJson , $arrFiles ){

        # располажение Файла JSON
        $file = JPATH_SITE . $fileJson . '/files.json' ;
        # Массив с данными

        $Registry = new \Joomla\Registry\Registry();
        $Registry->loadArray($arrFiles ) ;
        $json = $Registry->toString();

        \Joomla\CMS\Filesystem\File::write($file, $json);
    }

    /**
     * Задачи перед обновлением
     * @param $typeExt
     * @param $parent
     *
     *
     * @since version
     */
    public static function updateProcedure($typeExt, $parent){

        $app = \Joomla\CMS\Factory::getApplication();
        $Registry = new \Joomla\Registry\Registry();

        $filePath = false ;
        $config = $parent->get('manifest')->config->fields->fieldset[0];
        foreach ($config as $conf){
            $name = self::xml_attribute( $conf , 'name' );
            if( $name == '_fileJsonPath' )
            {
               $filePath =   self::xml_attribute( $conf , 'default' );
               break ;
            }#END IF
        }
        if( !$filePath  ) return ; #END IF



        $filePath = JPATH_ROOT .  $filePath . '/files.json' ;
        $dataDelFiles = $Registry->loadFile( $filePath )->get('DelFiles'  ) ;

        if( !$dataDelFiles || !is_array( $dataDelFiles ) || empty( $dataDelFiles ) || !count( $dataDelFiles )  ) return ; #END IF



        foreach ($dataDelFiles as $file ){
            $filePath = JPATH_ROOT . $file ;
            if( \Joomla\CMS\Filesystem\File::exists( $filePath ) )
            {
                if( \Joomla\CMS\Filesystem\File::delete( $filePath ) )
                {
                    $app->enqueueMessage( 'Файл удален ' . $filePath  . PHP_EOL   );
                }#END IF 
            }#END IF
        }
    }

    /**
     * Получить атребут из $object - XML
     * @param $object
     * @param $attribute
     *
     * @return string
     *
     * @since version
     */
    private static function xml_attribute($object, $attribute)
    {
        if(isset($object[$attribute]))
            return (string) $object[$attribute];
    }

}