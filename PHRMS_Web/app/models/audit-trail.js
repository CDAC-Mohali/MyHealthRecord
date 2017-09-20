var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validate = require('mongoose-validator');
var validates = require('mongoose-validators');
var validators = require('mongoose-validators');

var AuditTrailSchema = new Schema({
    User: { type: String },
   
    Info: [{
        Module: { type: String },
        Event: { type: String },
        RecordName: { type: String }, // Enter the Record Name Eg. Allergy to Tomato
        SourceId: { type: Number, default: 1 },
        CreatedDate: { type: Date, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        ImagePath: { type: String },
        UserName:{type:String}
    }]
});

module.exports = mongoose.model('AuditTrail', AuditTrailSchema, 'AuditTrail');