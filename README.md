Dot Matrix Animatior
====================

This is a web application for simulating/creating dot matrix animation.  To use the this application, unzip the project onto your mac's Site directory.  Make sure php is turned on as the application relies on php code to convert graphics into svg format.  

Files Description 
---------------------

* index.html - Main access page for the application.  Hold all html and markups. 
* library/character_lib.txt - a sample character library.  Content can be imported into Character tab. 
* library/animation_alarm_clock.rtf - a sample alarm clock animation. Content can be important into Animation tab. 
* script/bit-array.js - Bram Stein's javascript implementation of [bit array](https://github.com/bramstein/bit-array).  The underlying data structure for all matrices. 
* script/char_edit.js - Functions that enable character editing on the Character Tab. 
* script/grid-data.js - A grid data represents a matrix on the screen.  Implements functions related to creating, copying, and moving a matrix (and pixels).  Based on the bit-array. 
* script/matrix-edit.js - Funcitons that enable matrix editing on the Animation Tab and animation matrix. 
* script/obj-helper.js - Helper functions for the program.  Right now includes a deep copy routines for cloning data structures. 
* script/pixels.js - Where application starts. Binds all events and initializes jQuery UI. 
* script/svg_helper.js - Helper function used to interact with jQuery SVG. 
* script/json/ - Dough Crawford's [json] class. Used for serializing and deserializing data structures. 
* script/svg/ - [jQuery SVG](http://keith-wood.name/svg.html).  Used for creating each matrix. 
* script/ui/ - [jQuery UI](http://jqueryui.com/). Used skin the screen interface. 
* styles/pixels.css - CSS styles for application. 
* styles/reset.css - resets all styles to give application a clean slate. 
* post_svg.php - php script to convert svg content on the application into svg file.  Called when "export svg when animated" is on inside settings. 

Credits 
-------

This tool is made possible by these fellow open source projects: 

* [jQuery](http://jquery.com/)
* [jQuery UI](http://jqueryui.com/)
* [jQuery SVG](http://keith-wood.name/svg.html)
* Bram Stein's javascript [Bit-Array](https://github.com/bramstein/bit-array)
* Doug Crawford's [json.js](https://github.com/douglascrockford/JSON-js) 