<?php 

	 // create the prefix 
	 $prefix = $_POST['prefix'];

	 // form the filename 
     $File = $prefix.'_frame_'.$_POST['index'].'.svg';	
     $Handle = fopen($File, 'w');

	 // get the data 
	 $in_data = $_POST['data']; 
	
	 // remove back slashes 
	 $in_data = preg_replace("{\\\}","",$in_data);	
	
	 // write and close 
     fwrite($Handle,$in_data);
     fclose($Handle); 
?>