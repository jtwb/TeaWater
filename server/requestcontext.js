var log = require('./log'),
    core = require('./core'),
    urlLib = require('url');
    
var RequestContext = core.Class.extend(
    {
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                { },
                options
            );

            if (!('request' in options)) {
                log("Error: no request given to RequestContext constructor", 'error');
            }

            self = core.extend(self, self.extract(self.options.request));
        },
        
        extract: function(request) {
            var context = urlLib.parse(request.url, true),
                pathparts = context.pathname.split('/');

            context.method = request.method;

            context.query = context.query || {};

            context.format = context.query.format || 'json';

            if (context.format == 'jsonp') {
                context.callback = context.query.callback || 'twapi';
            }

            context.version = (pathparts[1].match(/\d+/) || [])[0];
            context.apipath = context.pathname.replace(/^.*resource/, ""); 

            log.inspect(request.url);
            log.inspect(context);

            return context;
        }
    }
);

exports.RequestContext = RequestContext;
