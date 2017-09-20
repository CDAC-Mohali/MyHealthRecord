var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AllergyMasterSchema = new Schema({
    Id: { type: String },
    AllergyName: { type: String },
    DescriptionId: { type: String },
    ConceptId: { type: String }
});

module.exports = mongoose.model('AllergyList', AllergyMasterSchema, 'AllergyList');