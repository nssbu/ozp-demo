var map,popup;
var featureId = 0;
var locationData = {};
var currentPopup = {};
//create a vector source to add the icon(s) to.
var vectorSource = new ol.source.Vector({});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

var addMarker = function(location,featId){
    var coords = ol.proj.transform([location.coords.long, location.coords.lat], 'EPSG:4326', 'EPSG:3857');
    for(var i in coords){
        if(!coords[i]) {
            return;
        }
    }

    location.mapCoords = coords;
    //create icon
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(coords),
        name: location.title,
        data: location
    });
    featId = featId || featureId++;
    iconFeature.setId(featId);
    locationData[featId] = location;
    //add icon to vector source
    map.getLayers().item(1).getSource().addFeatures([iconFeature]);
    map.getView().setCenter(coords);

    return featId;


};

function spawnPopup(coord,id,data){
    console.log(data);
    if(popup!=null) return;
    currentPopup.coords = coord;
    currentPopup.data= data;
    currentPopup.id = id;
    popup = $('<div class="popup"><b><p>' + data.title + '</p></b>' +
    '<p>Lat/Long:'  +  data.coords.lat + ',' + data.coords.long +'</p></div>');

    var overlay = new ol.Overlay({
        element:popup
    });

    map.addOverlay(overlay);
    overlay.setPosition(coord);
}

function destroyPopup(){
    $(popup).remove();
    popup = null;
    currentPopup = {};
}

$(document).ready(function() {
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'sat'})
            }),
            vectorLayer
        ],
        view: new ol.View({
            center: [0, 0],
            zoom: 3
        })
    });


    map.on('singleclick', function(evt){
        var coord = evt.coordinate;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });

        destroyPopup();
        if(feature) {
            var id = feature.getId();
            spawnPopup(coord,id, locationData[id]);
        }
    });


    var client=new ozpIwc.Client({peerUrl: window.OzoneConfig.iwcUrl});
    client.connect().then(function(){

        var onChange = function(reply) {
           if(reply.entity.newValue){

           }
        };


        client.api('intents.api').register("/json/coord/map",function(event) {
            var resource = event.entity;
            client.api('data.api').get(resource).then(function(resp){
                console.log(resp);
                var id = addMarker(resp.entity,resource);
                if(typeof id !== "undefined") {
                    return client.api('data.api').watch(resource, function (event) {
                        var feature = map.getLayers().item(1).getSource().getFeatureById(resource);
                        map.getLayers().item(1).getSource().removeFeature(feature);

                        //If this marker is currently popped up close it!
                        var needsUpdate = false;
                        if(currentPopup.id === resource){
                            needsUpdate = true;
                            destroyPopup();
                        }

                        if (event.entity.newValue) {
                            addMarker(event.entity.newValue,resource);

                            //Redraw the popup with the new data/location if needed
                            if(needsUpdate){
                                spawnPopup(locationData[resource].mapCoords,resource ,locationData[resource]);
                            }
                        }
                    });
                }
            })['catch'](function(e){
                console.error(e);
            });
        });
    });



});