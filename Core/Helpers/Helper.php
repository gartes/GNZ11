<?php
	namespace GNZ11\Core\Helpers;
	/**
	 * @package     ${NAMESPACE}
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 */
	
	class Helper
	{
		/**
		 * Test string on Json.
		 * @param $string
		 *
		 * @return bool
		 *
		 * @since 3.9
		 */
		function isJson($string) {
			json_decode($string);
			return (json_last_error() == JSON_ERROR_NONE);
		}
		
		static function get_delimited($str, $delimiter='"') {
			$escapedDelimiter = preg_quote($delimiter, '/');
			if (preg_match_all('/' . $escapedDelimiter . '(.*?)' . $escapedDelimiter . '/s', $str, $matches)) {
				return $matches[1];
			}
		}
	}