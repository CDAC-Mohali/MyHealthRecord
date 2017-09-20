var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var ContactUsDetailSchema = new Schema({

        name: { first: { type: String }, last: { type: String } },
        mobile: { type: String },
        email: { type: String },
        Address: { city: String,  state: { Id: Number, Name: String } },
        Message: { type: String },
        SourceId: { type: String, default: "1" },
        CreatedDate: { type: String, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    
});

module.exports = mongoose.model(' ContactUsDetail', ContactUsDetailSchema, 'ContactUsDetail');