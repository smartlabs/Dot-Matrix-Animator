// these routines are used for interacting with the svg elements within the dom 

var svg_helper = function () {
	
	var ON_COLOR = '#444444'; 
	var OFF_COLOR = '#D9D9D9';

	// private functions and variables 
	var reset_svg_size = function ($obj, width, height) {

		// get the svg object and give it a proper height and width 
		// if you dont do this you wont see anything even though the svg is there 
		var svg = $obj.svg('get')
		var w =  width || $(svg._container).width();
		var h = height || $(svg._container).height();	
		svg.configure({width: w,height:h}); 

		// give the object that contains the svg the proper height and width too 
		var obj = { "width" : w, 
					"height" : h };			
		$obj.css(obj);
	}; 
	
	// return contains public functions 
	return {

		// generates svg for a dom 
		// also resizes it properly to be displayed 
		generate_svg_with_data : function ($which_dom, in_data, height, gap ) {

			// remove if it is there 
			$which_dom.svg('destroy');
			$which_dom.svg();
			svg = $which_dom.svg('get');

			for ( var ii = 0; ii < in_data.rows; ii++ ) {

				// y for this row 
				var current_y = ii * ( height + gap ); 

				for ( var jj = 0; jj < in_data.cols; jj ++ ) {				

					// x for this element 
					var current_x = jj * ( height + gap ); 

					// console.log(in_data.rows + ':'+ in_data.cols +' getting ' + ii + ':' + jj )

					if ( in_data.get(ii,jj) ) {				
						// highlighted and proper color (shade of grey)
						svg.rect(current_x,current_y,height,height,{fill:ON_COLOR,class_:"highlight"}); 					
					} else {
						// our non-highlighted color (light shade of grey )
						svg.rect(current_x,current_y,height,height,{fill:OFF_COLOR}); 	
					}
				}				
			}
			
			// calcualte what is the svg size we need 
			var size_needed = in_data.calculate_size(height,gap);
			
			// reset the size of svg canvas 
			reset_svg_size($which_dom,size_needed.w,size_needed.h);
		}, 
		
		
		// function to toggle pixels on
		toggle_pixel : function ( $pixel, which_data, mode ) {

			// get the index of this element
			// use that to figure out the row and col 
			var index = $pixel.parent().children('rect').index($pixel); 	
			var row = Math.floor(index / which_data.cols); 
			var col = index - ( which_data.cols * row ); 

			if ( mode == 'toggle' ) {
				$pixel.toggleClass("highlight");
				which_data.toggle(row,col);
				if ( $pixel.hasClass("highlight") ) {
					$pixel.attr('fill',ON_COLOR)			
				} else {
					$pixel.attr('fill',OFF_COLOR)
				}
			} else if ( mode == 'off') {
				$pixel.removeClass("highlight");		
				which_data.unset(row,col);
				$pixel.attr('fill',OFF_COLOR)		
			} else if ( mode == 'on' ) {
				$pixel.addClass('highlight');	
				$pixel.attr('fill',ON_COLOR)
				which_data.set(row,col);	
			}
		}

	};

}(); 