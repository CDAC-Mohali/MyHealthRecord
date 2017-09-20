var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var validate = require('mongoose-validator');
var validators = require('mongoose-validators');

var objectValidator = [
    validate({
        validator: 'isMongoId',
        passIfEmpty: false,
        message: 'Invalid User ID'
    })
];

var ActivityUserSchema = new Schema({
    User: { type: String, validate: objectValidator },
    Info: [{
        Activity: {
            ActivityId: { type: String },
            ActivityName: { type: String, required: true }
        },
        CollectionDate: { type: Date },
        strCollectionDate: { type: String },
        Comments: { type: String },
        CreatedDate: { type: Date, default: Date.now },
        TotalHours: {
            type: Number,
            required: [true, "Hours is required"],
            //default: 0,
            validate: validators.isFloat({
                message: "Only Numeric value Allowed"
            })
        },
        TotalMinutes: {
            type: Number,
            required: [true, "Minutes is required"],
            default: 0,
            validate: validators.isFloat({
                message: "Only Numeric value Allowed"
            })
        },
        Name: {
            type: String,
            required: [true, "Name is required"],
            //    validate: nameValidator
        },
        Distance: {
            type: Number,
            required: [true, "Distance is required"],
            validate: validators.isFloat({
                message: "Only Numeric value Allowed"
            })
        },
        SourceId: {
            type: Number,
            default: 1,
            required: [true, "SourceId is required"],
            validate: validators.isInt({
                message: "Only Integer value Allowed"
            })
        },
        //  CreateDate: { type: Date, default: Date.now() },
        strCreatedDate: {
            type: String,
            default: moment(Date.now()).format('DD/MM/YYYY')
        },
        DeleteFlag: { type: Boolean, default: false },
        Calories: { type: Number, default: 0 },
        Weight: { type: Number, default: 0 }
    }]
});

module.exports = mongoose.model('ActivityUser', ActivityUserSchema, 'ActivityUser');