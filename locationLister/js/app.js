'use strict';

var locationLister = angular.module('LocationLister', [
  'ozpIwcClient',
  'ui.bootstrap'
]);
locationLister.controller('MainController', ['ozpIwcClient']);

locationLister.controller('MainController', function($scope, $log, $modal, iwc) {
  $scope.id = 0;
  $scope.locations = {};
  $scope.mapHandlers = [];
  $scope.analyzeHandlers = [];

  //=======================================
  // Location List View
  //
  // IWC References:
  // API: Data
  // Resource: /locationLister/listings
  // Collects: /locationLister/listings/*
  //=======================================
  $scope.listingsRef = new iwc.data.Reference("/locationLister/listings", {
    collect: true
  });


  var handleCollection = function(collection) {
    var colArr = collection || [];

    colArr.forEach(function(resource) {
      if (!$scope.locations[resource]) {
        $scope.locations[resource] = new ListViewItem(resource);
      }
    });
    $scope.$apply();
  };

  var onCollectionChange = function(changes) {
    handleCollection(changes.newCollection);
    $log.debug(changes);
  };

  // Watch For new locations added to the collection
  $scope.listingsRef.watch(onCollectionChange);

  // Get the initial collection
  $scope.listingsRef.list().then(handleCollection);



  //=======================================
  // Location List View UI Behavior
  // UI logic for selecting a Location List View Item
  //
  // IWC References:
  // API: Data
  // Resource: /locationLister/listings/*
  //=======================================
  $scope.handleLocationSelect = function(location) {
    $scope.currentLocation = location;

    if($scope.lastSelected !== this) {
        if ($scope.lastSelected) {
          $scope.lastSelected.selected = '';
        }
        this.selected = 'selected';
        $scope.lastSelected = this;
    }
  };


  $scope.clearLocationSelect = function() {
    $scope.currentLocation = undefined;
  };

  $scope.deleteSelectedLocation = function() {
    if ($scope.currentLocation) {
      $scope.currentLocation.reference.delete();
      delete $scope.locations[$scope.currentLocation.resource];
    }
  };

  //=======================================
  // Location List View Item
  //
  // IWC References:
  // API: Data
  // Resource: /locationLister/listings/*
  // Collects: none
  //=======================================
  var ListViewItem = function(resource) {
    this.reference = new iwc.data.Reference(resource);
    this.resource = resource;
    this.value = {};

    var self = this;
    this.reference.watch(this.onChange).then(function(val) {
      self.value = val;
      $scope.$apply();
    });
  };

  ListViewItem.prototype.onChange = function(changes) {
    this.value = changes.newValue;
    $scope.$apply();
  };


  //=======================================
  // Map Button: Invokes map intent
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/map
  //=======================================
  $scope.invokeMap = function(listingResource) {
    return $scope.mappingRef.invoke(listingResource)['catch'](function(er) {
      $log.debug(er);
    });
  };


  //=======================================
  // Map Handler Count: Number of remote handlers
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/map
  // Collects: /json/coord/map/*
  //=======================================
  $scope.mappingRef = new iwc.intents.Reference("/json/coord/map", {
    collect: true
  });
  $scope.mapDisabled = function() {
    return !($scope.mapHandlers.length > 0 && $scope.lastSelected);
  };

  var onMapColChange = function(changes) {
    $scope.mapHandlers = changes.newCollection;
    $scope.$apply();
  };

  $scope.mappingRef.watch(onMapColChange);

  // Get the initial collection
  $scope.mappingRef.list().then(function(collection) {
    $scope.mapHandlers = collection;
    $scope.$apply();
  });


  //=======================================
  // Map Button: Invokes analyze intent
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/analyze
  //=======================================
  $scope.analyzeRef = new iwc.intents.Reference("/json/coord/analyze");
  $scope.invokeAnalyze = function(coords) {
    return $scope.analyzeRef.invoke(coords)['catch'](function(er) {
      $log.debug(er);
    });
  };

  //=======================================
  // Analysis Handler Count (Remote Handlers)
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/map
  // Collects: /json/coord/map/*
  //=======================================
  $scope.analyzeRef = new iwc.intents.Reference("/json/coord/analyze");

  $scope.analyzeDisabled = function() {
    return !($scope.analyzeHandlers.length > 0 && $scope.lastSelected);
  };

  var onAnalyzeColChange = function(changes) {
    $scope.analyzeHandlers = changes.newCollection;
    $scope.$apply();
  };

  $scope.analyzeRef.watch(onAnalyzeColChange);

  // Get the initial collection
  $scope.analyzeRef.list().then(function(collection) {
    $scope.analyzeHandlers = collection;
    $scope.$apply();
  });

  //=======================================
  // Location save modal:
  //      Creates/Updates locations. Generates new references
  //      in the listings collection when saving new location.
  //
  // IWC References:
  // API: Data
  // Resource: /locationLister/listings
  // Collects: none
  //=======================================
  $scope.locationModal = function(listing) {
    var modalInstance = $modal.open({
      templateUrl: "templates/modal.html",
      controller: "EditController",
      resolve: {
        listing: function() {
          return listing;
        }
      }
    });

    return modalInstance.result;
  };

  // Called when the "Add Location" button is pressed
  $scope.addListing = function(listing) {
    listing = listing || {};

    // Opens popup modal, resolves with the input data.
    return $scope.locationModal(listing).then(function(output) {

      // Autogenerates the resouce in the listings collection.
      return $scope.listingsRef.addChild(output.listing).catch(function(e) {
        console.log(e);
      });
    });
  };

  // Called when a Location List View Item is selected and Edit is clicked.
  // Edits the value of the Location List View Item.
  $scope.editSelectedLocation = function() {
    if ($scope.currentLocation) {
      $scope.locationModal($scope.currentLocation).then(function(output) {
        // Use the scope stored reference to update the resource
        $scope.locations[$scope.currentLocation.resource].reference.set(output.listing);
      });
    }
  };

  //=======================================
  // Location Save shared functionality:
  //      Registers Intent for /json/coord/save
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/save
  //=======================================
  $scope.savingRef = new iwc.intents.Reference("/json/coord/save");

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
    label: "Location Lister"
  };

  // The functionality to share. Opens the modal for saving the received location.
  var saveLocation = function(location) {
    if (location && location.title && location.coords) {
      $scope.addListing(location);
    }
  };

  $scope.savingRef.register(metaData, saveLocation);
});


// This factory adds wrappings around the IWC client generation to allow
// query param bus selection and logs the Bus/Address upon connection.
//
// For most applications using the "ozpIwcClient" module is sufficient
// to receive the IWC Library.
locationLister.factory("iwc", function($location, $window, $log, iwcClient) {

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


locationLister.directive("locationList", function() {
  return {
    restrict: 'E',
    scope: {
      locations: "=locations",
      onselect: "=onselect"
    },
    templateUrl: 'templates/locationList.tpl.html'
  };
});

// Controller for the Add/Edit Location Modal
locationLister.controller("EditController", function($scope, $modalInstance, listing) {

  if (listing) {
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

  $scope.ok = function() {
    $modalInstance.close({
      listing: $scope.listing
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

});

// A filter to not display List View Items that are not of proper format.
locationLister.filter('filterLocations', function() {
  return function(input) {
    var inputArray = [];

    for (var item in input) {
      inputArray.push(input[item]);
    }

    return inputArray.filter(function(listing) {
      if (!listing || !listing.value) {
        return false;
      }

      if (typeof listing.value.title === "undefined") {
        return false;
      }

      if (!listing.value.coords ||
        typeof listing.value.coords.lat === "undefined" ||
        typeof listing.value.coords.long === "undefined") {
        return false;
      }

      return true;
    });
  };
});
