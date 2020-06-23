<?php

	extract( $displayData );
	?>
    <div id="backupsList">
        <div class="row-line line-head">
            <div class="checkBox-radio"></div>
            <div class="size">Размер</div>
            <div class="date">Дата</div>
        </div>
        <?php
	foreach( $data as $item )
	{
       ?>
        <div class="row-line">
            <div class="checkBox-radio">
                <input type="checkbox" name="backup_id[]" value="<?= $item['backup_id']?>">
            </div>
            <div class="size">
				<?= $item['size']?>
            </div>
            <div class="date2">
				<?= $item['date2']?>
            </div>
        </div>
        <?php
	}#END FOREACH ?>
        <div class="footerBtn">
            <div class="btn-toolbar" role="toolbar" aria-label="Панель инструментов" id="toolbar">
                <div class="btn-wrapper" id="toolbar-backup-restore">
                    <button onclick="" class="btn btn-small backup-restore">
                        <span class="icon-save" aria-hidden="true"></span>
                        Восстановить резервную копию</button>
                </div>
                <div class="btn-wrapper" id="toolbar-backup-remove" style="float: left">
                    <button onclick="" class="btn btn-small backup-remove">
                        <span class="icon-trash" aria-hidden="true"></span>
                        Удалить</button>
                </div>
            </div>
        </div>
    </div>



