/*jslint*/

clicker = $.viewController({
    init : function() {
        console.log('init called');
        console.log(this.element);
    },
    
    onclick : {
        'a' : function(e) {
            alert('clicked!!');
        },
        '.fish span' : function(e) {
            alert('check');
        }
    },
    
    onmouseover : {
        'a' : function(e) {
           console.log('hovering',arguments);
        }   
        
    },
    
    onmouseout : {
        'a' : function(e) {
            console.log('on mouseout',arguments, e.liveFired);
        }
    }
    
});