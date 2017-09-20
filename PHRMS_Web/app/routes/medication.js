/*
 * Medication Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var MedicineMaster = require('../models/medication-master.js');
var MedicineUser = require('../models/medication-user.js');
var fs = require('fs');
var shortId = require('shortid');
var path = require('path');
var moment = require('moment');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();
module.exports = function (router) {

    // Get Medication Name Listing
    router.post('/getMedicationList', function (req, res) {
        if (req.body.subPageNo < 0) req.body.subPageNo = 0;
        MedicineMaster.find({ MedicineName: { $regex: new RegExp('^' + req.body.exp, "i") } })
            .limit(100)
            .skip((100 * req.body.subPageNo))
            .exec(function (err, list) {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    res.json({ success: true, message: list });
                }
            });
    });

    // Add/Update User Medication List
    router.post('/addMedicationUser', function (req, res) {
        if (!req.body.Info.Medicine.MedicineName ||
            !req.body.Info.Medicine.Id ||
            !req.body.Info.strDatePrescribed || !req.body.Info.Route || !req.body.Info.Strength || !req.body.Info.Dosage.Quant ||
            !req.body.Info.Dosage.Type || !req.body.Info.Frequency || !req.body.Info.StillHave) {
            res.json({ success: false, message: "Please ensure that fields marked with * are provided" });
        } else {
            MedicineUser.findOne({ User: req.body.User }).exec(function (err, userMedicine) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                var file;
                if (!userMedicine) {
                    req.body.Info.DatePrescribed = moment(req.body.Info.strDatePrescribed, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/medication/' + req.body.User))
                            fs.mkdirSync('public/uploads/medication/' + req.body.User);
                        //      fs.mkdirSync('public/uploads/medication/' + req.body.User + '/' + id);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/medication/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }
                    var medicine = new MedicineUser(req.body);
                    medicine.save(function (err, medicine) {
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
                            audit.send(req.body.User, 'Medication', 'Added', req.body.Info.Medicine.MedicineName, req.body.Info.Medicine.SourceId, 'fa fa-medkit text-danger');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: medicine });
                        }
                    });
                } else if (userMedicine) {
                    req.body.Info.DatePrescribed = moment(req.body.Info.strDatePrescribed, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/medication/' + req.body.User))
                            fs.mkdirSync('public/uploads/medication/' + req.body.User);
                        //   fs.mkdirSync('public/uploads/medication/' + req.body.User + '/' + id);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/medication/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }
                    MedicineUser.findByIdAndUpdate(
                        userMedicine._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                        function (err, medicine) {
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
                                audit.send(req.body.User, 'Medication', 'Added', req.body.Info.Medicine.MedicineName, req.body.Info.Medicine.SourceId, 'fa fa-medkit text-danger');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: medicine });
                            }
                        }
                    );
                }
            });
        }
    });

    // Get User Medication
    router.get('/getUserMedication/:id', function (req, res) {
        MedicineUser.aggregate([{
            $match: {
                User: req.params.id
            }
        },
        { $unwind: "$Info" }, {
            $sort: {
                 "Info.DatePrescribed": -1
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
        ]).exec(function (err, medicine) {
            res.json({ success: true, message: medicine[0] });
        });
    });

    // Remove User Medication
    router.post('/removeUserMedication', function (req, res) {
        MedicineUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.MedicineId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function (err, medicine) {
                if (err) throw err;

                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'Medication', 'Archived', req.body.MedicineName, '1', 'fa fa-medkit text-danger');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: medicine });
                }
            });
    });

    router.post('/getUserMedicationByDate/:id', function (req, res) {
        MedicineUser.aggregate([{
            $match: {
                User: req.params.id
            }
        },
        { $unwind: "$Info" },
        {
            $match: {
                "Info.DeleteFlag": false
            }
        },
        {
            $group: { '_id': '$_id', 'Info': { '$push': '$Info' } }
        }
        ]).exec(function (err, medicine) {
            var list = [];
            for (var i = 0; i < (medicine[0].Info).length; i++) {
                var parts = (medicine[0].Info[i].strDatePrescribed).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if ((o_date >= f_date && o_date <= t_date)) {
                    list.push(medicine[0].Info[i]);
                }
            }
            res.json({ success: true, message: { "Info": list } });
        });
    });
    return router;
};