var ChannelListener = React.createClass({
	
	mixins: [Reflux.connect(store)],

	getInitialState: function () {
		return {
			value: ''
		};
	},

	componentWillMount: function () {
		actions.startClient();
    },

	inputChange: function (event) {
		this.setState({value: event.currentTarget.value });
	},

	onAddChannelClick: function () {
		actions.addChannel(this.refs.ChannelInput.props.value);
	},

	dragOver: function (event) {
		event.preventDefault();
	},

	listDrop: function (event) {
		actions.addChannel( event.dataTransfer.getData("channel") );
	},

	textDrop: function (event) {
		this.setState({value: event.dataTransfer.getData("channel")});
	},

	render: function (){
		return (
			<form>
				<div className="Frame">
					<div className="Header"> Channel Listener</div>
					<div className="Line">
		 				<input type="text" className="ChannelInput" value ={this.state.value} ref="ChannelInput" onChange={this.inputChange} draggable="false" placeholder="Enter channel..." onDrop={this.textDrop} onDragOver={this.dragOver}/>
						<input type="button" className="btn-default" onClick={this.onAddChannelClick} value="Add Channel"/>
						<input type="button" className="btn-default" onClick={actions.clearChannels} value="Clear Channels"/>
					</div>
					<div className="Line2"> Active Channels</div>
					<ChannelList ref="ChannelList" drop={this.listDrop} dragOver={this.dragOver}/>
				</div>
				<div className="Header">Activity Log</div>
				<div className="Line">
					<input type="button" className="btn-default" onClick={actions.clearMessageList} value="Clear"/>
					<input type="button" className="btn-default" onClick={actions.exportMessageList} value="Export"/>
				</div>
				<div className="Line2">
					<label className="MsgLabel1" children="Date"/>
					<label className="MsgLabel2" children="Channel"/>
					<label className="MsgLabel3" children="Message"/>
				</div>
				<MessageList ref="MessageList"/>	
			</form>
		);
	}
});