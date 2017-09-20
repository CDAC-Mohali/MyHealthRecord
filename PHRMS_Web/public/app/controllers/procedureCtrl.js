angular.module('procedureController', ['userServices', 'procedureServices'])

    .controller('procedureCtrl', function ($window, $scope, User, Procedure, Lightbox) {

        $scope.openLightboxModal = function (Index) {
            Lightbox.openModal($scope.images, Index);
        };
        $('input[type=file]').change(function (e) {
            $in = $(this);
            var ext = $in.val().split('.').pop().toLowerCase();
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'pdf', 'docx']) == -1) {
                $scope.ErrorMsg = 'Only JPG, PNG, GIF, DOC and PDF files are allowed!';
                $("#fileName").html("");

                $scope.ProcedureData.Info.FilePath = "";
                $scope.ProcedureData.Info.FileFlag = "";
                // $scope.ProcedureData.Info.File.base64 = "";
                // $scope.ProcedureData.Info.File.filename = "";
                // $scope.ProcedureData.Info.File.filesize = "";
                // $scope.ProcedureData.Info.File.filetype = "";
            } else {
                if (this.files[0].size > 2000000) {
                    $scope.ErrorMsg = 'File size must be less than 2 MB!';
                    $scope.ProcedureData.Info.FilePath = "";
                    $scope.ProcedureData.Info.FileFlag = "";
                    // $scope.ProcedureData.Info.File.base64 = "";
                    // $scope.ProcedureData.Info.File.filename = "";
                    // $scope.ProcedureData.Info.File.filesize = "";
                    // $scope.ProcedureData.Info.File.filetype = "";
                    $("#fileName").html("");
                } else {
                    var tmp = $in.val().split("\\");
                    var name = tmp[tmp.length - 1];
                    $scope.ErrorMsg = "";
                    $("#fileName").html("<strong>Selected File: </strong>" + name);
                }
            }
            // alert($scope.ProcedureData.Info.FileFlag);
        });
        var setFilePath = function () {
            User.setProcedureFilePath().then(function (data) {});
        };
        var getFilePath = function () {
            User.getProcedureFilePath().then(function (data) {
                $scope.FilePath = data.data.message;
            });
        };
        // Procedure User Listing
        var getProcedure = function () {
            Procedure.fetch($scope.u_id).then(function (data) {
                if (typeof (data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserProcedures = data.data.message.Info;
                } else {
                    $scope.UserProcedures = [];
                    $scope.emptyList = true;
                }
            });
        };

        // Procedure SNOMED List Fetching
        $scope.getList = function (al) {
            $scope.List = false;
            $scope.ListLoader = true;
            Procedure.list(al).then(function (data) {
                console.log(data.data.message);
                $scope.ProcedureList = data.data.message;
                $scope.ListLoader = false;
                $scope.List = true;
            });
        };




        // Medication SNOMED List Fetching
        $scope.searchproc = function () {

            if ($scope.searchText == '') {
                $scope.List = false;
                $scope.ListLoader = true;
                Procedure.list('A').then(function (data) {
                    console.log(data.data.message);
                    $scope.ProcedureList = data.data.message;
                    $scope.ListLoader = false;
                    $scope.List = true;
                });

            } else {

                $scope.List = false;
                $scope.ListLoader = true;
                Procedure.list($scope.searchText).then(function (data) {
                    console.log(data.data.message);
                    $scope.ProcedureList = data.data.message;
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
        $scope.ErrorMsg = false;
        getProcedure();

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
            $scope.procedureForm2.$setPristine();
            $scope.procedureForm1.$setPristine();
            $scope.ProcedureData = {};
            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
            $('#addProcedureModal').on('shown.bs.modal', function (e) {
                $scope.getList('a');
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

        $scope.chkalphanumeric = function ($event) {
            var regex = new RegExp("^[A-Za-z][a-zA-Z0-9\\-\\s\\.]*$");

            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if ($scope.ProcedureData.Info.DoctorHospital != undefined) {
                key = $scope.ProcedureData.Info.DoctorHospital + key;
            }

            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };
        // Add Procedure Function
        $scope.addProcedure = function () {

            User.getProcedureFilePath().then(function (data) {
                var FilePath = data.data.message;
                if (FilePath != "") {
                    $scope.ProcedureData.Info.FilePath = FilePath;
                    $scope.ProcedureData.Info.FileFlag = FilePath.split("/").pop();

                }
                if ($scope.ProcedureData.Info.FilePath == "") {
                    var prop = "File";
                    delete $scope.ProcedureData.Info[prop];

                }

                $scope.Loading = true;
                $scope.SuccessMsg = false;
                $scope.SuccessMsg2 = false;

                $scope.ProcedureData.User = $scope.u_id;
                //   console.log($scope.ProcedureData);

                Procedure.add($scope.ProcedureData).then(function (data) {
                    if (data.data.success) {
                        setFilePath();
                        getProcedure();
                        $scope.Loading = false;
                        $scope.SuccessMsg = "Procedure record has been updated.";
                        $('#addProcedureModal').modal('hide');
                    } else {
                        $scope.Loading = false;
                        $scope.ErrorMsg = data.data.message;
                        console.log("Error");
                    }
                });


            });
        };

        // Delete Procedure Function
        $scope.deleteProcedure = function (id, name) {
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Procedure will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    Procedure.remove(id, $scope.u_id, name).then(function (data) {
                        setFilePath();
                        getProcedure();
                        $scope.Loading2 = false;
                        $scope.UserProcedures = data.data.message.Info;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show Procedure 
        $scope.showProcedure = function (id) {
            $scope.ShowPdfFile = false;
            $scope.ShowImageFile = false;
            setFilePath();
            var t = $scope.UserProcedures;
            var name;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserProcedures[i]._id == id) {
                    $scope.UserProcedureData = $scope.UserProcedures[i];
                    //      name = $scope.FileFlag;
                    //    $scope.UserProcedureData.FileName = $scope.UserProcedureData._id + "." + name.split(".")[1];
                    break;
                }
            }
            $scope.images = [{
                'url': $scope.UserProcedureData.FilePath,
                // 'caption': 'Optional caption',
                'thumbUrl': $scope.UserProcedureData.FilePath // used only for this example
            }];
            //Implement Save file to Disgilocker Logic
            $('script[src="https://devservices.digitallocker.gov.in/savelocker/api/1/savelocker.js"]').remove();
            $('script[src="https://devservices.digitallocker.gov.in/requester/api/1/dl.js"]').remove();
            $("#divDigi", "#showProcedureModal").html("");
            var URL = "http://myhealthrecord.nhp.gov.in/" + $scope.UserProcedureData.FilePath;
            $("#divDigi", "#showProcedureModal").append("<div style=''><a id='share_id' href=' " + URL + " ' class='locker_saver_sm '></a></div>");
            SetTimeStamp();

            //show PDF or Image File
            if ($scope.UserProcedureData.FilePath) {
                if ($scope.UserProcedureData.FilePath.includes("pdf")) {
                    $scope.ShowPdfFile = true;
                } else {
                    $scope.ShowImageFile = true;
                }
            }

            //End Logic
            $('#showProcedureModal').modal('toggle');
        };

    });