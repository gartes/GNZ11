<?php
	
	namespace GNZ11\Document;
	
	
	use Exception;
	
	/**
	 * USE :
	 * - JOOMLA :
	 *      JLoader::registerNamespace( 'GNZ11',JPATH_LIBRARIES.'/GNZ11',$reset=false,$prepend=false,$type='psr4');
	 *
	 *
	 * @since       3.9
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 * @package     GNZ11\Document
	 */
	class Text
	{
		
		/**
		 * PHP Склонение числительных
		 *
		 * USE :
		 *
		 * $titles = array(' %d товар', ' %d товара', ' %d товаров');
		 * $number = INT ;
		 * $checkText = \GNZ11\Document\Text::declOfNum( $number , $titles );
		 *
		 * @see  https://gist.github.com/Neolot/3964380
		 *
		 * @param $number int - число для склонения
		 * @param $titles array - массив подбираемых слов
		 *                array(' %d товар', ' %d товара', ' %d товаров')
		 *
		 * @return string ( 1 товар| 2 товара | 8 товаров )
		 * @since 3.9
		 */
		public static function declOfNum($number, $titles)
		{
			$cases = array (2, 0, 1, 1, 1, 2);
			$format = $titles[ ($number%100 > 4 && $number %100 < 20) ? 2 : $cases[min($number%10, 5)] ];
			return sprintf($format, $number);
		}
		
		
		
	}