angular.module('dashboardController', ['userServices', 'dashboardServices', 'bpServices', 'activityServices', 'bmiServices', 'bloodgulucoseServices'])
    // .config(function($stateProvider) {
    //     $state.transitionTo($state.current, $stateParams, {
    //         reload: true,
    //         inherit: false,
    //         notify: true
    //     });
    // })
    .controller('dashboardCtrl', function($scope, User, Dashboard, BP, Activity, BMI, BloodGulucose) {
        //Blood Glucose Graph
        // BloodGulucose.fetch($scope.u_id).then(function(data) {
        //     if (data.data.message === null) {
        //         data.data.message = [];
        //     } else {
        //         $scope.BloodGlucoseGraphData = data.data.message;
        //         // console.log($scope.BloodGlucoseGraphData);
        //     }
        // });


        $scope.myDataSource = {};
        $scope.myBMIDataSource = {};
        $scope.mySPo2DataSource = {};
        $scope.myRespDataSource = {};
        $scope.myBGDataSource = {};
        $scope.myBodyTempDataSource = {};
        $scope.myBodyHeartRateDataSource = {};
        $scope.myActivityDataSource = {};

        $scope.TipsID = 1;

        Dashboard.getHealthTips($scope.TipsID).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.HealthTips = data.data.message[1];
            $scope.TipsID = data.data.message[0];
            //  console.log(data.data.message);
        });

        setInterval(function() {
            //Countsn
            //Get Allergy Count
            Dashboard.getHealthTips($scope.TipsID).then(function(data) {
                if (data.data.message === null) {
                    data.data.message = [];
                }
                console.log(parseInt(data.data.message[0]) + 1);
                $scope.HealthTips = data.data.message[1];
                $scope.TipsID = parseInt(data.data.message[0]) + 1;
                //  console.log(data.data.message);
            });
        }, 5000)




        //Counts
        //Get Allergy Count
        Dashboard.getAllergyCount($scope.u_id).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.AllergyData = data.data.message;
            //  console.log(data.data.message);
        });
        //Get BP Count
        Dashboard.getBPCount($scope.u_id).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.BPData = data.data.message;
            //    console.log(data.data.message);
        });
        //Get GluCose Count
        Dashboard.getBloodGulucoseCount($scope.u_id).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.BloodGulucoseData = data.data.message;
            // console.log(data.data.message);
        });
        //Get Procedure Count
        Dashboard.getProcedureCount($scope.u_id).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.ProcedureData = data.data.message;
            // console.log(data.data.message);
        });

        //Get Immunization Count
        Dashboard.getImmunizationCount($scope.u_id).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.ImmunizationData = data.data.message;
            // console.log(data.data.message);
        });

        //Get Lab Count
        Dashboard.getLabCount($scope.u_id).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.LabData = data.data.message;
            // console.log(data.data.message);
        });

        //Get Medicine Count
        Dashboard.getMedicineCount($scope.u_id).then(function(data) {
            if (data.data.message === null) {
                data.data.message = [];
            }
            $scope.MedicineData = data.data.message;
            // console.log(data.data.message);
        });
        //Get Activities Callories


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
                    // for (count = 0; count < $scope.ActivityGraphData.length; count++) {
                    //     $scope.TotalActivities += $scope.ActivityGraphData[count].TotalDistance;
                    // }
                    if ($scope.ActivityGraphData.length > 0) {
                        $scope.TotalActivities = $scope.ActivityGraphData[$scope.ActivityGraphData.length - 1].TotalDistance;
                        $scope.LastActivities = $scope.ActivityGraphData[$scope.ActivityGraphData.length - 1].ActivityName;
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

                    //  alert(JSON.stringify(weightdata))
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

        var getUserActivityCalories = function(Type) {
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
                $scope.Data = {};

                $scope.Data.UserId = $scope.u_id;
                $scope.Data.Type = Type;

                Dashboard.getUserActivityCalories($scope.Data).then(function(data) {
                    if (data.data.message === null) {
                        data.data.message = [];
                    }
                    $scope.HaveCaloriesData = false;
                    $scope.HaveNoCaloriesData = false;

                    $scope.CaloriesData = data.data.message;
                    // console.log("Count:" + $scope.CaloriesData.length)
                    if ($scope.CaloriesData.length > 0) {
                        $scope.HaveCaloriesData = true;
                    } else {
                        $scope.HaveNoCaloriesData = true;
                    }
                    //  $scope.TotalTime = $scope.CaloriesData.TotalMinutes + ($scope.CaloriesData.TotalHours * 60);
                    // console.log(data.data.message);
                });
            }
            // Initialize UX Elements
            //Get BP Graph

        var getUserBPGraph = function(Type) {
            $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getUserBPGraph($scope.Data).then(function(data) {
                if (data.data.message === null) {
                    data.data.message = [];
                } else {
                    $scope.BPGraphData = data.data.message;
                    var sysdata = [];
                    var diadata = [];

                    //set Graph
                    var temp = {};
                    var CollectionDates = [];
                    var CollectionDate = [];
                    for (var i in $scope.BPGraphData) {
                        temp["label"] = $scope.BPGraphData[i].Record.strCollectionDate;
                        CollectionDate.push(temp);
                        temp = {};
                        temp["value"] = $scope.BPGraphData[i].Record.ResSystolic;
                        sysdata.push(temp);
                        temp = {};
                        temp["value"] = $scope.BPGraphData[i].Record.ResDiastolic;
                        diadata.push(temp);
                        temp = {};
                    }
                    temp = {};
                    temp["category"] = CollectionDate;
                    CollectionDates.push(temp);
                    var dataset = [];

                    if (sysdata != "" || diadata != "") {

                        dataset = [{
                                "seriesname": "Systolic (in mmHg)",
                                "data": sysdata
                            },
                            {
                                "seriesname": "Diastolic (in mmHg)",
                                // "showvalues": "0",
                                "data": diadata
                            }
                        ];
                    }
                    $scope.myDataSource = {
                        chart: {
                            "caption": "Blood Pressure ",
                            "xaxisname": "Collection Date",
                            "yaxisname": "Blood Pressure ",
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
                            "subcaptionFontBold": "0",

                        },

                        "categories": CollectionDates,
                        "dataset": dataset
                    };
                }
            });

        }
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
        var getBodyTempGraph = function(Type) {

            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getBodyTempGraph($scope.Data).then(function(data) {
                if (data.data.message === null) {
                    data.data.message = [];
                } else {
                    $scope.BodyTempGraphData = data.data.message;
                    var weightdata = [];
                    var temp = {};
                    for (var i in $scope.BodyTempGraphData) {
                        //     alert($scope.BMIGraphData[i].Record.strCollectionDate);
                        temp["label"] = $scope.BodyTempGraphData[i].Record.strCollectionDate;
                        temp["value"] = $scope.BodyTempGraphData[i].Record.Result.toFixed(2);
                        weightdata.push(temp);
                        temp = {};
                    }
                    //    alert(weightdata);
                    $scope.myBodyTempDataSource = {
                        chart: {
                            "caption": "Body Temperature",
                            "xaxisname": "Collection Date",
                            "yaxisname": "Body Temperature",
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
        var getHeartRateGraph = function(Type) {

            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getHeartRateGraph($scope.Data).then(function(data) {
                if (data.data.message === null) {
                    data.data.message = [];
                } else {
                    $scope.HeartRateGraphData = data.data.message;
                    var weightdata = [];
                    var temp = {};
                    for (var i in $scope.HeartRateGraphData) {
                        //     alert($scope.HeartRateGraphData[i].Record.strCollectionDate);
                        temp["label"] = $scope.HeartRateGraphData[i].Record.strCollectionDate;
                        temp["value"] = $scope.HeartRateGraphData[i].Record.Result.toFixed(2);
                        weightdata.push(temp);
                        temp = {};
                    }
                    //    alert(weightdata);
                    $scope.myBodyHeartRateDataSource = {
                        chart: {
                            "caption": "Heart Rate",
                            "xaxisname": "Collection Date",
                            "yaxisname": "Heart Rate",
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
        var getRespRateGraph = function(Type) {

            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getRespRateGraph($scope.Data).then(function(data) {
                if (data.data.message === null) {
                    data.data.message = [];
                } else {
                    $scope.RespRateGraphData = data.data.message;
                    var weightdata = [];
                    var temp = {};
                    for (var i in $scope.RespRateGraphData) {
                        //     alert($scope.BMIGraphData[i].Record.strCollectionDate);
                        temp["label"] = $scope.RespRateGraphData[i].Record.strCollectionDate;
                        temp["value"] = $scope.RespRateGraphData[i].Record.Result.toFixed(2);
                        weightdata.push(temp);
                        temp = {};
                    }
                    //    alert(weightdata);
                    $scope.myRespDataSource = {
                        chart: {
                            "caption": "Respiratory Rate",
                            "xaxisname": "Collection Date",
                            "yaxisname": "Respiratory Rate",
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
        var getSPo2Graph = function(Type) {
            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getSPo2Graph($scope.Data).then(function(data) {
                if (data.data.message === null) {
                    data.data.message = [];
                } else {
                    $scope.SPo2GraphData = data.data.message;
                    var weightdata = [];
                    var temp = {};

                    console.log($scope.SPo2GraphData);
                    for (var i in $scope.SPo2GraphData) {
                        //     alert($scope.BMIGraphData[i].Record.strCollectionDate);
                        temp["label"] = $scope.SPo2GraphData[i].Record.strCollectionDate;
                        temp["value"] = $scope.SPo2GraphData[i].Record.Result.toFixed(2);
                        weightdata.push(temp);
                        temp = {};
                    }
                    //    alert(weightdata);
                    $scope.mySPo2DataSource = {
                        chart: {
                            "caption": "SPo2",
                            "xaxisname": "Collection Date",
                            "yaxisname": "SPo2",
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


        getUserActivityCalories(1);
        getUserBPGraph(1);
        getUserBMIGraph(1);
        getUserBGGraph(1);
        getBodyTempGraph(1);
        getHeartRateGraph(1);
        getRespRateGraph(1);
        getSPo2Graph(1);

        getActivityCounts(1);
        $scope.GetCalories = function(Type) {

            getUserActivityCalories(Type);
            getUserBPGraph(Type);
            getUserBMIGraph(Type);
            getUserBGGraph(Type);
            getBodyTempGraph(Type);
            getHeartRateGraph(Type);
            getRespRateGraph(Type);
            getSPo2Graph(Type);
            getActivityCounts(Type);
        };


    });