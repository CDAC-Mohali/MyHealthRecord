/*
 * BMI Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var BMIUser = require('../models/BMI-user.js');
var moment = require('moment');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();

module.exports = function(router) {

    // Add/Update User BMI List
    router.post('/addBMIUser', function(req, res) {


        BMIUser.findOne({ User: req.body.User }).exec(function(err, userBMI) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!userBMI) {
                // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                var BMI = new BMIUser(req.body);
                BMI.save(function(err, bmi) {
                    if (err) {
                        var errString = "";
                        for (var errName in err.errors) {
                            errString += (' > ' + err.errors[errName].message);
                        }
                        res.json({ success: false, message: errString });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'BMI', 'Added', 'Weight', '1', 'fa fa-child text-info');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: bmi });
                    }
                });
            } else if (userBMI) {
                // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                BMIUser.findByIdAndUpdate(
                    userBMI._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                    function(err, BMI) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'BMI', 'Added', 'Weight', '1', 'fa fa-child text-info');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: BMI });
                        }
                    }
                );
            }
        });

    });

    // Get User Allergies
    router.get('/getUserBMI/:id', function(req, res) {
        BMIUser.aggregate({
                $match: {
                    User: req.params.id
                }
            }, { $unwind: "$Info" }, {
                $sort: {
                    "Info.CollectionDate": -1
                }
            }, {
                $redact: {

                    $cond: {
                        if: { $eq: ["$Info.DeleteFlag", false] },
                        then: "$$KEEP",
                        else: "$$PRUNE"
                    }
                }
            }, {
                $project: { Record: "$Info" }
            },
            function(err, data) {
                if (err) throw err;
                else {
                    res.json({ success: true, message: data });
                }
            });
    });

    // Remove User BMI
    router.post('/removeUserBMI', function(req, res) {
        BMIUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.BMIId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, BMI) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'BMI', 'Archived', 'Weight', '1', 'fa fa-child text-info');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: BMI });
                }
            });
    });
    router.post('/getUserBMIGraph', function(req, res) {

        var startDate = new Date();
        var endDate = new Date();
        if (req.body.Type == 1) {
            startDate.setDate(startDate.getDate() - 1);
            endDate.setDate(endDate.getDate() + 1);
        } else if (req.body.Type == 2) {
            startDate.setDate(startDate.getDate() - 7);
            endDate.setDate(endDate.getDate() + 1);
        } else if (req.body.Type == 3) {
            startDate.setDate(startDate.getDate() - 30);
            endDate.setDate(endDate.getDate() + 1);
        } else if (req.body.Type == 4) {
            startDate.setDate(startDate.getDate() - 365);
            endDate.setDate(endDate.getDate() + 1);
        }

        BMIUser.aggregate({
                $match: { User: req.body.UserId }
            }, { $unwind: "$Info" }, {
                $sort: {
                    "Info.CollectionDate": 1
                }
            }, {
                $redact: {

                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$Info.DeleteFlag", false] },
                                { $gt: ["$Info.CollectionDate", startDate] },
                                { $lt: ["$Info.CollectionDate", endDate] } //
                            ]
                        },
                        then: "$$KEEP",
                        else: "$$PRUNE"

                    }
                }
            }, {
                $project: { Record: "$Info" }
            },
            function(err, data) {
                if (err) throw err;
                else {
                    res.json({ success: true, message: data });
                }
            });


    });


    router.post('/getUserBMIDate/:id', function(req, res) {

        BMIUser.aggregate([{
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
        ]).exec(function(err, BMI) {
            for (var i = 0; i < (BMI[0].Info).length; i++) {
                var parts = (BMI[0].Info[i].strCreatedDate).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if (!(o_date > f_date && o_date < t_date)) {
                    (BMI[0].Info).splice((BMI[0].Info).indexOf(BMI[0].Info[i]), 1);
                }
            }
            res.json({ success: true, message: BMI[0] });
        });

    });

    // Get User Allergies
    router.get('/getUserBMIID/:id', function(req, res) {
        BMIUser.aggregate([{
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
        ]).exec(function(err, BMI) {


            res.json({ success: true, message: BMI[0] });
        });
    });
    return router;

};