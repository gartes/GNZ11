<?php
	/**
	 * @package     GNZ11\Api\Optimize
	 * @subpackage
	 *
	 * @copyright   A copyright
	 * @license     A "Slug" license name e.g. GPL2
	 */
	
	namespace GNZ11\Api\Optimize;
	
	
	class Img
	{
		private $params ;
		/**
		 * Img constructor.
		 * @since 3.9
		 */
		public function __construct ($params = [] )
		{
			$this->params = $params ;
		}
		
		/**
		 * Конвертирует изображения в формате PNG в JPG
		 * безопасно с прозрачностью белого цвета.
		 * @see https://stackoverflow.com/a/8951540
		 * @param        $filePath
		 * @param   int  $Quality
		 * @since version
		 */
		public static function png2jpg (  $filePath , $Quality = 50  ){
			$image = imagecreatefrompng($filePath);
			$bg = imagecreatetruecolor(imagesx($image), imagesy($image));
			imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
			imagealphablending($bg, TRUE);
			imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
			imagedestroy($image);
			$quality = $Quality; // 0 = worst / smaller file, 100 = better / bigger file
			imagejpeg($bg, $filePath . ".jpg", $quality);
			imagedestroy($bg);
		}
		
		
	}