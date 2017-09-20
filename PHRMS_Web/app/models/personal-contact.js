var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var ContactUserSchema = new Schema({
    User: { type: String },
    Info: [{
        Name: { type: String },
        Mobile: { type: String },
        Email: { type: String },
        SourceId: { type: String, default: "1" },
        CreateDate: { type: String, default: Date.now() },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('PersonalContactUser', ContactUserSchema, 'PersonalContactUser');