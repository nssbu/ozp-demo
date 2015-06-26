var ChannelListener = React.createClass({
    
    getInitialState: function () {
    	//fine
        return {
            value: ''
        }
    },

    componentWillMount: function () {
    	//fine
        client = this.startClient()
    },

    startClient: function () {
    	//fine
        client = new ozpIwc.Client({peerUrl: window.OzoneConfig.iwcUrl})
        client.connect().then(
            function () {
                console.log("client connected")
            }
        )
        return client
    },

    inputChange: function (event) {
    	//fine
        this.setState({value: event.currentTarget.value })
    },

    onAddChannelClick: function () {
    	//fine
        this.addChannel(this.state.value)
    },

    onClearChannels: function () {
    	//move chList out and make a function that iterativly removes items from list
        this.refs.ChannelList.state.chList = []
        this.refs.ChannelList.forceUpdate()
    },

    onClearMessages: function () {
    	//move msglist out and make a function that iterativly removes items from list
        this.refs.MessageList.state.msgList = []
        this.refs.MessageList.forceUpdate()
    },

    onExportMessages: function () {
    	//move list out of MessageList component
        this.refs.MessageList.exportMessages()
    },

    onGetMessage: function (message, intent, date) {
    	//move chlist and is active out of component
    	//move msglist and functions out of component
        if(this.refs.ChannelList.isActive(intent)){
            this.refs.MessageList.addMessage(message.message, intent, date)
            this.refs.MessageList.forceUpdate()
        }
    },

    dragOver: function (event) {
    	//fine
        event.preventDefault()
    },

    textDrop: function(event){
    	//fine
        this.setState( {value: event.dataTransfer.getData("channel")} )
    },

    listDrop: function(event){
    	//fine
        this.addChannel( event.dataTransfer.getData("channel") )
    },

    addChannel: function(newChannel){
    	//.is in list shouldn't be on component
    	//don't directly access component
    	//store chlist elseWhere
        var me = this
        if (newChannel.length > 0 && !me.refs.ChannelList.isInList(newChannel)) {//take the .isInList out of the component
            client.data().watch(
                newChannel,
                function(res,done){
                    me.onGetMessage(res.entity.newValue,newChannel,new Date())
                }
            )
            me.refs.ChannelList.state.chList.push({value:newChannel,checked:true})
            me.refs.ChannelList.forceUpdate()
        }
    },

    render: function (){
    	//will need to pass list information in as props to objects instead of them being in the objects
        return (
            <form>  
                <div className="Header"> Channel Subscriptions</div>
                <div className="RowContainer">
                    <input type="text" className="ChannelInput" value={this.state.value} onChange={this.inputChange} draggable="false" placeholder="Enter channel..." onDrop={this.textDrop} onDragOver={this.dragOver}/>
                    <input type="button" className="btn-default" onClick={this.onAddChannelClick} value="Add Channel"/>
                    <input type="button" className="btn-default" onClick={this.onClearChannels} value="Clear Channels"/>
                </div>
                <ChannelList ref="ChannelList" drop={this.listDrop} dragOver={this.dragOver}/>

                <div className="Header">Activity Log</div>
                <div className="RowContainer">
                    <input type="button" className="btn-default" onClick={this.onClearMessages} value="Clear"/>
                    <input type="button" className="btn-default" onClick={this.onExportMessages} value="Export"/>
                </div>
                <MessageList ref="MessageList"/>
            </form>
        )
    }
})