var client;
console.log(Flux)
function getDate(now) {
	//var now = new Date()
	var yyyy = now.getFullYear()
	var mm = now.getMonth()+1
	var dd = now.getDate()
	var hours = now.getHours()
	var mins = now.getMinutes()
	var secs = now.getSeconds()
	var mSecs = now.getMilliseconds()

	if (dd<10) {dd='0'+dd}
	if (mm<10) {mm='0'+mm}
	if (hours<10) {hours='0'+hours}
	if (mins<10) {mins='0'+mins}
	if (secs<10) {secs='0'+secs}
	if (mSecs<10) {mSecs='00'+mSecs}
	else if(mSecs<100) {mSecs='0'+mSecs}

	return yyyy+'-'+mm+'-'+dd+' '+hours+':'+mins+':'+secs+':'+mSecs
}