
#Capture.js
##View Controllers for jQuery

Attach an object to an element unobtrusively using Capture. 

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
	
Will link an element with it's view controller and capture all clicks on the that happen on the '.delete' selector



### Documentation

#### Properties and methods of a view

##### element	- *view.element*:
Reference to the captured element.

	this.element;

##### removeEventListeners - *view.removeEventListeners()*:
Unbinds any listeners attached.

	this.removeEventListeners();

##### reattachEventListeners - *view.reattachEventListeners()*:
Reattaches all event listeners. Unbinds existing listeners automatically.

	this.reattachEventListeners();

##### element - *view.onEVENT.element*
The element property exists inside event listener properties. It captures all events of that type on this.element.

	onclick : {
		element : function (e) {
			// Captures all clicks on this.element
		}
	} 



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
	
You can also wrap the object in a capture view. This instantiates a new object every time it is called and also inherits capture view functions from the view class.

	$.capture.view({
		init : function(options, moreOptions) {
			// The init function is exectued on capture, before event delegates have been assigned
		},
		onclick : {
			element : function(e) {
				// Will capture any 'click' events on this.element
			}
		}
	});


#### Attaching the same View Controllers to multiple elements

This is generally undesirable behaviour. View Controllers are an overall controller. They shouldn't be used for individual .pictures in a #gallery. Instead, it should capture the #gallery itself because it is much faster and less heavy on memory.

To prevent this undesired behaviour one element is captured at a time.

Which means when doing this;

	$('.pictures').capture(pictureViewController);
	
It is effectively this;

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
	
However, this is automatically handled if the ViewController is an instance of capture.view.

	paginationViewController = $.capture.view{{
		// ...
	}};

	$('.pagination').each(function() {
		this.capture(paginationViewController)
	};

#### Other features

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