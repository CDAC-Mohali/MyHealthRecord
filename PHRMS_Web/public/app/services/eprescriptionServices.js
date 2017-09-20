angular.module('eprescriptionServices', [])

.factory('ePrescription', function($http) {

    ePrescriptionFactory = {};

    ePrescriptionFactory.list = function(al) {
        return $http.post('/api/eprescription/getePrescriptionList/', { exp: al });
    };

    ePrescriptionFactory.add = function(ePrescriptionData) {
        return $http.post('/api/eprescription/addePrescriptionUser/', ePrescriptionData);
    };

    ePrescriptionFactory.fetch = function(userId) {
        return $http.get('/api/eprescription/getUserePrescription/' + userId);
    };

    ePrescriptionFactory.remove = function(ePrescriptionId,userid) {
      //  console.log(ePrescriptionId);
        return $http.post('/api/eprescription/removeUserePrescription/', { ePrescriptionId: ePrescriptionId,UserId: userid });
    };

    return ePrescriptionFactory;
});