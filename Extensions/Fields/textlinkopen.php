<?php

/***********************************************************************************************************************
 *  ///////////////////////////╭━━━╮╱╱╱╱╱╱╱╱╭╮╱╱╱╱╱╱╱╱╱╱╱╱╱╭━━━╮╱╱╱╱╱╱╱╱╱╱╱╱╭╮////////////////////////////////////////
 *  ///////////////////////////┃╭━╮┃╱╱╱╱╱╱╱╭╯╰╮╱╱╱╱╱╱╱╱╱╱╱╱╰╮╭╮┃╱╱╱╱╱╱╱╱╱╱╱╱┃┃////////////////////////////////////////
 *  ///////////////////////////┃┃╱╰╯╭━━╮╭━╮╰╮╭╯╭━━╮╭━━╮╱╱╱╱╱┃┃┃┃╭━━╮╭╮╭╮╭━━╮┃┃╱╭━━╮╭━━╮╭━━╮╭━╮////////////////////////
 *  ///////////////////////////┃┃╭━╮┃╭╮┃┃╭╯╱┃┃╱┃┃━┫┃━━┫╭━━╮╱┃┃┃┃┃┃━┫┃╰╯┃┃┃━┫┃┃╱┃╭╮┃┃╭╮┃┃┃━┫┃╭╯////////////////////////
 *  ///////////////////////////┃╰┻━┃┃╭╮┃┃┃╱╱┃╰╮┃┃━┫┣━━┃╰━━╯╭╯╰╯┃┃┃━┫╰╮╭╯┃┃━┫┃╰╮┃╰╯┃┃╰╯┃┃┃━┫┃┃/////////////////////////
 *  ///////////////////////////╰━━━╯╰╯╰╯╰╯╱╱╰━╯╰━━╯╰━━╯╱╱╱╱╰━━━╯╰━━╯╱╰╯╱╰━━╯╰━╯╰━━╯┃╭━╯╰━━╯╰╯/////////////////////////
 *  ///////////////////////////╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃┃//  (C) 2022  ///////////////////
 *  ///////////////////////////╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╰╯/////////////////////////////////
 *----------------------------------------------------------------------------------------------------------------------
 * @author     Gartes | sad.net79@gmail.com | Telegram : @gartes
 * @date       19.11.22 13:45
 * Created by PhpStorm.
 * @copyright  Copyright (C) 2005 - 2022 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later;
 **********************************************************************************************************************/

/**
 * @Copyright   Copyright © 2010-2022 Gartes.  All rights reserved.
 * @license     GNU Geneal Public License 2 or later, see COPYING.txt for license details.
 */

defined('JPATH_BASE') or die;

/**
 * Class JFormFieldTextlinkopen
 *
 * @since 3.9
 */
class JFormFieldTextlinkopen extends \JFormFieldText
{
	/**
	 * The form field type.
	 *
	 * @since  1.7.0
	 * @var    string
	 */
	protected $type = 'textlinkopen';
	/**
	 * The class of the form field
	 *
	 * @since  3.2
	 * @var    mixed
	 */
	protected $class;
	/**
	 * The label for the form field.
	 *
	 * @since  1.7.0
	 * @var    string
	 */
	protected $label;

	/**
	 * Method to get the field input markup.
	 *
	 * @return    string    The field input markup.
	 * @since    1.6
	 */
	protected function getInput()
	{
		$html = parent::getInput();
		$html .= ' 
				<a style="margin-top: -10px;" 
					class="btn btn-mini button btn-success btn-open_blank_link hide" 
					target="_blank" 
					title="Открыть в новом окне"
					aria-label="Открыть в новом окне">
	                <span class="icon-share icon-white" aria-hidden="true"></span>
            	</a>
            
            ' ;

		$app = \Joomla\CMS\Factory::getApplication();
		if ( !$app->get('JFormFieldTextlinkopen' , false) )
		{
			JFactory::getDocument()->addScriptDeclaration("
				document.addEventListener('GNZ11Loaded', function (e) {
	                var $ = jQuery ; 
	                var linkEl = $('a.btn-open_blank_link')
	                linkEl.each(function (i,el){
			            var Url = $(el).prev().val();
			            $(el).attr('href' , window.location.protocol+'//'+window.location.hostname + '/' + Url  ).removeClass('hide')
			        }); 
                }, false);	
			");
			$app->set('JFormFieldTextlinkopen' , 1 );
		}#END IF


		return $html ;
	}

	/**
	 * @return string
	 * @since    1.6
	 */
	function getLabel()
	{
		return parent::getLabel();
	}
}