var log = require('./log'),
    core = require('./core'),
    requestcontext = require('./requestcontext'),
    restimpl = require('./restapiimpl'),
    urlLib = require('url'),
    restsecure = require('./restsecure');
    
var RestApi = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend( {
                    world : null
                },
                options
            );

            self.world = self.options.world || {};

            self.impl = new restimpl.RestApiImpl({world:self.world});

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

            var context = new requestcontext.RequestContext({request:request});


            // strip and decode authentication
            // verify message validity
            if (!self.authenticator.isValid(context)) {
                log.message('... Ignored, authenticator disabled', 'error');
            // TODO disabled for now
            //    self.accessDenied(context, response);
            //    return;
            }

            // if post / delete / get:
            //   select world objects affected by query
            //   check action permissions by uid
            // if put
            //   check creation policy for uid, object type, location

            // if we're good, commit change to world
            self.ok(self.impl.handle(context), context, response);
        }, 

        ok: function(message, context, response) {
            var self = this;
            self.respond(200, message, context, response);
        },

        accessDenied: function(context, response) {
            var self = this;
            self.respond(403, { error: "Access denied" }, context, response);
        },

        /*
         * Send JSON response
         */
        respond : function(code, content, context, response) {
            var self = this;
            log.message("Responding code " + code);
            log.inspect(content);
            switch (context.format) {
                default:
                case 'json' :
                    return self.respondJson(code, content, context, response);
                    break;
                case 'jsonp' :
                    return self.respondJsonp(code, content, context, response);
                    break;
            }
        },

        respondJson : function(code, content, context, response) {
            var json = JSON.stringify(content || {});
            response.writeHead(code, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Content-Length': json.length,
                'Content-Type': 'text/plain'
            });
            response.write(json);
            response.end();
        },

        respondJsonp : function(code, content, context, response) {
            var json = JSON.stringify(content || {}),
                output = context.callback + "(" + json + ");";
            response.writeHead(code, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Content-Length': output.length,
                'Content-Type': 'text/plain'
            });
            response.write(output);
            response.end();
        }
    }
);

exports.RestApi = RestApi;
