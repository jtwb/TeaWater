var log = require('./log'),
    core = require('./core');

var Entity = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                {
                    age: 0,
                    type: "entity",
                    state: "static",
                    x: -1,
                    y: -1
                },
                options
            );
        },
        invalidate: function() {
            
            var self = this;
            self.options.age++;
        },
        serialize: function() {
            
            var self = this;
            return self.options;
        }
    }
);

var Plant = Entity.extend(
    {
        invalidate: function() {
            
            var self = this;
            self._super(
                {
                    type: "plant"
                }
            );
            
            if(self.options.age > 5) {
                self.options.state = "dead";
                self.emit('change', self);
            }
        }
    }
);

exports.Entity = Entity;
exports.Plant = Plant;