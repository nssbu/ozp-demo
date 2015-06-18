var Channel = React.createClass({
	onChange: function(event){
		{this.props.onToggle(this,event)}
	},
	onKill: function(event){
		{this.props.onRemove(this,event)}
	},
	render: function(){
		return (
				<tr>
					<td>{this.props.value}</td>
					<td><input onChange={this.onChange} type="checkbox" name="channelBox" checked={this.props.checked}/></td>	
					<td><input type="button" onClick={this.onKill} value="x"/></td>
				</tr>
		)
	}
})
