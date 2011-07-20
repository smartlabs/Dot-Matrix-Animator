<?php 

	// sleep for a bit to wait for files to finish writing 
	// not the best way but will work for now
	sleep(3);

	// create the file name 	
	$prefix = $_POST['prefix'];
	
	// create the zip file name 
	$zipfilename = $prefix."_svgs.zip";
	
	// create the glob 	
	$glob_string = $prefix."_*.svg";
	$files = glob($glob_string);
	
	// now zip everything 
	$zip = new ZipArchive;
	$zip->open($zipfilename, ZipArchive::CREATE);
	foreach ( $files as $file) {
	  $zip->addFile($file);
	}
	$zip->close();
	
	// now delete each file 
	foreach ( $files as $file ) {
		unlink($file);	
	}
		
	// optional echo if you want download the file via browser 
	// turn on the success portion of the ajax call if you want this 
	// echo "my_web_address".$zipfilename
	
?>