angular.module('immunizationController', ['userServices', 'immunizationServices'])

.controller('immunizationCtrl', function($scope, User, Immunization) {

    // Immunization User Listing
    var getImmunization = function() {
        Immunization.fetch($scope.u_id).then(function(data) {
            if (typeof(data.data.message) !== 'undefined') {
                $scope.emptyList = false;
                $scope.UserImmunizations = data.data.message.Info;
            } else {
                $scope.UserImmunizations = [];
                $scope.emptyList = true;
            }
        });
    };

    // Immunization SNOMED List Fetching
    $scope.getList = function(al) {
        $scope.List = false;
        $scope.ListLoader = true;
        Immunization.list(al).then(function(data) {
            $scope.ImmunizationList = data.data.message;
            $scope.ListLoader = false;
            $scope.List = true;
        });
    };




    // Medication SNOMED List Fetching
    $scope.searchImmun = function() {

        if ($scope.searchText == '') {
            $scope.List = false;
            $scope.ListLoader = true;
            Immunization.list('A').then(function(data) {
                $scope.ImmunizationList = data.data.message;
                $scope.ListLoader = false;
                $scope.List = true;
            });

        } else {

            $scope.List = false;
            $scope.ListLoader = true;
            Immunization.list($scope.searchText).then(function(data) {
                $scope.ImmunizationList = data.data.message;
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
    getImmunization();

    // UX Functions
    $scope.resetModal = function() {
        $scope.List = false;
        $scope.AddForm1 = true;
        $scope.AddForm2 = false;
        $scope.PageOrder1 = true;
        $scope.PageOrder2 = false;
        $scope.search = angular.copy($scope.default);
        $scope.immunizationForm1.$setPristine();
        $scope.immunizationForm2.$setPristine();
        $scope.ImmunizationData = {};
        $('#datapicker2').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
        $('#addImmunizationModal').on('shown.bs.modal', function(e) {
            $scope.getList('a');
        });
    };
    $scope.showNextPage = function() {
        $scope.PageOrder1 = false;
        $scope.PageOrder2 = true;
    };
    $scope.showPrevPage = function() {
        $scope.PageOrder1 = true;
        $scope.PageOrder2 = false;
    };
    $scope.showNextForm = function() {
        $scope.AddForm1 = false;
        $scope.AddForm2 = true;
    };

    // Add Immunization Function
    $scope.addImmunization = function() {
        $scope.Loading = true;
        $scope.SuccessMsg = false;
        $scope.SuccessMsg2 = false;
        $scope.ErrorMsg = false;
        $scope.ImmunizationData.User = $scope.u_id;
        Immunization.add($scope.ImmunizationData).then(function(data) {
            if (data.data.success) {
                getImmunization();
                $scope.Loading = false;
                $scope.SuccessMsg = "Immunization record has been updated.";
                $('#addImmunizationModal').modal('hide');
            } else {
                $scope.Loading = false;
                $scope.ErrorMsg = data.data.message;
            }

        });
    };

    // Delete Immunization Function
    $scope.deleteImmunization = function(id, name) {
        $scope.SuccessMsg = false;
        $scope.SuccessMsg2 = false;
        $scope.Loading2 = false;
        swal({
            title: "Are you sure?",
            text: "This Immunization will be archived!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, archive it!"
        }, function() {
            swal(

                Immunization.remove(id, $scope.u_id, name).then(function(data) {
                    getImmunization();
                    $scope.Loading2 = false;
                    $scope.UserImmunizations = data.data.message.Info;
                    // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                })

            );
        });

    };

    // Show Immunization 
    $scope.showImmunization = function(id) {
        var t = $scope.UserImmunizations;
        for (var i = 0; i < t.length; i++) {
            if ($scope.UserImmunizations[i]._id == id) {
                $scope.UserImmunizationData = $scope.UserImmunizations[i];
                break;
            }
        }
        $('#showImmunizationModal').modal('toggle');
    };
});