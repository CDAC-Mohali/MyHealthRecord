var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var ContactUserSchema = new Schema({
    User: { type: String },
    Info: [{
        Contact: {
            SpecialityName: { type: String },
            Id: { type: String }
        },
        Name: { type: String },
        HospitalName: { type: String },
        Address: { line1: String, line2: String, city: String, district: String, state: { Id: Number, Name: String }, pin: String },
        Mobile: { type: String },
        Email: { type: String },
        SourceId: { type: String, default: "1" },
        CreateDate: { type: String, default: Date.now() },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('ContactUser', ContactUserSchema, 'ContactUser');