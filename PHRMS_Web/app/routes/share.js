/*
 * Allergy Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var moment = require('moment');
var Share = require('../models/share-model.js');
var bytes = require('utf8-length');
var SMSService = require('../classes/sms.js');
var MailerService = require('../classes/mail.js');
var mailer = new MailerService();
var sms = new SMSService();
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();

module.exports = function(router) {

    // Add/Update User Allergy List
    router.post('/addShareData', function(req, res) {
        if (!req.body.Contact._id) {
            res.json({ success: false, message: 'Please ensure that you have chosen a medical contact to share with!' });
        } else {
            req.body.PassPhrase = Math.floor(Math.random() * 900000) + 100000;
            req.body.Contact.Id = mongoose.Types.ObjectId(req.body.Contact.Id);
            req.body.UserId = mongoose.Types.ObjectId(req.body.UserId);
            var pre_query = new Date().getTime();
            var share = new Share(req.body);
            share.save(function(err, share) {
                if (err) {
                    var errString = "";
                    for (var errName in err.errors) {
                        errString += (' > ' + err.errors[errName].message);
                    }
                    res.json({ success: false, message: errString });
                } else {
                    var i, net_size = 0;
                    if (req.body.Lab)
                        for (i = 0; i < (req.body.Lab).length; i++) {
                            if (req.body.Lab[i].FileSize)
                                net_size += req.body.Lab[i].FileSize;
                        }
                    if (req.body.Medication)
                        for (i = 0; i < (req.body.Medication).length; i++) {
                            if (req.body.Medication[i].FileSize)
                                net_size += req.body.Medication[i].FileSize;
                        }
                    if (req.body.Procedure)
                        for (i = 0; i < (req.body.Procedure).length; i++) {
                            if (req.body.Procedure[i].FileSize)
                                net_size += req.body.Procedure[i].FileSize;
                        }
                    net_size += bytes(JSON.stringify(req.body));
                    net_size /= 1024;
                    net_size = Math.round(net_size * 100) / 100;
                    var post_query = new Date().getTime();
                    var duration = (post_query - pre_query) / 1000;
                    if (typeof(req.body.Contact.Mobile) !== 'undefined' && req.body.Contact.Mobile) {
                        sms.send(
                            req.body.Contact.Mobile,
                            req.body.Name + " just shared his/her medical profile with you. Please visit http://myhealthrecord.nhp.gov.in/share to view the records. Your OTP is " +
                            req.body.PassPhrase + " and is valid for " + req.body.Validity + " days."
                        );
                    }

                    const fs = require('fs');

                    fs.readFile('public/Templates/ShareReport.html', { encoding: 'utf-8' }, function(err, data) {
                        if (!err) {

                            if (typeof(req.body.Contact.Email) !== 'undefined' && req.body.Contact.Email) {
                                data = data.replace("{Title}", "Hi");
                                data = data.replace("{messagephrms}", req.body.Name + " just shared his/her medical profile with you. Please <a href='http://myhealthrecord.nhp.gov.in/share'> Click Here </a> to view the records. Your OTP is " + req.body.PassPhrase + " and is valid for " + req.body.Validity + " days.");
                                mailer.setMailOptions(req.body.Contact.Email, "Welcome to My Health Record", data);
                                mailer.dispatch();
                            }

                        } else {
                            console.log(err);
                        }
                    });



                    ////////////////////////////////////////////////audit save///////
                    audit.send(req.body.UserId, 'ShareData', 'Added', 'Share Record', '1', 'fa fa-share-alt text-danger');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: net_size + " kB Shared in " + duration + "s!" });
                }
            });
        }
    });

    // Check Passkey 
    router.get('/checkPassKey/:key', function(req, res) {
        Share.findOne({ PassPhrase: req.params.key }, function(err, data) {
            if (err)
                console.log(err);
            else {
                if (!data)
                    res.json({ success: false, message: "Oops! The Password You Enetered did not Match our Records." });
                else {
                    if ((moment(data.CreateDate).add(data.Validity, 'days') - data.CreateDate) > 0) {
                        data.Status = 2;
                        data.ReadNotification = true;
                        Share.findOneAndUpdate({ _id: data._id }, data, function(err, doc) {
                            if (err) console.log(err);
                            else {
                                sms.send(data.Mobile, data.Contact.Name + " just viewed the data you shared with him/her, dated " +
                                    data.strCreatedDate + " via MyHealthRecord Portal.")
                                res.json({ success: true, message: data });
                            }
                        });
                    } else
                        res.json({ success: false, message: "Oops! The Password You Entered Has Expired." });
                }
            }
        });
    });

    // Submit Response
    router.post('/submitResponse/:id', function(req, res) {
        req.body.Status = 3;
        req.body.ContactMessage.SendDate = Date.now();
        req.body.ReplyNotification = true;
        Share.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, doc) {
            if (err) console.log(err);
            else {
                sms.send(req.body.Mobile, req.body.Contact.Name + " just replied to the query you posted with shared data, dated " +
                    req.body.strCreatedDate + " via MyHealthRecord Portal. Login to view the response.");
                res.json({ success: true, message: "Success! The message has been submitted." });
            }
        });
    });

    // Get Notifications
    router.get('/getNotifications/:id', function(req, res) {
        Share.find({
                $and: [
                    { UserId: req.params.id },
                    { $or: [{ ReadNotification: true }, { ReplyNotification: true }] }
                ]
            },
            function(err, doc) {
                if (err) console.log(err);
                else res.json({ success: true, message: doc });
            });
    });

    // Mark notifications
    router.get('/markNotifications/:id', function(req, res) {
        Share.find({
                $and: [
                    { UserId: req.params.id },
                    { $or: [{ ReadNotification: true }, { ReplyNotification: true }] }
                ]
            },
            function(err, doc) {
                if (err) console.log(err);
                else {
                    for (var i = 0; i < doc.length; i++) {
                        doc[i].ReplyNotification = false;
                        doc[i].ReadNotification = false;
                        Share.findOneAndUpdate({ _id: doc[i]._id }, doc[i], function(err) {});
                    }
                }
            });
    });

    // Get Share History
    router.get('/getHistory/:id', function(req, res) {

        Share.find({
            UserId: req.params.id
        }).sort({ CreateDate: -1 }).exec(function(err, doc) {
            res.json({ success: true, message: doc });
        });

    });





    router.get('/getRecord/:id', function(req, res) {
        Share.findOne({ _id: req.params.id }, function(err, doc) {
            if (err) console.log(err);
            else res.json({ success: true, message: doc });
        });
    });
    router.get('/CheckPdf', function(req, res) {
        var wkhtmltopdf = require('wkhtmltopdf');
        wkhtmltopdf('http://google.com/', { pageSize: 'letter' })
            .pipe(fs.createWriteStream('out.pdf'));
        // var options = [
        //     '--quiet'
        // ];
        // var wkhtmltopdf = require('node-wkhtmltopdf');
        // wkhtmltopdf('--quiet', 'http://google.com', 'F:\MEANPROJECTS\LATESTPHRMS\public\app\views\google.pdf');
    });

    return router;

};