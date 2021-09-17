<?php
    /**
     * Class JFormFieldLabels
     * Поле формы для вывода списка меток для товаров
     * @since  3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date   21.03.2021 19:05
     * @copyright Gartes
     * @license
     */

class JFormFieldLabels extends JFormField {
  public $type ='Labels';
  protected function getInput(){
        require_once (JPATH_SITE.'/modules/mod_jshopping_label_products/helper.php');
        $tmp = new stdClass();
        $tmp->id = "";
        $tmp->name = JText::_('JALL');
        $element_1  = array($tmp);
        $productLabel = JTable::getInstance('productLabel', 'jshop');
        $listLabels = $productLabel->getListLabels();
        $elementes_select =array_merge($element_1 , $listLabels);
        $ctrl  =  $this->name ;
        $value        = empty($this->value) ? '' : $this->value;
        return JHTML::_('select.genericlist', $elementes_select, $ctrl,'class="inputbox"','id', 'name', $value );
  }
}

