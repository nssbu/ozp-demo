'use strict';


// Declare app level module which depends on filters, and services
var dawModule=angular.module('ozpDemo.DataAugmentationWebtop', [
  'ngRoute',
  'ui.bootstrap',
  'ozpIwc',
  'gridster'
]).run(['gridsterConfig',function(gridster) {
        gridster.width='auto';
        gridster.height='auto';
        gridster.columns=6;
}]);


dawModule.directive('widget', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/widget.html',
      scope: true
//      controller: ['$scope','iwcClient',function(scope,client) {
//      }]
    };
 });

dawModule.directive('contextResource', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/workContextArea.html',
      scope: true,
      controller: ['$scope','iwcClient',function(scope,client) {
              console.log("In work context, scope is ",scope);
      }]
    };
 });
 
dawModule.controller('TileController', [
   '$scope',"iwcClient",function(scope,client) {
 }]);