/*
 * BloodGulucose Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var BloodGulucoseUser = require('../models/bg-user.js');
var moment = require('moment');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();
module.exports = function(router) {

    // Add/Update User BloodGulucose List
    router.post('/addBloodGulucoseUser', function(req, res) {


        BloodGulucoseUser.findOne({ User: req.body.User }).exec(function(err, userBloodGulucose) {
            if (err) {
                //    console.log(err);
                throw err;
            }
            if (!userBloodGulucose) {
                //req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                var BloodGulucose = new BloodGulucoseUser(req.body);
                BloodGulucose.save(function(err, bg) {
                    if (err) {
                        var errString = "";
                        for (var errName in err.errors) {
                            errString += (' > ' + err.errors[errName].message);
                        }
                        res.json({ success: false, message: errString });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'BloodGulucose', 'Added', 'Blood Glucose', '1', 'fa fa-heart text-info');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: bg });
                    }
                });
            } else if (userBloodGulucose) {
                // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                BloodGulucoseUser.findByIdAndUpdate(
                    userBloodGulucose._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                    function(err, BloodGulucose) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'BloodGulucose', 'Added', 'Blood Glucose', '1', 'fa fa-heart text-info');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: BloodGulucose });
                        }
                    }
                );
            }
        });

    });

    // Get User Allergies
    router.get('/getUserBloodGulucose/:id', function(req, res) {
        BloodGulucoseUser.aggregate({
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

    // Remove User BloodGulucose
    router.post('/removeUserBloodGulucose', function(req, res) {
        BloodGulucoseUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.BloodGulucoseId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, BloodGulucose) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'BloodGulucose', 'Archived', 'Blood Glucose', '1', 'fa fa-heart text-info');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: BloodGulucose });
                }
            });

    });





    router.post('/getUserBGDate/:id', function(req, res) {

        BloodGulucoseUser.aggregate([{
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
        ]).exec(function(err, BloodGulucose) {
            for (var i = 0; i < (BloodGulucose[0].Info).length; i++) {
                var parts = (BloodGulucose[0].Info[i].strCreatedDate).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if (!(o_date > f_date && o_date < t_date)) {
                    (BloodGulucose[0].Info).splice((BloodGulucose[0].Info).indexOf(BloodGulucose[0].Info[i]), 1);
                }
            }
            res.json({ success: true, message: BloodGulucose[0] });
        });

    });

    // Get User Allergies
    router.get('/getUserBGID/:id', function(req, res) {
        BloodGulucoseUser.aggregate([{
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
        ]).exec(function(err, BloodGulucose) {


            res.json({ success: true, message: BloodGulucose[0] });
        });
    });
    return router;

};