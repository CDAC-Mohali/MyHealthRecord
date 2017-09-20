var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StateMasterSchema = new Schema({
    Id: { type: String },
    Name: { type: String },

});

module.exports = mongoose.model('StateMaster', StateMasterSchema, 'StateMaster');