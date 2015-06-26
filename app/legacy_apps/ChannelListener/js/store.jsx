'use strict';

var client = null;

var channelList = [];

var messageList = [];

var actions = Reflux.createActions(
	[
		"startClient",
		"addChannel",
		"removeChannel",
		"clearChannels",
		"toggleChannel",
		"retrieveMessage",
		"exportMessageList",
		"clearMessageList"
	]
);

var store = Reflux.createStore({

	listenables: [actions],

	onStartClient () {
        client = new ozpIwc.Client({ peerUrl: window.OzoneConfig.iwcUrl});
        client.connect().then(
			function(){
				console.log("client connected");
			}
		);
	},

	onAddChannel (channel) {
		var isInList = channelList.some( function (item) {
        	return (item.value === channel);
        });

		if( channel.length > 0 && !isInList){
			client.data().watch(
				channel,
				function (res, done) {
					actions.retrieveMessage( res.entity.newValue, channel, new Date() );
				}
			);
			channelList.push({ value: channel, checked: true});
			this.trigger({ channelList});
		};
	},

	onRemoveChannel (index, channel) {
		client.data().unwatch(channel, null);

		channelList.splice(index,1);
		
		this.trigger({channelList});
	},

	onClearChannels () {
		channelList.forEach( function (item){
			client.data().unwatch(item.value, null);
		});
		channelList = [];
		this.trigger({channelList});
	},

	onToggleChannel (index) {
		channelList[index].checked = !channelList[index].checked;
		this.trigger({channelList});
	},

	onRetrieveMessage (message, intent, date) {
		var isActiveChannel = channelList.some( function (item) {
        	return (item.value === intent && item.checked === true);
        });
		if(isActiveChannel){
			messageList.push(
				{value: message, date:date, channel: intent}
			);
			this.trigger({messageList});
		}
	},

	onClearMessageList () {
		messageList = [];
		this.trigger({messageList});
	},

	onExportMessageList () {
		var xml = '<items>'
		messageList.map(function (item){
			xml+= '<item>'
			xml+= '<date>'+item.date+'</date>'
			xml+= '<channel>'+item.channel+'</channel>'
			xml+= '<message>'+item.value+'</message>'
			xml+= '</item>'
		});
		xml += '</items>';
		alert(xml);
	},

	getInitialState() {
		return{messageList, channelList, client};
	}
});
