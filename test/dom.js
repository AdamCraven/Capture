/*jslint*/

(function(){

    var testElement = '<div id="testElement">'+
                        '<a class="link"><a class="sub-link"></a></a>'+
						'<div class="double"></div><div class="double"></div>'+
                      '</div>';
    
    function teardown() {
        $('#testElement').remove();
    }

    function setup() {
        $('body').append(testElement);
    }

    module("DOM interaction", {teardown: teardown, setup: setup });
        
        test("Delegates for click event", function() {
            var clicked = 0;
            var subClicked = 0;
            
            var viewController = { 
                onclick : {
                    '.link': function(){
                        clicked++;
                    },
                    '.sub-link': function() {
                        subClicked++;
                    }
                }
            };
            
            $('#testElement').capture(viewController);
            
            equal(clicked, 0);
            $('#testElement .link').click();
            equal(clicked, 1, 'count has increased after click');
            
            equal(subClicked, 0);
            $('#testElement .sub-link').click();
            equal(subClicked, 1, 'count has increased after click');
            
            //click both
            $('#testElement a').click();
            equal(clicked, 2);
            equal(subClicked, 2);
            
        });
        
        test("Delegates for a custom event", function() {
              var eventTriggered = 0;

              var viewController = { 
                  oncustom : {
                      '.link': function(){
                          eventTriggered++;
                      }
                  }
              };

              $('#testElement').capture(viewController);

              equal(eventTriggered, 0);
              $('#testElement .link').trigger('custom');
              equal(eventTriggered, 1, 'count has increased after custom event');

          });

        test("Delegate is on the same element", function() {
              var eventTriggered = 0;

              var viewController = { 
                  onclick : {
                      '#testElement': function(){
                          eventTriggered++;
                      }
                  }
              };

              $('#testElement').capture(viewController);

              equal(eventTriggered, 0);
              $('#testElement .link').trigger('click');
              equal(eventTriggered, 1, 'count has increased after custom event');

          });

        test("Delegate is on the same element, using element property", function() {
              var eventTriggered = 0;

              var viewController = { 
                  onclick : {
                      element: function(){
                          eventTriggered++;
                      }
                  }
              };

              $('#testElement').capture(viewController);

              equal(eventTriggered, 0);
              $('#testElement .link').trigger('click');
              equal(eventTriggered, 1, 'count has increased after custom event');

          });

        test("Delegate is on all elements", function() {
              var eventTriggered = 0;

              var viewController = { 
                  onclick : {
                      '*': function(){
                          eventTriggered++;
                      }
                  }
              };

              $('#testElement').capture(viewController);

              equal(eventTriggered, 0);
              $('#testElement .sub-link').trigger('click');
              equal(eventTriggered, 1, 'count has increased after custom event');

          });

		// Special edge case when this.element has another class added to it in initialise
        test("Selector created in init, can be bound straight away", function() {
              var eventTriggered = 0;

              var viewController = {
				  init : function() {
					this.element.addClass('newClass');
				  },
                  onclick : {
                      '.newClass': function(){
                          eventTriggered++;
                      }
                  }
              };

              $('#testElement').capture(viewController);

              equal(eventTriggered, 0);
              $('#testElement.newClass').trigger('click');
              equal(eventTriggered, 1, 'count has increased after custom event');

          });

        test("Delegate is on all elements", function() {
              var eventTriggered = 0;

              var viewController = { 
                  onclick : {
                      '*': function(){
                          eventTriggered++;
                      }
                  }
              };

              $('#testElement').capture(viewController);

              equal(eventTriggered, 0);
              $('#testElement .sub-link').trigger('click');
              equal(eventTriggered, 1, 'count has increased after custom event');

          });

    
}());