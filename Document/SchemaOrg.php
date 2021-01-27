<?php

    /*******************************************************************************************************************
     *     ╔═══╗ ╔══╗ ╔═══╗ ╔════╗ ╔═══╗ ╔══╗        ╔══╗  ╔═══╗ ╔╗╔╗ ╔═══╗ ╔╗   ╔══╗ ╔═══╗ ╔╗  ╔╗ ╔═══╗ ╔╗ ╔╗ ╔════╗
     *     ║╔══╝ ║╔╗║ ║╔═╗║ ╚═╗╔═╝ ║╔══╝ ║╔═╝        ║╔╗╚╗ ║╔══╝ ║║║║ ║╔══╝ ║║   ║╔╗║ ║╔═╗║ ║║  ║║ ║╔══╝ ║╚═╝║ ╚═╗╔═╝
     *     ║║╔═╗ ║╚╝║ ║╚═╝║   ║║   ║╚══╗ ║╚═╗        ║║╚╗║ ║╚══╗ ║║║║ ║╚══╗ ║║   ║║║║ ║╚═╝║ ║╚╗╔╝║ ║╚══╗ ║╔╗ ║   ║║
     *     ║║╚╗║ ║╔╗║ ║╔╗╔╝   ║║   ║╔══╝ ╚═╗║        ║║─║║ ║╔══╝ ║╚╝║ ║╔══╝ ║║   ║║║║ ║╔══╝ ║╔╗╔╗║ ║╔══╝ ║║╚╗║   ║║
     *     ║╚═╝║ ║║║║ ║║║║    ║║   ║╚══╗ ╔═╝║        ║╚═╝║ ║╚══╗ ╚╗╔╝ ║╚══╗ ║╚═╗ ║╚╝║ ║║    ║║╚╝║║ ║╚══╗ ║║ ║║   ║║
     *     ╚═══╝ ╚╝╚╝ ╚╝╚╝    ╚╝   ╚═══╝ ╚══╝        ╚═══╝ ╚═══╝  ╚╝  ╚═══╝ ╚══╝ ╚══╝ ╚╝    ╚╝  ╚╝ ╚═══╝ ╚╝ ╚╝   ╚╝
     *------------------------------------------------------------------------------------------------------------------
     *
     * @author     Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date       14.01.2021 09:31
     * @copyright  Copyright (C) 2005 - 2021 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     ******************************************************************************************************************/

    namespace GNZ11\Document;
    defined('_JEXEC') or die; // No direct access to this file

    use Exception;
    use JDatabaseDriver;
    use Joomla\CMS\Application\CMSApplication;
    use Joomla\CMS\Factory;

    /**
     * Class SchemaOrg
     *
     * @package GNZ11\Document
     * @since   3.9
     * @auhtor  Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date    14.01.2021 09:31
     *
     */
    class SchemaOrg
    {

        /**
         * @var CMSApplication|null
         * @since 3.9
         */
        private $app;
        /**
         * @var JDatabaseDriver|null
         * @since 3.9
         */
        private $db;
        /**
         * Array to hold the object instances
         *
         * @var SchemaOrg
         * @since  1.6
         */
        public static $instance;

        /**
         * SchemaOrg constructor.
         *
         * @param $params array|object
         *
         * @throws Exception
         * @since 3.9
         */
        public function __construct($params)
        {
//            $this->app = Factory::getApplication();
//            $this->db = Factory::getDbo();
            return $this;
        }

        /**
         * @param array $options
         *
         * @return SchemaOrg
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
        }


    }