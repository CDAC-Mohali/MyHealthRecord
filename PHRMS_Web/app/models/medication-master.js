var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicationMasterSchema = new Schema({
    Id: { type: String },
    MedicineName: { type: String },
    RXCUI: { type: String },
    RXAUI: { type: String }
});

module.exports = mongoose.model('MedicineList', MedicationMasterSchema, 'MedicineList');