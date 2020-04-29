<?php
	/**
     * Разметка для названия способа доставки или оплаты
	 * @package     ${NAMESPACE}
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 */
	defined( '_JEXEC' ) or die;
	
	extract( $displayData );
	$plugin_name = isset($plugin_name)? $plugin_name : null ;
	
	
	$arr = explode(' ', trim($plugin_name) );
	$fWord = $arr[0] ;
	unset($arr[0]) ;
	reset($arr) ;
	$plugin_name = '' ;
	foreach ($arr as $item)
	{
		$plugin_name .= $item .' ' ;
	}#END FOREACH
	$plugin_name = trim( $plugin_name ) ;
	
	?>

<div class="input-check-radio-inner-small check-method-input-radio <?= $_type ?>">
	<span class="check-method-subl-label-text <?= $_type ?> _name">
        <?= $fWord ?>
    </span>
    <?= $plugin_name ?>
</div>

