var sys = require('sys');

(function() {
    
    this.type = {
        debug: 0,
        warning: 1,
        error: 2
    };
    
    this.message = function(message, type) {
        
        var typeOut,
            messageOut;
        
        switch(type) {
            default:
            case this.type.debug:
                typeOut = '\033[32m[ D ]\033[39m';
                break;
            case this.type.warning:
                typeOut = '\033[33m[ W ]\033[39m';
                break;
            case this.type.error:
                typeOut = '\033[31m[ E ]\033[39m';
                break;
                
        }
        
        messageOut = '\033[1m' + message + '\033[22m';
        
        sys.puts(typeOut + ' ' + messageOut);
    };
    
})();

exports.type = type;
exports.message = message;
