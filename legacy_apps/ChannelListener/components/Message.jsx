var Message = React.createClass({
	render: function(){
		return (
				<div className="DataRow">
					<div className="M1">{this.props.date}</div>
					<div className="M2">{this.props.channel}</div>
					<div className="M3">{this.props.value}</div>
				</div>
		)
	}
})
