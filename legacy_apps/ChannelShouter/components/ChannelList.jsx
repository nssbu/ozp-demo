var ChannelList = React.createClass({
	getInitialState: function () {
		return {
			chList: []
		}
	},
	onToggle: function(childComponent,event) {
		var me =this
		var index = childComponent.props.index
		var value = childComponent.props.value
		var checked = event.target.checked
		me.state.chList[index]={value:value,checked:checked}
		me.forceUpdate()
	},	
	onRemove: function(childComponent,event) {
		var me =this
		var tempList = []
		this.state.chList.map(function (item,i){
			if(i!=childComponent.props.index) {
				tempList.push({value:me.state.chList[i].value, checked:me.state.chList[i].checked})
			}
		})
		me.state.chList=tempList
		me.forceUpdate()
	},
	sendMessage: function(message){
		var data = {message: message}
		this.state.chList.map(function (item){
			if(item.checked==true){
				client.data().set(item.value,{entity: data})
			}
		})
	},
	isInList: function(intent){
		var found = false
		this.state.chList.map(function(item){
			if(intent==item.value){
				found = true
			}
		})
		return found
	},
	render: function () {
		var me=this
		var channels=this.state.chList.map(function (item,i){
			return(
				<Channel onToggle={me.onToggle} onRemove={me.onRemove} index={i} value={item.value} checked={item.checked}/>
			)
		})
		return (
			<div className="ChannelFrame" draggable="false" onDrop={this.props.drop} onDragOver={this.props.dragOver}>
				{channels}
			</div>
		)
	}
})