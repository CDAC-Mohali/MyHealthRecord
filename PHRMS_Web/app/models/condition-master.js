var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConditionMasterSchema = new Schema({
    Id: { type: String },
    HealthCondition: { type: String }
});

module.exports = mongoose.model('ConditionList', ConditionMasterSchema, 'ConditionList');