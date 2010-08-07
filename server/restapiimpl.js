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
                case "PUT /player" :
                    return self.handlePlayerPut(context);
                    break;
                case "PUT /entity" :
                    return self.handleEntityPut(context);
                    break;
                case "POST /entity" :
                    return self.handleEntityPost(context);
                    break;
                case "DELETE /entity" :
                    return self.handleEntityDelete(context);
                    break;
                default :
                    return self.handleUnknown(context);
            }
        }, 

        handleUnknown: function(context) {
            return { error : "Unknown method " + context.method + " " + context.pathname };
        },

        handlePlayerPut : function(context) {
            return { message : "OK Yay, Player Put" };
        },

        handleEntityPut : function(context) {
            return { message : "OK Yay, Entity Put" };
        },

        handleEntityPost : function(context) {
            return { message : "OK Yay, Entity Post" };
        },

        handleEntityDelete : function(context) {
            return { message : "OK Yay, Entity Delete" };
        }
    }
);

exports.RestApiImpl = RestApiImpl;
