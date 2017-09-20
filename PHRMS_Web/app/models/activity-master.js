var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivityMasterSchema = new Schema({
    ActivityId: { type: String },
    ActivityName: { type: String },

});

module.exports = mongoose.model('ActivityList', ActivityMasterSchema, 'ActivityList');