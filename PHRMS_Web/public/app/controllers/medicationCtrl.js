angular.module('medicationController', ['userServices', 'medicationServices'])

    .controller('medicationCtrl', function ($scope, User, Medication, Lightbox) {

        $scope.openLightboxModal = function (Index) {
            Lightbox.openModal($scope.images, Index);
        };


        $('input[type=file]').change(function (e) {
            $in = $(this);
            var ext = $in.val().split('.').pop().toLowerCase();
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'pdf', 'docx']) == -1) {
                $scope.ErrorMsg = 'Only JPG, PNG, GIF, DOC and PDF files are allowed!';
                $("#fileName").html("");

                $scope.MedicineData.Info.FilePath = "";
                $scope.MedicineData.Info.FileFlag = "";

            } else {
                if (this.files[0].size > 2000000) {
                    $scope.ErrorMsg = 'File size must be less than 2 MB!';
                    $scope.MedicineData.Info.FilePath = "";
                    $scope.MedicineData.Info.FileFlag = "";

                    $("#fileName").html("");
                }
                else {
                    var tmp = $in.val().split("\\");
                    var name = tmp[tmp.length - 1];
                    $("#fileName").html("<strong>Selected File: </strong>" + name);
                }
            }
        });

        var setFilePath = function () {
            User.setMedicineFilePath().then(function (data) { });
        };
        var getFilePath = function () {
            User.getMedicineFilePath().then(function (data) { });
        };
        // Medication User Listing
        var getMedicine = function () {
            Medication.fetch($scope.u_id).then(function (data) {
                if (typeof (data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserMedications = data.data.message.Info;
                } else {
                    $scope.UserMedications = [];
                    $scope.emptyList = true;
                }
            });
        };

        // Medication SNOMED List Fetching
        $scope.getList = function (al, subPage) {
            $scope.subPageNo = subPage;
            $scope.SelectedAlphabet = al;
            $scope.List = false;
            $scope.ListLoader = true;
            Medication.list(al, subPage).then(function (data) {
                $scope.MedicationList = data.data.message;
                $scope.ListLoader = false;
                $scope.List = true;
            });
        };


        // Medication SNOMED List Fetching
        $scope.searchMedi = function () {

            if ($scope.searchText == '') {

                $scope.subPageNo = 0;
                $scope.SelectedAlphabet = 'A';
                $scope.List = false;
                $scope.ListLoader = true;
                Medication.list('A', 0).then(function (data) {
                    $scope.MedicationList = data.data.message;
                    $scope.ListLoader = false;
                    $scope.List = true;
                });

            } else {

                $scope.subPageNo = 0;
                $scope.SelectedAlphabet = $scope.searchText;
                $scope.List = false;
                $scope.ListLoader = true;
                Medication.list($scope.searchText, 0).then(function (data) {
                    $scope.MedicationList = data.data.message;
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
        getMedicine();
        $scope.subPageNo = 0;

        // UX Functions
        $scope.resetModal = function () {
            $scope.AddForm1 = true;
            $scope.AddForm2 = false;
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
            $("#fileName").html("");
            $scope.ErrorMsg = false;
            $scope.search = angular.copy($scope.default);
            $scope.medicineForm2.$setPristine();
            $scope.medicineForm1.$setPristine();
            $scope.MedicineData = {};
            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
            $('#addMedicineModal').on('shown.bs.modal', function (e) {
                $scope.getList('a', 0);
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

        // Add Medicine Function
        $scope.addMedicine = function () {
            User.getMedicineFilePath().then(function (data) {
                var FilePath = data.data.message;
                if (FilePath != "") {
                    $scope.MedicineData.Info.FilePath = FilePath;
                    $scope.MedicineData.Info.FileFlag = FilePath.split("/").pop();

                }
                  if( $scope.MedicineData.Info.FilePath=="") {
                    var prop = "File";
                    delete $scope.MedicineData.Info[prop];

                }

                $scope.Loading = true;
                $scope.SuccessMsg = false;
                $scope.SuccessMsg2 = false;
                $scope.ErrorMsg = false;
                $scope.MedicineData.User = $scope.u_id;
                Medication.add($scope.MedicineData).then(function (data) {
                    if (data.data.success) {
                        setFilePath();
                        getMedicine();
                        $scope.Loading = false;
                        $scope.SuccessMsg = "Medication record has been updated.";
                        $('#addMedicineModal').modal('hide');
                    } else {
                        $scope.Loading = false;
                        $scope.ErrorMsg = data.data.message;
                    }
                    console.log(data.data);
                });
            });
        };

        // Delete Medication Function
        $scope.deleteMedicine = function (id, name) {
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Medication will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    Medication.remove(id, $scope.u_id, name).then(function (data) {
                        setFilePath();
                        getMedicine();
                        $scope.Loading2 = false;
                        $scope.UserMedications = data.data.message.Info;
                        //  $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show Medicine 
        $scope.showMedicine = function (id) {
            $scope.ShowPdfFile = false;
            $scope.ShowImageFile = false;
            setFilePath();
            var t = $scope.UserMedications;
            var name;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserMedications[i]._id == id) {
                    $scope.UserMedicineData = $scope.UserMedications[i];
                    // name = $scope.UserMedicineData.FileFlag;
                    // $scope.UserMedicineData.FileName = $scope.UserMedicineData._id + "." + name.split(".")[1];
                    break;
                }
            }
            $scope.images = [{
                'url': $scope.UserMedicineData.FilePath,
                // 'caption': 'Optional caption',
                'thumbUrl': $scope.UserMedicineData.FilePath // used only for this example
            }];
            //Implement Save file to Disgilocker Logic
            $('script[src="https://devservices.digitallocker.gov.in/savelocker/api/1/savelocker.js"]').remove();
            $('script[src="https://devservices.digitallocker.gov.in/requester/api/1/dl.js"]').remove();
            $("#divDigi", "#showMedicineModal").html("");
            var URL = "http://myhealthrecord.nhp.gov.in/" + $scope.UserMedicineData.FilePath;
            $("#divDigi", "#showMedicineModal").append("<div style=''><a id='share_id' href=' " + URL + " ' class='locker_saver_sm '></a></div>");
            SetTimeStamp();

            //show PDF or Image File
            if ($scope.UserMedicineData.FilePath) {
                if ($scope.UserMedicineData.FilePath.includes("pdf")) {
                    $scope.ShowPdfFile = true;
                } else {
                    $scope.ShowImageFile = true;
                }
            }
            //End Logic
            $('#showMedicineModal').modal('toggle');
        };
    });