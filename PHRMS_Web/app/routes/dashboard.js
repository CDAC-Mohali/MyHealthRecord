/*
 * Allergy Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var AllergyUser = require('../models/allergy-user.js');
var BPUser = require('../models/bloodpressure-user.js');
var BloodGulucoseUser = require('../models/bg-user.js');
var ProcedureUser = require('../models/procedure-user.js');
var LabUser = require('../models/lab-user.js');
var BodyTemperatureUser = require('../models/bodytemperature-user.js');
var HeartRateUser = require('../models/heartrate-user.js');
var RespiratoryRateUser = require('../models/respiratoryrate-user.js');
var SPo2User = require('../models/spo-user.js');
var HealthTips = require('../models/health-tips.js');
var ImmunizationUser = require('../models/immunization-user.js');
var MedicineUser = require('../models/medication-user.js');
//var BMIUser = require('../models/bmi-user.js');
var ActivityUser = require('../models/activity-user.js');
var MailerService = require('../classes/mail.js');


var mailer = new MailerService();
var bcrypt = require('bcrypt-nodejs');
module.exports = function(router) {
    // Get Allergy Count
    router.get('/getAllergyCount/:id', function(req, res) {


        AllergyUser.aggregate({
                $match: { User: req.params.id }
            }, { $unwind: "$Info" }, {
                $sort: {
                    "Info.CreatedDate": -1
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
            function(err, results) {
                if (err) throw err;
                else {
                    if (results && results.length > 0) {
                        //   alert(JSON.stringify(results))
                        res.json({
                            success: true,
                            message: [results.length, results[0].Record.strCreatedDate,
                                results[0].Record.Severity
                            ]
                        });
                    } else {
                        res.json({ success: true, message: [0, ""] });
                    }

                }
            });


    });
    router.get('/getBPCount/:id', function(req, res) {
        BPUser.aggregate({
                $match: { User: req.params.id }
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
            function(err, results) {
                if (err) throw err;
                else {
                    if (results && results.length > 0) {
                        //   alert(JSON.stringify(results))
                        res.json({
                            success: true,
                            message: [results.length, results[0].Record.strCollectionDate,
                                results[0].Record.ResSystolic + "/" + results[0].Record.ResDiastolic
                            ]
                        });
                    } else {
                        res.json({ success: true, message: [0, "", ""] });
                    }

                }
            });
    });
    router.get('/getBloodGulucoseCount/:id', function(req, res) {
        BloodGulucoseUser.aggregate({
                $match: { User: req.params.id }
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
            function(err, results) {
                if (err) throw err;
                else {
                    if (results && results.length > 0) {
                        //   alert(JSON.stringify(results))
                        res.json({
                            success: true,
                            message: [results.length, results[0].Record.strCollectionDate, results[0].Record.Result]
                        });
                    } else {
                        res.json({ success: true, message: [0, "", ""] });
                    }

                }
            });
    });
    router.get('/getProcedureCount/:id', function(req, res) {
        ProcedureUser.aggregate({
                $match: { User: req.params.id }
            }, { $unwind: "$Info" }, {
                $sort: {
                    "Info.CreatedDate": -1
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
            function(err, results) {
                if (err) throw err;
                else {
                    if (results && results.length > 0) {
                        //   alert(JSON.stringify(results))
                        res.json({
                            success: true,
                            message: [results.length, results[0].Record.DateofProcedure, results[0].Record.Procedure.ProcedureName]
                        });
                    } else {
                        res.json({ success: true, message: [0, "", ""] });
                    }

                }
            });

    });
    router.get('/getImmunizationCount/:id', function(req, res) {
        ImmunizationUser.aggregate({
                $match: { User: req.params.id }
            }, { $unwind: "$Info" }, {
                $sort: {
                    "Info.CreatedDate": -1
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
            function(err, results) {
                if (err) throw err;
                else {
                    if (results && results.length > 0) {
                        //   alert(JSON.stringify(results))
                        res.json({
                            success: true,
                            message: [results.length, results[0].Record.strCreatedDate, results[0].Record.Immunization.ImmunizationName]
                        });
                    } else {
                        res.json({ success: true, message: [0, "", ""] });
                    }

                }
            });

    });

    router.get('/getLabCount/:id', function(req, res) {
        LabUser.aggregate({
                $match: { User: req.params.id }
            }, { $unwind: "$Info" }, {
                $sort: {
                    "Info.CreatedDate": -1
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
            function(err, results) {
                if (err) throw err;
                else {
                    if (results && results.length > 0) {
                        //   alert(JSON.stringify(results))
                        res.json({
                            success: true,
                            message: [results.length, results[0].Record.strCreatedDate, results[0].Record.Lab.TestName]
                        });
                    } else {
                        res.json({ success: true, message: [0, "", ""] });
                    }

                }
            });

    });

    router.get('/getMedicineCount/:id', function(req, res) {
        MedicineUser.aggregate({
                $match: { User: req.params.id }
            }, { $unwind: "$Info" }, {
                $sort: {
                    "Info.CreatedDate": -1
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
            function(err, results) {
                if (err) throw err;
                else {
                    if (results && results.length > 0) {
                        //   alert(JSON.stringify(results))
                        res.json({
                            success: true,
                            message: [results.length, results[0].Record.strCreatedDate, results[0].Record.Medicine.MedicineName]
                        });
                    } else {
                        res.json({ success: true, message: [0, "", ""] });
                    }

                }
            });
    });

    //Get User Activity Calories

    router.post('/getUserActivityCalories', function(req, res) {
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
        ActivityUser.aggregate({
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

                $project: {
                    "Name": "$_id.Name",
                    "ActivityName": "$Info.Activity.ActivityName",
                    "TotalDistance": "$Info.Distance",
                    "TotalCalories": "$Info.Calories",
                    "TotalHours": "$Info.TotalHours",
                    "TotalMinutes": "$Info.TotalMinutes",
                    "strCollectionDate": "$Info.strCollectionDate"


                }
            },
            function(err, data) {
                if (err) throw err;
                else {
                    res.json({ success: true, message: data });
                }
            });
    });
    router.post('/getUserBPGraph', function(req, res) {
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

        BPUser.aggregate({
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
            },

            {
                $project: {
                    Record: {
                        year: {
                            $year: "$Info.CollectionDate"
                        },
                        month: {
                            $month: "$Info.CollectionDate"
                        },
                        dayOfMonth: {
                            $dayOfMonth: "$Info.CollectionDate"
                        },
                        hour: { $hour: "$Info.CollectionDate" },
                        minutes: { $minute: "$Info.CollectionDate" },
                        seconds: { $second: "$Info.CollectionDate" },
                        milliseconds: { $millisecond: "$Info.CollectionDate" },
                        dayOfYear: { $dayOfYear: "$Info.CollectionDate" },
                        dayOfWeek: { $dayOfWeek: "$Info.CollectionDate" },
                        week: { $week: "$Info.CollectionDate" },
                        CollectionDate: "$Info.CollectionDate",
                        strCollectionDate: "$Info.strCollectionDate",
                        ResDiastolic: "$Info.ResDiastolic",
                        ResSystolic: "$Info.ResSystolic",
                    }
                }
            },
            function(err, data) {
                if (err) throw err;
                else {
                    res.json({ success: true, message: data });
                }
            });
    });

    router.post('/getUserBGGraph', function(req, res) {
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

        BloodGulucoseUser.aggregate({
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



    ///////////////////////////////////


    router.post('/getBodyTempGraph', function(req, res) {
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

        BodyTemperatureUser.aggregate({
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
    router.post('/getHeartRateGraph', function(req, res) {
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
        HeartRateUser.aggregate({
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
    router.post('/getRespRateGraph', function(req, res) {
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

        RespiratoryRateUser.aggregate({
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


    router.post('/getSPo2Graph', function(req, res) {
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

        SPo2User.aggregate({
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


    router.get('/getHealthTips/:id', function(req, res) {



        HealthTips.aggregate({
                $match: { Id: req.params.id }
            },
            function(err, results) {



                if (err) throw err;
                else {

                    //  console.log(err);
                    if (results && results.length > 0) {
                        res.json({
                            success: true,
                            message: [results[0].Id, results[0].Tips]
                        });

                    } else {
                        res.json({ success: true, message: [0, "", ""] });
                    }

                }
            });

    });



    return router;

};