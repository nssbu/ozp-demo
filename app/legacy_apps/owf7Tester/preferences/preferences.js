'use strict';

angular.module('owf7Tester.preferences', []);

angular.module('owf7Tester.preferences')
	.controller('PreferencesCtrl', function($scope, $rootScope, $state, $log) {
		$log.info('Preferences Ctrl');
		$scope.pageName = 'Preferences';
	});