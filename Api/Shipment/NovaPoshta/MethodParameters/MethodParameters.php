<?php

namespace NovaPoshta\MethodParameters;

if(!class_exists('NovaPoshta\Core\BaseModel')) 
				require(VMPATH_MY_PLUGIN_VMUPS_LIBS.DS.'lib'.DS.'NovaPoshta'.DS.'Core'.DS.'BaseModel.php'); // end if


use NovaPoshta\Core\BaseModel;

/**
 * Использовать для передачи параметров в методы моделей
 *
 * Class MethodParameters
 * @package NovaPoshta\MethodParameters
 */
class MethodParameters extends BaseModel
{

}