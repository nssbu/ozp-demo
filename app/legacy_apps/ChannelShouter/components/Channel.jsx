var Channel = React.createClass({
	onChange: function(event){
		{this.props.onToggle(this,event)}
	},
	onKill: function(event){
		{this.props.onRemove(this,event)}
	},
	render: function(){
		return (
			<div className="DataRow">
				<div className="ch1"><input type="button" className="icon-cross-white" onClick={this.onKill}/></div>
				<div className="ch2"><input onChange={this.onChange} type="checkbox" name="channelBox" checked={this.props.checked}/></div>	
				<div className="ch3">{this.props.value}</div>
			</div>
		)
	}
})
