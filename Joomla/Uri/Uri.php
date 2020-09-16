<?php

/***********************************************************************************************************************
 * ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗  ╔╗╔╗╔╗ ╔═══╗ ╔══╗   ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
 * ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝  ║║║║║║ ║╔══╝ ║╔╗║   ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
 * ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗  ║║║║║║ ║╚══╗ ║╚╝╚╗  ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
 * ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║  ║║║║║║ ║╔══╝ ║╔═╗║  ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
 * ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║  ║╚╝╚╝║ ║╚══╗ ║╚═╝║  ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
 * ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝  ╚═╝╚═╝ ╚═══╝ ╚═══╝  ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
 *----------------------------------------------------------------------------------------------------------------------
 * @author Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 30.08.2020 05:01
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 **********************************************************************************************************************/

namespace GNZ11\Joomla\Uri;
defined('_JEXEC') or die; // No direct access to this file

use Exception;


/**
 * Class Uri
 * @package GNZ11\Joomla\Uri
 * @since 3.9
 * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
 * @date 30.08.2020 05:01
 *
 */
class Uri
{
    /**
     * Создать ссылку
     * @param array $params массив с параметрами запроса e.c.( 'option'=>'com_search' ,  'view'=>'search'  )
     * @param bool  $isSef  true если нужна SEF ссылка
     * @return string
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 29.08.2020 17:19
     *
     */
    public static function createLink(array $params, bool $isSef = false ): string
    {


        $uri = \Joomla\CMS\Uri\Uri::getInstance();
        # Созадем строку с параметрами
        # e.g. : ordering=popular&limit=2&searchword=Профи МОНО&option=com_search&view=search
        $Query = $uri::buildQuery($params);



    /* throw new Exception('ddddd') ;
die(__FILE__ .' '. __LINE__ );*/


        # Устанавливаем параметры в Uri
        $uri->setQuery($Query);
        # не SEF Ссылка
        # e.g. : ?ordering=popular&limit=2&searchword=Профи МОНО&option=com_search&view=search
        $link =  'index.php' . $uri->toString(array('query', 'fragment'));
        # Если нужна не SEF Ссылка


        if( !$isSef )
        {
            return $uri::root() . $link;
        }#END IF
        $uri::reset();
        # SEF Ссылка
        # Если последним параметром передаестся TRUE - то ссылка обсалютная
        return \Joomla\CMS\Router\Route::_(  $link, false, 0, true);
    }

}


























