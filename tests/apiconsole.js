
$(function(){

console.log

var und = function(x) {
	return typeof x === 'undefined';
};

WorldConsole = function(el) {

    var self = this,
        worldLogEl = $('<ol />').appendTo('#world'),
        fayechannel = '/world',
        fayeclient = new Faye.Client('http://localhost:8000/comet'),
        onCometPush, subscription;
    console.log(worldLogEl);

    onCometPush = function(message) {
        var output = JSON.stringify(message);
        console.log(output);
        worldLogEl.append('<li>' + output + '</li>');
    };

    subscription = fayeclient.subscribe(fayechannel, onCometPush);

/*
    var send = function(){
        console.log('sending message');
        fayeclient.publish(fayechannel, {command:"reset"});
    };
    setInterval(send, 4000);
*/

};

new WorldConsole('#world');

});
