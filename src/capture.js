/*jslint evil: false, bitwise:false, strict: true, undef: true, white: false, onevar:false, browser:true, plusplus:false */
/*global jQuery */
(function($){
    "use strict";
    
    var nativeBind = Function.prototype.bind;
    var slice = Array.prototype.slice;
    
    var bind = function(func, context) {
        if (func.bind === nativeBind && nativeBind) {
            return nativeBind.apply(func, slice.call(arguments, 1));
        }
        return $.proxy(func, context);
    };

    /**
     * @public
     * @param {object}  viewController  The viewController which is attached to the element
     */
    $.fn.capture = function(viewController){
        if(!viewController) {return false;}
        
        // Create new instance of
        viewController = $.extend({}, viewController);
        
        var eventType;
        var method;
        var selector;
        var eventDelegate;
        var element = this;
        var eventMethodPrefix = /^on(.+)/;
        
        for(method in viewController) {
           // Find methods which are event handlers
           if (viewController.hasOwnProperty(method) && 
                method.match(eventMethodPrefix) && 
                typeof viewController[method] === "object") { 
               
               // Event to delegate
               eventDelegate = viewController[method];
               
               // e.g. click
               eventType = method.match(/^on(.+)/)[1];
               
               for (selector in eventDelegate) { 
                   if(eventDelegate.hasOwnProperty(selector)) {
                       // Bind event handler to the element. Set the context to the viewController 
                       element.delegate(selector, eventType, bind(eventDelegate[selector], viewController));
                   }
               }
           }
            
        }
        
        // Ensure bound element is passed into viewController
        viewController.element = element;
                
        if(viewController.init) {
            var additionalArguments = slice.call(arguments, 1);
            
            // Exectue init functino
            viewController.init.apply(viewController, additionalArguments);
        }
                
        return viewController;
    };
    

})(jQuery);