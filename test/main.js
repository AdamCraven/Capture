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
			var boundViewController = $('#testElement').capture(viewController)[0];
			
			equal(boundViewController.element[0], $('#testElement')[0], 'captured element is same');
			notEqual(viewController, boundViewController, 'The boundViewController is a new instance of viewController, and not the same');
		});
		
		
		test("Basic binding to two elements", function() {
			var viewController = { init:function(){} };
			
			var boundViewController = $('.double').capture(viewController);
			
			
			equal(boundViewController[0].element[0], $('.double')[0], 'captured element is first double');
			equal(boundViewController[1].element[0], $('.double')[1], 'captured element is second double');

		});
		
		test("Multiple view controllers are instances and do not share properties", function() {

			  var viewController = { 
				  eventTriggered : 0,
				  testMethod : function() {},
				  deepObject : {
					deeper : {
						deepest : {},
						deepestFn : function() {}
					}
				  },
				  onclick : {
					  element: function(){
						  this.eventTriggered++;
					  }
				  }
			  };

			  var vcs = $('.double').capture(viewController);

			  notStrictEqual(vcs[0], vcs[1], 'View controller is a seperate instance');
			  notStrictEqual(vcs[0].element, vcs[1].element, 'Objects are instances');
			  notStrictEqual(vcs[0].deepObject, vcs[1].deepObject, 'Objects are instances');
			  notStrictEqual(vcs[0].deepObject.deeper.deepest, vcs[1].deepest, 'Objects are instances');
			  notStrictEqual(vcs[0].deepObject.deeper.deepestFn, vcs[1].deepObject.deeper.deepestFn, 'Functions are instances');
			  notStrictEqual(vcs[0].testMethod, vcs[1].testMethod, 'Functions are instances');
			  notStrictEqual(vcs[0].onclick, vcs[1].onclick, 'Objects are instances');

		  });
		
	
	module("Initialisation", {teardown: teardown, setup: setup });
	/*
		test("Fail when no viewController sent", function() {
		 
			try {
				$('#testElement').capture();
			} catch(e) {
				equal(e, 'NO_VIEWCONTROLLER');
			}
		
			expect(1);
		});
		
		test("Functions are invalid viewControllers", function() {
			 
			try {
				$('#testElement').capture(function() {});
			} catch(e) {
				equal(e, 'VIEWCONTROLLER_MUST_BE_OBJECT');
			}
			
			expect(1);
		});
		
		test("Arrays are invalid viewControllers", function() {
			 
			try {
				$('#testElement').capture([]);
			} catch(e) {
				equal(e, 'VIEWCONTROLLER_MUST_BE_OBJECT');
			}
			
			expect(1);
		});
		
		test("Strings are invalid viewControllers", function() {

			try {
				$('#testElement').capture('Strings are invalid');
			} catch(e) {
				equal(e, 'VIEWCONTROLLER_MUST_BE_OBJECT');
			}
			
			expect(1);
		});
		*/
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