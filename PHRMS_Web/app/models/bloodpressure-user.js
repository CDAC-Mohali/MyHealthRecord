var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validate = require('mongoose-validator');
//var validators = require('mongoose-validators');

var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

function SysRangeValidator(value) {
    // `this` is the mongoose document
    return value >=0;
}

function DiaRangeValidator(value) {
    // `this` is the mongoose document
    return this.ResSystolic > value;
}

function PulseRangeValidator(value) {
    // `this` is the mongoose document
    return value >= 60;
}
var BPUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        CollectionDate: { type: Date },
        strCollectionDate: { type: String },
        Comments: {
            type: String
        },
        ResSystolic: {
            columnName: "Sys",
            type: Number,
            required: [true, "Systolic is Required."],
            validate: [SysRangeValidator, "Systolic value must be greater than Diastolic.", ]
        },
        ResDiastolic: {
            type: Number,
            default: 0,
            validate: [DiaRangeValidator, "Systolic value must be greater than Diastolic.",
                // validators.isFloat({
                //     message: "Only Numeric value Allowed"
                // })
            ]
        },
        // ResPulse: {
        //     type: Number,
        //     default: 0,
        //     validate: [PulseRangeValidator, "Pulse value greater than or equal to 60."
        //         // , validators.isFloat({
        //         //     message: "Only Numeric value Allowed"
        //         // })
        //     ]
        // },
        SourceId: { type: Number, default: 1 },
        CreatedDate: { type: Date, default: Date.now },
        strCreatedDate: {
            type: String,
            default: moment(Date.now()).format('DD/MM/YYYY')
        },
        DeleteFlag: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('BPUser', BPUserSchema, 'BPUser');