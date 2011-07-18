<?php 

	// sleep for a bit to wait for files to finish writing 
	sleep(1);

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
		
	// download the content 
	header('Content-type: application/zip');
	header('Content-disposition: filename="' . $zipfilename . '"');
	header("Content-length: " . filesize($zipfilename));
	readfile($zipfilename);
	exit();
	
?>