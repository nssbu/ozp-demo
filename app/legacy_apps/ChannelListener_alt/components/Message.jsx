var Message = React.createClass({
	render: function(){
		return (
			<tr>
				<td>{this.props.date}</td>
				<td>{this.props.channel}</td>
				<td>{this.props.value}</td>
			</tr>
		)
	}
})
