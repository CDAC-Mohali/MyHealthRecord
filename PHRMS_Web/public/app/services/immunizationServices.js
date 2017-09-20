angular.module('immunizationServices', [])

.factory('Immunization', function($http) {

    immunizationFactory = {};

    immunizationFactory.list = function(al) {
        return $http.post('/api/immunization/getImmunizationList/', { exp: al });
    };

    immunizationFactory.add = function(immunizationData) {
        return $http.post('/api/immunization/addImmunizationUser/', immunizationData);
    };

    immunizationFactory.fetch = function(userId) {
        return $http.get('/api/immunization/getUserImmunization/' + userId);
    };

    immunizationFactory.remove = function(immunizationId,userId,name) {
        return $http.post('/api/immunization/removeUserImmunization/', { ImmunizationId: immunizationId,UserId:userId,ImmunizationName:name });
    };
    immunizationFactory.filter = function(userId, dateData) {
        return $http.post('/api/immunization/getUserImmunizationByDate/' + userId, dateData);
    };

    return immunizationFactory;
});