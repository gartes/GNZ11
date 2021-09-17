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
     * @date       16.09.2021 22:19
     * @copyright  Copyright (C) 2005 - 2021 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     ******************************************************************************************************************/
    defined('_JEXEC') or die; // No direct access to this file



    /**
     * =================================================================================================================
     * ============== Список статусов заказов JoomShopping =============================================================
     * =================================================================================================================
     */


    use Joomla\CMS\Application\CMSApplication;
    use Joomla\CMS\Factory;
    use Joomla\CMS\Form\FormHelper;
    use Joomla\CMS\HTML\HTMLHelper;
    use Joomla\CMS\Language\Text;


    FormHelper::loadFieldClass('list');


    /**
     * Class JFormFieldListorderstatus
     *
     * @since  3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date   16.09.2021 22:19
     *
     */
    class JFormFieldListjsorderstatus extends JFormFieldList
    {
        /**
         * @var string Список категорий JoomShoping
         * @since 3.9
         */
        public $type = 'listjsorderstatus';

        private $textKey = 'name_ru-RU' ;

        /**
         * @var JDatabaseDriver|null
         * @since 3.9
         */
        protected $db;
        /**
         * @var array|mixed
         * @since 3.9
         */
        private $valueKey = 'status_id' ;

        /**
         * JFormFieldListorderstatus constructor.
         *
         * @param $params array|object
         *
         * @throws Exception
         * @since 3.9
         */



        /**
         * Метод получения списка опций для ввода списка.
         * Method to get a list of options for a list input.
         *
         * @return    array     Массив параметров JHtml.
         *                      An array of JHtml options.
         * @since 3.9
         */
        protected function getOptions()
        {
            $options = array();
            $items = $this->getAllValues();
            if( $items )
            {
                // $options[] = JHtml::_('select.option', '', '');
                foreach ($items as $item)
                {
                    $options[] = HTMLHelper::_('select.option' , $item->{$this->valueKey} , Text::_($item->{$this->textKey}));
                }
            }
            return $options;
        }

        protected function getAllValues(){
            $this->db = \Joomla\CMS\Factory::getDbo();
            $Query = $this->db->getQuery(true) ;
            $Query->select('*')
                ->from( $this->db->quoteName('#__jshopping_order_status'));
            $where = [];
//            $Query->where($where);
            # $Query->order( ' ASC' );
            # $Query->order( ' DESC' );
            $this->db->setQuery( $Query ) ;
//            echo'<pre>';print_r( $Query->dump() );echo'</pre>'.__FILE__.' '.__LINE__ . PHP_EOL;

            $res = $this->db->loadObjectList( );
            return $res ;



        }

    }
