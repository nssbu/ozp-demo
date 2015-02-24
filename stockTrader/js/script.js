(function () {
    'use strict';

    var app = angular.module('appTitude', ['ngAnimate', 'ozpIwcClient']);

    app.controller("HedgeController", [ '$scope','iwcClient',function(scope, iwcClient) {
        scope.isConnected = false;

        var client = new iwcClient.Client({peerUrl: '../bower_components/ozp-iwc/dist'});
        client.connect().then(function(){
            scope.isConnected = true;
            client.api('data.api').watch('/data/option', function (reply) {
                    scope.optionData = reply.entity.newValue;
            });
        });

        scope.riskLevel = {"background-color": "#008000"};
        scope.buyCover = "BUY";
        scope.sellShort = "SHORT";
        scope.deltaNeutral = 0;
        scope.stocksHeld = 0;
        scope.stocksNeeded = 0;

        scope.updateRiskColor = function (val) {
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

        scope.updateRisk = function () {
            var currentRisk = 0;

            if(scope.optionData){
                var gran = (Math.abs(scope.deltaNeutral)>255) ? 255 : scope.deltaNeutral;
                currentRisk = Math.abs((scope.deltaNeutral - scope.stocksHeld) / gran);
                console.log(currentRisk);
            }
            if (currentRisk > 1)
                currentRisk = 1;

            scope.riskLevel = {"background-color": scope.updateRiskColor(currentRisk),"color":"white"};

        };


        scope.updateStocks = function (val) {
            scope.stocksHeld += val;

            if(scope.stocksHeld < 0) {
                scope.buyCover = "COVER";
                scope.sellShort = "SHORT";
            } else if(scope.stocksHeld === 0) {
                scope.buyCover = "BUY";
                scope.sellShort = "SHORT";
            } else {
                scope.buyCover = "BUY";
                scope.sellShort = "SELL";
            }

            scope.updateStocksNeeded();
        };

        scope.updateStocksNeeded = function () {
            try {
                scope.stocksNeeded = scope.optionData.deltaNeutral - scope.stocksHeld;
                scope.deltaNeutral = scope.optionData.deltaNeutral;
            } catch (err) {
                scope.stocksNeeded = 0;
            }
            scope.updateRisk();
        };


        scope.newDataUpdate = function () {
            console.log("updated");
            scope.updateStocksNeeded();
            scope.updateRisk();

        };

        scope.hedge = function () {
            scope.updateStocks(scope.stocksNeeded);
        };


        scope.$watch('optionData', function () {
            scope.newDataUpdate();
        });


    }]);
})();