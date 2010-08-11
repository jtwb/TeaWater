(function($) {
    
    $(function() {
        
        var rest = "http://localhost:8000/v1/";
        var comet = "http://localhost:8000/comet";
        var username = "UnitTest";
        
        test(
            "Client can connect and disconnect successfully", 
            function() {
                $.tw.reset();
                stop();
                $.tw(
                    function(userData) {
                        if(userData && userData.id) {
                            
                            ok(true, "Client connected and received ID " + userData.id)
                        } else {
                            
                            ok(false, "Client handling connected event, but was passed null data!")
                        }
                        
                        $.tw.disconnect();
                    }
                ).on(
                    'error',
                    function(message) {
                        
                        ok(false, "Client received error event while performing connection tests! Error: " + message);
                        start();
                    }
                ).on(
                    'disconnected',
                    function() {
                        
                        $.tw.clear('connected').clear('disconnected').clear('error');
                        ok(true, "Client disconnected from the server and detached events!");
                        start();
                    }
                ).connect(username);
            }
        );
        
        
        test(
            "Client can create an entity",
            function() {
                $.tw.reset();
                stop();
                
                $.tw(
                    function(userData) {
                        if(userData && userData.id) {
                            
                            ok(true, "Client connected and received ID " + userData.id)
                            
                            $.tw.on(
                                'updated',
                                function(errata) {
                                    $.tw.log('Got response!');
                                    ok(true, "Client placed entity and received game world update from server");
                                    
                                    $.tw.disconnect();
                                }
                            );
                            
                            $.tw.setEntity(0, 0, $.tw.entityType.resource);
                            
                        } else {
                            
                            ok(false, "Client handling connected event, but was passed null data!");
                            
                            $.tw.disconnect();
                        }
                    }
                ).on(
                    'error',
                    function(message) {
                        
                        ok(false, "Client received error while trying to connect! Error: " + message);
                        start();
                    }
                ).on(
                    'disconnected',
                    function() {
                        
                        $.tw.clear('connected').clear('disconnected').clear('error');
                        ok(true, "Client disconnected from the server and detached events!");
                        start();
                    }
                ).connect(username);
            }
        );
    });
})(jQuery);