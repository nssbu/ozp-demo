'use strict';

/* Controllers */

angular.module('myApp.controllers', [
    
]).controller('IncidentListController', ['$scope', function($scope) {
        $scope.incidents=[
                { title: "foo1" },
                { title: "foo2" },
                { title: "foo3" },
                { title: "foo4" }
            ];
        
  }]);
