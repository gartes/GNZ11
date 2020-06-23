<?php


	namespace GNZ11\Core\Backup;


	use Exception;

	class BackupJoomlaException extends Exception
	{
		public function __construct($message, $code = 0, Exception $previous = null)
		{


			/*echo'<pre>';print_r( $code );echo'</pre>'.__FILE__.' '.__LINE__;
			die(__FILE__ .' '. __LINE__ );*/

			parent::__construct($message, $code, $previous);
		}
		public function __toString() {
			return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
		}
		public function customFunction() {
			echo "Мы можем определять новые методы в наследуемом классе\n";
		}
	}