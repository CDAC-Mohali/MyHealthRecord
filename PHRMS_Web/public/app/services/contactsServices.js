angular.module('contactsServices', [])


.factory('Contacts', function($http) {

    contactFactory = {};

    contactFactory.list = function() {
        return $http.get('/api/contact/getSpecialityList/');
    };

    contactFactory.add = function(contactData) {
        return $http.post('/api/contact/addContactUser/', contactData);
    };

    contactFactory.fetch = function(userId) {
        return $http.get('/api/contact/getUserContact/' + userId);
    };

    contactFactory.remove = function(ContactId,userid) {
        return $http.post('/api/contact/removeUserContact/', { ContactId: ContactId,UserId: userid });
    };

    contactFactory.update = function(userId, ContactId, userData) {
        return $http.post('/api/contact/updateContact/' + ContactId + '/' + userId, userData);
    };

    return contactFactory;
})

.factory('PersonalContacts', function($http) {

    contactFactory = {};

    contactFactory.add = function(contactData) {
        return $http.post('/api/contact/addPersonalContactUser/', contactData);
    };

    contactFactory.fetch = function(userId) {
        return $http.get('/api/contact/getUserPersonalContact/' + userId);
    };

    contactFactory.remove = function(ContactId,userid) {
        return $http.post('/api/contact/removePersonalUserContact/', { ContactId: ContactId,UserId: userid });
    };

    contactFactory.update = function(userId, ContactId, userData) {
        return $http.post('/api/contact/updatePersonalContact/' + ContactId + '/' + userId, userData);
    };

    return contactFactory;
});