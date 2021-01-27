<?php

/***********************************************************************************************************************
 * ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗  ╔╗╔╗╔╗ ╔═══╗ ╔══╗   ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
 * ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝  ║║║║║║ ║╔══╝ ║╔╗║   ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
 * ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗  ║║║║║║ ║╚══╗ ║╚╝╚╗  ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
 * ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║  ║║║║║║ ║╔══╝ ║╔═╗║  ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
 * ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║  ║╚╝╚╝║ ║╚══╗ ║╚═╝║  ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
 * ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝  ╚═╝╚═╝ ╚═══╝ ╚═══╝  ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
 *----------------------------------------------------------------------------------------------------------------------
 * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 24.08.2020 23:25
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 **********************************************************************************************************************/

namespace GNZ11\Document;
use Joomla\Registry\Registry;
use stdClass;

defined('_JEXEC') or die; // No direct access to this file



/**
 * Class Arrays Обработка Массивов
 * @package GNZ11\Document
 * @since 3.9
 * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 24.08.2020 23:25
 *
 */
class Arrays
{
    /**
     * Конверт массив => объект (Joomla)
     * \GNZ11\Document\Arrays::arrToObj( $arr ) ;
     *
     * \GNZ11\Document\Arrays::filterElemByKey($arr , $filterOutKeys) ;
     * @param $arr array
     * @return void
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 26.08.2020 04:40
     */
    public static function arrToObj( &$arr ){
        if( is_array($arr) )
        {
            $Registry = new Registry($arr);
            $arr = $Registry->toObject();
        }#END IF
    }

    /**
     * Фильтрация элементов с определенными именами ключей
     *
     * $arr = array( 'element1' => 1, 'element2' => 2, 'element3' => 3, 'element4' => 4 );
     * $filterOutKeys = array( 'element1', 'element4' );
     * \GNZ11\Document\Arrays::filterElemByKey($arr , $filterOutKeys) ;
     *
     * Result will be something like this:
     * ['element2'] => 2
     * ['element3'] => 3
     *
     * @param $arr  - Массив в который нужно отфильтровать ключи
     * @param $filterOutKeys - масиив ключей для удаления из массива $arr
     * @return int[]
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 24.08.2020 23:27
     *
     */
    public static function filterElemByKey( $arr , $filterOutKeys ){
        return array_diff_key( $arr, array_flip( $filterOutKeys ) ) ;
    }

    /**
     * Найти подстроку из массива в заданной строке
     *
     * $haystack = 'This is a test' ;
     * $needles = array('test', 'drive') ;
     * \GNZ11\Document\Arrays::strpos_array($haystack , $needles) ;
     *
     *
     * @param $haystack string  Строка в которой производится поиск
     * @param $needles  array   Массив с набором подстрок для поиска в $haystack
     * @return false|int
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 25.08.2020 05:04
     *
     */
    public static function  strpos_array($haystack, $needles) {
//        $cleanArr = [ '  ', "'", "=", "+",  "\r\n", "\r", "\n" ] ;
        $cleanArr = [   ] ;

        if ( is_array($needles) ) {
            foreach ($needles as $str) {
                $haystack = str_replace( $cleanArr , '', $haystack);
                $str = str_replace( $cleanArr, '', $str);
                if ( is_array($str) ) {
                    $pos = self::strpos_array($haystack, $str);
                } else {

//                    $pos = mb_strpos($haystack, $str);
                    $pos = strpos($haystack, $str);
                }
                if ($pos !== FALSE) {
                    return $pos;
                }
            }
        } else {
            $haystack = str_replace( $cleanArr , '', $haystack);
            $str = str_replace( $cleanArr, '', $needles);
            return strpos($haystack, $needles);
        }
    }

    /**
     * Парсинг данных созданных SubForms
     * TODO ДОДЕЛАТЬ !!!
     * @param $subForm
     * @return array
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 25.08.2020 09:08
     *
     */
    public static function parseSubFormData ($subForm){
        $Registry = new Registry ( $subForm ) ;
        $Arr = $Registry->toArray() ;
        return array_map(function($key, $value) {return $value['text'];}, array_keys($Arr), $Arr);
    }

    /**
     * Меняет регистр всех ключей в массиве unicode
     * \GNZ11\Document\Arrays::arrayChangeKeyCaseUnicode( $arr ,  CASE_LOWER ) ;
     * @param array $arr    Обрабатываемый массив
     * @param int $c        Либо CASE_UPPER, либо CASE_LOWER (используется по умолчанию)
     * @return mixed
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 02.09.2020 08:04
     */
    public static function arrayChangeKeyCaseUnicode( array $arr, $c = CASE_LOWER ){
        $c = ($c == CASE_LOWER) ? MB_CASE_LOWER : MB_CASE_UPPER;
        $ret = null ;
        foreach ($arr as $k => $v) {
            $ret[mb_convert_case($k, $c, "UTF-8")] = $v;
        }
        return $ret;
    }

    /**
     * Сортировка многомерного массива
     */

}