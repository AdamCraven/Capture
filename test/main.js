/*jslint*/


var vc = {
	init : function(options, moreOptions) {
		// The init function is exectued on capture, before event delegates have been assigned
	},
	onclick : {
		element : function(e) {
			// Will capture any 'click' events on this.element
		},
		'.selector' : function(e) {
			// Will capture any 'click' events on this.element.find('.selector');
		}
	},
	onmycustomevent: {
		'.selector' : function(e) {
			// Will capture any 'mycustomevent' events on this.element.find('.selector');
		}
	}
	
};

function Vc(){
	this.init = function(options, moreOptions) {
		// The init function is exectued on capture, before event delegates have been assigned
	};
	this.onclick = {
		element : function(e) {
			// Will capture any 'click' events on this.element
		},
		'.selector' : function(e) {
			// Will capture any 'click' events on this.element.find('.selector');
		}
	};
	this.onmycustomevent = {
		'.selector' : function(e) {
			// Will capture any 'mycustomevent' events on this.element.find('.selector');
		}
	};
	
}

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
			
			equal(boundViewController.element[0], $('#testElement')[0], 'captured element is same');
			strictEqual(viewController, boundViewController, 'The boundViewController is not a new instance of viewController, and not the same');
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
		
	
	
}());