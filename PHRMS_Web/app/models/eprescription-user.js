var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validate = require('mongoose-validator');


var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z ]*$/,
        passIfEmpty: true,
        message: 'Name Must Contain Alphabets (a-z or A-Z) and spaces only'
    })
];

var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

var mobileValidator = [
    validate({
        validator: 'isNumeric',
        message: 'Phone Should Contain Numbers Only'
    }),
    validate({
        validator: 'isLength',
        arguments: [10],
        message: 'Phone Should Contain 10 Digits Only'
    })
];

var ePrescriptionUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        DoctorName: {
            type: String,
            required: [true, "Doctor Name is required."],
            validate: nameValidator
        },
        ClinicName: {
            type: String,
            required: [true, "Clinic Name is required."],
           
        },
        Address: { type: String },
        Phone: {
            type: String,
            required: [true, "Phone Number is required."],
            validate: mobileValidator
        },
        strDate: { type: String },
        Date: { type: Date },
        FileFlag: { type: String },
        FilePath: { type: String },
        FileSize: { type: Number },
        Remarks: { type: String },
        SourceId: { type: Number, default: 1 },
        CreatedDate: { type: Date, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('ePrescriptionUser', ePrescriptionUserSchema, 'ePrescriptionUser');