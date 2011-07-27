
#WORK IN PROGRESS - 2011-07-21

##Capture - View Controllers for jQuery

Attach an object to an element seamlessly using Capture.

With this HTML
	
	<div id="picture">
		<img src="link/to/img/" />
		<a class="delete">Delete picture</a>
	</div>
	
And this JavaScript
	
	var pictureViewController = {
		init : function(){},
		onclick : {
			'.delete' : function() {
				// Will remove #picture
				this.element.remove();
			}
		}
	}
	
	$('#picture').capture(pictureViewController);
	
Will link an element with it's view controller.

#Todo;

  * Inheritance - Like this? $('el').capture(vc).prototypeIs({});
  * Object-oriented style function call	$.capture('el', vc);
  * Unbinding
  * Element delegate without the need to supply element selector if just need one delegate.

#Done;

  * Support for multiple elements
