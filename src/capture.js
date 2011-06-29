/*jslint undef:true*/
/*globals jQuery*/
(function($) {
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
        
        for(method in viewController) {
           // Find methods which are event handlers
           if (method.match(/^on(.+)/) && typeof viewController[method] === "object") { 
               
               // Events to delegate
               eventDelegate = viewController[method];
               
               // e.g. click
               eventName = method.match(/^on(.+)/)[1];
               
               for (selector in eventDelegate) { 
                   if(eventDelegate.hasOwnProperty(selector)) {
                       // Bind event handler to the element
                       $(this).delegate(selector, eventName, eventDelegate[selector]);
                   }
               }
           }
            
        }

        if(viewController.init) { 
            viewController.init();
        }
    };
    

})(jQuery);