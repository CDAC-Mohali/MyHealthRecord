var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpecialityMasterSchema = new Schema({
    Id: { type: String },
    SpecialityName: { type: String }
});

module.exports = mongoose.model('SpecialityList', SpecialityMasterSchema, 'SpecialityList');