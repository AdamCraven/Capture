
#WORK IN PROGRESS - 2011-07-17

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
				this.element.remove();
			}
		}
	}
	
	$('#picture').capture(pictureViewController);
	
Will link an element with it's view controller.
