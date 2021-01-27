<?php
/*----------------------------------------------------------------------------------|  www.vdm.io  |----/
				Gartes 
/-------------------------------------------------------------------------------------------------------/

	@version		1.x.x
	@build			23rd августа, 2020
	@created		5th мая, 2019
	@package		proCritical
	@subpackage		typedeviceidhtml.php
	@author			Nikolaychuk Oleg <https://nobd.ml>	
	@copyright		Copyright (C) 2019. All Rights Reserved
	@license		GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html
  ____  _____  _____  __  __  __      __       ___  _____  __  __  ____  _____  _  _  ____  _  _  ____ 
 (_  _)(  _  )(  _  )(  \/  )(  )    /__\     / __)(  _  )(  \/  )(  _ \(  _  )( \( )( ___)( \( )(_  _)
.-_)(   )(_)(  )(_)(  )    (  )(__  /(__)\   ( (__  )(_)(  )    (  )___/ )(_)(  )  (  )__)  )  (   )(  
\____) (_____)(_____)(_/\/\_)(____)(__)(__)   \___)(_____)(_/\/\_)(__)  (_____)(_)\_)(____)(_)\_) (__) 

/------------------------------------------------------------------------------------------------------*/
    use Joomla\CMS\Language\Text;
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import the list field type
jimport('joomla.form.helper');
JFormHelper::loadFieldClass('list');

/**
 * Список выбора меток товаров
 */
class JFormFieldProductlabels extends JFormFieldList
{
	/**
	 * The htmltaskevents field type.
	 *
	 * @var		string
     * @since 3.9
	 */
	public $type = 'productlabels';



	/**
	 * Method to get a list of options for a list input.
	 *
	 * @return	array    An array of JHtml options.
     * @since 3.9
	 */
	protected function getOptions()
	{

        $items = $this->getAllValues ();

		$options = array();
		if ($items)
		{
//			$options[] = JHtml::_('select.option', '', '');
			foreach($items as $item)
			{
				$options[] = JHtml::_('select.option', $item->value, Text::_($item->text));
			}
		}
		return $options;
	}

    public function getAllValues ()
    {
        $db		= JFactory::getDbo();
        $lang	= JSFactory::getLang();
        $query	= "SELECT
						`id` as `value`,
						`".$lang->get('name')."` as `text`
					FROM `#__jshopping_product_labels`
					ORDER BY `".$lang->get('name')."`";
        $db->setQuery($query);

        return $db->loadObjectList();
    }
}
