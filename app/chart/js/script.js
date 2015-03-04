'use strict';

var app = angular.module("myApp", ['ozpIwcClient']);

app.controller('LineChartController', [ '$scope','iwcClient',function(scope, iwcClient) {

    scope.data = {};

    scope.address = null;

    var client = new iwcClient.Client({peerUrl: '../bower_components/ozp-iwc/dist'});

    client.connect().then(function(){
        scope.address = client.address;
        // set the initial value
        client.api("data.api").get('/data/plot').then(function(reply){
            scope.$apply(function(){
                scope.data = reply.entity || [{'x':0, 'y': 0}, {'x': 100, 'y':0}];
            });

            // then watch for any changes
            return client.api("data.api").watch('/data/plot',function(reply){
                scope.$apply(function () {
                    scope.data = reply.entity.newValue;
                });
            });
        });


    });


}]);

app.directive('lineChart', function () {
    function link(scope, el) {

        var el = el[0];
        var width = el.clientWidth;
        var height = el.clientHeight;

        var margin = {top: 20, right: 20, bottom: 30, left: 50};
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;


        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function (d) {
                return x(d.x);
            })
            .y(function (d) {
                return y(d.y);
            });

        scope.$watch('data', function (data) {

            d3.select(el).select("svg")
                .remove();
            var svg = d3.select(el).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            d3.json(scope.data, function (error, data) {
                data = scope.data;
                x.domain(d3.extent(data, function (d) {
                    return d.x;
                }));
                y.domain(d3.extent(data, function (d) {
                    return d.y;
                }));

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("transform", "rotate(0)")
                    .attr("x", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "middle")
                    .text("Stock ($)");

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Payoff ($)");

                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("transform", null)
                    .transition()
                    .duration(500)
                    .ease("linear");

            })
        });
    }

    return{
        link: link,
        restrict: 'E',
        scope: {data: '='}
    }

});