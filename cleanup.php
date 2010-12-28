<?php

ini_set('memory_limit', '64M');

chdir(dirname(__FILE__));

$files = scandir('cache');
foreach ($files as $file) {
	if (substr($file, 0, 1) == '.') { continue; }
	if (disk_free_space(dirname(__FILE__)) < 100 * 1024 * 1024) {
		rrmdir('cache/'.$file);
	} else {
		break;
	}
}


function rrmdir($dir) {
	if (is_dir($dir)) {
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if ($object != "." && $object != "..") {
				if (filetype($dir."/".$object) == "dir") {
					rrmdir($dir."/".$object);
				} else {
					unlink($dir."/".$object);
				}
			}
		}
		reset($objects);
		rmdir($dir);
	}
}