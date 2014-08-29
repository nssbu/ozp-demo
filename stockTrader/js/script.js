(function () {
    'use strict';

    var app = angular.module('appTitude', ['ozpIwc','ngAnimate']);

    app.directive("stockPane", function(){
        return {
            restrict: 'E',
            templateUrl: "partials/stock-pane.html",
            controller: [ '$scope','iwcClient',function(scope, client) {
                scope.connected = false;

                this.isConnected = function () {
                    return scope.connected;
                };

                var watchRequest = {
                    dst: 'data.api',
                    action: 'watch',
                    resource: '/data/option'
                };


                client.send(watchRequest, function (reply) {
                        if(reply.src!==null){
                            scope.optionData = reply.entity.newValue;
                            scope.connected = true;
                        }
                        scope.$apply();
                    return true;
                });

               
            }],
            controllerAs: "iwcCtrl"
        };
    });

    app.controller("HedgeController", [ '$scope','iwcClient',function(scope, client) {
        this.riskLevel = {"background-color": "#008000"};
        this.buyCover = "BUY";
        this.sellShort = "SHORT";
        this.deltaNeutral = 0;
        this.stocksHeld = 0;
        this.stocksNeeded = 0;

        this.updateRiskColor = function (val) {
            var R,G;
            var R,G;
            R = parseInt((255*val).toFixed(0));
            G = parseInt((128*(1-val)).toFixed(0));
            R = R.toString(16);
            G = G.toString(16);

            if(R.length===1)
                R="0"+R;
            if(G.length===1)
                G="0"+G;

            return ("#"+R+G+"00");
        };

        this.updateRisk = function () {
            var currentRisk = 0;

            if(scope.optionData){
                var gran = (Math.abs(this.deltaNeutral)>255) ? 255 : this.deltaNeutral;
                currentRisk = Math.abs((this.deltaNeutral - this.stocksHeld) / gran);
                console.log(currentRisk);
            }
            if (currentRisk > 1)
                currentRisk = 1;

            this.riskLevel = {"background-color": this.updateRiskColor(currentRisk),"color":"white"};

        };


        this.updateStocks = function (val) {
            this.stocksHeld += val;

            if(this.stocksHeld < 0) {
                this.buyCover = "COVER";
                this.sellShort = "SHORT";
            } else if(this.stocksHeld === 0) {
                this.buyCover = "BUY";
                this.sellShort = "SHORT";
            } else {
                this.buyCover = "BUY";
                this.sellShort = "SELL";
            }

            this.updateStocksNeeded();
        };

        this.updateStocksNeeded = function () {
            try {
                this.stocksNeeded = scope.optionData.deltaNeutral - this.stocksHeld;
                this.deltaNeutral = scope.optionData.deltaNeutral;
            } catch (err) {
                this.stocksNeeded = 0;
            }
            this.updateRisk();
        };


        this.newDataUpdate = function () {
            console.log("updated");
            this.updateStocksNeeded();
            this.updateRisk();

        };

        this.hedge = function () {
            this.updateStocks(this.stocksNeeded);
        };

        var that = this;

        scope.$watch('optionData', function () {
            that.newDataUpdate();
        });


    }]);
})();