
#Capture.js
##View Controllers for jQuery

v0.6.0

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

As it's just a JavaScript object, this works too;

	function PictureViewController = function(){
		this.init = function() {};
		this.onclick = {
			'.delete' : function() {
				// Will remove #picture
				this.element.remove();
			}	
		};
	}
	
	var pictureViewController = new PictureViewController();
	
	$('#picture').capture(pictureViewController);
	
With the added benefit of being able to instantiate multiple new View Controllers and use prototypal inheritance.


### Documentation

#### The capture interface

The interface isn't forced in capture. To create an object that works with capture you can define an 'init' function and multiple 'onEVENT\_TYPE' objects, where EVENT\_TYPE can be any valid jQuery event (e.g. mouseover) or a custom event. Example;

	{
		init : function(options, moreOptions) {
			// The init function is exectued on capture, before event delegates have been assigned
		},
		onclick : {
			element : function(e) {
				// Will capture any 'click' events on this.element
			},
			'.selector' : function(e) {
				// Will capture any 'click' events on this.element.find('.selector');
			}
		},
		onmycustomevent: {
			'.selector' : function(e) {
				// Will capture any 'mycustomevent' events on this.element.find('.selector');
			}
		}
	};


#### Attaching the same View Controllers to multiple elements

This is generally undesirable behaviour. View Controllers are an overall controller. For example, they shouldn't be used for individual .pictures in a #gallery. Instead, it should capture the #gallery itself. It is much faster and less heavy on memory.

To prevent this, only one element can be captured at a time to prevent the same object being shared across two elements.

When doing this;

	$('.pictures').capture(pictureViewController);
	
It is really;

	$('.pictures').eq(0).capture(pictureViewController);

In some valid instances, you might want to attach the same View Controller to multiple elements. For example, two pagination elements on a page. One at the top and one at the bottom.

You must instantiate a new View Controller for each. If you do not, the 'this.element' will always point to the last one bound in the View Controller and changes to the variables will affect them both.

	// Do not do this
	$('.pagination').each(function() {
		this.capture(paginationViewController)
	};
	
	// This is correct
	$('.pagination').each(function() {
		this.capture(new PaginationViewController)
	};
	

#Todo;

  * Object-oriented style function call	$.capture('el', vc);
  * Unbinding
  * Maybe?? Force the capture interface by wrapping the object with; $.capture.viewController(//Object here)