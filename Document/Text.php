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
		 * @see   https://gist.github.com/Neolot/3964380
		 *
		 * @param $number int - число для склонения
		 * @param $titles array - массив подбираемых слов
		 *                array(' %d товар', ' %d товара', ' %d товаров')
		 *
		 * @return string ( 1 товар| 2 товара | 8 товаров )
		 * @since 3.9
		 */
		public static function declOfNum ( $number, $titles )
		{
			$cases = array( 2, 0, 1, 1, 1, 2 );
			$format = $titles[ ( $number % 100 > 4 && $number % 100 < 20 ) ? 2 : $cases[ min( $number % 10, 5 ) ] ];
			return sprintf( $format, $number );
		}
		
		/**
		 * Транслетирация строки
		 * @param $string
		 *
		 * @return string
		 *
		 * @since version
		 */
		public static function rus2translite ( $string )
		{
			$converter = array(
				'а' => 'a', 'б' => 'b', 'в' => 'v',
				'г' => 'g', 'д' => 'd', 'е' => 'e',
				'ё' => 'e', 'ж' => 'zh', 'з' => 'z',
				'и' => 'i', 'й' => 'y', 'к' => 'k',
				'л' => 'l', 'м' => 'm', 'н' => 'n',
				'о' => 'o', 'п' => 'p', 'р' => 'r',
				'с' => 's', 'т' => 't', 'у' => 'u',
				'ф' => 'f', 'х' => 'h', 'ц' => 'c',
				'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch',
				'ь' => '\'', 'ы' => 'y', 'ъ' => '\'',
				'э' => 'e', 'ю' => 'yu', 'я' => 'ya',
				
				'А' => 'A', 'Б' => 'B', 'В' => 'V',
				'Г' => 'G', 'Д' => 'D', 'Е' => 'E',
				'Ё' => 'E', 'Ж' => 'Zh', 'З' => 'Z',
				'И' => 'I', 'Й' => 'Y', 'К' => 'K',
				'Л' => 'L', 'М' => 'M', 'Н' => 'N',
				'О' => 'O', 'П' => 'P', 'Р' => 'R',
				'С' => 'S', 'Т' => 'T', 'У' => 'U',
				'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
				'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sch',
				'Ь' => '\'', 'Ы' => 'Y', 'Ъ' => '\'',
				'Э' => 'E', 'Ю' => 'Yu', 'Я' => 'Ya',
			);
			return strtr( $string, $converter );
		}
		
		/**
		 * Траслителтрует строку для имользования в Url
		 * @param $str string
		 *
		 * @return string
		 *
		 * @since version
		 */
		public static function str2url ( $str )
		{
			// переводим в транслит
			$str = self::rus2translite( $str );
			// в нижний регистр
			$str = strtolower( $str );
			// заменям все ненужное нам на "-"
			$str = preg_replace( '~[^-a-z0-9_]+~u', '-', $str );
			// удаляем начальные и конечные '-'
			$str = trim( $str, "-" );
			return $str;
		}

        /**
         * Найти слово из массива в заданной строке
         * @param $haystack
         * @param $needles
         *
         * @return false|int
         *
         * @since version
         */
        public static function strpos_array($haystack, $needles) {
            if ( is_array($needles) ) {
                foreach ($needles as $str) {
                    if ( is_array($str) ) {
                        $pos = strpos_array($haystack, $str);
                    } else {
                        $pos = strpos($haystack, $str);
                    }
                    if ($pos !== FALSE) {
                        return $pos;
                    }
                }
            } else {
                return strpos($haystack, $needles);
            }
        }
		
	}