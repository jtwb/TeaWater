(function($, F) {
    
    // If the client passes a callback to TeaWater, it gets bound to the connect event!
    var TeaWater = function(connectHandler) {
        
        if($.isFunction(connectHandler)) { 
            TeaWater._invalidate();
            TeaWater.on('connected', connectHandler); 
        }
        
        return TeaWater;
    };
    
    TeaWater.extend = function(extension) {
        
        $.extend(TeaWater, extension);
    };
    
    TeaWater.extend(
        {
            // Logging methods and enumerators..
            logType: {
                
                debug: "[ D ]",
                warning: "[ W ]",
                error: "[ E ]"
            },
            log: function(message, type) {
                
                type = type || TeaWater.logType.debug;
                
                try {
                    
                    console.log(type + " " + message);
                } catch(e) { /* Console.log not supported... */ }
            },
            // The Query class, for sandboxing AJAX calls (see prototype below)..
            Query: function(options) {
                
                var self = this;
                
                $.extend(self, options);
            }
        }
    );
    
    TeaWater.Query.prototype = {
        
        id: "",
        url: "",
        lastResponse: null,
        data: function(data, replace) {
            
            var self = this;
            
            if(replace !== false) {
                
                self._data = $.extend(
                    self._data || {},
                    data
                );
            } else {
                
                self._data = data;
            }
        },
        ajaxOptions: function(ajaxOptions, replace) {
            
            var self = this;
            
            if(replace !== false) {
                
                self._ajaxOptions = $.extend(
                    self._ajaxOptions || {
                        dataType: 'json',
                        type: "GET",
                        async: true,
                        cache: true
                    },
                    ajaxOptions
                );
            } else {
                
                self._ajaxOptions = ajaxOptions;
            }
        },
        mapQuery: function() {
            
            var self = this;
            return self._data;
        },
        mapResponse: function(response) {
            
            if(!response) {
                
                TeaWater.log('Got a null response from the server. Something isn\'t working right...', TeaWater.logType.error);
                return false;
            } else if(response.hasOwnProperty('error')) {
                
                TeaWater.log('The server returned an error! Error: ' + response.error, TeaWater.logType.error);
                return false;
            }
            
            return response;
        },
        query: function(complete) {
            
            var self = this;
            complete = complete || $.noop;
            
            if(self.url && self.url != "") {
                $.ajax(
                    $.extend(
                        {
                            url: $.isFunction(self.url) ? self.url() : self.url,
                            data: self.mapQuery(),
                            error: function() {
                                
                                TeaWater.log('There was an error making an AJAX call to ' + self.url, TeaWater.logType.error);
                            },
                            success: function(response, status, xhr) {
                                
                                self.lastResponse = response;
                                complete(self.mapResponse(response), self);
                            }
                        },
                        self._ajaxOptions
                    )
                );
            } else {
                
                complete(self.mapResponse(self.mapQuery(self)));
            }
        }
    }
    
    TeaWater.extend(
        {
            _timestamp: function() {
                
                return (new Date()).getTime();
            },
            _hash: function() {
                
                return str_sha1(arguments.join());
            },
            _channel: {
                meta: '/meta',
                player: '/resource/player',
                entity: '/resource/entity'
            },
            _rest: function(method, path, parameters, callback) {
                
                var self = this;
                
                self._restClient = self._restClient || new self.Query();
                
                $.extend(
                    self._restClient,
                    {
                        id: 'Rest Client',
                        url: function() {
                            
                            return self._options.restEndpoint + (path || "");
                        }
                    }
                );
                
                self._restClient.data(
                    parameters,
                    false
                );
                
                self._restClient.ajaxOptions(
                    {
                        type: method
                    }
                );
                
                self._restClient.query(callback);
                
            },
            _comet: function(channel, message) {
                
                var self = this;
                
                self._cometClient = self._cometClient || new F.Client(self._options.cometEndpoint);
                self._cometClient.publish(channel, message);
            },
            _generateSignature: function(request) {
                
                var self = this;
                
                if(request && self._userId && self._sharedSecret) {
                    
                    return self._hash(request, self._userId, self._sharedSecret, self._timestamp());
                } else {
                    
                    return false;
                }
            },
            _dispatch: function(event, data) {
                
                var self = this;
                
                if(self._listeners && self._listeners[event]) {
                    $.each(
                        self._listeners[event],
                        function(i, l) {
                            
                            l(data);
                        }
                    );
                }
            },
            _invalidate: function() {
                
                var self = this;
                
                self._connected = false;
                self._sharedSecret = null;
                self._options = null;
                
                // TODO: Unsubscribe from any open Faye channels..
                delete self._restClient;
                delete self._cometClient;
            },
            on: function(event, listener) {
                
                var self = this;
                
                self._listeners = self._listeners || {};
                
                if(!self._listeners.hasOwnProperty(event)) {
                    
                    self._listeners[event] = [];
                }
                
                self._listeners[event].push(listener);
                
                return self;
            },
            cancel: function(event, listener) {
                
                var self = this;
                
                if(self._listeners && self._listeners.hasOwnProperty(event)) {
                    $.each(
                        self._listeners[event],
                        function(i, l) {
                            if(l == listener) {
                                
                                self._listeners[event].splice(i, 1);
                                return false;
                            }
                        }
                    );
                }
                
                return self;
            },
            clear: function(event) {
                
                var self = this;
                
                if(self._listeners && self._listeners.hasOwnProperty(event)) {
                    
                    self._listeners[event] = [];
                }
                
                return self;
            },
            reset: function(event) {
                
                var self = this;
                
                TeaWater.log('Resetting client engine state!', TeaWater.logType.warning);
                self._invalidate();
                self._listeners = {};
            },
            // Connect to the server. Username should be specified by the client.
            connect: function(options) {
                
                var self = this;
                
                self._options = $.extend(
                    {
                        username: "",
                        restEndpoint: "http://localhost:8000/v1",
                        cometEndpoint: "http://localhost:8000/comet"
                    },
                    options
                );
                
                self._rest(
                    'POST',
                    self._channel.player,
                    {
                        username: self._options.username
                    },
                    function(response) {
                        
                        if(response) {
                            
                            if(response.id && response.secret) {
                                
                                self._userID = response.id;
                                self._sharedSecret = response.secret;
                                self._connected = true;
                                
                                self._dispatch(
                                    'connected',
                                    {
                                        id: response.id
                                    }
                                );
                            } else {
                                
                                self._dispatch(
                                    'error',
                                    "Player connection refused!"
                                );
                            }
                        }
                    }
                );
                
                return self;
            },
            // Disconnect client and clean up TeaWater settings.
            disconnect: function() {
                
                var self = this;
                
                self._invalidate();
                self._dispatch('disconnected', {});
                
                return self;
            },
            entityType: {
                resource: 'resource',
                unit: 'unit'
            },
            setEntity: function(entity, x, y) {
                
                var self = this;
                self._rest(
                    'post',
                    self._channel.entity,
                    {/* TODO */},
                    function(response) {
                        // TODO
                        self._dispatch('updated', {})
                    }
                );
            },
            getEntity: function(x, y) {
                
                var self = this;
                self._rest(
                    'get',
                    self._channel.entity,
                    {/* TODO */},
                    function(response) {
                        // TODO
                        self._dispatch('updated', {})
                    }
                );
            }
        }
    );
    
    // Add TeaWater to jQuery =]
    $.extend($, { tw: TeaWater });
})(jQuery, Faye);