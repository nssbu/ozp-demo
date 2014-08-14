'use strict';

/* Directives */


angular.module('myApp.directives', []).
 directive('incidentItem', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/incidentLine.html',
      scope: {
          incident: "=incident"
      },
      link: function (scope, element) {
        console.log("Directive for ",scope.incident);
      }
    };
 });
