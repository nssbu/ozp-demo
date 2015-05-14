'use strict';

angular.module('owf7Tester.other', []);

angular.module('owf7Tester.other')
	.controller('OtherCtrl', function($scope, $rootScope, $state, $log) {
		$log.info('Other Ctrl');
		$scope.pageName = 'Other';
	});