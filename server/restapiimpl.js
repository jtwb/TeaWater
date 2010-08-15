var log = require('./log'),
    core = require('./core');
    
var RestApiImpl = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                { },
                options
            );

            self.world = options.world || {};

            log.message('Rest API Impl instantiated');
        },
        
        /*
         * Convert requests into user actions
         * send user actions to user action queue
         *
         * TODO stub
         */
        handle: function(context) {

            var self = this,
                request = context.method + " " + context.apipath;
            log.message('Rest API Impl handling:');
            log.inspect(context);
            switch (request) {
                case "GET /player" :
                    return self.handlePlayerGet(context);
                    break;
                case "GET /entity" :
                    return self.handleUnitGet(context);
                    break;
                case "POST /player" :
                    return self.handlePlayerPost(context);
                    break;
                case "POST /entity" :
                    return self.handleUnitPost(context);
                    break;
                case "PUT /player" :
                    return self.handlePlayerPut(context);
                    break;
                case "PUT /entity" :
                    return self.handleUnitPut(context);
                    break;
                case "DELETE /player" :
                    return self.handlePlayerDelete(context);
                    break;
                case "DELETE /entity" :
                    return self.handleUnitDelete(context);
                    break;
                default :
                    return self.handleUnknown(context);
            }
        }, 

        handleUnknown: function(context) {
            return { error : "Unknown method " + context.method + " " + context.pathname };
        },

        handlePlayerGet : function(context) {
            var self = this;
            return self.world.getEntity('player', context.id);
        },

        handleUnitGet : function(context) {
            var self = this;
            return self.world.getEntity('unit', context.id);
        },

        handlePlayerPost : function(context) {
            var self = this;
            return self.world.putEntity('player', context);
        },

        handleUnitPost: function(context) {
            var self = this;
            return self.world.putEntity('unit', context);
        },

        handlePlayerPut : function(context) {
            var self = this;
            return self.world.updateEntity('player', context.id);
        },

        handleUnitPut: function(context) {
            var self = this;
            return self.world.updateEntity('unit', context.id);
        },

        handlePlayerDelete : function(context) {
            var self = this;
            return self.world.deleteEntity('player', context.id);
        },

        handleUnitDelete : function(context) {
            var self = this;
            return self.world.deleteEntity('unit', context.id);
        }
    }
);

exports.RestApiImpl = RestApiImpl;
