// helper functions used by the matrix code

var obj_helper = function () {

	return {
	
		// deep copy function 
		// copied everything of the object without creating duplicate reference 
		deep_copy : function (obj) {
			
		  if (typeof obj == 'object') {
			if ($.isArray(obj)) {
			  var l = obj.length;
			  var r = new Array(l);
			  for (var i = 0; i < l; i++) {
				r[i] = obj_helper.deep_copy(obj[i]);
			  }
			  return r;
			} else {
			  var r = {};
			  r.prototype = obj.prototype;
			  for (var k in obj) {
				r[k] = obj_helper.deep_copy(obj[k]);
			  }
			  return r;
			}
		  }
		  return obj;
		}, 
	};

}(); 