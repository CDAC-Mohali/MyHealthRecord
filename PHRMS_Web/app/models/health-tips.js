var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HealthTypeSchema = new Schema({
    Id: { type: Number },
    Tips: { type: String },
});

module.exports = mongoose.model('HealthTips', HealthTypeSchema, 'HealthTips');