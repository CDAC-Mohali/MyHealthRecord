angular.module('medicationServices', [])

.factory('Medication', function($http) {

    medicineFactory = {};

    medicineFactory.list = function(al, subPageNo) {
        return $http.post('/api/medication/getMedicationList/', { exp: al, subPageNo: subPageNo });
    };

    medicineFactory.add = function(medicineData) {
        return $http.post('/api/medication/addMedicationUser/', medicineData);
    };

    medicineFactory.fetch = function(userId) {
        return $http.get('/api/medication/getUserMedication/' + userId);
    };

    medicineFactory.remove = function(MedicineId,userid,name) {
        return $http.post('/api/medication/removeUserMedication/', { MedicineId: MedicineId, UserId: userid , MedicineName: name });
    };
    medicineFactory.filter = function(userId, dateData) {
        return $http.post('/api/medication/getUserMedicationByDate/' + userId, dateData);
    };
    return medicineFactory;
});