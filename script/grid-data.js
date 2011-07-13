// definition of our data for our grid 
// uses prototype 

// constructor 
function GridData (rows, cols) {

	// this is an int 
	this.cols = cols; 
	this.rows = rows; 

	// javascript numberse are weird 
	// only bottom 32 bits can have bitwise operations, so we go in 32 bit chunks 
	this.ints_needed_per_row = Math.ceil(cols/32); 

	// this is our data 
	this.bitmap = new Array(rows); 		
	
	for ( var ii = 0; ii < rows; ii++ ) {			
		// create a new zero array, avoid shallow copy 
		var zeros =	this.getZeroArray(this.ints_needed_per_row)
		this.bitmap[ii] = new BitArray(zeros); 
	}	
		
};

GridData.prototype.getZeroArray = function ( how_many ) {
	// zero out an array
	// just a helper function 
	var zeros = []; 
	for ( var ii = 0; ii < how_many; ii++ ) {
		zeros[ii] = 0; 
	}
	return zeros; 
};

GridData.prototype.toConsole = function () {
	console.log("-----");
	for ( ii = 0; ii < this.rows; ii++ ) {
		// trim it down to what we need
		var trimmed = this.bitmap[ii].toString().slice(0,this.cols);
		console.log(trimmed); 
	}	
	console.log("-----");
	
};

GridData.prototype.toggle = function ( row, col ) {	
	this.bitmap[row].toggle(col); 		
};

GridData.prototype.set = function ( row, col ) {	
	this.bitmap[row].set(col,true); 		
};

GridData.prototype.unset = function ( row, col ) {	
	this.bitmap[row].set(col,false); 		
};

// retuns you the data for this row and col 
GridData.prototype.get = function ( row, col ) {	
	return this.bitmap[row].get(col);	
};

// functions 
GridData.prototype.shift = function ( dir ) {
	
	var ii; 
	
	switch (dir) {
		
		case 'up':
			// remove first element, push new element to bottom 
			this.bitmap.shift(); 
			this.bitmap.push(new BitArray(this.getZeroArray(this.ints_needed_per_row)));
			break; 
		
		case 'down': 
			// remove last element, push new element to beginning 		
			this.bitmap.pop(); 
			this.bitmap.unshift(new BitArray(this.getZeroArray(this.ints_needed_per_row)));		
			break; 
		
		case 'left': 
			// shift everything to the left
			for ( ii = 0; ii < this.rows; ii++ ) {
				this.bitmap[ii].shift_left(); 
			}
			break; 
		
		case 'right':
			// shift everything to the right 
			for ( ii = 0; ii < this.rows; ii++ ) {
				this.bitmap[ii].shift_right(); 
			}		
			break; 
	}
};

GridData.prototype.copyData = function ( start_row,start_col,data_to_copy ) {
	
	var end_row = start_row + data_to_copy.rows; 
	var end_col = start_col + data_to_copy.cols; 
	var start_col_offset = 0; 
	
	// check if we actually have something to copy 
	if ( start_row > this.rows ) return; 
	if ( end_col < 0 ) return; 
	
	// make these work better 	
	if ( end_row > this.rows ) end_row = this.rows; 
	if ( end_col > this.cols ) end_col = this.cols;
	
	// make sure this is within reasonable range 
	if ( start_col < 0 ) {
		// set the offset, this allows us to write half characters at the beginning of the buffer 
		start_col_offset = start_col * -1;  		
		start_col = 0;
	} 
	
	// make sure these makes sense 
	if ( end_col > this.cols ) end_col = this.cols; 
	if ( start_row < 0 ) start_row = 0; 
	if ( end_row > this.cols ) end_row = this.rows; 	
	
	for ( var ii = start_row; ii < end_row; ii++ ) {
		var copy_row = ii - start_row; 		
		for ( var jj = start_col; jj < end_col; jj++ ) {
			
			var copy_col = jj - start_col; 				
			this.bitmap[ii].set(jj,data_to_copy.get(copy_row,copy_col+start_col_offset))
		}
	}
	
	
}

// calcuale the pixel dimensions needed given a pixel dimension and a gap 
GridData.prototype.calculate_size = function ( dimension, gap ) {
	
	var object = new Object(); 
	
	object.w = this.cols * ( dimension + gap); 
	object.h = this.rows * ( dimension + gap); 
	
	return object; 
};
