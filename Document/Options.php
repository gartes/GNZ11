<?php
	
	
	namespace GNZ11\Document;
	
	
	class Options
	{
		/**
		 * Добавить параметры для плагина
		 * @param $pluginName string - нвзвание плагина
		 * @param $option   - опции для добавления
         * @since 3.9
		 */
		public static function addPluginOptions( $pluginName , $option ){
			$doc = \Joomla\CMS\Factory::getDocument();
			$Data = $doc->getScriptOptions( $pluginName ) ;
			$output = array_merge_recursive( $option , $Data );
			$doc->addScriptOptions( $pluginName , $output ) ;
		}
	}