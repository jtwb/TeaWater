var log = require('./log'),
    core = require('./core'),
    restsecure = require('./restsecure');
    
var RestApi = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                { },
                options
            );

            self.world = options.world || {};

            self.authenticator = new restsecure.RestAuthenticator({
                logFailures : true
            });

            log.message('Rest API instantiated');
        },
        
        /*
         * Convert requests into user actions
         * send user actions to user action queue
         *
         * TODO stub
         */
        handle: function(request, response) {

            var self = this;

            log.message('Rest API received ' + request.method + ' request: ' + request.url);
            // strip and decode authentication
            // verify message validity
            if (!self.authenticator.isValid(request)) {
                self.accessDenied(response);
                return;
            }

            // if post / delete / get:
            //   select world objects affected by query
            //   check action permissions by uid
            // if put
            //   check creation policy for uid, object type, location

            // if we're good, commit change to world
        }, 

        ok: function(response) {
            var self = this;
            self.respond(200, { error: "Request processed" }, response);
        },

        accessDenied: function(response) {
            var self = this;
            self.respond(403, { error: "Access denied" }, response);
        },

        /*
         * Send JSON response
         */
        respond: function(code, content, response) {
            var json = JSON.stringify(content);
            response.writeHead(code, {
                'Content-Length': json.length,
                'Content-Type': 'text/plain'
            });
            response.write(json);
            response.end();
        }
    }
);

exports.RestApi = RestApi;
