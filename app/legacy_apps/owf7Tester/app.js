angular.module('Owf7Tester', [
  'ui.router',
  'ui.bootstrap',
  'owf7Tester.preferences',
  'owf7Tester.launcher'
])
.config(function($stateProvider, $urlRouterProvider,
                 $logProvider) {

    $logProvider.debugEnabled(true);

    var states = [];

    var preferencesState = {
      name: 'preferences',
      url: '/preferences',
      templateUrl: 'preferences/preferences.tpl.html',
      controller: 'PreferencesCtrl'
    };
    states.push(preferencesState);

    var launcherState = {
      name: 'launcher',
      url: '/launcher',
      templateUrl: 'launcher/launcher.tpl.html',
      controller: 'LauncherCtrl'
    };
    states.push(launcherState);

    angular.forEach(states, function(state) { $stateProvider.state(state); });
    $urlRouterProvider.otherwise('/');
})
.run(function run($rootScope, $state, $log) {
  //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
  OWF.relayFile = '../js/eventing/rpc_relay.uncompressed.html';
});

