/**
 * An Open Layers 3 Map with a simple marker and popup interface.
 *
 * @class CustomMap
 * @param mapId the DOM div element ID of the map
 * @constructor
 */
var CustomMap = function(mapId,offline,tilePath){
    //create a vector source to add the icon(s) to.
    this.vectorSource = new ol.source.Vector({});

    this.vectorLayer = new ol.layer.Vector({
        source: this.vectorSource
    });
    var view,tile;
    var center = ol.proj.transform([-25, 25], 'EPSG:4326', 'EPSG:3857');
    if(offline){
        view = new ol.View({
            center: center,
            zoom:3,
            maxZoom: 4
        });

        tile = new ol.layer.Tile({
            source: new ol.source.OSM({
                attributions: [
                    new ol.Attribution({
                        html: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> ' +
                        '<img src=tilePath+"/mq_logo.png">'
                    }),
                    ol.source.OSM.ATTRIBUTION
                ],
                crossOrigin: null,
                url: tilePath + '/{z}/{x}/{y}.png'
            })
        })
    } else {
        view = new ol.View({
            center: center,
            zoom: 3
        });

        tile = new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'})
        });
    }

    this.map =  new ol.Map({
        target: mapId,
        layers: [tile,this.vectorLayer],
        view: view
    });
    this.locationData = {};
    this.popup = null;
    this.currentPopup = {};
    this.featureId = 0;

    this.map.on('singleclick',this.singleClickPopupHandler,this);
};


/**
 * A default marker styling for this custom map
 * @method getMarkerStyle
 * @returns {Object}
 */
CustomMap.prototype.getMarkerStyle = function(){

    var fill = new ol.style.Fill({
        color: '#0FE500'
    });

    var stroke = new ol.style.Stroke({
        color: '#3399CC',
        width: 1.25
    });

    return new ol.style.Style({
        image: new ol.style.Circle({
            fill: fill,
            stroke: stroke,
            radius: 6
        }),
        fill: fill,
        stroke: stroke
    });
};

/**
 * Adds a marker to the map
 *
 * @method addMarker
 * @param location {Object} information about the marker being added and data for its popup
 * @param location.title {String} The title for the popup
 * @param location.description {String} The description for the popup
 * @param location.coords {Object} coordinate data
 * @param location.coords.long {Number} The longitude of the marker location
 * @param location.coords.lat {Number} The latitude of the marker location
 * @param featId {String|Number} Unique ID for the marker, an iterated variable is used if no ID given.
 * @returns {String|Number} Returns the featId if the marker creation was successfull.
 */
CustomMap.prototype.addMarker = function(location,featId){
    var coords = ol.proj.transform([location.coords.long, location.coords.lat], 'EPSG:4326', 'EPSG:3857');

    location.mapCoords = coords;
    //create icon
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(coords),
        name: location.title,
        data: location
    });
    featId = featId || this.featureId++;

    iconFeature.setStyle(this.getMarkerStyle());

    iconFeature.setId(featId);

    this.locationData[featId] = location;
    // add icon to vector source
    this.map.getLayers().item(1).getSource().addFeature(iconFeature);
    this.map.getView().setCenter(coords);

    return featId;
};

/**
 * Removes the marker from the map.
 *
 * @method removeMarker
 * @param featId{String|Number} The unique ID of the marker to remove.
 */
CustomMap.prototype.removeMarker = function(featId) {
    var feature = this.map.getLayers().item(1).getSource().getFeatureById(featId);
    this.map.getLayers().item(1).getSource().removeFeature(feature);
};

/**
 * Updates the specified marker with the new data. If no data profided the marker is removed.
 *
 * @method updateMarker
 * @param featId {String|Number} The unique ID of the marker to update
 * @param location {Object} information about the marker being added and data for its popup
 * @param location.title {String} The title for the popup
 * @param location.description {String} The description for the popup
 * @param location.coords {Object} coordinate data
 * @param location.coords.long {Number} The longitude of the marker location
 * @param location.coords.lat {Number} The latitude of the marker location
 */
CustomMap.prototype.updateMarker = function(featId, location) {
    //Remove the old marker
    this.removeMarker(featId);

    //If this marker's popup is open close it.
    var needsUpdate = false;
    if(this.currentPopup.id === featId){
        needsUpdate = true;
        this.destroyPopup();
    }

    //If there was new data for this resource, add the modified marker
    if (location) {
        this.addMarker(location,featId);

        //Redraw the popup with the new data/location if needed
        if(needsUpdate){
            this.spawnPopup(featId);
        }
    }
};

/**
 * A custom single click handler for the map. Handles the expected behavior of the popup. Only 1 popup open at a time.
 * Clicking away from the popup will remove the current active popup. Clicking on a new marker will open its popup.
 *
 * @method singleClickPopupHandler
 * @param evt {Event} the singleclick event on the map element
 */
CustomMap.prototype.singleClickPopupHandler = function(evt){
    console.log(evt.coordinate);
    //If there were any features where clicked, return the first one.
    var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
    });

    // If a popup was open close it.
    this.destroyPopup();
    this.currentPopup = {};

    // If a feature was clicked, open it's popup
    if(feature) {
        var id = feature.getId();
        this.spawnPopup(id, evt.coordinate);
    }

};


/**
 * Opens a popup on the map for given marker ID at the given coord position
 *
 * @method spawnPopup
 * @param featId {String|Number} The unique ID of the marker the popup corresponds to.
 * @param mapCoords [Array] A 2 index array of the X,Y coordinates on the map to open the popup. ex) [X,Y]
 */
CustomMap.prototype.spawnPopup = function(featId,mapCoords){
    if(this.popup!=null) return;
    var data = this.locationData[featId];

    this.popup = $('<div class="popup"><b><p>' + data.title + '</p></b>' +
    '<p>Lat/Long:'  +  data.coords.lat + ',' + data.coords.long +'</p></div>');

    var overlay = new ol.Overlay({
        element: this.popup
    });

    this.map.addOverlay(overlay);
    overlay.setPosition(mapCoords);

    this.currentPopup = {
        coords: mapCoords,
        data: data,
        id: featId
    };

};


/**
 * Removes the currently open popup
 *
 * @method destroyPopup
 */
CustomMap.prototype.destroyPopup = function() {
    $(this.popup).remove();
    this.popup = null;
};