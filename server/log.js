var sys = require('sys');

var message = function(message, type) {
    
    var typeOut,
        messageOut;
    
    switch(type) {
        default:
        case 'debug':
            typeOut = '\033[32m[ D ]\033[39m';
            break;
        case 'warning':
            typeOut = '\033[33m[ W ]\033[39m';
            break;
        case 'error':
            typeOut = '\033[31m[ E ]\033[39m';
            break;
            
    }
    
    messageOut = '\033[1m' + message + '\033[22m';
    
    sys.puts(typeOut + ' ' + messageOut);
};

var inspect = function(o) {
    message(sys.inspect(o, true), 0);
};

exports.message = message;
exports.inspect = inspect;
