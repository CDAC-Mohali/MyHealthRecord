/**
 * Created by gobind on 19/06/17.
 */
angular.module('notificationServices', [])

    .factory('Notification', function($http) {

        notificationFactory = {};

        // Toastr options
        toastr.options = {
            "debug": false,
            "newestOnTop": false,
            "positionClass": "toast-bottom-right",
            "closeButton": true,
            "toastClass": "animated fadeInDown",
        };

        notificationFactory.error = function(msg) {
            toastr.error(msg);
        };

        notificationFactory.info = function(msg) {
            toastr.info(msg);
        };

        notificationFactory.success = function(msg) {
            toastr.success(msg);
        };

        return notificationFactory;
    });