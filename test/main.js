/*jslint*/

(function(){
	
	
	function teardown() {
		$('#testElement').remove();
	}

	function setup() {
		$('body').append('<div id="testElement"><div class="double first"></div><div class="double second"></div></div>');
	}

	module("Capture", {teardown: teardown, setup: setup });

		test("Namespace setup", function() {
			ok(typeof jQuery !== "undefined",'jQuery namespace initialised');
			ok(typeof $.fn.capture !== "undefined",'Capture plugin exists');
		});
	

		test("Basic binding to elements", function() {
			var viewController = { init:function(){} };
			var boundViewController = $('#testElement').capture(viewController);
			
			strictEqual(viewController, boundViewController, 'The boundViewController is not a new instance of viewController');
		});
		
		test("Methods in the prototype are not called by capture", function() {
			function ViewController() {
				// Empty
			}
			ViewController.prototype = {
				init : function() {
					ok(false,'Init in prototype will never execute');
				},
				onclick : {
					'#testElement' : function(e) {}
				}
			};
			
			var viewController = new ViewController();
			var boundViewController = $('#testElement').capture(viewController);
			
			ok(typeof $('#testElement').data('events') === "undefined", 'valid onclick in the prototype will not bind');
		});
	
	module("Initialisation", {teardown: teardown, setup: setup });

		test("Extra arguments are sent to init function", function() {
			
			var options = {};
			var anotherValue = 'bar';
			var viewController = { 
				init: function(firstArg, secondArg){
					equal(options, firstArg, 'Options object is passed to init');
					equal(anotherValue, secondArg, 'anotherValue is pass to init');
				} 
			};
			 
			$('#testElement').capture(viewController, options, anotherValue); 
			
			expect(2);
		});
		
		
		test("Object oriented style calling works", function() {
			
			var options = {};
			var anotherValue = 'bar';
			var viewController = { 
				init: function(firstArg, secondArg){
					equal(options, firstArg, 'Options object is passed to init');
					equal(anotherValue, secondArg, 'anotherValue is pass to init');
				} 
			};
			 
			$.capture('#testElement', viewController, options, anotherValue); 
			
			expect(2);
		});
		
	
	
}());