var log = require('./log'),
    core = require('./core');

var UserAction = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                { },
                options
            );
        },
        serialize: function() {
            
            var self = this;
            return self.options;
        }
    }
);

exports.UserAction = UserAction;
