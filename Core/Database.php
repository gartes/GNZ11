<?php


	namespace GNZ11\Core;


	class Database
	{
		public static function parse_mysql_dump( $url )
		{
			$file_content = file( $url );
			$query = "";
			foreach( $file_content as $sql_line )
			{
				if( trim( $sql_line ) != "" && strpos( $sql_line , "--" ) === false )
				{
					$query .= $sql_line;
					if( preg_match( "/;[\040]*\$/" , $sql_line ) )
					{
						return $query ;
						echo '<pre>';
						print_r( $query );
						echo '</pre>' . __FILE__ . ' ' . __LINE__;


//						$result = mysql_query($query)or die(mysql_error());
						$query = "";
					}
				}
			}
			die(__FILE__ .' '. __LINE__ );
		}
	}