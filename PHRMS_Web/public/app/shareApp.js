angular.module('phrmsShare', [
    'shareServices'
])

.controller('mainCtrl', function($scope, $interval, Share) {
    $scope.isKey = false;
    $scope.AllergyFlag = false;
    $scope.ImmunizationFlag = false;
    $scope.LabFlag = false;
    $scope.conditionFlag = false;
    $scope.procedureFlag = false;
    $scope.medicineFlag = false;

    $scope.check = function() {
        Share.checkPass($scope.passkey).then(function(data) {
            if (data.data.success) {
                $scope.shareData = data.data.message;
                $scope.u_name = data.data.message.Name;
                $scope.u_pic = data.data.message.Picture;
                $scope.c_name = data.data.message.Contact.Name;
                $scope.c_name = data.data.message.Contact.Name;
                $scope.userData = {};
                $scope.userData.personal = data.data.message.Personal;
                if (typeof($scope.shareData.Allergy) !== 'undefined' && ($scope.shareData.Allergy).length > 0)
                    $scope.AllergyFlag = true;
                if (typeof($scope.shareData.Immunization) !== 'undefined' && ($scope.shareData.Immunization).length > 0)
                    $scope.ImmunizationFlag = true;
                if (typeof($scope.shareData.Lab) !== 'undefined' && ($scope.shareData.Lab).length > 0)
                    $scope.LabFlag = true;
                if (typeof($scope.shareData.Condition) !== 'undefined' && ($scope.shareData.Condition).length > 0)
                    $scope.conditionFlag = true;
                if (typeof($scope.shareData.Procedure) !== 'undefined' && ($scope.shareData.Procedure).length > 0)
                    $scope.procedureFlag = true;
                if (typeof($scope.shareData.Medication) !== 'undefined' && ($scope.shareData.Medication).length > 0)
                    $scope.medicineFlag = true;
                $scope.isKey = true;
            } else {
                swal({
                    title: "Oops! Try Again.",
                    text: data.data.message,
                    type: "error"
                });
            }
        });
    }

    $scope.submitResponse = function() {
        Share.update($scope.shareData._id, $scope.shareData).then(function(data) {
            if (data.data.success) {
                swal({
                    title: "Response Sent!",
                    text: data.data.message,
                    type: "success"
                });
                $scope.isKey = false;
            } else {
                swal({
                    title: "Error!",
                    text: data.data.message,
                    type: "error"
                });
            }
        });
    };

    // Show Allergy 
    $scope.showAllergy = function(id) {
        var t = $scope.shareData.Allergy;
        for (var i = 0; i < t.length; i++) {
            if ($scope.shareData.Allergy[i]._id == id) {
                $scope.UserAllergyData = $scope.shareData.Allergy[i];
                break;
            }
        }
        $('#showAllergyModal').modal('toggle');
    };

    // Show Immunization 
    $scope.showImmunization = function(id) {
        var t = $scope.shareData.Immunization;
        for (var i = 0; i < t.length; i++) {
            if ($scope.shareData.Immunization[i]._id == id) {
                $scope.UserImmunizationData = $scope.shareData.Immunization[i];
                break;
            }
        }
        $('#showImmunizationModal').modal('toggle');
    };

    // Show Lab 
    $scope.showLab = function(id) {
        setFilePath();
        var t = $scope.shareData.Lab;
        var name;

        for (var i = 0; i < t.length; i++) {
            if ($scope.shareData.Lab[i]._id == id) {
                $scope.UserLabData = $scope.shareData.Lab[i];
                // name = $scope.UserLabData.FileFlag;
                // $scope.UserLabData.FileName = $scope.UserLabData._id + "." + name.split(".")[1];

                break;
            }
        }
        $scope.images = [{
            'url': $scope.UserLabData.FilePath,
            // 'caption': 'Optional caption',
            'thumbUrl': $scope.UserLabData.FilePath // used only for this example
        }];
        //Implement Save file to Disgilocker Logic
        if ($scope.UserLabData.FilePath) {
            $('script[src="https://devservices.digitallocker.gov.in/savelocker/api/1/savelocker.js"]').remove();
            $('script[src="https://devservices.digitallocker.gov.in/requester/api/1/dl.js"]').remove();
            $("#divDigi", "#showLabModal").html("");
            var URL = "http://myhealthrecord.nhp.gov.in/" + $scope.UserLabData.FilePath;
            $("#divDigi", "#showLabModal").append("<div style=''><a id='share_id' href=' " + URL + " ' class='locker_saver_sm '></a></div>");
            SetTimeStamp();
        }
        //End Logic
        $('#showLabModal').modal('toggle');
    };

    // Show Allergy 
    $scope.showCondition = function(id) {
        var t = $scope.shareData.Condition;
        for (var i = 0; i < t.length; i++) {
            if ($scope.shareData.Condition[i]._id == id) {
                $scope.UserConditionData = $scope.shareData.Condition[i];
                break;
            }
        }
        $('#showConditionModal').modal('toggle');
    };

    // Show Procedure 
    $scope.showProcedure = function(id) {
        setFilePath();
        var t = $scope.shareData.Procedure;
        var name;
        for (var i = 0; i < t.length; i++) {
            if ($scope.shareData.Procedure[i]._id == id) {
                $scope.UserProcedureData = $scope.shareData.Procedure[i];
                //      name = $scope.FileFlag;
                //    $scope.UserProcedureData.FileName = $scope.UserProcedureData._id + "." + name.split(".")[1];
                break;
            }
        }
        $scope.images = [{
            'url': $scope.UserProcedureData.FilePath,
            // 'caption': 'Optional caption',
            'thumbUrl': $scope.UserProcedureData.FilePath // used only for this example
        }];
        //Implement Save file to Disgilocker Logic
        $('script[src="https://devservices.digitallocker.gov.in/savelocker/api/1/savelocker.js"]').remove();
        $('script[src="https://devservices.digitallocker.gov.in/requester/api/1/dl.js"]').remove();
        $("#divDigi", "#showProcedureModal").html("");
        var URL = "http://myhealthrecord.nhp.gov.in/" + $scope.UserProcedureData.FilePath;
        $("#divDigi", "#showProcedureModal").append("<div style=''><a id='share_id' href=' " + URL + " ' class='locker_saver_sm '></a></div>");
        SetTimeStamp();
        //End Logic
        $('#showProcedureModal').modal('toggle');
    };

    // Show Medicine 
    $scope.showMedicine = function(id) {
        setFilePath();
        var t = $scope.shareData.Medication;
        var name;
        for (var i = 0; i < t.length; i++) {
            if ($scope.shareData.Medication[i]._id == id) {
                $scope.UserMedicineData = $scope.shareData.Medication[i];
                // name = $scope.UserMedicineData.FileFlag;
                // $scope.UserMedicineData.FileName = $scope.UserMedicineData._id + "." + name.split(".")[1];
                break;
            }
        }
        $scope.images = [{
            'url': $scope.UserMedicineData.FilePath,
            // 'caption': 'Optional caption',
            'thumbUrl': $scope.UserMedicineData.FilePath // used only for this example
        }];
        //Implement Save file to Disgilocker Logic
        $('script[src="https://devservices.digitallocker.gov.in/savelocker/api/1/savelocker.js"]').remove();
        $('script[src="https://devservices.digitallocker.gov.in/requester/api/1/dl.js"]').remove();
        $("#divDigi", "#showMedicineModal").html("");
        var URL = "http://myhealthrecord.nhp.gov.in/" + $scope.UserMedicineData.FilePath;
        $("#divDigi", "#showMedicineModal").append("<div style=''><a id='share_id' href=' " + URL + " ' class='locker_saver_sm '></a></div>");
        SetTimeStamp();
        //End Logic
        $('#showMedicineModal').modal('toggle');
    };

});