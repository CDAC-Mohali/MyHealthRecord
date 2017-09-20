angular.module('activityServices', [])

.factory('Activity', function($http) {

    activityFactory = {};
    activityFactory.getActivityCounts = function(activityData) {

        return $http.post('/api/activity/getActivityCounts/', activityData);
    };
    activityFactory.list = function(al) {
        return $http.post('/api/activity/getactivityList/');
    };

    activityFactory.add = function(activityData) {
        return $http.post('/api/activity/addactivityUser/', activityData);
    };

    activityFactory.fetch = function(userId) {
        return $http.get('/api/activity/getUserActivity/' + userId);
    };

    activityFactory.remove = function(ActivityId, userid) {

        return $http.post('/api/activity/removeUserActivity/', { ActivityId: ActivityId, UserId: userid });
    };
    activityFactory.filter = function(userId, dateData) {
        return $http.post('/api/activity/getUserActivityDate/' + userId, dateData);
    };


    activityFactory.filterId = function(userId) {

        return $http.get('/api/activity/getUserActivityID/' + userId);
    };
    return activityFactory;
});