angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider

        .when('/dashboard', {
            templateUrl: 'app/views/pages/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .when('/Profile', {
            templateUrl: 'app/views/pages/profile.html',
            controller: 'profileCtrl'
        })
        .when('/Allergy', {
            templateUrl: 'app/views/pages/allergy.html',
            controller: 'allergyCtrl'
        })
        .when('/Condition', {
            templateUrl: 'app/views/pages/condition.html',
            controller: 'conditionCtrl'
        })
        .when('/Immunization', {
            templateUrl: 'app/views/pages/immunization.html',
            controller: 'immunizationCtrl'
        })
        .when('/Procedure', {
            templateUrl: 'app/views/pages/procedure.html',
            controller: 'procedureCtrl'
        })
        .when('/Lab', {
            templateUrl: 'app/views/pages/lab.html',
            controller: 'labCtrl'
        })
        .when('/ePrescription', {
            templateUrl: 'app/views/pages/eprescription.html',
            controller: 'eprescriptionCtrl'
        })
        .when('/Medication', {
            templateUrl: 'app/views/pages/medication.html',
            controller: 'medicationCtrl'
        })
        .when('/ChangePassword', {
            templateUrl: 'app/views/pages/changepass.html',
            controller: 'profileCtrl'
        })
        .when('/Feedback', {
            templateUrl: 'app/views/pages/feedback.html',
            controller: 'feedbackCtrl'
        })
        .when('/MedicalContacts', {
            templateUrl: 'app/views/pages/medicalcontacts.html',
            controller: 'contactsCtrl'
        })
        .when('/Activity', {
            templateUrl: 'app/views/pages/activity.html',
            controller: 'activityCtrl'
        })
        .when('/BP', {
            templateUrl: 'app/views/pages/bp.html',
            controller: 'bpCtrl'
        })
        .when('/BloodGulucose', {
            templateUrl: 'app/views/pages/BloodGulucose.html',
            controller: 'bloodGulucoseCtrl'
        })
        .when('/BMI', {
            templateUrl: 'app/views/pages/BMI.html',
            controller: 'bmiCtrl'
        })
        .when('/ChangePicture', {
            templateUrl: 'app/views/pages/profile_picture.html',
            controller: 'profilePictureCtrl'
        })
        .when('/ShareData', {
            templateUrl: 'app/views/pages/share_data.html',
            controller: 'shareCtrl'
        })
        .when('/ShareHistory', {
            templateUrl: 'app/views/pages/history.html',
            controller: 'historyCtrl'
        })
        .when('/ActivitySummary', {
            templateUrl: 'app/views/pages/ActivitySummary.html',
            controller: 'audittrailCtrl'
        })
        .when('/ActivitySummary', {
            templateUrl: 'app/views/pages/ActivitySummary.html',
            controller: 'audittrailCtrl'
        })
        .when('/BodyTemperature', {
            templateUrl: 'app/views/pages/BodyTemperature.html',
            controller: 'bodytemperatureCtrl'
        })
        .when('/HeartRate', {
            templateUrl: 'app/views/pages/HeartRate.html',
            controller: 'heartrateCtrl'
        })
        .when('/RespiratoryRate', {
            templateUrl: 'app/views/pages/RespiratoryRate.html',
            controller: 'respiratoryrateCtrl'
        })
        .when('/SPo2', {
            templateUrl: 'app/views/pages/SPo2.html',
            controller: 'spo2Ctrl'
        })
        .when('/ReportData', {
            templateUrl: 'app/views/pages/report_data.html',
            controller: 'reportCtrl'
        })

         .when('/preview', {
            templateUrl: 'app/views/preview.html',
            controller: 'reportCtrl'
        })
        .otherwise({ redirectTo: '/' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});