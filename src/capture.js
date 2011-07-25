/*jslint evil: false, bitwise:false, strict: true, undef: true, white: false, onevar:false, browser:true, plusplus:false */
/*global jQuery */
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
	
	function setupEventDelegates(viewController) {
		
		var eventDelegate, eventType, method, selector;
		
		// Loop through all methods looking for event delegates
		for(method in viewController) {
		   if (viewController.hasOwnProperty(method) && method.match(eventMethodPrefix) && typeof viewController[method] === "object") { 
			   // Event to delegate
			   eventDelegate = viewController[method];
			   
			   // e.g. click
			   eventType = method.match(eventMethodPrefix)[1];
			   
			   for(selector in eventDelegate) { 
				   if(eventDelegate.hasOwnProperty(selector)) {
					   // Bind event handler to the element. Setting the context to the viewController 
					   viewController.element.delegate(selector, eventType, bind(eventDelegate[selector], viewController));
				   }
			   }
		   }  
		}
	}

	/**
	 *	Capture loosely attaches a viewController to an element via event delegates.
	 *	@param	{object}	viewController	The viewController which is attached to the element.
	 *	@public
	 */
	$.fn.capture = function(viewController){
		if(!viewController) {
			throw 'NO_VIEWCONTROLLER'; // TODO: Describe element it was attached to
		}
		
		if(toString.call(viewController) !== '[object Object]') {
			throw 'VIEWCONTROLLER_MUST_BE_OBJECT';
		}
		
		// Create new instance of
		viewController = $.extend({}, viewController);
		
		// Assign element property to viewController
		viewController.element = this;
		
		// Setup event delegates
		setupEventDelegates(viewController);
		
		if(viewController.init) {
			// Any addtional arguments are collated
			var additionalArguments = slice.call(arguments, 1);
			
			// Execute init, sending addditional arguments
			viewController.init.apply(viewController, additionalArguments);
		}
				
		return viewController;
	};
	

})(jQuery);