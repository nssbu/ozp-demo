var map,popup;
var featureId = 0;
var locationData = {};
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

function spawnPopup(coord,data){
    console.log(data);
    if(popup!=null) return;

    popup = $('<div class="popup"><b><p>' + data.title + '</p></b>' +
    '<p>Lat/Long:'  +  data.coords.lat + ',' + data.coords.lat +'</p></div>');

    var overlay = new ol.Overlay({
        element:popup
    });

    map.addOverlay(overlay);
    overlay.setPosition(coord);
}

function destroyPopup(){
    $(popup).remove();
    popup = null;
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
            spawnPopup(coord,locationData[feature.getId()]);
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
                var id = addMarker(resp.entity);
                if(id) {
                    return client.api('data.api').watch(resource, function (event) {
                        var feature = map.getLayers().item(1).getSource().getFeatureById(id);
                        map.getLayers().item(1).getSource().removeFeature(feature);
                        if (event.entity.newValue) {
                            addMarker(event.entity, id)
                        }
                    });
                }
            })['catch'](function(e){
                console.error(e);
            });
        });
    });



});