/*jslint evil: false, bitwise:false, strict: true, undef: true, white:true, onevar:false, browser:true, plusplus:false */
/*global jQuery, console:true */
/*! 
 *  Capture.js
 *  Copyright 2011 Adam Craven
 *  https://github.com/AdmCrvn/Capture
 */
(function ($) {
    "use strict";

    var nativeBind = Function.prototype.bind;
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    // All properties with prefix of 'on' are treated as event delegates
    var eventMethodPrefix = /^on(.+)/;

    /**
     *  Native ECMAScript 5 bind if supported or passes to jQuery proxy.
     *  @param  {function}  fn    Function to bind.
     *  @param  {object}  context Scope in which the function is bound.
     */
    function bind(fn, context) {
        if (nativeBind && fn.bind === nativeBind) {
            return nativeBind.apply(fn, slice.call(arguments, 1));
        }
        return $.proxy(fn, context);
    }

    /**
     *  Binds methods that have the valid prefix 'on', to the element
     *  
     *  @example view controller method the function will bind event delegates with
     *    onclick : { 
     *      '.selector' : function(e) { 
     *      
     *      }   
     *    }
     */
    function bindEventDelegates(viewController) {
        var eventHolder;
        var eventType;
        var method;
        var selector;
        var listenerElement = viewController.element;
        var handlerFn;

        // Loop through all methods looking for event delegates
        for (method in viewController) {
            if (viewController.hasOwnProperty(method) && method.match(eventMethodPrefix) && typeof viewController[method] === "object") {
                eventHolder = viewController[method];
                // e.g. click
                eventType = method.match(eventMethodPrefix)[1];

                for (selector in eventHolder) {
                    if (eventHolder.hasOwnProperty(selector)) {
                        handlerFn = eventHolder[selector];
                        // If the selector is the same as the listenerElement
                        // Or using special 'element' property
                        if (listenerElement.is(selector) || handlerFn === eventHolder.element) {
                            // Attach event to current element
                            // RADAR: What about selector changes on element?
                            listenerElement.bind(eventType, bind(handlerFn, viewController));
                        } else {
                            // Bind event delegate to the element. Setting the context to the viewController
                            listenerElement.delegate(selector, eventType, bind(handlerFn, viewController));
                        }
                    }
                }
            }
        }
    }

    function logError(error) {
        if (console && console.error) {
            console.error(error);
        } else {
            throw new Error(error);
        }
    }

    function validate(viewController) {
        if (!viewController) {
            return logError('NO_VIEWCONTROLLER');
            // TODO: Describe element it was attached to
        }

        if (toString.call(viewController) !== '[object Object]') {
            return logError('VIEWCONTROLLER_MUST_BE_OBJECT');
        }
    }

    /**
     *  Connect the view controller and element together
     *  @returns {object} New instance of an initalised view controller
     */
    function connectViewController(element, viewController, optionalArgs) {

        viewController.element = element;

        if (viewController.init && viewController.hasOwnProperty('init')) {
            viewController.init.apply(viewController, optionalArgs);
        }

        bindEventDelegates(viewController);

        return viewController;
    }

    /**
     *  Capture loosely attaches a viewController to an element via event delegates.
     *  @param  {object}  viewController  The ViewController to be initialised from on the element
     *  @public
     */
    $.fn.capture = function (viewController) {
        if (this.length === 0 || !this.each) {
            return;
        }

        var optionalArgs = (arguments.length > 1) ? slice.call(arguments, 1) : undefined;

        validate(viewController);

        return connectViewController(this.eq(0), viewController, optionalArgs);
    };
    
    /**
     * View Controller base constructor.
     * When an object is wrapped with $.fn.capture.viewController, it inherits methods directly
     * from this constructor
     */
    function ViewControllerBase() {}
    
    ViewControllerBase.prototype = {
        remove : function () {
            this.element.remove();
        }
    };
    
    /**
     * This copies over the object to a new function, to inherit methods from capture
     */
    $.fn.capture.viewController = function (viewController) {
        var viewControllerBase = new ViewControllerBase();

        viewController = $.extend(true, viewControllerBase, viewController); 
        
        return viewController;
        
    };
    
})(jQuery);
