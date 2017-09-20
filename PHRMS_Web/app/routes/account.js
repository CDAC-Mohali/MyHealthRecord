/*
 * User Registration and Session Management Section.  
 * Requires no Token Authentication
 */

var mongoose = require('mongoose');
var UserProfile = require('../models/user-profile.js');
var StateMaster = require('../models/state-master.js');
var FeedbackUser = require('../models/feedback-user.js');
var ContactUsDetail = require('../models/contactus-details.js');
var jwt = require('jsonwebtoken');
var MailerService = require('../classes/mail.js');
var mailer = new MailerService();
var secret = 'B@&$bt7t63b493ocn';
var UDIDMapping = require('../models/UDIDMapping-user.js');


var SMSService = require('../classes/sms.js');
var fs = require('fs');
var shortId = require('shortid');
var path = require('path');
var Audit = require('../models/audit-trail.js');

var express = require('express');
var app = express();
var session = require('express-session');
app.use(session({
    secret: "Shh, its a secret!"
}));
var ValidationService = require('../classes/ValidationError.js');
var ValidationServiceMessage = new ValidationService();
module.exports = function(router) {
    var bcrypt = require('bcrypt-nodejs');
    var request = require('request');

    ////IOS Logic
    router.post('/CheckUserWithUDID', function(req, res) {

        UDIDMapping.findOne({
            "Info.UDID": req.body.UDID,
            "Info.DeleteFlag": false
        }).exec(function(err, udidmap) {
            if (err) {
                res.json({
                    success: false,
                    message: "Something went wrong."
                });
            }
            if (udidmap && udidmap.User && udidmap.User != null)
                res.json({
                    success: true,
                    message: udidmap.User
                });
            else
                res.json({
                    success: false,
                    message: "No Record found."
                });
            d
        });

    });
    /////
    //aadhaar
    router.post('/VerifyAadhaar', function(req, res) {
        var AadhaarNo = req.body.AadhaarNo;
        UserProfile.find({
            "personal.aadhar": AadhaarNo,
            'OTPVerify': true
        }, function(err, result) {
            if (err) {
                res.json({
                    success: false
                });
            } else {
                if (result && result.length > 0) {
                    res.json({
                        success: false,
                        message: "Already Registered."
                    });
                } else {
                    var options = {
                        uri: 'http://localhost:8089/AadhaarIntegrationAPIs/aadharVerification/getOTP',
                        method: 'POST',
                        json: {
                            "uid": AadhaarNo
                        }
                    };
                    request(options, function(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            if (body.otpRes.ret == "n" || body.otpRes.ret == "N") {
                                res.json({
                                    success: false,
                                    message: ValidationServiceMessage.GetStatusByCode(body.otpRes.err)
                                });
                            } else {
                                res.json({
                                    success: true,
                                    message: body.otpRes
                                });
                            }

                        } else {
                            res.json({
                                success: false,
                                message: "Something went wrong"
                            });
                        }

                    });
                }
            }

        })

    });


    router.post('/VerifyAadhaarOTP', function(req, res) {
        var AadhaarNo = req.body.AadhaarNo;
        UserProfile.find({
            "personal.aadhar": AadhaarNo,
            'OTPVerify': true
        }, function(err, result) {
            if (err) {
                res.json({
                    success: false
                });
            } else {
                if (result && result.length > 0) {
                    res.json({
                        success: false,
                        message: "Already Registered."
                    });
                } else {
                    var options = {
                        uri: 'http://localhost:8089/AadhaarIntegrationAPIs/aadharVerification/checkValidity',
                        method: 'POST',
                        json: {
                            "uid": AadhaarNo,
                            "txn": req.body.txn,
                            "otp": req.body.OTP
                        }
                    };
                    request(options, function(error, response, body) {

                        if (!error && response.statusCode == 200) {

                            //     console.log(body.agentKYCRes);
                            if (body.agentKYCRes.ret == "y" || body.agentKYCRes.ret == "Y") {

                                res.json({
                                    success: true,
                                    message: body.agentKYCRes
                                });
                            } else {
                                res.json({
                                    success: false,
                                    message: ValidationServiceMessage.GetStatusByCode(body.agentKYCRes.err)
                                });

                            }


                        } else {
                            res.json({
                                success: false,
                                message: "Something went wrong"
                            });
                        }

                    });
                }
            }

        })

    });


    router.post('/addContactUsDetails', function(req, res) {

        var contact = new ContactUsDetail(req.body);
        contact.save(function(err, cont) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Oops! Some Error Occured.'
                });
            } else {

                res.json({
                    success: true,
                    message: ("sucess")
                });
            }
        });
    });
    ////////
    // State Listing
    router.get('/getStateList', function(req, res) {
        StateMaster.find({}).exec(
            function(err, doc) {
                res.json({
                    success: true,
                    message: doc
                });
            });
    });

    // User Registration Route

    var sms = new SMSService();


    router.post('/users', function(req, res) {

        req.body.OTP = Math.floor(1000 + Math.random() * 9000);
        var user = new UserProfile(req.body);
        if (req.body.personal.mobile === null || req.body.personal.mobile === '' || req.body.personal.password === null || req.body.personal.password === '') {
            res.json({
                success: false,
                message: 'Ensure Mobile and Password were Provided'
            });
        } else {

            UserProfile.remove({
                $or: [{
                    'personal.email': req.body.personal.email
                }, {
                    'personal.mobile': req.body.personal.mobile
                }],
                $and: [{
                    'OTPVerify': false
                }]
            }).exec(function(err, user) {
                if (err) {
                    console.log(err);
                    throw err;
                }
            });

            user.save(function(err) {

                if (err) {

                    if (err.name == "ValidationError") {
                        res.json({
                            success: false,
                            message: 'Please fill Required field!'
                        });
                    } else {
                        res.json({
                            success: false,
                            message: 'Mobile or Email Address Already Exists! '
                        });
                    }

                } else {

                    sms.send(req.body.personal.mobile, "The verification code for registration at MyHealthRecord is : " + req.body.OTP + ".");
                    res.json({
                        success: true,
                        message: 'Congratulations! You have been registered!... We are Redirecting You to Login Now!'
                    });
                    //     res.json({ success: true });
                }
            });
        }
    });

    router.post('/AadhaarRegistration', function(req, res) {

        req.body.OTPVerify = true;
        var user = new UserProfile(req.body);
        if (req.body.personal.mobile === null || req.body.personal.mobile === '' || req.body.personal.password === null || req.body.personal.password === '') {
            res.json({
                success: false,
                message: 'Ensure Mobile and Password were Provided'
            });
        } else {

            UserProfile.remove({
                $or: [{
                    'personal.email': req.body.personal.email
                }, {
                    'personal.mobile': req.body.personal.mobile
                }, {
                    'personal.aadhar': req.body.personal.aadhar
                }],
                $and: [{
                    'OTPVerify': false
                }]
            }).exec(function(err, user) {
                if (err) {
                    console.log(err);
                    throw err;
                }
            });

            user.save(function(err) {

                if (err) {

                    if (err.name == "ValidationError") {
                        var errString = "";
                        for (var errName in err.errors) {
                            errString += (' > ' + err.errors[errName].message);
                        }
                        res.json({
                            success: false,
                            message: errString
                        });
                        //   res.json({ success: false, message: 'Please fill Required field!' });
                    } else {
                        res.json({
                            success: false,
                            message: 'Mobile or Email Address or Aadhaar Number Already Exists! '
                        });
                    }

                } else {

                    const fs = require('fs');
                    fs.readFile('public/Templates/SuccessReg.html', {
                        encoding: 'utf-8'
                    }, function(err, data) {
                        if (!err) {

                            data = data.replace("{Title}", req.body.personal.name.first);
                            data = data.replace("{messagephrms}", "Thank you for registering at MyHealthRecord. You can now access your health record at http://myhealthrecord.nhp.gov.in.");
                            mailer.setMailOptions(req.body.personal.email, "Welcome to My Health Record!", data);
                            mailer.dispatch();
                            sms.send(req.body.personal.mobile, "Thank you for registering at MyHealthRecord. You can now access your health record at http://myhealthrecord.nhp.gov.in.");

                        } else {
                            console.log(err);
                        }
                    });
                    res.json({
                        success: true
                    });

                }
            });
        }
    });


    router.post('/SmsOTP', function(req, res) {
        sms.send(req.body.MobileNo, req.body.SmsStr);
    });

    router.post('/VerifyOTP', function(req, res) {

        var MobileNo = req.body.MobileNo;
        var UOTP = req.body.UOTP;

        UserProfile.find({
            "personal.mobile": MobileNo,
            'OTPVerify': false
        }, function(err, result) {
            if (err) {
                res.json({
                    success: false
                });
            } else {
                if (result && result.length > 0) {
                    if (result[0].OTP == UOTP) {

                        UserProfile.findOneAndUpdate({
                            "personal.mobile": MobileNo,
                            'OTPVerify': false
                        }, {
                            $set: {
                                OTPVerify: true
                            }
                        }, function(err, result2) {
                            if (result2) {
                                const fs = require('fs');
                                fs.readFile('public/Templates/SuccessReg.html', {
                                    encoding: 'utf-8'
                                }, function(err, data) {
                                    if (!err) {

                                        data = data.replace("{Title}", result2.personal.name.first + " " + result2.personal.name.last);
                                        data = data.replace("{messagephrms}", "Thank you for registering at MyHealthRecord. You can now access your health record at http://myhealthrecord.nhp.gov.in.");
                                        mailer.setMailOptions(result2.personal.email, "Welcome to My Health Record!", data);
                                        mailer.dispatch();
                                        sms.send(result2.personal.mobile, "Thank you for registering at MyHealthRecord. You can now access your health record at http://myhealthrecord.nhp.gov.in.");

                                    } else {
                                        console.log(err);
                                    }
                                });
                                res.json({
                                    success: true
                                });
                            }
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                }
            }
        });


    });



    router.post('/VerifyMobile', function(req, res) {
        var MobileNo = req.body.MobileNo;
        UserProfile.find({
            "personal.mobile": MobileNo,
            'OTPVerify': true
        }, function(err, result) {
            if (err) {
                res.json({
                    success: false
                });
            } else {
                if (result && result.length > 0) {
                    if (result[0].personal.mobile == MobileNo) {
                        var OTP = Math.floor(1000 + Math.random() * 9000);
                        sms.send(MobileNo, "The verification code for login By OTP at MyHealthRecord is : " + OTP + ".");

                        UserProfile.findOneAndUpdate({
                            "personal.mobile": MobileNo
                        }, {
                            $set: {
                                LoginOTP: OTP
                            }
                        }, function(err, result2) {
                            if (result2) {
                                res.json({
                                    success: true,
                                    message: result2
                                });
                            }
                        })

                    } else {
                        res.json({
                            success: false
                        });
                    }

                } else {
                    res.json({
                        success: false
                    });
                }
            }

        })

    });


    router.post('/VerifyLogOTP', function(req, res) {
        var OTP = req.body.OTP;
        var MobileNo = req.body.MobileNo
        UserProfile.find({
            "personal.mobile": MobileNo,
            'OTPVerify': true
        }, function(err, result) {

            if (err) {
                res.json({
                    success: false
                });
            } else {
                if (result && result.length > 0) {
                    if (result[0].LoginOTP == OTP) {


                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                } else {
                    res.json({
                        success: false
                    });
                }

            }

        });

    });

    // User Authentication/Login Method
    router.post('/VerifyMobileEmail', function(req, res) {

        UserProfile.findOne({
            $or: [{
                'personal.email': req.body.username
            }, {
                'personal.mobile': req.body.username
            }],
            $and: [{
                'OTPVerify': true
            }]
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!user) res.json({
                success: false,
                message: "Invalid Email or Mobile. Could Not Authenticate!"
            });
            else if (user) {



                var OTP = Math.floor(1000 + Math.random() * 9000);
                sms.send(user.personal.mobile, "The verification code for changing the password of your account is " + OTP + ".");

                const fs = require('fs');
                fs.readFile('public/Templates/OTPChgPwd.html', {
                    encoding: 'utf-8'
                }, function(err, data) {
                    if (!err) {
                        data = data.replace("{Title}", user.personal.name.first + " " + user.personal.name.last);
                        data = data.replace("{messagephrms}", "Your verification code for Changing Password at MyHealthRecord is");
                        data = data.replace("{rno}", OTP);
                        mailer.setMailOptions(user.personal.email, "Welcome to My Health Record!", data);
                        mailer.dispatch();

                    } else {
                        console.log(err);
                    }
                });

                //  mailer.setMailOptions(user.personal.email, "Welcome to My Health Record!", "The verification code for changing the password of your account is " + OTP + ".");
                // mailer.dispatch();

                UserProfile.findOneAndUpdate({
                    "personal.mobile": user.personal.mobile
                }, {
                    $set: {
                        LoginOTP: OTP
                    }
                }, function(err, result2) {
                    if (result2) {


                        res.json({
                            success: true,
                            message: result2
                        });
                        //  sms.send(user.personal.mobile, "Your password changed successfully.");
                    }
                })
            } else {
                res.json({
                    success: false,
                    message: "Invalid Username. Could Not Authenticate User!"
                });
            }
        })
    })



    router.post('/VerifyForgetOTP', function(req, res) {
        var OTP = req.body.OTP;
        UserProfile.findOne({
            $or: [{
                'personal.email': req.body.username
            }, {
                'personal.mobile': req.body.username
            }],
            $and: [{
                'OTPVerify': true
            }]
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
                throw err;
            } else if (user) {


                if (user.LoginOTP == OTP) {
                    res.json({
                        success: true,
                        message: user.personal.mobile
                    });
                } else {
                    res.json({
                        success: false,
                        message: "Please Enter valid OTP!"
                    });
                }
            }

        });
    });





    router.post('/ResetPassword', function(req, res) {
        var validPassword = "";
        bcrypt.hash(req.body.Password, null, null, function(err, hash) {

            UserProfile.findOneAndUpdate({
                "personal.mobile": req.body.Mobile,
                'OTPVerify': true
            }, {
                $set: {
                    "personal.password": hash
                }
            }, function(err, result2) {
                if (result2) {
                    res.json({
                        success: true,
                        message: result2
                    });
                } else {
                    res.json({
                        success: false
                    });
                }
            })



        });


    });


    // User Authentication/Login Method
    router.post('/authenticate', function(req, res) {
        //  sms.send("7696204750", "Hi! Enjoy your Pune trip");
        UserProfile.findOne({
            $or: [{
                'personal.email': req.body.username
            }, {
                'personal.mobile': req.body.username
            }],
            $and: [{
                'OTPVerify': true
            }]
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!user) res.json({
                success: false,
                message: "Invalid Username. Could Not Authenticate User!"
            });
            else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) res.json({
                    success: false,
                    message: "Invalid Password! Please cross check your password again!"
                });
                else {
                    var token = jwt.sign({
                        id: user._id,
                        email: user.personal.email,
                        phone: user.personal.mobile,
                        name: user.personal.name.first + " " + user.personal.name.last
                    }, secret, {
                        expiresIn: '1h'
                    });
                    res.json({
                        success: true,
                        message: "User Found! Logging You in and Redirecting ...",
                        token: token
                    });
                }
            }
        });
    });

    /////////////login by otp


    // User Authentication/Login Method
    router.post('/authenticateOTP', function(req, res) {
        //  sms.send("7696204750", "Hi! Enjoy your Pune trip");
        UserProfile.findOne({
            $or: [{
                'personal.email': req.body.username
            }, {
                'personal.mobile': req.body.username
            }],
            $and: [{
                'OTPVerify': true
            }]
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
                throw err;
            } else if (user) {

                var token = jwt.sign({
                    id: user._id,
                    email: user.personal.email,
                    phone: user.personal.mobile,
                    name: user.personal.name.first + " " + user.personal.name.last
                }, secret, {
                    expiresIn: '1h'
                });
                res.json({
                    success: true,
                    message: "User Found! Logging You in and Redirecting ...",
                    token: token
                });

            }
        });
    });



    // DigiLocker for Lab
    router.post('/UploadLabDigilockerFile', function(req, res) {
        const fs = require('fs');
        const download = require('download');
        var shortid = require('shortid');
        var FolderName = shortid.generate();
        var Object = JSON.parse(req.body.file_upload_server);
        if (!fs.existsSync('public/uploads/lab/' + FolderName)) {
            fs.mkdirSync('public/uploads/lab/' + FolderName);
        }
        //    console.log('public/LabImages/' + FolderName);
        download(Object.doc_url, 'public/uploads/lab/' + FolderName).then(() => {
            var files = fs.readdirSync('public/uploads/lab/' + FolderName);
            req.session.labfilepath = "uploads/lab/" + FolderName + "/" + files[0];


            res.send("SUCCESS");
        });
    });
    //DigiLocker for Procedures
    router.post('/UploadProcedureDigilockerFile', function(req, res) {
        const fs = require('fs');
        const download = require('download');
        var shortid = require('shortid');
        var FolderName = shortid.generate();
        var Object = JSON.parse(req.body.file_upload_server);
        if (!fs.existsSync('public/uploads/procedure/' + FolderName)) {
            fs.mkdirSync('public/uploads/procedure/' + FolderName);
        }
        //    console.log('public/LabImages/' + FolderName);
        download(Object.doc_url, 'public/uploads/procedure/' + FolderName).then(() => {
            var files = fs.readdirSync('public/uploads/procedure/' + FolderName);
            req.session.procedurefilepath = "uploads/procedure/" + FolderName + "/" + files[0];
            res.send("SUCCESS");
        });
    });
    //DigiLocker for Medicine
    router.post('/UploadMedicineDigilockerFile', function(req, res) {
        const fs = require('fs');
        const download = require('download');
        var shortid = require('shortid');
        var FolderName = shortid.generate();
        var Object = JSON.parse(req.body.file_upload_server);
        if (!fs.existsSync('public/uploads/medication/' + FolderName)) {
            fs.mkdirSync('public/uploads/medication/' + FolderName);
        }
        //    console.log('public/LabImages/' + FolderName);
        download(Object.doc_url, 'public/uploads/medication/' + FolderName).then(() => {
            var files = fs.readdirSync('public/uploads/medication/' + FolderName);
            req.session.medicinefilepath = "uploads/medication/" + FolderName + "/" + files[0];
            res.send("SUCCESS");
        });
    });
    //DigiLocker for Medicine
    router.post('/UploadEprescriptionDigilockerFile', function(req, res) {
        const fs = require('fs');
        const download = require('download');
        var shortid = require('shortid');
        var FolderName = shortid.generate();
        var Object = JSON.parse(req.body.file_upload_server);
        if (!fs.existsSync('public/uploads/eprescription/' + FolderName)) {
            fs.mkdirSync('public/uploads/eprescription/' + FolderName);
        }
        //    console.log('public/LabImages/' + FolderName);
        download(Object.doc_url, 'public/uploads/eprescription/' + FolderName).then(() => {
            var files = fs.readdirSync('public/uploads/eprescription/' + FolderName);
            req.session.eprescriptionfilepath = "uploads/eprescription/" + FolderName + "/" + files[0];
            res.send("SUCCESS");
        });
    });
    router.get('/getFilePath', function(req, res) {
        if (!req.session.labfilepath)
            req.session.labfilepath = "";
        return res.json({
            success: true,
            message: req.session.labfilepath
        });
    });
    router.get('/setFilePath', function(req, res) {
        req.session.labfilepath = "";
        return res.json({
            success: true,
            message: req.session.labfilepath
        });
    });

    router.get('/getProcedureFilePath', function(req, res) {
        if (!req.session.procedurefilepath)
            req.session.procedurefilepath = "";
        return res.json({
            success: true,
            message: req.session.procedurefilepath
        });
    });
    router.get('/setProcedureFilePath', function(req, res) {
        req.session.procedurefilepath = "";
        return res.json({
            success: true,
            message: req.session.procedurefilepath
        });
    });
    router.get('/getMedicineFilePath', function(req, res) {
        if (!req.session.medicinefilepath)
            req.session.medicinefilepath = "";
        return res.json({
            success: true,
            message: req.session.medicinefilepath
        });
    });
    router.get('/setMedicineFilePath', function(req, res) {
        req.session.medicinefilepath = "";
        return res.json({
            success: true,
            message: req.session.medicinefilepath
        });
    });
    router.get('/getEprescriptionFilePath', function(req, res) {
        if (!req.session.eprescriptionfilepath)
            req.session.eprescriptionfilepath = "";
        return res.json({
            success: true,
            message: req.session.eprescriptionfilepath
        });
    });
    router.get('/setEprescriptionFilePath', function(req, res) {
        req.session.eprescriptionfilepath = "";
        return res.json({
            success: true,
            message: req.session.eprescriptionfilepath
        });
    });
    router.post('/addFeedback/:id', function(req, res) {
        var feedback = new FeedbackUser(req.body);
        req.body.User = req.params.id;
        var id = shortId.generate();
        var file;
        if (req.body.Feedback.File) {
            if (!fs.existsSync('public/uploads/feedback/' + feedback.Feedback.About + '/' + req.body.User))
                fs.mkdirSync('public/uploads/feedback/' + feedback.Feedback.About + '/' + req.body.User);
            fs.mkdirSync('public/uploads/feedback/' + feedback.Feedback.About + '/' + req.body.User + '/' + id);
            feedback.Feedback.FileFlag = req.body.Feedback.File.filename;
            feedback.Feedback.FilePath = 'uploads/feedback/' + feedback.Feedback.About + '/' + req.body.User + '/' + id + "/" + feedback.Feedback.FileFlag;

            file = req.body.Feedback.File;
            delete req.body.Feedback.File;
        }
        feedback.save(function(err) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Oops! Some Error Occured '
                });
            } else {

                //   console.log(file);
                if (file) {
                    var imageBuffer = new Buffer(file.base64, 'base64');
                    fs.writeFile("public/" + feedback.Feedback.FilePath, imageBuffer, function(err) {});
                 
                } else {
                   

                }
                // mailer.setMailOptionswithattachment("summi15@gmail.com", "My Health Record Feedback on " + feedback.Feedback.About, feedback.Feedback.Feedback, feedback.Feedback.FileFlag, file.base64);
                // mailer.dispatch();
                res.json({
                    success: true,
                    message: 'Thank you for your Feedback! Your feedback has been registered!'
                });
            }
        });
    });
    router.get('/getUserActivities/:id', function(req, res) {
        Audit.aggregate({
                $match: {
                    User: req.params.id
                }
            }, {
                $unwind: "$Info"
            }, {
                $sort: {
                    "Info.CreatedDate": -1
                }
            }, {
                $limit: 1000

            }, {
                $project: {
                    Record: "$Info"
                }
            },
            function(err, data) {
                if (err) throw err;
                else {
                    res.json({
                        success: true,
                        message: data
                    });
                }
            });
        // Audit.find({
        //         $and: [
        //             { User: req.params.id }
        //         ]
        //     },
        //     function(err, doc) {
        //         if (err) console.log(err);
        //         else res.json({ success: true, message: doc[0].Info });

        //     });


    });
    return router;
};