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



    #################################################################################

    /**
     * Проверка директории TMP
     * @return bool
     * @throws \Exception
     * @since 3.9
     */
    public static function checkTmpDir(){
        $tmp_path = \Joomla\CMS\Factory::getApplication()->get('tmp_path');
        $tmp_pathLogic = JPATH_ROOT . '/tmp'  ;
        if( \Joomla\CMS\Filesystem\Folder::exists( $tmp_pathLogic ) && $tmp_path != $tmp_pathLogic )
        {
            $mes = 'В настройках Joomla путь к директории TMP ведет не к той директории которая в корне сайта.' ;
            \Joomla\CMS\Factory::getApplication()->enqueueMessage($mes , 'warning');
            return true ;
        }#END IF
        return true ;
    }

    /**
     * Download and install
     * @param $id
     * @param $url
     * @return bool|string
     * @since 3.9
     */
    public static function installDownload($id, $url)
    {
        if( !self::checkTmpDir() )
        {
            return false ;
        }#END IF

        $tmp_path = \Joomla\CMS\Factory::getApplication()->get('tmp_path') ;

        if (!is_string($url))
        {
            return \Joomla\CMS\Language\Text::_('NNEM_ERROR_NO_VALID_URL');
        }

        


//        $url = 'http://' . str_replace('http://', '', $url);
        $target = $tmp_path . '/' . uniqid($id) . '.zip';




        jimport('joomla.filesystem.file');
        \Joomla\CMS\Factory::getLanguage()->load('com_installer', JPATH_ADMINISTRATOR);

        // Download the package at the URL given.
        $p_file = \Joomla\CMS\Installer\InstallerHelper::downloadPackage($url);
        

        

        // Was the package downloaded?
        if (!$p_file)
        {
            \Joomla\CMS\Factory::getApplication()->enqueueMessage( 'Не удалось скачать пакет установки' , 'error');
            return false;
        }
        // Распакуй скачанный файл пакета.
        $package = \Joomla\CMS\Installer\InstallerHelper::unpack($tmp_path . '/' . $p_file, true);
        // Get an installer instance.
        $installer = new \Joomla\CMS\Installer\Installer();
        /*
         * Проверьте наличие основного пакета Joomla.
         * Для этого нам нужно указать исходный путь для поиска манифеста (тот же первый шаг, что и JInstaller :: install ())
         *
         * Это необходимо сделать перед распакованной проверкой, потому что JInstallerHelper :: detectType () возвращает логическое значение false, поскольку манифест
         * не может быть найден в ожидаемом месте.
		 */
        if (is_array($package) && isset($package['dir']) && is_dir($package['dir']))
        {
            $installer->setPath('source', $package['dir']);
            if (!$installer->findManifest())
            {
                # Если манифест не найден в источнике, это может быть пакет Joomla; проверьте каталог пакета для манифеста Joomla
                # If a manifest isn't found at the source, this may be a Joomla package; check the package directory for the Joomla manifest
                \Joomla\CMS\Factory::getApplication()->enqueueMessage('Ошибка! Не удалось найти файл ианифест' , 'warning' );
                return false;

                /*if (file_exists($package['dir'] . '/administrator/manifests/files/joomla.xml'))
                {
                    // We have a Joomla package
                    if (in_array($installType, array('upload', 'url')))
                    {
                        JInstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);
                    }

                    $app->enqueueMessage(
                        JText::sprintf('COM_INSTALLER_UNABLE_TO_INSTALL_JOOMLA_PACKAGE', JRoute::_('index.php?option=com_joomlaupdate')),
                        'warning'
                    );

                    return false;
                }*/
            }
        }
        if (!$package || !$package['type'])
        {
            \Joomla\CMS\Installer\InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);
            \Joomla\CMS\Factory::getApplication()->enqueueMessage( 'Не удалось найти пакет установки' , 'error');
            return false;
        }

        // Install the package.
        if (!$installer->install($package['dir']))
        {
            // There was an error installing the package.
            $msg = \Joomla\CMS\Language\Text::sprintf('COM_INSTALLER_INSTALL_ERROR', \Joomla\CMS\Language\Text::_('COM_INSTALLER_TYPE_TYPE_' . strtoupper($package['type'])));
            $result = false;
            $msgType = 'error';
        }
        else
        {
            // Package installed successfully.
            $msg = \Joomla\CMS\Language\Text::sprintf('COM_INSTALLER_INSTALL_SUCCESS', \Joomla\CMS\Language\Text::_('COM_INSTALLER_TYPE_TYPE_' . strtoupper($package['type'])));
            $result = true;
            $msgType = 'message';
        }
        \Joomla\CMS\Factory::getApplication()->enqueueMessage( $msg ,  $msgType );
        // Cleanup the install files.
        if (!is_file($package['packagefile']))
        {
            $package['packagefile'] = $tmp_path . '/' . $package['packagefile'];
        }
        \Joomla\CMS\Installer\InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);
        return $result ;


    }

}