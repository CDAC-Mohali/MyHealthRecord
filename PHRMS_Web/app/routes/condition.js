/*
 * Conditions Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var ConditionMaster = require('../models/condition-master.js');
var ConditionUser = require('../models/condition-user.js');
var AuditService = require('../classes/Audittrial.js');
var moment = require('moment');
var audit = new AuditService();

module.exports = function (router) {

    // Get Condition Name Listing
    router.post('/getConditionList', function (req, res) {
        ConditionMaster.find({ HealthCondition: { $regex: new RegExp('^' + req.body.exp, "i") } }, function (err, list) {
            if (err) {
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Condition List
    router.post('/addConditionUser', function (req, res) {

        console.log();
        if (!req.body.Info.Condition.HealthCondition ||
            !req.body.Info.Condition.Id ||
            !req.body.Info.strDiagnosisDate ||
            !req.body.Info.DiagnosisBy ||
            !req.body.Info.StillHave) {
            res.json({ success: false, message: "Please ensure that fields marked with * are provided" });
        } else {
            ConditionUser.findOne({ User: req.body.User }).exec(function (err, userCondition) {
                if (err) {

                    throw err;
                }
                if (!userCondition) {
                    req.body.Info.DiagnosisDate = moment(req.body.Info.strDiagnosisDate, "DD/MM/YYYY").toDate();
                    var condition = new ConditionUser(req.body);
                    condition.save(function (err, condition) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'Condition', 'Added', req.body.Info.Condition.HealthCondition, req.body.Info.Condition.SourceId, 'fa fa-stethoscope text-warning');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: condition });
                        }
                    });
                } else if (userCondition) {
                    req.body.Info.DiagnosisDate = moment(req.body.Info.strDiagnosisDate, "DD/MM/YYYY").toDate();
                    ConditionUser.findByIdAndUpdate(
                        userCondition._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function (err, condition) {
                            if (err) {
                                var errString = "";
                                for (var errName in err.errors) {
                                    errString += (' > ' + err.errors[errName].message);
                                }
                                res.json({ success: false, message: errString });
                            } else {
                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'Condition', 'Added', req.body.Info.Condition.HealthCondition, req.body.Info.Condition.SourceId, 'fa fa-stethoscope text-warning');
                                ////////////////////////////////////////////////////////
                                res.json({
                                    success: true,
                                    message: condition
                                });
                            }
                        }
                    );
                }
            });
        }
    });

    // Get User Condition
    router.get('/getUserCondition/:id', function (req, res) {
        ConditionUser.aggregate([{
            $match: {
                User: req.params.id
            }
        },
        { $unwind: "$Info" }, {
            $sort: {
                "Info.DiagnosisDate": -1
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

    // Remove User Condition
    router.post('/removeUserCondition', function (req, res) {
        ConditionUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ConditionId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function (err, condition) {
                if (err) throw err;


                ////////////////DELETE
                audit.send(req.body.UserId, 'Condition', 'Archived', req.body.Name, '1', 'fa fa-stethoscope text-warning');
                ////////////////////////////////////////////////////////
                res.json({ success: true, message: condition });
            });
    });

    router.post('/getUserConditionByDate/:id', function (req, res) {
        ConditionUser.aggregate([{
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
        ]).exec(function (err, condition) {
            var list = [];
            for (var i = 0; i < (condition[0].Info).length; i++) {
                var parts = (condition[0].Info[i].strDiagnosisDate).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if ((o_date >= f_date && o_date <= t_date)) {
                    list.push(condition[0].Info[i]);
                }
            }

            res.json({ success: true, message: { "Info": list } });
        });
    });
    return router;
};