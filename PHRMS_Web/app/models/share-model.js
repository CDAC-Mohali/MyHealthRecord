var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var ShareSchema = new Schema({
    UserId: { type: String },
    Personal: {
        email: { type: String },
        mobile: { type: String },
        dob: { type: String },
        password: { type: String, required: true },
        name: { first: { type: String }, last: { type: String } },
        address: { line1: String, line2: String, city: String, district: String, state: { Id: Number, Name: String }, pin: String },
        gender: String,
        blood: String,
        different: String,
        aadhar: { type: String },
        image: { type: String, default: 'uploads/profile/default.png' }
    },
    Name: { type: String },
    Mobile: { type: String },
    Email: { type: String },
    Picture: { type: String },
    ReadNotification: { type: Boolean, default: false },
    ReplyNotification: { type: Boolean, default: false },
    Contact: {
        Id: { type: Schema.ObjectId },
        Type: { type: String },
        Contact: {
            SpecialityName: { type: String },
            Id: { type: String }
        },
        Name: { type: String },
        HospitalName: { type: String },
        Address: { line1: String, line2: String, city: String, district: String, state: { Id: Number, Name: String }, pin: String },
        Mobile: { type: String },
        Email: { type: String },
        SourceId: { type: String },
        CreateDate: { type: String },
        strCreatedDate: { type: String },
        DeleteFlag: { type: Boolean, default: false }
    },
    PassPhrase: { type: String },
    Validity: { type: Number },
    Allergy: [{
        Allergy: {
            AllergyName: { type: String },
            Id: { type: Number }
        },
        StillHave: { type: String },
        Since: { type: String },
        Severity: { type: String },
        Notes: { type: String },
        SourceId: { type: Number, default: 1 }
    }],
    Condition: [{
        Condition: {
            Id: { type: Number },
            HealthCondition: { type: String }
        },
        StillHave: { type: String },
        strDiagnosisDate: { type: String },
        DiagnosisDate: { type: Date },
        DiagnosisBy: { type: String },
        Notes: { type: String },
        SourceId: { type: Number, default: 1 }
    }],
    Lab: [{
        Lab: {
            Id: { type: String },
            TestName: { type: String }
        },
        strPerformedOn: { type: String },
        PerformedOn: { type: Date },
        Result: { type: String },
        Unit: { type: String },
        Notes: { type: String },
        FileFlag: { type: String },
        FilePath: { type: String },
        FileSize: { type: Number },
        SourceId: { type: Number, default: 1 }
    }],
    Immunization: [{
        Immunization: {
            ImmunizationsTypeId: { type: Number },
            ImmunizationName: { type: String }
        },
        strTakenOn: { type: String },
        TakenOn: { type: Date },
        Comments: { type: String },
        SourceId: { type: Number, default: 1 }
    }],
    Medication: [{
        Medicine: {
            Id: { type: String },
            MedicineName: { type: String }
        },
        StillHave: { type: String },
        strDatePrescribed: { type: String },
        DatePrescribed: { type: Date },
        Route: { type: String },
        Strength: { type: String },
        Dosage: {
            Quant: { type: String },
            Type: { type: String }
        },
        Frequency: { type: String },
        Label: { type: String },
        Notes: { type: String },
        FileFlag: { type: String },
        FilePath: { type: String },
        FileSize: { type: Number },
        SourceId: { type: Number, default: 1 }
    }],
    Procedure: [{
        Procedure: {
            Id: { type: String },
            ProcedureName: { type: String }
        },
        strDateofProcedure: { type: String },
        DateofProcedure: { type: Date },
        DoctorHospital: { type: String },
        FileFlag: { type: String },
        FilePath: { type: String },
        FileSize: { type: Number },
        Notes: { type: String },
        SourceId: { type: Number, default: 1 }
    }],
    UserMessage: {
        Message: { type: String },
        SendDate: { type: Date, default: Date.now }
    },
    ContactMessage: {
        Message: { type: String },
        SendDate: { type: Date }
    },
    Status: { type: Number, default: 1 },
    SourceId: { type: String, default: "1" },
    CreateDate: { type: Date, default: Date.now() },
    strCreatedDate: { type: String, default: moment(Date.now()).format('DD/MM/YYYY') },
});

module.exports = mongoose.model('ShareUser', ShareSchema, 'ShareUser');