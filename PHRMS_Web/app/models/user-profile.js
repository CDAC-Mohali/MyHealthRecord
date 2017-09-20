var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

var UserSchema = new Schema({
    personal: {
        email: { type: String, unique: true },
        mobile: { type: String, unique: true },
        dob: { type: String },
        password: { type: String, required: true },
        name: { first: { type: String }, last: { type: String } },
        address: { line1: String, line2: String, city: String, district: String, state: { Id: { type: String, required: true }, Name: { type: String, required: true } }, pin: String },
        gender: { type: String, required: true },
        blood: String,
        different: String,
        aadhar: { type: String },
        image: { type: String, default: 'uploads/profile/default.png' },
        disability: { type: Boolean, default: false },
        disabilitytype: { type: String },
        disabilityimage: { type: String },
        FileFlag: { type: String },
        FileSize: { type: Number },

    },
    emergency: {
        name: { type: String, default: "" },
        relationship: { type: String, default: "" },
        address: { line1: { type: String, default: "" }, line2: { type: String, default: "" }, city: { type: String, default: "" }, district: { type: String, default: "" }, state: { Id: String, Name: String }, pin: { type: String, default: "" } },
        mobile: { primary: { type: String, default: "" }, secondary: { type: String, default: "" } }
    },
    employer: {
        name: { type: String },
        designation: { type: String },
        cug: { String },
        mobile: { type: String, lowercase: true },
        address: { line1: String, line2: String, city: String, district: String, state: { Id: { type: String, default: "" }, Name: { type: String, default: "" } }, pin: String }
    },
    insurance: {
        provider: { String, default: "" },
        number: String,
        name: String,
        validity: String
    },
    hospital_preferance: {
        name: { String, default: "" },
        address: String,
        requirements: String
    },
    SourceId: { type: Number, default: 1 },
    CreateDate: { type: Date, default: Date.now() },
    strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
    DeleteFlag: { type: Boolean, default: false },
    OTP: { type: String },
    OTPVerify: { type: Boolean, default: false },
    LoginOTP: { type: String, default: "" }

});

// password sync and hashing
UserSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.personal.password, null, null, function(err, hash) {
        user.personal.password = hash;
        next();
    });
});


UserSchema.methods.comparePassword = function(password) {

    return bcrypt.compareSync(password, this.personal.password);
};

module.exports = mongoose.model('UserProfile', UserSchema);