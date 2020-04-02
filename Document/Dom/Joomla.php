<?php
	/**
	 * @package     GNZ11\Document\Dom
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 */
	
	namespace GNZ11\Document\Dom;
	
	
	use Exception;
	use JFactory;
	use Throwable;
	
	class Joomla
	{
		public static function getBody(){
			$app = JFactory::getApplication() ;
					try
							{
								// Code that may throw an Exception or Error.
								$dody = $app->getBody();
							}
							catch (Exception $e)
							{
							   // Executed only in PHP 5, will not be reached in PHP 7
							   echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
							}
							catch (Throwable $e)
							{
								// Executed only in PHP 7, will not match in PHP 5
								echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
								echo'<pre>';print_r( $e );echo'</pre>'.__FILE__.' '.__LINE__;
							}
			
			if( $dody == false )
			{
				$doc = JFactory::getDocument();
				$oldComponent = $doc->getBuffer();
				
//				echo'<pre>';print_r( $oldComponent );echo'</pre>'.__FILE__.' '.__LINE__;
//				die(__FILE__ .' '. __LINE__ );
			}#END IF
			
			
			
			return $dody ;
		}
	}