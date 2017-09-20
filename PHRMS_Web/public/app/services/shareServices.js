angular.module('shareServices', [])

.factory('Share', function($http) {

    shareFactory = {};

    shareFactory.checkPass = function(key) {
        return $http.get('/api/share/checkPassKey/' + key);
    };

    shareFactory.add = function(shareData) {
        return $http.post('/api/share/addShareData/', shareData);
    };

    shareFactory.update = function(shareId, data) {
        return $http.post('/api/share/submitResponse/' + shareId, data);
    };

    shareFactory.history = function(userId) {
        return $http.get('/api/share/getHistory/' + userId);
    };

    shareFactory.fetch = function(shareId) {
        return $http.get('/api/share/getRecord/' + shareId);
    };
    shareFactory.CheckPdf = function() {
        return $http.get('/api/share/CheckPdf/');
    };

    return shareFactory;
});