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
                    return self.handleEntityGet(context);
                    break;
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

        handlePlayerGet : function(context) {
            return { 
                id : 1100,
                username : "Jasonator"
            };
        },

        handleEntityGet : function(context) {
            return {
                id : 2100,
                pos : [6, 6],
                type : "Water",
                level : 1
            }
        },

        handlePlayerPut : function(context) {
            return {
                id : 1100,
                secret : "234509g9re9gjer039035"
            };
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
