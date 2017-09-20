/*
 * ePrescription Module Routes. 
 * They Require Access Tokens too.
 * No Get Listing Method for ePrescriptions
 */

var mongoose = require('mongoose');
var ePrescriptionUser = require('../models/eprescription-user.js');
var fs = require('fs');
var shortId = require('shortid');
var path = require('path');
var moment = require('moment');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();
module.exports = function (router) {

    // Add/Update User ePrescription List
    router.post('/addePrescriptionUser', function (req, res) {
        if (!req.body.Info.DoctorName ||
            !req.body.Info.ClinicName ||
            !req.body.Info.Phone ||
            !req.body.Info.strDate) {
            res.json({ success: false, message: "Please ensure that fields marked with * are provided" });
        } else {
            ePrescriptionUser.findOne({ User: req.body.User }).exec(function (err, userePrescription) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                var file;
                if (!userePrescription) {
                    req.body.Info.Date = moment(req.body.Info.strDate, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/eprescription/' + req.body.User))
                            fs.mkdirSync('public/uploads/eprescription/' + req.body.User);
                        fs.mkdirSync('public/uploads/eprescription/' + req.body.User + '/' + id);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/eprescription/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }
                    var eprescription = new ePrescriptionUser(req.body);
                    eprescription.save(function (err, eprescription) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else {
                            if (file) {
                                var imageBuffer = new Buffer(file.base64, 'base64');
                                fs.writeFile("public/" + req.body.Info.FilePath, imageBuffer, function (err) { });
                            }

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'ePrescription', 'Added', 'Prescription', '1', 'pe-7s-note2 text-success');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: eprescription });
                        }
                    });
                } else if (userePrescription) {
                    req.body.Info.Date = moment(req.body.Info.strDate, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/eprescription/' + req.body.User))
                            fs.mkdirSync('public/uploads/eprescription/' + req.body.User);
                        fs.mkdirSync('public/uploads/eprescription/' + req.body.User + '/' + id);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/eprescription/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }
                    ePrescriptionUser.findByIdAndUpdate(
                        userePrescription._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                        function (err, eprescription) {
                            if (err) {
                                var errString = "";
                                for (var errName in err.errors) {
                                    errString += (' > ' + err.errors[errName].message);
                                }
                                res.json({ success: false, message: errString });
                            } else {
                                if (file) {
                                    var imageBuffer = new Buffer(file.base64, 'base64');
                                    fs.writeFile("public/" + req.body.Info.FilePath, imageBuffer, function (err) { });
                                }


                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'ePrescription', 'Added', 'Prescription', '1', 'pe-7s-note2 text-success');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: eprescription });
                            }
                        }
                    );
                }
            });
        }
    });

    // Get User ePrescription
    router.get('/getUserePrescription/:id', function (req, res) {
        ePrescriptionUser.aggregate([{
            $match: {
                User: req.params.id
            }
        },
        { $unwind: "$Info" }, {
            $sort: {
                 "Info.Date": -1
            }
        },
        {
            $match: {
                "Info.DeleteFlag": false
            }
        },
        {
            $group: { '_id': '$_id', 'Info': { '$push': '$Info' } }
        }
        ]).exec(function (err, eprescription) {
            res.json({ success: true, message: eprescription[0] });
        });
    });

    // Remove User ePrescription
    router.post('/removeUserePrescription', function (req, res) {
        ePrescriptionUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ePrescriptionId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function (err, eprescription) {
                if (err) throw err;
                else {
                    ////////////////DELETE
                    audit.send(req.body.UserId, 'ePrescription', 'Archived', 'Prescription', '1', 'pe-7s-note2 text-success');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: eprescription });
                }
            });
    });

    return router;

};