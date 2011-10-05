
#Capture.js
##Views for JavaScript

Capture.js is a spiritual successor to [lowpro](https://github.com/danwrong/low-pro-for-jquery). 

Attach an object to an element unobtrusively using Capture. 

With this HTML
	
	<div id="picture">
		<img src="link/to/img/" />
		<a class="delete">Delete picture</a>
	</div>
	
And this JavaScript
	
	var pictureView = Capture.view({
		onclick : {
			'.delete' : function (e) {
				// Will remove #picture
				this.element.remove();
			}
		}
	});

Capture them
	
	$('#picture').capture(pictureView);

The element and view are now captured. A 'click' event triggered on the '.delete' element will cause the '#picture' element to be removed.

*Requires*: jQuery 1.6+  
*Browser support*: IE6+



## API

#### Capture(selector, view) *or* $(selector).capture(view)

Capture an element and view.
	
	var view = Capture('#element', view)

#### Capture.view(viewObject)
Instantiates the object as a capture view.

#### view.element
Reference to the captured element.

#### view.removeEventListeners
Unbinds any listeners attached to the element.

#### view.reattachEventListeners
Reattaches all event listeners. Unbinds existing listeners automatically.

#### view.on[EVENT_TYPE].element
The element property exists inside event listener properties. It captures all events of that type on view.element.

	onclick : {
		element : function (e) {
			// Captures all clicks on this.element
		}
	} 



## The capture interface

Wrapping an object in a Capture view instantiates an new object on each capture. You should define an 'init' function and can define multiple 'onEVENT\_TYPE' objects, where EVENT\_TYPE can be any valid jQuery event (e.g. mouseover) or a custom event. Example;

	Capture.view({
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
	});

## Attaching the same View Controllers to multiple elements

This is generally undesirable behaviour. View Controllers are an overall controller. For example, they shouldn't be used for individual .pictures in a #gallery. Instead, it should capture the #gallery itself.
To prevent this undesired behaviour one element is captured at a time.

Which means when doing this;

	$('.pictures').capture(pictureViewController);
	
Is effectively this;

	$('.pictures').eq(0).capture(pictureViewController);

In some valid instances, you might want to attach the same View Controller to multiple elements. For example, two pagination elements on a page. One at the top and one at the bottom.


Instantiation is automatically handled if the object is wrapped with Capture.view.

	paginationView = Capture.view{{
		// ...
	}};

	$('.pagination').each(function () {
		this.capture(paginationView)
	};

## Other features

As it's just a JavaScript object, this works too;

	function PictureView = function(){
		this.init = function() {};
		this.onclick = {
			'.delete' : function() {
				// Will remove #picture
				this.element.remove();
			}	
		};
	}
	
	var pictureView = new PictureView();
	
	$('#picture').capture(pictureViewController);
	
With the added benefit of being able to instantiate multiple new View Controllers and use prototypal inheritance.