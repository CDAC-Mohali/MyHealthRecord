angular.module('mainController', ['authServices', 'userServices'])

.controller('mainCtrl', function($location, $scope, $window, $timeout, $rootScope, $interval, Auth, User) {
    $scope.isActive = function(route) {
        return route === $location.path();
    };

    if (Auth.isLoggedIn()) {
        var data = Auth.getUser();
        $rootScope.exp = data.message.exp;
        $rootScope.u_id = data.message.id;
        $rootScope.u_email = data.message.email;
        $rootScope.u_mobile = data.message.phone;
        $rootScope.u_name = data.message.name;
        $rootScope.gender = data.message.gender;

        User.getProfilePicture($rootScope.u_id).then(function(data) {
            $rootScope.u_pic = data.data.message;
        });

        var x = $interval(function() {
            User.getNotifs($scope.u_id).then(function(data) {
                if (typeof(data.data.message) !== undefined && (data.data.message).length > 0) {
                    $scope.Notifs = data.data.message;
                    $scope.NotifLength = (data.data.message).length;
                    $scope.zeroNotif = false;
                } else {
                    $scope.Notifs = [];
                    $scope.NotifLength = 0;
                    $scope.zeroNotif = true;
                }
            });
        }, 5000);
        $('.notifDrop').on('show.bs.dropdown', function() {
            $interval.cancel(x);
        });
        $('.notifDrop').on('hidden.bs.dropdown', function() {
            x = $interval(function() {
                User.getNotifs($scope.u_id).then(function(data) {
                    if (typeof(data.data.message) !== undefined && (data.data.message).length > 0) {
                        $scope.Notifs = data.data.message;
                        $scope.NotifLength = (data.data.message).length;
                        $scope.zeroNotif = false;
                    } else {
                        $scope.Notifs = [];
                        $scope.NotifLength = 0;
                        $scope.zeroNotif = true;
                    }
                });
            }, 500);
        });
    } else {
        $window.location.href = '/login';
    }

    $scope.readNotifs = function() {
        User.markRead($scope.u_id);
    };
    $scope.readActivtes = function() {


        User.getActivities($scope.u_id).then(function(data) {

            if (typeof(data.data.message) !== undefined && (data.data.message).length > 0) {
                $scope.Auditlist = data.data.message;

            } else {
                $scope.Auditlist = [];
            }
        })
    };
    var loginCheck = $interval(function() {
        var current = Math.floor(Date.now() / 1000);
        if (($scope.exp - current) < 0) {
            Auth.logout();
            $window.location.href = '/login';
            // $("#logoutModal").modal('show');
        }
    }, 1000);

    // Logout Function 
    $scope.doLogout = function() {
        Auth.logout();
        $window.location.href = '/login';
    };

})

.controller('profilePictureCtrl', function($rootScope, $scope, User) {


    $('input[type=file]').change(function(e) {
        $in = $(this);
        var ext = $in.val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
            $scope.ImageFail = 'Only JPG, PNG and GIF files are allowed!';
            angular.element(e).val(null);


        } else {

            if (this.files[0].size > 2000000) {
                $scope.ImageFail = 'File size must be less than 2 MB!'
                angular.element(e).val(null);
                $scope.ImageData.personal.image = "";

            } else {
                var tmp = $in.val().split("\\");
                var name = tmp[tmp.length - 1];
                $scope.ImageFail = "";
                $("#fileName").html("<strong>Selected File: </strong>" + name);
            }
        }


    });

    $scope.Loading = false;

    $scope.updatePicture = function() {
        $scope.Loading = true;
        $scope.ImageFail = false;
        if ($("#fileName").html() == "") {
            swal("Oops...", "Please select the file to upload!", "error");
        } else {
            User.fetch($scope.u_id).then(function(data) {
                var d = data.data.message;
                d.personal.image = $scope.ImageData.personal.image;
                User.updatePic($scope.u_id, d.personal.image).then(function(data) {
                    $rootScope.u_pic = data.data.data.personal.image;
                    if (data.data.success) {
                        $scope.ImageSuccess = data.data.message;
                    } else {
                        $scope.ImageFail = data.data.message;
                    }
                    $scope.$applyAsync();
                });
            });
        }
        $scope.Loading = false;
    };

})



.controller('feedbackCtrl', function($scope, User) {
    $('input[type=file]').change(function(e) {
        $in = $(this);
        var ext = $in.val().split('.').pop().toLowerCase();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'pdf', 'docx']) == -1) {
            $scope.feedbackError = 'Only JPG, PNG, GIF, DOC and PDF files are allowed!';
            $("#fileName").html("");
        } else {
            if (this.files[0].size > 3000000) {
                $scope.feedbackError = 'File size must be less than 3 MB!';

            } else {
                var tmp = $in.val().split("\\");
                var name = tmp[tmp.length - 1];
                $scope.feedbackError = "";
                $("#fileName").html("<strong>Selected File: </strong>" + name);
            }
        }
    });
    // Add Feedback
    $scope.addFeedback = function() {
        User.addFeedback($scope.u_id, $scope.feedbackData).then(function(data) {
            if (data.data.success) {
                $("#feedbackabout").val("");
                $("#feedbacksubject").val("");
                $("#fileName").html("");
                $("#feedbackremarks").val("");
                $scope.feedbackSuccess = data.data.message;
            } else
                $scope.feedbackError = data.data.message;
        });
    };
});