'use strict';
$('document').ready(function() {
  var mode = ozpIwc.util.parseQueryParams().offline || false;
  if (mode === "false") {
    mode = false;
  }
  var locations = {};
  var map = new CustomMap("map", mode, 'tiles');

  // Create the IWC Client
  var iwc = new ozpIwc.Client(OzoneConfig.iwcUrl);

  //=======================================
  // Location: Contains IWC reference and map functionality
  //
  // IWC References:
  // API: Data
  // Resource: *
  //=======================================
  var Location = function(config) {
    this.resource = config.resource;
    this.reference = new iwc.data.Reference(config.resource);
    this.map = config.map;

    var self = this;
    var onChange = function(changes) {
      self.map.updateMarker(self.resource, changes.newValue);
    };

    this.reference.watch(onChange).then(function(location) {
      self.map.addMarker(location, self.resource);
    });
  };


  //=======================================
  // Location Mapping shared functionality:
  //      Registers Intent for /json/coord/map
  //
  //
  // IWC References:
  // API: Intents
  // Resource: /json/coord/map
  //=======================================
  var mappingRef = new iwc.intents.Reference("/json/coord/map");

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
    label: "Location Viewer"
  };

  // This function expects to receive a data.api resource name to be used.
  var mapFn = function(resource) {
    if (!locations[resource]) {
      locations[resource] = new Location({
        map: map,
        resource: resource
      });
    }
  };

  mappingRef.register(metaData, mapFn);
});
