angular.module('userControllers', ['userServices', 'authServices'])

.controller('regCtrl', function($rootScope, $scope, $window, $timeout, User) {
        $scope.showDisable = true;
        $scope.AddForm1 = true;
        $scope.AddForm2 = false;
        $scope.PageOrder1 = true;
        $scope.PageOrder2 = false;
        $scope.SuccessMsg = false;
        $scope.ErrorMsg = false;
        $scope.Loading = false;
        $scope.RegAadhaarStep1 = true;
        $scope.RegAadhaarStep2 = false;
        $scope.RegAadhaarStep3 = false;
        $scope.txn = "";
        $scope.aadhaarData = {};
        $scope.aadhaarOTPLoader = false;

        $scope.ListLoader = false;
        $scope.SendOTP = function() {
            $scope.ErrorMsg = "";
            if ($scope.AadhaarNumber === undefined) {
                $scope.ErrorMsg = "Please Enter Aadhaar No.";
                $scope.RegAadhaarStep1 = true;
                $scope.RegAadhaarStep2 = false;
                $scope.RegAadhaarStep3 = false;
            } else {
                $scope.aadhaarOTPLoader = true;
                $scope.RegAadhaarStep1 = false;
                User.VerifyAadhaarNumber({
                    'AadhaarNo': $scope.AadhaarNumber
                }).then(function(data) {

                    if (data.data.success) {
                        $scope.txn = data.data.message.txn;
                        $scope.RegAadhaarStep1 = false;
                        $scope.RegAadhaarStep2 = true;
                        $scope.RegAadhaarStep3 = false;
                        $scope.ErrorMsg = false;
                    } else {
                        $scope.ErrorMsg = data.data.message;
                        $scope.RegAadhaarStep1 = true;
                        $scope.RegAadhaarStep2 = false;
                        $scope.RegAadhaarStep3 = false;
                    }
                    $scope.aadhaarOTPLoader = false;
                })
            }

        }

        $scope.VerifyAadhaarOTP = function() {
            $scope.ErrorMsg = "";
            if ($scope.UOTP === undefined) {
                $scope.ErrorMsg2 = "Please Enter OTP.";
                $scope.RegAadhaarStep1 = false;
                $scope.RegAadhaarStep2 = true;
                $scope.RegAadhaarStep3 = false;
            } else {
                $scope.aadhaarOTPLoader = true;
                $scope.RegAadhaarStep2 = false;
                User.checkAadhaarOTP({
                    'OTP': $scope.UOTP,
                    'AadhaarNo': $scope.AadhaarNumber,
                    'txn': $scope.txn
                }).then(function(OTPdata) {

                    if (OTPdata.data.success) {
                        //  $scope.aadhaarData = OTPdata.data.message.uiddata;

                        // $("#strFirstName").val(OTPdata.data.message.uiddata.poi.name);
                        // $("#strEmail").val(OTPdata.data.message.uiddata.poi.email);
                        // $("#strMobile").val(OTPdata.data.message.uiddata.poi.phone);
                        // $("#strAadhaarNo").val(OTPdata.data.message.uiddata.uid);
                        $scope.regData.personal.name = {};
                        $scope.regData.personal.name.first = OTPdata.data.message.uiddata.poi.name;
                        $scope.regData.personal.email = OTPdata.data.message.uiddata.poi.email;
                        $scope.regData.personal.mobile = OTPdata.data.message.uiddata.poi.phone;
                        $scope.regData.personal.aadhar = OTPdata.data.message.uiddata.uid;
                        $scope.regData.personal.gender = OTPdata.data.message.uiddata.poi.gender;
                        $scope.regData.personal.dob = OTPdata.data.message.uiddata.poi.dob.replace("-", "/").replace("-", "/");
                        $scope.regData.personal.address = {};
                        $scope.regData.personal.address.district = OTPdata.data.message.uiddata.poa.dist;
                        $scope.regData.personal.address.city = OTPdata.data.message.uiddata.poa.subdist;
                        $scope.regData.personal.address.pin = OTPdata.data.message.uiddata.poa.pc;
                        $scope.regData.personal.address.line1 = OTPdata.data.message.uiddata.poa.house + " " + OTPdata.data.message.uiddata.poa.street + " " + OTPdata.data.message.uiddata.poa.loc;
                        $scope.regData.personal.address.line2 = OTPdata.data.message.uiddata.poa.po + " " + OTPdata.data.message.uiddata.poa.pc;
                        $("#strState option").each(function() {
                            if ($(this).text() == OTPdata.data.message.uiddata.poa.state) {
                                $(this).attr('selected', 'selected');
                            }
                        });
                        $scope.RegAadhaarStep1 = false;
                        $scope.RegAadhaarStep2 = false;
                        $scope.RegAadhaarStep3 = true;
                        // Auth.loginOTP({ "username": $scope.Mobile }).then(function(data) {
                        //     if (data.data.success) {
                        //         $scope.Loading = false;
                        //         $scope.SuccessMsg = data.data.message;
                        //         $window.location.href = '/dashboard';
                        //     }
                        // });

                    } else {
                        $scope.ErrorMsg2 = OTPdata.data.message;
                        $scope.RegAadhaarStep1 = false;
                        $scope.RegAadhaarStep2 = true;
                        $scope.RegAadhaarStep3 = false;
                    }
                    $scope.aadhaarOTPLoader = false;

                })
            }
        }


        User.getStateListing().then(function(data) {
            $scope.StateListing = data.data.message;
        });

        $scope.Loading = false;
        $scope.FormDisable = false;
        $scope.RegStep1 = true;
        $scope.RegStep2 = false;
        $scope.RegStep3 = false;

        $scope.regaadhaarUser = function() {
            $scope.Loading = true;
            $scope.ErrorMsg = false;
            $scope.FormDisable = true;
            $scope.regData.personal.address.state = {};
            for (count = 0; count < $scope.StateListing.length; count++) {
                if ($("#strState option:selected").html() == $scope.StateListing[count].Name) {
                    $scope.regData.personal.address.state.Id = $scope.StateListing[count].Id;
                    break;
                }
            }



            $scope.regData.personal.address.state.Name = $("#strState option:selected").html();
            if ($scope.regData.personal.email === undefined || $scope.regData.personal.mobile === undefined) {
                $scope.ErrorMsg = "Please fill Email & Mobile No.";
                $scope.Loading = false;
                $scope.FormDisable = false;
                $scope.RegStep1 = true;
                $scope.RegStep2 = false;
                $scope.RegStep3 = false;

            } else if ($scope.regData.personal.password != $scope.confirmPass) {
                $scope.ErrorMsg = "Password Mismatch! Passwords eneterd in both fields do not match!";
                $scope.Loading = false;
                $scope.FormDisable = false;
                $scope.RegStep1 = true;
                $scope.RegStep2 = false;
                $scope.RegStep3 = false;
            } else {
                if ($scope.regData.personal.gender == "M") {
                    $scope.regData.personal.image = "uploads/profile/male.png";
                } else if ($scope.regData.personal.gender == "F") {
                    $scope.regData.personal.image = "uploads/profile/female.png";
                }
                $scope.regData.OTP = "";
                $scope.regData.personal.OTPVerify = false;
                $scope.regData.personal.type = true;
                //        alert(JSON.stringify($scope.regData));
                User.AadhaarRegistration($scope.regData).then(function(data) {
                    if (data.data.success) {
                        $scope.Loading = false;
                        $scope.SuccessMsg = data.data.message;
                        $window.location.href = '/dashboard';

                    } else {
                        $scope.Loading = false;
                        $scope.FormDisable = false;
                        $scope.ErrorMsg = data.data.message;
                        $scope.RegStep1 = true;
                        $scope.RegStep2 = false;
                        $scope.RegStep3 = false;
                    }
                });
            }
        };
        $scope.regUser = function() {
            $scope.Loading = true;
            $scope.ErrorMsg = false;
            $scope.FormDisable = true;



            if ($scope.regData.personal.email === undefined || $scope.regData.personal.mobile === undefined || $scope.regData.personal.email === null || $scope.regData.personal.mobile === null) {
                $scope.ErrorMsg = "Please fill Email & Mobile No.";
                $scope.Loading = false;
                $scope.FormDisable = false;
                $scope.RegStep1 = true;
                $scope.RegStep2 = false;
                $scope.RegStep3 = false;

            } else if (passwordvalid1 == true || passwordvalid2 == false || passwordvalid3 == false || passwordvalid4 == false) {

                $scope.ErrorMsg = "Password must meet all requirements";
                $scope.Loading = false;
                $scope.FormDisable = false;
                $scope.RegStep1 = true;
                $scope.RegStep2 = false;
                $scope.RegStep3 = false;

            } else if ($scope.regData.personal.password != $scope.confirmPass) {
                $scope.ErrorMsg = "Password Mismatch! Passwords entered in both fields do not match!";
                $scope.Loading = false;
                $scope.FormDisable = false;
                $scope.RegStep1 = true;
                $scope.RegStep2 = false;
                $scope.RegStep3 = false;
            } else if ($scope.Approvechk === undefined || $scope.Approvechk == false) {

                $scope.ErrorMsg = "Please approve the form";
                $scope.Loading = false;
                $scope.FormDisable = false;
                $scope.RegStep1 = true;
                $scope.RegStep2 = false;
                $scope.RegStep3 = false;
            } else {
                if ($scope.regData.personal.gender == "M") {
                    $scope.regData.personal.image = "uploads/profile/male.png";
                } else if ($scope.regData.personal.gender == "F") {
                    $scope.regData.personal.image = "uploads/profile/female.png";
                }
                $scope.regData.OTP = "";
                User.create($scope.regData).then(function(data) {
                    if (data.data.success) {
                        $scope.Loading = false;
                        $scope.SuccessMsg = data.data.message;
                        $scope.RegStep1 = false;
                        $scope.RegStep2 = true;
                        $scope.RegStep3 = false;

                    } else {
                        $scope.Loading = false;
                        $scope.FormDisable = false;
                        $scope.ErrorMsg = data.data.message;
                        $scope.RegStep1 = true;
                        $scope.RegStep2 = false;
                        $scope.RegStep3 = false;
                    }
                });
            }
        };


        $scope.VerifyUserOTP = function() {


                if ($scope.UOTP === undefined) {
                    $scope.Loading = false;
                    $scope.FormDisable = false;
                    $scope.ErrorMsg2 = "Please fill OTP";
                    $scope.RegStep1 = false;
                    $scope.RegStep2 = true;
                    $scope.RegStep3 = false;

                } else {

                    User.verifyOTP({
                        'MobileNo': $scope.regData.personal.mobile,
                        'UOTP': $scope.UOTP
                    }).then(function(data) {


                        if (data.data.success == true) {
                            $window.location.href = '/login';

                        } else {
                            $scope.Loading = false;
                            $scope.FormDisable = false;
                            $scope.ErrorMsg2 = "Please Enter correct OTP";
                            $scope.RegStep1 = false;
                            $scope.RegStep2 = true;
                            $scope.RegStep3 = false;
                        }
                    });
                }
            }
            //validation in Contact Us 
        $scope.chknumeric = function($event) {


            var regex = new RegExp("^[A-Z a-z]\d*$");
            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };

        $scope.chkspecialchar = function($event) {


            var regex = new RegExp("^[0-9]\d*$");
            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };



        //Function for add contact details from contact Us page

        $scope.addContactUsDetails = function() {


            $scope.Loading = true;
            $scope.ErrorMsg = false;
            $scope.FormDisable = true;




            if ($scope.ContactUsDetailsData === undefined || $scope.ContactUsDetailsData === null || $scope.ContactUsDetailsData == "") {
                $scope.ErrorMsg = "Please fill the form before submit.";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;
            } else if ($('#First').val() == "") {
                $scope.ErrorMsg = "Please fill first name ";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;
            } else if ($scope.ContactUsDetailsData.name.last === undefined || $scope.ContactUsDetailsData.name.last === null || $scope.ContactUsDetailsData.name.last == "") {
                $scope.ErrorMsg = "Please fill last Name.";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;
            } else if ($scope.ContactUsDetailsData.mobile === undefined || $scope.ContactUsDetailsData.mobile === null || $scope.ContactUsDetailsData.mobile == "") {
                $scope.ErrorMsg = "Please fill Mobile No.";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;

            } else if ($scope.ContactUsDetailsData.email === undefined || $scope.ContactUsDetailsData.email === null || $scope.ContactUsDetailsData.email == "") {
                $scope.ErrorMsg = "Please fill Email Id.";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;
            } else if ($('#city').val() == "") {
                $scope.ErrorMsg = "Please fill city ";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;
            } else if ($('#state').val() == "") {
                $scope.ErrorMsg = "Please fill state ";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;
            } else if ($('#message').val() == "") {
                $scope.ErrorMsg = "Message cannot be empty ";
                $scope.Loading = false;
                $scope.FormDisable = false;
                return false;

            } else if ($scope.ContactUsDetailsData.mobile != undefined) {

                if ($scope.ContactUsDetailsData.mobile.length < 10 && $scope.ContactUsDetailsData.mobile != "") {
                    $scope.ErrorMsg = "Please fill valid Mobile Number";
                    $scope.Loading = false;
                    $scope.employerDisable = false;
                    return false;
                }


            }

            User.addContactUsDetails($scope.ContactUsDetailsData).then(function(data) {

                if (data.data.success) {
                    $scope.Loading = false;
                    $scope.SuccessMsg = "Details Submitted Successfully.";
                    $scope.ContactUsDetailsData = [];


                } else
                    $scope.ContactUsDetailsSuccess = data.data.message;
            });

        };
    })
    .controller('logOtpCtrl', function($rootScope, $scope, $window, $timeout, User, Auth) {


        $scope.RegStep1 = true;
        $scope.RegStep2 = false;

        $scope.SendOTP = function() {


            if ($scope.Mobile === undefined) {
                $scope.ErrorMsg = "Please Enter Register Mobile No.";
                $scope.RegStep1 = true;
                $scope.RegStep2 = false;
            } else {
                User.checkMobile({
                    'MobileNo': $scope.Mobile
                }).then(function(data) {

                    if (data.data.success) {
                        $scope.RegStep1 = false;
                        $scope.RegStep2 = true;
                        $scope.ErrorMsg = false;


                    } else {
                        $scope.ErrorMsg = "Please Enter Register Mobile No.";
                        $scope.RegStep1 = true;
                        $scope.RegStep2 = false;
                    }
                })
            }

        }

        $scope.VerifyLoginOTP = function() {
            if ($scope.UOTP === undefined) {
                $scope.ErrorMsg2 = "Please Enter OTP.";
                $scope.RegStep1 = false;
                $scope.RegStep2 = true;
            } else {

                User.checkOTP({
                    'OTP': $scope.UOTP,
                    'MobileNo': $scope.Mobile
                }).then(function(OTPdata) {

                    if (OTPdata.data.success) {

                        Auth.loginOTP({
                            "username": $scope.Mobile
                        }).then(function(data) {
                            if (data.data.success) {
                                $scope.Loading = false;
                                $scope.SuccessMsg = data.data.message;
                                $window.location.href = '/dashboard';
                            }
                        });

                    } else {
                        $scope.ErrorMsg2 = "Please Enter Valid OTP.";
                        $scope.RegStep1 = false;
                        $scope.RegStep2 = true;
                    }

                })
            }
        }


    })



.controller('forgetCtrl', function($rootScope, $scope, $window, $timeout, User, Auth) {


    $scope.RegStep1 = true;
    $scope.RegStep2 = false;
    $scope.RegStep3 = false;
    $scope.ForgetMobile = "";
    $scope.checkEmailMobile = function() {


        if ($scope.username === undefined) {
            $scope.ErrorMsg = "Please Enter Register Email or Mobile No.";
            $scope.RegStep1 = true;
            $scope.RegStep2 = false;
            $scope.RegStep3 = false;
        } else {
            User.checkEmailMobile({
                'username': $scope.username
            }).then(function(data) {

                if (data.data.success) {
                    $scope.RegStep1 = false;
                    $scope.RegStep2 = true;
                    $scope.ErrorMsg = false;
                    $scope.RegStep3 = false;


                } else {
                    $scope.ErrorMsg = data.data.message;
                    $scope.RegStep1 = true;
                    $scope.RegStep2 = false;
                    $scope.RegStep3 = false;
                }
            })
        }

    }

    $scope.VerifyForgetOTP = function() {
        if ($scope.UOTP === undefined) {
            $scope.ErrorMsg2 = "Please Enter OTP.";
            $scope.RegStep1 = false;
            $scope.RegStep2 = true;
            $scope.RegStep3 = false;
        } else {

            User.checkForgetOTP({
                'OTP': $scope.UOTP,
                'username': $scope.username
            }).then(function(OTPdata) {

                if (OTPdata.data.success) {
                    $scope.RegStep1 = false;
                    $scope.RegStep2 = false;
                    $scope.RegStep3 = true;
                    $scope.ErrorMsg2 = false;
                    $scope.ErrorMsg = false;
                    $scope.ForgetMobile = OTPdata.data.message;


                } else {
                    $scope.ErrorMsg2 = "Please Enter Valid OTP.";
                    $scope.RegStep1 = false;
                    $scope.RegStep2 = true;
                    $scope.RegStep3 = false;
                }

            })
        }
    }

    // Function for Forgot/Reset Password
    $scope.ResetPassword = function() {

        if (passwordvalid1 == true || passwordvalid2 == false || passwordvalid3 == false || passwordvalid4 == false) {

            $scope.ErrorMsg3 = "Password must meet all requirments";
            $scope.Loading = false;
            $scope.FormDisable = false;
            return false;
        }

        if ($scope.Password === undefined || $scope.Password == "") {
            $scope.ErrorMsg3 = "Please Enter Password.";
            $scope.RegStep1 = false;
            $scope.RegStep2 = false;
            $scope.RegStep3 = true;
        } else if ($scope.Password != $scope.ConfPassword) {
            $scope.ErrorMsg3 = "Password Mismatch! Passwords entered in both fields do not match!";
            $scope.Loading = false;
            $scope.RegStep1 = false;
            $scope.RegStep2 = false;
            $scope.RegStep3 = true;
        } else {

            User.changePassword({
                'Password': $scope.Password,
                'Mobile': $scope.ForgetMobile
            }).then(function(OTPdata) {

                if (OTPdata.data.success) {
                    $window.location.href = '/login';
                } else {
                    $scope.ErrorMsg3 = OTPdata.data.message;
                    $scope.RegStep1 = false;
                    $scope.RegStep2 = false;
                    $scope.RegStep3 = true;
                }

            })
        }
    }


})

.controller('authCtrl', function($scope, $window, $timeout, User, Auth) {
    if (Auth.isLoggedIn()) {
        $window.location.href = '/dashboard';
    }
    // Initial UI Elements
    $scope.Loading = false;
    $scope.FormDisable = false;

    // Login Function
    $scope.doLogin = function() {
        $scope.Loading = true;
        $scope.ErrorMsg = false;
        $scope.SuccessMsg = false;
        $scope.FormDisable = true;

        if ($scope.loginData.username === undefined) {
            $scope.Loading = false;
            $scope.FormDisable = false;
            $scope.ErrorMsg = "Username is required";
        } else if ($scope.loginData.password === undefined) {

            $scope.Loading = false;
            $scope.FormDisable = false;
            $scope.ErrorMsg = "Password is required";
        } else {
            Auth.login($scope.loginData).then(function(data) {
                if (data.data.success) {
                    $scope.Loading = false;
                    $scope.SuccessMsg = data.data.message;
                    $window.location.href = '/dashboard';
                } else {
                    $scope.Loading = false;
                    $scope.FormDisable = false;
                    $scope.ErrorMsg = data.data.message;
                }
            });
        }
    };
})