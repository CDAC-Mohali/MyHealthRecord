angular.module('userServices', [])

.factory('User', function($http) {

    userFactory = {};

    userFactory.create = function(regData) {
        return $http.post('/api/account/users/', regData);
    };
    userFactory.AadhaarRegistration = function(regData) {
        return $http.post('/api/account/AadhaarRegistration/', regData);
    };

    userFactory.VerifyAadhaarNumber = function(regData) {
        return $http.post('/api/account/VerifyAadhaar/', regData);
    };
    userFactory.checkAadhaarOTP = function(regData) {
        return $http.post('/api/account/VerifyAadhaarOTP/', regData);
    };
    userFactory.SendOTP = function(regData) {
        return $http.post('/api/account/SmsOTP/', regData);
    };

    userFactory.verifyOTP = function(regData) {
        return $http.post('/api/account/VerifyOTP/', regData);
    };
    userFactory.checkMobile = function(regData) {
        return $http.post('/api/account/VerifyMobile/', regData);
    };

    userFactory.checkOTP = function(regData) {
        return $http.post('/api/account/VerifyLogOTP/', regData);
    };
    userFactory.checkEmailMobile = function(regData) {
        return $http.post('/api/account/VerifyMobileEmail/', regData);
    };

    /////////////////////////////check now////////////////////
    userFactory.checkForgetOTP = function(regData) {
        return $http.post('/api/account/VerifyForgetOTP/', regData);
    };


    /////////////////////////////changePassword////////////////////
    userFactory.changePassword = function(regData) {
        return $http.post('/api/account/ResetPassword/', regData);
    };




    userFactory.addFeedback = function(userId, feedbackData) {
        return $http.post('/api/account/addFeedback/' + userId, feedbackData);
    };

    userFactory.fetch = function(userId) {
        return $http.get('/api/user/getUser/' + userId);
    };

    userFactory.update = function(userId, userData) {

        return $http.post('/api/user/updateUser/' + userId, userData);
    };
    userFactory.updatePersonalUser = function(userId, userData) {

        return $http.post('/api/user/updatePsersonalUser/' + userId, userData);
    };
    userFactory.updateEmergencyUser = function(userId, userData) {

        return $http.post('/api/user/updateEmergencyUser/' + userId, userData);
    };

    userFactory.updateEmpInfo = function(userId, userData) {

        return $http.post('/api/user/updateEmpInfo/' + userId, userData);
    };

    userFactory.updateInsInfo = function(userId, userData) {

        return $http.post('/api/user/updateInsInfo/' + userId, userData);
    };

    userFactory.updateHospitalInfo = function(userId, userData) {

        return $http.post('/api/user/updateHospitalInfo/' + userId, userData);
    };



    userFactory.getFilePath = function() {
        return $http.get('/api/account/getFilePath/');
    };
    userFactory.setFilePath = function() {
        return $http.get('/api/account/setFilePath/');
    };

    userFactory.getProcedureFilePath = function() {
        return $http.get('/api/account/getProcedureFilePath/');
    };

    userFactory.setProcedureFilePath = function() {
        return $http.get('/api/account/setProcedureFilePath/');
    };

    userFactory.getStateListing = function() {
        return $http.get('/api/account/getStateList/');
    };

    userFactory.getMedicineFilePath = function() {
        return $http.get('/api/account/getMedicineFilePath/');
    };
    userFactory.setMedicineFilePath = function() {
        return $http.get('/api/account/setMedicineFilePath/');
    };

    userFactory.getEprescriptionFilePath = function() {
        return $http.get('/api/account/getEprescriptionFilePath/');
    };
    userFactory.setEprescriptionFilePath = function() {
        return $http.get('/api/account/setEprescriptionFilePath/');
    };

    userFactory.getProfilePicture = function(userId) {
        return $http.get('/api/user/getProfilePicture/' + userId);
    };

    userFactory.updatePic = function(userId, ImageData) {
        return $http.post('/api/user/setProfilePic/' + userId, ImageData);
    };

    userFactory.getNotifs = function(userId) {
        return $http.get('/api/share/getNotifications/' + userId);
    };

    userFactory.markRead = function(userId) {
        return $http.get('/api/share/markNotifications/' + userId);
    };

    userFactory.getActivities = function(userId) {
        return $http.get('/api/account/getUserActivities/' + userId);
    };


    userFactory.GetDisabilityimage = function(userId) {

        return $http.get('/api/user/GetDisabilityimage/' + userId);
    };

    userFactory.GetReport = function(userid, HTML) {
        return $http.post('/api/share/GetReport/', { UserId: userid, HTML: HTML });
    };
    userFactory.addContactUsDetails = function(ContactUsData) {
        return $http.post('/api/account/addContactUsDetails/', ContactUsData);
    };
    return userFactory;
});