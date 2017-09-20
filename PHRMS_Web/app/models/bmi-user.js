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
//         message: 'BMI Name Must Contain Alphabets (a-z or A-Z) and spaces only'
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
//         message: 'Distance, Hours and Min Parameters Should Contain Numbers Only!'
//     })
// ];

var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

var BMIUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        CollectionDate: { type: Date },
        strCollectionDate: { type: String },
        Comments: { type: String },
        CreatedDate: { type: Date, default: Date.now },
                 Weight: { 
            type: Number,
             //default: 0 
             required: [true, "Weight is required."]
            },
        Height: { 
            type: Number,
            // default: 0
           required: [true, "Height is required."]
             },
        BMI: { 
            type: Number,
            default: 0
         },
        SourceId: { type: Number, default: 1 },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('BMIUser', BMIUserSchema, 'BMIUser');