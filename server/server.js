var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    json = require('./json'),
    faye = require('faye'),
    enginepipeline = require('./enginepipeline');

var comet = new faye.NodeAdapter({mount: '/fayeclient', timeout: 45}),
    client = comet.getClient(),
    pipeline = new enginepipeline.GameEnginePipeline();

var port = 8000;

sys.puts('Listening on ' + port);

http.createServer(function(req, resp) {
   sys.puts(req.method + ' ' + req.url);
   if (comet.handle(req, resp)) {
      sys.puts('** Handled by faye');
      return;
   }

  if (req.url == '/game') {
    switch (req.method) {
      case 'GET' :
        pipeline.handshake(req, resp);
        break;
      case 'PUT' :
        pipeline.create(req, resp);
        break;
      case 'POST' :
        pipeline.update(req, resp);
        break;
    }
  }
}).listen(port);

