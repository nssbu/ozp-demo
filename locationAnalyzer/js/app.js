'use strict';

var locationAnalyzer = angular.module('LocationAnalyzer', [
  'ozpIwcClient',
  'ui.bootstrap'
]);
locationAnalyzer.controller('MainController', ['ozpIwcClient']);

locationAnalyzer.controller('MainController', function($scope, $log, iwc) {

  $scope.lat = 0;
  $scope.long = 0;

  //=========================================
  // Save Functionality
  //=========================================
  $scope.save = new Intent("/json/coord/save");

  // The Location Lister expects the location data in the formatted structure.
  $scope.invokeSave = function() {
    var formatted = {
      title: "Saved from LocationAnalyzer",
      coords: {
        lat: $scope.lat,
        long: $scope.long
      }
    };

    // Run the save functionality on the Intent handler
    // Gather the new resource when successfull and make a UI notification
    $scope.save.run(formatted).then(function(value) {
      var locationRef = new iwc.data.Reference(value.resource);
      locationRef.get().then(function(value) {
        $.notify({
          message: "Location saved as: " + value.title
        });
      });
    }).catch(function(er) {
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
  var analyze = new Intent("/json/coord/analyze");


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

  var analyzeFn = function(coord) {
    // This intent is expected to receive a JSON Object to prefill its add location modal.
    if (coord && (typeof coord.lat !== "undefined") &&
      (typeof coord.long !== "undefined") &&
      -90 <= coord.lat <= 90 && -180 <= coord.lat <= 180) {
      $scope.lat = coord.lat;
      $scope.long = coord.long;
      $scope.$apply($scope.update);
    } else {
      $.notify({
        message: "Invalid format received",
      }, {
        type: 'danger'
      });
    }

  };

  analyze.register(metaData, analyzeFn);

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
        break;
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


  //=======================================
  // Intent: A wrapper for invoking remote functions
  //         as well as tracking the number of
  //         matching functions.
  //
  //=======================================
  function Intent(resource) {
    // collection enabled to tie # of handlers to the UI
    this.reference = new iwc.intents.Reference(resource, {
      collect: true
    });
    this.run = this.reference.invoke;
    this.register = this.reference.register;
    this.handlers = [];

    var self = this;

    var handleCollection = function(collection) {
      self.handlers = collection;
      $scope.$apply();
    };

    var onCollectionChange = function(changes) {
      handleCollection(changes.newCollection);
    };

    // Watch for updates the the collection
    this.reference.watch(onCollectionChange);
    // Get initial collection
    this.reference.list().then(handleCollection);
  }
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
