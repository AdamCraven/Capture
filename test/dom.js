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
            
            // Attach viewController to element
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

              // Attach viewController to element
              $('#testElement').capture(viewController);

              equal(eventTriggered, 0);
              $('#testElement .link').trigger('custom');
              equal(eventTriggered, 1, 'count has increased after custom event');

          });
    
}());