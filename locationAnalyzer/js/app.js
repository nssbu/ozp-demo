var locationAnalyzer = angular.module('LocationAnalyzer', [
    'ozpIwcClient',
    'ui.bootstrap'
]);
locationAnalyzer.controller('MainController', ['ozpIwcClient']);

locationAnalyzer.factory("iwcConnectedClient",function($location,$window, iwcClient) {
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
    console.log('LocationAnalyzer using IWC bus: ' + ozpBusInfo.url);
    return new iwcClient.Client({
        peerUrl: ozpBusInfo.url
    });
});

locationAnalyzer.controller('MainController', function($scope, $log, iwcConnectedClient) {
    $scope.update = function(){
        $scope.output = {
            'Hemisphere': $scope.getHemisphere(),
            'Latitude': $scope.lat,
            'Longitude': $scope.long,
            'Distance from Equator': $scope.getDistance(0,0),
            'Distance from North Pole': $scope.getDistance(90,0),
            'Distance from South Pole': $scope.getDistance(-90,0)
        };
        $scope.updateData();
    };

    $scope.getHemisphere = function(){
        var ns = "";
        var ew = "";

        switch (true){
            case $scope.lat === 0:
                ns = "On the equator";
                break;
            case $scope.lat > 0:
                ns = "In the northern hemisphere";
                break;
            default:
                ns = "In the southern hemisphere";
                break;
        }

        switch (true){
            case $scope.long === 0:
                ew = " and on the prime meridian.";
                break;
            case $scope.long === 180 || $scope.long === -180:
                ew = " and on the antimeridian";
            case $scope.long > 0:
                ew = " and in the eastern hemisphere.";
                break;
            default:
                ew = " and in the western hemisphere.";
                break;
        }

        return ns+ew;
    };

    $scope.getTimezone = function(){
        return "EST";
    };

    $scope.toRad = function(num){
        return num * (Math.PI / 180);
    };

    /**
     * Credit : http://www.movable-type.co.uk/scripts/latlong.html
     * @param lat
     * @param long
     * @param percision
     * @returns {string}
     */
    $scope.getDistance = function(lat,long,percision){
        percision = percision || 2;
        var R = 6371000; // metres
        var a1 = $scope.toRad($scope.lat);
        var a2 = $scope.toRad(lat);
        var delta_a = $scope.toRad(lat-$scope.lat);
        var delta_l = $scope.toRad(long-$scope.long);

        var a = Math.sin(delta_a/2) * Math.sin(delta_a/2) +
            Math.cos(a1) * Math.cos(a2) *
            Math.sin(delta_l/2) * Math.sin(delta_l/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var meters = (R *c);
        if(meters < 1000){
            return (R * c).toFixed(percision) + " m";
        } else {
            return (R * c).toFixed(percision)/1000 + " km";
        }
    };

    $scope.invokeSave = function() {
        var formatted = {
            title: "Saved from LocationAnalyzer",
            coords: {
                lat: $scope.lat,
                long: $scope.long
            }
        };
        return $scope.client.api('intents.api').invoke("/json/coord/save", {entity: formatted})['catch'](function(er){
            console.log(er);
        });
    };

    $scope.updateData = function(){
        if($scope.dataApiRes) {
            var formatted = {
                title: "Analyzer data point.",
                coords: {
                    lat: $scope.lat,
                    long: $scope.long
                }
            };
            return $scope.client.data().set($scope.dataApiRes, {entity: formatted});
        } else {
            return Promise.resolve();
        }
    };

    $scope.createDataResource = function(){
        return $scope.client.data().set('/locationAnalyzer', {lifespan: "bound"}).then(function() {
            return $scope.client.data().addChild("/locationAnalyzer", {lifespan: "bound"})
        }).then(function (res) {
            $scope.dataApiRes = res.entity.resource;
        })['catch'](function(err){
            console.log(err);
        });
    };

    $scope.registerAnalyzing = function(){
        var analyzingIntent = function(event){
            // This intent is expected to receive a JSON Object to prefill its add location modal.
            var payload = event.entity;
            if(payload && (typeof payload.lat !== "undefined") && (typeof payload.long !== "undefined")) {
                $scope.lat = payload.lat;
                $scope.long = payload.long;
                $scope.$apply($scope.update);
            } else {
                console.log("Invalid format received for /json/coord/analyze");
            }

        };
        var removeAt = window.location.href.indexOf('/index.html');
        var newPath = window.location.href.substring(0,removeAt);
        if(removeAt < 0 &&window.location.href[window.location.href.length-1] === '/'){
            newPath = window.location.href.substring(0,window.location.href.length-1);
        }
        return $scope.client.api('intents.api').register("/json/coord/analyze",{
            contentType: "application/vnd.ozp-iwc-intent-handler-v1+json",
            entity: {
                icon : newPath + "/icon.png",
                label: "Location Viewer"
            }
        },analyzingIntent);

    };
    $scope.regulateSaves = function(){
        $scope.client.api('intents.api').list("/json/coord/save/").then(function(response){
            $scope.saveHandlers = response.entity.handlers;
            $scope.$apply();
            return $scope.client.api('intents.api').watch("/json/coord/save",function(event){
                $scope.saveHandlers = event.entity.newValue.handlers;
                $scope.$apply();
            });
        });
    };

    $scope.client = iwcConnectedClient;
    $scope.saveHandlers =[];
    $scope.lat = 0;
    $scope.long = 0;
    $scope.output = {
        'Hemisphere': $scope.getHemisphere(),
        'Latitude': $scope.lat,
        'Longitude': $scope.long,
        'Distance from Equator': $scope.getDistance(0,0),
        'Distance from North Pole': $scope.getDistance(90,0),
        'Distance from South Pole': $scope.getDistance(-90,0)
    };

    $scope.createDataResource().then($scope.registerAnalyzing).then($scope.regulateSaves);
});