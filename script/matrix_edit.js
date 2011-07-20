var matrix_edit = function () {
	
	///// PRIVATE //////
	
	// form elements 
	var $rows_input = $('input[name="rows"]');	
	var $cols_input = $('input[name="cols"]');
	var $height_input = $('input[name="height"]');
	var $gap_input = $('input[name="gap"]');
	var $time_input = $('input[name="time"]');
	var $export_prefix = $('input[name="prefix"]');	
		
	// our table for displaying the matrix 
	var $matrix_table = $('#matrix-table');
		
	// what is in our 
	var $animation_frames = $('#animation-select-frames'); 
	
	// if we are exporting svg 
	var export_svg = false; 

	// svg index for export 
	var svg_index = 0;
	
	// what is our animation time 
	var animation_time = 0; 
	
	// what is our selected animation frame 
	var $selected_frame = null;
	
	// time out for animation 
	var animation_timeout = null; 
	
	// where character set/animation is starting 
	var $char_start_pixel = null; 
	
	// check if animation button needs to be enabled or disabled 
	var toggle_animation_button_status = function () {
		
		if ( $('li',$animation_frames).length == 0 ) {
			$('#animate-frames').attr('disabled','disabled');
		} else {
			$('#animate-frames').removeAttr('disabled');
		}
		
	}

	// disable these buttons when we dont have a selection 
	var disable_button_options = function () {
		$('#move-frame-up').attr('disabled','disabled');
		$('#move-frame-down').attr('disabled','disabled');
		$('#remove-frame').attr('disabled','disabled');
		$('#duplicate-frame').attr('disabled','disabled');
	}
	
	// disable these buttons when we dont have a selection 
	var enable_button_options = function () {
		$('#move-frame-up').removeAttr('disabled');
		$('#move-frame-down').removeAttr('disabled');
		$('#remove-frame').removeAttr('disabled');
		$('#duplicate-frame').removeAttr('disabled');
	}
	
	// what happens when we click on a frame in the animation sequence 
	var toggle_frame_selection  = function () {

		// clear this 
		$selected_frame = null; 

		// check if we are just turning off selection from this one 
		if ( $(this).hasClass('selected') ) {		

			$(this).removeClass('selected');		

			// createa another matrix data for this screen
			// this breaks the link from selected to screen 
			// so you dont update teh animation frame when it is deselected 
			matrix_edit.matrix_table_data = obj_helper.deep_copy($(this).data('matrix_data'));

			// disable selections
			disable_button_options(); 

			return; 
		} 

		// if not, we keep going, remove all the selected, and turn the selected one on
		$('li.selected',$animation_frames).removeClass('selected');
		$(this).addClass('selected');

		// save this 
		$selected_frame = $(this);

		// map our data to matrix's display 
		matrix_edit.matrix_table_data = obj_helper.deep_copy($(this).data('matrix_data')); 

		// render the matrix 
		svg_helper.generate_svg_with_data($matrix_table,matrix_edit.matrix_table_data,parseFloat($height_input.val()),parseFloat($gap_input.val()));	
		
		// enable these selections since we have something selected now 
		enable_button_options(); 

	};
	
	// create animation view 
	var create_frame_view_from_data = function ( in_data ) {

		var dimension = 1.5; 
		var gap = 0.5; 

		// create a new frame item 
		var $new_frame = $('<li class="ui-widget-content"></span></li>');

		// deep copy a new table data, need to save this to the li element 
		var cur_matrix_data = obj_helper.deep_copy(in_data);

		// craeate a svg matrix for this frame object
		// use small pixel size and gap 
		svg_helper.generate_svg_with_data($new_frame,cur_matrix_data,dimension,gap);	

		// attach the matrix data to matrix_data field of this new frame 
		$new_frame.data('matrix_data',cur_matrix_data);

		// bind selection to this thing 
		// live didnt work for some reason 
		$new_frame.bind('click',toggle_frame_selection);

		return $new_frame; 
	};
	
	// animate a single frame 
	var animate_frame = function ( $obj ) {
		$obj.addClass("animating");

		copy_of_data = obj_helper.deep_copy($obj.data('matrix_data'));

		svg_helper.generate_svg_with_data($matrix_table,copy_of_data,parseFloat($height_input.val()),parseFloat($gap_input.val()));			

		// if we are exporting, we need to call this php script 
		if ( export_svg ) {
			write_matrix_to_svg(); 
		}

		var $next_obj = $obj.next('li'); 

		if ( $next_obj.length != 0 ) {		

			// set the next one up 
			setTimeout(function(){turn_off_frame($obj);},animate_time);		
			animation_timeout = setTimeout(function(){animate_frame($next_obj);},animate_time);

		} else {

			// just turn off this one 
			setTimeout(function(){turn_off_frame($obj);},animate_time);		

			// we are done, no more set time out 
			animation_timeout = null 
			
			// if we exporte svg, we want to send this to a zip now 
			if ( export_svg ) {
				zip_svg_and_download(); 
			}
			
		}
	};
	
	var turn_off_frame = function ( $obj ) {
		$obj.removeClass("animating");	
	};
	
	var copy_arrows = function ( in_data ) {

		var left_arrow_data = char_edit.character_dictionary['<'];
		var right_arrow_data = char_edit.character_dictionary['>'];

		if ( left_arrow_data != null && right_arrow_data != null ) {

			var start_right_col = in_data.cols - right_arrow_data.cols; 

			in_data.copyData(0,0,left_arrow_data);
			in_data.copyData(0,start_right_col,right_arrow_data);
		}
	};
	
	var zero_pad = function (num,count) {
		var numZeropad = num + '';
		while(numZeropad.length < count) {
			numZeropad = "0" + numZeropad;
		}
		return numZeropad;
	};

	var write_matrix_to_svg = function () {

		svg_index++; 

		// get the svg and export data  
		svg = $matrix_table.svg('get'); 	
		var export_data = "index=" + zero_pad(svg_index,3) + "&data=" + svg.toSVG(); 

		// see if we need to set the prefix 
		var prefix =  $export_prefix.val();
		if ( prefix ) {
			export_data += "&prefix=" + prefix; 
		} else {
			export_data += "&prefix=export"			
		}

		// now write this 
		$.ajax({
	         type: "POST",
	         url: "post_svg.php",    
	         data: export_data,
	         success: function(msg){ }
	    });
	};
	
	// zip all the svg content and download it 
	var zip_svg_and_download = function () {
		
		// give it the normal name 
		var export_data = "prefix=export";
				
		// see if we need to set the prefix 
		var prefix = $export_prefix.val();
		if ( prefix ) {
			export_data = "prefix=" + prefix; 
		} 
		
		// now write this 
		$.ajax({
	         type: "POST",
	         url: "zip_files.php",    
	         data: export_data,
	         success: function(resp){
	         	// optional for forcing download when zip is done 
	         	// uncomment the echo portion of zip_files.php if you want this on
	         	// window.location.href = resp; 
	         }
	    });
		
	}
	
	// used for creating closure function, for set time out 
	var create_left_scroll_closure = function (i,c,r) {
	    return function() { fill_left_scroll(i,c,r) };
	};
	
	var fill_left_scroll = function ( value_of_input, current_col, current_row ) {

		var rows = parseInt($rows_input.val()); 
		var cols = parseInt($cols_input.val()); 
		var h = parseFloat($height_input.val()); 
		var g = parseFloat($gap_input.val()); 
		
		// create our grid data 
		var temp_table_data = new GridData(rows,cols);

		var temp_col = current_col; 
		
		// flag if we wrote anything at all 
		var write_something = false; 

		// go through each character to see if we need to fill them 
		for ( var ii = 0; ii < value_of_input.length; ii++ ) {

			// dont need to do this anymore once we reach over to border of the display 
			if ( temp_col > matrix_edit.matrix_table_data.cols ) break; 

			// get the current character 
			var current_char = value_of_input[ii];			
			var character_data = char_edit.character_dictionary[current_char]; 

			// dont bother with this one since it is off the display border
			// but we need to increment the temp col 
			if ( ( temp_col + character_data.cols ) < 0 ) {
				temp_col += character_data.cols; 
				continue; 
			}
			
			// we have something to copy 
			if ( character_data != null ) {

				// copy the data with correct offset 
				temp_table_data.copyData(current_row,temp_col,character_data); 			

				// prepare for next character, this is where we start next 
				temp_col = temp_col + character_data.cols; 
				
				// flag that we wrote something 
				wrote_something = true; 
			}
		}

		var $new_frame = create_frame_view_from_data(temp_table_data);

		// add in the sort frame 
		$animation_frames.append($new_frame);
		
	};
	
	// returns the total column a string will take 
	var length_of_string = function ( string ) {
		
		var total = 0; 
		
		for ( var ii = 0; ii < string.length; ii++ ) {
			
			// get the current character 
			var current_char = string[ii];			
			var character_data = char_edit.character_dictionary[current_char]
			 
			if ( character_data != null ) total += character_data.cols; 
			
		}
		
		return total; 
		
	};
	

	

	///// PUBLIC /////////////

	return {
		
		// what our matrix table holds 
		matrix_table_data : null, 		
		
		// when grid is clicked, take the values and generate the table needed for the display  
		generate_matrix : function () {	
			
			var rows = parseInt($rows_input.val()); 
			var cols = parseInt($cols_input.val()); 
			var h = parseFloat($height_input.val()); 
			var g = parseFloat($gap_input.val()); 
			
			// console.log("rows:" + rows + " cols:" + cols + " h:" + h + " g:" + g);
			
			// create our grid data 
			var temp_table_data = new GridData(rows,cols);
		
			// copy the old data if we have one 
			if ( matrix_edit.matrix_table_data ) {
				temp_table_data.copyData(0,0,matrix_edit.matrix_table_data); 
			}
			
			matrix_edit.matrix_table_data = temp_table_data; 
			
			svg_helper.generate_svg_with_data($matrix_table,matrix_edit.matrix_table_data,h,g);
			
		}, 
		
		// shift the entire matrix 
		shift_matrix : function () {
			
			// split this up and give the direction
			var dir = $(this).attr('id').split('-');	
			matrix_edit.matrix_table_data.shift(dir[1]);

			// render it from data 
			svg_helper.generate_svg_with_data($matrix_table,matrix_edit.matrix_table_data,parseFloat($height_input.val()),parseFloat($gap_input.val()))			
			
		}, 
		
		// clears the entire frame buffer 
		clear_frame: function () {
			
			// get the row and cols info 			
			var rows = parseInt($rows_input.val()); 
			var cols = parseInt($cols_input.val()); 
			var h = parseFloat($height_input.val()); 
			var g = parseFloat($gap_input.val());
					
			// replace our data with a new blank grid data 		
			matrix_edit.matrix_table_data = new GridData(rows,cols);

			// now populate the screen 
			svg_helper.generate_svg_with_data($matrix_table,matrix_edit.matrix_table_data,h,g);
			
		},
		
		// save a frame to animation grid 
		save_frame : function () {
			
			var $new_frame = create_frame_view_from_data(matrix_edit.matrix_table_data);

			if ( $selected_frame ) {

				// replace the old frame with new one 
				$new_frame.attr('class',$selected_frame.attr('class'));

				$selected_frame.replaceWith($new_frame);

				$selected_frame = $new_frame; 
				
			} else {

				// add in the sort frame 
				$animation_frames.append($new_frame);
			}

			// check if animation button needs to be enabled/disabled 
			toggle_animation_button_status(); 
		},
		
		// animate the frames we have 
		start_animation : function () {
			
			// remove the character start pixel first 
			matrix_edit.remove_char_start(); 
			
			if ( animation_timeout != null ) {				
				clearTimeout(animation_timeout);
				animation_timeout = null; 	
				return; 			
			}
			
			// remove the selected highlight 
			if ( $selected_frame ) {		
				$selected_frame.removeClass('selected');
				$selected_frame = null; 	
				
				// disable the remove, duplicate, etc etc buttons 
				disable_button_options(); 				
			}

			export_svg = $('#export-svg').is(':checked');
			if ( export_svg ) svg_index = 0; 

			animate_time = parseInt($time_input.val()); 

			var $first_frame = $('li:eq(0)',$animation_frames);

			animation_timeout = setTimeout(function(){animate_frame($first_frame);},animate_time);
			
		},		
		
		// move frame up, down, left right 
		move_frame_up : function () {

			var $selected_frame = $('li.selected',$animation_frames)
			var $prev = $selected_frame.prev('li');	

			// check if we actually found the object
			if ( $prev.length != 0 ) {
				// detach and insert before the object that was ahead of us 
				$selected_frame.detach(); 		
				$prev.before($selected_frame);	
			}
		}, 

		move_frame_down : function () {

			var $selected_frame = $('li.selected',$animation_frames)
			var $next = $selected_frame.next('li');	

			// check if we actually found the object
			if ( $next.length != 0 ) {
				// detatch and insert after the object that was behind us 
				$selected_frame.detach(); 
				$next.after($selected_frame);	
			}	
		}, 

		remove_frame : function () {
			// remove the selected frame 
			$('li.selected',$animation_frames).remove(); 
			
			// no more selected frame 
			$selected_frame = null; 
			
			// whatever we selected is removed, so disable all options 
			disable_button_options(); 
			
			// check if animation button needs to be enabled/disabled 
			toggle_animation_button_status(); 
		},

		duplicate_frame : function () {

			// select the selected frame
			$selected_frame = $('li.selected',$animation_frames);

			// get the data 
			var data = $selected_frame.data('matrix_data');

			// duplicate the frame, insert it after our selected one 
			var $new_frame = create_frame_view_from_data(data); 
			$selected_frame.after($new_frame);

		}, 
		
		// import and export frames 
		export_frames : function() {

			$('#export-animation-window').dialog('open');	

			var data_array = new Array(); 
			
			$('li',$animation_frames).each( function(index) {		
				// grab the data for this frame 
				var matrix_data = $(this).data('matrix_data');		
				data_array.push(matrix_data);
			});
			var object_json = JSON.stringify(data_array);
			$('#export-animation-window textarea').val(object_json)
		}, 
		
		import_frames : function () {

			$animation_frames.empty(); 

			var frames_data = JSON.parse($('#import-animation-window textarea').val());

			for ( var ii=0; ii < frames_data.length; ii++ ) {

				var this_data = frames_data[ii]; 

				// get the prototypes back for this data structure 
				this_data.__proto__ = new GridData();

				for ( var jj = 0; jj < this_data.bitmap.length; jj++ ) {			
					// as well as this datastructure 
					this_data.bitmap[jj].__proto__ = new BitArray(); 			
				}

				// create the new view 
				var $new_frame = create_frame_view_from_data(this_data);

				// add it to the animation frames 
				$animation_frames.append($new_frame);	
			}
		},		
		
		
		// set character start pixel 		
		set_char_start : function ( $obj ) {	
			matrix_edit.remove_char_start(); 		
		    $char_start_pixel = $obj;				
		    $char_start_pixel.toggleClass("selected");		
		},
		
		// remove it 
		remove_char_start : function () {
		 	if ( $char_start_pixel ) {
				$char_start_pixel.removeClass("selected");
				$char_start_pixel = null; 
			}
		},

		// paste characters into matrix, from where char_start_pixel is at 
		paste_characters : function () {

			var value_of_input = $('#character-input').val();

			// get the rows and index of this thing if it is selected 
			if ( $char_start_pixel.length == 1 ) {

				var index = $char_start_pixel.parent().children('rect').index($char_start_pixel); 	
				var row = Math.floor(index / matrix_edit.matrix_table_data.cols); 
				var col = index - ( matrix_edit.matrix_table_data.cols * row );

				for ( var ii = 0; ii < value_of_input.length; ii++ ) {

					if ( col > matrix_edit.matrix_table_data.cols ) break; 

					var current_char = value_of_input[ii];			
					var character_data = char_edit.character_dictionary[current_char]; 

					if ( character_data != null ) {

						// copy the data 
						matrix_edit.matrix_table_data.copyData(row,col,character_data); 			

						// prepare for next 
						col = col + character_data.cols; 
					}
				}

				// re-render it from bitmap 
				svg_helper.generate_svg_with_data($matrix_table,matrix_edit.matrix_table_data,parseFloat($height_input.val()),parseFloat($gap_input.val()));
			}

		},
		
		
		// automatically turn on left scroll 
		automate_left_scroll : function () {

			// check that we actually have something to write 
			if ( $char_start_pixel == null ) return; 

			// get the rows and index of this thing if it is selected 
			if ( $char_start_pixel.length == 1 ) {

				var value_of_input = $('#character-input').val();
				// where did we press 
				var index = $char_start_pixel.parent().children('rect').index($char_start_pixel); 	
				// get the row of the character 
				var row = Math.floor(index / matrix_edit.matrix_table_data.cols); 
				
				// get the starting col of the string
				var col = index - ( matrix_edit.matrix_table_data.cols * row );
				
				// get how long the text is 
				var total_length = length_of_string(value_of_input);

				// create closure functions 
				var funcs = []; 
				for ( var ii = 0; ii < ( total_length + col); ii++ ) {				
					funcs[ii] = create_left_scroll_closure(value_of_input,col-ii,row)
				}

				// now run the functions 
				for ( var ii = 0; ii < ( total_length + col); ii++ ) {									
					setTimeout(funcs[ii],ii*100)					
				}				

				// finally toggle the animation button 
				setTimeout(toggle_animation_button_status,ii*100); 
			}
			
		},
	
	};

}(); 