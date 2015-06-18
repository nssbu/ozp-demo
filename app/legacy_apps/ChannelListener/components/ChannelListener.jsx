var ChannelListener = React.createClass({
	getInitialState: function(){
		startClient()
		return {value: ''}
	},
	inputChange: function(event){//done
		this.setState({value: event.currentTarget.value })
	},
	onAddChannel: function(){//done
		var me = this
		var input = me.refs.chInput.props.value
		if(input.length>0&&!me.refs.chl.isInList(input)){
			registerIntent(input,this.onGetMessage,this.findOrKill)
			me.refs.chl.state.cList.push({value:input,checked:true})
			me.refs.chl.forceUpdate()
		}
	},
	onClearChannels: function(){//done
		var me = this
		me.refs.chl.state.cList = []
		me.refs.chl.forceUpdate()
	},
	onClearMessages: function(){//done
		var me = this
		me.refs.msgl.state.mList = []
		me.refs.msgl.forceUpdate()
	},
	onExportMessages: function(){//done
		var me = this
		me.refs.msgl.exportMessages()
	},
	onGetMessage: function(message, intent, date){
		var me = this
		if(me.refs.chl.isActive(intent)){
			me.refs.msgl.addMessage(message.message, intent,date)
			me.refs.msgl.forceUpdate()			
		}
	},
	dragOver: function(event){
		event.preventDefault()
	},
	listDrop: function(event){
		var me = this
		var input = event.dataTransfer.getData("channel")
		if(input.length>0&&!me.refs.chl.isInList(input)){
			registerIntent(input,this.onGetMessage,this.findOrKill)
			me.refs.chl.state.cList.push({value:input,checked:true})
			me.refs.chl.forceUpdate()
		}
	},
	textDrop: function(event){
		var me = this
		me.state.value = event.dataTransfer.getData("channel")
		me.forceUpdate()
	},
	render: function (){
		return (
			<div>
				<form>
					Channel Subscriptions:<br/>
	 				<input type="text" value ={this.state.value} ref="chInput" onChange={this.inputChange} draggable="false" onDrop={this.textDrop} onDragOver={this.dragOver}/>
					<input type="button" onClick={this.onAddChannel} value="Add Channel"/>
					<input type="button" onClick={this.onClearChannels} value="Clear Channels"/>
					<br/>Listening on channels:<br/>
					<ChannelList ref="chl" drop={this.listDrop} dragOver={this.dragOver}/>

					<hr/>

					Messages
					<input type="button" onClick={this.onClearMessages} value="Clear"/>
					<input type="button" onClick={this.onExportMessages} value="Export"/>
					<br/>
					<MessageList ref="msgl"/>					
				</form>	
			</div>
		)
	}
})