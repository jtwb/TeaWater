var log = require('./log'),
    core = require('./core'),
    entity = require('./entity');

var World = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                {
                    width: 10,
                    height: 10
                },
                options
            );

            self.handleChangedEntity = function(changedEntity) {
                self.delta.push(changedEntity.serialize());
            }
            
            self.clearState();
        },
        clearState: function() {
            
            var self = this;
            
            self.delta = [];
            self.entities = [];
            self.map = [];
            
            for(var x = 0; x < self.options.width; x++) {
                for(var y = 0; y < self.options.height; y++) {
                    self.map[x + (y * self.options.height)] = false;
                }
            }
        },
        invalidate: function() {
            
            var self = this,
                iter = 0,
                e;
            
            while(e = self.entities[iter]) {
                
                e.invalidate();
                
                if(e.options.state == 'dead') {
                    
                    e.removeListener('change', self.handleChangedEntity);
                    
                    self.map[e.options.x + (e.options.y * self.options.height)] = false;
                    self.entities.splice(iter, 1);
                } else {
                    iter++;
                }
            }
            
            // force push (get it?)
            //if (true) {
            if(self.delta.length) {
                self.emit('change', self.delta);
            }
            
            self.delta = [];
        },
        serialize: function() {
            
            var self = this;
            return {
                entities: self.entities,
                map: self.map
            }
        },
        setTile: function(entity) {
            
            var self = this;
            
            self.map[entity.options.x + (entity.options.y * self.options.height)] = entity;
            self.entities.push(entity);
            
            entity.addListener(
                'change',
                self.handleChangedEntity
            );
            
            self.delta.push(entity.serialize());
        },
        /*
         * Search world for object given by
         * @type@ and @key@
         */
        getEntity: function(type, id) {
            switch (type) {
                case 'player' :
                    return { 
                        id : 1100,
                        username : "Jasonator"
                    };
                default :
                case 'unit' :
                    return {
                        id : 2100,
                        pos : [6, 6],
                        type : "Water",
                        level : 1
                    };
            }
        },
        putEntity: function(type, obj) {
            switch (type) {
                case 'player' :
                    return {
                        id : 1100,
                        secret : "234509g9re9gjer039035"
                    };
                default :
                case 'unit' :
                    return { 
                        id : 2100,
                        type : 'Water',
                        pos : [6, 6],
                        level : 1
                    };
            }
        },
        updateEntity: function(type, id, patch) {
            switch (type) {
                case 'player' :
                    return { message : "OK Yay, Player Update" };
                default :
                case 'unit' :
                    return { 
                        id : 2100,
                        type : 'Water',
                        pos : [6, 6],
                        level : 2
                    };
            }
        },
        deleteEntity: function(type, id) {
            switch (type) {
                case 'player' :
                    return { message : "OK Yay, Player Delete" };
                default :
                case 'unit' :
                    return { message : "OK Yay, Entity Delete" };
            }
        }
    }
);

exports.World = World;
