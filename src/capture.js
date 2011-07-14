/*jslint evil: false, bitwise:false, strict: true, undef: true, white: false, onevar:false, browser:true, plusplus:false */
/*global jQuery */
(function($){
    "use strict";

    $.extend({
        // Nothing special happening here, yet
        viewController : function(viewController) {     
            return viewController;
        }
    });
    
    /**
     * @public
     * @param {object}  viewController  The viewController which is attached to the element
     */
    $.fn.capture = function(viewController){
        if(!viewController) {return false;}
        
        var eventName;
        var method;
        var selector;
        var eventDelegate;
        var element = this;
        var onString = /^on(.+)/;
        
        for(method in viewController) {
           // Find methods which are event handlers
           if (method.match(onString) && typeof viewController[method] === "object") { 
               
               // Events to delegate
               eventDelegate = viewController[method];
               
               // e.g. click
               eventName = method.match(/^on(.+)/)[1];
               
               for (selector in eventDelegate) { 
                   if(eventDelegate.hasOwnProperty(selector)) {
                       // Bind event handler to the element
                       element.delegate(selector, eventName, eventDelegate[selector]);
                   }
               }
           }
            
        }
        
        // Ensure bound element is passed into viewController
        viewController.element = element;
        
        if(viewController.init) { 
            viewController.init();
        }
        
        return viewController;
    };
    

})(jQuery);