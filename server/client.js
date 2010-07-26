var log = require('./log'),
    core = require('./core');

(function() {
    
    this.Client = core.Class.extend(
        {
            init: function(options) {
                
                var self = this;
                
                options = core.extend(
                    {
                        
                    },
                    options
                );
            }
        }
    );
    
    this.authenticate = function(/* TODO: Credentials? */) {
        
        
        
    };
    
})();

exports.authenticate = authenticate;