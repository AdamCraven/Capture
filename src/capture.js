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
	 *	Native ECMAScript 5 bind if supported or passes to jQuery proxy.
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
	
	function attachEventDelegates(viewController) {
		var eventDelegate;
		var eventType;
		var method;
		var selector;
		var listenerElement = viewController.element;
		var delegateFn;
		
		// Loop through all methods looking for event delegates
		for(method in viewController) {
		   if (viewController.hasOwnProperty(method) && method.match(eventMethodPrefix) && typeof viewController[method] === "object") {
			   // Event to delegate
			   eventDelegate = viewController[method];

			   // e.g. click
			   eventType = method.match(eventMethodPrefix)[1];
			   
			   for(selector in eventDelegate) { 
				   if(eventDelegate.hasOwnProperty(selector)) { 
						delegateFn = eventDelegate[selector];
						
						// If the selector is the same as the listenerElement
						// Or using special 'element' property
						if(listenerElement.is(selector) || delegateFn === eventDelegate.element) {
							// Attach event to current element
							// RADAR: What about selector changes on parent element?
							listenerElement.bind(eventType, bind(delegateFn, viewController));
						} else {
							// Bind event delegate to the element. Setting the context to the viewController 
							listenerElement.delegate(selector, eventType, bind(delegateFn, viewController));
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
	
	function validate(viewController) {
		if(!viewController) {
			return logError('NO_VIEWCONTROLLER'); // TODO: Describe element it was attached to
		}
		
		if(toString.call(viewController) !== '[object Object]') {
			return logError('VIEWCONTROLLER_MUST_BE_OBJECT');
		}
	}
	
	function newInstance(ViewController) {
		return $.extend(true, {}, ViewController);
	}
	
	function initialise($element, viewController, optionalArgs) {
		// Assign element property to instance
		viewController.element = $element;
		
		if(viewController.init) {
			// Execute init, sending additional arguments
			viewController.init.apply(viewController, optionalArgs);
		}
	}
	
	function connectViewController($element, ViewController, optionalArgs) {		
		var instance = newInstance(ViewController);
		
		initialise($element, instance, optionalArgs);
		attachEventDelegates(instance);
		
		return instance;
	}
	
	
	/**
	 *	Capture loosely attaches a viewController to an element via event delegates.
	 *	@param	{object}	ViewController	The ViewController to be initialised from on the element
	 *	@public
	 */
	$.fn.capture = function(ViewController) {
		if(this.length === 0 || !this.each) { return; }
		
		var $element = this;
		var optionalArgs = (arguments.length > 1) ? slice.call(arguments, 1) : undefined;
		var instances = [];
		
		validate(ViewController);
		
		for (var i=0; i < $element.length; i++) {
			instances[i] = connectViewController($element.eq(i), ViewController, optionalArgs);
		}
		
		return instances;
	};
	

})(jQuery);