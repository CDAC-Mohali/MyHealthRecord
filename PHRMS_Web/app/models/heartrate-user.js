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

var HeartRateUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        CollectionDate: { type: Date },
        strCollectionDate: { type: String },
        Comments: { type: String },
        CreatedDate: { type: Date, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        Result: {
            type: Number,
            required: [true, "Result is required."]
        },

        SourceId: { type: Number, default: 1 },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('HeartRateUser', HeartRateUserSchema, 'HeartRateUser');