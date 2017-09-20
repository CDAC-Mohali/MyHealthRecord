angular.module('authServices', [])

.factory('Auth', function($http, AuthToken) {
    var authFactory = {};

    authFactory.login = function(loginData) {
        return $http.post('/api/account/authenticate', loginData).then(function(data) {
            AuthToken.setToken(data.data.token);
            return data;
        });
    };
    authFactory.loginOTP = function(loginData) {

        return $http.post('/api/account/authenticateOTP', loginData).then(function(data) {
            AuthToken.setToken(data.data.token);
            return data;
        });
    };

    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    authFactory.logout = function() {
        AuthToken.removeToken();
    };

    authFactory.getUser = function() {
        if (AuthToken.getToken()) {
            var data;
            $.ajax({
                url: "/api/token/me",
                method: 'POST',
                async: false,
                cache: false,
                headers: { 'x-access-token': AuthToken.getToken() },
                success: function(d) {
                    //  console.log(d);
                    data = d;
                }
            });
            return data;
        } else {
            $q.reject({ message: "User has no Token" });
        }
    };


    authFactory.updatePass = function(userId, userData) {
        return $http.post('/api/user/updatePassword/' + userId, userData);
    };

    return authFactory;
})

.factory('AuthToken', function($window) {
    var authTokenFactory = {};

    authTokenFactory.setToken = function(token) {
        $window.localStorage.setItem('token', token);
    };

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    authTokenFactory.removeToken = function() {
        $window.localStorage.removeItem('token');
    };

    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function(config) {
        var token = AuthToken.getToken();

        if (token) config.headers['x-access-token'] = token;

        return config;
    };

    return authInterceptorsFactory;
});