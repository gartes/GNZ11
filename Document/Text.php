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
	class Text extends \Joomla\CMS\Language\Text
	{



        /**
         * Обрезка строки до длины
         * \GNZ11\Document\Text::truncation($str, $length);
         * @param $str      - строка
         * @param $length   - длина строки в сисволах
         * @return string
         * @since 3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date 09.09.2020 14:43
         *
         */
        public static function truncation($str, $length = 30)
        {
            $cloneStr = $str ;
            $str = mb_substr($str, 0, $length - 2);        //Обрезаем до заданной длины
            $words = explode(" ", $str);                //Разбиваем по словам
            $cloneWords = $words ;

            array_splice($words, -1);                //Удаляем последнее слово
            $last = array_pop($cloneWords );                //Получаем последнее слово

            for ($i = 1; $i < strlen($last); $i++)
            {
                //Ищем и удаляем в конце последнего слова все кроме букв и цифр
                if (preg_match('/\W$/u', substr($last, -1, 1))) $last = mb_substr($last, 0, strlen($last) - 1);
                else break;
            }
            $result = implode(" ", $words) . ' ' . $last ;
            $result = trim( $result ) ;
            if ( $result == $cloneStr ) return $result ;   #END IF
            return $result. '...';
        }

        /**
         * Транслитерация строки
         *
         * @use $valueCustomTranslite = \GNZ11\Document\Text::rus2translite($valueCustom) ;
         *
         * @param $string
         *
         * @return string
         *
         * @since version
         */
        public static function rus2translite ( $string ): string
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
         * Траслителтрует строку для использования в Url
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
         * Получить количество слов в строке
         * \GNZ11\Document\Text::getCountWord($string);
         *
         * @param string $string
         * @return int - Количество слов
         * @since 3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date 08.09.2020 02:05
         *
         */
        public static function getCountWord(string $string)
        {
	        $arr = explode(' ' , $string);
	        return count( $arr ) ;
        }

        /**
         * Замена в строке кавычек на умные|елочки
         * GNZ11\Document\Text::replaceQuotesWithSmart($datatext)
         * @param   string $datatext
         * @return  string
         * @since 3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date 29.08.2020 18:44
         */
		public static function replaceQuotesWithSmart($datatext){
            return preg_replace_callback(
                '#(([\"]{2,})|(?![^\W])(\"))|([^\s][\"]+(?![\w]))#u',
                function ($matches) {
                    if (count($matches)===3) return "«»";
                    else if ($matches[1]) return str_replace('"',"«",$matches[1]);
                    else return str_replace('"',"»",$matches[4]);
                },
                $datatext
            );
        }

        /**
         * Найти слово из массива в заданной строке
         * GNZ11\Document\Text::strpos_array($haystack , $needles) ;
         * ALIAS \GNZ11\Document\Arrays::strpos_array($haystack , $needles) ;
         * @param $haystack
         * @param $needles
         *
         * @return false|int
         *
         * @since version
         */
        public static function strpos_array($haystack, $needles) {
            return \GNZ11\Document\Arrays::strpos_array($haystack , $needles) ;
        }

        /**
         * Проверит, что первая строка начинается со второй
         * GNZ11\Document\Text::isStart($str, $substr)
         * @param string $str      основная строка
         * @param string $substr   та, которая может содержаться внутри основной
         * @return bool  True -    Если сторка начинается с $substr
         * @since 3.9
         */
        public static function isStart($str, $substr)
        {
            $result = strpos($str, $substr);
            if ($result === 0) { // если содержится, начиная с первого символа
                return true;
            } else {
                return false;
            }
        }

        /**
         * Разбить многобайтовую строку на отдельные символы.
         * Используется для разбиения строки состоящих из символов кирилицы в массив
         * GNZ11\Document\Text::mbStringToArray ($string , $encofing = "UTF-8" )
         * @param $string Строка с кирилицей
         * @param string $encofing Кодировка ( default - UTF-8 )
         * @return array массив символов строки
         *
         * @since version
         */
        public static function mbStringToArray ($string , $encofing = "UTF-8" ) {
            $strlen = mb_strlen($string);
            $array = [] ;
            while ($strlen) {
                $array[] = mb_substr($string,0,1, $encofing );
                $string = mb_substr($string,1,$strlen, $encofing );
                $strlen = mb_strlen($string);
            }
            return $array;
        }

        /**
         * Проверить емеет ли строка  длину
         * Check if have a string with a length
         *
         * GNZ11\Document\Text::checkString($string)
         *
         * @param string $string The string to check
         *
         * @return bool
         * @since 3.9
         */
        public static function checkString(string $string)
        {
            if (isset($string) && is_string($string) && strlen($string) > 0)
            {
                return true;
            }
            return false;
        }

        /**
         * Получить часть строки от первого появления  $inthat
         *
         * GNZ11\Document\Text::getAfter($str, $inthat)
         * / e.c.   GNZ11\Document\Text::getAfter ('@', 'biohazard@online.ge');
         *          returns 'online.ge'
         *          // от первого появления "@"
         * @param $str
         * @param $inthat
         * @return false|string
         * @since 3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date 31.08.2020 16:38
         */
        public static function getAfter($str, $inthat)
        {
            if (!is_bool(mb_strpos($str, $inthat, 0, 'UTF-8')))
                return mb_substr($str, mb_strlen($inthat, 'UTF-8'), mb_strlen($str, 'UTF-8'));
        }

        /**
         * Преобразовать строку в строку camelCase
         * \GNZ11\Document\Text::camelCase($str, $noStrip)
         * @param $str
         * @param array $noStrip
         * @return string
         * @since 3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date 31.08.2020 20:08
         * @{url : http://www.mendoweb.be/blog/php-convert-string-to-camelcase-string/ }
         */
        public static function camelCase($str, array $noStrip = [])
        {
            # не буквенные и нечисловые символы становятся пробелами
            $str = preg_replace('/[^a-z0-9' . implode("", $noStrip) . ']+/i', ' ', $str);
            $str = trim($str);
            # верхний регистр первого символа каждого слова
            $str = ucwords($str);
            $str = str_replace(" ", "", $str);
            $str = lcfirst($str);

            return $str;
        }

        /**
         * Удалить пробелы html - сущностей
         * \GNZ11\Document\Text::trimSpace($stringHTML) ;
         * @param string|array $stringHTML
         * @return string|array
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   18.12.2020 12:11
         */
        public static function trimSpace( $stringHTML ){
            if( !is_array($stringHTML) )
            {
                return self::_converted($stringHTML) ;
            }#END IF
            foreach ( $stringHTML as $k  => $item)
            {
                $stringHTML[$k] = self::_converted($item) ;
            }#END FOREACH
            return $stringHTML ;
        }

        /**
         * Удалить повторение слов в строке идущие друг за другом
         * $str = 'Ремонт принтера Epson Epson M3180';
         * \GNZ11\Document\Text::removeNextDuplicate($str) ;
         *  // return Ремонт принтера Epson M3180
         *
         * @param string $str       строка
         * @param string $delimiter разделитель слов ( default ' ' )
         *
         * @return string
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   18.12.2020 12:47
         */
        public static function removeNextDuplicate( string $str , string $delimiter = ' ' ): string
        {
            $arrString = explode( $delimiter , $str ) ;

            $prev = null ;
            foreach ( $arrString as $i => $item)
            {
                if( $item == $prev )
                {
                    unset( $arrString[$i] ) ;
                }#END IF
                $prev = $item ;
            }#END FOREACH

            return implode( $delimiter , $arrString) ;
        }

        /**
         * Первая буква в верхнем регистре для кириллицы
         * \GNZ11\Document\Text::mb_ucfirst( $word ) ;
         * @param $word
         *
         * @return string
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   14.01.2021 23:49
         *
         */
        public static function mb_ucfirst ($word): string
        {
            return mb_strtoupper(mb_substr($word, 0, 1, 'UTF-8'), 'UTF-8') . mb_substr(mb_convert_case($word, MB_CASE_LOWER, 'UTF-8'), 1, mb_strlen($word), 'UTF-8');
        }




        /**
         * Удалить пробелы html - сущностей
         * @param $stringHTML
         *
         * @return string
         * @since  3.9
         * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
         * @date   18.12.2020 12:33
         *
         */
        protected static function _converted ($stringHTML): string
        {
            $converted = strtr( $stringHTML , array_flip(get_html_translation_table(HTML_ENTITIES, ENT_QUOTES)));
            return trim($converted, chr(0xC2).chr(0xA0));
        }

	}












