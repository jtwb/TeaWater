
(function(){

var und = function(x) {
	return typeof x === 'undefined';
};

var apibase = "http://localhost:8000/v1/resource";

var fayechannel = '/apitest',
    fayeclient = new Faye.Client('http://localhost:8000/comet');

var noop = function(message) {},
    callback = noop,
    handle = fayeclient.subscribe(fayechannel, function(message){
    callback.apply(this, arguments);
});

/*
 * Reset the server at the start
 */
test("Reset server state", function() {
   callback = function(message) {
     ok(true, "Server state reset successful");
     start();
     callback = noop;
   };
   fayeclient.publish(fayechannel, {command:"reset"});
   stop();
});

/*
 * Join the server
 */
test("Join server", function() {
    $.ajax({
        type: "PUT",
        url: apibase + "/meta",
        data: "username=Jasonator&clientVersion=0.1.1",
        success: function(message) {
            ok(true, "Server responded OK to join request");
            start();
        },
        error: function(message) {
            ok(false, "Server failed in join request");
            start();
        }
    });
    stop();
});

test("Create game objects", function() {

	// TODO send several CREATE ENTITY messages
	//client.publish(fayechannel, testmessage);
	ok(true, 'Faye published {ob:"ject"} to ' + fayechannel);
	// TODO verify entities were created
});

})();
