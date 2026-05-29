<?php

$count = count($_FILES['fileToUpload']['name']);
for($i = 0; $i < $count; $i++){
    echo 'Name: '.$_FILES['fileToUpload']['name'][$i].'<br/>';
}

// $foto = $_FILES['pic'];
// 	$data = array('success' => false);
	
// 	if(copy($foto['tmp_name'],'ruta/'.$foto['name'])){
// 		$data = array('success' => true);
// 	}
	
// 	echo json_encode($data);

?>