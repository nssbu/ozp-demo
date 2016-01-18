"use strict";
var bouncing = bouncing || {};
bouncing.balls= bouncing.balls || {};
bouncing.ourBalls = bouncing.ourBalls || [];
bouncing.currentColor=bouncing.currentColor || "black";

var params=ozpIwc.util.parseQueryParams();

$(document).ready(function(){
//------------------------------------------
// UI Setup
//------------------------------------------
    var colorOptions = $("#ballColor option");
    var ballColor = $("#ballColor");
    var viewPort = $('#viewport');
    var fps = $('#fps');
    var averageLatencies = $("#averageLatencies");
    var frameRate = params.fps || 20;

    bouncing.currentColor=params.color ||
        colorOptions[Math.floor(Math.random() * colorOptions.length)].value;
    ballColor.val(bouncing.currentColor);
    fps.text(""+frameRate);

    setLocalBallColor(bouncing.currentColor);
    ballColor.change(function(e) {
        var color=e.target.value;
        setLocalBallColor(color);
    });

	window.setInterval(function() {
		var elapsed=(ozpIwc.util.now()-client.startTime)/1000;
		averageLatencies.text(
			"I/O: Pkt/sec [ " + (client.receivedPackets/elapsed).toFixed(1) +
            " / " +  (client.sentPackets/elapsed).toFixed(1) + " ]"
		);
	},500);

//------------------------------------------
// IWC Setup
//------------------------------------------
    var lastUpdate=new Date().getTime();
    var ballCount = 0;

    //======================================
    // Create a connection to the IWC
    // (automatically connects)
    //======================================
    var client=new ozpIwc.Client({peerUrl: window.OzoneConfig.iwcUrl});

    //======================================
    // Create a reference for tracking balls
    //======================================
    var ballsRef = new client.data.Reference("/balls",{
        lifespan: "Ephemeral",
        collect: true
    });

    //======================================
    // Update the UI with connection info
    // when its connection resolves
    //======================================
    client.connect()
        .then(uiAddressUpdate)
        .then(watchForBalls)
        .then(genLocalBall)
        .then(startBallUpdates);

//------------------------------------------
// Function Defs
//------------------------------------------
    function setLocalBallColor(color) {
        $('#viewport rect')[0].setAttribute("fill",color);
        for(var i=0;i<bouncing.ourBalls.length;++i) {
            bouncing.ourBalls[i].state.color=color;
        }
    }

    function animate() {
        var now=new Date().getTime();
        var delta=(now-lastUpdate)/1000.0;
        for(var i=0;i<bouncing.ourBalls.length;++i) {
            bouncing.ourBalls[i].tick(delta);
        }
        lastUpdate=now;
    }

    function uiAddressUpdate(){
        $('#myAddress').text(client.address);
    }

    function onBallsChanged(reply) {
        reply.newCollection.forEach(function(b) {
            //If the ball does not exist, create it.
            bouncing.balls[b]= bouncing.balls[b] || new Ball(b,viewPort,client);
        });
    }

    //======================================
    // Listen for balls created/destroyed
    // to update tracking
    //======================================
    function watchForBalls() {
        return ballsRef.watch(onBallsChanged).then(ballsRef.list).then(function(collection){
            collection.forEach(function(b) {
                //If the ball does not exist, create it.
                bouncing.balls[b]= bouncing.balls[b] || new Ball(b,viewPort,client);
            });
        });
    }

    //======================================
    // Create a resource for the ball this application produces.
    // IWC decides autogenerates a resource path with addChild.
    //======================================
    function genLocalBall() {
        // use the client's address to ensure uniqueness
        var resourcePath = "/balls/" + client.address + "/" + ballCount++;

        var localBallRef = new client.data.Reference(resourcePath, {
            lifespan: "bound",
            respondOn: "none"
        });
        bouncing.ourBalls.push(new BallPublisher(localBallRef));
    }

    //======================================
    // Animate the tracked balls based on
    // the set fps.
    //======================================
    function startBallUpdates() {
        window.setInterval(animate,1000/frameRate);
    }
});
