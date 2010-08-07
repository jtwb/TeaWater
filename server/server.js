var http = require('http'),
    faye = require('faye'),
    log = require('./log'),
    core = require('./core');
    
var Server = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                {
                    mount: '/comet',
                    port: 8000,
                    rest: {}
                },
                options
            );

            self.rest = self.options.rest;

            log.message('Server instantiated');
        },
        
        start: function() {
            
            var self = this;

            self.http = http.createServer(function() {
                self.rest.handle.apply(self.rest, arguments);
            });
            
            self.comet = new faye.NodeAdapter(
                {
                    mount: self.options.mount, 
                    timeout: 45
                }
            );
            
            self.comet.attach(self.http);
            self.http.listen(self.options.port);
            
            log.message('Server mounted to ' + self.options.mount + ' and listening on port ' + self.options.port);
        },
        
        stop: function() {
        
        }
    }
);

exports.Server = Server;
