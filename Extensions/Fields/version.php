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
 * @date 03.10.2020 18:52
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 **********************************************************************************************************************/
defined('_JEXEC') or die; // No direct access to this file


jimport('joomla.form.formfield');

// The class name must always be the same as the filename (in camel case)
class JFormFieldVersion extends JFormField {

    //The field class must know its own type through the variable $type.
    protected $type = 'version';

    public function getLabel() {

        $data = $this->getLayoutData();

        // Forcing the Alias field to display the tip below
        $position = $this->element['name'] == 'alias' ? ' data-placement="bottom" ' : '';

        // Here mainly for B/C with old layouts. This can be done in the layouts directly
        $extraData = array(
            'text'        => 'ver.' ,
            'for'         => $this->id,
            'classes'     => explode(' ', $data['labelclass']),
            'position'    => $position,
        );
        $data['description'] = 'Версия' ;
//        echo'<pre>';print_r( $data['description'] = 'Версия' );echo'</pre>'.__FILE__.' '.__LINE__;
//        die(__FILE__ .' '. __LINE__ );

        return $this->getRenderer($this->renderLabelLayout)->render(array_merge($data, $extraData));




        return '<span style="text-decoration: underline;">ver.' . parent::getLabel() . '</span>';

        // code that returns HTML that will be shown as the label
    }

    public function getInput() {

        $xml_file = JPATH_ROOT .  $this->element['path_xml'] ;

        $dom = new DOMDocument("1.0", "utf-8");
        $dom->load($xml_file);
        $version = $dom->getElementsByTagName('version')->item(0)->textContent;




        // get relevant attributes which were defined in the XML form definition
        $attr = !empty($this->class) ? ' class="' . $this->class . '"' : '';
//        $attr .= !empty($this->element['min']) ? ' min="' . $this->element['min'] . '"' : '';
//        $attr .= !empty($this->element['max']) ? ' max="' . $this->element['max'] . '"' : '';
        $attr .='size="5"' ;
        // set up html, including the value and other attributes
        $html = '<input readonly="1" type="text" name="' . $this->name . '" value="' . $version . '"' . $attr . '/>';

        return $html ;



        // code that returns HTML that will be shown as the form field
    }
}

