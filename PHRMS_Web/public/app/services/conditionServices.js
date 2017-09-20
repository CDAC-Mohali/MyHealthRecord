angular.module('conditionServices', [])

.factory('Condition', function($http) {

    conditionFactory = {};

    conditionFactory.list = function(al) {
        return $http.post('/api/problem/getConditionList/', { exp: al });
    };

    conditionFactory.add = function(conditionData) {
        return $http.post('/api/problem/addConditionUser/', conditionData);
    };

    conditionFactory.fetch = function(userId) {
        return $http.get('/api/problem/getUserCondition/' + userId);
    };

    conditionFactory.remove = function(conditionId,userId,name) {
        return $http.post('/api/problem/removeUserCondition/', { ConditionId: conditionId,UserId:userId,Name:name });
    };
    conditionFactory.filter = function(userId, dateData) {
        return $http.post('/api/problem/getUserConditionByDate/' + userId, dateData);
    };

    return conditionFactory;
});