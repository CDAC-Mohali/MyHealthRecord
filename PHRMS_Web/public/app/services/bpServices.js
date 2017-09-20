angular.module('bpServices', [])

.factory('BP', function($http) {

    BPFactory = {};



    BPFactory.add = function(BPData) {
        return $http.post('/api/BP/addBPUser/', BPData);
    };

    BPFactory.fetch = function(userId) {
        return $http.get('/api/BP/getUserBP/' + userId);
    };

    BPFactory.remove = function(BPId, userid) {

        return $http.post('/api/BP/removeUserBP/', { BPId: BPId, UserId: userid });
    };
    BPFactory.filter = function(userId, dateData) {
        return $http.post('/api/BP/getUserBPDate/' + userId, dateData);
    };


    BPFactory.filterId = function(userId) {
        return $http.get('/api/BP/getUserBPID/' + userId);
    };
    return BPFactory;
});