angular.module('bmiController', ['userServices', 'bmiServices'])

.controller('bmiCtrl', function($scope, User, BMI, Dashboard) {

    // BMI User Listing

    $scope.myBMIDataSource = {};
    GetGridList = function() {
        BMI.fetch($scope.u_id).then(function(data) {

            if (!data.data.message || (data.data.message).length === 0) {
                data.data.message = [];
                $scope.emptyList = true;
            } else {

                $scope.emptyList = false;
            }
            $scope.UserBMI = data.data.message;
        });
    };


    var getUserBMIGraph = function(Type) {
        //  $("#BPbarOptions").empty();
        $scope.Data = {};

        $scope.Data.UserId = $scope.u_id;
        $scope.Data.Type = Type;

        Dashboard.getUserBMIGraph($scope.Data).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            } else {
                $scope.BMIGraphData = data.data.message;
                var weightdata = [];
                var temp = {};

                for (var i in $scope.BMIGraphData) {
                    //     alert($scope.BMIGraphData[i].Record.strCollectionDate);
                    temp["label"] = $scope.BMIGraphData[i].Record.strCollectionDate;
                    temp["value"] = $scope.BMIGraphData[i].Record.BMI.toFixed(2);
                    weightdata.push(temp);
                    temp = {};
                }
                //    alert(weightdata);
                $scope.myBMIDataSource = {
                    chart: {
                        "caption": "BMI",
                        "xaxisname": "Collection Date",
                        "yaxisname": "BMI",
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



    getUserBMIGraph(1);
    GetGridList();
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
        $scope.AddForm2 = true;
        $scope.BMIForm2.$setPristine();
        $scope.BMIData = {};

        $('#datapicker2').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
    };

    $scope.GetBMIGraph = function(Type) {
        getUserBMIGraph(Type);

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

    // Add BMI Function
    $scope.addBMI = function() {
        $scope.Loading = true;
        $scope.SuccessMsg = false;
        $scope.SuccessMsg2 = false;
        $scope.ErrorMsg = false;
        $scope.BMIData.User = $scope.u_id;
        BMI.add($scope.BMIData).then(function(data) {
            if (data.data.success) {
                GetGridList();
                getUserBMIGraph(1);
                $scope.Loading = false;
                $scope.SuccessMsg = "BMI record has been updated.";
                $('#addBMIModal').modal('hide');
            } else {
                $scope.Loading = false;
                $scope.ErrorMsg = data.data.message;
            }

        });
    };

    // Delete BMI Function
    $scope.deleteBMI = function(id) {
        $scope.SuccessMsg2 = false;
        $scope.Loading2 = false;
        $scope.SuccessMsg = false;

        swal({
            title: "Are you sure?",
            text: "This BMI will be archived!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, archive it!"
        }, function() {
            swal(
                BMI.remove(id, $scope.u_id).then(function(data) {
                    GetGridList();
                    getUserBMIGraph(1);
                    $scope.Loading2 = false;
                    $scope.UserBMI = data.data.message.Info;
                    // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";

                })
            );
        });

    };

    // Show BMI 
    $scope.showBMI = function(id) {
        var t = $scope.UserBMI;
        for (var i = 0; i < t.length; i++) {
            if ($scope.UserBMI[i].Record._id == id) {
                $scope.UserBMIData = $scope.UserBMI[i];
                break;
            }
        }

        $('#showBMIModal').modal('toggle');


    };
});