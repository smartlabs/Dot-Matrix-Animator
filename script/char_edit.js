// functions used to implement editing of characters 

var char_edit = function () {
	
	// private functions 

	// these are the input fields we care about 
	var $char_rows = $('input[name="char_rows"]');
	var $char_cols = $('input[name="char_cols"]');
	var $height_input = $('input[name="height"]');
	var $gap_input = $('input[name="gap"]');
	var $char_map = $('input[name="char_map"]');
	
	var $selected_edit_char = null; 
	
	
	var CHAR_DIMENSION = 1.5; 
	var CHAR_GAP = 0.5; 
	
	// PRIVATE FUNCTIONS // 
	
	// create character from out data 
	// this is where the html is generated 
	var create_char_view_from_data = function ( for_char, char_data ) {

		// create a new frame item 
		var $new_frame = $('<li class="character"></li>');
		$new_frame.attr("char_map",for_char)
		// show character in our character set 
		// $new_frame.append("<span>" + for_char + "</span>")

		// generate the new characer frame
		svg_helper.generate_svg_with_data($new_frame,char_data,CHAR_DIMENSION,CHAR_GAP); 

		// attach the matrix data to matrix_data field of this new frame 
		$new_frame.data('matrix_data',char_data);
		$new_frame.data('character',for_char);

		$new_frame.bind('click',char_edit.toggle_char_view_selection)

		return $new_frame; 
	};
	
	// return contains PUBLIC FUNCTIONS //  
	
	return {
		
		// this is our character dictionary 
		character_dictionary : new Object(), 
		
		// the data we are editing 
		character_edit_data : null, 		
		
		// render the character configuration view 
		render_character_config : function () {

			var rows = parseInt($char_rows.val()); 
			var cols = parseInt($char_cols.val()); 
			var h = parseInt($height_input.val()); 
			var g = parseInt($gap_input.val()); 

			// create our grid data 
			var temp_char_data = new GridData(rows,cols);

			// copy the old data if we have one 
			if ( char_edit.character_edit_data ) {
				temp_char_data.copyData(0,0,char_edit.character_edit_data); 
			}

			char_edit.character_edit_data = temp_char_data;
			svg_helper.generate_svg_with_data($('#character-matrix'),char_edit.character_edit_data,h,g);

		}, 
		
		// remove a character 
		remove_char : function () {
			
			if ( $selected_edit_char == null ) return; 

			if ( $selected_edit_char.length == 1 ) {

				// remove it from our dictionary and remove from dom 
				var char_map = $selected_edit_char.attr("char_map"); 
				char_edit.character_dictionary[char_map] = null; 
				$selected_edit_char.remove();		
			}

			char_edit.clear_edit_char_selection(); 	
		},
		
		// edit a character 
		edit_char : function () {
			if ( $selected_edit_char != null  ) {

				var temp_data = obj_helper.deep_copy($selected_edit_char.data('matrix_data')); 

				var char_mapping = $selected_edit_char.attr('char_map')
				var rows = temp_data.rows; 
				var cols = temp_data.cols; 

				$char_rows.val(rows);
				$char_cols.val(cols);
				$char_map.val(char_mapping);

				// this order is important, dont chang
				char_edit.character_edit_data = temp_data;

				var h = parseInt($height_input.val());
				var g = parseInt($gap_input.val());

				svg_helper.generate_svg_with_data($('#character-matrix'),char_edit.character_edit_data,h,g); 

				$('#character-editor').dialog('open');
			}
		},
		
		save_char : function () {
			
			var char_mapping = $char_map.val(); 
			// deep copy a new table data, need to save this to the li element 
			var cur_char_data = obj_helper.deep_copy(char_edit.character_edit_data);

			var new_char = create_char_view_from_data(char_mapping,cur_char_data); 

			// save our character in our dictionary 
			char_edit.character_dictionary[char_mapping] = cur_char_data; 

			// if we have a selected char, we are replacing it with something else 
			if ( $selected_edit_char )  {

				if ( $selected_edit_char.attr('char_map') == char_mapping ) {

					// copy all the class 
					new_char.attr('class',$selected_edit_char.attr('class'));

					// assign new selection 
					$selected_edit_char.replaceWith(new_char);

					// reassign the selection 
					$selected_edit_char = new_char; 

					// exit 
					return; 
				} 
			} 

			var $existing_char_frame = $('#character-set-columns li[char_map="'+ char_mapping + '"]');

			// check if we want to do a replace or an append
			// replace if there is an existing one
			// append if we dont have it already 
			if ( $existing_char_frame.length == 1 ) {
				$existing_char_frame.replaceWith(new_char);
			} else {		
				$('#character-set-columns').append(new_char);

			}
			
		},
		
		// toggle the char selection 
		toggle_char_view_selection : function () {

			if ( $(this).hasClass("selected") ) {		

				char_edit.clear_edit_char_selection(); 

				// disable the buttons for removing and editing character if none is selected 
				$('#edit-char').attr('disabled', 'disabled');
				$('#remove-char').attr('disabled', 'disabled');

			} else {

				// clear our old selections first 
				char_edit.clear_edit_char_selection();

				// add our selected 
				$(this).addClass("selected");	
				$selected_edit_char = $(this);

				// disable the buttons for removing and editing character if none is selected 
				$('#edit-char').removeAttr('disabled');
				$('#remove-char').removeAttr('disabled');
			}

		}, 

		// clear the selection 
		clear_edit_char_selection : function () {
			if ( $selected_edit_char != null ) {
				$selected_edit_char.removeClass("selected");
				$selected_edit_char = null; 
			}		
		},
		
		export_character_set : function () {						
			$('#charset-export-window').dialog('open');	

			var object_json = JSON.stringify(char_edit.character_dictionary);
			$('#charset-export-window textarea').val(object_json)	
		},
		
		
		import_character_set : function () {

			var charset_data = JSON.parse($('#charset-import-window textarea').val());
			
			// remove everything under character set 
			$('#character-set-columns').empty(); 

			// create a new dictionary object
			char_edit.character_dictionary = new Object(); 

			// loop through everythign and create our view 
			// as well as update our dictionary 
			for ( var key in charset_data ) {

				var this_char_data = charset_data[key]; 

				// get the prototypes back for this data structure 
				this_char_data.__proto__ = new GridData();

				for ( var jj = 0; jj < this_char_data.bitmap.length; jj++ ) {			
					// as well as this datastructure 
					this_char_data.bitmap[jj].__proto__ = new BitArray(); 			
				}

				// create the new view 
				var $new_char = create_char_view_from_data(key,this_char_data);
				$new_char.attr("char_map",key)

				char_edit.character_dictionary[key] = this_char_data; 

				// add it to the animation frames 
				$('#character-set-columns').append($new_char); 	
			} 	
		}, 

	
	};

}(); 