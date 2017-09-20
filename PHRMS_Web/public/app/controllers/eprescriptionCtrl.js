angular.module('eprescriptionController', ['userServices', 'eprescriptionServices'])

    .controller('eprescriptionCtrl', function ($window, $scope, User, ePrescription, Lightbox) {

        $scope.openLightboxModal = function (Index) {
            Lightbox.openModal($scope.images, Index);
        };

        $('input[type=file]').change(function (e) {
            $in = $(this);
            var ext = $in.val().split('.').pop().toLowerCase();
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'pdf', 'docx']) == -1) {
                $scope.ErrorMsg = 'Only JPG, PNG, GIF, DOC and PDF files are allowed!';
                $("#fileName").html("");

                $scope.ePrescriptionData.Info.FilePath = "";
                $scope.ePrescriptionData.Info.FileFlag = "";


            } else {
                if (this.files[0].size > 2000000) {
                    $scope.ErrorMsg = 'File size must be less than 2 MB!';
                    $scope.ePrescriptionData.Info.FilePath = "";
                    $scope.ePrescriptionData.Info.FileFlag = "";


                    $("#fileName").html("");
                } else {
                    var tmp = $in.val().split("\\");
                    var name = tmp[tmp.length - 1];
                    $("#fileName").html("<strong>Selected File: </strong>" + name);
                }
            }
        });
        var setFilePath = function () {
            User.setEprescriptionFilePath().then(function (data) { });
        };
        // var getFilePath = function() {
        //     User.getEprescriptionFilePath().then(function(data) {
        //         $scope.FilePath = data.data.message;
        //     });
        // };
        // ePrescription User Listing
        var getePrescription = function () {
            ePrescription.fetch($scope.u_id).then(function (data) {
                if (typeof (data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserePrescriptions = data.data.message.Info;
                } else {
                    $scope.UserePrescriptions = [];
                    $scope.emptyList = true;
                }
            });
        };

        // ePrescription SNOMED List Fetching
        $scope.getList = function (al) {
            ePrescription.list(al).then(function (data) {

                $scope.ePrescriptionList = data.data.message;
            });
        };

        // Initialize UX Elements
        $scope.showDisable = true;
        $scope.PageOrder1 = true;
        $scope.PageOrder2 = false;
        $scope.SuccessMsg = false;
        $scope.ErrorMsg = false;
        $scope.Loading = false;
        $scope.SuccessMsg2 = false;
        $scope.ErrorMsg2 = false;
        $scope.Loading2 = false;
        $scope.ShowPdfFile = false;
        $scope.ShowImageFile = false;
        getePrescription();

        // UX Functions
        $scope.resetModal = function () {
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
            $("#fileName").html("");
            $scope.ErrorMsg = false;
            $scope.eprescriptionForm2.$setPristine();
            $scope.ePrescriptionData = {};
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

        $scope.chkalphanumeric = function ($event) {
            var regex = new RegExp("^[A-Za-z][a-zA-Z0-9\\-\\s\\.]*$");

            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if ($scope.ePrescriptionData.Info.ClinicName != undefined) {
                key = $scope.ePrescriptionData.Info.ClinicName + key;
            }

            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };

        // Add ePrescription Function
        $scope.addePrescription = function () {
            User.getEprescriptionFilePath().then(function (data) {
                var FilePath = data.data.message;
                if (FilePath != "") {
                    $scope.ePrescriptionData.Info.FilePath = FilePath;
                    $scope.ePrescriptionData.Info.FileFlag = FilePath.split("/").pop();

                }
                if ($scope.ePrescriptionData.Info.FilePath == "") {
                    var prop = "File";
                    delete $scope.ePrescriptionData.Info[prop];

                }
                $scope.Loading = true;
                $scope.SuccessMsg = false;
                $scope.SuccessMsg2 = false;
                $scope.ErrorMsg = false;
                $scope.ePrescriptionData.User = $scope.u_id;
                ePrescription.add($scope.ePrescriptionData).then(function (data) {
                    if (data.data.success) {
                        getePrescription();
                        setFilePath();
                        $scope.Loading = false;
                        $scope.SuccessMsg = "Prescription record has been updated.";
                        $('#addePrescriptionModal').modal('hide');
                    } else {
                        $scope.Loading = false;
                        $scope.ErrorMsg = data.data.message;
                    }
                });
            });
        };
        $scope.chkspecialchar = function ($event) {


            var regex = new RegExp("^[0-9]\d*$");
            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };
        // Delete ePrescription Function
        $scope.deleteProcedure = function (id) {
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.Loading2 = false;

            swal({
                title: "Are you sure?",
                text: "This Prescription will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    ePrescription.remove(id, $scope.u_id).then(function (data) {
                        setFilePath();
                        getePrescription();
                        $scope.Loading2 = false;
                        $scope.UserePrescriptions = data.data.message.Info;
                        //   $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });



        };

        // Show ePrescription 
        $scope.showProcedure = function (id) {

            $scope.ShowPdfFile = false;
            $scope.ShowImageFile = false;


            setFilePath();
            var t = $scope.UserePrescriptions;
            var name;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserePrescriptions[i]._id == id) {
                    $scope.UserePrescriptionData = $scope.UserePrescriptions[i];
                    // name = $scope.UserePrescriptionData.FileFlag;
                    // $scope.UserePrescriptionData.FileName = $scope.UserePrescriptionData._id + "." + name.split(".")[1];
                    break;
                }
            }
            $scope.images = [{
                'url': $scope.UserePrescriptionData.FilePath,
                // 'caption': 'Optional caption',
                'thumbUrl': $scope.UserePrescriptionData.FilePath // used only for this example
            }];
            //Implement Save file to Disgilocker Logic
            $('script[src="https://devservices.digitallocker.gov.in/savelocker/api/1/savelocker.js"]').remove();
            $('script[src="https://devservices.digitallocker.gov.in/requester/api/1/dl.js"]').remove();
            $("#divDigi", "#showePrescriptionModal").html("");
            var URL = "http://myhealthrecord.nhp.gov.in/" + $scope.UserePrescriptionData.FilePath;
            $("#divDigi", "#showePrescriptionModal").append("<div style=''><a id='share_id' href=' " + URL + " ' class='locker_saver_sm '></a></div>");
            SetTimeStamp();

            //show PDF or Image File
            if ($scope.UserePrescriptionData.FilePath) {
                if ($scope.UserePrescriptionData.FilePath.includes("pdf")) {
                    $scope.ShowPdfFile = true;
                } else {
                    $scope.ShowImageFile = true;
                }
            }
            //
            //End Logic
            $('#showePrescriptionModal').modal('toggle');


        };


        $scope.GetPrescriptio = function (id) {

            var t = $scope.UserePrescriptions;
            var name;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserePrescriptions[i]._id == id) {
                    $scope.UserePrescriptionData = $scope.UserePrescriptions[i];
                    // name = $scope.UserePrescriptionData.FileFlag;
                    // $scope.UserePrescriptionData.FileName = $scope.UserePrescriptionData._id + "." + name.split(".")[1];
                    break;
                }
            }

            $('#prviewsave').hide();
            var w = window.open();
            w.document.write('<html><head><title>Print it!</title>' +
                ' <link rel="stylesheet" href="assets/vendor/fontawesome/css/font-awesome.css"/>' +
                '<link rel="stylesheet" href="assets/vendor/bootstrap/dist/css/bootstrap.css"/>' +
                '</head><body>');

            w.document.write($scope.UserePrescriptionData.prescriptionHtml);

                 w.document.write('</body></html>');
            w.document.focus();
            w.document.print();
            w.document.close();



        }

    });