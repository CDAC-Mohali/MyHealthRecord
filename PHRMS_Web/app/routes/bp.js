/*
 * BP Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var BPUser = require('../models/bloodpressure-user.js');
var moment = require('moment');
var ValidationService = require('../classes/ValidationError.js');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();
module.exports = function(router) {
    var ValidationServiceMessage = new ValidationService();
    // Add/Update User BP List
    router.post('/addBPUser', function(req, res) {

        if (!req.body.Info.strCollectionDate) {
            res.json({ success: false, message: "Collection Date is Required" });
            return;
        }
        BPUser.findOne({ User: req.body.User }).exec(function(err, userBP) {


            if (err) {
                // console.log(err);
                throw err;
            }
            if (!userBP) {
             //   req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                var BP = new BPUser(req.body);
                BP.save(function(err, bp) {
                    if (err) {
                        res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'BP', 'Added', 'Blood Pressure', '1', 'fa fa-tint text-danger');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: bp });
                    }
                });
            } else if (userBP) {
               // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                BPUser.findByIdAndUpdate(
                    userBP._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                    function(err, BP) {
                        if (err) {
                            res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'BP', 'Added', 'Blood Pressure', '1', 'fa fa-tint text-danger');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: BP });
                        }
                    }
                );
            }
        });

    });

    // Get User Allergies

    router.get('/getUserBP/:id', function(req, res) {
        BPUser.aggregate({
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

    // Remove User BP
    router.post('/removeUserBP', function(req, res) {
        BPUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.BPId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, BP) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'BP', 'Archived', 'Blood Pressure', '1', 'fa fa-tint text-danger');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: BP });
                }
            });
    });
    router.post('/getUserBPDate/:id', function(req, res) {

        BPUser.aggregate([{
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
        ]).exec(function(err, BP) {
            for (var i = 0; i < (BP[0].Info).length; i++) {
                var parts = (BP[0].Info[i].strCreatedDate).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if (!(o_date > f_date && o_date < t_date)) {
                    (BP[0].Info).splice((BP[0].Info).indexOf(BP[0].Info[i]), 1);
                }
            }
            res.json({ success: true, message: BP[0] });
        });

    });

    // Get User Allergies
    router.get('/getUserBPID/:id', function(req, res) {
        BPUser.aggregate([{
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
        ]).exec(function(err, BP) {


            res.json({ success: true, message: BP[0] });
        });
    });
    return router;

};