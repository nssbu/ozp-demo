'use strict';

angular.module('owf7Tester.intents', []);

angular.module('owf7Tester.intents')
	.controller('IntentsCtrl', function($scope, $rootScope, $state, $log) {
		$log.info('Intents Ctrl');
		$scope.pageName = 'Intents';
	});