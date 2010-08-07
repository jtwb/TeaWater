var log = require('./log'),
    core = require('./core'),
    urlLib = require('url'),
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

            var context = self.setupRequestContext(request);


            // strip and decode authentication
            // verify message validity
            if (!self.authenticator.isValid(context)) {
                self.accessDenied(context, response);
                return;
            }

            ok(context, response);

            // if post / delete / get:
            //   select world objects affected by query
            //   check action permissions by uid
            // if put
            //   check creation policy for uid, object type, location

            // if we're good, commit change to world
        }, 

        setupRequestContext: function(request) {
            var context = urlLib.parse(request.url, true);

            context.query = context.query || {};

            log.inspect(request.url);
            log.inspect(context);

            context.format = context.query.format || 'json';

            if (context.format == 'jsonp') {
                context.callback = context.query.callback || 'twapi';
            }

            return context;
        },

        ok: function(context, response) {
            var self = this;
            self.respond(200, { error: "Request processed" }, context, response);
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
            var json = JSON.stringify(content);
            response.writeHead(code, {
                'Content-Length': json.length,
                'Content-Type': 'text/plain'
            });
            response.write(json);
            response.end();
        },

        respondJsonp : function(code, content, context, response) {
            var json = JSON.stringify(content),
                output = context.callback + "(" + json + ");";
            response.writeHead(code, {
                'Content-Length': output.length,
                'Content-Type': 'text/plain'
            });
            response.write(output);
            response.end();
        }
    }
);

exports.RestApi = RestApi;
