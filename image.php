<?php

header('Content-type: image/jpeg');

// Fake user agent - PHP is blocked
ini_set('user_agent', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.9) Gecko/20071025 Firefox/2.0.0.9');

$x = abs($_GET['x']);
$y = abs($_GET['y']);
$z = abs($_GET['z']);
$layers = $_GET['layers'];
if (empty($layers)) {
	$layers = array('satellite');
}
$filename = $x.'/'.$y.'/'.$z;
if (in_array('satellite', $layers)) { $filename .= '_satellite'; }
if (in_array('streets', $layers)) { $filename .= '_streets'; }
$filename .= '.jpg';

if (!file_exists('cache/'.$filename)) {
	$image = imagecreatetruecolor(256, 256);

	if (in_array('satellite', $layers)) {
		$image_satellite = imagecreatefromjpeg('http://khm0.google.com/kh/v=67&x='.$x.'&y='.$y.'&z='.$z.'&s=Galileo');
		imagecopyresampled($image, $image_satellite, 0, 0, 0, 0, 256, 256, 256, 256);
	}

	if (in_array('streets', $layers)) {
		$image_streets = imagecreatefrompng('http://mt1.google.com/vt/lyrs=h@138&hl=en&x='.$x.'&s=&y='.$y.'&z='.$z.'&s=Galileo');
		imagecopyresampled($image, $image_streets, 0, 0, 0, 0, 256, 256, 256, 256);
	}

	@mkdir('cache/'.$x);
	@mkdir('cache/'.$x.'/'.$y);
	imagejpeg($image, 'cache/'.$filename, 100);
}

echo file_get_contents('cache/'.$filename);

?>