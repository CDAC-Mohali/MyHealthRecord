angular.module('audittrailController', ['userServices', 'auditServices'])

.controller('audittrailCtrl', function($scope, User, Audit) {

        // Activity User Listing

    GetGridList = function() {
            Audit.list($scope.u_id).then(function(data) {
            $scope.AuditTrailList = data.data.message;      
            $scope.ListLoader = false;
            $scope.List = true;
        });

    };

    GetGridList();
   
  
});