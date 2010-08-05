var log = require('./log'),
    core = require('./core'),
    server = require('./server'),
    rest = require('./restapi'),
    world = require('./world'),
    entity = require('./entity');

var Engine = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                {
                    frameInterval: 1000
                },
                options
            );
            
            log.message("Engine initialized with frame interval " + self.options.frameInterval);
        },
        
        start: function() {
            
            var self = this;
            
            self.world = new world.World();
            self.rest = new rest.RestApi({world:self.world});
            self.server = new server.Server({rest:self.rest});

            self.server.start();
            
            self.world.addListener(
                'change',
                function(delta) {
                    
                    log.message('Server sending update with ' + delta.length + ' new entity states!')
                    
                    self.server.comet.getClient().publish(
                        '/world',
                        {
                            type: 'serverUpdate',
                            delta: delta
                        }
                    );
                }
            );
            
            self.client = self.server.comet.getClient();
            self.client.subscribe(
                '/world',
                function(message) {
                    
                    if(message.hasOwnProperty('type') && message.type == 'clientUpdate') {
                        
                        log.message('Received update from client. Planting at (' + message.x + ', ' + message.y + ')');
                        
                        self.world.setTile(
                            new (entity.Plant)(
                                {
                                    x: message.x,
                                    y: message.y
                                }
                            )
                        );
                    }
                }
            );
            
            self.frameExecution = setInterval(
                function() {
                    self.executeFrame();
                },
                self.options.frameInterval
            );
            
            log.message("Engine starting!");
        },
        
        stop: function() {
            
            var self = this;
            clearInterval(self.frameExecution);
            
            log.message("Engine stopping!");
        },
        
        executeFrame: function() {
            
            var self = this;
            self.world.invalidate();
            // Game logic..
            
        }
    }
);

exports.Engine = Engine;
