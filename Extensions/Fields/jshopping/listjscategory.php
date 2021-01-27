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
     * @date       30.11.2020 13:19
     * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
     * @license    GNU General Public License version 2 or later;
     ******************************************************************************************************************/

    use Joomla\CMS\Form\FormHelper;
    use Joomla\CMS\HTML\HTMLHelper;
    use Joomla\CMS\Language\Text;

    defined('_JEXEC') or die('Restricted access');// No direct access to this file
    // для JSFactory::getLang() и buildTreeCategory()
    require_once( JPATH_ROOT.DS.'components'.DS.'com_jshopping'.DS.'lib'.DS.'factory.php' );
    require_once( JPATH_ROOT.DS.'components'.DS.'com_jshopping'.DS.'lib'.DS.'functions.php' );

    FormHelper::loadFieldClass('list');


    /**
     * Дерево категорий JoomShoping
     * Class JFormFieldListjscategory
     *
     * @since  3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date   30.11.2020 10:53
     *
     */
    class JFormFieldListjscategory extends JFormFieldList
    {

        /**
         * @var string Список категорий JoomShoping
         * @since 3.9
         */
        public $type = 'listjscategory';
        /**
         * @var string ключь объекта со значением для option
         * @since 3.9
         */
        private $valueKey = 'value' ;
        /**
         * @var string ключь объекта стекстом для option
         * @since 3.9
         */
        private $textKey = 'text' ;

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

        /**
         * Получения значений для Options
         *
         * @return array
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   30.11.2020 12:52
         *
         */
        public function getAllValues()
        {
            $this->valueKey = 'category_id';
            $this->textKey = 'name';
            $tree = buildTreeCategory();




            return $tree;
        }
    }

















