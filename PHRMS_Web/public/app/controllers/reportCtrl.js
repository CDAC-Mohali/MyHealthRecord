"use strict";
angular.module('reportControllers', ['shareServices', 'allergyServices', 'immunizationServices', 'conditionServices',
        'labServices', 'procedureServices', 'medicationServices', 'contactsServices', 'notificationServices', 'userServices'
    ])

    .controller('reportCtrl', function ($rootScope, $scope, $http, Share, Allergy, Immunization, Condition,
        Lab, Procedure, Medication, Contacts, PersonalContacts, Notification, User, Activity, BP, BloodGulucose, BMI
    ) {

        // Initialize UX
        $('#datapicker').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true,
            maxDate: new Date()
        });


        $('.input-daterange').datepicker({
            format: 'dd/mm/yyyy',
            endDate: '+0d',
            autoclose: true
        })

        $scope.Allergyenable = false;
        $scope.Immunizationenable = false;
        $scope.Problemenable = false;
        $scope.Labenable = false;
        $scope.Procedureenable = false;
        $scope.Medicationenable = false;
        $scope.Activityenable = false;
        $scope.BloodPressenable = false;
        $scope.BloodGlucenable = false;
        $scope.BMIenable = false;

        $scope.enableAllergy = true;
        $scope.enableImmunization = true;
        $scope.enableProblem = true;
        $scope.enableLab = true;
        $scope.enableProcedure = true;
        $scope.enableMedicine = true;
        $scope.ReportError = "";

        $scope.UserAllergies = [];
        $scope.UserImmunizations = [];
        $scope.UserConditions = [];
        $scope.UserLabs = [];
        $scope.UserProcedures = [];
        $scope.UserMedications = [];
        $scope.UserActivity = [];
        $scope.UserBP = [];
        $scope.UserBG = [];
        $scope.UserBMI = [];
        $scope.printstatus = false;
        $scope.reportstatus = true;

        $scope.shared = {};
        // Populate Data 
        User.fetch($scope.u_id).then(function (data) {
            $scope.shared.Personal = data.data.message.personal;

            $scope.first = $scope.shared.Personal.name.first;
            $scope.last = $scope.shared.Personal.name.last;
            $scope.email = $scope.shared.Personal.email;
            $scope.aadhar = $scope.shared.Personal.aadhar;
            $scope.gender = $scope.shared.Personal.gender;
            $scope.blood = $scope.shared.Personal.blood;
            $scope.address1 = $scope.shared.Personal.address.line1;
            $scope.address2 = $scope.shared.Personal.address.line2;
            $scope.city = $scope.shared.Personal.address.city;
            $scope.district = $scope.shared.Personal.address.district;
            $scope.pin = $scope.shared.Personal.address.pin;
            $scope.dob = $scope.shared.Personal.dob;
            $scope.disability = $scope.shared.Personal.disability;
            $scope.mobile = $scope.shared.Personal.mobile;
            $scope.state = $scope.shared.Personal.address.state.Name;
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


        $scope.$watch('SelectionType', function () {
            if ($scope.SelectionType == 1)
                $scope.DisplayDate = true;
            else {
                $scope.DisplayDate = false;
                delete $scope.dateData;
            }
            if ($scope.SelectionType)
                $scope.DisplayArena = true;

        });



        // Initialize Variables
        var selectedAllergies = new Array();
        var selectedImmunizations = new Array();
        var selectedConditions = new Array();
        var selectedLabs = new Array();
        var selectedProcedures = new Array();
        var selectedMedicines = new Array();
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

        // Allergy Functions
        $scope.selectAllergy = function () {
            $scope.Allergyenable = !$scope.Allergyenable;
        };

        $scope.unselectAllergy = function () {
            $scope.Allergyenable = !$scope.Allergyenable;
        };


        // Immunization Functions
        $scope.selectImmunization = function () {
            $scope.Immunizationenable = !$scope.Immunizationenable;

        };

        $scope.unselectImmunization = function () {
            $scope.Immunizationenable = !$scope.Immunizationenable;
        };

        // Problem Functions
        $scope.selectProblem = function () {
            $scope.Problemenable = !$scope.Problemenable;
        };

        $scope.unselectProblem = function () {
            $scope.Problemenable = !$scope.Problemenable;
        };

        // Lab Functions
        $scope.selectLab = function () {
            $scope.Labenable = !$scope.Labenable;

        };
        $scope.unselectLab = function () {
            $scope.Labenable = !$scope.Labenable;
        }

        // Procedure Functions
        $scope.selectProcedure = function () {
            $scope.Procedureenable = !$scope.Procedureenable;
        };

        $scope.unselectProcedure = function () {
            $scope.Procedureenable = !$scope.Procedureenable;
        };


        // Medicine Functions
        $scope.selectMedicine = function () {
            $scope.Medicationenable = !$scope.Medicationenable;
        };

        // Medicine Functions
        $scope.unselectMedicine = function () {
            $scope.Medicationenable = !$scope.Medicationenable;
        };

        // Activity Functions
        $scope.selectActivity = function () {
            $scope.Activityenable = !$scope.Activityenable;
        };

        // Activity Functions
        $scope.unselectActivity = function () {
            $scope.Activityenable = !$scope.Activityenable;
        };

        // Blood Press Functions
        $scope.selectBloodPress = function () {
            $scope.BloodPressenable = !$scope.BloodPressenable;
        };

        // Blood Presse Functions
        $scope.unselectBloodPress = function () {
            $scope.BloodPressenable = !$scope.BloodPressenable;
        };

        // Blood Press Functions
        $scope.selectBloodGluc = function () {
            $scope.BloodGlucenable = !$scope.BloodGlucenable;
        };

        // Blood Presse Functions
        $scope.unselectBloodGluc = function () {
            $scope.BloodGlucenable = !$scope.BloodGlucenable;
        };

        // BMI Functions
        $scope.selectBMI = function () {
            $scope.BMIenable = !$scope.BMIenable;
        };

        // BMI Functions
        $scope.unselectBMI = function () {
            $scope.BMIenable = !$scope.BMIenable;
        };
        $scope.GetReport = function () {
            window.print();
            //   var HTML = "";
            // $http.get('http://localhost:8080/ReportData').then(function(response) {
            //     HTML = response.data;
            // });
            // HTML = $('html').html();
            // alert(HTML);
            // User.GetReport($scope.u_id, HTML).then(function(data) {
            //     //  alert(data.data.message.Info);
            //     // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
            // });

        };

        $scope.Resetselect = function () {
            $scope.Allergyenable = false;
            $scope.Immunizationenable = false;
            $scope.Problemenable = false;
            $scope.Labenable = false;
            $scope.Procedureenable = false;
            $scope.Medicationenable = false;
            $scope.Activityenable = false;
            $scope.BloodPressenable = false;
            $scope.BloodGlucenable = false;
            $scope.BMIenable = false;

        }
        $scope.ReportType = function (status) {


            if (status == "1") {
                $scope.DisplayDate = true;
                $scope.DisplayArena = true;
                $("#ReportType2").prop("checked", true)
                $scope.Allergyenable = false;
                $scope.Immunizationenable = false;
                $scope.Problemenable = false;
                $scope.Labenable = false;
                $scope.Procedureenable = false;
                $scope.Medicationenable = false;
                $scope.Activityenable = false;
                $scope.BloodPressenable = false;
                $scope.BloodGlucenable = false;
                $scope.BMIenable = false;
            } else {
                $("#ReportType1").prop("checked", true)
                $scope.DisplayArena = true;
                $scope.DisplayDate = false;
                $scope.Allergyenable = false;
                $scope.Immunizationenable = false;
                $scope.Problemenable = false;
                $scope.Labenable = false;
                $scope.Procedureenable = false;
                $scope.Medicationenable = false;
                $scope.Activityenable = false;
                $scope.BloodPressenable = false;
                $scope.BloodGlucenable = false;
                $scope.BMIenable = false;
            }

        }

        $scope.Editreport = function () {
            $scope.printstatus = false;
            $scope.reportstatus = true;
            $('.hide-menu').click();
        }
        $scope.Preview = function () {

            if ($scope.Allergyenable == false && $scope.Immunizationenable == false && $scope.Problemenable == false && $scope.Labenable == false && $scope.Procedureenable == false && $scope.Medicationenable == false && $scope.Activityenable == false && $scope.BloodPressenable == false && $scope.BloodGlucenable == false && $scope.BMIenable == false) {
                $scope.ReportError = "Please at least one Module";
            } else {

                $scope.ReportError = false;

                $scope.printstatus = true;
                $scope.reportstatus = false;
                $('.hide-menu').click();


                ///////////////////////////// Allergy
                if ($scope.Allergyenable == true) {
                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        Allergy.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserAllergies = data.data.message.Info;
                                if (($scope.UserAllergies).length == 0) $scope.emptyAllergiesList = false;
                                else $scope.emptyAllergiesList = true;

                            } else {
                                $scope.UserAllergies = [];
                                $scope.emptyAllergiesList = false;
                            }
                        });
                    else
                        Allergy.fetch($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserAllergies = data.data.message.Info;
                                if (($scope.UserAllergies).length == 0) $scope.emptyAllergiesList = false;
                                else $scope.emptyAllergiesList = true;

                            } else {
                                $scope.UserAllergies = [];
                                $scope.emptyAllergiesList = false;
                            }

                        });



                } else {
                    $scope.UserAllergies = [];
                    $scope.emptyAllergiesList = false;
                }



                //////////////////////
                ///////////////////////////// Immunization
                if ($scope.Immunizationenable == true) {

                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        Immunization.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserImmunizations = data.data.message.Info;
                                if (($scope.UserImmunizations).length == 0) $scope.emptyImmunizationList = false;
                                else $scope.emptyImmunizationList = true;

                            } else {
                                $scope.UserImmunizations = [];
                                $scope.emptyImmunizationList = false;
                            }
                        });
                    else
                        Immunization.fetch($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserImmunizations = data.data.message.Info;
                                if (($scope.UserImmunizations).length == 0) $scope.emptyImmunizationList = false;
                                else $scope.emptyImmunizationList = true;


                            } else {
                                $scope.UserImmunizations = [];
                                $scope.emptyImmunizationList = false;
                            }
                        });

                } else {

                    $scope.UserImmunizations = [];
                    $scope.emptyImmunizationList = false;

                }

                ////////////////////////////////////// end immunization
                /////////////////////////////////////////////Problem

                if ($scope.Problemenable == true) {
                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        Condition.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserConditions = data.data.message.Info;

                                if (($scope.UserConditions).length == 0) $scope.emptyConditionList = false;
                                else $scope.emptyConditionList = true;


                            } else {
                                $scope.UserConditions = [];
                                $scope.emptyConditionList = false;
                            }
                        });
                    else
                        Condition.fetch($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserConditions = data.data.message.Info;

                                if (($scope.UserConditions).length == 0) $scope.emptyConditionList = false;
                                else $scope.emptyConditionList = true;

                            } else {
                                $scope.UserConditions = [];
                                $scope.emptyConditionList = false;
                            }
                        });

                } else {

                    $scope.emptyConditionList = false;
                    $scope.UserConditions = [];

                }
                ///////////////////////////// end problem


                //////////////////////////////////// Lab
                if ($scope.Labenable == true) {

                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        Lab.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserLabs = data.data.message.Info;

                                if (($scope.UserLabs).length == 0) $scope.emptyLabList = false;
                                else $scope.emptyLabList = true;

                            } else {
                                $scope.UserLabs = [];
                                $scope.emptyLabList = false;
                            }
                        });
                    else
                        Lab.fetch($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserLabs = data.data.message.Info;
                                if (($scope.UserLabs).length == 0) $scope.emptyLabList = false;
                                else $scope.emptyLabList = true;

                            } else {
                                $scope.UserLabs = [];
                                $scope.emptyLabList = false;
                            }
                        });

                } else {

                    $scope.emptyLabList = false;
                    $scope.UserLabs = [];

                }
                /////////////////////////////////////////end lab

                ////////////////////////////////////////////Procedur
                if ($scope.Procedureenable == true) {

                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        Procedure.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserProcedures = data.data.message.Info;

                                if (($scope.UserProcedures).length == 0) $scope.emptyProcedureList = false;
                                else $scope.emptyProcedureList = true;

                            } else {
                                $scope.UserProcedures = [];
                                $scope.emptyProcedureList = false;
                            }
                        });
                    else
                        Procedure.fetch($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserProcedures = data.data.message.Info;

                                if (($scope.UserProcedures).length == 0) $scope.emptyProcedureList = false;
                                else $scope.emptyProcedureList = true;

                            } else {
                                $scope.UserProcedures = [];
                                $scope.emptyProcedureList = false;
                            }
                        });


                } else {

                    $scope.emptyProcedureList = false;
                    $scope.UserProcedures = [];

                }
                //////////////////////////////////////////end Procedur

                ////////////////////////////////////////////Medication
                if ($scope.Medicationenable == true) {
                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        Medication.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserMedications = data.data.message.Info;

                                if (($scope.UserMedications).length == 0) $scope.emptyMedicineList = false;
                                else $scope.emptyMedicineList = true;



                            } else {
                                $scope.UserMedications = [];
                                $scope.emptyMedicineList = false;
                            }
                        });
                    else
                        Medication.fetch($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserMedications = data.data.message.Info;

                                if (($scope.UserMedications).length == 0) $scope.emptyMedicineList = false;
                                else $scope.emptyMedicineList = true;


                            } else {
                                $scope.UserMedications = [];
                                $scope.emptyMedicineList = false;
                            }
                        });

                } else {

                    $scope.emptyMedicineList = false;
                    $scope.UserMedications = [];

                }
                ////////////////////////////end Medication

                /////////////////////////Activity

                if ($scope.Activityenable == true) {
                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        Activity.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserActivity = data.data.message.Info;

                                if (($scope.UserActivity).length == 0) $scope.emptyActivityList = false;
                                else $scope.emptyActivityList = true;


                            } else {
                                $scope.UserActivity = [];
                                $scope.emptyActivityList = false;
                            }
                        });
                    else
                        Activity.filterId($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserActivity = data.data.message.Info;
                                if (($scope.UserActivity).length == 0) $scope.emptyActivityList = false;
                                else $scope.emptyActivityList = true;

                            } else {
                                $scope.UserActivity = [];
                                $scope.emptyActivityList = false;
                            }
                        });


                } else {

                    $scope.emptyActivityList = false;
                    $scope.UserActivity = [];

                }



                /////////////////////////BloodPressenable

                if ($scope.BloodPressenable == true) {
                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        BP.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserBP = data.data.message.Info;

                                if (($scope.UserBP).length == 0) $scope.emptyBPList = false;
                                else $scope.emptyBPList = true;


                            } else {
                                $scope.UserBP = [];
                                $scope.emptyBPList = false;
                            }
                        });
                    else
                        BP.filterId($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserBP = data.data.message.Info;

                                if (($scope.UserBP).length == 0) $scope.emptyBPList = false;
                                else $scope.emptyBPList = true;


                            } else {
                                $scope.UserBP = [];
                                $scope.emptyBPList = false;
                            }
                        });


                } else {

                    $scope.emptyBPList = false;
                    $scope.UserBP = [];

                }

                ///////////////////////////////////////                
                /////////////////////////BloodGlucenable

                if ($scope.BloodGlucenable == true) {
                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        BloodGulucose.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserBG = data.data.message.Info;

                                if (($scope.UserBG).length == 0) $scope.emptyBGList = false;
                                else $scope.emptyBGList = true;


                            } else {
                                $scope.UserBG = [];
                                $scope.emptyBGList = false;
                            }
                        });
                    else
                        BloodGulucose.filterId($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserBG = data.data.message.Info;

                                if (($scope.UserBG).length == 0) $scope.emptyBGList = false;
                                else $scope.emptyBGList = true;

                            } else {
                                $scope.UserBG = [];
                                $scope.emptyBGList = false;
                            }
                        });


                } else {

                    $scope.emptyBGList = false;
                    $scope.UserBG = [];

                }

                ///////////////////////////////////////                                
                /////////////////////////BMI

                if ($scope.BMIenable == true) {
                    if (typeof ($scope.dateData) !== 'undefined' && $scope.dateData.From && $scope.dateData.To)
                        BMI.filter($scope.u_id, $scope.dateData).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserBMI = data.data.message.Info;

                                if (($scope.UserBMI).length == 0) $scope.emptyBMIList = false;
                                else $scope.emptyBMIList = true;



                            } else {
                                $scope.UserBMI = [];
                                $scope.emptyBMIList = false;
                            }
                        });
                    else
                        BMI.filterId($scope.u_id).then(function (data) {
                            if (typeof (data.data.message) !== 'undefined') {
                                $scope.UserBMI = data.data.message.Info;

                                if (($scope.UserBMI).length == 0) $scope.emptyBMIList = false;
                                else $scope.emptyBMIList = true;


                            } else {
                                $scope.UserBMI = [];
                                $scope.emptyBMIList = false;
                            }
                        });

                } else {

                    $scope.emptyBMIList = false;
                    $scope.UserBMI = [];

                }

                ///////////////////////////////////////


            }
        }







    })