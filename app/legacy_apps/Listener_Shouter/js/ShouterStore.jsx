'use strict';

var client = null;

var channelList = [];

var actions = Reflux.createActions(
    [
        "startClient",
        "addChannel",
        "removeChannel",
        "clearChannels",
        "toggleChannel",
        "shoutMessage"
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
            channelList.push({ value: channel, checked: true});
            this.trigger({ channelList});
        };
    },

    onRemoveChannel (index, channel) {
        channelList.splice(index,1);
        this.trigger({channelList});
    },

    onClearChannels () {
        channelList = [];
        this.trigger({channelList});
    },

    onToggleChannel (index) {
        channelList[index].checked = !channelList[index].checked;
        this.trigger({channelList});
    },
    
    onShoutMessage (message) {
        var data = {message: message};
        channelList.forEach( function (item) {
            if(item.checked){
                client.data().set(item.value,{entity: data});
            };
        });
    },

    getInitialState() {
        return{channelList, client};
    }
});