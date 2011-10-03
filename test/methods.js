/*jslint*/

(function(){
    
    
    function teardown() {
        $('#testElement').remove();
    }

    function setup() {
        $('body').append('<div id="testElement"><div class="double first"></div><div class="double second"></div></div>');
    }

    module("Methods and properties", {teardown: teardown, setup: setup });
        
        test('All methods are inherited from base-class', function() {
            var picture = $.capture.view({});
            var newPic = $('#testElement').capture(picture);


            ok(newPic.removeEventListeners, 'removeEventListeners has been inherited from base-class');
            ok(newPic.reattachEventListeners, 'reattachEventListeners has been inherited from base-class');

        });
        
        
		test('"this.element" property is the element captured', function() {
			var viewController = { init:function(){} };
			var boundViewController = $.capture('#testElement', viewController);
			
			equal(boundViewController.element[0], $('#testElement')[0], 'captured element is same');
		});

        
        test('"removeEventListeners" method unbinds all events attached to the view', function() {
            var clickCount = 0;
            var picture = $.capture.view({
                onclick : {
                    element : function (e) {
                        clickCount++;
                    }
                }
            });
            
            var newPic = $('#testElement').capture(picture);

            $('#testElement').click();
            equal(1, clickCount, '#testElement has been clicked');
            
            newPic.removeEventListeners();
            $('#testElement').click();
            equal(1, clickCount, '#testElement no longer responds to events');
        });
        
        test('"reattachEventListeners" method reattachs all events to the view', function() {
            var clickCount = 0;
            var picture = $.capture.view({
                onclick : {
                    element : function (e) {
                        clickCount++;
                    }
                }
            });
            
            var newPic = $('#testElement').capture(picture);

            $('#testElement').click();
            equal(clickCount, 1, '#testElement has been clicked');
            
            newPic.removeEventListeners();
            $('#testElement').click();
            equal(clickCount, 1, '#testElement no longer responds to events');
            
            newPic.reattachEventListeners();
            $('#testElement').click();
            equal(clickCount, 2, '#testElement responds to events again');
            
        });
        
        test('"reattachEventListeners" method first removes existing methods before reattaching', function() {
            var clickCount = 0;
            var picture = $.capture.view({
                onclick : {
                    element : function (e) {
                        clickCount++;
                    }
                }
            });
            
            var newPic = $('#testElement').capture(picture);

            
            newPic.reattachEventListeners();
            newPic.reattachEventListeners();
            newPic.reattachEventListeners();
            $('#testElement').click();
            equal(clickCount, 1, '#testElement responds to events again');
            
        });

    
}());