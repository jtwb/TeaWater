var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    faye = require('faye'),
    json = require('./json'),
    log = require('./log'),
    teawater = require('./engine');
    
var comet = new faye.NodeAdapter({mount: '/fayeclient', timeout: 45}),
    client = comet.getClient();

var port = 8000;

var state = {};

var engine = new (teawater.Engine)();

client.subscribe(
    '/general', 
    function(message) {
    
        if (!message.client || !message.type) return;
        
        log.message('sync noticed message from client ' + message.client);
        log.message('message type == ' + message.type);
        
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
    
    }
);

log.message('Listening on ' + port);

http.createServer(
    function(req, resp) {
        
        sys.puts(req.method + ' ' + req.url);
        
        if (comet.handle(req, resp)) {
            
            log.message('** Handled by faye');
            return;
        }
        
        var path = (req.url === '/') ? '/index.html' : req.url;
        
        if (path === '/sync') {
            
            log.message('** Handled by syncserver');
            
            resp.sendHeader(200, {'Content-Type': 'text/html'});
            resp.write(json.stringify(state));
            resp.close();
            
            return;
        }
        
        log.message('** Handled by file server');
        
        fs.readFile('./static/' + path).addCallback(
            function(content) {
                resp.sendHeader(200, {'Content-Type': 'text/html'});
                resp.write(content);
                resp.close();
            }
        ).addErrback(
            function(){
                resp.sendHeader(404, {'Content-Type': 'text/html'});
                resp.write('<html><head><title>404 not found</title></head><body>404 Not Found</body></html>');
                resp.close();
            }
        );
    }
).listen(port);

engine.run();