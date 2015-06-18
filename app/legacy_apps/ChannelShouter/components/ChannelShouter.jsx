var ChannelShouter = React.createClass({
	getInitialState: function(){
		startClient()
		return {message:'',value: ''}
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
			me.refs.chl.state.cList.push({value:ch,checked:true})
			me.refs.chl.forceUpdate()
		}
	},
	buttonDragStart: function(event){
		event.dataTransfer.setData("channel",this.refs.chInput.props.value)
		this.refs.btnDrag.props.value = this.refs.chInput.props.value
		this.refs.btnDrag.forceUpdate()
	},
	buttonDragEnd: function(event){
		this.refs.btnDrag.props.value = "<"
		this.refs.btnDrag.forceUpdate()
	},	
	render: function (){
		return (
			<div>
				<form>
					<br/>Message:<br/>
	 				<input type="text" value ={this.state.message} ref="msgInput" onChange={this.messageChange}/>
					<input type="button" onClick={this.onShout} value="Send"/>
					<hr/>Add Channel<br/>
	 				<input type="text" value={this.state.value} ref="chInput" onChange={this.inputChange}/>
					<input type="button" onClick={this.onAdd} value="Add"/>
					<input type="button" ref="btnDrag" draggable="true" onDragStart={this.buttonDragStart} onDragEnd={this.buttonDragEnd} value="<"/>
					<hr/>Shouting on channels:<br/>
					<ChannelList ref="chl"/>
				</form>	
			</div>
		)
	}
})