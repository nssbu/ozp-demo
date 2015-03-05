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
    $scope.id = 0;
    $scope.locations = {};
    $scope.client = iwcConnectedClient;

    $scope.getListings = function(){
        return $scope.client.connect().then(function(){
            return $scope.client.api('data.api').list('/myLocations/listings');
        }).then(function(reply) {
            if (Array.isArray(reply.entity) && reply.entity.length > 0) {
                var promises = [];
                reply.entity.forEach(function (listing) {
                    var curPromise = $scope.client.api('data.api').get(listing).then(function (reply) {
                        console.log(listing, reply);
                        $scope.locations[listing] = reply.entity;
                    });
                    promises.push(curPromise);
                });
                return Promise.all(promises);
            }
        });
    };

    $scope.watchListings = function(){
        var handleAddition = function(listingResource) {
            return $scope.client.connect().then(function() {
                return $scope.client.api('data.api').get(listingResource)
            }).then(function(reply){
                $scope.locations[listingResource] = reply.entity;
            });
        };

        var handleRemoval = function(listingResource) {
            delete $scope.locations[listingResource];
        };

        var onChange = function(reply) {
            var promises = [];
            reply.entity.addedChildren.forEach(function(listing){
                promises.push(handleAddition(listing));
            });
            reply.entity.removedChildren.forEach(function(listing){
                promises.push(handleRemoval(listing));
            });
            console.log(reply);
            Promise.all(promises).then(function(){
                $scope.$apply();
            })
        };

        return $scope.client.connect().then(function() {
            return $scope.client.api('data.api').watch('/myLocations/listings',onChange);
        });
    };

    $scope.addListing = function(){
        var listing = {
            'title': " Location id:" + $scope.id++,
            'coords': {
                'lat': Math.random() * 100,
                'long': Math.random() * 100
            },
            'description': "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
        };

        return $scope.client.connect().then(function() {
            return $scope.client.api('data.api').addChild('/myLocations/listings', {entity: listing});
        });
    };
    $scope.invokeMap = function(listing) {
        return $scope.client.connect().then(function () {
            return $scope.client.api('intents.api').invoke("/json/coord/map", {entity: listing});
        });
    };

    // TODO: broken
    $scope.handleLocationSelect = function(title) {
        $log.debug('$scope.locations: ' + JSON.stringify($scope.locations));
        for (var i=0; i < $scope.locations.length; i++) {
            if ($scope.locations[i].title === title) {
                $scope.currentLocation = $scope.locations[i];
            }
        }
    };

    $scope.getListings()
        .then($scope.watchListings)
        .then(function(){
            console.log("Connected! address:", iwcConnectedClient.address);
        });
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