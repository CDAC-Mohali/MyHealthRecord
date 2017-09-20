var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LabMasterSchema = new Schema({
    Id: { type: String },
    TestName: { type: String }
});

module.exports = mongoose.model('LabList', LabMasterSchema, 'LabList');