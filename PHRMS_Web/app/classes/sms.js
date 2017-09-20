var request = require('request');

var method = SMSService.prototype;

function SMSService() {
    console.log("Initializing SMS Service");
}

method.send = function(mobileNo, message) {
    request.post("Your Request url"
    );
};

module.exports = SMSService;