angular.module('Owf7Tester', [
  'ui.router',
  'ui.bootstrap',
  'owf7Tester.preferences',
  'owf7Tester.launcher',
  'owf7Tester.rpc',
  'owf7Tester.intents',
  'owf7Tester.eventing',
  'owf7Tester.other'
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

    var eventingState = {
      name: 'eventing',
      url: '/eventing',
      templateUrl: 'eventing/eventing.tpl.html',
      controller: 'EventingCtrl'
    };

    states.push(eventingState);

    var rpcState = {
      name: 'rpc',
      url: '/rpc',
      templateUrl: 'rpc/rpc.tpl.html',
      controller: 'RpcCtrl'
    };

    states.push(rpcState);

    var intentsState = {
      name: 'intents',
      url: '/intents',
      templateUrl: 'intents/intents.tpl.html',
      controller: 'IntentsCtrl'
    };

    states.push(intentsState);

    var otherState = {
      name: 'other',
      url: '/other',
      templateUrl: 'other/other.tpl.html',
      controller: 'OtherCtrl'
    };

    states.push(otherState);

    angular.forEach(states, function(state) { $stateProvider.state(state); });
    $urlRouterProvider.otherwise('/');
})
.run(function run($rootScope, $state, $log) {
  //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
  OWF.relayFile = '../js/eventing/rpc_relay.uncompressed.html';
});

