(function($, F) {
    
    var TeaWater = {
        
        logType: {
            
            debug: "[ D ]",
            warning: "[ W ]",
            error: "[ E ]"
        },
        log: function(message, type) {
            
            type = type || $.cf.logType.debug;
            
            try {
                
                console.log(type + " " + message);
            } catch(e) { /* Console.log not supported... */ }
        },
        extend: function(extension) {
            
            $.extend(TeaWater, extension);
        }
    };
    
    TeaWater.Query = function(options) {
        
        var self = this;
        $.extend(self, options);
    };
    
    TeaWater.Query.prototype = {
        
        id: "",
        url: "",
        lastResponse: null,
        _data: {},
        data: function(data, replace) {
            
            var self = this;
            
            if(replace !== false) {
                
                self._data = $.extend(
                    data,
                    self._data
                );
            } else {
                
                self._data = data;
            }
        },
        ajaxOptions: {
            
            type: "GET",
            async: true,
            cache: true,
            dataType: 'json'
        },
        mapQuery: function() {
            
            var self = this;
            return self.data;
        },
        mapResponse: function(response) {
            
            return response;
        },
        query: function(complete) {
            
            var self = this;
            complete = complete ? complete : $.noop;
            
            if(self.url && self.url != "") {
                $.ajax(
                    $.extend(
                        {
                            url: self.url,
                            data: self.mapQuery(),
                            error: function() {
                                TeaWater.log('There was an error making an AJAX call to ' + self.url, TeaWater.logType.error);
                            },
                            success: function(json, status, xhr) {
                                
                                self.lastResponse = json;
                                complete(self.mapResponse(json), self);
                            }
                        },
                        self.ajaxOptions
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
                
                $.each(
                    self.listeners[event],
                    function(i, l) {
                        
                        l(data);
                    }
                );
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
            connect: function(options) {
                
                var self = this;
                
                options = $.extend(
                    {
                        username: "",
                        password: "",
                        restEndpoint: "http://localhost:8000/",
                        cometEndpoint: "http://localhost:8000/comet"
                    },
                    options
                );
                
                self.restClient = new self.Query(
                    {
                        id: 'Rest Client',
                        url: options.restEndpoint
                    }
                );
                
                self.restClient.data(
                    {
                        // TODO: Set auth credentials...
                    }
                );
                
                self.restClient.query(
                    function(response) {
                        
                        if(response) {
                            
                            // TODO: Field authentication response...
                            var authenticated = false;
                            
                            if(authenticated) {
                                
                                self.cometClient = new F.Client(options.cometEndpoint);
                                // TODO: Connect to client's authenticated comet channel...
                            }
                        }
                    }
                );
            }
        }
    );
    
    $.extend($, { tw: TeaWater });
})(jQuery, Faye);