'use strict';

var locationAnalyzer = angular.module('LocationAnalyzer', [
  'ozpIwcClient',
  'ui.bootstrap'
]);
locationAnalyzer.controller('MainController', ['ozpIwcClient']);

locationAnalyzer.controller('MainController', function($scope, $log, iwc) {

  $scope.saveHandlers = [];
  $scope.lat = 0;
  $scope.long = 0;

  //=======================================
  // Save Handler Count: Number of remote handlers
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/save
  // Collects: /json/coord/save/*
  //=======================================
  $scope.saveRef = new iwc.intents.Reference("/json/coord/save", {
    collect: true
  });

  var onSaveColChange = function(changes) {
    $scope.saveHandlers = changes.newCollection;
    $scope.$apply();
  };

  $scope.saveRef.watch(onSaveColChange);

  // Get the initial collection
  $scope.saveRef.list().then(function(collection) {
    $scope.saveHandlers = collection;
    $scope.$apply();
  });

  //=======================================
  // Invoke Remote Saving
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/save
  //=======================================
  $scope.saveRef = new iwc.intents.Reference("/json/coord/save");
  $scope.invokeSave = function() {
    var formatted = {
      title: "Saved from LocationAnalyzer",
      coords: {
        lat: $scope.lat,
        long: $scope.long
      }
    };
    $scope.saveRef.invoke(formatted).catch(function(er) {
      $log.error(er);
    });
  };



  //=======================================
  // Analyze Shared Functionality
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/analyze
  //=======================================
  $scope.analyzeRef = new iwc.intents.Reference("/json/coord/analyze");

  // Runtime-generated url for the icon in the intent's metaData.
  var iconPath = (function() {
    var removeAt = window.location.href.indexOf('/index.html');
    var newPath = window.location.href.substring(0, removeAt);
    if (removeAt < 0 && window.location.href[window.location.href.length - 1] === '/') {
      newPath = window.location.href.substring(0, window.location.href.length - 1);
    }
    return newPath + "/icon.png";
  }());

  var metaData = {
    icon: iconPath,
    label: "Location Analyzer"
  };

  var analyze = function(coord) {
    // This intent is expected to receive a JSON Object to prefill its add location modal.
    if (coord && (typeof coord.lat !== "undefined") && (typeof coord.long !== "undefined")) {
      $scope.lat = coord.lat;
      $scope.long = coord.long;
      $scope.$apply($scope.update);
    } else {
      console.log("Invalid format received for /json/coord/analyze");
    }

  };

  $scope.analyzeRef.register(metaData, analyze);

  //=======================================
  // Analysis logic
  //
  // IWC References: none
  //=======================================
  $scope.update = function() {
    $scope.output = {
      'Hemisphere': $scope.getHemisphere(),
      'Latitude': $scope.lat,
      'Longitude': $scope.long,
      'Equator': $scope.getDistance(0, 0),
      'North Pole': $scope.getDistance(90, 0),
      'South Pole': $scope.getDistance(-90, 0)
    };
  };

  $scope.getHemisphere = function() {
    var ns = "";
    var ew = "";

    switch (true) {
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

    switch (true) {
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

    return ns + ew;
  };

  $scope.getTimezone = function() {
    return "EST";
  };

  $scope.toRad = function(num) {
    return num * (Math.PI / 180);
  };

  /**
   * Credit : http://www.movable-type.co.uk/scripts/latlong.html
   * @param lat
   * @param long
   * @param percision
   * @returns {string}
   */
  $scope.getDistance = function(lat, long, percision) {
    percision = percision || 2;
    var R = 6371000; // metres
    var a1 = $scope.toRad($scope.lat);
    var a2 = $scope.toRad(lat);
    var delta_a = $scope.toRad(lat - $scope.lat);
    var delta_l = $scope.toRad(long - $scope.long);

    var a = Math.sin(delta_a / 2) * Math.sin(delta_a / 2) +
      Math.cos(a1) * Math.cos(a2) *
      Math.sin(delta_l / 2) * Math.sin(delta_l / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var meters = (R * c);
    if (meters < 1000) {
      return (R * c).toFixed(percision) + " m";
    } else {
      return (R * c).toFixed(percision) / 1000 + " km";
    }
  };

  $scope.output = {
    'Hemisphere': $scope.getHemisphere(),
    'Latitude': $scope.lat,
    'Longitude': $scope.long,
    'Equator': $scope.getDistance(0, 0),
    'North Pole': $scope.getDistance(90, 0),
    'South Pole': $scope.getDistance(-90, 0)
  };
});

// This factory adds wrappings around the IWC client generation to allow
// query param bus selection and logs the Bus/Address upon connection.
//
// For most applications using the "ozpIwcClient" module is sufficient
// to receive the IWC Library.
locationAnalyzer.factory("iwc", function($location, $window, $log, iwcClient) {

  // Added functionality to allow the application to connect to a different IWC Bus
  // if "?ozpIwc.peer=<encodeURIComponent of the Bus URL>" is appended to
  // the application url.
  var ozpIwcPeerUrl = '';
  var queryParams = $location.search();
  if (queryParams.hasOwnProperty('ozpIwc.peer')) {
    ozpIwcPeerUrl = queryParams['ozpIwc.peer'];
    $log.debug('found IWC bus in query param: ' + ozpIwcPeerUrl);
  } else {
    ozpIwcPeerUrl = $window.OzoneConfig.iwcUrl;
  }

  var iwc = new iwcClient.Client(ozpIwcPeerUrl);

  iwc.connect().then(function() {
    $log.debug("Connected to IWC Bus: " + ozpIwcPeerUrl + "\nIWC Address: ", iwc.address);
  });

  return iwc;
});
