angular.module('procedureServices', [])

.factory('Procedure', function($http) {

    var procedureFactory = {};

    procedureFactory.list = function(al) {
        return $http.post('/api/procedure/getProcedureList/', { exp: al });
    };

    procedureFactory.add = function(procedureData) {
        return $http.post('/api/procedure/addProcedureUser/', procedureData);
    };

    procedureFactory.fetch = function(userId) {
        return $http.get('/api/procedure/getUserProcedure/' + userId);
    };

    procedureFactory.remove = function(ProcedureId,userid,name) {
        return $http.post('/api/procedure/removeUserProcedure/', { ProcedureId: ProcedureId, UserId:userid,ProcedureName:name });
    };
    procedureFactory.filter = function(userId, dateData) {
        return $http.post('/api/procedure/getUserProcedureByDate/' + userId, dateData);
    };
    return procedureFactory;

});