<?php
namespace GNZ11\Core\Filesystem;

// use Joomla\CMS\Filesystem\File ;
use GNZ11\Document\Text;
use Joomla\CMS\Factory;


class File extends \Joomla\CMS\Filesystem\File
{
    /**
     * 	Curl Error Notice
     *
     *	@var bool
     * @since 3.9
     */
    protected static $curlErrorLoaded = false;


    /**
     * получить содержимое файла
     * get the content of a file
     *
     * @param string $path Путь к файлу / The path to the file
     * @param string/bool   $none   Возвращаемое значение, если контент не был найден / The return value if no content was found
     *
     * @return  string   On success
     *
     * @throws \Exception
     * @since 3.9
     */
    public static function getFileContents($path, $none = '')
    {
        if (Text::checkString($path))
        {
            // use basic file get content for now
            if (($content = @file_get_contents($path)) !== FALSE)
            {
                return $content;
            }
            // use curl if available
            elseif (function_exists('curl_version'))
            {
                // start curl
                $ch = curl_init();
                // set the options
                $options = array();
                $options[CURLOPT_URL] = $path;
                $options[CURLOPT_USERAGENT] = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12';
                $options[CURLOPT_RETURNTRANSFER] = TRUE;
                $options[CURLOPT_SSL_VERIFYPEER] = FALSE;
                // load the options
                curl_setopt_array($ch, $options);
                // get the content
                $content = curl_exec($ch);
                // close the connection
                curl_close($ch);
                // return if found
                if ( Text::checkString($content))
                {
                    return $content;
                }
            }
            elseif (property_exists('\GNZ11\Core\Filesystem\File', 'curlErrorLoaded') && !self::$curlErrorLoaded)
            {
                // set the notice
                Factory::getApplication()->enqueueMessage(Text::_('COM_COMPONENTBUILDER_HTWOCURL_NOT_FOUNDHTWOPPLEASE_SETUP_CURL_ON_YOUR_SYSTEM_OR_BCOMPONENTBUILDERB_WILL_NOT_FUNCTION_CORRECTLYP'), 'Error');
                // load this notice only once
                self::$curlErrorLoaded = true;
            }
        }
        return $none;
    }

    /**
     * Проверить является файл или ссылка внутренней
     * @param $url
     * @return bool
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 08.10.2020 00:55
     *
     */
    public static function isInternal($url)
    {
        return ! self::isExternal($url);
    }

    /**
     * Проверить является файл или ссылка внешней
     * Todo Добавить для CMS Joomla - операции из метода checkLocalHost  файл : Helpers/Assets/Links_assets.php
     * @param string $url
     * @return bool
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 08.10.2020 00:45
     */
    public static function isExternal(string $url)
    {
        if (strpos($url, '://') === false)
        {
            return false;
        }

        // hostname: отдать предпочтение SERVER_NAME, потому что это включает субдомены
        $hostname = ($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : $_SERVER['HTTP_HOST'];

        return ! (strpos(\GNZ11\Core\RegEx::replace('^.*?://', '', $url), $hostname) === 0);
    }

}