var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');
var moment = require('moment');
var validators = require('mongoose-validators');

// var nameValidator = [
//     validate({
//         validator: 'matches',
//         arguments: /^[a-zA-Z\s]+[a-zA-Z]$/,
//         passIfEmpty: false,
//         message: 'Allergy Name Must Contain Alphabets (a-z or A-Z) and spaces only'
//     })
// ];

// var idValidator = [
//     validate({
//         validator: 'isNumeric',
//         passIfEmpty: false,
//         message: 'Invalid ID'
//     })
// ];

var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

var ImmunizationUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        Immunization: {
            ImmunizationsTypeId: { type: Number },
            ImmunizationName: { type: String },
        },
        strTakenOn: { type: String },
        TakenOn: { type: Date },
        Comments: { type: String },
        SourceId: { type: Number, default: 1 },
        CreatedDate: { type: Date, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('ImmunizationUser', ImmunizationUserSchema, 'ImmunizationUser');