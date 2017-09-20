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

var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

var ProcedureUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        Procedure: {
            Id: { type: String },
            ProcedureName: { type: String }
        },
        strDateofProcedure: { type: String },
        DateofProcedure: { type: Date },
        DoctorHospital: { type: String },
        FileFlag: { type: String },
        FilePath: { type: String },
        FileSize: { type: Number },
        Notes: { type: String },
        SourceId: { type: Number, default: 1 },
        CreatedDate: { type: Date, default: Date.now },
        strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('ProcedureUser', ProcedureUserSchema, 'ProcedureUser');