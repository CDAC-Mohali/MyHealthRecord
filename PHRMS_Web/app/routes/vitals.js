/*
 * BP Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var BodyTemperatureUser = require('../models/bodytemperature-user.js');
var HeartRateUser = require('../models/heartrate-user.js');
var RespiratoryRateUser = require('../models/respiratoryrate-user.js');
var SPo2User = require('../models/spo-user.js');
var moment = require('moment');
var ValidationService = require('../classes/ValidationError.js');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();
module.exports = function(router) {
    var ValidationServiceMessage = new ValidationService();
    //////////////////////////////////////////Body Temperature///////////////////////////////////
    //Add/Update User Body Temperature//
    router.post('/addBodyTemperatureUser', function(req, res) {

        if (!req.body.Info.strCollectionDate) {
            res.json({ success: false, message: "Collection Date is Required" });
            return;
        }
        BodyTemperatureUser.findOne({ User: req.body.User }).exec(function(err, userBodyTemperature) {
            if (err) {
                // console.log(err);
                throw err;
            }
            if (!userBodyTemperature) {
                //req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                var BodyTemperature = new BodyTemperatureUser(req.body);
                BodyTemperature.save(function(err, result) {
                    if (err) {
                        res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'BodyTemperature', 'Added', 'Body Temerature', '1', 'fa fa-thermometer-three-quarters text-primary');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: result });
                    }
                });
            } else if (userBodyTemperature) {
              //  req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                BodyTemperatureUser.findByIdAndUpdate(
                    userBodyTemperature._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                    function(err, result) {
                        if (err) {
                            res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'BodyTemperature', 'Added', 'Body Temerature', '1', 'fa fa-thermometer-three-quarters text-primary');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: result });
                        }
                    }
                );
            }
        });

    });


    // Get List of Body Temerature sort by latest//
    router.get('/getUserBodyTemperatureList/:id', function(req, res) {
        BodyTemperatureUser.aggregate({
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

    //Remove Body Temperature .Soft Delete Only//
    router.post('/removeUserBodyTemperature', function(req, res) {
        BodyTemperatureUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.BodyTemperatureId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, result) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'BodyTemperature', 'Archived', 'Body Temperature', '1', 'fa fa-thermometer-three-quarters text-primary');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: result });
                }
            });
    });

    //////////////////////////////////////////Body Temperature///////////////////////////////////
    //////////////////////////////////////////Respiratory Rate///////////////////////////////////
    router.post('/addRespiratoryRateUser', function(req, res) {

        if (!req.body.Info.strCollectionDate) {
            res.json({ success: false, message: "Collection Date is Required" });
            return;
        }
        RespiratoryRateUser.findOne({ User: req.body.User }).exec(function(err, userRespiratoryRate) {
            if (err) {
                // console.log(err);
                throw err;
            }
            if (!userRespiratoryRate) {
               // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                var RespiratoryRate = new RespiratoryRateUser(req.body);
                RespiratoryRate.save(function(err, result) {
                    if (err) {
                        res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'RespiratoryRate', 'Added', 'Respiratory Rate', '1', 'fa fa-binoculars text-warning');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: result });
                    }
                });
            } else if (userRespiratoryRate) {
                //req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                RespiratoryRateUser.findByIdAndUpdate(
                    userRespiratoryRate._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                    function(err, result) {
                        if (err) {
                            res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'RespiratoryRate', 'Added', 'Respiratory Rate', '1', 'fa fa-binoculars text-warning');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: result });
                        }
                    }
                );
            }
        });

    });


    // Get List of RespiratoryRate sort by latest//
    router.get('/getUserRespiratoryRateList/:id', function(req, res) {
        RespiratoryRateUser.aggregate({
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

    //Remove RespiratoryRate .Soft Delete Only//
    router.post('/removeUserRespiratoryRate', function(req, res) {
        RespiratoryRateUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.RespiratoryRateId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, result) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'RespiratoryRate', 'Archived', 'Respiratory Rate', '1', 'fa fa-binoculars text-warning');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: result });
                }
            });
    });
    //////////////////////////////////////////Respiratory Rate///////////////////////////////////
    //////////////////////////////////////////Heart Rate///////////////////////////////////
    router.post('/addHeartRateUser', function(req, res) {

        if (!req.body.Info.strCollectionDate) {
            res.json({ success: false, message: "Collection Date is Required" });
            return;
        }
        HeartRateUser.findOne({ User: req.body.User }).exec(function(err, userHeartRate) {
            if (err) {
                // console.log(err);
                throw err;
            }
            if (!userHeartRate) {
               // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                var HeartRate = new HeartRateUser(req.body);
                HeartRate.save(function(err, result) {
                    if (err) {
                        res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'HeartRate', 'Added', 'Heart Rate', '1', 'fa fa-heartbeat text-danger');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: result });
                    }
                });
            } else if (userHeartRate) {
               // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                HeartRateUser.findByIdAndUpdate(
                    userHeartRate._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                    function(err, result) {
                        if (err) {
                            res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'HeartRate', 'Added', 'Heart Rate', '1', 'fa fa-heartbeat text-danger');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: result });
                        }
                    }
                );
            }
        });

    });


    // Get List of HeartRate sort by latest//
    router.get('/getUserHeartRateList/:id', function(req, res) {
        HeartRateUser.aggregate({
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

    //Remove HeartRate .Soft Delete Only//
    router.post('/removeUserHeartRate', function(req, res) {
        HeartRateUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.HeartRateId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, result) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'HeartRate', 'Archived', 'Heart Rate', '1', 'fa fa-heartbeat text-danger');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: result });
                }
            });
    });
    //////////////////////////////////////////Heart Rate///////////////////////////////////

    //////////////////////////////////////////SPO2///////////////////////////////////
    router.post('/addSPo2User', function(req, res) {

        if (!req.body.Info.strCollectionDate) {
            res.json({ success: false, message: "Collection Date is Required" });
            return;
        }
        SPo2User.findOne({ User: req.body.User }).exec(function(err, userSPo2) {
            if (err) {
                // console.log(err);
                throw err;
            }
            if (!userSPo2) {
               // req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                var SPo2 = new SPo2User(req.body);
                SPo2.save(function(err, result) {
                    if (err) {
                        res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'SPo2', 'Added', 'SpO2', '1', 'fa fa-flask text-primary');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: result });
                    }
                });
            } else if (userSPo2) {
              //  req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                SPo2User.findByIdAndUpdate(
                    userSPo2._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                    function(err, result) {
                        if (err) {
                            res.json({ success: false, message: ValidationServiceMessage.CheckErrorMessage(err.errors) });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'SPo2', 'Added', 'SpO2', '1', 'fa fa-flask text-primary');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: result });
                        }
                    }
                );
            }
        });

    });


    // Get List of SPo2 sort by latest//
    router.get('/getUserSPo2List/:id', function(req, res) {
        SPo2User.aggregate({
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

    //Remove SPo2 .Soft Delete Only//
    router.post('/removeUserSPo2', function(req, res) {
        SPo2User.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.SPo2Id) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, result) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'SPo2', 'Archived', 'SpO2', '1', 'fa fa-flask text-primary');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: result });
                }
            });
    });
    //////////////////////////////////////////Spo2///////////////////////////////////



    return router;

};