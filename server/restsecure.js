var log = require('./log'),
    core = require('./core'),
    urlLib = require('url');
    
var RestAuthenticator = core.Class.extend(
    {
        credentials: {
            TestUser: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8'
        },
        init: function(options) {
            
            var self = this;
            
            self.options = core.extend(
                { 
                    logFailures : false
                },
                options
            );

            self.secrets = { };

            log.message('Rest API Authenticator instantiated');
        },
        /*
         * Verify request authentication
         * 
         * returns false iff auth fails
         *
         * //TODO stub
         */
        isValid: function(context, opts) {

            var self = this,
                query = context.query,
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
        newSecret: function(uid) {
            var self = this,
                secret = self._genSecret();

            self.secrets[uid] = secret;

            return secret;
        },

        /*
         * Generate a candidate secret
         * TODO stub
         */
        _genSecret: function() {
            
            // Just trying to make something random.. not sure if this is the best way..
            return Math.floor(16777216 + Math.random() * 251658239).toString(16).toUpperCase() + (new Date()).getTime().toString(16).toUpperCase();
        }
    }
);

exports.RestAuthenticator = RestAuthenticator;
