(function () {
    'use strict';

    var app = angular.module('appManager', ['ozpIwcClient']);

//    app.service('ozpClient', [ 'ozpIwc', '$rootScope', function (ozpIwc, $rootScope) {
//        var client = new ozpIwc.Client({peerUrl: "http://" + window.location.hostname + ":8080/peer"});
//
//        client.on("connected", function () {
//            $rootScope.$broadcast('connected');
//        });
//
//        return client;
//    }]);

    app.directive("tableTabs", function () {
        return {
            restrict: 'E',
            templateUrl: "partials/tabs.html",
            controller: function ($scope) {
                this.cpTab = 1;
                this.ghTab = 2;

                this.isCPSet = function (checkTab) {
                    return this.cpTab === checkTab;
                };

                this.isGHSet = function (checkTab) {
                    return this.ghTab === checkTab;
                };

                this.setCPTab = function (setTab) {
                    this.cpTab = setTab;
                };

                this.setGHTab = function (setTab) {
                    this.ghTab = setTab;
                };
            },
            controllerAs: "tab"
        }
    });

    app.controller("DataController", [ '$scope','iwcClient',function(scope,iwcClient) {

        scope.client = new iwcClient.Client({peerUrl: '../bower_components/ozp-iwc/dist'});

        this.data = {
            optionType: 'c',
            stock: 100,
            strike: 94,
            volatility: .27,
            timeToExpiry: 25,
            interestRate: .0001
        };

        this.greekData = {
            optionValue: 0,
            delta: 0,
            gamma: 0,
            theta: 0,
            rho: 0,
            vega: 0
        };

        this.neutralData = {
            numberOfOptions: 10,
            deltaNeutral: 0,
            costOfHedge: 0
        };

        this.payout = function () {
            var dist = Math.abs(this.data.strike - this.data.stock);
            if (dist > 100) { 
                dist = 50;
            }
            if (dist === 0) {
                dist = 10;
            }
            var min = this.data.strike - dist * 2, max = this.data.strike + dist * 2;
            min = Math.max(min, 0);

            var payoffJson = JSON.parse('[]');

            //Hockey stick dat
            if (this.data.optionType === 'c') {
                for (var i = min; i < max; i = i + dist / 100) {
                    //facing up
                    var pay = Math.max(i - this.data.strike, 0) - this.greekData.optionValue;
                    payoffJson.push({"x": i, "y": pay});
                }
            } else {
                for (var i = min; i < max; i = i + dist / 100) {
                    //facing down
                    var pay = Math.max(this.data.strike - i, 0) - this.greekData.optionValue;
                    payoffJson.push({"x": i, "y": pay});
                }
            }

            scope.payoutData = payoffJson;
        };


        this.calculate = function () {
            var time = this.data.timeToExpiry / 365;

            this.greekData.optionValue = BlackScholes(this.data.optionType, this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(4);

            if (this.data.optionType === 'c') {
                this.greekData.delta = deltaCall(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.gamma = gammaCall(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.theta = thetaCall(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.rho = rhoCall(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.vega = vegaCall(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
            } else {
                this.greekData.delta = deltaPut(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.gamma = gammaPut(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.theta = thetaPut(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.rho = rhoPut(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
                this.greekData.vega = vegaPut(this.data.stock, this.data.strike, time, this.data.interestRate, this.data.volatility).toFixed(5);
            }
            this.neutralData.deltaNeutral = Math.round(-this.greekData.delta * this.neutralData.numberOfOptions * 100);
            this.neutralData.costOfHedge = (this.neutralData.deltaNeutral * this.data.stock + this.greekData.optionValue * this.neutralData.numberOfOptions).toFixed(2);

            scope.optionData = this.neutralData;

            this.payout();
        };



        scope.$watch('payoutData', function () {

            var setRequest = {
                dst: "data.api",
                action: "set",
                resource: "/data/plot",
                entity: scope.payoutData
            };

            var setRequest2 = {
                dst: "data.api",
                action: "set",
                resource: "/data/option",
                entity: scope.optionData
            };
            scope.client.connect()
               .then(scope.client.send(setRequest))
               .then(scope.client.send(setRequest2))
               .then(function (reply) {
                    console.log("sent option data");
            });
        });

    }]);


})();

