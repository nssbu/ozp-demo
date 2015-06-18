var client
var dropControl

function startClient(){
	debugger;
	client = new ozpIwc.Client({ peerUrl: window.OzoneConfig.iwcUrl})
	connect()
}
function connect(){
	client.connect().then(
		function(){
			console.log("client connected")
		}
	)
}
function sendData(intent,data){
	client.data().set(intent,{entity: data})
}