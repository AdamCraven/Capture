/*jslint evil: false, bitwise:false, strict: true, undef: true, white: false, onevar:false, browser:true, plusplus:false */
/*global jQuery, console:true */
/*! 
 *	Capture.js
 *	Copyright 2011 Adam Craven
 *	https://github.com/AdmCrvn/Capture
 */
(function($){
	"use strict";
	
	var nativeBind = Function.prototype.bind;
	var slice = Array.prototype.slice;
	var toString = Object.prototype.toString;
	
	// All properties with prefix of 'on' are treated as event delegates
	var eventMethodPrefix = /^on(.+)/;
	
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
	
	/** USE xeys-description.js as basis of formatting*/
	function setupEventDelegates(viewController) {
		
		var eventDelegate, eventType, method, selector;
		
		var delegateElement = viewController.element;
		
		// Loop through all methods looking for event delegates
		for(method in viewController) {
		   if (viewController.hasOwnProperty(method) && 
				method.match(eventMethodPrefix) && 
				typeof viewController[method] === "object") {
			   // Event to delegate
			   eventDelegate = viewController[method];

			   // e.g. click
			   eventType = method.match(eventMethodPrefix)[1];
			   
			   for(selector in eventDelegate) { 
				   if(eventDelegate.hasOwnProperty(selector)) {	
						// If the selector is the same as the delegateElement
						if(delegateElement.is(selector)) {
							// Attached event to current element
							delegateElement.bind(eventType, bind(eventDelegate[selector], viewController));
						} else {
							// Bind event delegate to the element. Setting the context to the viewController 
							delegateElement.delegate(selector, eventType, bind(eventDelegate[selector], viewController));
						}
				   }
			   }
		   }  
		}
	}
	
	function logError(error) {
		if(console && console.error) {
			console.error(error);
		} else {
			throw new Error(error);
		}
	}
	
	
	function isValid(viewController) {
		if(!viewController) {
			return logError('NO_VIEWCONTROLLER'); // TODO: Describe element it was attached to
		}
		
		if(toString.call(viewController) !== '[object Object]') {
			return logError('VIEWCONTROLLER_MUST_BE_OBJECT');
		}
	}
	
	/**
	 *	Capture loosely attaches a viewController to an element via event delegates.
	 *	@param	{object}	viewController	The viewController which is attached to the element.
	 *	@public
	 */
	$.fn.capture = function(viewController){
		// jQuery object containing element
		var element = this;
		
		// Additional arguments passed
		var optionalArguments;
		
		// No element passed, exit.
	    if(element.length === 0) {
		    return;
		}
		
		isValid.call(this, viewController);
		
		// Create new instance of
		viewController = $.extend({}, viewController);
		
		// Assign element property to viewController
		viewController.element = element;
		
		if(viewController.init) {
			// Any addtional arguments are collated
			optionalArguments = slice.call(arguments, 1);
			
			// Execute init, sending additional arguments
			viewController.init.apply(viewController, optionalArguments);
		}
		
		// Setup event delegates
		setupEventDelegates(viewController);
				
		return viewController;
	};
	

})(jQuery);