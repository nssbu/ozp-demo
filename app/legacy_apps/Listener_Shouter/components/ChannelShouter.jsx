var ChannelShouter = React.createClass({

    mixins: [Reflux.connect(store)],

    getInitialState: function () {
        return {
            chInputValue: '',
            msgInputValue: '',
            dragDisplay: ''
        };
    },

    componentWillMount: function () {
        actions.startClient();
    },

    inputChange: function (event) {
        this.setState({chInputValue: event.currentTarget.value });
    },

    messageChange: function (event) {
        this.setState({msgInputValue: event.currentTarget.value });
    },

    onShoutClick: function () {
        if(this.state.msgInputValue.length > 0) {
            actions.shoutMessage(this.state.msgInputValue);
        };
    },

    onAddChannelClick: function () {
        actions.addChannel(this.state.chInputValue);
    },

    buttonDragStart: function (event) {
        event.dataTransfer.setData("channel", this.state.chInputValue);
        this.setState({dragDisplay: "    " + this.state.chInputValue});
    },

    buttonDragEnd: function (event) {
        this.setState({dragDisplay: ""});
    },

    render: function () {
        return (
            <form>
                <div className="Header"> Message:</div>
                <div className="RowContainer">
                    <input type="text" className="ChannelInput" onChange={this.messageChange} value={this.state.msgInputValue} placeholder="Enter message..."/>
                    <input type="button" className="btn-default" onClick={this.onShoutClick} value="Send"/>
                </div>
                <div className="Header"> Add Channel:</div>
                <div className="RowContainer">
                    <input type="text" className="ChannelInput" onChange={this.inputChange} value={this.state.chInputValue} placeholder="Enter channel..."/>
                    <input type="button" className="btn-default" onClick={this.onAddChannelClick} value="Add"/>
                    <input type="button" className="shouter" draggable="true" onDragStart={this.buttonDragStart} onDragEnd={this.buttonDragEnd}/>
                </div>
                <ChannelList removeChannel={actions.removeChannel} toggleChannel={actions.toggleChannel} channelList={this.state.channelList} />
            </form>
        );
    }
});