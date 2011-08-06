/*jslint*/

(function(){
	
	
	function teardown() {
		$('#testElement').remove();
	}

	function setup() {
		$('body').append('<div id="testElement"><div class="double first"></div><div class="double second"></div></div>');
	}

	module("Inheritance", {teardown: teardown, setup: setup });
	    
	    test("Wrapping an already instantiated object with ViewController initialises correctly", function() {
	        var newObj = {init: function() {}};
	        var viewController = $.fn.capture.view(newObj);
	        
	        notEqual(newObj, viewController, 'A new instance of view controller has been created');
	        ok(viewController.remove, 'viewController has inherited a method from the viewControllerBase prototype');
	    });
	
}());