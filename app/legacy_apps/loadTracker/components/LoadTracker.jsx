var LoadTracker = React.createClass({

    mixins: [Reflux.connect(store)],

    getInitialState: function () {
        return {
            chInputValue: '',
            displayMode: 'XML',
            msgDisplay: 'Back'
        };
    },

    componentWillMount: function () {
        actions.startClient();
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
                <div className="Header"> Load Time Log</div>
                <div className="RowContainer">
                    <input type="button" className="btn-default" onClick={actions.clearMessageList} value="Clear"/>
                    <input type="button" className="btn-default" onClick={this.toggleDisplayType} value={this.state.msgDisplay}/>
                </div>
                {messageDisplay}
            </form>
        );
    }
});