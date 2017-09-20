var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImmunizationMasterSchema = new Schema({
    ImmunizationsTypeId: { type: String },
    ImmunizationName: { type: String }
});

module.exports = mongoose.model('ImmunizationList', ImmunizationMasterSchema, 'ImmunizationList');