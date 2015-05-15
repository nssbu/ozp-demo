'use strict';

angular.module('owf7Tester.preferences', []);

angular.module('owf7Tester.preferences')
	.controller('PreferencesCtrl', function($scope, $rootScope, $state, $log) {
		$log.info('Preferences Ctrl');
		$scope.pageName = 'Preferences';

		$scope.callFindWidgets = function(form) {
			$log.info('findWidgetsUserOnly: ' + $scope.findWidgetsUserOnly);
			$log.info('findWidgetsWidgetVersion: ' + $scope.findWidgetsWidgetVersion);
			$log.info('findWidgetsWidgetName: ' + $scope.findWidgetsWidgetName);
			$log.info('findWidgetsWidgetGuid: ' + $scope.findWidgetsWidgetGuid);
			$log.info('findWidgetsUniversalName: ' + $scope.findWidgetsUniversalName);
			$log.info('findWidgetsGroupId: ' + $scope.findWidgetsGroupId);

			OWF.Preferences.findWidgets({
                    searchParams: {
                        universalName: $scope.findWidgetsUniversalName
                    },
                    onSuccess: function (result) {
                        var guid;
                        if (result && result[0]) {
                            guid = result[0].id;

                           	$log.info('Found widget with guid: ' + guid);
                        } else {
                        	$log.warn('no widget found');
                        }

                    },
                    onFailure: function (err) {
                    	$log.error('Error invoking findWidgets: ' + err)
                        $scope.findWidgetsResponse = 'Failure: ' + err;
                        $rootScope.$apply();
                    }
                });
		};
	});