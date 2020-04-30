<?php
	/**
	 * @package     Core\Platform
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 */
	
	namespace GNZ11\Core\Platform;
	
	
	class PlatformUtility
	{
		/**
		 * Получить IP Адрес пользователя
		 * @return mixed - IP адрес пользователя
		 * @author    Gartes
		 *
		 * @since     3.8
		 * @copyright 18.12.18
		 */
		public static function getUserHostAddress(){
			if (!empty($_SERVER['HTTP_X_REAL_IP']))   //check ip from share internet
			{
				$ip=$_SERVER['HTTP_X_REAL_IP'];
			}
			elseif (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
			{
				$ip=$_SERVER['HTTP_CLIENT_IP'];
			}
			elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
			{
				$ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
			}
			else
			{
				$ip=$_SERVER['REMOTE_ADDR'];
			}
			return $ip;
		}
	}