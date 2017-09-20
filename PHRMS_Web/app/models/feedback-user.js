var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var FeedbackUserSchema = new Schema({
    User: { type: String },
    Feedback: {
        About: { type: String },
        Subject: { type: String },
        Feedback: { type: String },
        FileFlag: { type: String },
        FilePath: { type: String },
        FileSize: { type: Number },
        // File: {
        //     filesize: { type: String },
        //     filetype: { type: String },
        //     filename: { type: String },
        //     base64: { type: String },
        // },
        SourceId: { type: String, default: "1" },
        CreatedDate: { type: String, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('FeedbackUser', FeedbackUserSchema, 'FeedbackUser');