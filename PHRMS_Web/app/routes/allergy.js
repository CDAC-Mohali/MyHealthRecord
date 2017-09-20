/*
 * Allergy Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var AllergyMaster = require('../models/allergy-master.js');
var AllergyUser = require('../models/allergy-user.js');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();
var UserProfile = require('../models/user-profile.js');

module.exports = function(router) {
    // Get Allergy Name Listing
    router.post('/getAllergyList', function(req, res) {
        AllergyMaster.find({ AllergyName: { $regex: new RegExp('^' + req.body.exp, "i") } }, function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Allergy List
    router.post('/addAllergyUser', function(req, res) {
        if (!req.body.Info.Allergy.AllergyName ||
            !req.body.Info.Allergy.Id ||
            !req.body.Info.StillHave ||
            !req.body.Info.Severity) {
            res.json({ success: false, message: 'Please ensure that fields marked with * are provided' });
        } else {

            AllergyUser.findOne({ User: req.body.User }).exec(function(err, userAllergy) {
                if (err) {
                    throw err;
                }
                if (!userAllergy) {
                    var allergy = new AllergyUser(req.body);
                    allergy.save(function(err, allergy) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else {

                            ////////////////////////////////////////////////audit save///////
                            audit.send(req.body.User, 'Allergy', '-Added by', req.body.Info.Allergy.AllergyName, req.body.Info.Allergy.SourceId, 'fa fa-pagelines text-success');
                            ////////////////////////////////////////////////////////
                            res.json({ success: true, message: allergy });
                        }
                    });



                } else if (userAllergy) {
                    AllergyUser.findByIdAndUpdate(
                        userAllergy._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function(err, allergy) {
                            if (err) {
                                var errString = "";
                                for (var errName in err.errors) {
                                    errString += (' > ' + err.errors[errName].message);
                                }
                                res.json({ success: false, message: errString });
                            } else {


                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'Allergy', '-Added by', req.body.Info.Allergy.AllergyName, req.body.Info.Allergy.SourceId, 'fa fa-pagelines text-success');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: allergy });
                            }
                        }
                    );



                }
            });
        }
    });

    // Get User Allergies
    router.get('/getUserAllergy/:id', function(req, res) {


        AllergyUser.aggregate([{
                $match: {
                    User: req.params.id
                }
            },
            { $unwind: "$Info" }, {
                $sort: {
                    "Info.CreatedDate": -1
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
        ]).exec(function(err, condition) {
            res.json({ success: true, message: condition[0] });
        });
    });

    // Remove User Allergy
    router.post('/removeUserAllergy', function(req, res) {
        AllergyUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.AllergyId) }, { $set: { 'Info.$.DeleteFlag': true } }, { new: true },
            function(err, allergy) {
                if (err) throw err;
                else {
                    ////////////////
                    audit.send(req.body.UserId, 'Allergy', '-Archived  by', req.body.Allergyname, allergy.SourceId, 'fa fa-pagelines text-success');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: allergy });
                }
            });
    });

    router.post('/getUserAllergyByDate/:id', function(req, res) {
        AllergyUser.aggregate([{
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
        ]).exec(function(err, allergy) {
            var list = [];
            for (var i = 0; i < (allergy[0].Info).length; i++) {
                var parts = (allergy[0].Info[i].strCreatedDate).split('/');
                var o_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.From).split('/');
                var f_date = new Date(parts[2], parts[1] - 1, parts[0]);
                parts = (req.body.To).split('/');
                var t_date = new Date(parts[2], parts[1] - 1, parts[0]);
                if ((o_date >= f_date && o_date <= t_date)) {
                    list.push(allergy[0].Info[i]);
                    // (allergy[0].Info).splice((allergy[0].Info).indexOf(allergy[0].Info[i]), 1);
                }
            }
            res.json({ success: true, message: { "Info": list } });
        });
    });
    return router;

};