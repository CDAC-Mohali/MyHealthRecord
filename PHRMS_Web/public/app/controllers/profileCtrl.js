angular.module('profileController', ['userServices', 'authServices'])

    .controller('profileCtrl', function ($rootScope, $scope, User, Auth, Lightbox) {

        User.getStateListing().then(function (data) {
            $scope.StateListing = data.data.message;
        });

        // Populate Data 
        User.fetch($scope.u_id).then(function (data) {
            $scope.userData = data.data.message;
        });


        // $scope.openLightboxModal = function (Index) {
        //     Lightbox.openModal($scope.images, Index);
        // };

        $scope.uploadImage = function (files) {
            var ext = files[0].name.match(/\.(.+)$/)[1];

            if (angular.lowercase(ext) === 'jpg' || angular.lowercase(ext) === 'jpeg' || angular.lowercase(ext) === 'png' || angular.lowercase(ext) === 'pdf' || angular.lowercase(ext) === 'docx') {


                if (files[0].size > 2000000) {

                    $scope.ErrorMsg = 'File size must be less than 2 MB!'
                    angular.element("input[type='file']").val(null);
                    $scope.SuccessMsg = false;
                    $("#fileName").html("");

                } else {

                    $("#fileName").html("<strong>Selected File: </strong>" + files[0].name);
                    $scope.ErrorMsg = false;
                }
            } else {
                $scope.ErrorMsg = "Only JPG, PNG ,PDF , DOC and GIF files are allowed!";
                angular.element("input[type='file']").val(null);
                $scope.SuccessMsg = false;
                $("#fileName").html("");

            }



        }




        // Initialize UX Elements
        $scope.personalDisable = true;
        $scope.emergencyDisable = true;
        $scope.employerDisable = true;
        $scope.inusranceDisable = true;
        $scope.hospitalDisable = true;
        $scope.SuccessMsg = false;
        $scope.ErrorMsg = false;
        $scope.Loading = false;

        $scope.personalsave = true;
        $scope.personaledit = false;
        $scope.personalcancel = false;
        $scope.emergencysave = true;
        $scope.emergencyedit = false;
        $scope.emergencycancel = false;
        $scope.employersave = true;
        $scope.employeredit = false;
        $scope.employercancel = false;
        $scope.inusrancesave = true;
        $scope.inusranceedit = false;
        $scope.inusrancecancel = false;
        $scope.hospitalsave = true;
        $scope.hospitaledit = false;
        $scope.hospitalcancel = false;
        $scope.TempFilename = "";
        $scope.disabilitydiv = false;
        $scope.ShowPdfFile = false;
     

        $('#datapicker2').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
        $('#datapicker3').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });

        // Category Edit Unlock Functions 
        $scope.editPersonal = function () {
            $scope.personalDisable = false;
            $scope.editable = true;
            $scope.personalsave = false;
            $scope.personaledit = true;
            $scope.personalcancel = true;
            // console.log("Sumandeep Singh");
            //console.log($scope.userData.personal.address.state.Id);
            $("#selectprofilestate").val($scope.userData.personal.address.state.Id);
        };


        $scope.chkmessage = function ($event) {
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.Loading = false;


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

        $scope.setdisability = function () {
            if ($scope.userData.personal.disability == true) {
                $scope.userData.personal.disabilitytype = "0";


            }
        }

        $scope.editEmergency = function () {
            $scope.emergencyDisable = false;
            $scope.editable = true;
            $scope.emergencysave = false;
            $scope.emergencyedit = true;
            $scope.emergencycancel = true;
            $("#selectemergencystate").val($scope.userData.emergency.address.state.Id);

        };
        $scope.editEmployer = function () {
            $scope.employerDisable = false;
            $scope.editable = true;
            $scope.employersave = false;
            $scope.employeredit = true;
            $scope.employercancel = true;
        };
        $scope.editInusrance = function () {
            $scope.inusranceDisable = false;
            $scope.inusrancesave = false;
            $scope.inusranceedit = true;
            $scope.inusrancecancel = true;
        };
        $scope.editHospital = function () {
            $scope.hospitalDisable = false;
            $scope.hospitalsave = false;
            $scope.hospitaledit = true;
            $scope.hospitalcancel = true;

        };




        // Category cancel Unlock Functions 
        $scope.cancelPersonal = function () {
            $scope.personalDisable = true;
            $scope.editable = false;
            $scope.personalsave = true;
            $scope.personaledit = false;
            $scope.personalcancel = false;
        };
        $scope.cancelEmergency = function () {
            $scope.emergencyDisable = true;
            $scope.editable = false;
            $scope.emergencysave = true;
            $scope.emergencyedit = false;
            $scope.emergencycancel = false;
        };
        $scope.cancelEmployer = function () {
            $scope.employerDisable = true;
            $scope.editable = false;
            $scope.employersave = true;
            $scope.employeredit = false;
            $scope.employercancel = false;
        };
        $scope.cancelInusrance = function () {
            $scope.inusranceDisable = true;
            $scope.inusrancesave = true;
            $scope.inusranceedit = false;
            $scope.inusrancecancel = false;
        };
        $scope.cancelHospital = function () {
            $scope.hospitalDisable = true;
            $scope.hospitalsave = true;
            $scope.hospitaledit = false;
            $scope.hospitalcancel = false;

        };

        $scope.setFile = function (element) {
            $scope.$apply(function ($scope) {
                $scope.theFile = element.files[0];
            });
        };


        // User Update Function
        $scope.updateUser = function (Step) {
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.Loading = true;
            if ($scope.userData.personal.disability == false) {
                $scope.userData.personal.disabilitytype = "";
                $scope.userData.personal.disabilityimage = "";
            }

            $scope.personalDisable = true;
            $scope.employerDisable = true;
            $scope.emergencyDisable = true;
            $scope.inusranceDisable = true;
            $scope.hospitalDisable = true;


            //Personal Information
            if (Step == "S1") {

                if ($scope.userData.personal.aadhar != undefined) {

                    if ($scope.userData.personal.aadhar.length < 12 && $scope.userData.personal.aadhar != "") {
                        $scope.ErrorMsg = "Please fill valid Aadhar Number";
                        $scope.Loading = false;
                        $scope.personalDisable = false;
                        return false;
                    }
                }
               
                if ($scope.userData.personal.address.pin != undefined) {

                    if ($scope.userData.personal.address.pin.length < 6 && $scope.userData.personal.address.pin != "") {
                        $scope.ErrorMsg = "Please fill valid Pin Number";
                        $scope.Loading = false;
                        $scope.personalDisable = false;
                        return false;
                    }
                }



                User.updatePersonalUser($scope.u_id, $scope.userData.personal).then(function (data) {

                    if (data.data.success) {



                        $rootScope.u_name = data.data.data.personal.name.first + " " + data.data.data.personal.name.last;
                        $scope.SuccessMsg = data.data.message;
                        $scope.personalsave = true;
                        $scope.personaledit = false;
                        $scope.personalcancel = false;

                        $("#fileName").html("");
                        User.GetDisabilityimage($scope.u_id).then(function (Imagedata) {

                            if (Imagedata.data.success) {
                                $scope.userData.personal.disabilityimage = Imagedata.data.message;
                            }

                        });




                    } else {
                        $scope.ErrorMsg = data.data.message;
                        $scope.personalDisable = false;
                    }
                });

                //Emergency Information
            } else if (Step == "S2") {

                if ($scope.userData.emergency.address.pin != undefined) {

                    if ($scope.userData.emergency.address.pin.length < 6 && $scope.userData.emergency.address.pin != "") {
                        $scope.ErrorMsg = "Please fill valid Pin code";
                        $scope.Loading = false;
                        $scope.emergencyDisable = false;
                        return false;
                    }
                }


                if ($scope.userData.emergency.mobile.primary != undefined) {

                    if ($scope.userData.emergency.mobile.primary.length < 6 && $scope.userData.emergency.mobile.primary != "") {
                        $scope.ErrorMsg = "Please fill valid Primary Number";
                        $scope.Loading = false;
                        $scope.emergencyDisable = false;
                        return false;
                    }
                }

                if ($scope.userData.emergency.mobile.secondary != undefined) {

                    if ($scope.userData.emergency.mobile.secondary.length < 6 && $scope.userData.emergency.mobile.secondary != "") {
                        $scope.ErrorMsg = "Please fill valid secondary Number";
                        $scope.Loading = false;
                        $scope.emergencyDisable = false;
                        return false;
                    }
                }


                User.updateEmergencyUser($scope.u_id, $scope.userData.emergency).then(function (data) {
                    if (data.data.success) {
                        $scope.SuccessMsg = data.data.message;
                        $scope.emergencysave = true;
                        $scope.emergencyedit = false;
                        $scope.emergencycancel = false;
                    } else {
                        $scope.ErrorMsg = data.data.message;
                        $scope.emergencyDisable = false;
                    }
                });
                //Employer Information
            } else if (Step == "S3") {


                if ($scope.userData.employer.mobile != undefined) {

                    if ($scope.userData.employer.mobile.length < 10 && $scope.userData.employer.mobile != "") {
                        $scope.ErrorMsg = "Please fill valid Mobile Number";
                        $scope.Loading = false;
                        $scope.employerDisable = false;
                        return false;
                    }
                }

                if ($scope.userData.employer.address.pin != undefined) {

                    if ($scope.userData.employer.address.pin.length < 6 && $scope.userData.employer.address.pin != "") {
                        $scope.ErrorMsg = "Please fill valid Pin Number";
                        $scope.Loading = false;
                        $scope.employerDisable = false;
                        return false;
                    }
                }
                User.updateEmpInfo($scope.u_id, $scope.userData.employer).then(function (data) {
                    if (data.data.success) {
                        $scope.SuccessMsg = data.data.message;
                    } else {
                        $scope.ErrorMsg = data.data.message;
                        $scope.employerDisable = false;
                    }
                });
                $scope.employersave = true;
                $scope.employeredit = false;
                $scope.employercancel = false;

                //Insurance Information
            } else if (Step == "S4") {

                User.updateInsInfo($scope.u_id, $scope.userData.insurance).then(function (data) {
                    if (data.data.success) {

                        $scope.SuccessMsg = data.data.message;
                    } else {
                        $scope.ErrorMsg = data.data.message;
                    }
                });

                $scope.inusrancesave = true;
                $scope.inusranceedit = false;
                $scope.inusrancecancel = false;

                //Hospital Preference
            } else if (Step == "S5") {

                User.updateHospitalInfo($scope.u_id, $scope.userData.hospital_preferance).then(function (data) {
                    if (data.data.success) {
                        $scope.SuccessMsg = data.data.message;
                    } else {
                        $scope.ErrorMsg = data.data.message;
                    }
                });

                $scope.hospitalsave = true;
                $scope.hospitaledit = false;
                $scope.hospitalcancel = false;

            }

            $scope.theFile = angular.copy($scope.default);

            $scope.Loading = false;
            $scope.$applyAsync();
        };

        // Function to Update Password
        $scope.updatePassword = function () {
            $scope.PassSuccess = false;
            $scope.PassFail = false;

            if (passwordvalid1 == true || passwordvalid2 == false || passwordvalid3 == false || passwordvalid4 == false) {

                $scope.PassFail = "Password must meet all requirments";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;
            }

            if ($scope.passData.opassword == $scope.passData.password) {
                $scope.PassFail = "Old Password and New Password cannot be same. !";
                return false;
            }

           


            if ($scope.passData.password == $scope.cpassword) {


                Auth.updatePass($scope.u_id, $scope.passData).then(function (data) {
                    if (data.data.success) {
                        $("#oldpassword").val("");
                        $("#newpassword").val("");
                        $("#confirmpassword").val("");
                        $scope.PassSuccess = data.data.message;
                        $('#length').removeClass('Pvalid').addClass('Pinvalid');
                        $('#letter').removeClass('Pvalid').addClass('Pinvalid');
                        $('#capital').removeClass('Pvalid').addClass('Pinvalid');
                        $('#number').removeClass('Pvalid').addClass('Pinvalid');
                    } else
                        $scope.PassFail = data.data.message;
                });
            } else {
                $scope.PassFail = "The password and confirmation password do not match.!";
            }
        };
    });