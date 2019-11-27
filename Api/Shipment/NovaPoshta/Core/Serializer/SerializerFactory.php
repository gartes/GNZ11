<?php

namespace NovaPoshta\Core\Serializer;


if(!class_exists('NovaPoshta\Config')) 
				require(VMPATH_MY_PLUGIN_VMUPS_LIBS.DS.'lib'.DS.'NovaPoshta'.DS.'Config.php' ); // end if
if(!class_exists('NovaPoshta\Core\NovaPoshtaException')) 
				require(VMPATH_MY_PLUGIN_VMUPS_LIBS.DS.'lib'.DS.'NovaPoshta'.DS.'Core'.DS.'NovaPoshtaException.php' ); // end if

if(!class_exists('NovaPoshta\Core\Serializer\DataSerializerJSONRPC2')) 
				require(VMPATH_MY_PLUGIN_VMUPS_LIBS.DS.'lib'.DS.'NovaPoshta'.DS.'Core'.DS.'Serializer'.DS.'DataSerializerJSONRPC2.php' ); // end if


use NovaPoshta\Config;
use NovaPoshta\Core\NovaPoshtaException;

class SerializerFactory
{
    private static $serializer;

    /**
     * @return SerializerInterface|SerializerFactory|SerializerBatchInterface
     * @throws NovaPoshtaException
     */
    public static function getSerializer()
    {
        $format = strtoupper(Config::getFormat());
        
	 
		$dataSerializer = 'NovaPoshta\Core\Serializer\DataSerializer' . $format;
        if (!class_exists($dataSerializer)) {
            throw new NovaPoshtaException('NovaPoshta\Core\Serializer\SerializerFactory_NO_SERIALIZER');
        }
        if (!self::$serializer) {
            self::$serializer = new $dataSerializer();
        }

        return self::$serializer;
    }
}