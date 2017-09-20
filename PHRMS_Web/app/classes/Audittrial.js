
var Audit = require('../models/audit-trail.js');
var UserProfile = require('../models/user-profile.js');
var method = AuditTrialService.prototype;

function AuditTrialService() {
    //   console.log("Initializing SMS Service");
}

method.send = function (User, Module, Event, RecordName, SourceId, ImagePath) {
   
    UserProfile.findById(User, function (err, user) {

        if (user) {
    var  UserName = user.personal.name.first + " " + user.personal.name.last;
    
    var auditAct = new Audit({
        "User": User,
        'Info': {
            'Module': Module,
            'Event': Event,
            'RecordName': RecordName,
            'SourceId': SourceId,
            'ImagePath': ImagePath,
            'UserName': UserName
        }
    });

    Audit.findOne({ User:User}).exec(function (err, userAudit) {
        if (!userAudit) {
            auditAct.save(function (err, auditAct) {
            })
        } else if (userAudit) {

            Audit.findByIdAndUpdate(
                userAudit._id, {
                    $push: {
                        'Info': {
                            'Module': Module,
                            'Event': Event,
                            'RecordName': RecordName,
                            'SourceId': SourceId,
                            'ImagePath': ImagePath,
                            'UserName': UserName
                        }
                    }
                }, { upsert: true, new: true },
                function (err, result) {

                });

        }


    })
        }
    });
};

module.exports = AuditTrialService;