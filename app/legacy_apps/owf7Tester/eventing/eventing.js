'use strict';

angular.module('owf7Tester.eventing', []);

angular.module('owf7Tester.eventing')
	.controller('EventingCtrl', function($scope, $rootScope, $state, $log) {
		$log.info('Eventing Ctrl');
		$scope.pageName = 'Eventing';
	});