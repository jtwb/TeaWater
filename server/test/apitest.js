
(function(){

var und = function(x) {
	return typeof x === 'undefined';
};

var fayechannel = '/apitest',
    fayeclient = new Faye.Client('/fayeclient');

fayeclient.subscribe(fayechannel, function(){});

test("Reset server state", function() {
	// TODO send a TEST SERVER RESET message
	// so any test game objects are cleared
   ok(true, "Server state reset successful");
});

test("Create game objects", function() {

	// TODO send several CREATE ENTITY messages
	//client.publish(fayechannel, testmessage);
	ok(true, 'Faye published {ob:"ject"} to ' + fayechannel);
	// TODO verify entities were created
});

client.unsubscribe(fayechannel);

})();
