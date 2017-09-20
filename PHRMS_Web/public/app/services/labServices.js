angular.module('labServices', [])

.factory('Lab', function($http) {

    labFactory = {};

    labFactory.list = function(al) {
        return $http.post('/api/lab/getLabList/', { exp: al });
    };

    labFactory.add = function(labData) {
        return $http.post('/api/lab/addLabUser/', labData);
    };

    labFactory.fetch = function(userId) {
        return $http.get('/api/lab/getUserLab/' + userId);
    };

    labFactory.remove = function(LabId,userid,name) {
        return $http.post('/api/lab/removeUserLab/', { LabId: LabId , UserId: userid , LabName: name });
    };
    labFactory.filter = function(userId, dateData) {
        return $http.post('/api/lab/getUserLabByDate/' + userId, dateData);
    };
    return labFactory;
});