var log = require('./log'),
    core = require('./core');

(function() {
    this.Engine = core.Class.extend(
        {
            init: function(options) {
                
                var self = this;
                options = core.extend(
                    {
                        frameInterval: 1000
                    },
                    options
                );
                
                self.frameInterval = options.frameInterval;
                
                log.message("Engine initialized with frame interval " + self.frameInterval);
            },
            
            run: function() {
                
                var self = this;
                self.frameExecution = setInterval(
                    self.executeFrame,
                    self.frameInterval
                );
                
                log.message("Engine running!");
            },
            
            stop: function() {
                
                var self = this;
                clearInterval(self.frameExecution);
                
                log.message("Engine stopping!");
            },
            
            executeFrame: function() {
                
                // Game logic..?
            }
        }
    );
})();

exports.Engine = Engine;