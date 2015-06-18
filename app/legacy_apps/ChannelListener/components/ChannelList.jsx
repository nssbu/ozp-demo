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

		unregisterIntent(childComponent.props.value)

		this.state.cList.map(function (item,i){
			if(i!=childComponent.props.index) {
				temp.push({value:me.state.cList[i].value, checked:me.state.cList[i].checked})
			}
		})
		me.state.cList=temp
		me.forceUpdate()
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
	isActive: function(intent){
		var active = false;
		this.state.cList.map(function(item){
			if(intent==item.value && item.checked==true){
				active = true
			}
		})
		return active
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
			<table draggable="false" onDrop={this.props.drop} onDragOver={this.props.dragOver} style={style}>
				<thead><tr>
					<td children='_Channel___________________________'/>
					<td children='_Active_'/>
					<td children='_Remove___'/>
				</tr></thead>
				<tbody>{channels}</tbody>
			</table>
		)
	}
})