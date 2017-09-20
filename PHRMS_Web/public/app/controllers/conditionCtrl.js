angular.module('conditionController', ['userServices', 'conditionServices'])

    .controller('conditionCtrl', function ($scope, User, Condition) {

        // Condition User Listing
        var getCondition = function () {
            Condition.fetch($scope.u_id).then(function (data) {
                if (typeof (data.data.message) !== 'undefined') {
                    $scope.emptyList = false;
                    $scope.UserConditions = data.data.message.Info;
                } else {
                    $scope.UserConditions = [];
                    $scope.emptyList = true;
                }
            });
        };

        // Condition SNOMED List Fetching
        $scope.getList = function (al) {
            $scope.List = false;
            $scope.ListLoader = true;
            Condition.list(al).then(function (data) {
                $scope.ConditionList = data.data.message;
                $scope.ListLoader = false;
                $scope.List = true;
            });
        };


        // Medication SNOMED List Fetching
        $scope.searchproblem = function () {

            if ($scope.searchText == '') {
                $scope.List = false;
                $scope.ListLoader = true;
                Condition.list('A').then(function (data) {
                    $scope.ConditionList = data.data.message;
                    $scope.ListLoader = false;
                    $scope.List = true;
                });

            } else {

                $scope.List = false;
                $scope.ListLoader = true;
                Condition.list($scope.searchText).then(function (data) {
                    $scope.ConditionList = data.data.message;
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
        getCondition();

        // UX Functions
        $scope.resetModal = function () {
            $scope.List = false;
            $("#addProblemModal").modal('toggle');
            $scope.AddForm1 = true;
            $scope.AddForm2 = false;
            $scope.PageOrder1 = true;
            $scope.PageOrder2 = false;
            $scope.search = angular.copy($scope.default);
            $scope.conditionForm2.$setPristine();
            $scope.conditionForm1.$setPristine();
            $scope.ConditionData = {};
            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
            $('#addProblemModal').on('shown.bs.modal', function (e) {
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

        // Add Condition Function
        $scope.addCondition = function () {
            $scope.Loading = true;
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.ErrorMsg = false;
            $scope.ConditionData.User = $scope.u_id;
            Condition.add($scope.ConditionData).then(function (data) {
                if (data.data.success) {
                    getCondition();
                    $scope.Loading = false;
                    $scope.SuccessMsg = "Problem record has been updated.";
                    $('#addProblemModal').modal('hide');
                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg = data.data.message;
                }
            });
        };


        $scope.chkalphanumeric = function ($event) {
            var regex = new RegExp("^[A-Za-z][a-zA-Z0-9\\-\\s\\.]*$");

            var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
            if ($scope.ConditionData.Info.DiagnosisBy != undefined) {
                key = $scope.ConditionData.Info.DiagnosisBy + key;
            }
           
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        };

        // Delete Condition Function
        $scope.deleteCondition = function (id, name) {
            $scope.SuccessMsg = false;
            $scope.SuccessMsg2 = false;
            $scope.Loading2 = false;

            swal({
                title: "Are you sure?",
                text: "This Problem will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!",

            }, function () {
                swal(

                    Condition.remove(id, $scope.u_id, name).then(function (data) {
                        getCondition();
                        $scope.Loading2 = false;
                        $scope.UserConditions = data.data.message.Info;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })

                );
            });

        };

        // Show Allergy 
        $scope.showCondition = function (id) {
            var t = $scope.UserConditions;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserConditions[i]._id == id) {
                    $scope.UserConditionData = $scope.UserConditions[i];
                    break;
                }
            }
            $('#showConditionModal').modal('toggle');
        };
    });