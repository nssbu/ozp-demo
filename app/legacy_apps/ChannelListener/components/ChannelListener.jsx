var ChannelListener = React.createClass({
	getInitialState: function () {
		return {
			value: '', client: this.startClient()
		}
	},

	startClient: function(){
		client = new ozpIwc.Client({ peerUrl: window.OzoneConfig.iwcUrl})
		client.connect().then(
			function(){
				console.log("client connected")
			}
		)
		return client
	},
	inputChange: function(event){//done
		this.setState({value: event.currentTarget.value })
	},
	onAddChannelClick: function(){
		var input = this.refs.ChannelInput.props.value
		this.AddChannel(input)
	},
	onClearChannels: function(){//done
		var me = this
		me.refs.ChannelList.state.chList = []
		me.refs.ChannelList.forceUpdate()
	},
	onClearMessages: function(){//done
		var me = this
		me.refs.MessageList.state.msgList = []
		me.refs.MessageList.forceUpdate()
	},
	onExportMessages: function(){//done
		var me = this
		me.refs.MessageList.exportMessages()
	},
	onGetMessage: function(message, intent, date){
		var me = this
		if(me.refs.ChannelList.isActive(intent)){
			me.refs.MessageList.addMessage(message.message, intent,date)
			me.refs.MessageList.forceUpdate()			
		}
	},
	dragOver: function(event){
		event.preventDefault()
	},
	listDrop: function(event){
		var input = event.dataTransfer.getData("channel")
		this.AddChannel(input)
	},
	AddChannel: function(input){//done
		var me = this
		if(input.length>0&&!me.refs.ChannelList.isInList(input)){
			this.state.client.data().watch(
				input,
				function(res,done){
					me.onGetMessage(res.entity.newValue,input,new Date())
				}
			)
			me.refs.ChannelList.state.chList.push({value:input,checked:true})
			me.refs.ChannelList.forceUpdate()
		}
	},
	textDrop: function(event){
		var me = this
		me.state.value = event.dataTransfer.getData("channel")
		me.forceUpdate()
	},
	render: function (){
		return (
			<form>
				<div className="Frame">
					<div className="Header"> Channel Subscriptions</div>
					<div className="Line">
		 				<input type="text" className="ChannelInput" value ={this.state.value} ref="ChannelInput" onChange={this.inputChange} draggable="false" placeholder="Enter channel..." onDrop={this.textDrop} onDragOver={this.dragOver}/>
						<input type="button" className="btn-default" onClick={this.onAddChannelClick} value="Add Channel"/>
						<input type="button" className="btn-default" onClick={this.onClearChannels} value="Clear Channels"/>
					</div>
					<div className="Line2"> Active Channels</div>
					<ChannelList ref="ChannelList" drop={this.listDrop} dragOver={this.dragOver}/>
				</div>
				<div className="Header">Activity Log</div>
				<div className="Line">
					<input type="button" className="btn-default" onClick={this.onClearMessages} value="Clear"/>
					<input type="button" className="btn-default" onClick={this.onExportMessages} value="Export"/>
				</div>
				<div className="Line2">
					<label className="MsgLabel1" children="Date"/>
					<label className="MsgLabel2" children="Channel"/>
					<label className="MsgLabel3" children="Message"/>
				</div>
				<MessageList ref="MessageList"/>	
			</form>
		)
	}
})