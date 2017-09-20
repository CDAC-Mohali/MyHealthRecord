angular.module('vitalsController', ['authServices', 'vitalsServices'])
    //////////////////////////////////////////Body Temperature///////////////////////////////////

    .controller('bodytemperatureCtrl', function ($scope, User, VITALS, Dashboard) {
        $scope.myBodyTempDataSource = {};
        // BodyTemperature User Listing
        GetGridList = function () {
            VITALS.getUserBodyTemperatureList($scope.u_id).then(function (data) {
                if (!data.data.message || (data.data.message).length === 0) {
                    data.data.message = [];
                    $scope.emptyList = true;
                } else {
                    //  console.log(data.data.message);

                    $scope.emptyList = false;
                }
                $scope.UserBodyTemperature = data.data.message;
            });
        };


        var getBodyTempGraph = function (Type) {

            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getBodyTempGraph($scope.Data).then(function (data) {
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

        getBodyTempGraph(1);
        $("#dashbtoday").css("background-color", "#31708f");
        $("#dashbtoday").css("color", "rgb(195, 201, 204)");
        GetGridList();
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
        $scope.resetModal = function () {
            $scope.AddForm2 = true;
            $scope.BodyTemperatureForm2.$setPristine();
            $scope.BodyTemperatureData = {};
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.Loading = false;

            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
        };

        $scope.GetBodyTemp = function (Type) {
            getBodyTempGraph(Type);

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


        // Add Body TemperatureUser Function
        $scope.addBodyTemperature = function () {
            $scope.Loading = true;
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.SuccessMsg2 = false;
            if ($scope.BodyTemperatureData.Info.Result < 75 || $scope.BodyTemperatureData.Info.Result > 115.7) {
                $scope.ErrorMsg = "Please fill valid Body Temperature";
                $scope.Loading = false;
                $scope.personalDisable = false;
                return false;
            }
            $scope.BodyTemperatureData.User = $scope.u_id;
            VITALS.addBodyTemperatureUser($scope.BodyTemperatureData).then(function (data) {
                if (data.data.success) {
                    GetGridList();
                    getBodyTempGraph(1);
                    //  $scope.UserBodyTemperature = data.data.message.Info;
                    $scope.Loading = false;
                    $scope.SuccessMsg = "Body Temperature Record has been updated.";
                    $('#addBodyTemperatureModal').modal('hide');
                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg = data.data.message;
                }
                //   console.log(data.data);
            });
        };

        // Delete BodyTemperature Function
        $scope.removeUserBodyTemperature = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Body Temperature will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    VITALS.removeUserBodyTemperature(id, $scope.u_id).then(function (data) {
                        GetGridList();
                        getBodyTempGraph(1);
                        $scope.Loading2 = false;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show BodyTemperature 
        $scope.showBodyTemperature = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            var t = $scope.UserBodyTemperature;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserBodyTemperature[i].Record._id == id) {
                    $scope.UserBodyTemperatureData = $scope.UserBodyTemperature[i];
                    break;
                }
            }
            console.log($scope.UserBodyTemperatureData);
            $('#showBodyTemperatureModal').modal('toggle');


        };
    })
    //////////////////////////////////////////Body Temperature///////////////////////////////////
    //////////////////////////////////////////Respiratory Rate///////////////////////////////////
    .controller('respiratoryrateCtrl', function ($scope, User, VITALS, Dashboard) {
        // RespiratoryRate User Listing

        $scope.myRespDataSource = {};

        GetGridList = function () {
            VITALS.getUserRespiratoryRateList($scope.u_id).then(function (data) {
                if (!data.data.message || (data.data.message).length === 0) {
                    data.data.message = [];
                    $scope.emptyList = true;
                } else {
                    //  console.log(data.data.message);

                    $scope.emptyList = false;
                }
                $scope.UserRespiratoryRate = data.data.message;
            });
        };


        var getRespRateGraph = function (Type) {

            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getRespRateGraph($scope.Data).then(function (data) {
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
        getRespRateGraph(1);
        $("#dashbtoday").css("background-color", "#31708f");
        $("#dashbtoday").css("color", "rgb(195, 201, 204)");
        GetGridList();
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
        $scope.resetModal = function () {
            $scope.AddForm2 = true;
            $scope.RespiratoryRateForm2.$setPristine();
            $scope.RespiratoryRateData = {};
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.Loading = false;
            $scope.SuccessMsg2 = false;
            $scope.ErrorMsg2 = false;
            $scope.Loading2 = false;

            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
        };

        $scope.GetRespRate = function (Type) {
            getRespRateGraph(Type);

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

        // Add Body Respiratory User Function
        $scope.addRespiratoryRate = function () {
            $scope.Loading = true;
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.SuccessMsg2 = false;
            if ($scope.RespiratoryRateData.Info.Result < 0 || $scope.RespiratoryRateData.Info.Result > 100) {
                $scope.ErrorMsg = "Please fill valid Respiratory Rate";
                $scope.Loading = false;
                $scope.personalDisable = false;
                return false;
            }
            $scope.RespiratoryRateData.User = $scope.u_id;
            VITALS.addRespiratoryRateUser($scope.RespiratoryRateData).then(function (data) {
                if (data.data.success) {
                    GetGridList();
                    getRespRateGraph(1);
                    //  $scope.UserRespiratoryRate = data.data.message.Info;
                    $scope.Loading = false;
                    $scope.SuccessMsg = "Record has been updated.";
                    $('#addRespiratoryRateModal').modal('hide');
                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg = data.data.message;
                }
                //   console.log(data.data);
            });
        };

        // Delete RespiratoryRate Function
        $scope.removeUserRespiratoryRate = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Respiratory Rate will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    VITALS.removeUserRespiratoryRate(id, $scope.u_id).then(function (data) {
                        GetGridList();
                        getRespRateGraph(1);
                        $scope.Loading2 = false;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show RespiratoryRate 
        $scope.showRespiratoryRate = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            var t = $scope.UserRespiratoryRate;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserRespiratoryRate[i].Record._id == id) {
                    $scope.UserRespiratoryRateData = $scope.UserRespiratoryRate[i];
                    break;
                }
            }
            console.log($scope.UserRespiratoryRateData);
            $('#showRespiratoryRateModal').modal('toggle');


        };
    })
    //////////////////////////////////////////Respiratory Rate///////////////////////////////////
    //////////////////////////////////////////Heart Rate///////////////////////////////////
    .controller('heartrateCtrl', function ($scope, User, VITALS, Dashboard) {
        $scope.myBodyHeartRateDataSource = {};
        // HeartRate User Listing
        GetGridList = function () {
            VITALS.getUserHeartRateList($scope.u_id).then(function (data) {
                if (!data.data.message || (data.data.message).length === 0) {
                    data.data.message = [];
                    $scope.emptyList = true;
                } else {
                    //  console.log(data.data.message);

                    $scope.emptyList = false;
                }
                $scope.UserHeartRate = data.data.message;
            });
        };

        var getHeartRateGraph = function (Type) {

            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getHeartRateGraph($scope.Data).then(function (data) {
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

        getHeartRateGraph(1);
        $("#dashbtoday").css("background-color", "#31708f");
        $("#dashbtoday").css("color", "rgb(195, 201, 204)");
        GetGridList();
        // Initialize UX Elements
        $scope.showDisable = true;
        $scope.AddForm2 = true;
        $scope.SuccessMsg = false;
        $scope.ErrorMsg = false;
        $scope.Loading = false;
        $scope.SuccessMsg2 = false;
        $scope.ErrorMsg2 = false;
        $scope.Loading2 = false;



        $scope.GetBodyHeartRate = function (Type) {
            getHeartRateGraph(Type);

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

        // UX Functions
        $scope.resetModal = function () {
            $scope.AddForm2 = true;
            $scope.HeartRateForm2.$setPristine();
            $scope.HeartRateData = {};
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.Loading = false;
            $scope.SuccessMsg2 = false;
            $scope.ErrorMsg2 = false;
            $scope.Loading2 = false;

            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
        };



        // Add Heart Rate  Function
        $scope.addHeartRate = function () {
            $scope.Loading = true;
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.SuccessMsg2 = false;
            if ($scope.HeartRateData.Info.Result < 0 || $scope.HeartRateData.Info.Result > 1000) {
                $scope.ErrorMsg = "Please fill valid Heart Rate";
                $scope.Loading = false;
                $scope.personalDisable = false;
                return false;
            }
            $scope.HeartRateData.User = $scope.u_id;
            VITALS.addHeartRateUser($scope.HeartRateData).then(function (data) {
                if (data.data.success) {
                    GetGridList();
                    getHeartRateGraph(1);
                    //  $scope.UserHeartRate = data.data.message.Info;
                    $scope.Loading = false;
                    $scope.SuccessMsg = "Record has been updated.";
                    $('#addHeartRateModal').modal('hide');
                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg = data.data.message;
                }
                //   console.log(data.data);
            });
        };

        // Delete HeartRate Function
        $scope.removeUserHeartRate = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This Heart Rate will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    VITALS.removeUserHeartRate(id, $scope.u_id).then(function (data) {
                        GetGridList();
                        getHeartRateGraph(1);
                        $scope.Loading2 = false;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show HeartRate 
        $scope.showHeartRate = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            var t = $scope.UserHeartRate;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserHeartRate[i].Record._id == id) {
                    $scope.UserHeartRateData = $scope.UserHeartRate[i];
                    break;
                }
            }
            console.log($scope.UserHeartRateData);
            $('#showHeartRateModal').modal('toggle');


        };

    })
    //////////////////////////////////////////Heart Rate///////////////////////////////////
    //////////////////////////////////////////SPO2///////////////////////////////////
    .controller('spo2Ctrl', function ($scope, User, VITALS, Dashboard) {

        // SPo2 User Listing
        $scope.mySPo2DataSource = {};
        GetGridList = function () {
            VITALS.getUserSPo2List($scope.u_id).then(function (data) {
                if (!data.data.message || (data.data.message).length === 0) {
                    data.data.message = [];
                    $scope.emptyList = true;
                } else {
                    //  console.log(data.data.message);

                    $scope.emptyList = false;
                }
                $scope.UserSPo2 = data.data.message;
            });
        };
        var getSPo2Graph = function (Type) {
            //  $("#BPbarOptions").empty();
            $scope.Data = {};

            $scope.Data.UserId = $scope.u_id;
            $scope.Data.Type = Type;

            Dashboard.getSPo2Graph($scope.Data).then(function (data) {
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


        getSPo2Graph(1);
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
        $scope.resetModal = function () {
            $scope.AddForm2 = true;
            $scope.SPo2Form2.$setPristine();
            $scope.SPo2Data = {};
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.Loading = false;
            $scope.SuccessMsg2 = false;
            $scope.ErrorMsg2 = false;
            $scope.Loading2 = false;


            $('#datapicker2').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true
            });
        };



        $scope.GetSPo2 = function (Type) {
            getSPo2Graph(Type);

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



        // Add SPO2 Function
        $scope.addSPo2 = function () {
            $scope.Loading = true;
            $scope.SuccessMsg = false;
            $scope.ErrorMsg = false;
            $scope.SuccessMsg2 = false;
            if ($scope.SPo2Data.Info.Result < 0 || $scope.SPo2Data.Info.Result > 100) {
                $scope.ErrorMsg = "Please fill valid SPo2 Result ";
                $scope.Loading = false;
                $scope.personalDisable = false;
                return false;
            }

            $scope.SPo2Data.User = $scope.u_id;
            VITALS.addSPo2User($scope.SPo2Data).then(function (data) {
                if (data.data.success) {
                    GetGridList();
                    getSPo2Graph(1);
                    //  $scope.UserSPo2 = data.data.message.Info;
                    $scope.Loading = false;
                    $scope.SuccessMsg = "Record has been updated.";
                    $('#addSPo2Modal').modal('hide');
                } else {
                    $scope.Loading = false;
                    $scope.ErrorMsg = data.data.message;
                }
                //   console.log(data.data);
            });
        };

        // Delete SPo2 Function
        $scope.removeUserSPo2 = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            $scope.Loading2 = false;
            swal({
                title: "Are you sure?",
                text: "This SpO2 will be archived!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, archive it!"
            }, function () {
                swal(
                    VITALS.removeUserSPo2(id, $scope.u_id).then(function (data) {
                        GetGridList();
                        getSPo2Graph(1);
                        $scope.Loading2 = false;
                        // $scope.SuccessMsg2 = "Record has Been Deleted Successfully!";
                    })
                );
            });

        };

        // Show SPo2 
        $scope.showSPo2 = function (id) {
            $scope.SuccessMsg2 = false;
            $scope.SuccessMsg = false;
            var t = $scope.UserSPo2;
            for (var i = 0; i < t.length; i++) {
                if ($scope.UserSPo2[i].Record._id == id) {
                    $scope.UserSPo2Data = $scope.UserSPo2[i];
                    break;
                }
            }
            console.log($scope.UserSPo2Data);
            $('#showSPo2Modal').modal('toggle');


        };

    });
//////////////////////////////////////////SPO2///////////////////////////////////