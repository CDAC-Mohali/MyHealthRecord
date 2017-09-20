"use strict";
angular.module('shareControllers', ['shareServices', 'allergyServices', 'immunizationServices', 'conditionServices',
    'labServices', 'procedureServices', 'medicationServices', 'contactsServices', 'notificationServices', 'userServices'
])

.controller('shareCtrl', function($rootScope, $scope, Share, Allergy, Immunization, Condition,
    Lab, Procedure, Medication, Contacts, PersonalContacts, Notification, User
) {

    // Initialize UX
    $('#datapicker').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });
    $('.input-daterange').datepicker({
        format: 'dd/mm/yyyy',
        endDate: '+0d',
        autoclose: true
    });

    $scope.vm = {};
    $scope.vm.values = {
        1: '1 Day',
        2: '2 Days',
        3: '3 Days',
        4: '4 Days',
        5: '5 Days'
    };

    // Contact User Listing
    Contacts.fetch($scope.u_id).then(function(data) {
        if (data.data.message === null) {
            data.data.message = [];
        }
        $scope.UserContacts = data.data.message.Info;
    });

    // Personal Contact User Listing
    PersonalContacts.fetch($scope.u_id).then(function(data) {
        if (data.data.message === null) {
            data.data.message = [];
        }
        $scope.UserPersonalContacts = data.data.message.Info;
    });

    $scope.shared = {};
    // Populate Data 
    User.fetch($scope.u_id).then(function(data) {
        $scope.shared.Personal = data.data.message.personal;
    });
    $scope.shared.UserId = $scope.u_id;
    $scope.shared.Name = $scope.u_name;
    $scope.shared.Mobile = $scope.u_mobile;
    $scope.shared.Email = $scope.u_email;
    $scope.shared.Picture = $scope.u_pic;
    $scope.shared.Contact = {};
    $scope.shared.Validity = "2";
    $scope.MedicalList = true;
    $scope.PersonalList = false;
    $scope.Label = "Query";
    $scope.ContactType = "Medical";
    $scope.ContactName = "-";
    $scope.DisplayArena = false;

    $scope.$watch('ContactType', function() {
        if ($scope.ContactType === "Medical") {
            $scope.MedicalList = true;
            $scope.PersonalList = false;
            $scope.Label = "Query";
            $scope.shared.Contact.Type = "Medical"
            $scope.DisplaySelection = false;
            $scope.DisplayArena = false;
            $scope.Detail = "";
            $scope.SelectionType = "";
            $scope.clearlist();


        } else {
            $scope.PersonalList = true;
            $scope.MedicalList = false;
            $scope.Label = "Message";
            $scope.shared.Contact.Type = "Personal"
            $scope.DisplaySelection = false;
            $scope.DisplayArena = false;
            $scope.Detail = "";
            $scope.SelectionType = "";
            $scope.clearlist();

        }
    });

    $scope.$watch('Detail', function() {
        if ($scope.Detail) {
            $scope.DisplaySelection = true;
            $scope.ContactName = $scope.shared.Contact.Name;
            if ($scope.ContactType === "Medical")
                for (var i = 0; i < ($scope.UserContacts).length; i++) {
                    if ($scope.UserContacts[i]._id == $scope.Detail) {
                        $scope.shared.Contact = $scope.UserContacts[i];
                        $scope.shared.Contact.Type = "Medical"
                        $scope.shared.Contact.Id = $scope.Detail;
                        break;
                    }
                }
            else if ($scope.ContactType == "Personal")
                for (var i = 0; i < ($scope.UserPersonalContacts).length; i++) {
                    if ($scope.UserPersonalContacts[i]._id == $scope.Detail) {
                        $scope.shared.Contact = $scope.UserPersonalContacts[i];
                        $scope.shared.Contact.Type = "Personal"
                        $scope.shared.Contact.Id = $scope.Detail;
                        break;
                    }
                }
        } else
            $scope.DisplaySelection = false;
        $scope.DisplayArena = false;
        $scope.SelectionType = "";
        $scope.clearlist();
    });

    $scope.$watch('SelectionType', function() {
        if ($scope.SelectionType == 1)
            $scope.DisplayDate = true;
        else {
            $scope.DisplayDate = false;
            delete $scope.dateData;
        }
        if ($scope.SelectionType)
            $scope.DisplayArena = true;

    });

    $scope.clearlist = function() {

        selectedAllergies = new Array();
        selectedImmunizations = new Array();
        selectedConditions = new Array();
        selectedLabs = new Array();
        selectedProcedures = new Array();
        selectedMedicines = new Array();
        tempselectedImmunizations = new Array();
        tempselectedAllergies = new Array();
        tempselectedProblems = new Array();
        tempselectedLabs = new Array();
        tempselectedProcedures = new Array();
        tempselectedMedicines = new Array();
        $scope.shared.Allergy = new Array();
        $scope.shared.Immunization = new Array();
        $scope.shared.Condition = new Array();
        $scope.shared.Lab = new Array();
        $scope.shared.Procedure = new Array();
        $scope.shared.Medication = new Array();
        $scope.AllergyCount = 0;
        $scope.ImmunizationCount = 0;
        $scope.ConditionCount = 0;
        $scope.LabCount = 0;
        $scope.ProcedureCount = 0;
        $scope.MedicineCount = 0;
        $(".ckImm").prop('checked', false);
        $("#ckImmunization").prop('checked', false);
        $(".ckAll").prop('checked', false);
        $("#ckAllergy").prop('checked', false);
        $(".ckProb").prop('checked', false);
        $("#ckProblem").prop('checked', false);
        $(".ckLab").prop('checked', false);
        $("#ckLabTest").prop('checked', false);
        $(".ckProc").prop('checked', false);
        $("#ckProcedure").prop('checked', false);
        $(".ckMed").prop('checked', false);
        $("#ckMedicine").prop('checked', false);
    }

    $scope.shareData = function() {
        if ($scope.AllergyCount == 0 && $scope.ImmunizationCount == 0 && $scope.ConditionCount == 0 &&
            $scope.LabCount == 0 && $scope.ProcedureCount == 0 && $scope.MedicineCount == 0 &&
            ($scope.shared.UserMessage.Message == undefined || $scope.shared.UserMessage.Message == "")) {
            swal("Oops...", "Please select the record.", "error");
        } else {
            //    alert(JSON.stringify($scope.shared.Condition));
            Share.add($scope.shared).then(function(data) {


                if (data.data.success) {
                    swal({
                        title: data.data.message,
                        text: "An OTP has been sent to the selected contact. The OTP is valid for " + $scope.shared.Validity + " Days",
                        type: "success"
                    });
                    if ($scope.shared.UserMessage.Message)
                        $scope.shared.UserMessage.Message = "";
                    $scope.clearlist();
                } else {
                    Notification.error(data.data.message);
                }
            });



        }
    };


    $scope.Selectchk = function(obj, rowType) {

        if (rowType == 1) {
            if ($("#" + obj._id).prop('checked') == true) {
                $("#" + obj._id).prop('checked', false);
                $scope.TempmanageAllergy(false, obj);
            } else {
                $("#" + obj._id).prop('checked', true);
                $scope.TempmanageAllergy(true, obj);
            }
        } else if (rowType == 2) {
            if ($("#" + obj._id).prop('checked') == true) {
                $("#" + obj._id).prop('checked', false);
                $scope.TempmanageImmunization(false, obj);
            } else {
                $("#" + obj._id).prop('checked', true);
                $scope.TempmanageImmunization(true, obj);
            }
        } else if (rowType == 3) {
            if ($("#" + obj._id).prop('checked') == true) {
                $("#" + obj._id).prop('checked', false);
                $scope.TempmanageProblem(false, obj);
            } else {
                $("#" + obj._id).prop('checked', true);
                $scope.TempmanageProblem(true, obj);
            }
        } else if (rowType == 4) {
            if ($("#" + obj._id).prop('checked') == true) {
                $("#" + obj._id).prop('checked', false);
                $scope.TempmanageLab(false, obj);
            } else {
                $("#" + obj._id).prop('checked', true);
                $scope.TempmanageLab(true, obj);
            }
        } else if (rowType == 5) {
            if ($("#" + obj._id).prop('checked') == true) {
                $("#" + obj._id).prop('checked', false);
                $scope.TempmanageProcedure(false, obj);
            } else {
                $("#" + obj._id).prop('checked', true);
                $scope.TempmanageProcedure(true, obj);
            }
        } else if (rowType == 6) {
            if ($("#" + obj._id).prop('checked') == true) {
                $("#" + obj._id).prop('checked', false);
                $scope.TempmanageMedicine(false, obj);
            } else {
                $("#" + obj._id).prop('checked', true);
                $scope.TempmanageMedicine(true, obj);
            }
        }
    }

    $("#allergytab").click(function() {
        $scope.TabColor(1);
    });
    $("#immunizationtab").click(function() {
        $scope.TabColor(2);
    });
    $("#problemtab").click(function() {
        $scope.TabColor(3);
    });
    $("#labtab").click(function() {
        $scope.TabColor(4);
    });
    $("#proceduretab").click(function() {
        $scope.TabColor(5);
    });
    $("#medicinetab").click(function() {
        $scope.TabColor(6);
    });
    $scope.TabColor = function(type) {

        $(".nav-tabs").css("border-bottom-color", "#31708f");
        $(".nav-tabs").css("color", "rgb(154,205,50)");
        if (type == "1") {

            $("#allergytab").css("border-color", "#31708f");
            $("#allergytab").css("background-color", "#BCE8F1");
            $("#allergytab").css("border-bottom-color", "#ffffff");
            $("#immunizationtab").css("border-color", "#ffffff");
            $("#immunizationtab").css("border-bottom-color", "#31708f");
            $("#immunizationtab").css("background-color", "#ffffff");
            $("#problemtab").css("border-color", "#ffffff");
            $("#problemtab").css("border-bottom-color", "#31708f");
            $("#problemtab").css("background-color", "#ffffff");
            $("#labtab").css("border-color", "#ffffff");
            $("#labtab").css("border-bottom-color", "#31708f");
            $("#labtab").css("background-color", "#ffffff");
            $("#proceduretab").css("border-color", "#ffffff");
            $("#proceduretab").css("border-bottom-color", "#31708f");
            $("#proceduretab").css("background-color", "#ffffff");
            $("#medicinetab").css("border-color", "#ffffff");
            $("#medicinetab").css("border-bottom-color", "#31708f");
            $("#medicinetab").css("background-color", "#ffffff");



        } else if (type == "2") {

            $("#immunizationtab").css("border-color", "#31708f");
            $("#immunizationtab").css("background-color", "#BCE8F1");
            $("#immunizationtab").css("border-bottom-color", "#ffffff");
            $("#allergytab").css("border-color", "#ffffff");
            $("#allergytab").css("border-bottom-color", "#31708f");
            $("#allergytab").css("background-color", "#ffffff");
            $("#problemtab").css("border-color", "#ffffff");
            $("#problemtab").css("border-bottom-color", "#31708f");
            $("#problemtab").css("background-color", "#ffffff");
            $("#labtab").css("border-color", "#ffffff");
            $("#labtab").css("border-bottom-color", "#31708f");
            $("#labtab").css("background-color", "#ffffff");
            $("#proceduretab").css("border-color", "#ffffff");
            $("#proceduretab").css("border-bottom-color", "#31708f");
            $("#proceduretab").css("background-color", "#ffffff");
            $("#medicinetab").css("border-color", "#ffffff");
            $("#medicinetab").css("border-bottom-color", "#31708f");
            $("#medicinetab").css("background-color", "#ffffff");

        } else if (type == "3") {

            $("#problemtab").css("border-color", "#31708f");
            $("#problemtab").css("background-color", "#BCE8F1");
            $("#problemtab").css("border-bottom-color", "#ffffff");
            $("#allergytab").css("border-color", "#ffffff");
            $("#allergytab").css("border-bottom-color", "#31708f");
            $("#allergytab").css("background-color", "#ffffff");
            $("#immunizationtab").css("border-color", "#ffffff");
            $("#immunizationtab").css("border-bottom-color", "#31708f");
            $("#immunizationtab").css("background-color", "#ffffff");
            $("#labtab").css("border-color", "#ffffff");
            $("#labtab").css("border-bottom-color", "#31708f");
            $("#labtab").css("background-color", "#ffffff");
            $("#proceduretab").css("border-color", "#ffffff");
            $("#proceduretab").css("border-bottom-color", "#31708f");
            $("#proceduretab").css("background-color", "#ffffff");
            $("#medicinetab").css("border-color", "#ffffff");
            $("#medicinetab").css("border-bottom-color", "#31708f");
            $("#medicinetab").css("background-color", "#ffffff");

        } else if (type == "4") {

            $("#labtab").css("border-color", "#31708f");
            $("#labtab").css("background-color", "#BCE8F1");
            $("#labtab").css("border-bottom-color", "#ffffff");
            $("#allergytab").css("border-color", "#ffffff");
            $("#allergytab").css("border-bottom-color", "#31708f");
            $("#allergytab").css("background-color", "#ffffff");
            $("#immunizationtab").css("border-color", "#ffffff");
            $("#immunizationtab").css("border-bottom-color", "#31708f");
            $("#immunizationtab").css("background-color", "#ffffff");
            $("#problemtab").css("border-color", "#ffffff");
            $("#problemtab").css("border-bottom-color", "#31708f");
            $("#problemtab").css("background-color", "#ffffff");
            $("#proceduretab").css("border-color", "#ffffff");
            $("#proceduretab").css("border-bottom-color", "#31708f");
            $("#proceduretab").css("background-color", "#ffffff");
            $("#medicinetab").css("border-color", "#ffffff");
            $("#medicinetab").css("border-bottom-color", "#31708f");
            $("#medicinetab").css("background-color", "#ffffff");
        } else if (type == "5") {


            $("#proceduretab").css("border-color", "#31708f");
            $("#proceduretab").css("background-color", "#BCE8F1");
            $("#proceduretab").css("border-bottom-color", "#ffffff");
            $("#allergytab").css("border-color", "#ffffff");
            $("#allergytab").css("border-bottom-color", "#31708f");
            $("#allergytab").css("background-color", "#ffffff");
            $("#immunizationtab").css("border-color", "#ffffff");
            $("#immunizationtab").css("border-bottom-color", "#31708f");
            $("#immunizationtab").css("background-color", "#ffffff");
            $("#problemtab").css("border-color", "#ffffff");
            $("#problemtab").css("border-bottom-color", "#31708f");
            $("#problemtab").css("background-color", "#ffffff");
            $("#labtab").css("border-color", "#ffffff");
            $("#labtab").css("border-bottom-color", "#31708f");
            $("#labtab").css("background-color", "#ffffff");
            $("#medicinetab").css("border-color", "#ffffff");
            $("#medicinetab").css("border-bottom-color", "#31708f");
            $("#medicinetab").css("background-color", "#ffffff");

        } else if (type == "6") {


            $("#medicinetab").css("border-color", "#31708f");
            $("#medicinetab").css("background-color", "#BCE8F1");
            $("#medicinetab").css("border-bottom-color", "#ffffff");
            $("#allergytab").css("border-color", "#ffffff");
            $("#allergytab").css("border-bottom-color", "#31708f");
            $("#allergytab").css("background-color", "#ffffff");
            $("#immunizationtab").css("border-color", "#ffffff");
            $("#immunizationtab").css("border-bottom-color", "#31708f");
            $("#immunizationtab").css("background-color", "#ffffff");
            $("#problemtab").css("border-color", "#ffffff");
            $("#problemtab").css("border-bottom-color", "#31708f");
            $("#problemtab").css("background-color", "#ffffff");
            $("#labtab").css("border-color", "#ffffff");
            $("#labtab").css("border-bottom-color", "#31708f");
            $("#labtab").css("background-color", "#ffffff");
            $("#proceduretab").css("border-color", "#ffffff");
            $("#proceduretab").css("border-bottom-color", "#31708f");
            $("#proceduretab").css("background-color", "#ffffff");
        }
    }




    // Initialize Variables
    var selectedAllergies = new Array();
    var selectedImmunizations = new Array();
    var selectedConditions = new Array();
    var selectedLabs = new Array();
    var selectedProcedures = new Array();
    var selectedMedicines = new Array();
    var tempselectedImmunizations = new Array();
    var tempselectedAllergies = new Array();
    var tempselectedProblems = new Array();
    var tempselectedLabs = new Array();
    var tempselectedProcedures = new Array();
    var tempselectedMedicines = new Array();
    $scope.shared.Allergy = new Array();
    $scope.shared.Immunization = new Array();
    $scope.shared.Condition = new Array();
    $scope.shared.Lab = new Array();
    $scope.shared.Procedure = new Array();
    $scope.shared.Medication = new Array();
    $scope.Allergyenable = false;
    $scope.AllergyCount = 0;
    $scope.ImmunizationCount = 0;
    $scope.ConditionCount = 0;
    $scope.LabCount = 0;
    $scope.ProcedureCount = 0;
    $scope.MedicineCount = 0;


    // Allergy Functions

    $scope.selectAllergy = function() {
        $("#ckAllergy").prop('checked', false);

        if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
            Allergy.filter($scope.u_id, $scope.dateData).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserAllergies = data.data.message.Info;
                    $scope.enableAllergy = true;

                    if (($scope.UserAllergies).length == 0) $scope.emptyAllergyList = true;
                    else $scope.emptyAllergyList = false;
                } else {
                    $scope.UserAllergies = [];
                    $scope.emptyList = true;
                    $scope.enableAllergy = false;
                }
            });
        else
            Allergy.fetch($scope.u_id).then(function(data) {

                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserAllergies = data.data.message.Info;
                    $scope.enableAllergy = true;

                    if (($scope.UserAllergies).length == 0) $scope.emptyAllergyList = true;
                    else $scope.emptyAllergyList = false;
                } else {
                    $scope.UserAllergies = [];
                    $scope.emptyList = true;
                    $scope.enableAllergy = false;
                }
            });

        $("#allergyModal").modal('show');
    };
    if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
        Allergy.filter($scope.u_id, $scope.dateData).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserAllergies = data.data.message.Info;
                $scope.enableAllergy = true;
            } else {
                $scope.UserAllergies = [];
                $scope.emptyList = true;
                $scope.enableAllergy = false;
            }
        });
    else
        Allergy.fetch($scope.u_id).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserAllergies = data.data.message.Info;
                $scope.enableAllergy = true;
            } else {
                $scope.UserAllergies = [];
                $scope.emptyList = true;
                $scope.enableAllergy = false;
            }
        });

    $('#allergyModal')
        .on('shown.bs.modal', function() {

            for (var i = 0; i < (tempselectedAllergies).length; i++) {
                $("#" + tempselectedAllergies[i]._id.trim()).prop('checked', true);
            }

        });

    $scope.TempmanageAllergy = function(status, object) {

        var f = false;
        if (status) {
            tempselectedAllergies.push(object);

            if ((tempselectedAllergies).length == $scope.UserAllergies.length) {
                $("#ckAllergy").prop('checked', true);
            }

        } else {
            $("#ckAllergy").prop('checked', false);
            tempselectedAllergies.splice(selectedAllergies.indexOf(object), 1);

        }



    };

    // select all the checkboxes at one time    
    $scope.checkAllAllergy = function(status, UserAllergies) {
        tempselectedAllergies = [];
        if (status == false) {
            $(".ckAll").prop('checked', false);
            for (var i = 0; i < (UserAllergies).length; i++) {

                tempselectedAllergies.splice(selectedAllergies.indexOf(UserAllergies), 1);

            }
        } else {
            $(".ckAll").prop('checked', true);
            for (var i = 0; i < (UserAllergies).length; i++) {
                tempselectedAllergies.push(UserAllergies[i]);
            }
        }

    }

    $scope.manageAllergy = function(status, object) {

        var f = false;
        if (status) {
            for (var i = 0; i < ($scope.shared.Allergy).length; i++) {
                if ($scope.shared.Allergy[i].Allergy.AllergyName == object.Allergy.AllergyName &&
                    $scope.shared.Allergy[i].CreatedDate == object.CreatedDate) var f = true;
            }
            if (!f)
                selectedAllergies.push(object);


            // else Notification.error("<strong>Allergy Not Added</strong>! You have already added this selected allergy.");
            if (($scope.UserAllergies).length == 0) $scope.emptyAllergyList = true;
        } else {
            $("#ckAllergy").prop('checked', false);
            selectedAllergies.splice(selectedAllergies.indexOf(object), 1);
        }
    };
    $scope.deleteAllergy = function(obj) {
        selectedAllergies.splice(selectedAllergies.indexOf(obj), 1);
        ($scope.UserAllergies).push(obj);
        if (($scope.UserAllergies).length > 0) $scope.emptyAllergyList = false;
        $scope.shared.Allergy = selectedAllergies;
        $scope.AllergyCount = selectedAllergies.length;
    };
    $scope.submitAllergy = function() {
        var Allergylst = new Array();
        for (var i = 0; i < (tempselectedAllergies).length; i++) {
            $scope.manageAllergy(true, tempselectedAllergies[i]);
            Allergylst.push(tempselectedAllergies[i]);
        }
        selectedAllergies = Allergylst;
        $scope.shared.Allergy = selectedAllergies;
        $scope.AllergyCount = ($scope.shared.Allergy).length;
        $("#allergytab").click();

        $scope.TabColor("1");
        $("#allergyModal").modal('hide');
    };

    $scope.CancelAllergy = function() {

        var array3 = $scope.shared.Allergy.filter(function(obj) { return tempselectedAllergies.indexOf(obj) == -1; });

        for (var i = 0; i < (array3).length; i++) {
            tempselectedAllergies.push(array3[i]);
        }

        var array4 = tempselectedAllergies.filter(function(obj) { return $scope.shared.Allergy.indexOf(obj) == -1; });

        for (var j = 0; j < (array4).length; j++) {
            tempselectedAllergies.splice(tempselectedAllergies.indexOf(array4[j]), 1);

        }
    };

    // Immunization Functions
    $scope.selectImmunization = function() {
        $("#ckImmunization").prop('checked', false);
        if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
            Immunization.filter($scope.u_id, $scope.dateData).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserImmunizations = data.data.message.Info;
                    $scope.enableImmunization = true;


                } else {
                    $scope.UserImmunizations = [];
                    $scope.emptyList = true;
                    $scope.enableImmunization = false;
                }
            });
        else
            Immunization.fetch($scope.u_id).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserImmunizations = data.data.message.Info;
                    $scope.enableImmunization = true;


                } else {
                    $scope.UserImmunizations = [];
                    $scope.emptyList = true;
                    $scope.enableImmunization = false;
                }
            });
        if (($scope.UserImmunizations).length == 0) $scope.emptyImmunizationList = true;
        else $scope.emptyImmunizationList = false;
        $("#immunizationModal").modal('show');


    };
    if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
        Immunization.filter($scope.u_id, $scope.dateData).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserImmunizations = data.data.message.Info;
                $scope.enableImmunization = true;
            } else {
                $scope.UserImmunizations = [];
                $scope.emptyList = true;
                $scope.enableImmunization = false;
            }
        });
    else
        Immunization.fetch($scope.u_id).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserImmunizations = data.data.message.Info;
                $scope.enableImmunization = true;
            } else {
                $scope.UserImmunizations = [];
                $scope.emptyList = true;
                $scope.enableImmunization = false;
            }
        });


    $('#immunizationModal')
        .on('shown.bs.modal', function() {



            for (var i = 0; i < (tempselectedImmunizations).length; i++) {
                $("#" + tempselectedImmunizations[i]._id.trim()).prop('checked', true);
            }

        });

    $scope.TempmanageImmunization = function(status, object) {

        var f = false;
        if (status) {

            tempselectedImmunizations.push(object);

            if ((tempselectedImmunizations).length == $scope.UserImmunizations.length) {
                $("#ckImmunization").prop('checked', true);
            }

        } else {
            $("#ckImmunization").prop('checked', false);
            tempselectedImmunizations.splice(tempselectedImmunizations.indexOf(object), 1);

        }


    };

    // select all the checkboxes at one time    
    $scope.checkAllImmunization = function(status, UserImmunizations) {
        tempselectedImmunizations = [];
        if (status == false) {
            $(".ckImm").prop('checked', false);
            for (var i = 0; i < (UserImmunizations).length; i++) {

                tempselectedImmunizations.splice(tempselectedImmunizations.indexOf(UserImmunizations), 1);


            }
        } else {
            $(".ckImm").prop('checked', true);

            for (var i = 0; i < (UserImmunizations).length; i++) {
                tempselectedImmunizations.push(UserImmunizations[i]);
            }
        }

    };


    $scope.manageImmunization = function(status, object) {

        var f = false;
        if (status) {

            for (var i = 0; i < ($scope.shared.Immunization).length; i++) {

                if ($scope.shared.Immunization[i].Immunization.ImmunizationName == object.Immunization.ImmunizationName &&
                    $scope.shared.Immunization[i].CreatedDate == object.CreatedDate)
                    var f = true;

            }
            if (!f)

                selectedImmunizations.push(object);
            // else Notification.error("<strong>Immunization Not Added</strong>! You have already added this selected immunization.");
            if (($scope.UserImmunizations).length == 0) $scope.emptyImmunizationList = true;




        } else {
            $("#ckImmunization").prop('checked', false);


        }


        if ((tempselectedImmunizations).length == $scope.UserImmunizations.length) {
            $("#ckImmunization").prop('checked', true);
        }

    };
    $scope.deleteImmunization = function(obj) {

        selectedImmunizations.splice(selectedImmunizations.indexOf(obj), 1);
        ($scope.UserImmunizations).push(obj);
        if (($scope.UserImmunizations).length > 0) $scope.emptyImmunizationList = false;
        $scope.shared.Immunization = selectedImmunizations;
        $scope.ImmunizationCount = selectedImmunizations.length;

    };

    $scope.submitImmunization = function() {
        var Immunizationslst = new Array();

        for (var i = 0; i < (tempselectedImmunizations).length; i++) {
            $scope.manageImmunization(true, tempselectedImmunizations[i]);
            Immunizationslst.push(tempselectedImmunizations[i]);

        }
        selectedImmunizations = Immunizationslst;
        $scope.shared.Immunization = selectedImmunizations;
        $scope.ImmunizationCount = ($scope.shared.Immunization).length;
        $("#immunizationtab").click();
        $scope.TabColor("2");
        $("#immunizationModal").modal('hide');

    };

    $scope.CancelImmunization = function() {

        var array3 = $scope.shared.Immunization.filter(function(obj) { return tempselectedImmunizations.indexOf(obj) == -1; });

        for (var i = 0; i < (array3).length; i++) {
            tempselectedImmunizations.push(array3[i]);
        }

        var array4 = tempselectedImmunizations.filter(function(obj) { return $scope.shared.Immunization.indexOf(obj) == -1; });

        for (var j = 0; j < (array4).length; j++) {
            tempselectedImmunizations.splice(tempselectedImmunizations.indexOf(array4[j]), 1);

        }
    };

    // Problem Functions
    $scope.selectProblem = function() {
        $("#ckProblem").prop('checked', false);
        if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
            Condition.filter($scope.u_id, $scope.dateData).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserConditions = data.data.message.Info;
                    $scope.enableProblem = true;
                } else {
                    $scope.UserConditions = [];
                    $scope.emptyList = true;
                    $scope.enableProblem = false;
                }
            });
        else
            Condition.fetch($scope.u_id).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserConditions = data.data.message.Info;
                    $scope.enableProblem = true;
                } else {
                    $scope.UserConditions = [];
                    $scope.emptyList = true;
                    $scope.enableProblem = false;
                }
            });
        if (($scope.UserConditions).length == 0) $scope.emptyConditionList = true;
        else $scope.emptyConditionList = false;
        $("#conditionModal").modal('show');
    };
    if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
        Condition.filter($scope.u_id, $scope.dateData).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserConditions = data.data.message.Info;
                $scope.enableProblem = true;
            } else {
                $scope.UserConditions = [];
                $scope.emptyList = true;
                $scope.enableProblem = false;
            }
        });
    else
        Condition.fetch($scope.u_id).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserConditions = data.data.message.Info;
                $scope.enableProblem = true;
            } else {
                $scope.UserConditions = [];
                $scope.emptyList = true;
                $scope.enableProblem = false;
            }
        });
    $scope.manageProblem = function(status, object) {
        var f = false;
        if (status) {
            for (var i = 0; i < ($scope.shared.Condition).length; i++) {
                if ($scope.shared.Condition[i].Condition.HealthCondition == object.Condition.HealthCondition &&
                    $scope.shared.Condition[i].CreatedDate == object.CreatedDate) var f = true;
            }
            if (!f)
                selectedConditions.push(object);
            // else Notification.error("<strong>Condition Not Added</strong>! You have already added this selected condition.");
            if (($scope.UserConditions).length == 0) $scope.emptyConditionList = true;
        } else {
            selectedConditions.splice(selectedConditions.indexOf(object), 1);
        }
        $scope.ConditionCount = selectedConditions.length;
    };

    $scope.TempmanageProblem = function(status, object) {

        var f = false;
        if (status) {
            tempselectedProblems.push(object);

            if ((tempselectedProblems).length == $scope.UserConditions.length) {
                $("#ckProblem").prop('checked', true);
            }

        } else {
            $("#ckProblem").prop('checked', false);
            tempselectedProblems.splice(selectedConditions.indexOf(object), 1);

        }


    };

    // select all the checkboxes at one time    
    $scope.checkAllProblem = function(status, UserConditions) {
        tempselectedProblems = [];

        if (status == false) {
            $(".ckProb").prop('checked', false);
            for (var i = 0; i < (UserConditions).length; i++) {

                tempselectedProblems.splice(selectedConditions.indexOf(UserConditions), 1);

            }
        } else {
            $(".ckProb").prop('checked', true);
            for (var i = 0; i < (UserConditions).length; i++) {
                tempselectedProblems.push(UserConditions[i]);
            }
        }

    }
    $scope.deleteProblem = function(obj) {
        selectedConditions.splice(selectedConditions.indexOf(obj), 1);
        ($scope.UserConditions).push(obj);
        if (($scope.UserConditions).length > 0) $scope.emptyConditionList = false;
        $scope.shared.Condition = selectedConditions;
        $scope.ConditionCount = selectedConditions.length;
    };
    $scope.submitProblem = function() {
        var Problemlst = new Array();
        for (var i = 0; i < (tempselectedProblems).length; i++) {
            $scope.manageProblem(true, tempselectedProblems[i]);
            Problemlst.push(tempselectedProblems[i]);
        }
        selectedConditions = Problemlst;
        $scope.shared.Condition = selectedConditions;
        $scope.ConditionCount = ($scope.shared.Condition).length;
        $("#problemtab").click();
        $scope.TabColor("3");

        $("#conditionModal").modal('hide');
    };


    $scope.CancelProblem = function() {

        var array3 = $scope.shared.Condition.filter(function(obj) { return tempselectedProblems.indexOf(obj) == -1; });

        for (var i = 0; i < (array3).length; i++) {
            tempselectedProblems.push(array3[i]);
        }

        var array4 = tempselectedProblems.filter(function(obj) { return $scope.shared.Condition.indexOf(obj) == -1; });

        for (var j = 0; j < (array4).length; j++) {
            tempselectedProblems.splice(tempselectedProblems.indexOf(array4[j]), 1);

        }
    };

    $('#conditionModal')
        .on('shown.bs.modal', function() {

            for (var i = 0; i < (tempselectedProblems).length; i++) {
                $("#" + tempselectedProblems[i]._id.trim()).prop('checked', true);
            }

        });




    // Lab Functions
    $scope.selectLab = function() {
        $("#ckLabTest").prop('checked', false);
        if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
            Lab.filter($scope.u_id, $scope.dateData).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserLabs = data.data.message.Info;
                    $scope.enableLab = true;
                } else {
                    $scope.UserLabs = [];
                    $scope.emptyList = true;
                    $scope.enableLab = false;
                }
            });
        else
            Lab.fetch($scope.u_id).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserLabs = data.data.message.Info;
                    $scope.enableLab = true;
                } else {
                    $scope.UserLabs = [];
                    $scope.emptyList = true;
                    $scope.enableLab = false;
                }
            });
        if (($scope.UserLabs).length == 0) $scope.emptyLabList = true;
        else $scope.emptyLabList = false;
        $("#labModal").modal('show');
    };
    if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
        Lab.filter($scope.u_id, $scope.dateData).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserLabs = data.data.message.Info;
                $scope.enableLab = true;
            } else {
                $scope.UserLabs = [];
                $scope.emptyList = true;
                $scope.enableLab = false;
            }
        });
    else
        Lab.fetch($scope.u_id).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserLabs = data.data.message.Info;
                $scope.enableLab = true;
            } else {
                $scope.UserLabs = [];
                $scope.emptyList = true;
                $scope.enableLab = false;
            }
        });
    $scope.manageLab = function(status, object) {
        var f = false;
        if (status) {
            for (var i = 0; i < ($scope.shared.Lab).length; i++) {
                if ($scope.shared.Lab[i].Lab.TestName == object.Lab.TestName &&
                    $scope.shared.Lab[i].CreatedDate == object.CreatedDate) var f = true;
            }
            if (!f)
                selectedLabs.push(object);
            // else Notification.error("<strong>Lab Not Added</strong>! You have already added this selected lab.");
            if (($scope.UserLabs).length == 0) $scope.emptyLabList = true;
        } else {
            selectedLabs.splice(selectedLabs.indexOf(object), 1);
        }
        $scope.LabCount = selectedLabs.length;
    };

    $scope.TempmanageLab = function(status, object) {

        var f = false;
        if (status) {
            tempselectedLabs.push(object);

            if ((tempselectedLabs).length == $scope.UserLabs.length) {
                $("#ckLabTest").prop('checked', true);
            }

        } else {
            $("#ckLabTest").prop('checked', false);
            tempselectedLabs.splice(selectedLabs.indexOf(object), 1);

        }


    };

    // select all the checkboxes at one time    
    $scope.checkAllLabTests = function(status, UserLabs) {
        tempselectedLabs = [];
        if (status == false) {
            $(".ckLab").prop('checked', false);
            for (var i = 0; i < (UserLabs).length; i++) {

                tempselectedLabs.splice(selectedLabs.indexOf(UserLabs), 1);

            }
        } else {
            $(".ckLab").prop('checked', true);

            for (var i = 0; i < (UserLabs).length; i++) {
                tempselectedLabs.push(UserLabs[i]);
            }
        }

    }

    $scope.deleteLab = function(obj) {
        selectedLabs.splice(selectedLabs.indexOf(obj), 1);
        ($scope.UserLabs).push(obj);
        if (($scope.UserLabs).length > 0) $scope.emptyLabList = false;
        $scope.shared.Lab = selectedLabs;
        $scope.LabCount = selectedLabs.length;
    };
    $scope.submitLab = function() {
        var Lablst = new Array();
        for (var i = 0; i < (tempselectedLabs).length; i++) {
            $scope.manageLab(true, tempselectedLabs[i]);
            Lablst.push(tempselectedLabs[i]);
        }
        selectedLabs = Lablst;
        $scope.shared.Lab = selectedLabs;
        $scope.LabCount = ($scope.shared.Lab).length;
        $("#labtab").click();
        $scope.TabColor("4");
        $("#labModal").modal('hide');
    };

    $scope.CancelLab = function() {

        var array3 = $scope.shared.Lab.filter(function(obj) { return tempselectedLabs.indexOf(obj) == -1; });

        for (var i = 0; i < (array3).length; i++) {
            tempselectedLabs.push(array3[i]);
        }

        var array4 = tempselectedLabs.filter(function(obj) { return $scope.shared.Lab.indexOf(obj) == -1; });

        for (var j = 0; j < (array4).length; j++) {
            tempselectedLabs.splice(tempselectedLabs.indexOf(array4[j]), 1);

        }
    };


    $('#labModal')
        .on('shown.bs.modal', function() {

            for (var i = 0; i < (tempselectedLabs).length; i++) {
                $("#" + tempselectedLabs[i]._id.trim()).prop('checked', true);
            }

        });


    // Procedure Functions tempselectedProcedures
    $scope.selectProcedure = function() {
        $("#ckProcedure").prop('checked', false);
        if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
            Procedure.filter($scope.u_id, $scope.dateData).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserProcedures = data.data.message.Info;
                    $scope.enableProcedure = true;
                } else {
                    $scope.UserProcedures = [];
                    $scope.emptyList = true;
                    $scope.enableProcedure = false;
                }
            });
        else
            Procedure.fetch($scope.u_id).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserProcedures = data.data.message.Info;
                    $scope.enableProcedure = true;
                } else {
                    $scope.UserProcedures = [];
                    $scope.emptyList = true;
                    $scope.enableProcedure = false;
                }
            });
        if (($scope.UserProcedures).length == 0) $scope.emptyProcedureList = true;
        else $scope.emptyProcedureList = false;
        $("#procedureModal").modal('show');
    };
    if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
        Procedure.filter($scope.u_id, $scope.dateData).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserProcedures = data.data.message.Info;
                $scope.enableProcedure = true;
            } else {
                $scope.UserProcedures = [];
                $scope.emptyList = true;
                $scope.enableProcedure = false;
            }
        });
    else
        Procedure.fetch($scope.u_id).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserProcedures = data.data.message.Info;
                $scope.enableProcedure = true;
            } else {
                $scope.UserProcedures = [];
                $scope.emptyList = true;
                $scope.enableProcedure = false;
            }
        });
    $scope.manageProcedure = function(status, object) {
        var f = false;
        if (status) {
            for (var i = 0; i < ($scope.shared.Procedure).length; i++) {
                if ($scope.shared.Procedure[i].Procedure.ProcedureName == object.Procedure.ProcedureName &&
                    $scope.shared.Procedure[i].CreatedDate == object.CreatedDate) var f = true;
            }
            if (!f)
                selectedProcedures.push(object);
            //else Notification.error("<strong>Procedure Not Added</strong>! You have already added this selected procedure.");
            if (($scope.UserProcedures).length == 0) $scope.emptyProcedureList = true;
        } else {
            selectedProcedures.splice(selectedProcedures.indexOf(object), 1);
        }
        $scope.ProcedureCount = selectedProcedures.length;
    };

    $scope.TempmanageProcedure = function(status, object) {

        var f = false;
        if (status) {
            tempselectedProcedures.push(object);

            if ((tempselectedProcedures).length == $scope.UserProcedures.length) {
                $("#ckProcedure").prop('checked', true);
            }

        } else {
            $("#ckProcedure").prop('checked', false);
            tempselectedProcedures.splice(selectedProcedures.indexOf(object), 1);

        }


    };

    // select all the checkboxes at one time    
    $scope.checkAllProcedures = function(status, UserProcedures) {
        tempselectedProcedures = [];
        if (status == false) {
            $(".ckProc").prop('checked', false);
            for (var i = 0; i < (UserProcedures).length; i++) {

                tempselectedProcedures.splice(selectedProcedures.indexOf(UserProcedures), 1);

            }
        } else {
            $(".ckProc").prop('checked', true);

            for (var i = 0; i < (UserProcedures).length; i++) {
                tempselectedProcedures.push(UserProcedures[i]);
            }
        }

    }

    $scope.deleteProcedure = function(obj) {
        selectedProcedures.splice(selectedProcedures.indexOf(obj), 1);
        ($scope.UserProcedures).push(obj);
        if (($scope.UserProcedures).length > 0) $scope.emptyProcedureList = false;
        $scope.shared.Procedure = selectedProcedures;
        $scope.ProcedureCount = selectedProcedures.length;
    };
    $scope.submitProcedure = function() {
        var Procedurelst = new Array();
        for (var i = 0; i < (tempselectedProcedures).length; i++) {
            $scope.manageProcedure(true, tempselectedProcedures[i]);
            Procedurelst.push(tempselectedProcedures[i]);
        }
        selectedProcedures = Procedurelst;
        $scope.shared.Procedure = selectedProcedures;
        $scope.ProcedureCount = ($scope.shared.Procedure).length;
        $("#proceduretab").click();
        $scope.TabColor("5");
        $("#procedureModal").modal('hide');
    };

    $scope.CancelProcedure = function() {

        var array3 = $scope.shared.Procedure.filter(function(obj) { return tempselectedProcedures.indexOf(obj) == -1; });

        for (var i = 0; i < (array3).length; i++) {
            tempselectedProcedures.push(array3[i]);
        }

        var array4 = tempselectedProcedures.filter(function(obj) { return $scope.shared.Procedure.indexOf(obj) == -1; });

        for (var j = 0; j < (array4).length; j++) {
            tempselectedProcedures.splice(tempselectedProcedures.indexOf(array4[j]), 1);

        }
    };


    $('#procedureModal')
        .on('shown.bs.modal', function() {

            for (var i = 0; i < (tempselectedProcedures).length; i++) {
                $("#" + tempselectedProcedures[i]._id.trim()).prop('checked', true);
            }

        });


    // Medicine Functions
    $scope.selectMedicine = function() {
        $("#ckMedicine").prop('checked', false);
        if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
            Medication.filter($scope.u_id, $scope.dateData).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserMedications = data.data.message.Info;
                    $scope.enableMedicine = true;
                } else {
                    $scope.UserMedications = [];
                    $scope.emptyList = true;
                    $scope.enableMedicine = false;
                }
            });
        else
            Medication.fetch($scope.u_id).then(function(data) {
                if (typeof(data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserMedications = data.data.message.Info;
                    $scope.enableMedicine = true;
                } else {
                    $scope.UserMedications = [];
                    $scope.emptyList = true;
                    $scope.enableMedicine = false;
                }
            });
        if (($scope.UserMedications).length == 0) $scope.emptyMedicineList = true;
        else $scope.emptyMedicineList = false;
        $("#medicineModal").modal('show');
    };
    if (typeof($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
        Medication.filter($scope.u_id, $scope.dateData).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserMedications = data.data.message.Info;
                $scope.enableMedicine = true;
            } else {
                $scope.UserMedications = [];
                $scope.emptyList = true;
                $scope.enableMedicine = false;
            }
        });
    else
        Medication.fetch($scope.u_id).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserMedications = data.data.message.Info;
                $scope.enableMedicine = true;
            } else {
                $scope.UserMedications = [];
                $scope.emptyList = true;
                $scope.enableMedicine = false;
            }
        });
    $scope.manageMedicine = function(status, object) {
        var f = false;
        if (status) {
            for (var i = 0; i < ($scope.shared.Medication).length; i++) {
                if ($scope.shared.Medication[i].Medicine.MedicineName == object.Medicine.MedicineName &&
                    $scope.shared.Medication[i].CreatedDate == object.CreatedDate) var f = true;
            }
            if (!f)
                selectedMedicines.push(object);
            //   else Notification.error("<strong>Medicine Not Added</strong>! You have already added this selected medicine.");
            if (($scope.UserMedications).length == 0) $scope.emptyMedicineList = true;
        } else {
            selectedMedicines.splice(selectedMedicines.indexOf(object), 1);
        }
        $scope.MedicineCount = selectedMedicines.length;
    };

    $scope.TempmanageMedicine = function(status, object) {

        var f = false;
        if (status) {
            tempselectedMedicines.push(object);

            if ((tempselectedMedicines).length == $scope.UserMedications.length) {
                $("#ckMedicine").prop('checked', true);
            }

        } else {
            $("#ckMedicine").prop('checked', false);
            tempselectedMedicines.splice(selectedMedicines.indexOf(object), 1);

        }


    };

    // select all the checkboxes at one time    
    $scope.checkAllMedicine = function(status, UserMedications) {
        tempselectedMedicines = [];
        if (status == false) {
            $(".ckMed").prop('checked', false);
            for (var i = 0; i < (UserMedications).length; i++) {

                tempselectedMedicines.splice(selectedMedicines.indexOf(UserMedications), 1);

            }
        } else {
            $(".ckMed").prop('checked', true);

            for (var i = 0; i < (UserMedications).length; i++) {
                tempselectedMedicines.push(UserMedications[i]);
            }
        }

    }

    $scope.deleteMedicine = function(obj) {
        selectedMedicines.splice(selectedMedicines.indexOf(obj), 1);
        ($scope.UserMedications).push(obj);
        if (($scope.UserMedications).length > 0) $scope.emptyMedicineList = false;
        $scope.shared.Medication = selectedMedicines;
        $scope.MedicineCount = selectedMedicines.length;
    };
    $scope.submitMedicine = function() {
        var Medicinelst = new Array();
        for (var i = 0; i < (tempselectedMedicines).length; i++) {
            $scope.manageMedicine(true, tempselectedMedicines[i]);
            Medicinelst.push(tempselectedMedicines[i]);
        }
        selectedMedicines = Medicinelst;
        $scope.shared.Medication = selectedMedicines;
        $scope.MedicineCount = ($scope.shared.Medication).length;
        $("#medicinetab").click();
        $scope.TabColor("6");
        $("#medicineModal").modal('hide');
    };


    $scope.CancelMedicine = function() {

        var array3 = $scope.shared.Medication.filter(function(obj) { return tempselectedMedicines.indexOf(obj) == -1; });

        for (var i = 0; i < (array3).length; i++) {
            tempselectedMedicines.push(array3[i]);
        }

        var array4 = tempselectedMedicines.filter(function(obj) { return $scope.shared.Medication.indexOf(obj) == -1; });

        for (var j = 0; j < (array4).length; j++) {
            tempselectedMedicines.splice(tempselectedMedicines.indexOf(array4[j]), 1);

        }
    };

    $('#medicineModal')
        .on('shown.bs.modal', function() {

            for (var i = 0; i < (tempselectedMedicines).length; i++) {
                $("#" + tempselectedMedicines[i]._id.trim()).prop('checked', true);
            }

        });

})

.controller('historyCtrl', function($rootScope, $scope, Share) {
    Share.history($scope.u_id).then(function(data) {
        $scope.shareList = data.data.message;
    });
    $scope.viewData = function(id) {
        Share.fetch(id).then(function(data) {
            //      console.log(data.data.message);
            $scope.shareData = data.data.message;
            if (typeof($scope.shareData.Allergy) !== 'undefined' && ($scope.shareData.Allergy).length > 0)
                $scope.AllergyFlag = true;
            if (typeof($scope.shareData.Immunization) !== 'undefined' && ($scope.shareData.Immunization).length > 0)
                $scope.ImmunizationFlag = true;
            if (typeof($scope.shareData.Lab) !== 'undefined' && ($scope.shareData.Lab).length > 0)
                $scope.LabFlag = true;
            if (typeof($scope.shareData.Condition) !== 'undefined' && ($scope.shareData.Condition).length > 0)
                $scope.conditionFlag = true;
            if (typeof($scope.shareData.Procedure) !== 'undefined' && ($scope.shareData.Procedure).length > 0)
                $scope.procedureFlag = true;
            if (typeof($scope.shareData.Medication) !== 'undefined' && ($scope.shareData.Medication).length > 0)
                $scope.medicineFlag = true;
            $("#shareModal").modal("show");
        });
    };
});