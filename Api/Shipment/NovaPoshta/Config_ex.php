<?php
namespace NovaPoshta_ex;
Use NovaPoshta\Config;
class Config_ex
{
    public static function initConfig()
    {
        Config::setApiKey('Ваш ключ');
        Config::setFormat(Config::FORMAT_JSONRPC2);
        Config::setLanguage(Config::LANGUAGE_UA);
        Config::setClassLogger(new Logger_example());
    }
}