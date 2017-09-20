/*
 * Immunization Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var ImmunizationMaster = require('../models/immunization-master.js');
var ImmunizationUser = require('../models/immunization-user.js');
var AuditService = require('../classes/Audittrial.js');
var moment = require('moment');
var audit = new AuditService();

module.exports = function (router) {

    // Get Immunization Name Listing
    router.post('/getImmunizationList', function (req, res) {
        ImmunizationMaster.find({ ImmunizationName: { $regex: new RegExp('^' + req.body.exp, "i") } }, function (err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Immunization List
    router.post('/addImmunizationUser', function (req, res) {
        if (!req.body.Info.Immunization.ImmunizationName ||
            !req.body.Info.Immunization.ImmunizationsTypeId ||
            !req.body.Info.strTakenOn) {
            res.json({ success: false, message: "Please ensure that fields marked with * are provided" });
        } else {
            ImmunizationUser.findOne({ User: req.body.User }).exec(function (err, userImmunization) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userImmunization) {
                    req.body.Info.TakenOn = moment(req.body.Info.strTakenOn, "DD/MM/YYYY").toDate();
                    var immunization = new ImmunizationUser(req.body);
                    immunization.save(function (err, immunization) {
                        if (err) {
                            if (err) {
                                var errString = "";
                                for (var errName in err.errors) {
                                    errString += (' > ' + err.errors[errName].message);
                                }
                                res.json({ success: false, message: errString });
                            } else {

                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'Immunization', 'Added', req.body.Info.Immunization.ImmunizationName, req.body.Info.Immunization.SourceId, 'fa fa-eyedropper text-warning');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: immunization });
                            }
                        } else {
                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'Immunization', 'Added', req.body.Info.Immunization.ImmunizationName, req.body.Info.Immunization.SourceId, 'fa fa-eyedropper text-warning');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: immunization });
                        }
                    });
                } else if (userImmunization) {
                    req.body.Info.TakenOn = moment(req.body.Info.strTakenOn, "DD/MM/YYYY").toDate();
                    ImmunizationUser.findByIdAndUpdate(
                        userImmunization._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function (err, immunization) {
                            if (err) {
                                var errString = "";
                                for (var errName in err.errors) {
                                    errString += (' > ' + err.errors[errName].message);
                                }
                                res.json({ success: false, message: errString });
                            } else {
                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'Immunization', 'Added', req.body.Info.Immunization.ImmunizationName, req.body.Info.Immunization.SourceId, 'fa fa-eyedropper text-warning');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: immunization });
                            }
                        }
                    );
                }
            });
        }
    });

    // Get User Immunization
    router.get('/getUserImmunization/:id', function (req, res) {
        ImmunizationUser.aggregate([{
            $match: {
                User: req.params.id
            }
        },
        { $unwind: "$Info" }, {
            $sort: {
                 "Info.TakenOn": -1
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
        ]).exec(function (err, condition) {
            res.json({ success: true, message: condition[0] });
        });
    });

    // Remove User Immunization
    router.post('/removeUserImmunization', function (req, res) {
        ImmunizationUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ImmunizationId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function (err, immunization) {
                if (err) throw err;
                else {



                    ////////////////DELETE
                    audit.send(req.body.UserId, 'Immunization', 'Archived', req.body.ImmunizationName, '1', 'fa fa-eyedropper text-warning');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: immunization });
                }
            });
    });

    router.post('/getUserImmunizationByDate/:id', function (req, res) {
        ImmunizationUser.aggregate([{
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
        ]).exec(function (err, immunization) {
            var list = [];
            for (var i = 0; i < (immunization[0].Info).length; i++) {
                var parts = (immunization[0].Info[i].strTakenOn).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if ((o_date >= f_date && o_date <= t_date)) {
                    list.push(immunization[0].Info[i]);
                }
            }
            res.json({ success: true, message: { "Info": list } });
        });
    });


    return router;
};