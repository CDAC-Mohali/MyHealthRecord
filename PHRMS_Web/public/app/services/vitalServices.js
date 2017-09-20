angular.module('vitalsServices', [])

.factory('VITALS', function($http) {

    vitalsFactory = {};


    //////////////////////////////////////////Body Temperature///////////////////////////////////

    vitalsFactory.addBodyTemperatureUser = function(BodyTemperatureData) {
        return $http.post('/api/vitals/addBodyTemperatureUser/', BodyTemperatureData);
    };

    vitalsFactory.getUserBodyTemperatureList = function(userId) {
        return $http.get('/api/vitals/getUserBodyTemperatureList/' + userId);
    };

    vitalsFactory.removeUserBodyTemperature = function(BodyTemperatureId, userid) {

        return $http.post('/api/vitals/removeUserBodyTemperature/', { BodyTemperatureId: BodyTemperatureId, UserId: userid });
    };
    //////////////////////////////////////////Body Temperature///////////////////////////////////
    //////////////////////////////////////////Respiratory Rate///////////////////////////////////
    vitalsFactory.addRespiratoryRateUser = function(RespiratoryRateData) {
        return $http.post('/api/vitals/addRespiratoryRateUser/', RespiratoryRateData);
    };

    vitalsFactory.getUserRespiratoryRateList = function(userId) {
        return $http.get('/api/vitals/getUserRespiratoryRateList/' + userId);
    };

    vitalsFactory.removeUserRespiratoryRate = function(RespiratoryRateId, userid) {

        return $http.post('/api/vitals/removeUserRespiratoryRate/', { RespiratoryRateId: RespiratoryRateId, UserId: userid });
    };
    //////////////////////////////////////////Respiratory Rate///////////////////////////////////
    //////////////////////////////////////////Heart Rate///////////////////////////////////
    vitalsFactory.addHeartRateUser = function(HeartRateData) {
        return $http.post('/api/vitals/addHeartRateUser/', HeartRateData);
    };

    vitalsFactory.getUserHeartRateList = function(userId) {
        return $http.get('/api/vitals/getUserHeartRateList/' + userId);
    };

    vitalsFactory.removeUserHeartRate = function(HeartRateId, userid) {

        return $http.post('/api/vitals/removeUserHeartRate/', { HeartRateId: HeartRateId, UserId: userid });
    };
    //////////////////////////////////////////Heart Rate///////////////////////////////////

    //////////////////////////////////////////SPO2///////////////////////////////////
    vitalsFactory.addSPo2User = function(SPo2Data) {
        return $http.post('/api/vitals/addSPo2User/', SPo2Data);
    };

    vitalsFactory.getUserSPo2List = function(userId) {
        return $http.get('/api/vitals/getUserSPo2List/' + userId);
    };

    vitalsFactory.removeUserSPo2 = function(SPo2Id, userid) {

        return $http.post('/api/vitals/removeUserSPo2/', { SPo2Id: SPo2Id, UserId: userid });
    };
    //////////////////////////////////////////SPO2///////////////////////////////////

    return vitalsFactory;
});