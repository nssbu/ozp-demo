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
        return $scope.client.api('data.api').bulkGet('/locationLister/listings').then(function(reply) {
            if (Array.isArray(reply.entity) && reply.entity.length > 0) {
                reply.entity.forEach(function (listing) {
                    if($scope.isValidListing(listing.entity)) {
                        $scope.locations[listing.resource] = listing.entity;
                    }
                });
            }
        });
    };


    $scope.addListing = function(listing){
        listing = listing || {};
        return $scope.locationModal(listing).then(function (output) {
            return $scope.client.api('data.api').addChild('/locationLister/listings', {entity:  output.listing}).then(function(){
                console.log(arguments)
            }).catch(function(e){
                console.log(e);
            });
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
        return $scope.client.api('data.api').delete($scope.currentLocationId);
    };

/**
 * IWC Recurring Actions
 */
    $scope.regulateMapping = function(){
         $scope.client.api('intents.api').watch("/json/coord/map",function(event){
            $scope.mapHandlers = event.entity.newCollection;
            $scope.$apply();
         }).then(function(response) {
             if (response.entity) {
                 $scope.mapHandlers = response.collection;
                 $scope.$apply();
             }
         });
    };

    $scope.regulateAnalyzing = function(){
        $scope.client.api('intents.api').watch("/json/coord/analyze",function(event){
            $scope.analyzeHandlers = event.entity.newCollection;
            $scope.$apply();
        }).then(function(response){
            if(response.entity) {
                $scope.analyzeHandlers = response.collection;
                $scope.$apply();
            }
        });
    };

    $scope.watchListings = function(){

        var onChange = function(reply) {
            var promises = [];
            reply.entity.newCollection.forEach(function(listing){
                promises.push($scope.client.data().get(listing));
            });
            $log.debug(reply);

            Promise.all(promises).then(function(listings){
                $scope.locations = {};
                for(var i in listings) {
                    $scope.locations[listings[i].resource] = listings[i].entity;
                }
                $scope.$apply();
            }).catch(function(err){
                console.log(err);
            });
        };

        return $scope.client.data().watch('/locationLister/listings',{},onChange).then(function(response){
            console.log(response);
            onChange({
                entity: {
                    newCollection: response.collection || []
                }
            });

        });
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
            contentType: "application/vnd.ozp-iwc-intent-handler-v1+json",
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