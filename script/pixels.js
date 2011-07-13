$(function(){
	
///// ANIMATION + MATRIX ////////

// matrix property elements 
var $rows_input = $('input[name="rows"]');
var $cols_input = $('input[name="cols"]');
var $height_input = $('input[name="height"]');
var $gap_input = $('input[name="gap"]');
var $time_input = $('input[name="time"]');

// our table for displaying the matrix 
var $matrix_table = $('#matrix-table');

// generate grid form 
$rows_input.bind('change',matrix_edit.generate_matrix);
$cols_input.bind('change',matrix_edit.generate_matrix);
$height_input.bind('change',matrix_edit.generate_matrix);
$gap_input.bind('change',matrix_edit.generate_matrix);

// handle shifting of our entire matrix canvas 
$('#shift-up').bind('click',matrix_edit.shift_matrix);
$('#shift-down').bind('click',matrix_edit.shift_matrix);
$('#shift-left').bind('click',matrix_edit.shift_matrix);
$('#shift-right').bind('click',matrix_edit.shift_matrix);

// clearing our matrix 
$('#clear-screen').bind('click',matrix_edit.clear_frame);

// on animation tab, moving, removing, and duplicating frames 
$('#move-frame-up').bind('click',matrix_edit.move_frame_up).attr('disabled','disabled');
$('#move-frame-down').bind('click',matrix_edit.move_frame_down).attr('disabled','disabled');
$('#remove-frame').bind('click',matrix_edit.remove_frame).attr('disabled','disabled');
$('#duplicate-frame').bind('click',matrix_edit.duplicate_frame).attr('disabled','disabled');

// showing matrix settings 
$('#show-matrix-config').click(function(){	
	$('#matrix-config').dialog('open');	
});

// import and export of animation 
$('#import-frames').bind('click',matrix_edit.import_frames);
$('#export-frames').bind('click',matrix_edit.export_frames);

// import animation start 
$('#import-animation-start').click(function(){
 $('#import-animation-window').dialog('open')
});

// saving a frame 
$('#save-frame').bind('click',matrix_edit.save_frame);

// animation frames 
$('#animate-frames').bind('click',matrix_edit.start_animation).attr('disabled','disabled');

/////// CHARACTERS ////////

// character editor property elements 
var $char_rows = $('input[name="char_rows"]');
var $char_cols = $('input[name="char_cols"]');
var $char_map = $('input[name="char_map"]');

// re-render when rows and cols changes for character 
$char_rows.bind('change',char_edit.render_character_config);
$char_cols.bind('change',char_edit.render_character_config);

// new, edit, remove, and save characters 
$('#add-new-char').click(function(){
	char_edit.clear_edit_char_selection(); 
	char_edit.render_character_config(); 
	$('#character-editor').dialog('open');
});

$('#edit-char').bind('click',char_edit.edit_char).attr('disabled', 'disabled');
$('#remove-char').bind('click',char_edit.remove_char).attr('disabled', 'disabled');
$('#save-character').bind('click',char_edit.save_char);

// importing and exporting character set 
$('#export-charset').bind('click',char_edit.export_character_set); 
$('#import-charset').click(function(){   
	$('#charset-import-window').dialog('open');	
});
$('#import-characters-now').bind('click',char_edit.import_character_set);

// when you click into rect (pixels), toggle it 
$('#character-matrix rect').live('click',function() { 
	svg_helper.toggle_pixel($(this),char_edit.character_edit_data,'toggle');
}); 

/////// automate left scrolling //// 
$('#automate-left-scroll').bind('click',matrix_edit.automate_left_scroll);

// select which input mode we are in 
// set character or toggle 
$('#input-selection').bind('change',function() {
	
	var selected = $('#input-selection option:selected'); 
	
	switch ( selected.val() ) {
		
		case "1": 
			matrix_edit.remove_char_start(); 		
		    $('#character-input').attr('disabled','disabled');
		    $('#paste-characters').attr('disabled','disabled');		
			break;
				
		case "2": 
	    	$('#character-input').removeAttr('disabled');
	    	$('#paste-characters').removeAttr('disabled');
			break;		
	}
}); 

// binding for svg to which edit mode we are in 
$('rect',$matrix_table).live('click',function() {
	
	var selection_mode = $('#input-selection option:selected').val();

	switch ( selection_mode ) {
		
		case "1":
			svg_helper.toggle_pixel($(this),matrix_edit.matrix_table_data,'toggle');
			break; 
		
		case "2":			
			matrix_edit.set_char_start($(this))
			break; 
	}
}); 

// user sets characters into the matrix 
$('#paste-characters').bind('click',matrix_edit.paste_characters);

// set up tabs for tabe select 
$('#tabs').bind('tabsselect',on_tab_selected);

function on_tab_selected (e, ui) {

	switch ( ui.index ) {
		case 0:
			$('#animation-tab-controls').show(); 
			$('#character-tab-controls').hide(); 
			
			break; 
			
		case 1:
			$('#animation-tab-controls').hide(); 
			$('#character-tab-controls').show(); 			
			break; 
	}
};

///// some sauce that enables continuous paint and erase ///// 

// allow group on, off 
$matrix_table.bind('keydown',turn_on);
$matrix_table.bind('mouseenter',matrix_mouse_enter);

function matrix_mouse_enter () {
	
	$matrix_table.focus(); 
	$matrix_table.unbind('mouseenter',matrix_mouse_enter);
	$matrix_table.bind('mouseout',matrix_mouse_out);
}

function matrix_mouse_out () {
	
	$matrix_table.bind('mouseenter',matrix_mouse_enter);
	$matrix_table.unbind('mouseout',matrix_mouse_out);
	$('rect',$matrix_table).die('hover',turn_on_over_hover);	
	$('rect',$matrix_table).die('hover',turn_off_over_hover);	
	$matrix_table.bind('keydown',turn_on)
	$matrix_table.unbind('keyup',turn_off);
}

function turn_off ( e ) {
	
	if ( e.keyCode == 16 ) {		
		$('rect',$matrix_table).die('hover',turn_on_over_hover) 
	} else if ( e.keyCode == 17 ) {		
		$('rect',$matrix_table).die('hover',turn_off_over_hover);		
	}
	$matrix_table.bind('keydown',turn_on)
	$matrix_table.unbind('keyup',turn_off);
};

function turn_on ( e ) {
	
	$matrix_table.unbind('keydown',turn_on)
	$matrix_table.bind('keyup',turn_off);
	
	if ( e.keyCode == 16 ) {		
		$('rect',$matrix_table).live('hover',turn_on_over_hover);		
	} else if ( e.keyCode == 17 ) {		
		$('rect',$matrix_table).live('hover',turn_off_over_hover);		
	}
	
};

function turn_on_over_hover () {
	svg_helper.toggle_pixel($(this),matrix_edit.matrix_table_data,'on');			
};

function turn_off_over_hover () {
	svg_helper.toggle_pixel($(this),matrix_edit.matrix_table_data,'off');
};

// allow group on, off 
var $character_matrix = $('#character-matrix');
$character_matrix.bind('keydown',turn_on_char);
$character_matrix.bind('mouseenter',matrix_mouse_enter_char);

function matrix_mouse_enter_char () {
	
	$character_matrix.focus(); 
	$character_matrix.unbind('mouseenter',matrix_mouse_enter_char);
	$character_matrix.bind('mouseout',matrix_mouse_out_char);
}

function matrix_mouse_out_char () {
	
	$character_matrix.bind('mouseenter',matrix_mouse_enter_char);
	$character_matrix.unbind('mouseout',matrix_mouse_out_char);
	$('rect',$character_matrix).die('hover',turn_on_over_hover_char);	
	$('rect',$character_matrix).die('hover',turn_off_over_hover_char);	
	$character_matrix.bind('keydown',turn_on_char)
	$character_matrix.unbind('keyup',turn_off_char);
	
}


function turn_off_char ( e ) {
	if ( e.keyCode == 16 ) {		
		$('rect',$character_matrix).die('hover',turn_on_over_hover_char) 
	} else if ( e.keyCode == 17 ) {		
		$('rect',$character_matrix).die('hover',turn_off_over_hover_char);		
	}
	$character_matrix.bind('keydown',turn_on_char)
	$character_matrix.unbind('keyup',turn_off_char);
};

function turn_on_char ( e ) {
	
	$character_matrix.unbind('keydown',turn_on_char)
	$character_matrix.bind('keyup',turn_off_char);
	
	if ( e.keyCode == 16 ) {		
		$('rect',$character_matrix).live('hover',turn_on_over_hover_char);		
	} else if ( e.keyCode == 17 ) {		
		$('rect',$character_matrix).live('hover',turn_off_over_hover_char);		
	}
	
};

function turn_on_over_hover_char () {
	svg_helper.toggle_pixel($(this),char_edit.character_edit_data,'on');			
};

function turn_off_over_hover_char () {
	svg_helper.toggle_pixel($(this),char_edit.character_edit_data,'off');
};

////// dialog boxes /////////

// setup dialog boxes for the entire website 
$('#matrix-config').dialog({autoOpen:false}).dialog( "option", "resizable", false ).dialog({ width:220}); 
$('#export-animation-window').dialog({autoOpen:false}).dialog( "option", "resizable", false ).dialog({ width:380}).dialog({modal:true});
$('#import-animation-window').dialog({autoOpen:false}).dialog( "option", "resizable", false ).dialog({ width:380}).dialog({modal:true});
$('#character-editor').dialog({autoOpen:false}).dialog({width:270}).dialog({height:190})
$('#charset-export-window').dialog({autoOpen:false}).dialog( "option", "resizable", false ).dialog({ width:380}).dialog({modal:true});
$('#charset-import-window').dialog({autoOpen:false}).dialog( "option", "resizable", false ).dialog({ width:380}).dialog({modal:true});

////// button decorations ////// 
////// check jQuery UI for codes //// 

$("#shift-up").button({
      icons: {
          primary: "ui-icon-arrowthick-1-n"
      },
      text: false 
}); 

$("#shift-down").button({
      icons: {
          primary: "ui-icon-arrowthick-1-s"
      },
      text: false 
}); 

$("#shift-left").button({
      icons: {
          primary: "ui-icon-arrowthick-1-w"
      },
      text: false 
}); 

$("#shift-right").button({
      icons: {
          primary: "ui-icon-arrowthick-1-e"
      },
      text: false 
}); 

$("#save-frame").button({
      icons: {
          primary: "ui-icon-plusthick"
      },
      text: false 
}); 

$("#show-matrix-config").button({
      icons: {
          primary: "ui-icon-gear"
      },
      text: false 
}); 


// create the tabs for  tabs 
$("#tabs").tabs();

// handle when window is resized 
$(window).bind('resize', function() {
	$("#tabs").css("min-height", ( $(window).height() - 20 ) + "px");
});

// trigger it 
$(window).trigger('resize');

// and hide the character tab controls 
$('#character-tab-controls').hide();

// initial trigger to create first view of grids 
$rows_input.trigger('change');

}); // end ready 