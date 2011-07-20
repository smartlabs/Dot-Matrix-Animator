Dot Matrix Animator
====================

This is a web application for simulating/creating dot matrix animation.  To use the this application:

1. [Download](https://github.com/smartlabs/Dot-Matrix-Animator/archives/master) the project from Github. 
2. Unzip the project onto your user's Site directory.  
3. Make sure you have mac web server turned on.  Check this [guide](http://www.macinstruct.com/node/112). 
4. Make sure php is turned on as the application relies on php to convert graphics into svg.  Check this [guide](http://foundationphp.com/tutorials/php_leopard.php).
5. If you intend to export your animation to svg's,  you need to make sure the privileges of your site folder is set to 'Read & Write' for everyone. Do this either by following this [guide](http://docs.info.apple.com/article.html?path=Mac/10.4/en/mh669.html) or use terminal and chmod. 

Online Demo 
-----------

This application is online at [http://www.dotmatrixanimator.com/](http://www.dotmatrixanimator.com/)

* [Sample animation](https://raw.github.com/smartlabs/Dot-Matrix-Animator/master/sample/sample_animation.txt)
* [Sample characters](https://raw.github.com/smartlabs/Dot-Matrix-Animator/master/sample/sample_character.txt)

Enjoy!! 

File Description
----------------

* index.html - Main access page for the application.  Hold all html and markups. 
* sample/sample_character.txt - a sample character library.  Content can be imported into Character tab. 
* sample/sample_animation.txt - a sample alarm clock animation. Content can be important into Animation tab. 
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
* post_svg.php - php script to convert svg content on the application into svg file.  Called when "export svg when animated" is toggled. 
* zip_files.php - php script to zip svg files into zip file. Called when "export svg when animated" is toggled.

Credits 
-------

This project is made possible with the following open source project: 

* [jQuery](http://jquery.com/)
* [jQuery UI](http://jqueryui.com/)
* [jQuery SVG](http://keith-wood.name/svg.html)
* Bram Stein's javascript [Bit-Array](https://github.com/bramstein/bit-array)
* Doug Crawford's [json.js](https://github.com/douglascrockford/JSON-js) 