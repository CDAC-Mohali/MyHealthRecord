angular.module('labController', ['userServices', 'labServices'])

    .controller('labCtrl', function ($window, $scope, User, Lab, Lightbox) {

        $scope.openLightboxModal = function (Index) {
            Lightbox.openModal($scope.images, Index);
        };

        $('input[type=file]').change(function (e) {
            $in = $(this); var ext = $in.val().split('.').pop().toLowerCase();
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'pdf', 'docx']) == -1) {
                $scope.ErrorMsg = 'Only JPG, PNG, GIF, DOC and PDF files are allowed!';
                $("#fileName").html("");

                $scope.LabData.Info.FilePath = "";
                $scope.LabData.Info.FileFlag = "";

            } else {
                if (this.files[0].size > 2000000) {
                    $scope.ErrorMsg = 'File size must be less than 2 MB!';
                    $scope.LabData.Info.FilePath = "";
                    $scope.LabData.Info.FileFlag = "";

                    $("#fileName").html("");
                }
                else {
                    var tmp = $in.val().split("\\");
                    var name = tmp[tmp.length - 1];
                    $("#fileName").html("<strong>Selected File: </strong>" + name);
                }
            }
        });

        // Lab User Listing
        var getLabs = function () {
            Lab.fetch($scope.u_id).then(function (data) {
                if (typeof (data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserLabs = data.data.message.Info;
                } else {
                    $scope.UserLabs = [];
                    $scope.emptyList = true;
                }
            });
        };
        var setFilePath = function () {
            User.setFilePath().then(function (data) { });
        };
        var getFilePath = function () {
            User.getFilePath().then(function (data) {
                $scope.FilePath = data.data.message;
            });
        };

        // Lab SNOMED List Fetching
        $scope.getList = function (al) {
            $scope.List = false;
            $scope.ListLoader = true;
            Lab.list(al).then(function (data) {
                $scope.LabList = data.data.message;
                $scope.ListLoader = false;
                $scope.List = true;
            });
        };




        // Medication SNOMED List Fetching
        $scope.searchlab = function () {

            if ($scope.searchText == '') {
                $scope.List = false;
                $scope.ListLoader = true;
                Lab.list('A').then(function (data) {
                    $scope.LabList = data.data.message;
                    $scope.ListLoader = false;
                    $scope.List = true;
                });

            } else {

                $scope.List = false;
                $scope.ListLoader = true;
                Lab.list($scope.searchText).then(function (data) {
                    $scope.LabList = data.data.message;
                    $scope.ListLoader = false;
                    $scope.List = true;
                });
            }

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
        $scope.ErrorMsg2 = false;
        $scope.Loading2 = false;
        $scope.ListLoader = false;
        $scope.List = false;
        $scope.ShowPdfFile = false;
        $scope.ShowImageFile = false;

        getLabs();
        $('#addLabModal').on('shown.bs.modal', function (e) {
            $scope.getList('a');
        });

        // UX Functions
        $scope.resetModal = function () {
            $scope.List = false;
            $scope.AddForm1 = true;
            $scope.AddForm2 = false;
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
            $("#fileName").html("");
            $scope.ErrorMsg = false;
            $scope.search = angular.copy($scope.default);
            $scope.labForm2.$setPristine();
            $scope.labForm1.$setPristine();
            $scope.LabData = {};
            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
        };
        $scope.showNextPage = function () {
            $scope.PageOrder1 = false;
            $scope.PageOrder2 = true;
        };
        $scope.showPrevPage = function () {
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
        };
        $scope.showNextForm = function () {
            $scope.AddForm1 = false;
            $scope.AddForm2 = true;
        };

        // Add Lab Function
        $scope.addLab = function () {
            // getFilePath();
            User.getFilePath().then(function (data) {
                var FilePath = data.data.message;
                if (FilePath != "") {
                    $scope.LabData.Info.FilePath = FilePath;
                    $scope.LabData.Info.FileFlag = FilePath.split("/").pop();

                }
                 if($scope.LabData.Info.FilePath=="") {
                    var prop = "File";
                    delete $scope.LabData.Info[prop];

                }
                $scope.Loading = true;
                $scope.SuccessMsg = false;
                $scope.ErrorMsg = false;
                $scope.LabData.User = $scope.u_id;
                Lab.add($scope.LabData).then(function (data) {
                    if (data.data.success) {
                        getLabs();
                        $scope.Loading = false;
                        $scope.SuccessMsg = "Lab Test record has been updated.";
                        setFilePath();
                        $('#addLabModal').modal('hide');
                    } else {
                        $scope.Loading = false;
                        $scope.ErrorMsg = data.data.message;
                    }
                });
            });
        };

        // Delete Lab Function
        $scope.deleteLab = function (id, name) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Lab Test will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    Lab.remove(id, $scope.u_id, name).then(function (data) {
                        getLabs();
                        $scope.Loading2 = false;
                        $scope.UserLabs = data.data.message.Info;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show Lab 
        $scope.showLab = function (id) {
            $scope.ShowPdfFile = false;
            $scope.ShowImageFile = false;

            setFilePath();
            var t = $scope.UserLabs;
            var name;

            for (var i = 0; i < t.length; i++) {
                if ($scope.UserLabs[i]._id == id) {
                    $scope.UserLabData = $scope.UserLabs[i];
                    // name = $scope.UserLabData.FileFlag;
                    // $scope.UserLabData.FileName = $scope.UserLabData._id + "." + name.split(".")[1];

                    break;
                }
            }
            $scope.images = [{
                'url': $scope.UserLabData.FilePath,
                // 'caption': 'Optional caption',
                'thumbUrl': $scope.UserLabData.FilePath // used only for this example
            }];
            //Implement Save file to Disgilocker Logic
            if ($scope.UserLabData.FilePath) {
                $('script[src="https://devservices.digitallocker.gov.in/savelocker/api/1/savelocker.js"]').remove();
                $('script[src="https://devservices.digitallocker.gov.in/requester/api/1/dl.js"]').remove();
                $("#divDigi", "#showLabModal").html("");
                var URL = "http://myhealthrecord.nhp.gov.in/" + $scope.UserLabData.FilePath;
                $("#divDigi", "#showLabModal").append("<div style=''><a id='share_id' href=' " + URL + " ' class='locker_saver_sm '></a></div>");
                SetTimeStamp();
            }

            //show PDF or Image File
            if ($scope.UserLabData.FilePath) {
                if ($scope.UserLabData.FilePath.includes("pdf")) {
                    $scope.ShowPdfFile = true;
                } else {
                    $scope.ShowImageFile = true;
                }
            }
            //End Logic
            $('#showLabModal').modal('toggle');
        };

    });