
(function(){

var und = function(x) {
	return typeof x === 'undefined';
};

var fayechannel = '/apitest';

test("Faye Assets Present", function() {
	ok('Faye' in window, "Faye asset 'fayeclient.js' found: Faye");
	ok('Client' in window.Faye, "Faye asset 'fayeclient.js' found: Faye.Client");
});

test("Faye Subscribes to Node server", function() {
	var client = new Faye.Client('http://localhost:8000/comet');
	client.subscribe(fayechannel, function(){});
	ok(true, 'Faye connected to ' + fayechannel);
	client.unsubscribe(fayechannel);
});

test("Faye Publishes to Node server", function() {
	var client = new Faye.Client('http://localhost:8000/comet');
	var testmessage = {ob: 'ject'};
	client.subscribe(fayechannel, function(){});
	ok(true, 'Faye connected to ' + fayechannel);
	client.publish(fayechannel, testmessage);
	ok(true, 'Faye published {ob:"ject"} to ' + fayechannel);
	client.unsubscribe(fayechannel);
});

})();
