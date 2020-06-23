CREATE TABLE IF NOT EXISTS `#__gnz11_core_backups` (
  `backup_id` int(20) NOT NULL AUTO_INCREMENT,
  `namespace` varchar(256) NOT NULL,
  `file` varchar(256) NOT NULL,
  `size` int(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`backup_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;