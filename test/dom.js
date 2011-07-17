/*jslint*/

(function(){

    function teardown() {
        $('#testElement').remove();
    }

    function setup() {
        $('body').append('<div id="testElement"><a class="link"><a></div>');
    }

    module("Capture", {teardown: teardown, setup: setup });
    
        test("Click method works", function() {
            var count = 0;
            
            var viewController = $.viewController({ 
                init:function(){},
                onclick : {
                    '.link': function(){
                        count++;
                    }
                }
             });
            // Attach viewController to element
            var boundViewController = $('#testElement').capture(viewController);
            
            $('#testElement .link').click();
            
            
            equal(1, count, 'count has increased after click');
        });
    
}());