var ChannelListener = React.createClass({

    mixins: [Reflux.connect(store)],

    getInitialState: function () {
        return {
            chInputValue: '',
            displayMode: 'Table',
            msgDisplay: 'Get XML'
        };
    },

    componentWillMount: function () {
        actions.startClient();
    },

    inputChange: function (event) {
        this.setState({chInputValue: event.currentTarget.value });
    },

    onAddChannelClick: function () {
        actions.addChannel(this.state.chInputValue);
    },

    dragOver: function (event) {
        event.preventDefault();
    },

    listDrop: function (event) {
        actions.addChannel(event.dataTransfer.getData("channel"));
    },

    textDrop: function (event) {
        this.setState({chInputValue: event.dataTransfer.getData("channel")});
    },

    toggleDisplayType: function () {
        if (this.state.displayMode === 'Table') {
            this.setState({displayMode: 'XML'});
            this.setState({msgDisplay: 'Back'});
        } else {
            this.setState({displayMode: 'Table'});
            this.setState({msgDisplay: 'Get XML'});
        };
    },

    render: function (){
        var messageDisplay;
        if (this.state.displayMode === 'Table') {
            messageDisplay = <MessageList messageList={this.state.messageList} />;
        } else {
            messageDisplay = <MessageList_XML messageList={this.state.messageList} />;
        };
        return (
            <form>
                <div className="Header"> Channel Subscriptions</div>
                <div className="RowContainer">
                    <input type="text" className="ChannelInput" value={this.state.chInputValue} onChange={this.inputChange} draggable="false" placeholder="Enter channel..." onDrop={this.textDrop} onDragOver={this.dragOver}/>
                    <input type="button" className="btn-default" onClick={this.onAddChannelClick} value="Add Channel"/>
                    <input type="button" className="btn-default" onClick={actions.clearChannels} value="Clear Channels"/>
                </div>
                <ChannelList drop={this.listDrop} dragOver={this.dragOver} removeChannel={actions.removeChannel} toggleChannel={actions.toggleChannel} channelList={this.state.channelList} />

                <div className="Header">Activity Log</div>
                <div className="RowContainer">
                    <input type="button" className="btn-default" onClick={actions.clearMessageList} value="Clear"/>
                    <input type="button" className="btn-default" onClick={this.toggleDisplayType} value={this.state.msgDisplay}/>
                </div>
                {messageDisplay}
            </form>
        );
    }
});