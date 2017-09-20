var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validate = require('mongoose-validator');
var validators = require('mongoose-validators');

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

var MedicationUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        Medicine: {
            Id: { type: String },
            MedicineName: { type: String }
        },
        StillHave: { type: String },
        strDatePrescribed: { type: String },
        DatePrescribed: { type: Date },
        Route: { type: String },
        Strength: {
            type: String,
            validate: validators.isFloat({
                message: "Only Numeric value Allowed"
            })
        },
        Dosage: {
            Quant: { type: String },
            Type: { type: String }
        },
        Frequency: { type: String },
        Label: { type: String },
        Notes: { type: String },
        FileFlag: { type: String },
        FilePath: { type: String },
        FileSize: { type: Number },
        SourceId: { type: Number, default: 1 },
        CreatedDate: { type: String, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('MedicineUser', MedicationUserSchema, 'MedicineUser');