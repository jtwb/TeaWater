var sys = require('sys');

/*
 * GameEnginePipeline class
 * 
 * Essentially a queue of un-processed game actions
 * The game engine will query this queue on every
 * frame.  The engine might proccess the whole queue
 * per-frame, in which case this just needs to be a set
 * of (action, timestamp) tuples.
 */
GameEnginePipeline = function() {
   this.actions = [];
};

GameEnginePipeline.prototype._add = function (

  action

) {
   var d = new Date();

   this.actions.push( {

      't' : d.getTime(),

      'a' : action

   });

};

/*
 * method handshake
 *
 * New client will call GET /game
 * to request an auth token and initial setup.
 *
 * A "new player" event is added to the queue
 */
GameEnginePipeline.prototype.handshake = function (

   /*
    * node-server request object
    *
    * unused
    */
   req, 

   /*
    * node-server response object
    *
    * Server must inform client of
    * client's auth token.  Initial position,
    * etc, should be broadcast by the game
    * engine in response to the "new player"
    * event.
    */
   resp
) {
   sys.log('** Handshake: ');
   sys.log('* Queue: add New Player');
   var authToken = Math.floor(
      Math.random() * Math.pow(10,12)
   );
   this.send(resp, 
};

GameEngine.prototype.sync = function(req, resp) {
  sys.puts('** Handled by game engine');
  this.send(resp, this.getState());
};

/*
 * Send an object as json
 * with a 200 HTTP response code
 */
GameEngine.prototype.send = function(resp, data) {
  sys.puts('** Sending data');
  resp.sendHeader(200, {'Content-Type': 'application/json'});
  resp.write(json.stringify(data));
  resp.close();
};

/*
 * Send an error message as json
 * with given error code
 */
GameEngine.prototype.error = function(resp, data, code) {
  sys.puts('** Sending error');
  code = code || 500; // TODO pick a good default error code
  resp.sendHeader(code, {'Content-Type': 'application/json'});
  resp.write(json.stringify(error));
  resp.close();
};

/*
client.subscribe('/general', function(message) {
// TODO discard malformed messages
   if (!message.client || !message.type) return;
   sys.puts('sync noticed message from client ' + message.client);
   sys.puts('message type == ' + message.type);
   switch (message.type) {
      case 'place' :
         state[message.el] || (state[message.el] = {});
         process.mixin(state[message.el], {
            x: message.x,
            y: message.y
         });
         break;
      case 'text' :
         process.mixin(state[message.el], {
            text: message.text,
         });
         break;
      case 'delete' :
         delete state[message.el];
         break;
   }
   sys.puts("state: ");
   sys.puts(json.stringify(state));
});

*/

exports.GameEngine = GameEngine;
