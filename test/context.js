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
        
        test("Context inside viewController init", function() {
            
            var viewController = { 
               init : function init() {
                    equal(init, this.init, 'context of this, is this view controller');
                    this.test();
               },
               test : function() {
                   ok(true, 'test function can be accessed from init function');
                   this.test2();
               },
               test2 : function() {
                   ok(true, 'test2 function can be accessed from init function');
                   
               }
            };
            
            $('#testElement').capture(viewController);
            expect(3);
            

        });
        
        test("Context inside viewController events", function() {
            
            var viewController = { 
                onclick : {
                    '.link': function(e) {
                        equal(e.target, $('#testElement .link')[0], 'e target is element clicked on');
                        equal(this.element[0], $('#testElement')[0], 'this.element is the viewController bound unto');
                    }  
                }
            };
            
            $('#testElement').capture(viewController);
            
            $('#testElement .link').click();

        });
        
}());