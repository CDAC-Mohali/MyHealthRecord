angular.module('auditServices', [])

.factory('Audit', function($http) {

    auditFactory = {};

    auditFactory.list = function(userId) {
       return $http.get('/api/audit/getUserActivities/' + userId);
    };

    auditFactory.add = function(audit) {
        return $http.post('/api/audit/addAuditUser/', audit);
    };


    return auditFactory;
});