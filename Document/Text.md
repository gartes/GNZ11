### \GNZ11\Document\Text
**Текстовые операции**
###### Содержание: <a name="top"></a>

+ [\GNZ11\Document\Text ( текстовые операции ).](https://github.com/gartes/GNZ11/blob/master/Document/Text.md)
   + [Первая буква в верхнем регистре для кириллицы.](#перваяБукваВВерхнемРегистреДляКириллицы)
   + [Транслитерация.](#rus2translite)
   + [Транслитерация для использования в Url.](#str2url)
   + [Склонение числительных.](#declOfNum)
   + [Обрезка строки до длины.](#truncation)
   + [Получить количество слов в строке.](#getCountWord)
   + [Замена в строке кавычек на умные|елочки.](#replaceQuotesWithSmart)
   + [Найти слово из массива в заданной строке.](#strpos_array)
   + [Проверит, что первая строка начинается со второй.](#isStart)
   + [Разбить много байтовую строку на отдельные символы. Используется для разбиения строки состоящих из символов кириллицы в массив.](#mbStringToArray)
   + [Проверить имеет ли строка длину.](#checkString)
   + [Получить часть строки от первого появления $inthat.](#getAfter)
   + [Преобразовать строку в строку camelCase.](#camelCase)
   + [Удалить пробелы html - сущностей &nbsp ; .](#trimSpace)
   + [Удалить повторение слов в строке идущие друг за другом.](#removeNextDuplicate)

[comment]: <> (----------------------------------------------------------)
***
[comment]: <> (----------------------------------------------------------)
###### Links:
[comment]: <> (* [xxxx]&#40;#aaa&#41;)
***
[comment]: <> (----------------------------------------------------------)


## <a name="GNZ11DocumentText"></a>  \GNZ11\Document\Text
###Обработка строковых и числовых значений
##### Транслитерация <a name="rus2translite"></a>
```php
$string = 'Абвгдеж';
\GNZ11\Document\Text::rus2translite($string);
```
##### Транслитерация для использования в Url <a name="str2url"></a>
```php
$string = 'Абвгдеж';
\GNZ11\Document\Text::str2url($string) ; 
```
##### Склонение числительных <a name="declOfNum"></a>
```php
$titles = array(' %d товар', ' %d товара', ' %d товаров');
\GNZ11\Document\Text::declOfNum ( $number = 5 , $titles );
```
##### Проверит, что первая строка начинается со второй <a name="isStart"></a>
```php 
/**
 * Проверит, что первая строка начинается со второй
 * 
 * @param string $str      основная строка
 * @param string $substr   та, которая может содержаться внутри основной
 * @return bool  True -    Если сторка начинается с $substr
 */
\GNZ11\Document\Text::isStart($str, $substr)
```
##### Обрезка строки до длины <a name="truncation"></a>
```php
/**
 * @param $str      - строка
 * @param $length   - длина строки в сисволах
 * @return string
 */
\GNZ11\Document\Text::truncation($str, $length);
```
#####  <a name="getCountWord"></a>
```php
/**
 * @param string $string
 * @return int - Количество слов
 */
\GNZ11\Document\Text::getCountWord($string);
```
##### Замена в строке кавычек на умные|елочки <a name="replaceQuotesWithSmart"></a>
```php
/**
 * Замена в строке кавычек на умные|елочки
 * @param   string $datatext
 * @return  string
 */
GNZ11\Document\Text::replaceQuotesWithSmart($datatext);
```
##### Найти слово из массива в заданной строке <a name="strpos_array"></a>
 ```php
/**
 * ALIAS \GNZ11\Document\Arrays::strpos_array($haystack , $needles) ;
 * @param $haystack
 * @param $needles
 */
GNZ11\Document\Text::strpos_array($haystack , $needles) ;
 ```
##### Проверит, что первая строка начинается со второй <a name="isStart"></a>
 ```php
/**
 * @param string $str      основная строка
 * @param string $substr   та, которая может содержаться внутри основной
 * @return bool  True -    Если сторка начинается с $substr
 */
GNZ11\Document\Text::isStart($str, $substr) ; 
 ```
##### Разбить много байтовую строку на отдельные символы. Используется для разбиения строки состоящих из символов кириллицы в массив <a name="mbStringToArray"></a>
 ```php
/**
 * @param string $string Строка с кирилицей
 * @param string $encofing Кодировка ( default - UTF-8 )
 * @return array массив символов строки
 */
GNZ11\Document\Text::mbStringToArray ($string , $encofing  ) ; 
 ```
##### Проверить имеет ли строка длину <a name="checkString"></a>
 ```php
/**
 * @param string $string The string to check
 * @return bool
 * @since 3.9
 */
\GNZ11\Document\Text::checkString($string) ; 
 ```
##### Получить часть строки от первого появления $inthat <a name="getAfter"></a>
 ```php
/**
 * @param $str
 * @param $inthat
 * @return false|string
 */
GNZ11\Document\Text::getAfter ('@', 'biohazard@online.ge');
//         returns 'online.ge'
```
##### Преобразовать строку в строку camelCase <a name="camelCase"></a>
 ```php
/**
 * @param $str
 * @param array $noStrip
 * @return string
 * @{url : http://www.mendoweb.be/blog/php-convert-string-to-camelcase-string/ }
 */
\GNZ11\Document\Text::camelCase($str, $noStrip) ;
 ```
##### Удалить пробелы html - сущностей &nbsp ; <a name="trimSpace"></a>
 ```php
/**
* @param string|array $stringHTML
* @return string|array
* @since  3.9
* @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
* @date   18.12.2020 12:11
*/
$stringHTML = 'Epson M3180&nbsp;';
\GNZ11\Document\Text::trimSpace($stringHTML) ;
// return Epson M3180
 ```
##### Удалить повторение слов в строке идущие друг за другом <a name="removeNextDuplicate"></a>
 ```php
/**
 * @param string $str строка
 * @param string $delimiter разделитель слов ( default ' ' )
 * @return string
 * @date   18.12.2020 12:47
 */
$str = 'Ремонт принтера Epson Epson M3180';
\GNZ11\Document\Text::removeNextDuplicate($str) ;
// return Ремонт принтера Epson M3180
 ```
##### Первая буква в верхнем регистре для кириллицы <a name="перваяБукваВВерхнемРегистреДляКириллицы"></a> (2021-01-15, 0:0)
 ```php
$word = 'АБВЖДЕЁЖ';
 \GNZ11\Document\Text::mb_ucfirst( $word ) ;
// return : Абвждеёж
 ```

[Содержание](#top)
***************************************************************************************