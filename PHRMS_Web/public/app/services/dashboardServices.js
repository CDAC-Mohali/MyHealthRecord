angular.module('dashboardServices', [])

.factory('Dashboard', function($http) {

    dashboardFactory = {};

    dashboardFactory.getAllergyCount = function(UserId) {
        return $http.get('/api/dashboard/getAllergyCount/' + UserId);
    };

    dashboardFactory.getBPCount = function(UserId) {
        return $http.get('/api/dashboard/getBPCount/' + UserId);
    };

    dashboardFactory.getBloodGulucoseCount = function(UserId) {
        return $http.get('/api/dashboard/getBloodGulucoseCount/' + UserId);
    };

    dashboardFactory.getProcedureCount = function(UserId) {
        return $http.get('/api/dashboard/getProcedureCount/' + UserId);
    };

    dashboardFactory.getImmunizationCount = function(UserId) {
        return $http.get('/api/dashboard/getImmunizationCount/' + UserId);
    };
    dashboardFactory.getLabCount = function(UserId) {
        return $http.get('/api/dashboard/getLabCount/' + UserId);
    };

    dashboardFactory.getMedicineCount = function(UserId) {
        return $http.get('/api/dashboard/getMedicineCount/' + UserId);
    };
    dashboardFactory.getUserActivityCalories = function(Data) {

        return $http.post('/api/dashboard/getUserActivityCalories/', Data);
    };
    dashboardFactory.getUserBPGraph = function(Data) {
        return $http.post('/api/dashboard/getUserBPGraph/', Data);
    };
    dashboardFactory.getUserBMIGraph = function(Data) {
        return $http.post('/api/bmi/getUserBMIGraph/', Data);
    };
    dashboardFactory.getUserBGGraph = function(Data) {
        return $http.post('/api/dashboard/getUserBGGraph/', Data);
    };


    dashboardFactory.getBodyTempGraph = function(Data) {
        return $http.post('/api/dashboard/getBodyTempGraph/', Data);
    };
    dashboardFactory.getHeartRateGraph = function(Data) {
        return $http.post('/api/dashboard/getHeartRateGraph/', Data);
    };

    dashboardFactory.getRespRateGraph = function(Data) {
        return $http.post('/api/dashboard/getRespRateGraph/', Data);
    };


    dashboardFactory.getSPo2Graph = function(Data) {
        return $http.post('/api/dashboard/getSPo2Graph/', Data);
    };


       dashboardFactory.getHealthTips = function(TipsID) {
          
        return $http.get('/api/dashboard/getHealthTips/' + TipsID);
    };



    return dashboardFactory;
});