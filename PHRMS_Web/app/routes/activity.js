/*
 * Activity Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var ActivityMaster = require('../models/activity-master.js');
var ActivityUser = require('../models/activity-user.js');
var moment = require('moment');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();

module.exports = function(router) {
    // Get Activity Name Listing
    router.post('/getActivityCounts', function(req, res) {

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

        ActivityUser.aggregate([
                { $match: { User: req.body.UserId } },
                { $unwind: "$Info" },
                { $sort: { "Info.CollectionDate": -1 } }, {
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

                    $group: {
                        _id: { "ActivityName": "$Info.Activity.ActivityName", "Name": "$_id" },
                        total: { $sum: "$Info.Distance" }
                    }
                },
                {
                    $project: { "Name": "$_id.Name", "ActivityName": "$_id.ActivityName", Total: "$total" }
                }
            ],
            function(err, data) {
                if (err) throw err;
                else {
                    res.json({ success: true, message: data });
                }
            });
    });

    router.post('/getActivityList', function(req, res) {
        ActivityMaster.find({}, function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Activity List
    router.post('/addActivityUser', function(req, res) {
        // if (req.session.sessioncheck) {
        //     req.session.sessioncheck++;
        //     // res.send("You visited this page " + req.session.page_views + " times");
        // } else {
        //     req.session.sessioncheck = 1;
        //     // res.send("Welcome to this page for the first time!");
        // }
        //  console.log(req.session.sessioncheck);
        {

            ActivityUser.findOne({ User: req.body.User }).exec(function(err, userActivity) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                if (!userActivity) {
                    //    console.log(JSON.stringify(req.body.Info));
                    // console.log(req.body.Info.Calories);
                    if (req.body.Info.Calories == 'undefined' || req.body.Info.Calories == undefined || req.body.Info.Calories < 0) {
                        if (req.body.Info.Activity.ActivityId == 1) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 1.4;
                        } else if (req.body.Info.Activity.ActivityId == 2) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 2.92;
                        } else if (req.body.Info.Activity.ActivityId == 3) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 1.6;
                        } else if (req.body.Info.Activity.ActivityId == 4) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 3;
                        }
                    }


                    //  req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                    req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                    var Activity = new ActivityUser(req.body);
                    Activity.save(function(err, activity) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'Activity', 'Added', 'Activity', '1', 'fa fa-heart text-info');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: activity });
                        }
                    });
                } else if (userActivity) {

                    if (req.body.Info.Calories == 'undefined' || req.body.Info.Calories == undefined || req.body.Info.Calories < 0) {

                        if (req.body.Info.Activity.ActivityId == 1) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 1.4;
                        } else if (req.body.Info.Activity.ActivityId == 2) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 2.92;
                        } else if (req.body.Info.Activity.ActivityId == 3) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 1.6;
                        } else if (req.body.Info.Activity.ActivityId == 4) {
                            req.body.Info.Calories = (req.body.Info.Weight * 2.2) * (req.body.Info.TotalHours + (req.body.Info.TotalMinutes / 60)) * 3;
                        }
                    }
                    //  req.body.Info.strCollectionDate = req.body.Info.CollectionDate;
                    req.body.Info.CollectionDate = moment(req.body.Info.strCollectionDate, "DD/MM/YYYY").toDate();
                    ActivityUser.findByIdAndUpdate(
                        userActivity._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true, runValidators: true },
                        function(err, Activity) {
                            if (err) {
                                var errString = "";
                                for (var errName in err.errors) {
                                    errString += (' > ' + err.errors[errName].message);
                                }
                                res.json({ success: false, message: errString });
                            } else {
                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'Activity', 'Added', 'Activity', '1', 'fa fa-heart text-info');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: Activity });
                            }
                        }
                    );
                }
            });
        }
    });

    // Get User Allergies
    router.get('/getUserActivity/:id', function(req, res) {
        ActivityUser.aggregate({ $match: { User: req.params.id } }, { $unwind: "$Info" }, {
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

    // Remove User Activity
    router.post('/removeUserActivity', function(req, res) {
        ActivityUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ActivityId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, Activity) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'Activity', 'Archived', 'Activity', '1', 'fa fa-heart text-info');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: Activity });
                }
            });

    });




    router.post('/getUserActivityDate/:id', function(req, res) {

        ActivityUser.aggregate([{
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
        ]).exec(function(err, Activity) {
            for (var i = 0; i < (Activity[0].Info).length; i++) {
                var parts = (Activity[0].Info[i].strCreatedDate).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if (!(o_date > f_date && o_date < t_date)) {
                    (Activity[0].Info).splice((Activity[0].Info).indexOf(Activity[0].Info[i]), 1);
                }
            }
            res.json({ success: true, message: Activity[0] });
        });

    });

    // Get User Allergies
    router.get('/getUserActivityID/:id', function(req, res) {
        ActivityUser.aggregate([{
                $match: {
                    User: req.params.id
                }
            },
            { $unwind: "$Info" }, {
                $sort: {
                    "Info.CollectionDate": -1
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
        ]).exec(function(err, Activity) {


            res.json({ success: true, message: Activity[0] });
        });
    });





    return router;

};