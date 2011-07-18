/*jslint*/

(function(){

    var testElement = '<div id="testElement">'+
                        '<a class="link"><a class="sub-link"></a></a>'+
                      '</div>';
    
    function teardown() {
        $('#testElement').remove();
    }

    function setup() {
        $('body').append(testElement);
    }

    module("Context binding", {teardown: teardown, setup: setup });
        
        test("Context inside viewController", function() {
            
            var viewController = { 
                onclick : {
                    '.link': function(e) {
                        equal(e.target, $('#testElement .link')[0], 'e target is element clicked on');
                        // FIXME: Same element but not recognised as same
                        equal(this.element[0], $('#testElement')[0], 'this.element is the viewController bound unto');
                    }  
                }
            };
            
            $('#testElement').capture(viewController);
            
            $('#testElement .link').click();

            
        });
        
}());