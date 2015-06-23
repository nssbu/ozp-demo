var ChannelShouter = React.createClass({
	getInitialState: function(){
		return {message:'', value:'', client:this.startClient()}
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
	inputChange: function(event){
		this.setState({value: event.currentTarget.value })
	},
	messageChange: function(event){
		this.setState({message: event.currentTarget.value })
	},
	onShout: function(){
		var me = this
		if(me.state.message.length>0){
			me.refs.chl.sendMessage(me.state.message)
		}
	},
	onAdd: function(){
		var me = this
		var ch = me.refs.chInput.props.value
		if(ch.length>0 &&!me.refs.chl.isInList(ch)){
			me.refs.chl.state.chList.push({value:ch,checked:true})
			me.refs.chl.forceUpdate()
		}
	},
	buttonDragStart: function(event){
		event.dataTransfer.setData("channel",this.refs.chInput.props.value)
		this.refs.btnDrag.props.value = "    "+this.refs.chInput.props.value
		this.refs.btnDrag.forceUpdate()
	},
	buttonDragEnd: function(event){
		this.refs.btnDrag.props.value = ""
		this.refs.btnDrag.forceUpdate()
	},	
	render: function (){
		return (
			<form>
				<div className="Frame">
					<div className="Header"> Message:</div>
					<div className="Line">
						<input type="text" className="ChannelInput" value ={this.state.message} ref="msgInput" onChange={this.messageChange} placeholder="Enter message..."/>
						<input type="button" className="btn-default" onClick={this.onShout} value="Send"/>
					</div>
					<div className="Header"> Add Channel:</div>
					<div className="Line">
						<input type="text" className="ChannelInput" value={this.state.value} ref="chInput" onChange={this.inputChange}placeholder="Enter channel..."/>
						<input type="button" className="btn-default" onClick={this.onAdd} value="Add"/>
						<input type="button" className="shouter" ref="btnDrag" draggable="true" onDragStart={this.buttonDragStart} onDragEnd={this.buttonDragEnd}/>
					</div>
				</div>
	 			<div className="Line2">Shouting on channels:</div>
				<ChannelList ref="chl"/>
			</form>	
		)
	}
})