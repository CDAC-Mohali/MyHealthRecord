var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProcedureMasterSchema = new Schema({
    Id: { type: String },
    ProcedureName: { type: String }
});

module.exports = mongoose.model('ProcedureList', ProcedureMasterSchema, 'ProcedureList');