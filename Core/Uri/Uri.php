<?php
	namespace GNZ11\Core\Uri;
	/**
	 * @package     ${NAMESPACE}
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 * @since 3.9
	 */
	
	class Uri extends \Joomla\Uri\Uri
	{
		/**
		 * @var    \GNZ11\Core\Uri\Uri  An array of JUri instances.
		 * @since  1.7.0
		 */
		protected static $instances = array();
		/**
		 * @var    array  The current calculated base url segments.
		 * @since  1.7.0
		 */
		protected static $base = array();
		/**
		 * @var    array  The current calculated root url segments.
		 * @since  1.7.0
		 */
		protected static $root = array();
		
		/**
		 * Returns the global JUri object, only creating it if it doesn't already exist.
		 *
		 * @param   string  $uri  The URI to parse.  [optional: if null uses script URI]
		 *
		 * @return  \GNZ11\Core\Uri\Uri  The URI object.
		 *
		 * @since   1.7.0
		 */
		public static function getInstance($uri = 'SERVER')
		{
			if (empty(static::$instances[$uri]))
			{
				// Are we obtaining the URI from the server?
				if ($uri == 'SERVER')
				{
					// Determine if the request was over SSL (HTTPS).
					if (isset($_SERVER['HTTPS']) && !empty($_SERVER['HTTPS']) && (strtolower($_SERVER['HTTPS']) != 'off'))
					{
						$https = 's://';
					}
					elseif ((isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
						!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
						(strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) !== 'http')))
					{
						$https = 's://';
					}
					else
					{
						$https = '://';
					}
					
					/*
					 * Since we are assigning the URI from the server variables, we first need
					 * to determine if we are running on apache or IIS.  If PHP_SELF and REQUEST_URI
					 * are present, we will assume we are running on apache.
					 */
					
					if (!empty($_SERVER['PHP_SELF']) && !empty($_SERVER['REQUEST_URI']))
					{
						// To build the entire URI we need to prepend the protocol, and the http host
						// to the URI string.
						$theURI = 'http' . $https . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
					}
					else
					{
						/*
						 * Since we do not have REQUEST_URI to work with, we will assume we are
						 * running on IIS and will therefore need to work some magic with the SCRIPT_NAME and
						 * QUERY_STRING environment variables.
						 *
						 * IIS uses the SCRIPT_NAME variable instead of a REQUEST_URI variable... thanks, MS
						 */
						$theURI = 'http' . $https . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'];
						
						// If the query string exists append it to the URI string
						if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING']))
						{
							$theURI .= '?' . $_SERVER['QUERY_STRING'];
						}
					}
					
					// Extra cleanup to remove invalid chars in the URL to prevent injections through the Host header
					$theURI = str_replace(array("'", '"', '<', '>'), array('%27', '%22', '%3C', '%3E'), $theURI);
				}
				else
				{
					// We were given a URI
					$theURI = $uri;
				}
				
				static::$instances[$uri] = new static($theURI);
			}
			
			return static::$instances[$uri];
		}
		/**
		 * Returns the root URI for the request.
		 *
		 * @param   boolean  $pathonly  If false, prepend the scheme, host and port information. Default is false.
		 * @param   string   $path      The path
		 *
		 * @return  string  The root URI string.
		 *
		 * @since   1.7.0
		 */
		public static function root($pathonly = false, $path = null)
		{
			// Get the scheme
			if (empty(static::$root))
			{
				$uri = static::getInstance(static::base());
				static::$root['prefix'] = $uri->toString(array('scheme', 'host', 'port'));
				static::$root['path'] = rtrim($uri->toString(array('path')), '/\\');
			}
			
			// Get the scheme
			if (isset($path))
			{
				static::$root['path'] = $path;
			}
			return $pathonly === false ? static::$root['prefix'] . static::$root['path'] . '/' : static::$root['path'];
		}
		/**
		 * Returns the base URI for the request.
		 *
		 * @param   boolean  $pathonly  If false, prepend the scheme, host and port information. Default is false.
		 *
		 * @return  string  The base URI string
		 *
		 * @since   1.7.0
		 */
		public static function base($pathonly = false)
		{
			// Get the base request path.
			if (empty(static::$base))
			{
				$config = \JFactory::getConfig();
				$uri = static::getInstance();
				$live_site = ($uri->isSsl()) ? str_replace('http://', 'https://', $config->get('live_site')) : $config->get('live_site');
				
				if (trim($live_site) != '')
				{
					$uri = static::getInstance($live_site);
					static::$base['prefix'] = $uri->toString(array('scheme', 'host', 'port'));
					static::$base['path'] = rtrim($uri->toString(array('path')), '/\\');
					
					if (defined('JPATH_BASE') && defined('JPATH_ADMINISTRATOR'))
					{
						if (JPATH_BASE == JPATH_ADMINISTRATOR)
						{
							static::$base['path'] .= '/administrator';
						}
					}
				}
				else
				{
					static::$base['prefix'] = $uri->toString(array('scheme', 'host', 'port'));
					
					if (strpos(php_sapi_name(), 'cgi') !== false && !ini_get('cgi.fix_pathinfo') && !empty($_SERVER['REQUEST_URI']))
					{
						// PHP-CGI on Apache with "cgi.fix_pathinfo = 0"
						
						// We shouldn't have user-supplied PATH_INFO in PHP_SELF in this case
						// because PHP will not work with PATH_INFO at all.
						$script_name = $_SERVER['PHP_SELF'];
					}
					else
					{
						// Others
						$script_name = $_SERVER['SCRIPT_NAME'];
					}
					
					// Extra cleanup to remove invalid chars in the URL to prevent injections through broken server implementation
					$script_name = str_replace(array("'", '"', '<', '>'), array('%27', '%22', '%3C', '%3E'), $script_name);
					
					static::$base['path'] = rtrim(dirname($script_name), '/\\');
				}
			}
			
			return $pathonly === false ? static::$base['prefix'] . static::$base['path'] . '/' : static::$base['path'];
		}
		
		
		
	}