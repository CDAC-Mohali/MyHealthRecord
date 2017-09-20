angular.module('phrmsLogin', [
    'userControllers',
    'userServices',
    'authServices'
])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});