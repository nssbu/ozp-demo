'use strict';

/* Directives */


angular.module('ozpDemoIncidentList').
 directive('incidentItem', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/incidentLine.html',
      scope: {
          incident: "=incident"
      },
      controller: ['$scope','iwcClient',function(scope,client) {
        scope.select=function() {
            if(scope.isopen) {
                client.send({
                    dst: "data.api",
                    action: "set",
                    resource: "/workContext",
                    entity:scope.incident
                });
            }
        };
      }]
    };
 });
