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
        });
        
        test('Remove method is inherited from baseClass', function() {
            var picture = {};
            var newPic = $.fn.capture.view(picture);
            newPic = $('#testElement').capture(newPic);
            
            
            ok(newPic.remove, 'remove has been inherited from base-class');
            
        });
        
        test('Remove method overwritten from baseClass', function() {
            var picture = { remove : function () {} };
            var newPic = $.fn.capture.view(picture);
            newPic = $('#testElement').capture(newPic);
            
            
            equal(newPic.remove, picture.remove, 'remove not inherited from base class');
            
            // In browsers that support ECMAScript 5 prototype lookup
            if(Object.getPrototypeOf) {
                ok(Object.getPrototypeOf(newPic).remove, 'And still exists in prototype');
            }
        });
        
        test("When initalised, properties and objects is not the same as the original", function() {
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
            newPic = $('#testElement').capture(newPic);
            
            equal(newPic.init, picture.init, 'Method same');
            notEqual(newPic.onclick, picture.onclick, 'Object different');
            equal(newPic.onclick['#testElement'], picture.onclick['#testElement'], 'Method same');
            notEqual(newPic.anArray, picture.anArray, 'Array different');
            notEqual(newPic.someProperty.deeper.deepest, picture.someProperty.deeper.deepest, 'Object different');
        });
        
        test("Functions are instantiated when passed", function() {
            function Picture(){
                this.init = function(){};
                this.onclick = {
                    "#testElement" : function() {}
                };
                this.someProperty = {
                    deeper : {
                        deepest : {}
                    }
                };
                this.anArray = [1,2,3];
                
            }
                
            var newPic = $.fn.capture.view(Picture);
            newPic = $('#testElement').capture(newPic);
            
            ok(typeof newPic.onclick === "object", 'We can\'t examine methods in Picture constructor, so just check a method has initalised');

        });
        
        test("Constructor with prototype methods initalise exactly the same as object", function() {
            function Picture(){}
            
            Picture.prototype = {
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
            
            var newPic = $.fn.capture.view(Picture);
            newPic = $('#testElement').capture(newPic);
            
            
            equal(newPic.init, Picture.prototype.init, 'Method same');
            notEqual(newPic.onclick, Picture.prototype.onclick, 'Object different');
            equal(newPic.onclick['#testElement'], Picture.prototype.onclick['#testElement'], 'Method same');
            notEqual(newPic.anArray, Picture.prototype.anArray, 'Array different');
            notEqual(newPic.someProperty.deeper.deepest, Picture.prototype.someProperty.deeper.deepest, 'Object different');
        });
        
        test("New instance everytime accessed", function() {                
            var newPic = $.capture.view({
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
            });
            
            
            var newPicCaptured = $('#testElement').capture(newPic);
            var newPicCaptured2 = $('#testElement').capture(newPic);
            
            notEqual(newPicCaptured, newPicCaptured2);
        });
        
        
    
}());