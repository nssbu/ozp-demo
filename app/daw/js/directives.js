'use strict';

/* Directives */


angular.module('ozpDemo.DataAugmentationWebtop').
 directive('widget', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/widget.html',
      scope: true
//      controller: ['$scope','iwcClient',function(scope,client) {
//      }]
    };
 });
