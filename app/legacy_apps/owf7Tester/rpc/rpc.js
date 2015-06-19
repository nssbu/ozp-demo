'use strict';

angular.module('owf7Tester.rpc', []);

angular.module('owf7Tester.rpc')
	.controller('RpcCtrl', function($scope, $rootScope, $state, $log) {
		$log.info('RPC Ctrl');
		$scope.pageName = 'RPC';
	});