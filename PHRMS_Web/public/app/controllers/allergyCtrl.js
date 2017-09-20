angular.module('allergyController', ['userServices', 'allergyServices'])

    .controller('allergyCtrl', function ($scope, User, Allergy) {

        // Allergy User Listing
        var getAllergy = function () {
            Allergy.fetch($scope.u_id).then(function (data) {
                if (typeof (data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserAllergies = data.data.message.Info;
                } else {
                    $scope.UserAllergies = [];
                    $scope.emptyList = true;
                }
            });
        };

        // Allergy SNOMED List Fetching
        $scope.getList = function (al) {
            $scope.List = false;
            $scope.ListLoader = true;
            Allergy.list(al).then(function (data) {
                $scope.AllergyList = data.data.message;
                $scope.ListLoader = false;
                $scope.List = true;
            });
        };



        // Medication SNOMED List Fetching
        $scope.searchallergy = function () {

            if ($scope.searchText == '') {

                $scope.List = false;
                $scope.ListLoader = true;
                Allergy.list('Á').then(function (data) {
                    $scope.AllergyList = data.data.message;
                    $scope.ListLoader = false;
                    $scope.List = true;
                });

            } else {

                $scope.List = false;
                $scope.ListLoader = true;
                Allergy.list($scope.searchText).then(function (data) {
                    $scope.AllergyList = data.data.message;
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
        $scope.emptyList = false;

        getAllergy();

        // UX Functions
        $scope.resetModal = function () {
            $scope.List = false;
            $scope.AddForm1 = true;
            $scope.AddForm2 = false;
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
            $scope.search = angular.copy($scope.default);
            $scope.allergyForm2.$setPristine();
            $scope.allergyForm1.$setPristine();
            $scope.AllergyData = {};


            $('#addAllergyModal').on('shown.bs.modal', function (e) {
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

        // Add Allergy Function
        $scope.addAllergy = function () {
            $scope.Loading = true;
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.ErrorMsg = false;
            $scope.AllergyData.User = $scope.u_id;

            if ($scope.AllergyData.Info.Since == "Day") {
                  if ($scope.AllergyData.Info.Value == undefined || $scope.AllergyData.Info.Value > 30) {
                    $scope.ErrorMsg = "Please, Enter Days  between 1 to 30";
                    $scope.Loading = false;
                    return false;
                }
            } else if($scope.AllergyData.Info.Since == "Month")
            {
                if ($scope.AllergyData.Info.Value == undefined || $scope.AllergyData.Info.Value > 11) {
                    $scope.ErrorMsg = "Please, Enter Months in between 1 to 11";
                    $scope.Loading = false;
                    return false;
                }
            } else if($scope.AllergyData.Info.Since == "Year")
            {
                if ($scope.AllergyData.Info.Value == undefined) {
                    $scope.ErrorMsg = "Please Enter Year";
                    $scope.Loading = false;
                    return false;
                }
            } else if($scope.AllergyData.Info.Since == "Week")
            {
                if ($scope.AllergyData.Info.Value == undefined || $scope.AllergyData.Info.Value > 52) {
                    $scope.ErrorMsg = "Please, Enter Week in between 1 to 52";
                    $scope.Loading = false;
                    return false;
                }
            } else if($scope.AllergyData.Info.Since == "Hour")
            {
                if ($scope.AllergyData.Info.Value == undefined || $scope.AllergyData.Info.Value > 23) {
                    $scope.ErrorMsg = "Please, Enter Hour  between 1 to 23";
                    $scope.Loading = false;
                    return false;
                }
            }else if($scope.AllergyData.Info.Since == "Minute")
            {
                if ($scope.AllergyData.Info.Value == undefined || $scope.AllergyData.Info.Value > 59) {
                    $scope.ErrorMsg = "Please, Enter Hour  between 1 to 59";
                    $scope.Loading = false;
                    return false;
                }
            }

            Allergy.add($scope.AllergyData).then(function (data) {
                if (data.data.success) {

                    getAllergy();

                    $scope.Loading = false;
                    $scope.SuccessMsg = "Allergy record has been updated.";
                    $("#addAllergyModal").modal("hide");
                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg = data.data.message;
                }

            });
        };

        // Delete Allergy Function
        $scope.deleteAllergy = function (id, Name) {
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This allergy will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    Allergy.remove(id, $scope.u_id, Name).then(function (data) {
                        getAllergy();
                        $scope.Loading2 = false;
                        $scope.UserAllergies = data.data.message.Info;

                        //  $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });
        };



        // Show Allergy 
        $scope.showAllergy = function (id) {
            var t = $scope.UserAllergies;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserAllergies[i]._id == id) {
                    $scope.UserAllergyData = $scope.UserAllergies[i];
                    break;
                }
            }

            $('#showAllergyModal').modal('toggle');
        };
    });