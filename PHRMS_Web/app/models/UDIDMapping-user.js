var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validate = require('mongoose-validator');
var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

var UDIDMappingSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        UDID: { type: String },
        CreatedDate: { type: Date, default: Date.now },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('UDIDMapping', UDIDMappingSchema, 'UDIDMapping');