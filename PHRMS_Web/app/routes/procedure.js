/*
 * Procedures Module Routes. 
 * They Require Access Tokens too.
 */
var mongoose = require('mongoose');
var ProcedureMaster = require('../models/procedure-master.js');
var ProcedureUser = require('../models/procedure-user.js');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var shortId = require('shortid');
var path = require('path');
var moment = require('moment');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();
module.exports = function (router) {

    // Get Procedure Name Listing
    router.post('/getProcedureList', function (req, res) {
        ProcedureMaster.find({ ProcedureName: { $regex: new RegExp('^' + req.body.exp, "i") } }, function (err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // router.use(fileUpload());

    // Add/Update User Procedure List
    router.post('/addProcedureUser', function (req, res) {
        if (!req.body.Info.Procedure.ProcedureName ||
            !req.body.Info.Procedure.ProcedureName ||
            !req.body.Info.strDateofProcedure) {
            res.json({ success: false, message: "Please ensure that fields marked with * are provided" });
        } else {
            ProcedureUser.findOne({ User: req.body.User }).exec(function (err, userProcedure) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                var file;
                if (!userProcedure) {
                    req.body.Info.DateofProcedure = moment(req.body.Info.strDateofProcedure, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/procedure/' + req.body.User))
                            fs.mkdirSync('public/uploads/procedure/' + req.body.User);
                        //                     fs.mkdirSync('public/uploads/procedure/' + req.body.User + '/' + id);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/procedure/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }
                    var procedure = new ProcedureUser(req.body);
                    procedure.save(function (err, procedure) {
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
                            audit.send(req.body.User, 'Procedure', 'Added', req.body.Info.Procedure.ProcedureName, req.body.Info.Procedure.SourceId, 'fa pe-7s-scissors text-secondary');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: procedure });
                        }
                    });
                } else if (userProcedure) {
                    req.body.Info.DateofProcedure = moment(req.body.Info.strDateofProcedure, "DD/MM/YYYY").toDate();
                    var id = shortId.generate();
                    if (req.body.Info.File) {
                        if (!fs.existsSync('public/uploads/procedure/' + req.body.User))
                            fs.mkdirSync('public/uploads/procedure/' + req.body.User);
                        //   fs.mkdirSync('public/uploads/procedure/' + req.body.User + '/' + id);
                        req.body.Info.FileFlag = req.body.Info.File.filename;
                        req.body.Info.FilePath = 'uploads/procedure/' + req.body.User + '/' + id + path.extname(req.body.Info.FileFlag);
                        file = req.body.Info.File;
                        delete req.body.Info.File;
                    }
                    ProcedureUser.findByIdAndUpdate(
                        userProcedure._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                        function (err, procedure) {
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
                                audit.send(req.body.User, 'Procedure', 'Added', req.body.Info.Procedure.ProcedureName, req.body.Info.Procedure.SourceId, 'fa pe-7s-scissors text-secondary');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: procedure });
                            }
                        }
                    );
                }
            });
        }
    });

    // Get User Procedure
    router.get('/getUserProcedure/:id', function (req, res) {
        ProcedureUser.aggregate([{
            $match: {
                User: req.params.id
            }
        },
        { $unwind: "$Info" }, {
            $sort: {
                 "Info.DateofProcedure": -1
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
        ]).exec(function (err, procedure) {
            res.json({ success: true, message: procedure[0] });
        });
    });

    // Remove User Procedure
    router.post('/removeUserProcedure', function (req, res) {
        ProcedureUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ProcedureId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function (err, procedure) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'Procedure', 'Archived', req.body.ProcedureName, '1', 'fa pe-7s-scissors text-secondary');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: procedure });
                }
            });
    });


    router.post('/getUserProcedureByDate/:id', function (req, res) {
        ProcedureUser.aggregate([{
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
        ]).exec(function (err, procedure) {
            var list = [];
            for (var i = 0; i < (procedure[0].Info).length; i++) {
                var parts = (procedure[0].Info[i].strDateofProcedure).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if ((o_date >= f_date && o_date <= t_date)) {
                    list.push(procedure[0].Info[i]);
                    //(procedure[0].Info).splice((procedure[0].Info).indexOf(procedure[0].Info[i]), 1);
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