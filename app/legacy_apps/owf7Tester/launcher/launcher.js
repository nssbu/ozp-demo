'use strict';

angular.module('owf7Tester.launcher', []);

angular.module('owf7Tester.launcher')
	.controller('LauncherCtrl', function($scope, $rootScope, $state, $log) {
		$log.info('Launcher Ctrl');
		$scope.pageName = 'Launcher';
	});