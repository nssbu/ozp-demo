var ChannelList = React.createClass({
	getInitialState: function () {
		return {
			chList: []
		}
	},
	onToggle: function(childComponent,event) {
		var me = this
		var index = childComponent.props.index
		var value = childComponent.props.value
		var checked = event.target.checked
		//maybe unwatch
		me.state.chList[index]={value:value,checked:checked}
		me.forceUpdate()
	},
	onRemove: function(childComponent,event) {
		var me = this
		var tempList = []

		client.data().unwatch(childComponent.props.value, null)
		//use array.filter
		this.state.chList.map(function (item,i){
			if(i!=childComponent.props.index) {
				tempList.push({value:me.state.chList[i].value, checked:me.state.chList[i].checked})
			}
		})
		me.state.chList=tempList
		me.forceUpdate()
	},
	isInList: function(intent){
		//use index of
		var found = false
		this.state.chList.map(function(item){
			if(intent==item.value){
				found = true
			}
		})
		return found
	},
	isActive: function(intent){
		var active = false;
		///use index of then check
		this.state.chList.map(function(item){
			if(intent==item.value && item.checked==true){
				active = true
			}
		})
		return active
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