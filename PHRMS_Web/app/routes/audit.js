/*
 * Allergy Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var AuditUser = require('../models/audit-trail.js');

module.exports = function(router) {

    // Get Audit List
    router.get('/getAuditList/:id', function(req, res) {
        // AuditUser.sort('CreatedDate', -1).findById(req.params.id,
        //     function(err, list) {
        AuditUser.findOne({ User: req.params.id }).sort({ "Info.CreatedDate": 1 }).exec(function(err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Audit List
    router.post('/addAuditUser', function(req, res) {
        AuditUser.findOne({ User: req.body.User }).exec(function(err, userAudit) {
            if (err) {
                throw err;
            }
            if (!userAudit) {
                var audit = new AuditUser(req.body);
                audit.save(function(err, audit) {
                    if (err) {
                        var errString = "";
                        for (var errName in err.errors) {
                            errString += (' > ' + err.errors[errName].message);
                        }
                        res.json({ success: false, message: errString });
                    } else {
                        res.json({ success: true, message: audit });
                    }
                });
            } else if (userAudit) {
                AuditUser.findByIdAndUpdate(
                    userAudit._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                    function(err, audit) {
                        if (err) {
                            var errString = "";
                            for (var errName in err.errors) {
                                errString += (' > ' + err.errors[errName].message);
                            }
                            res.json({ success: false, message: errString });
                        } else res.json({ success: true, message: audit });
                    }
                );
            }
        });
    });

    return router;

};