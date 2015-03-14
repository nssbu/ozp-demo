var locationLister = angular.module('LocationLister', [
    'ozpIwcClient',
    'angularModalService'
]);
locationLister.controller('MainController', ['ozpIwcClient','angularModalService']);

locationLister.factory("iwcConnectedClient",function($location, $window, $log, iwcClient) {
    var ozpIwcPeerUrl = '';
    var queryParams = $location.search();
    if (queryParams.hasOwnProperty('ozpIwc.peer')) {
        ozpIwcPeerUrl = queryParams['ozpIwc.peer'];
        $log.debug('found IWC bus in query param: ' + ozpIwcPeerUrl);
    } else {
        ozpIwcPeerUrl = $window.OzoneConfig.iwcUrl;
    }

    var ozpBusInfo = {
        'url': ozpIwcPeerUrl,
        'connected': false
    };

    ozpBusInfo.connected = false;
    $log.debug('LocationLister using IWC bus: ' + ozpBusInfo.url);
    return new iwcClient.Client({
        peerUrl: ozpBusInfo.url
    });
});

locationLister.controller('MainController', function($scope, $log, iwcConnectedClient,ModalService) {
    $scope.id = 0;
    $scope.locations = {};
    $scope.client = iwcConnectedClient;

    $scope.getListings = function(){
        return $scope.client.api('data.api').list('/locationLister/listings').then(function(reply) {
            if (Array.isArray(reply.entity) && reply.entity.length > 0) {
                var promises = [];
                reply.entity.forEach(function (listing) {
                    var curPromise = $scope.client.api('data.api').get(listing).then(function (reply) {
                        $log.debug(listing, reply);
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
            return $scope.client.api('data.api').get(listingResource).then(function(reply){
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
            $log.debug(reply);
            Promise.all(promises).then(function(){
                $scope.$apply();
            })
        };

        return $scope.client.api('data.api').watch('/locationLister/listings',onChange);
    };

    $scope.addListing = function(listing){
        listing = listing || {};
        return ModalService.showModal({
            templateUrl: "templates/modal.html",
            controller: "EditController",
            inputs: {
                listing: listing
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    return $scope.client.api('data.api').addChild('/locationLister/listings', {entity: result.listing});
                }
            });
        });


    };
    $scope.invokeMap = function(listingResource) {
        return $scope.client.api('intents.api').invoke("/json/coord/map", {entity: listingResource})['catch'](function(er){
            $log.debug(er);
        });
    };

    $scope.handleLocationSelect = function(key) {
        $scope.currentLocation = $scope.locations[key];
        $scope.currentLocationId = key;
    };

    $scope.editSelectedLocation = function() {
        if($scope.currentLocationId) {
            var id = $scope.currentLocationId;
            // Just provide a template url, a controller and call 'showModal'.
            ModalService.showModal({
                templateUrl: "templates/modal.html",
                controller: "EditController",
                inputs: {
                    listing: $scope.currentLocation
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {
                        //$scope.locations[id] = result.listing;
                        $scope.client.api('data.api').set(id,{entity: result.listing});
                        //$scope.$apply();
                    }
                });
            });
        }

    };

    $scope.deleteSelectedLocation = function() {
        var removeResource = {
            resource: $scope.currentLocationId
        };
        return $scope.client.api('data.api').removeChild('/locationLister/listings', {entity: removeResource}).then(function(){
            return $scope.client.api('data.api').delete($scope.currentLocationId);
        });
        delete $scope.locations[$scope.currentLocationId];
    };

    $scope.getListings()
        .then($scope.watchListings)
        .then(function(){
            $log.debug("Connected! address:", iwcConnectedClient.address);
            $scope.$apply();
        });


    var savingIntent = function(event){
        // This intent is expected to receive a JSON Object to prefill its add location modal.
        var payload = event.entity;
        if(payload && payload.title && payload.coords) {
            $scope.addListing(payload);
        }

    };
    var removeAt = window.location.href.indexOf('/index.html');
    var newPath = window.location.href.substring(0,removeAt);
    if(removeAt < 0 &&window.location.href[window.location.href.length-1] === '/'){
        newPath = window.location.href.substring(0,window.location.href.length-1);
    }

    $scope.client.api('intents.api').register("/json/coord/save",{
        entity: {
            icon : newPath + "/icon.png",
            label: "Location Lister"
        }
    },savingIntent);
});


locationLister.directive( "locationList", function() {
    return {
        restrict: 'E',
        scope :{
            locations : "=locations",
            onselect: "=onselect"
        },
        templateUrl: 'templates/locationList.tpl.html'
    };
});


locationLister.controller('EditController', ['$scope', 'listing', 'close', function($scope, listing, close) {
    if(listing && listing.title && listing.coords){
        $scope.listing = listing;
    } else {
        $scope.listing = {
            title: '',
            coords: {
                lat: 0,
                long: 0
            },
            description: ''
        };
    }
    $scope.close = function(result) {
        if(result){

            close({listing: $scope.listing}, 500); // close, but give 500ms for bootstrap to animate
        } else {
            close(result,500);
        }
    };

}]);