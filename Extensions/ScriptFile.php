<?php
/**
 * @package     GNZ11\Extensions
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */

namespace GNZ11\Extensions;
use GNZ11\Core\Filesystem\File;
/**
 * Класс для работы с файлом ScriptFile - расшерений
 * @package     GNZ11\Extensions
 *
 * @since version
 */
class ScriptFile
{
    /**
     * Массив и очередность выполнения задач
     * @since 3.9
     */
    const TaskArr = [
        'DelFiles' ,    # Удалять файлы
        'IncludeFiles', # Загрузить фалы PHP
    ];
    /**
     * Создать Json файл для удаления ненужных файлов при обновлении расшерения
     * @param $fileJson string - путь где создать файл files.json
     * @param $arrFiles array  - Массив с данными
     *  # Файлы которые удалить при обновлени
     *  # Указываем путь от корня сайта
     *  'DelFiles' => [
     *      '\/language\/en-GB\/en-GB.mod_rokajaxsearch.ini' ,
     *  ],
     *  # Загрузить фалы PHP
     *  IncludeFiles => [
     *      '\/tmp\/correcting.php' ,
     *      # OR
     *      # RAW - file gist github
     *      'https:\/\/gist.githubusercontent.com\/gartes\/046f0f4a6dae64465060cecaaa0ee83f\/raw\/22c7978d8330334c8a5d451dc4fe0dcca2aba6fc\/correcting.php'
     * ],
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

        File::write($file, $json);
    }

    private function getVersionGnz11(){

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



        echo'<pre>';print_r( class_exists( '\GNZ11\Extensions\ScriptFile' ) );echo'</pre>'.__FILE__.' '.__LINE__;
        die(__FILE__ .' '. __LINE__ );

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
        $dataSetting = $Registry->loadFile( $filePath ) ;

        $Tasks = \GNZ11\Extensions\ScriptFile\Tasks::instance();
        
        $taskArray = $dataSetting->toArray();
        if( !$taskArray || !is_array( $taskArray ) || empty( $taskArray ) || !count( $taskArray )  ) return ; #END IF





        foreach ($taskArray as $method => $item)
        {

            if( method_exists (  'GNZ11\Extensions\ScriptFile\Tasks' , $method ) )
            {
                $Tasks->{$method}( $item ) ;
            }#END IF
        }#END FOREACH
        


    }

    /**
     * Получить атрибут из $object - XML
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