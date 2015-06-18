var ChannelList = React.createClass({
	getInitialState: function () {
		return {
			cList: []
		}
	},
	onToggle: function(childComponent,event) {
		var me =this
		var index = childComponent.props.index
		var value = childComponent.props.value
		var checked = event.target.checked
		me.state.cList[index]={value:value,checked:checked}
		me.forceUpdate()
	},	
	onRemove: function(childComponent,event) {
		var me =this
		var temp = []
		this.state.cList.map(function (item,i){
			if(i!=childComponent.props.index) {
				temp.push({value:me.state.cList[i].value, checked:me.state.cList[i].checked})
			}
		})
		me.state.cList=temp
		me.forceUpdate()
	},
	sendMessage: function(message){
		var data = {message: message}
		this.state.cList.map(function (item){
			if(item.checked==true){
				sendData(item.value,data)
			}
		})
	},
	isInList: function(intent){
		var found = false
		this.state.cList.map(function(item){
			if(intent==item.value){
				found = true
			}
		})
		return found
	},
	render: function () {
		var me=this
		var style={
			border: '2px solid black'
		}
		var channels=this.state.cList.map(function (item,i){
			return(
				<Channel onToggle={me.onToggle} onRemove={me.onRemove} index={i} value={item.value} checked={item.checked}/>
			)
		})
		return (
			<table style={style}>
				<thead><tr>
					<td>Channel</td>
					<td>Active</td>
					<td>Remove</td>
				</tr></thead>
				<td><hr/></td>
				<td><hr/></td>
				<td><hr/></td>
				<tbody>{channels}</tbody>
			</table>
		)
	}
})