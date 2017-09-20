angular.module('phrms', [
    'appRoutes',
    'userControllers',
    'userServices',
    'allergyServices',
    'conditionServices',
    'immunizationServices',
    'procedureServices',
    'labServices',
    'eprescriptionServices',
    'medicationServices',
    'contactsServices',
    'auditServices',
    'bpServices',
    'bloodgulucoseServices',
    'bmiServices',
    'dashboardServices',
    'activityServices',
    'shareServices',
    'vitalsServices',
    'mainController',
    'profileController',
    'allergyController',
    'conditionController',
    'immunizationController',
    'procedureController',
    'labController',
    'eprescriptionController',
    'medicationController',
    'contactsController',
    'activityController',
    'bpController',
    'bloodgulucoseController',
    'bmiController',
    'dashboardController',
    'shareControllers',
    'authServices',
    'naif.base64',
    'notificationServices',
    'radio.slider',
    'bootstrapLightbox',
    'audittrailController',
    'vitalsController',
    'ng-fusioncharts',
    'reportControllers',
    'htmlToPdfSave'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
})

.run(function($rootScope, Auth, User, $window) {

    if (Auth.isLoggedIn()) {
        var data = Auth.getUser();
        if (data.success) {

            $rootScope.exp = data.message.exp;
            $rootScope.u_id = data.message.id;
            $rootScope.u_email = data.message.email;
            $rootScope.u_mobile = data.message.phone;
            $rootScope.u_name = data.message.name;
            $rootScope.gender = data.message.gender;

            User.getProfilePicture($rootScope.u_id).then(function(data) {
                $rootScope.u_pic = data.data.message;

            });
        } else {
            Auth.logout();
            $window.location.href = '/login';
        }
    } else {
        $window.location.href = '/login';
    }
});