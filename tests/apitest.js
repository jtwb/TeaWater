
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

var apiquery = function(method, path, data, success) {
    $.ajax({
        type: method,
        url: apibase + path,
        data: data,
        dataType: 'json',
        success: success,
        error: function(xhr, status) {
            ok(false, "Request failed");
            start();
        }
    });
};

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
    var username = "Jasonator";
    stop();
    // POST user
    apiquery("POST", "/player",
        {username: username, clientVersion:"0.1.1"},
        function (response, status) {
            ok(
                ('id' in response)
                && ('secret' in response),
                "Server returned ID and secret in response to join request");
            start();
    });
});

test("Verify new user", function() {
    var username = "Jasonator";
    stop();
    //verify that user was created
    apiquery("GET", "/player",
        null,
        function (response, status) {
            ok(
                ('id' in response)
                && ('username' in response),
                "Follow-up GET request returns id and username");
            equal(response.username, username,
                "Follow-up GET request contains correct username");
            start();
    });
});

test("Create game object", function() {

    stop();
    apiquery("POST", "/entity", {
            type : 'Water',
            pos : [6, 6],
            level : 1
        }, function (response, status) {
            ok(
                ('id' in response),
                "Server returned ID in response to POST request");
            start();
    });
});

test("Create second game object", function() {

    stop();
    apiquery("POST", "/entity", {
            pos : [6, 5],
            type : "Plant",
            level : 1
        }, function (response, status) {
            ok(
                ('id' in response),
                "Server returned ID in response to POST request");
            start();
    });
});

test("Update first game object", function() {

    stop();
    apiquery("PUT", "/entity?id=2100", {
            pos : [6, 6],
            type : "Water",
            level : 2
        }, function (response, status) {
            ok(('id' in response),
                "Server returned ID in response to PUT request");
            ok(('level' in response) && (response.level == 2),
                "Server upgraded record level");
            start();
    });
});

})();
