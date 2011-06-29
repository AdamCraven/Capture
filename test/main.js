module("Capture");

  test("Namespace setup", function() {
	ok(typeof jQuery !== "undefined",'jQuery namespace initialised');
	ok(typeof $.fn.capture !== "undefined",'Capture plugin exists');
	ok(typeof $.viewController !== "undefined",'viewController has extended jQuery');
  });