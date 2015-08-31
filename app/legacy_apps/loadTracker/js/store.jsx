'use strict';

var client = null;

var messageList = [];

var actions = Reflux.createActions(
    [
        "startClient",
        "retrieveInfo",
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

    onRetrieveInfo (time, intent, date) {
        messageList.push(
            {value:time, date:date, name: intent}
        );
        this.trigger({messageList});
    },

    onClearMessageList () {
        messageList = [];
        this.trigger({messageList});
    },

    getInitialState() {
        return{messageList, client};
    }
});