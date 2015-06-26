var ChannelList = React.createClass({
    
    getInitialState: function () {
        //fine
        return {
            chList: []
        }
    },

    onToggle: function (index, value, checked) {
        //maybe unwatch/rewatch on toggle
        //toggle function will be external
        var tempList = this.state.chList
        tempList.splice(index, 1, {value: value, checked: checked})
        this.setState({chList: tempList})
    },

    onRemove: function (index, value) {
        //fine until data is external
        client.data().unwatch(value, null)
        var tempList = this.state.chList
        tempList.splice(index,1)
        this.setState({chList: tempList})
    },

    isInList: function (intent) {
        //fine until data is external
        return this.state.chList.some(function (item) {
        	return (item.value === intent)
        })
    },

    isActive: function (intent) {
        //fine until data is external
        return this.state.chList.some(function (item) {
        	return (item.value === intent && item.checked === true)
        })
    },

    render: function () {
        var me = this
        var channels = this.state.chList.map(function (item,i){//correct way to use map
            return(
                <Channel key={item.value} onToggle={me.onToggle} onRemove={me.onRemove} index={i} value={item.value} checked={item.checked}/>
            )
        })
        return (
        	<div className="ChannelFrame" draggable="false" onDrop={this.props.drop} onDragOver={this.props.dragOver}>
	        	<table>
		        	<thead>
		        		<tr>
			        		<td>Remove</td>
			        		<td>Active</td>
			        		<td>Channel name</td>
		        		</tr>
		        	</thead>

		        	<tbody>
		            	{channels}
		            </tbody>
	            </table>
            </div>
        )
    }
})