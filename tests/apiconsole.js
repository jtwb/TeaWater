
(function(){

var und = function(x) {
	return typeof x === 'undefined';
};

WorldConsole = function(el) {

    var self = this,
        worldLogEl = $('#world ul'),
        fayechannel = '/apitest',
        fayeclient = new Faye.Client('http://localhost:8000/comet'),
        onCometPush, subscription;
    console.log(worldLogEl);

    onCometPush = function(message) {
        console.log(JSON.stringify(message));
        worldLogEl.append('<li>' + message + '</li>');
    };

    subscription = fayeclient.subscribe(fayechannel, onCometPush);

var send = function(){
    console.log('sending message');
    fayeclient.publish(fayechannel, {command:"reset"});
};
setInterval(send, 4000);

};

new WorldConsole('#world');

})();
