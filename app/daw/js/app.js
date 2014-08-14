'use strict';


// Declare app level module which depends on filters, and services
angular.module('ozpDemo.DataAugmentationWebtop', [
  'ngRoute',
  'ui.bootstrap',
  'ozpIwc',
  'gridster'
]).run(['gridsterConfig',function(gridster) {
        gridster.width='auto';
        gridster.height='auto';
        gridster.columns=6;
}]);
