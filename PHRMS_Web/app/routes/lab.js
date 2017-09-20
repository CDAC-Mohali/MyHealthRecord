/*
 * Labs Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var LabMaster = require('../models/lab-master.js');
var LabUser = require('../models/lab-user.js');
var fs = require('fs');
var shortId = require('shortid');
var path = require('path');
var moment = require('moment');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();

module.exports = function(router) {

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
        if (!req.body.Info.Lab.TestName ||
            !req.body.Info.Lab.Id ||
            !req.body.Info.strPerformedOn) {
            res.json({ success: false, message: "Please ensure that fields marked with * are provided" });
        } else {
            LabUser.findOne({ User: req.body.User }).exec(function(err, userLab) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                var file;
                if (!userLab) {
                    req.body.Info.PerformedOn = moment(req.body.Info.strPerformedOn, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/lab/' + req.body.User))
                            fs.mkdirSync('public/uploads/lab/' + req.body.User);
                        //  fs.mkdirSync('public/uploads/lab/' + req.body.User + '/' + id);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/lab/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }

                    var lab = new LabUser(req.body);
                    lab.save(function(err, lab) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else {
                            if (file) {
                                var imageBuffer = new Buffer(file.base64, 'base64');
                                fs.writeFile("public/" + req.body.Info.FilePath, imageBuffer, function(err) {});
                            }
                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'Lab', 'Added', req.body.Info.Lab.TestName, req.body.Info.Lab.SourceId, 'fa fa-flask text-primary');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: lab });
                        }
                    });
                } else if (userLab) {
                    req.body.Info.PerformedOn = moment(req.body.Info.strPerformedOn, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/lab/' + req.body.User))
                            fs.mkdirSync('public/uploads/lab/' + req.body.User);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/lab/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }
                    LabUser.findByIdAndUpdate(
                        userLab._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                        function(err, lab) {
                            if (err) {
                                var errString = "";
                                for (var errName in err.errors) {
                                    errString += (' > ' + err.errors[errName].message);
                                }
                                res.json({ success: false, message: errString });
                            } else {
                                if (file) {
                                    var imageBuffer = new Buffer(file.base64, 'base64');
                                    fs.writeFile("public/" + req.body.Info.FilePath, imageBuffer, function(err) {});
                                }
                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'Lab', 'Added', req.body.Info.Lab.TestName, req.body.Info.Lab.SourceId, 'fa fa-flask text-primary');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: lab });
                            }
                        }
                    );
                }
            });
        }
    });


    // Get User Lab
    router.get('/getUserLab/:id', function(req, res) {
        LabUser.aggregate([{
                $match: {
                    User: req.params.id
                }
            },
            { $unwind: "$Info" }, {
                $sort: {
                    "Info.PerformedOn": -1
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
        ]).exec(function(err, lab) {
            res.json({ success: true, message: lab[0] });
        });
    });

    // Remove User Lab
    router.post('/removeUserLab', function(req, res) {
        LabUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.LabId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, lab) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'Lab', 'Archived', req.body.LabName, '1', 'fa fa-flask text-primary');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: lab });
                }
            });
    });

    //digilocker file

    router.post('/getUserLabByDate/:id', function(req, res) {
        LabUser.aggregate([{
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
        ]).exec(function(err, lab) {
            var list = [];
            for (var i = 0; i < (lab[0].Info).length; i++) {
                var parts = (lab[0].Info[i].strPerformedOn).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if ((o_date >= f_date && o_date <= t_date)) {
                    list.push(lab[0].Info[i]);
                }
            }
            res.json({
                success: true,
                message: { "Info": list }

            });
        });
    });

    return router;
};