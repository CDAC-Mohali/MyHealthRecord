var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validate = require('mongoose-validator');
var validators = require('mongoose-validators');
// var nameValidator = [
//     validate({
//         validator: 'matches',
//         arguments: /^[a-zA-Z\s]+[a-zA-Z\s]$/,
//         passIfEmpty: true,
//         message: 'Procedure Name Must Contain Alphabets (a-z or A-Z) and spaces only'
//     })
// ];

// var idValidator = [
//     validate({
//         validator: 'isNumeric',
//         passIfEmpty: false,
//         message: 'Invalid ID'
//     })
// ];

// var numValidator = [
//     validate({
//         validator: 'isNumeric',
//         passIfEmpty: false,
//         message: 'Glucose Parameters Should Contain Numbers Only!'
//     })
// ];

var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

var BloodGulucoseUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        CollectionDate: { type: Date },
        strCollectionDate: { type: String },
        Comments: { type: String },
        CreatedDate: { type: Date, default: Date.now },
        Result: {
            type: Number,
            default: 0,
            validate: validators.isFloat({
                message: "Only Numeric value Allowed"
            })
        },
        ValueType: { type: String },
        SourceId: { type: Number, default: 1 },
        //   CreateDate: { type: Date, default: Date.now },
        strCreatedDate: {
            type: String,
            default: moment(Date.now()).format('DD/MM/YYYY')
        },
        DeleteFlag: { type: Boolean, default: false }
    }]
});




module.exports = mongoose.model('BloodGulucoseUser', BloodGulucoseUserSchema, 'BloodGulucoseUser');