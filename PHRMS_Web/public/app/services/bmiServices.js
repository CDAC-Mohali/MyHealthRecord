angular.module('bmiServices', [])

.factory('BMI', function($http) {

    BMIFactory = {};



    BMIFactory.add = function(BMIData) {
        return $http.post('/api/BMI/addBMIUser/', BMIData);
    };

    BMIFactory.fetch = function(userId) {
        return $http.get('/api/BMI/getUserBMI/' + userId);
    };

    BMIFactory.remove = function(BMIId, userid) {

        return $http.post('/api/BMI/removeUserBMI/', { BMIId: BMIId, UserId: userid });
    };

    BMIFactory.filter = function(userId, dateData) {
        return $http.post('/api/BMI/getUserBMIDate/' + userId, dateData);
    };


    BMIFactory.filterId = function(userId) {
        return $http.get('/api/BMI/getUserBMIID/' + userId);
    };
    return BMIFactory;
});