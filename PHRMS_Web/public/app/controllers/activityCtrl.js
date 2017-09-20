angular.module('activityController', ['userServices', 'activityServices'])

.controller('activityCtrl', function($scope, User, Activity, Dashboard) {

    // Activity User Listing
    $scope.myActivityDataSource = {};
    GetGridList = function() {
        Activity.fetch($scope.u_id).then(function(data) {
            if (!data.data.message || (data.data.message).length === 0) {
                data.data.message = [];
                $scope.emptyList = true;
            } else {

                var t = $scope.UserActivities;
                if (t)
                    for (var i = 0; i < t.length; i++)
                        $scope.UserActivities[i].Record.TotalTime = (parseInt($scope.UserActivities[i].Record.TotalHours) * 60) + parseInt($scope.UserActivities[i].Record.TotalMinutes);
                $scope.emptyList = false;
            }
            $scope.UserActivities = data.data.message;
        });
    };
    var getActivityCounts = function(Type) {
        $scope.Data = {};

        $scope.Data.UserId = $scope.u_id;
        $scope.Data.Type = Type;

        //Activity Graph

        Dashboard.getUserActivityCalories($scope.Data).then(function(data) {



            if (data.data.message === null) {
                data.data.message = [];
            } else {
                $scope.TotalActivities = 0;
                $scope.ActivityGraphData = data.data.message;
                for (count = 0; count < $scope.ActivityGraphData.length; count++) {
                    $scope.TotalActivities += $scope.ActivityGraphData[count].TotalDistance;
                }


                var temp = {};
                var tempRunning = {};
                var tempCycling = {};
                var tempSwimming = {};
                var tempwalkingstep = {};
                var CollectionDates = [];
                var CollectionDate = [];
                var CheckDates = [];
                var runningcalories = [];
                var cyclingcalories = [];
                var swimmingcalories = [];
                var walkingstepscalories = [];
                var dataset = [];
                var count = 0;
                $.each($scope.ActivityGraphData, function(idx, value) {
                    if ($.inArray(value.strCollectionDate, CheckDates) == -1) {
                        CheckDates.push(value.strCollectionDate);
                        temp["label"] = value.strCollectionDate;
                        CollectionDate.splice(count, 0, temp);
                        temp = {};
                        var dRunning = 0;
                        var dCycling = 0;
                        var dSwimming = 0;
                        var dWalkingstep = 0;
                        for (var i in $scope.ActivityGraphData) {
                            if (value.strCollectionDate == $scope.ActivityGraphData[i].strCollectionDate) {
                                if ($scope.ActivityGraphData[i].ActivityName == "Running") {
                                    dRunning = dRunning + (Math.round($scope.ActivityGraphData[i].TotalCalories * 100) / 100);
                                } else if ($scope.ActivityGraphData[i].ActivityName == "Cycling") {
                                    dCycling = dCycling + Math.round($scope.ActivityGraphData[i].TotalCalories * 100) / 100;
                                } else if ($scope.ActivityGraphData[i].ActivityName == "Swimming") {
                                    dSwimming = dSwimming + Math.round($scope.ActivityGraphData[i].TotalCalories * 100) / 100;
                                } else if ($scope.ActivityGraphData[i].ActivityName == "Walking + Steps") {
                                    dWalkingstep = dWalkingstep + Math.round($scope.ActivityGraphData[i].TotalCalories * 100) / 100;
                                }
                            }
                        }
                        tempRunning["value"] = dRunning;
                        tempCycling["value"] = dCycling;
                        tempSwimming["value"] = dSwimming;
                        tempwalkingstep["value"] = dWalkingstep;
                        runningcalories.splice(count, 0, tempRunning);
                        cyclingcalories.splice(count, 0, tempCycling);
                        swimmingcalories.splice(count, 0, tempSwimming);
                        walkingstepscalories.splice(count, 0, tempwalkingstep);
                        tempRunning = {};
                        tempCycling = {};
                        tempSwimming = {};
                        tempwalkingstep = {};
                        count++;

                    }
                    // }
                });


                temp = {};
                temp["category"] = CollectionDate;
                CollectionDates.push(temp);
                if (runningcalories != "" || cyclingcalories != "" || swimmingcalories != "" || walkingstepscalories != "") {

                    dataset = [{
                            "seriesname": "Running",
                            "data": runningcalories
                        },
                        {
                            "seriesname": "Cycling",
                            "data": cyclingcalories
                        },
                        {
                            "seriesname": "Swimming",
                            "data": swimmingcalories
                        },
                        {
                            "seriesname": "Walking + Steps",

                            "data": walkingstepscalories
                        }
                    ];
                }

                $scope.myActivityDataSource = {
                    chart: {
                        "labeldisplay": "rotate",
                        "slantlabels": "1",
                        "caption": "Estimated Calories ",
                        "xaxisname": "Collection Date",
                        "yaxisname": "Estimated Calories",
                        "theme": "zune",
                        "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
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
                        "subcaptionFontBold": "0",

                    },

                    "categories": CollectionDates,
                    "dataset": dataset
                };

            }



            //  console.log($scope.ActivityGraphData);
        });


    }
    GetGridList();
    getActivityCounts(1);
    $("#dashbtoday").css("background-color", "#31708f");
    $("#dashbtoday").css("color", "rgb(195, 201, 204)");
    // Activity SNOMED List Fetching
    $scope.getList = function() {
        $scope.List = false;
        $scope.ListLoader = true;
        Activity.list().then(function(data) {
            $scope.ActivityList = data.data.message;
            $scope.ListLoader = false;
            $scope.List = true;
        });
    };


    $scope.GetActivity = function(Type) {
        getActivityCounts(Type);

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

    // Initialize UX Elements
    $scope.showDisable = true;
    $scope.AddForm1 = true;
    $scope.AddForm2 = false;
    $scope.PageOrder1 = true;
    $scope.PageOrder2 = false;
    $scope.SuccessMsg = false;
    $scope.ErrorMsg = false;
    $scope.Loading = false;
    $scope.SuccessMsg2 = false;
    $scope.ErrorMsg2 = false;
    $scope.Loading2 = false;
    $scope.ListLoader = false;
    $scope.List = false;

    // UX Functions
    $scope.resetModal = function() {
        $scope.List = false;
        $scope.AddForm1 = true;
        $scope.AddForm2 = false;
        $scope.PageOrder1 = true;
        $scope.PageOrder2 = false;
        $scope.ActivityForm2.$setPristine();
        $scope.ActivityForm1.$setPristine();
        $scope.ActivityData = {};
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg = false;
        $scope.getList();
        $('#datapicker2').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
    };
    $scope.showNextPage = function() {
        $scope.PageOrder1 = false;
        $scope.PageOrder2 = true;
    };
    $scope.showPrevPage = function() {
        $scope.PageOrder1 = true;
        $scope.PageOrder2 = false;
    };
    $scope.showNextForm = function() {
        $scope.AddForm1 = false;
        $scope.AddForm2 = true;
    };

    // Add Activity Function
    $scope.addActivity = function() {


        if ($scope.ActivityData.Info.TotalHours == 0 && $scope.ActivityData.Info.TotalMinutes == 0) {
            $scope.Loading = false;
            $scope.ErrorMsg = "Please fill valid time";
            return false;
        }
        if ($scope.ActivityData.Info.Distance <= 0) {
            $scope.Loading = false;
            $scope.ErrorMsg = "Distance Should be greater than zero";
            return false;
        }


        $scope.Loading = true;
        $scope.SuccessMsg = false;
        $scope.SuccessMsg2 = false;
        $scope.ErrorMsg = false;
        $scope.ActivityData.User = $scope.u_id;
        Activity.add($scope.ActivityData).then(function(data) {
            if (data.data.success) {
                GetGridList();
                getActivityCounts(1);
                $scope.Loading = false;
                $scope.SuccessMsg = "Activity record has been updated.";
                $('#addActivityModal').modal('hide');
            } else {
                $scope.Loading = false;
                $scope.ErrorMsg = data.data.message;

            }
        });
    };

    // Delete Activity Function
    $scope.deleteActivity = function(id) {
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg = false;
        $scope.Loading2 = false;

        swal({
            title: "Are you sure?",
            text: "This Activity will be archived!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, archive it!"

        }, function() {
            swal(
                Activity.remove(id, $scope.u_id).then(function(data) {
                    if (data.data.success) {
                        $scope.Loading2 = false;
                        GetGridList();
                        getActivityCounts(2);
                        //  $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    }
                })
            );
        });



    };

    // Show Activity 
    $scope.showActivity = function(id) {
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg = false;
        var t = $scope.UserActivities;
        for (var i = 0; i < t.length; i++) {
            if ($scope.UserActivities[i].Record._id == id) {
                $scope.UserActivityData = $scope.UserActivities[i];
                break;
            }
        }
        //  console.log($scope.UserActivityData);
        $('#showActivityModal').modal('toggle');
    };
});