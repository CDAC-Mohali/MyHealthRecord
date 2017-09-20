angular.module('contactsController', ['userServices', 'contactsServices'])

    .controller('contactsCtrl', function ($scope, User, Contacts, PersonalContacts) {

        User.getStateListing().then(function (data) {
            $scope.StateListing = data.data.message;
        });

        // Contact User Listing
        var getUserList = function () {
            Contacts.fetch($scope.u_id).then(function (data) {

                if (!data.data.message || !(data.data.message.Info).length) {
                    data.data.message = [];
                    $scope.emptyList = true;
                } else {
                    $scope.UserContacts = data.data.message.Info;
                    $scope.emptyList = false;
                }
            });
        };
        getUserList();

        // Contact User Listing
        var getPersonalUserList = function () {
            PersonalContacts.fetch($scope.u_id).then(function (data) {
                if (!data.data.message || !(data.data.message.Info).length) {
                    data.data.message = [];
                    $scope.emptyList2 = true;
                } else {
                    $scope.UserPersonalContacts = data.data.message.Info;
                    $scope.emptyList2 = false;
                }
            });
        };
        getPersonalUserList();

        // Speciality List Fetching
        $scope.getList = function () {
            Contacts.list().then(function (data) {
                $scope.ContactList = data.data.message;
            });
        };

        // Initialize UX Elements
        $scope.showDisable = true;
        $scope.AddForm1 = true;
        $scope.AddForm2 = false;
        $scope.PageOrder1 = true;
        $scope.PageOrder2 = false;
        $scope.SuccessMsg = false;
        $scope.ErrorMsg = false;
        $scope.Loading = false;
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg3 = false;
        $scope.SuccessMsg4 = false;
        $scope.ErrorMsg2 = false;
        $scope.ErrorMsg3 = false;
        $scope.Loading2 = false;
        $scope.ListLoader = false;
        $scope.List = false;
        $scope.getList();

        // UX Functions
        $scope.resetModal = function () {
            $scope.List = false;
            $scope.AddForm1 = true;
            $scope.AddForm2 = false;
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
            $scope.contactForm.$setPristine();
            $scope.contactData = {};
        };

        $scope.resetPersonalModal = function () {
            $scope.List = false;
            $scope.AddForm1 = true;
            $scope.AddForm2 = false;
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
            $scope.personalContactForm.$setPristine();
            $scope.personalContactData = {};
        };


        $scope.chknumeric = function ($event) {


            var regex = new RegExp("^[A-Z a-z]\d*$");
            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };

        $scope.chkspecialchar = function ($event) {


            var regex = new RegExp("^[0-9]\d*$");
            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };
        $scope.chkalphanumeric = function ($event) {
            var regex = new RegExp("^[A-Za-z][a-zA-Z0-9\\-\\s\\.]*$");

            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if ($scope.contactData.Info.HospitalName != undefined) {
                key = $scope.contactData.Info.HospitalName + key;
            }

            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };
         $scope.editalphanumeric = function ($event) {
            var regex = new RegExp("^[A-Za-z][a-zA-Z0-9\\-\\s\\.]*$");

            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if ($scope.UserContactData.HospitalName != undefined) {
                key = $scope.UserContactData.HospitalName + key;
            }

            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };


        // Add Contact Function
        $scope.addContact = function () {

            if ($scope.contactData.Info.Mobile.length < 10) {
                $scope.ErrorMsg = "Please fill valid Mobile Number";
                $scope.Loading = false;
                return false;

            }

            if ($scope.contactData.Info.Address.pin != undefined) {

                if ($scope.contactData.Info.Address.pin.length < 6 && $scope.contactData.Info.Address.pin != "") {
                    $scope.ErrorMsg = "Please fill valid Pin Number";
                    $scope.Loading = false;

                    return false;
                }
            }

            $scope.Loading = true;
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.ErrorMsg = false;
            $scope.contactData.User = $scope.u_id;
            Contacts.add($scope.contactData).then(function (data) {
                if (data.data.success) {
                    getUserList();
                    $scope.Loading = false;
                    $scope.SuccessMsg = "Contact record has been updated.";
                    $("#addContactsModal").modal("hide");

                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg = data.data.message;
                }

            });
        };


        // Add Personal Contact Function
        $scope.addPersonalContact = function (id) {
            if ($scope.personalContactData.Info.Mobile.length < 10) {
                $scope.ErrorMsg = "Please fill valid Mobile Number";
                $scope.Loading = false;
                return false;

            }
            $scope.Loading = true;
            $scope.SuccessMsg3 = false;
            $scope.SuccessMsg4 = false;
            $scope.ErrorMsg3 = false;
            $scope.personalContactData.User = $scope.u_id;
            PersonalContacts.add($scope.personalContactData).then(function (data) {
                if (data.data.success) {
                    getPersonalUserList();
                    $scope.Loading = false;
                    $scope.SuccessMsg3 = "Contact record has been updated.";
                    $("#addPersonalContactsModal").modal("hide");
                    $scope.ErrorMsg = false;
                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg3 = data.data.message;
                }
            });
        };

        // Delete Contact Function
        $scope.deleteContact = function (id) {
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Contact will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    Contacts.remove(id, $scope.u_id).then(function (data) {
                        getUserList();
                        $scope.Loading2 = false;
                        $scope.UserContacts = data.data.message.Info;
                        //  $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Delete Personal Contact Function
        $scope.deletePersonalContact = function (id) {
            $scope.SuccessMsg3 = false;
            $scope.SuccessMsg4 = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Personal Contact will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    PersonalContacts.remove(id, $scope.u_id).then(function (data) {
                        getPersonalUserList();
                        $scope.Loading2 = false;
                        $scope.UserPersonalContacts = data.data.message.Info;
                        // $scope.SuccessMsg4 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show Contact 
        $scope.showContact = function (id) {
            var t = $scope.UserContacts;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserContacts[i]._id == id) {
                    $scope.UserContactData = $scope.UserContacts[i];
                    break;
                }
            }


            $('#showContactModal').modal('toggle');
        };

        // Show Personal Contact 
        $scope.showPersonalContact = function (id) {
            var t = $scope.UserPersonalContacts;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserPersonalContacts[i]._id == id) {
                    $scope.UserPersonalContactData = $scope.UserPersonalContacts[i];
                    break;
                }
            }
            $('#showPersonalContactsModal').modal('toggle');
        };

        // Edit Contact 
        $scope.editContact = function (id) {

            var t = $scope.UserContacts;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserContacts[i]._id == id) {
                    $scope.UserContacts[i].Mobile = parseInt($scope.UserContacts[i].Mobile);
                    $scope.UserContactData = $scope.UserContacts[i];
                    break;
                }
            }
            //   alert($scope.UserContactData.Contact.Id);

            $('#updateContactModal').modal('toggle');
            $("#medicalstateid").val($scope.UserContactData.Address.state.Id);
            $("#specialityId").val($scope.UserContactData.Contact.Id)

        };

        // Edit Contact 
        $scope.editPersonalContact = function (id) {
            var t = $scope.UserPersonalContacts;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserPersonalContacts[i]._id == id) {
                    $scope.UserPersonalContacts[i].Mobile = parseInt($scope.UserPersonalContacts[i].Mobile);
                    $scope.UserPersonalContactData = $scope.UserPersonalContacts[i];
                    break;
                }
            }
            $('#updatePersonalContactModal').modal('toggle');
        };

        // Update Contact
        $scope.updateContact = function (id) {

            if ($scope.UserContactData.Mobile.length < 10) {
                $scope.ErrorMsg = "Please fill valid Mobile Number";
                $scope.Loading = false;
                return false;

            }

            if ($scope.UserContactData.Address.pin != undefined) {

                if ($scope.UserContactData.Address.pin.length < 6 && $scope.UserContactData.Address.pin != "") {
                    $scope.ErrorMsg = "Please fill valid Pin Number";
                    $scope.Loading = false;

                    return false;
                }
            }


            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.Loading = true;
            //       $scope.UserContactData.Address.state.Id = $("#medicalstateid").val();s
            var x = {};
            x.Info = $scope.UserContactData;
            Contacts.update($scope.u_id, id, x).then(function (data) {
                if (data.data.success) {
                    $scope.SuccessMsg = "Your Contact Info Has Been Updated!";
                    $('#updateContactModal').modal('hide');
                } else {
                    $scope.ErrorMsg = data.data.message;
                }
                getUserList();
            });
            $scope.Loading = false;
        };

        // Update Personal Contact
        $scope.updatePersonalContact = function (id) {

            if ($scope.UserPersonalContactData.Mobile.length < 10) {
                $scope.ErrorMsg = "Please fill valid Mobile Number";
                $scope.Loading = false;
                return false;

            }
            $scope.SuccessMsg3 = false;
            $scope.ErrorMsg3 = false;
            $scope.Loading = true;
            var x = {};
            x.Info = $scope.UserPersonalContactData;
            PersonalContacts.update($scope.u_id, id, x).then(function (data) {
                if (data.data.success) {
                    $scope.SuccessMsg3 = "Your Contact Info Has Been Updated!";
                    $('#updatePersonalContactModal').modal('hide');
                } else {
                    $scope.ErrorMsg3 = data.data.message;
                }
                getUserList();
            });
            $scope.Loading = false;
        };

    });