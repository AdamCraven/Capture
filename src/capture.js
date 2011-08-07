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
    function bindEventDelegates(view) {
        var eventHolder;
        var eventType;
        var method;
        var selector;
        var listenerElement = view.element;
        var handlerFn;

        // Loop through all methods looking for event delegates
        for (method in view) {
            if (view.hasOwnProperty(method) && method.match(eventMethodPrefix) && typeof view[method] === "object") {
                eventHolder = view[method];
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
                            listenerElement.bind(eventType, bind(handlerFn, view));
                        } else {
                            // Bind event delegate to the element. Setting the context to the view
                            listenerElement.delegate(selector, eventType, bind(handlerFn, view));
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

    function validate(view) {
        if (!view) {
            return logError('NO_VIEWCONTROLLER');
            // TODO: Describe element it was attached to
        }

        if (toString.call(view) !== '[object Object]') {
            return logError('VIEWCONTROLLER_MUST_BE_OBJECT');
        }
    }

    /**
     *  Connect the view controller and element together
     *  @returns {object} New instance of an initalised view controller
     */
    function connectView(element, view, optionalArgs) {
        view.element = element;

        if (view.init && view.hasOwnProperty('init')) {
            view.init.apply(view, optionalArgs);
        }

        bindEventDelegates(view);

        return view;
    }

    /**
     *  Capture loosely attaches a view to an element via event delegates.
     *  @param  {object}  view  The View to be initialised from on the element
     *  @public
     */
    $.fn.capture = function (view) {
        if (this.length === 0 || !this.each) {
            return;
        }
        
        validate(view);
        
        var optionalArgs = (arguments.length > 1) ? slice.call(arguments, 1) : undefined;

        return connectView(this.eq(0), view, optionalArgs);
    };
    
    /**
     * View Controller base constructor.
     * When an object is wrapped with $.fn.capture.view, it inherits methods directly
     * from this constructor
     * @constructor
     */
    function ViewBaseClass() {}
    
    ViewBaseClass.prototype = {
        remove : function () {
            this.element.remove();
        }
    };

    
    /**
     * Any function or object this wraps it immediately instantiates and sets inheritance to
     * the view base class.
     * @param {Object/Function} View    Function/Object to instantiate as a capture view
     */
    $.fn.capture.view = function (View) {        
        // If a constructor has been passed
        var view = (typeof View === "function") ? new View() : View;
                
        // Deep copy view into instance of ViewBaseClass
        return $.extend(true, new ViewBaseClass(), view); 
    };
    
    
})(jQuery);
