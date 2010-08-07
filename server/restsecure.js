var log = require('./log'),
    core = require('./core'),
    urlLib = require('url'),
    crypto = require('crypto');
    
var RestAuthenticator = core.Class.extend(
    {
        
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                { 
                    logFailures : false
                },
                options
            );

            self.credentials = { };

            log.message('Rest API Authenticator instantiated');
        },
        /*
         * Verify request authentication
         * 
         * returns false iff auth fails
         *
         * //TODO stub
         */
        isValid: function(request, opts) {

            var self = this,
                query = urlLib.parse(request.url, true).query || {},
                authKeys = ['uid', 'time', 'sig'],
                authVals = {},
                localSig = '';

            log.message('Authenticator checking validity of request');
            log.inspect(query);

            // assert all keys are present
            for (i in authKeys) {
                var key = authKeys[i];
                if (key in query) {
                    authVals[key] = query[key];
                } else {
                    self.options.logFailures
                    && log.message('INVALID: missing key ' + key, 'error');
                    return false;
                }
            }

            // build signature locally
            // (code should live in outside class)
            // compare local sig to request sig

            log.message('Authenticated as uid ' + authVals.uid);

            return true;
        },

        /*
         * Return new shared secret for user by ID
         */
        addUser: function(uid) {
            var self = this,
                secret = self._genSecret();

            self.credentials[uid] = secret;

            return secret;
        },

        /*
         * Generate a candidate secret
         * TODO stub
         */
        _genSecret: function() {
            
            // Just trying to make something random..
            return crypto.createHash('sha1').update(Math.floor(16777216 + Math.random() * 251658239).toString(16).toUpperCase() + (new Date()).getTime().toString(16).toUpperCase()).digest('hex');
        }
    }
);

exports.RestAuthenticator = RestAuthenticator;
