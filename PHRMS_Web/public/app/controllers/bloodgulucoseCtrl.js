angular.module('bloodgulucoseController', ['userServices', 'bloodgulucoseServices'])

.controller('bloodGulucoseCtrl', function($scope, User, BloodGulucose, Dashboard) {

    // BloodGulucose User Listing
    $scope.myBGDataSource = {};

    GetGridList = function() {
        BloodGulucose.fetch($scope.u_id).then(function(data) {
            if (!data.data.message || (data.data.message).length === 0) {
                data.data.message = [];
                $scope.emptyList = true;
            } else {
                $scope.UserBloodGulucose = data.data.message;
                $scope.emptyList = false;
            }
        });
    }


    var getUserBGGraph = function(Type) {

        //  $("#BPbarOptions").empty();
        $scope.Data = {};

        $scope.Data.UserId = $scope.u_id;
        $scope.Data.Type = Type;

        Dashboard.getUserBGGraph($scope.Data).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            } else {
                $scope.BloodGlucoseGraphData = data.data.message;
                var weightdata = [];
                var temp = {};
                for (var i in $scope.BloodGlucoseGraphData) {
                    //     alert($scope.BMIGraphData[i].Record.strCollectionDate);
                    temp["label"] = $scope.BloodGlucoseGraphData[i].Record.strCollectionDate;
                    temp["value"] = $scope.BloodGlucoseGraphData[i].Record.Result.toFixed(2);
                    weightdata.push(temp);
                    temp = {};
                }
                //    alert(weightdata);
                $scope.myBGDataSource = {
                    chart: {
                        "caption": " Blood Glucose",
                        "xaxisname": "Collection Date",
                        "yaxisname": " Blood Glucose",
                        "theme": "zune",
                        "paletteColors": "#0075c2,#1aaf5d,#f2c500",
                        "bgColor": "#ffffff",
                        "showBorder": "0",
                        "showCanvasBorder": "0",
                        "usePlotGradientColor": "0",
                        "plotBorderAlpha": "10",
                        "legendBorderAlpha": "0",
                        "legendBgAlpha": "0",
                        "legendShadow": "0",
                        "showHoverEffect": "1",
                        "valueFontColor": "#ffffff",
                        "rotateValues": "1",
                        "placeValuesInside": "1",
                        "divlineColor": "#999999",
                        "divLineDashed": "1",
                        "divLineDashLen": "1",
                        "canvasBgColor": "#ffffff",
                        "captionFontSize": "14",
                        "subcaptionFontSize": "14",
                        "subcaptionFontBold": "0"
                    },

                    "data": weightdata
                };
                //      alert(JSON.stringify($scope.BMIGraphData));
            }
        });
    }

    GetGridList();
    getUserBGGraph(1);

    $("#dashbtoday").css("background-color", "#31708f");
    $("#dashbtoday").css("color", "rgb(195, 201, 204)");
    // Initialize UX Elements
    $scope.showDisable = true;
    $scope.AddForm2 = true;
    $scope.SuccessMsg = false;
    $scope.ErrorMsg = false;
    $scope.Loading = false;
    $scope.SuccessMsg2 = false;
    $scope.ErrorMsg2 = false;
    $scope.Loading2 = false;

    // UX Functions
    $scope.resetModal = function() {
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg = false;
        $scope.AddForm2 = true;
        $scope.ErrorMsg = false;
        $scope.Loading = false;
        $scope.BloodGulucoseForm2.$setPristine();
        $scope.BloodGulucoseData = {};

        $('#datapicker2').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
    };


    $scope.GetBGGraph = function(Type) {
        getUserBGGraph(Type);

        $("#dashbtoday").css("background-color", "#d9edf7");
        $("#dashbweek").css("background-color", "#d9edf7");
        $("#dashbmonth").css("background-color", "#d9edf7");
        $("#dashbyear").css("background-color", "#d9edf7");
        $("#dashbtoday").css("color", "rgb(49, 112, 143)");
        $("#dashbweek").css("color", "rgb(49, 112, 143)");
        $("#dashbmonth").css("color", "rgb(49, 112, 143)");
        $("#dashbyear").css("color", "rgb(49, 112, 143)");
        if (Type == 1) {
            $("#dashbtoday").css("background-color", "#31708f");
            $("#dashbtoday").css("color", "rgb(195, 201, 204)");
        } else if (Type == 2) {
            $("#dashbweek").css("background-color", "#31708f");
            $("#dashbweek").css("color", "rgb(195, 201, 204)");
        } else if (Type == 3) {
            $("#dashbmonth").css("background-color", "#31708f");
            $("#dashbmonth").css("color", "rgb(195, 201, 204)");
        } else if (Type == 3) {
            $("#dashbmonth").css("background-color", "#31708f");
            $("#dashbmonth").css("color", "rgb(195, 201, 204)");
        } else if (Type == 4) {
            $("#dashbyear").css("background-color", "#31708f");
            $("#dashbyear").css("color", "rgb(195, 201, 204)");
        }
    }


    // Add BloodGulucose Function
    $scope.addBloodGulucose = function() {
        $scope.Loading = true;
        $scope.SuccessMsg = false;
        $scope.SuccessMsg2 = false;
        $scope.ErrorMsg = false;
        if ($scope.BloodGulucoseData.Info.Result < 0 || $scope.BloodGulucoseData.Info.Result > 1000) {
            $scope.ErrorMsg = "Please fill valid blood gulucose between 0-1000 (mg/dl)";
            $scope.Loading = false;
            $scope.personalDisable = false;
            return false;
        }
        $scope.BloodGulucoseData.User = $scope.u_id;
        BloodGulucose.add($scope.BloodGulucoseData).then(function(data) {


            if (data.data.success) {
                GetGridList();
                getUserBGGraph(1);
                $scope.Loading = false;
                $scope.SuccessMsg = "BloodGulucose record has been updated.";
                $('#addBloodGulucoseModal').modal('hide');
            } else {
                $scope.Loading = false;
                $scope.ErrorMsg = data.data.message;
            }

        });
    };

    // Delete BloodGulucose Function
    $scope.deleteBloodGulucose = function(id) {
        $scope.SuccessMsg2 = false;
        $scope.Loading2 = false;
        $scope.SuccessMsg = false;

        swal({
            title: "Are you sure?",
            text: "This Blood Glucose will be archived!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, archive it!"
        }, function() {
            swal(
                BloodGulucose.remove(id, $scope.u_id).then(function(data) {
                    if (data.data.success) {
                        GetGridList();
                        getUserBGGraph(1);
                        $scope.Loading2 = false;
                        $scope.UserBloodGulucose = data.data.message.Info;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    }
                })
            );
        });



    };

    // Show BloodGulucose 
    $scope.showBloodGulucose = function(id) {
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg = false;
        var t = $scope.UserBloodGulucose;
        for (var i = 0; i < t.length; i++) {
            if ($scope.UserBloodGulucose[i].Record._id == id) {
                $scope.UserBloodGulucoseData = $scope.UserBloodGulucose[i];
                break;
            }
        }

        $('#showBloodGulucoseModal').modal('toggle');


    };
});