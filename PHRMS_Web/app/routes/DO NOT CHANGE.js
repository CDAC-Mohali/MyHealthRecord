var mongoose = require('mongoose');
var UserProfile = require('../models/user-profile.js');
var AllergyMaster = require('../models/allergy-master.js');
var AllergyUser = require('../models/allergy-user.js');
var ConditionMaster = require('../models/condition-master.js');
var ConditionUser = require('../models/condition-user.js');
var ImmunizationMaster = require('../models/immunization-master.js');
var ImmunizationUser = require('../models/immunization-user.js');
var ProcedureMaster = require('../models/procedure-master.js');
var ProcedureUser = require('../models/procedure-user.js');
var LabMaster = require('../models/lab-master.js');
var LabUser = require('../models/lab-user.js');
var ePrescriptionUser = require('../models/eprescription-user.js');
var MedicineMaster = require('../models/medication-master.js');
var MedicineUser = require('../models/medication-user.js');
var jwt = require('jsonwebtoken');
var MailerService = require('../classes/mail.js');
var mailer = new MailerService();
var secret = 'B@&$bt7t63b493ocn';

module.exports = function(router) {

    /*
     * User Registration and Session Management Section.  
     * Requires no Token Authentication
     */

    // User Registration Route

    router.post('/users', function(req, res) {
        var user = new UserProfile(req.body);
        if (req.body.personal.mobile === null || req.body.personal.mobile === '' || req.body.personal.password === null || req.body.personal.password === '') {
            res.json({ success: false, message: 'Ensure Mobile and Password were Provided' });
        } else {
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Username Already Exists! ' });
                } else {
                    if (req.body.personal.email === "" || req.body.personal === null) {
                        mailer.setMailOptions(req.body.personal.email, "Welcome to My Health Record!", "You have been Registered!");
                        mailer.dispatch();
                    }
                    res.json({ success: true, message: 'Congratulations! You have been registered!... We are Redirecting You to Login Now!' });
                }
            });
        }
    });

    // User Authentication/Login Method
    router.post('/authenticate', function(req, res) {
        UserProfile.findOne({
            $or: [
                { 'personal.email': req.body.username }, { 'personal.mobile': req.body.username }
            ]
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!user) res.json({ success: false, message: "Invalid Username. Could Not Authenticate User!" });
            else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) res.json({ success: false, message: "Invalide Password! Please cross check your password again!" });
                else {
                    var token = jwt.sign({
                        id: user._id,
                        email: user.personal.email,
                        phone: user.personal.mobile,
                        name: user.personal.name.first + " " + user.personal.name.middle + " " + user.personal.name.last
                    }, secret, { expiresIn: '96h' });
                    res.json({ success: true, message: "User Found! Logging You in and Redirecting ...", token: token });
                }
            }
        });
    });

    /* 
     * Access Token Authentication and verification Middleware.
     * Any Route Beyond this Point Will be Requiring Access Tokens.
     * They Can be provided in Body, X-ACCESS Header or Query
     */

    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: "Invalid Token Provided!" });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: "Token Not Provided! Please Provide Token" });
        }

    });

    /*
     * User Schema and Details Fetching Routes 
     */

    // Auth Token Decoder
    router.post('/me', function(req, res) {
        res.json({ success: true, message: req.decoded });
    });

    // User Data Fetch Route
    router.get('/getUser/:id', function(req, res) {
        UserProfile.findOne({
            '_id': req.params.id
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!user) res.json({ success: false, message: "Invalid ID. Could Not Find User!" });
            else if (user) {
                res.json({ success: true, message: user });
            }
        });
    });

    // Update User Route
    router.post('/updateUser/:id', function(req, res) {
        var query = { '_id': req.params.id };
        UserProfile.findOneAndUpdate(query, req.body, { upsert: true, new: true }, function(err, doc) {
            if (err) throw err;
            else res.json({ success: true, message: "Data Has Been Successfully Updated", data: doc });
        });
    });

    // Update Password Route
    router.post('/updatePassword/:id', function(req, res) {
        var query = { '_id': req.params.id };
    });

    /*
     * Allergy Module Routes. 
     * They Require Access Tokens too.
     */

    // Get Allergy Name Listing
    router.post('/getAllergyList', function(req, res) {
        AllergyMaster.find({ AllergyName: { $regex: new RegExp('^' + req.body.exp, "i") } }, function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Allergy List
    router.post('/addAllergyUser', function(req, res) {
        if (req.body.Info.AllergyName == '' || req.body.Info.AllergyName == null) {
            res.json({ success: false, message: "Please Provide with Allergy Name First!" });
        } else {
            AllergyUser.findOne({ User: req.body.User }).exec(function(err, userAllergy) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userAllergy) {
                    var allergy = new AllergyUser(req.body);
                    allergy.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: 'Oops! Some Error Occured.' });
                        } else {
                            res.json({ success: true, message: 'Your allergy has been registered!... ' });
                        }
                    });
                } else if (userAllergy) {
                    AllergyUser.findByIdAndUpdate(
                        userAllergy._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, allergy) {
                            if (err) throw err;
                            else res.json({ success: true, message: allergy });
                        }
                    );
                }
            });
        }
    });

    // Get User Allergies
    router.get('/getUserAllergy/:id', function(req, res) {
        AllergyUser.findOne({ User: req.params.id }).exec(function(err, allergy) {
            if (err) throw err;
            else {
                res.json({ success: true, message: allergy });
            }
        });
    });

    // Remove User Allergy
    router.post('/removeUserAllergy', function(req, res) {
        AllergyUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.AllergyId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.AllergyId) } } }, { new: true },
            function(err, allergy) {
                if (err) throw err;
                res.json({ success: true, message: allergy });
            });
    });

    /*
     * Conditions Module Routes. 
     * They Require Access Tokens too.
     */

    // Get Condition Name Listing
    router.post('/getConditionList', function(req, res) {
        ConditionMaster.find({ HealthCondition: { $regex: new RegExp('^' + req.body.exp, "i") } }, function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Condition List
    router.post('/addConditionUser', function(req, res) {
        if (req.body.Info.ConditionName == '' || req.body.Info.ConditionName == null) {
            res.json({ success: false, message: "Please Provide with Condition Name First!" });
        } else {
            ConditionUser.findOne({ User: req.body.User }).exec(function(err, userCondition) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userCondition) {
                    var condition = new ConditionUser(req.body);
                    condition.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: 'Oops! Some Error Occured.' });
                        } else {
                            res.json({ success: true, message: 'Your problem has been registered!... ' });
                        }
                    });
                } else if (userCondition) {
                    ConditionUser.findByIdAndUpdate(
                        userCondition._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, condition) {
                            if (err) throw err;
                            else res.json({ success: true, message: condition });
                        }
                    );
                }
            });
        }
    });

    // Get User Condition
    router.get('/getUserCondition/:id', function(req, res) {
        ConditionUser.findOne({ User: req.params.id }).exec(function(err, condition) {
            if (err) throw err;
            else {
                res.json({ success: true, message: condition });
            }
        });
    });

    // Remove User Condition
    router.post('/removeUserCondition', function(req, res) {
        ConditionUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ConditionId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.ConditionId) } } }, { new: true },
            function(err, condition) {
                if (err) throw err;
                res.json({ success: true, message: condition });
            });
    });

    /*
     * Immunization Module Routes. 
     * They Require Access Tokens too.
     */

    // Get Immunization Name Listing
    router.post('/getImmunizationList', function(req, res) {
        ImmunizationMaster.find({ ImmunizationName: { $regex: new RegExp('^' + req.body.exp, "i") } }, function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Immunization List
    router.post('/addImmunizationUser', function(req, res) {
        if (req.body.Info.ImmunizationName == '' || req.body.Info.ImmunizationName == null) {
            res.json({ success: false, message: "Please Provide with Immunization Name First!" });
        } else {
            ImmunizationUser.findOne({ User: req.body.User }).exec(function(err, userImmunization) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userImmunization) {
                    var immunization = new ImmunizationUser(req.body);
                    immunization.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: 'Oops! Some Error Occured.' });
                        } else {
                            res.json({ success: true, message: 'Your immunization has been registered!... ' });
                        }
                    });
                } else if (userImmunization) {
                    ImmunizationUser.findByIdAndUpdate(
                        userImmunization._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, immunization) {
                            if (err) throw err;
                            else res.json({ success: true, message: immunization });
                        }
                    );
                }
            });
        }
    });

    // Get User Immunization
    router.get('/getUserImmunization/:id', function(req, res) {
        ImmunizationUser.findOne({ User: req.params.id }).exec(function(err, immunization) {
            if (err) throw err;
            else {
                res.json({ success: true, message: immunization });
            }
        });
    });

    // Remove User Immunization
    router.post('/removeUserImmunization', function(req, res) {
        ImmunizationUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ImmunizationId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.ImmunizationId) } } }, { new: true },
            function(err, immunization) {
                if (err) throw err;
                res.json({ success: true, message: immunization });
            });
    });

    /*
     * Procedures Module Routes. 
     * They Require Access Tokens too.
     */

    // Get Procedure Name Listing
    router.post('/getProcedureList', function(req, res) {
        ProcedureMaster.find({ ProcedureName: { $regex: new RegExp('^' + req.body.exp, "i") } }, function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Procedure List
    router.post('/addProcedureUser', function(req, res) {
        if (req.body.Info.ProcedureName == '' || req.body.Info.ProcedureName == null) {
            res.json({ success: false, message: "Please Provide with Procedure Name First!" });
        } else {
            ProcedureUser.findOne({ User: req.body.User }).exec(function(err, userProcedure) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userProcedure) {
                    var procedure = new ProcedureUser(req.body);
                    procedure.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: 'Oops! Some Error Occured.' });
                        } else {
                            res.json({ success: true, message: 'Your procedure has been registered!... ' });
                        }
                    });
                } else if (userProcedure) {
                    ProcedureUser.findByIdAndUpdate(
                        userProcedure._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, procedure) {
                            if (err) throw err;
                            else res.json({ success: true, message: procedure });
                        }
                    );
                }
            });
        }
    });

    // Get User Procedure
    router.get('/getUserProcedure/:id', function(req, res) {
        ProcedureUser.findOne({ User: req.params.id }).exec(function(err, procedure) {
            if (err) throw err;
            else {
                res.json({ success: true, message: procedure });
            }
        });
    });

    // Remove User Procedure
    router.post('/removeUserProcedure', function(req, res) {
        ProcedureUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ProcedureId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.ProcedureId) } } }, { new: true },
            function(err, procedure) {
                if (err) throw err;
                res.json({ success: true, message: procedure });
            });
    });

    /*
     * Labs Module Routes. 
     * They Require Access Tokens too.
     */

    // Get Lab Name Listing
    router.post('/getLabList', function(req, res) {
        LabMaster.find({ TestName: { $regex: new RegExp('^' + req.body.exp, "i") } }, function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Lab List
    router.post('/addLabUser', function(req, res) {
        if (req.body.Info.LabName == '' || req.body.Info.LabName == null) {
            res.json({ success: false, message: "Please Provide with Lab Name First!" });
        } else {
            LabUser.findOne({ User: req.body.User }).exec(function(err, userLab) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userLab) {
                    var lab = new LabUser(req.body);
                    lab.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: 'Oops! Some Error Occured.' });
                        } else {
                            res.json({ success: true, message: 'Your lab has been registered!... ' });
                        }
                    });
                } else if (userLab) {
                    LabUser.findByIdAndUpdate(
                        userLab._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, lab) {
                            if (err) throw err;
                            else res.json({ success: true, message: lab });
                        }
                    );
                }
            });
        }
    });

    // Get User Lab
    router.get('/getUserLab/:id', function(req, res) {
        LabUser.findOne({ User: req.params.id }).exec(function(err, lab) {
            if (err) throw err;
            else {
                res.json({ success: true, message: lab });
            }
        });
    });

    // Remove User Lab
    router.post('/removeUserLab', function(req, res) {
        LabUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.LabId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.LabId) } } }, { new: true },
            function(err, lab) {
                if (err) throw err;
                res.json({ success: true, message: lab });
            });
    });

    /*
     * ePrescription Module Routes. 
     * They Require Access Tokens too.
     * No Get Listing Method for ePrescriptions
     */

    // Add/Update User ePrescription List
    router.post('/addePrescriptionUser', function(req, res) {
        if (req.body.Info.DoctorName === '' || req.body.Info.DoctorName === null) {
            res.json({ success: false, message: "Please Provide with Doctor Name First!" });
        } else {
            ePrescriptionUser.findOne({ User: req.body.User }).exec(function(err, userePrescription) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userePrescription) {
                    var eprescription = new ePrescriptionUser(req.body);
                    eprescription.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: 'Oops! Some Error Occured.' });
                        } else {
                            res.json({ success: true, message: 'Your ePrescription has been registered!... ' });
                        }
                    });
                } else if (userePrescription) {
                    ePrescriptionUser.findByIdAndUpdate(
                        userePrescription._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, eprescription) {
                            if (err) throw err;
                            else res.json({ success: true, message: eprescription });
                        }
                    );
                }
            });
        }
    });

    // Get User ePrescription
    router.get('/getUserePrescription/:id', function(req, res) {
        ePrescriptionUser.findOne({ User: req.params.id }).exec(function(err, eprescription) {
            if (err) throw err;
            else {
                res.json({ success: true, message: eprescription });
            }
        });
    });

    // Remove User ePrescription
    router.post('/removeUserePrescription', function(req, res) {
        ePrescriptionUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ePrescriptionId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.ePrescriptionId) } } }, { new: true },
            function(err, eprescription) {
                if (err) throw err;
                res.json({ success: true, message: eprescription });
            });
    });

    /*
     * Medication Module Routes. 
     * They Require Access Tokens too.
     */

    // Get Medication Name Listing
    router.post('/getMedicationList', function(req, res) {
        if (req.body.subPageNo < 0) req.body.subPageNo = 0;
        MedicineMaster.find({ MedicineName: { $regex: new RegExp('^' + req.body.exp, "i") } })
            .limit(100)
            .skip((100 * req.body.subPageNo))
            .exec(function(err, list) {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    res.json({ success: true, message: list });
                }
            });
    });

    // Add/Update User Medication List
    router.post('/addMedicationUser', function(req, res) {
        if (req.body.Info.MedicineName === '' || req.body.Info.MedicineName === null) {
            res.json({ success: false, message: "Please Provide with Medicine Name First!" });
        } else {
            MedicineUser.findOne({ User: req.body.User }).exec(function(err, userMedicine) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userMedicine) {
                    var medicine = new MedicineUser(req.body);
                    medicine.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: 'Oops! Some Error Occured.' });
                        } else {
                            res.json({ success: true, message: 'Your medicine has been registered!... ' });
                        }
                    });
                } else if (userMedicine) {
                    MedicineUser.findByIdAndUpdate(
                        userMedicine._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, medicine) {
                            if (err) throw err;
                            else res.json({ success: true, message: medicine });
                        }
                    );
                }
            });
        }
    });

    // Get User Medication
    router.get('/getUserMedication/:id', function(req, res) {
        MedicineUser.findOne({ User: req.params.id }).exec(function(err, medicine) {
            if (err) throw err;
            else {
                res.json({ success: true, message: medicine });
            }
        });
    });

    // Remove User Medication
    router.post('/removeUserMedication', function(req, res) {
        MedicineUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.MedicineId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.MedicineId) } } }, { new: true },
            function(err, medicine) {
                if (err) throw err;
                res.json({ success: true, message: medicine });
            });
    });

    return router;

};