/*
 * User Schema and Details Fetching Routes 
 */

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var UserProfile = require('../models/user-profile.js');
var fs = require('fs');
var shortid = require('shortid');
var secret = 'B@&$bt7t63b493ocn';
var AuditService = require('../classes/Audittrial.js');
var UDIDMapping = require('../models/UDIDMapping-user.js');
var fs = require('fs');
var shortId = require('shortid');
var audit = new AuditService();


module.exports = function (router) {

    //IOS Finger Print Logic
    router.post('/SaveDeviceUDID', function (req, res) {
        UserProfile.findOne({ _id: new mongoose.Types.ObjectId(req.body.User) }).exec(function (err, userprofile) {
            if (err) {
                res.json({ success: false });
            }
            if (userprofile) {

                UDIDMapping.findOne({
                    "Info.UDID": req.body.Info.UDID,
                    "Info.DeleteFlag": false
                }, function (err, result) {
                    if (err) {
                        res.json({ success: false });
                    }

                    if (result != null && result.User != "") {

                        UDIDMapping.collection.update({ 'Info._id': result.Info[0]._id }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
                            function (err, c) {
                                if (err)
                                    res.json({ success: false, message: "Something went wrong." });

                            });
                    }
                    UDIDMapping.findOne({ User: req.body.User }).exec(function (err, udidmap) {
                        if (err) {
                            res.json({ success: false, message: "Something went wrong." });
                        }
                        if (!udidmap) {
                            var mapping = new UDIDMapping(req.body);
                            mapping.save(function (err, mapping) {
                                if (err) {
                                    var errString = "";
                                    for (var errName in err.errors) {
                                        errString += (' > ' + err.errors[errName].message);
                                    }
                                    res.json({ success: false, message: errString });
                                } else {

                                    ////////////////////////////////////////////////audit save///////
                                    //   audit.send(req.body.User, 'Allergy', '-Added by', req.body.Info.Allergy.AllergyName, req.body.Info.Allergy.SourceId, 'fa fa-pagelines text-success');
                                    ////////////////////////////////////////////////////////
                                    res.json({ success: true, message: "Success" });
                                }
                            });



                        } else if (udidmap) {
                            UDIDMapping.findByIdAndUpdate(
                                udidmap._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                                function (err, mapping) {
                                    if (err) {
                                        var errString = "";
                                        for (var errName in err.errors) {
                                            errString += (' > ' + err.errors[errName].message);
                                        }
                                        res.json({ success: false, message: errString });
                                    } else {
                                        ////////////////////////////////////////////////audit save///////
                                        // audit.send(req.body.User, 'Allergy', '-Added by', req.body.Info.Allergy.AllergyName, req.body.Info.Allergy.SourceId, 'fa fa-pagelines text-success');
                                        ////////////////////////////////////////////////////////
                                        res.json({ success: true, message: "Success" });
                                    }
                                }
                            );



                        }
                    });
                })

            } else {
                res.json({ success: false, message: "No Record Found." });
            }
        });

    });

    ///////////////////////
    // User Data Fetch Route
    router.get('/getUser/:id', function (req, res) {
        UserProfile.findOne({
            '_id': req.params.id
        }).exec(function (err, user) {
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
    router.post('/updateUser/:id', function (req, res) {

        var query = { '_id': req.params.id };


        if (req.body.personal && req.body.personal.File) {
            var file;
            var id = shortId.generate();
            if (!fs.existsSync('public/uploads/user/' + req.params.id))
                fs.mkdirSync('public/uploads/user/' + req.params.id);
            fs.mkdirSync('public/uploads/user/' + req.params.id + '/' + id);
            req.body.personal.FileFlag = req.body.personal.File.filename;
            req.body.personal.disabilityimage = 'uploads/user/' + req.params.id + '/' + id + "/" + req.body.personal.File.filename;
            file = req.body.personal.File;
            delete req.body.personal.File;
            var imageBuffer = new Buffer(file.base64, 'base64');
            fs.writeFile("public/" + req.body.personal.disabilityimage, imageBuffer, function (err) { });
        }


        UserProfile.findOneAndUpdate(query, req.body, { upsert: true, new: true }, function (err, doc) {
            if (err) throw err;
            else res.json({ success: true, message: "Data Has Been Successfully Updated", data: doc });
        });
    });
    router.post('/updatePsersonalUser/:id', function (req, res) {
        if (!req.body.name.first || req.body.name.first == undefined) {
            res.json({ success: false, message: "First Name is Required" });
            return;
        } else if (!req.body.name.last || req.body.name.last == undefined) {
            res.json({ success: false, message: "Last Name is Required" });
            return;
        } else if (!req.body.dob || req.body.dob == undefined) {
            res.json({ success: false, message: "Date of Birth is Required" });
            return;
        } else if (!req.body.gender || req.body.gender == undefined) {
            res.json({ success: false, message: "Gender is Required" });
            return;
        } else if (!req.body.blood || req.body.blood == undefined) {
            res.json({ success: false, message: "Blood Group is Required" });
            return;
        } else if (!req.body.address || !req.body.address.state || req.body.address.state == undefined) {
            res.json({ success: false, message: " State is Required" });
            return;
        }

        var query = { '_id': req.params.id };
        if (req.body.File) {
            var file;
            var id = shortId.generate();
            if (!fs.existsSync('public/uploads/user/' + req.params.id))
                fs.mkdirSync('public/uploads/user/' + req.params.id);
            fs.mkdirSync('public/uploads/user/' + req.params.id + '/' + id);
            req.body.FileFlag = req.body.File.filename;
            req.body.disabilityimage = 'uploads/user/' + req.params.id + '/' + id + "/" + req.body.File.filename;
            file = req.body.File;
            delete req.body.File;
            var imageBuffer = new Buffer(file.base64, 'base64');
            fs.writeFile("public/" + req.body.disabilityimage, imageBuffer, function (err) { });
        }


        UserProfile.findOneAndUpdate({ '_id': req.params.id }, { $set: { "personal.name.first": req.body.name.first, "personal.name.last": req.body.name.last, "personal.aadhar": req.body.aadhar, "personal.dob": req.body.dob, "personal.gender": req.body.gender, "personal.blood": req.body.blood, "personal.address.line1": req.body.address.line1, "personal.address.line2": req.body.address.line2, "personal.address.city": req.body.address.city, "personal.address.district": req.body.address.district, "personal.address.state": req.body.address.state, "personal.address.pin": req.body.address.pin, "personal.disability": req.body.disability, "personal.disabilitytype": req.body.disabilitytype, "personal.disabilityimage": req.body.disabilityimage } }, function (err, result) {
            if (err) throw err;
            else {
                ////////////////////////////////////////////////audit save///////
                audit.send(req.params.id, 'Profile', 'Updated', 'Personal Information', '1', 'fa fa-user text-success');
                ////////////////////////////////////////////////////////

                res.json({ success: true, message: "Data Has Been Successfully Updated", data: result });
            }

        });
    });
    router.post('/updateEmergencyUser/:id', function (req, res) {
        if (!req.body.name || req.body.name == undefined) {
            res.json({ success: false, message: "Name is Required" });

            return;
        } else if (!req.body.mobile.primary) {

            res.json({ success: false, message: "Primary Number is Required" });
            return;
        }
        var query = { '_id': req.params.id };
        UserProfile.findOneAndUpdate({ '_id': req.params.id }, { $set: { "emergency.name": req.body.name, "emergency.relationship": req.body.relationship, "emergency.mobile.primary": req.body.mobile.primary, "emergency.mobile.secondary": req.body.mobile.secondary, "emergency.address.line1": req.body.address.line1, "emergency.address.line2": req.body.address.line2, "emergency.address.city": req.body.address.city, "emergency.address.district": req.body.address.district, "emergency.address.state": req.body.address.state, "emergency.address.pin": req.body.address.pin } }, function (err, result) {
            if (err) throw err;
            else {
                ////////////////////////////////////////////////audit save///////
                audit.send(req.params.id, 'Profile', 'Updated', 'Emergency Information', '1', 'fa fa-user text-success');
                ////////////////////////////////////////////////////////
                res.json({ success: true, message: "Data Has Been Successfully Updated", data: result });
            }

        });

    });


    router.post('/updateEmpInfo/:id', function (req, res) {
        var query = { '_id': req.params.id };

        UserProfile.findOneAndUpdate({ '_id': req.params.id }, { $set: { "employer.name": req.body.name, "employer.designation": req.body.designation, "employer.mobile": req.body.mobile, "employer.cug": req.body.cug, "employer.address.line1": req.body.address.line1, "employer.address.line2": req.body.address.line2, "employer.address.city": req.body.address.city, "employer.address.district": req.body.address.district, "employer.address.state": req.body.address.state, "employer.address.pin": req.body.address.pin } }, function (err, result) {
            if (err) throw err;
            else {
                ////////////////////////////////////////////////audit save///////
                audit.send(req.params.id, 'Profile', 'Updated', 'Employer Information', '1', 'fa fa-user text-success');
                ////////////////////////////////////////////////////////
                res.json({ success: true, message: "Data Has Been Successfully Updated", data: result });
            }

        });

    });

    router.post('/updateInsInfo/:id', function (req, res) {
        var query = { '_id': req.params.id };

        UserProfile.findOneAndUpdate({ '_id': req.params.id }, { $set: { "insurance.provider": req.body.provider, "insurance.number": req.body.number, "insurance.name": req.body.name, "insurance.validity": req.body.validity } }, function (err, result) {
            if (err) throw err;
            else {
                ////////////////////////////////////////////////audit save///////
                audit.send(req.params.id, 'Profile', 'Updated', 'Insurance Information', '1', 'fa fa-user text-success');
                ////////////////////////////////////////////////////////
                res.json({ success: true, message: "Data Has Been Successfully Updated", data: result });
            }

        });

    });


    router.post('/updateHospitalInfo/:id', function (req, res) {

        var query = { '_id': req.params.id };

        UserProfile.findOneAndUpdate({ '_id': req.params.id }, { $set: { "hospital_preferance.name": req.body.name, "hospital_preferance.address": req.body.address, "hospital_preferance.requirements": req.body.requirements } }, function (err, result) {
            if (err) throw err;
            else {
                ////////////////////////////////////////////////audit save///////
                audit.send(req.params.id, 'Profile', 'Updated', 'Hospital Information', '1', 'fa fa-user text-success');
                ////////////////////////////////////////////////////////
                res.json({ success: true, message: "Data Has Been Successfully Updated", data: result });
            }

        });

    });
    // Update Password Route
    router.post('/updatePassword/:id', function (req, res) {
        UserProfile.findOne({ '_id': req.params.id, }).select().exec(function (err, user) {
            if (err) throw err;
            if (!req.body.password)
                res.json({ success: false, message: "Please Provide a Password First" });

            var validPassword = user.comparePassword(req.body.opassword);
            if (!validPassword) res.json({ success: false, message: "Invalide Password! Please cross check your Old password again!" });
            else {
                user.personal.password = req.body.password;
                user.save(function (err) {
                    if (err) throw err;
                    else {

                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.params.id, 'ChangePassword', 'Changed', 'Change Password', '1', 'fa fa-lock');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: "Your password has been changed!" });

                    }
                });
            }
        });
    });

    // get Profile Picture
    router.get('/getProfilePicture/:id', function (req, res) {
        UserProfile.findOne({
            '_id': req.params.id
        }).exec(function (err, user) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!user) res.json({ success: false, message: "Invalid ID. Could Not Find User!" });
            else if (user) {
                res.json({ success: true, message: user.personal.image });
            }
        });
    });


    // Set Profile Picture

    router.post('/setProfilePicture/:id', function (req, res) {
        var query = { '_id': req.params.id };
        if (!req.body.personal.image)
            res.json({ success: false, message: "Corrupt or no Image Provided" });
        var t = req.body.personal.image;
        var name = t.filename;
        req.body.personal.image = 'uploads/profile/' + shortid.generate() + '.' +
            name.split('.')[1];
        UserProfile.findOneAndUpdate(query, req.body, { upsert: true, new: true },
            function (err, doc) {
                if (err) throw err;
                else {
                    var imageBuffer = new Buffer(t.base64, 'base64');
                    fs.writeFile('public/' + doc.personal.image, imageBuffer, function (err) {
                        res.json({
                            success: true,
                            message: "Image Has Been Successfully Updated",
                            data: doc
                        });

                    });
                }
            });
    });
    ///////////////////////////////////////////for web only

    router.post('/setProfilePic/:id', function (req, res) {
        var query = { '_id': req.params.id };
        if (!req.body)
            res.json({ success: false, message: "Corrupt or no Image Provided" });
        var t = req.body;
        var name = t.filename;
        var imagepath = 'uploads/profile/' + shortid.generate() + '.' + name.split('.')[1];
        UserProfile.findOneAndUpdate(query, { $set: { "personal.image": imagepath } }, { upsert: true, new: true },
            function (err, doc) {
                if (err) throw err;
                else {
                    var imageBuffer = new Buffer(t.base64, 'base64');
                    fs.writeFile('public/' + doc.personal.image, imageBuffer, function (err) {
                        res.json({
                            success: true,
                            message: "Image Has Been Successfully Updated",
                            data: doc
                        });
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.params.id, 'ChangePicture', 'Changed', 'Change Picture', '1', 'fa fa-picture-o');
                        ////////////////////////////////////////////////////////
                    });
                }
            });
    });
    // get Profile Picture
    router.get('/GetDisabilityimage/:id', function (req, res) {
        UserProfile.findOne({
            '_id': req.params.id
        }).exec(function (err, user) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!user) res.json({ success: false, message: "Invalid ID. Could Not Find User!" });
            else if (user) {
                res.json({ success: true, message: user.personal.disabilityimage });
            }
        });
    });
    return router;

};