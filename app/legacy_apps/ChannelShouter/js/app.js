var client
var dropControl

function startClient(){
	client = new ozpIwc.Client({ peerUrl: "http://localhost:13000"})
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