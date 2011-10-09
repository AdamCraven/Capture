/*jslint evil: false, bitwise:false, strict: true, undef: true, white:true, onevar:false, browser:true, plusplus:false */
/*global jQuery, console, Capture:true, window */
/**
 *  Capture.js 
 *  v1.0.0beta
 *  Copyright 2011 Adam Craven
 *  Freely distributable under the MIT License.
 *  https://github.com/AdmCrvn/Capture
 */
(function ($) {
    "use strict";
    
    var bind = Function.prototype.bind;
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;
    
    // All properties with prefix of 'on' are treated as event delegates
    var eventMethodPrefix = /^on(.+)/;

    /**
     *  Native ECMAScript 5 bind if supported or passes to jQuery proxy.
     *  @param  {function}  fn    Function to bind.
     *  @param  {object}  scope Scope in which to bind the function.
     */
    function bindScope(fn, scope) {
        if (bind && fn.bind === bind) {
            return bind.apply(fn, slice.call(arguments, 1));
        }
        return $.proxy(fn, scope);
    }
    
    /**
     *  logs errors to console
     *  @param {string} error The error message to log
     */
    function logError(error) {
        if (console && console.error) {
            console.error(error);
        } else {
            throw new Error(error);
        }
    }

    /**
     *  Validates the view when captured, checking for basic errors
     */
    function validate(element, view) {
        if (!view) {
            return logError('Capture.js; No view passed. You must attach a view object or constructor. e.g. $("el").capture(view)');
        }

        if (toString.call(view) !== '[object Object]') {
            return logError('Capture.js; Invalid view type. The view must be an object or a constructor.');
        }
        
        if (element.length === 0 || !element.each) {
            return logError('Capture.js; No element found. You must attach the view to an element.');
        }
    }

    /**
     *  Adds listeners to the view.
     *  By default all methods that have the valid prefix 'on', their selectors will be bound
     *  
     *  @example view controller method the function will bind event delegates with
     *    onclick : { 
     *      '.selector' : function(e) { 
     *      
     *      }   
     *    }
     */
    function addEventListeners(view) {
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
                            listenerElement.bind(eventType, bindScope(handlerFn, view));
                        } else {
                            // Bind event delegate to the element. Setting the context to the view
                            listenerElement.delegate(selector, eventType, bindScope(handlerFn, view));
                        }
                    }
                }
            }
        }
    }

    /**
     *  Connect the view controller and element together
     *
     *  @param {Object} element         Element to attach view unto.
     *  @param {Object} View            View to capture.
     *  @param {Any}    [optionalArgs]  One or more extra arguments that are passed to the view.init.
     *
     *  @returns {object} New instance of an initalised view controller
     */
    function connectView(element, view, optionalArgs) {
        view.element = element;

        if (view.init && view.hasOwnProperty('init')) {
            if (optionalArgs) {
                view.init.apply(view, optionalArgs);
            } else {
                view.init.call(view);
            }
        }

        addEventListeners(view);

        return view;
    }
    
    
    if (typeof Capture !== "undefined") {
        return logError('Capture is already defined');
    }
    
    /**
     * View Controller base constructor.
     * When an object is wrapped with Capture.view, it inherits methods directly
     * from this constructor
     * @constructor
     */
    function ViewBaseClass() {}
    
    ViewBaseClass.prototype = {
        // Remove all event handlers
        removeEventListeners : function () {
            this.element.unbind();
            this.element.undelegate();
        },
        // Reattach all event listners
        reattachEventListeners : function () {
            this.removeEventListeners();
            addEventListeners(this);
        }
    };

        
    /**
     *  Capture attaches a view to an element via event delegates.
     *  
     *  @param {String/Object}   element Element to attach view unto.
     *  @param {Object/Function} View    To be instantiated as a capture view.
     *  @param {AnyType}         [1..*]  One or more extra arguments that are passed to the view.init.
     *  
     *  @returns {object}    Instantiated view
     *  
     *  @example
     *   Capture('#gallery', view)
     */
    window.Capture = function (element, view) {
        // If wrapped by Capture.view, it will be a function.
        view = (typeof view === "function") ? view() : view;
        
        element = $(element);

        validate(element, view);

        return connectView(element.eq(0), view, (arguments.length > 2) ? slice.call(arguments, 2) : undefined);
    };
    
    /**
     *  This wraps the view until called by capture. 
     *  It instantiates the view controller and sets inheritance to view base class.
     *
     *  @param {Object/Function} View    To be instantiated as a capture view
     *
     *  @returns {function} The view to be initalised by capture
     */
    Capture.view = function (View) { 
        return function () {       
            // If a constructor has been passed
            var view = (typeof View === "function") ? new View() : View;

            // Deep copy view into instance of ViewBaseClass
            return $.extend(true, new ViewBaseClass(), view);
        };
    };
    
    /**
     *  jQuery method to capture a view on the existing element. 
     *  Doesn't return an error if element doesn't exist, as per jQuery philosophy.
     *
     *  @param  {object}  view  The View to be initialised from on the element
     *  @param {AnyType}         [1..*]  One or more extra arguments that are passed to the view.init.
     *
     *  @returns {object}    Instantiated view
     *
     *  @example
     *  $('#element').capture(view)
     */
    $.fn.capture = function (view) {
        if (this.length === 0 || !this.each) {
            return;
        }
        return window.Capture.apply(null, [this].concat(slice.call(arguments, 0)));
    };
    
    
    
})(jQuery);
