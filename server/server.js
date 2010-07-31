var http = require('http'),
    faye = require('faye'),
    log = require('./log'),
    core = require('./core');
    
(function() {
    
    this.Server = core.Class.extend(
        {
            init: function(options) {
                
                var self = this;
                
                self.options = core.extend(
                    {
                        mount: '/comet',
                        port: 8000
                    },
                    options
                );
                
                log.message('Server instantiated')
            },
            
            start: function() {
                
                var self = this;
                
                self.http = http.createServer(
                    function(request, response) {
                        
                        log.message('Server received ' + request.method + ' request: ' + request.url);
                        
                    }
                );
                
                
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
    
})()

exports.Server = Server;