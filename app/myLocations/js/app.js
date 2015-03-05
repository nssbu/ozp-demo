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

myLocations.controller('MainController', function($scope, iwcConnectedClient) {
    iwcConnectedClient.connect().then(function(){
        console.log("Connected! address:", iwcConnectedClient.address);
        $scope.locations = {
            'id001': {
                'title': "My first location!",
                'coords': {
                    'lat': 100,
                    'long': 100
                },
                'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
            },
            'id002': {
                'title': "My second location!",
                'coords': {
                    'lat': 10,
                    'long': 10
                },
                'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
            }
        };

        $scope.$apply();
    });


});


myLocations.directive( "locationListing", function() {
    return {
        restrict: 'E',
        scope :{
            location : "=location"
        },
        templateUrl: 'templates/locationListing.tpl.html'
    };
});