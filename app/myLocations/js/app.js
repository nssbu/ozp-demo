var myLocations = angular.module('MyLocations', [
    'ozpIwcClient'
]);
myLocations.controller('MainController', ['ozpIwcClient']);

myLocations.factory("iwcConnectedClient",function($location,$window, iwcClient) {
    var ozpIwcPeerUrl = '';
    var queryParams = $location.search();
    if (queryParams.hasOwnProperty('ozpIwc.peer')) {
        ozpIwcPeerUrl = queryParams['ozpIwc.peer'];
        console.log('found IWC bus in query param: ' + ozpIwcPeerUrl);
    } else {
        ozpIwcPeerUrl = $window.OzoneConfig.iwcUrl;
    }

    var ozpBusInfo = {
        'url': ozpIwcPeerUrl,
        'connected': false
    };

    ozpBusInfo.connected = false;
    console.log('MyLocations using IWC bus: ' + ozpBusInfo.url);
    return new iwcClient.Client({
        peerUrl: ozpBusInfo.url
    });
});

myLocations.controller('MainController', function($scope, $log, iwcConnectedClient) {
    iwcConnectedClient.connect().then(function(){
        console.log("Connected! address:", iwcConnectedClient.address);
        $scope.locations = [
            {
                'id': '0',
                'title': "My first location",
                'coords': {
                    'lat': -23.493,
                    'long': 45.324
                },
                'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
            },
            {
                'id': '1',
                'title': "My second location",
                'coords': {
                    'lat': 12.345,
                    'long': -34.390
                },
                'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
            },
            {
                'id': '2',
                'title': "My third location",
                'coords': {
                    'lat': 38.873,
                    'long': 5.432
                },
                'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
            },
            {
                'id': '3',
                'title': "My fourth location",
                'coords': {
                    'lat': 48.394,
                    'long': -23.295
                },
                'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
            },
            {
                'id': '4',
                'title': "My fifth location",
                'coords': {
                    'lat': 16.873,
                    'long': -54.394
                },
                'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
            }
        ];
        $scope.$apply();
    });

    $scope.handleLocationSelect = function(id) {
        for (var i=0; i < $scope.locations.length; i++) {
            if ($scope.locations[i].id === id) {
                $scope.currentLocation = $scope.locations[i];
            }
        }
    };

});


myLocations.directive( "locationList", function() {
    return {
        restrict: 'E',
        scope :{
            locations : "=locations",
            onselect: "=onselect"
        },
        templateUrl: 'templates/locationList.tpl.html'
    };
});