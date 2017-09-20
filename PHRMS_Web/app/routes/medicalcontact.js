/*
 * Allergy Module Routes. 
 * They Require Access Tokens too.
 */

var mongoose = require('mongoose');
var ContactUser = require('../models/contact-user.js');
var PersonalContactUser = require('../models/personal-contact.js');
var SpecialityList = require('../models/speciality-master.js');
var AuditService = require('../classes/Audittrial.js');
var audit = new AuditService();

module.exports = function (router) {

    // Get Contact Name Listing
    router.get('/getSpecialityList', function (req, res) {
        SpecialityList.find({}, function (err, list) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.json({ success: true, message: list });
            }
        });
    });

    // Add/Update User Contact List
    router.post('/addContactUser', function (req, res) {
        req.body.Info.Name = "Dr. " + req.body.Info.Name
        ContactUser.findOne({ User: req.body.User }).exec(function (err, userContact) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!userContact) {
                var contact = new ContactUser(req.body);
                contact.save(function (err, cont) {
                    if (err) {
                        res.json({ success: false, message: 'Oops! Some Error Occured.' });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'MedicalContacts', 'Added', 'Medical Contact', '1', 'fa fa-user-md text-secondary');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: cont });
                    }
                });
            } else if (userContact) {
                var flag = false;
                for (var i = 0; i < (userContact.Info).length; i++) {
                    if (userContact.Info[i].Mobile == req.body.Info.Mobile ||
                        userContact.Info[i].Email == req.body.Info.Email) {
                        flag = true;
                        break;
                    }
                }
                if (flag) res.json({ success: false, message: "Contact with Provided Email or Phone already " });
                else
                    ContactUser.findByIdAndUpdate(
                        userContact._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function (err, cont) {
                            if (err) throw err;
                            else {

                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'MedicalContacts', 'Added', 'Medical Contact', '1', 'fa fa-user-md text-secondary');
                                ////////////////////////////////////////////////////////
                                res.json({ success: true, message: cont });
                            }
                        }
                    );
            }
        });
    });

    // Add/Update Personal Contact List
    router.post('/addPersonalContactUser', function (req, res) {
        PersonalContactUser.findOne({ User: req.body.User }).exec(function (err, userContact) {
            if (err) {
                console.log(err);
                throw err;
            }
            if (!userContact) {
                var contact = new PersonalContactUser(req.body);
                contact.save(function (err, cont) {
                    if (err) {
                        res.json({ success: false, message: 'Oops! Some Error Occured.' });
                    } else {
                        ////////////////////////////////////////////////audit save///////
                        audit.send(req.body.User, 'MedicalContacts', 'Added', 'Personal Contact', '1', 'fa fa-user-md text-secondary');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: cont });
                    }
                });
            } else if (userContact) {
                var flag = false;
                for (var i = 0; i < (userContact.Info).length; i++) {
                    if (userContact.Info[i].Mobile == req.body.Info.Mobile ||
                        userContact.Info[i].Email == req.body.Info.Email) {
                        flag = true;
                        break;
                    }
                }
                if (flag) res.json({ success: false, message: "Contact with Provided Email or Phone already " });
                else
                    PersonalContactUser.findByIdAndUpdate(
                        userContact._id, { $push: { "Info": req.body.Info } }, { upsert: true, new: true },
                        function (err, cont) {
                            if (err) throw err;
                            else {
                                ////////////////////////////////////////////////audit save///////
                                audit.send(req.body.User, 'MedicalContacts', 'Added', 'Personal Contact', '1', 'fa fa-user-md text-secondary');
                                ////////////////////////////////////////////////////////

                                res.json({ success: true, message: cont });
                            }
                        }
                    );
            }
        });
    });

    // Get User Contacts
    router.get('/getUserContact/:id', function (req, res) {
        ContactUser.findOne({ User: req.params.id }).exec(function (err, contact) {
            if (err) throw err;
            else {
                res.json({ success: true, message: contact });
            }
        });
    });

    // Get User Personal Contacts
    router.get('/getUserPersonalContact/:id', function (req, res) {
        PersonalContactUser.findOne({ User: req.params.id }).exec(function (err, contact) {
            if (err) throw err;
            else {
                res.json({ success: true, message: contact });
            }
        });
    });

    // Remove User Contact
    router.post('/removeUserContact', function (req, res) {
        ContactUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ContactId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.ContactId) } } }, { new: true },
            function (err, contact) {
                if (err) throw err;
                else {
                    ////////////////DELETE
                    audit.send(req.body.UserId, 'MedicalContacts', 'Archived', 'Medical Contact', '1', 'fa fa-user-md text-secondary');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: contact });
                }
            });
    });

    // Remove Personal User Contact
    router.post('/removePersonalUserContact', function (req, res) {
        PersonalContactUser.collection.update({ 'Info._id': new mongoose.Types.ObjectId(req.body.ContactId) }, { $pull: { 'Info': { _id: new mongoose.Types.ObjectId(req.body.ContactId) } } }, { new: true },
            function (err, contact) {
                if (err) throw err;
                else {

                    ////////////////DELETE
                    audit.send(req.body.UserId, 'MedicalContacts', 'Archived', 'Personal Contact', '1', 'fa fa-user-md text-secondary');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: contact });
                }
            });
    });

    // Update User Route
    router.post('/updateContact/:id/:userId', function (req, res) {

        var flag = false;
        ContactUser.findOne({
            User: req.params.userId
        }, function (err, doc) {

            for (var i = 0; i < (doc.Info).length; i++) {
                //   console.log(doc.Info[i].Mobile);
                if (doc.Info[i]._id != req.params.id) {
                    if (doc.Info[i].Mobile == req.body.Info.Mobile || doc.Info[i].Email == req.body.Info.Email) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag == true) res.json({ success: false, message: "Contact with Provided Email or Phone already " });
            else
                ContactUser.findOneAndUpdate({ User: req.params.userId, "Info._id": req.params.id }, {
                    "$set": {
                        "Info.$": req.body.Info
                    }
                },
                    function (err, doc) {
                       
                        ////////////////////////////////////////////////audit Update///////
                        audit.send(req.params.userId, 'MedicalContacts', 'Updated', 'Medical Contact', '1', 'fa fa-user-md text-secondary');
                        ////////////////////////////////////////////////////////
                        res.json({ success: true, message: "Your Contact Details Have Been Updated!" });
                    }
                );
        });
    });

    // Update User Route
    router.post('/updatePersonalContact/:id/:userId', function (req, res) {
        var flag = false;
        PersonalContactUser.findOne({ User: req.params.userId }, function (err, doc) {
            for (var i = 0; i < (doc.Info).length; i++) {
                if (doc.Info[i]._id != req.params.id) {
                    if (doc.Info[i].Mobile == req.body.Info.Mobile) {
                        flag = true;
                        break;
                    }
                    if (doc.Info[i].Email != '') {
                        if (doc.Info[i].Email == req.body.Info.Email) {
                            flag = true;
                            break;
                        }
                    }
                }
            }
            if (flag) res.json({ success: false, message: "Contact with Provided Email or Phone already " });
            else PersonalContactUser.findOneAndUpdate({ User: req.params.userId, "Info._id": req.params.id }, {
                "$set": {
                    "Info.$": req.body.Info
                }
            },
                function (err, doc) {
                    ////////////////////////////////////////////////audit save///////
                    audit.send(req.params.userId, 'MedicalContacts', 'Updated', 'Personal Contact', '1', 'fa fa-user-md text-secondary');
                    ////////////////////////////////////////////////////////
                    res.json({ success: true, message: "Your Personal Details Have Been Updated!" });
                }
            );
        });
    });

    return router;

};