<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Form
 *
 * @copyright   Copyright (C) 2005 - 2012 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

use Joomla\CMS\Form\FormField;
use Joomla\CMS\Form\FormHelper;
use Joomla\CMS\Layout\FileLayout;
use Joomla\CMS\Uri\Uri;

defined('JPATH_PLATFORM') or die;

FormHelper::loadFieldClass('radio');

/**
 * Form Field class for the Joomla Platform.
 * Supports a one line text field.
 *
 * @package     Joomla.Platform
 * @subpackage  Form
 * @link        http://www.w3.org/TR/html-markup/input.text.html#input.text
 * @since       11.1
 */
class JFormFieldCompresradio extends JFormFieldRadio
{
	/**
	 * @var string
     * @since 3.9
	 */
	protected $type = 'Compresradio';

    /**
     * Name of the layout being used to render the field
     *
     * @var    string
     * @since  3.5
     */
    protected $layout = 'joomla.form.field.compresradio';



    /**
     * Method to get the radio button field input markup.
     *
     * @return  string  The field input markup.
     *
     * @since   1.7.0
     */
    /*protected function getInput()
    {

        if (empty($this->layout))
        {
            throw new UnexpectedValueException(sprintf('%s has no layout assigned.', $this->name));
        }
        $LayoutData = $this->getLayoutData();

        return $this->getRenderer($this->layout)->render($LayoutData);
    }*/

    public function getLabel() {
        JLoader::registerNamespace('GNZ11',JPATH_LIBRARIES.'/GNZ11',$reset=false,$prepend=false,$type='psr4');
        $GNZ11_js =  \GNZ11\Core\Js::instance();

        $doc = \Joomla\CMS\Factory::getDocument();

        /**
         * Добавление загрузки скрипта на стороне сервера для CMS Joomla
         */

        $Jpro = $doc->getScriptOptions('Jpro') ;
        $Jpro['load'][] = [
            'u' => Uri::root().'/libraries/GNZ11/Document/Layouts/joomla/form/field/compresradio.js' , // Путь к файлу
            't' => 'js' ,                                       // Тип загружаемого ресурса
            'c' => 'testCallback' ,                             // метод после завершения загрузки
        ];
        $doc->addScriptOptions('Jpro' , $Jpro ) ;



//        $doc->addScript( Uri::root().'libraries/GNZ11/Document/Layouts/joomla/form/field/compresradio.js' ,[], ['async'=>'async'] );
        return '<span style="text-decoration: underline;">' . parent::getLabel() . '</span>';
    }

    /**
     * Разрешить переопределить пути включения средства визуализации в дочерние поля
     * Allow to override renderer include paths in child fields
     *
     * @return  array
     *
     * @since   3.5
     */
    protected function getLayoutPaths()
    {
        $renderer = new FileLayout($this->layout);
        $renderer->addIncludePath(JPATH_LIBRARIES.'/GNZ11/Document/Layouts');
        return $renderer->getIncludePaths();

    }


    /**
     * Get the renderer
     *
     * @param   string  $layoutId  Id to load
     *
     * @return  FileLayout
     *
     * @since   3.5
     */
    /*protected function getRenderer($layoutId = 'default')
    {
        //        $this->layout = 'joomla.form.field.radio' ;
        $this->layout = 'joomla.form.field.compresradio' ;

        $renderer = new FileLayout($this->layout);
        $renderer->addIncludePath(JPATH_LIBRARIES.'/GNZ11/Document/Layouts');
        // $renderer->debug();
        $renderer->setDebug( $this->isDebugEnabled() );

//        $layoutPaths = $this->getLayoutPaths();



        if ($layoutPaths)
        {
            $renderer->setIncludePaths($layoutPaths);
        }

        return $renderer;
    }*/


    /**
     * Method to get the data to be passed to the layout for rendering.
     *
     * @return  array
     *
     * @since   3.5
     */
    protected function getLayoutData()
    {
        $data = parent::getLayoutData();

        $extraData = array(
            'options' => $this->getOptions(),
            'value'   => (string) $this->value,
        );

        foreach( $this->element->attributes()  as $a =>  $b) {
            if ($a == 'file')
            {
                $extraData['file'] = (string)$b ;
            }#END IF
        }
        return array_merge($data, $extraData);
    }

}
