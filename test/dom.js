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
            
            equal(0, clicked);
            $('#testElement .link').click();
            equal(1, clicked, 'count has increased after click');
            
            equal(0, subClicked);
            $('#testElement .sub-link').click();
            equal(1, subClicked, 'count has increased after click');
            
            //click both
            $('#testElement a').click();
            equal(2, clicked);
            equal(2, subClicked);
            
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

              equal(0, eventTriggered);
              $('#testElement .link').trigger('custom');
              equal(1, eventTriggered, 'count has increased after custom event');


          });
    
}());