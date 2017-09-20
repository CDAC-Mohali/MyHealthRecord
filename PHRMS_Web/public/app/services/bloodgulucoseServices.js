angular.module('bloodgulucoseServices', [])

.factory('BloodGulucose', function($http) {

    BloodGulucoseFactory = {};



    BloodGulucoseFactory.add = function(BloodGulucoseData) {
        return $http.post('/api/BloodGulucose/addBloodGulucoseUser/', BloodGulucoseData);
    };

    BloodGulucoseFactory.fetch = function(userId) {
        return $http.get('/api/BloodGulucose/getUserBloodGulucose/' + userId);
    };

    BloodGulucoseFactory.remove = function(BloodGulucoseId, userid) {

        return $http.post('/api/BloodGulucose/removeUserBloodGulucose/', { BloodGulucoseId: BloodGulucoseId, UserId: userid });
    };
    BloodGulucoseFactory.filter = function(userId, dateData) {
        return $http.post('/api/BloodGulucose/getUserBGDate/' + userId, dateData);
    };


    BloodGulucoseFactory.filterId = function(userId) {
        return $http.get('/api/BloodGulucose/getUserBGID/' + userId);
    };

    return BloodGulucoseFactory;
});