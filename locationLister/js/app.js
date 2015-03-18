var locationLister = angular.module('LocationLister', [
    'ozpIwcClient',
    'ui.bootstrap'
]);
locationLister.controller('MainController', ['ozpIwcClient']);

locationLister.controller('MainController', function($scope, $log, $modal, iwcConnectedClient) {
    $scope.id = 0;
    $scope.locations = {};
    $scope.client = iwcConnectedClient;
    $scope.mapHandlers = [];
    $scope.analyzeHandlers = [];


/**
 * UI-only functionality
 */
    $scope.mapDisabled = function(){
        return !($scope.mapHandlers.length > 0 && $scope.currentLocationId);
    };
    $scope.analyzeDisabled = function(){
        return !($scope.analyzeHandlers.length > 0 && $scope.currentLocationId);
    };

    $scope.locationModal = function(listing){
        var modalInstance = $modal.open({
            templateUrl: "templates/modal.html",
            controller: "EditController",
            resolve: {
                listing: function () {
                    return listing;
                }
            }
        });

        return modalInstance.result;
    };

    $scope.handleLocationSelect = function(key) {
        $scope.currentLocation = $scope.locations[key];
        $scope.currentLocationId = key;

        if ($scope.lastSelected) {
            $scope.lastSelected.selected = '';
        }
        this.selected = 'selected';
        $scope.lastSelected = this;
    };

    $scope.clearLocationSelect = function() {
        $scope.currentLocation = {};
        $scope.currentLocationId = "";
    };

    $scope.isValidListing = function(listing){
        if(listing && typeof listing.title !== 'undefined' && listing.coords
            && typeof listing.coords.lat !== 'undefined' && typeof listing.coords.long !== 'undefined'){
            return true;
        } else {
            return false;
        }
    };
/**
 * IWC Non-Recurring Actions
 */
    $scope.getListings = function(){
        return $scope.client.api('data.api').list('/locationLister/listings').then(function(reply) {
            if (Array.isArray(reply.entity) && reply.entity.length > 0) {
                var promises = [];
                reply.entity.forEach(function (listing) {
                    var curPromise = $scope.client.api('data.api').get(listing).then(function (reply) {
                        $log.debug(listing, reply);
                        if($scope.isValidListing(reply.entity)) {
                            $scope.locations[listing] = reply.entity;
                        }
                    });
                    promises.push(curPromise);
                });
                return Promise.all(promises);
            }
        });
    };


    $scope.addListing = function(listing){
        listing = listing || {};
        return $scope.locationModal(listing).then(function (output) {
            return $scope.client.api('data.api').addChild('/locationLister/listings', {entity:  output.listing});
        });
    };

    $scope.invokeMap = function(listingResource) {
        return $scope.client.api('intents.api').invoke("/json/coord/map", {entity: listingResource})['catch'](function(er){
            $log.debug(er);
        });
    };

    $scope.invokeAnalyze = function(coords) {
        return $scope.client.api('intents.api').invoke("/json/coord/analyze", {entity: coords})['catch'](function(er){
            $log.debug(er);
        });
    };

    $scope.editSelectedLocation = function() {
        if($scope.currentLocationId) {
            var id = $scope.currentLocationId;

            $scope.locationModal($scope.currentLocation).then(function (output) {
                $scope.client.api('data.api').set(id,{entity: output.listing});
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
    };

/**
 * IWC Recurring Actions
 */
    $scope.regulateMapping = function(){
        $scope.client.api('intents.api').get("/json/coord/map").then(function(response){
            $scope.mapHandlers = response.entity.handlers;
            $scope.$apply();
            return $scope.client.api('intents.api').watch("/json/coord/map",function(event){
                $scope.mapHandlers = event.entity.newValue.handlers;
                $scope.$apply();
            });
        });
    };
    $scope.regulateAnalyzing = function(){
        $scope.client.api('intents.api').get("/json/coord/analyze").then(function(response){
            $scope.analyzeHandlers = response.entity.handlers;
            $scope.$apply();
            return $scope.client.api('intents.api').watch("/json/coord/analyze",function(event){
                $scope.analyzeHandlers = event.entity.newValue.handlers;
                $scope.$apply();
            });
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
            if(listingResource === $scope.currentLocationId){
                $scope.currentLocationId = '';
                $scope.currentLocation = {};
            }
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

    $scope.regulateListings = function(){
        return $scope.getListings().then($scope.watchListings);
    };

    $scope.registerSaving = function(){
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

        return $scope.client.api('intents.api').register("/json/coord/save",{
            entity: {
                icon : newPath + "/icon.png",
                label: "Location Lister"
            }
        },savingIntent);
    };


/*
 * Controller Init
 */
    $scope.registerSaving()
        .then($scope.regulateMapping)
        .then($scope.regulateAnalyzing)
        .then($scope.regulateListings)
        .then(function(){
            $log.debug("Connected! address:", iwcConnectedClient.address);
            $scope.$apply();
        });



});

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


locationLister.controller('EditController', function($scope, $modalInstance,listing) {
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

    $scope.ok = function () {
        $modalInstance.close({listing: $scope.listing});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});