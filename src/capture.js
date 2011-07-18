/*jslint evil: false, bitwise:false, strict: true, undef: true, white: false, onevar:false, browser:true, plusplus:false */
/*global jQuery */
(function($){
	"use strict";
	
	var nativeBind = Function.prototype.bind;
	var slice = Array.prototype.slice;
	
	/**
	 *	ECMAScript 5 bind method.
	 *	Uses native bind if supported or passes to jQuery proxy.
	 *	
	 *	@param	{function}	fn		Function to bind.
	 *	@param	{object}	context Scope in which the function is bound.
	 */
	function bind(fn, context) {
		if (fn.bind === nativeBind && nativeBind) {
			return nativeBind.apply(fn, slice.call(arguments, 1));
		}
		return $.proxy(fn, context);
	}

	/**
	 *	Capture loosely attaches a viewController to an element via event delegates.
	 *	@param	{object}	viewController	The viewController which is attached to the element.
	 *	@public
	 */
	$.fn.capture = function(viewController){
		if(!viewController) {
			throw 'A viewController must be passed';
		}

		var eventDelegate, eventType;

		// The jQuery element the viewController is bound unto
		var $element = this;

		// All methods with prefix of 'on' are treated as event delegates
		var eventMethodPrefix = /^on(.+)/;
		
		// Create new instance of
		viewController = $.extend({}, viewController);

		// Ensure element is passed as a property of the viewController
		viewController.element = $element;
		
		// Loop through all methods looking for event delegates
		for(var method in viewController) {
		   if (viewController.hasOwnProperty(method) && method.match(eventMethodPrefix) && typeof viewController[method] === "object") { 
			   // Event to delegate
			   eventDelegate = viewController[method];
			   
			   // e.g. click
			   eventType = method.match(/^on(.+)/)[1];
			   
			   for(var selector in eventDelegate) { 
				   if(eventDelegate.hasOwnProperty(selector)) {
					   // Bind event handler to the element. Setting the context to the viewController 
					   $element.delegate(selector, eventType, bind(eventDelegate[selector], viewController));
				   }
			   }
		   }  
		}

		if(viewController.init) {
			// Any addtional arguments are collated
			var additionalArguments = slice.call(arguments, 1);
			
			// Execute init
			viewController.init.apply(viewController, additionalArguments);
		}
				
		return viewController;
	};

})(jQuery);