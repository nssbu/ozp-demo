var locationLister = angular.module('LocationLister', [
    'ozpIwcClient',
    'angularModalService'
]);
locationLister.controller('MainController', ['ozpIwcClient','angularModalService']);

locationLister.factory("iwcConnectedClient",function($location,$window, iwcClient) {
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
    console.log('LocationLister using IWC bus: ' + ozpBusInfo.url);
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
            console.log(reply);
            Promise.all(promises).then(function(){
                $scope.$apply();
            })
        };

        return $scope.client.api('data.api').watch('/locationLister/listings',onChange);
    };

    $scope.addListing = function(){

        return ModalService.showModal({
            templateUrl: "templates/modal.html",
            controller: "EditController",
            inputs: {
                listing: {}
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
            console.log(er);
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
            console.log("Connected! address:", iwcConnectedClient.address);
            $scope.$apply();
        });
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
    $scope.listing = listing;
    $scope.close = function(result) {
        if(result){

            close({listing: $scope.listing}, 500); // close, but give 500ms for bootstrap to animate
        } else {
            close(result,500);
        }
    };

}]);