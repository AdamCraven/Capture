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
	    
	    test("Ensure when initalised, properties and objects not shared with original", function() {
	        var picture = {
	            init: function() {},
	            onclick : {
	                "#testElement" : function() {}
	            },
	            someProperty : {
	                deeper : {
	                    deepest : {}
	                }
	            },
	            anArray : [1,2,3]
	            
	        };
	            
	        
	        var newPic = $.fn.capture.view(picture);
	        
	        equal(newPic.init, picture.init, 'Method same');
	        notEqual(newPic.onclick, picture.onclick, 'Object different');
	        equal(newPic.onclick['#testElement'], picture.onclick['#testElement'], 'Method same');
	        notEqual(newPic.anArray, picture.anArray, 'Array different');
	        notEqual(newPic.someProperty.deeper.deepest, picture.someProperty.deeper.deepest, 'Object different');
	        
	    });
	
}());