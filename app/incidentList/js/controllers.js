'use strict';

/* Controllers */

angular.module('ozpDemoIncidentList').controller('IncidentListController', [
    '$scope','incidentData', function($scope,incidentData) {
        $scope.incidents=incidentData;
  }]);
