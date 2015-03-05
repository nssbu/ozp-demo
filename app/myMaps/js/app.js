var map;
//create a vector source to add the icon(s) to.
var vectorSource = new ol.source.Vector({});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

var addMarker = function(location){
    //create icon
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([location.coords.long, location.coords.lat], 'EPSG:4326', 'EPSG:3857')),
        name: location.title
    });

    //add icon to vector source
    map.getLayers().item(1).getSource().addFeatures([iconFeature]);


};
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
    addMarker({
        title: "FOO",
        coords: {
            lat: 0,
            long: 0
        }
    });

    var client=new ozpIwc.Client({peerUrl: window.OzoneConfig.iwcUrl});
    client.connect().then(function(){
        client.api('intents.api').register("/json/coord/map",function(event){
            addMarker(event.entity);
        }).then(function(rsp){
            console.log(rsp);
        });
    });



});