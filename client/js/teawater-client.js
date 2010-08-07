(function($, F) {
    
    // If the client passes a callback to TeaWater, it gets bound to the connect event!
    var TeaWater = function(connectHandler) {
        
        if(connectHandler) { TeaWater.on('connected', connectHandler); }
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
            channel: {
                meta: '/meta',
                player: '/v1/resource/player',
                entity: '/v1/resource/entity'
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
            return self.data;
        },
        mapResponse: function(response) {
            
            if(!response || response.hasOwnProperty('error')) {
                
                TeaWater.log('The server returned an error! Not sure how we should deal with this yet...', TeaWater.logType.error);
                return false;
            }
            
            return response;
        },
        query: function(complete) {
            
            var self = this;
            complete = complete ? complete : $.noop;
            
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
            listeners: {},
            on: function(event, listener) {
                
                var self = this;
                
                if(!self.listeners.hasOwnProperty(event)) {
                    
                    self.listeners[event] = [];
                }
                
                self.listeners[event].push(listener);
            },
            _timestamp: function() {
                
                return (new Date()).getTime();
            },
            _hash: function() {
                
                return str_sha1(arguments.join());
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
                
                if(self.listeners[event]) {
                    $.each(
                        self.listeners[event],
                        function(i, l) {
                            
                            l(data);
                        }
                    );
                }
            },
            cancel: function(event, listener) {
                
                var self = this;
                
                $.each(
                    self.listeners,
                    function(i, l) {
                        if(l == listener) {
                            
                            self.listeners.splice(i, 1);
                            return false;
                        }
                    }
                );
            },
            // Connect to the server. Username should be specified by the client.
            connect: function(options) {
                
                var self = this;
                
                options = $.extend(
                    {
                        username: "",
                        restEndpoint: "http://localhost:8000",
                        cometEndpoint: "http://localhost:8000/comet"
                    },
                    options
                );
                
                self.restClient = new self.Query(
                    {
                        id: 'Rest Client',
                        url: function() {
                            
                            var self = this;
                            return self._data.endpoint + (self._data.path || "");
                        },
                        mapQuery: function() {
                            
                            var self = this;
                            return self._data.parameters;
                        }
                    }
                );
                
                self.restClient.data(
                    {
                        endpoint: options.restEndpoint,
                        path: TeaWater.channel.player,
                        parameters: {
                            username: options.username
                        }
                    }
                );
                
                self.restClient.ajaxOptions(
                    {
                        type: 'PUT'
                    }
                );
                
                self.restClient.query(
                    function(response) {
                        
                        if(response) {
                            
                            if(response.id && response.secret) {
                                
                                self.cometClient = new F.Client(options.cometEndpoint);
                                
                                self._dispatch(
                                    'connected',
                                    {
                                        id: response.id,
                                        secret: response.secret
                                    }
                                );
                                
                                // TODO: Connect to client's authenticated comet channel...
                            }
                        }
                    }
                );
            }
        }
    );
    
    // Add TeaWater to jQuery =]
    $.extend($, { tw: TeaWater });
})(jQuery, Faye);