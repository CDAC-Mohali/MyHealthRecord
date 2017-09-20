angular.module('bpController', ['userServices', 'bpServices'])

.controller('bpCtrl', function($scope, User, BP, Dashboard) {


    $scope.myDataSource = {};
    // BP User Listing
    GetGridList = function() {
        BP.fetch($scope.u_id).then(function(data) {
            if (!data.data.message || (data.data.message).length === 0) {
                data.data.message = [];
                $scope.emptyList = true;
            } else {
                //  console.log(data.data.message);

                $scope.emptyList = false;
            }
            $scope.UserBP = data.data.message;
        });
    };


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


    GetGridList();
    getUserBPGraph(1);

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



    $scope.GetBPGraph = function(Type) {
        getUserBPGraph(Type);

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
    $scope.resetModal = function() {
        $scope.AddForm2 = true;
        $scope.BPForm2.$setPristine();
        $scope.BPData = {};
        $scope.SuccessMsg = false;
        $scope.ErrorMsg = false;
        $scope.Loading = false;
        $('#datapicker2').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
    };



    // Add BP Function
    $scope.addBP = function() {
        $scope.Loading = true;
        $scope.SuccessMsg = false;
        $scope.ErrorMsg = false;
        $scope.SuccessMsg2 = false;
        if ($scope.BPData.Info.ResSystolic < 0 || $scope.BPData.Info.ResSystolic > 300 || $scope.BPData.Info.ResDiastolic < 0 || $scope.BPData.Info.ResDiastolic > 300) {
            $scope.ErrorMsg = "Please fill valid blood pressure";
            $scope.Loading = false;
            $scope.personalDisable = false;
            return false;
        }

        $scope.BPData.User = $scope.u_id;
        BP.add($scope.BPData).then(function(data) {
            if (data.data.success) {
                GetGridList();
                getUserBPGraph(1);
                //  $scope.UserBP = data.data.message.Info;
                $scope.Loading = false;
                $scope.SuccessMsg = "Blood Pressure record has been updated.";
                $('#addBPModal').modal('hide');
            } else {
                $scope.Loading = false;
                $scope.ErrorMsg = data.data.message;
            }

        });
    };

    // Delete BP Function
    $scope.deleteBP = function(id) {
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg = false;
        $scope.Loading2 = false;

        swal({

            title: "Are you sure?",
            text: "This Blood Pressure will be archived!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, archive it!"
        }, function() {
            swal(

                BP.remove(id, $scope.u_id).then(function(data) {

                    GetGridList();
                    getUserBPGraph(1);
                    $scope.Loading2 = false;
                    $scope.UserBP = data.data.message.Info;

                })

            );
        });



    };

    // Show BP 
    $scope.showBP = function(id) {
        $scope.SuccessMsg2 = false;
        $scope.SuccessMsg = false;
        var t = $scope.UserBP;
        for (var i = 0; i < t.length; i++) {
            if ($scope.UserBP[i].Record._id == id) {
                $scope.UserBPData = $scope.UserBP[i];
                break;
            }
        }

        $('#showBPModal').modal('toggle');


    };




});