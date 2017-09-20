angular.module('allergyServices', [])

.factory('Allergy', function($http) {

    allergyFactory = {};

    allergyFactory.list = function(al) {
        return $http.post('/api/allergy/getAllergyList/', { exp: al });
    };

    allergyFactory.add = function(allergyData) {
        return $http.post('/api/allergy/addAllergyUser/', allergyData);
    };

    allergyFactory.fetch = function(userId) {
        return $http.get('/api/allergy/getUserAllergy/' + userId);
    };

    allergyFactory.remove = function(AllergyId, userId, Name) {

        return $http.post('/api/allergy/removeUserAllergy/', { AllergyId: AllergyId, UserId: userId, Allergyname: Name });
    };
    allergyFactory.filter = function(userId, dateData) {
        return $http.post('/api/allergy/getUserAllergyByDate/' + userId, dateData);
    };
    return allergyFactory;
});