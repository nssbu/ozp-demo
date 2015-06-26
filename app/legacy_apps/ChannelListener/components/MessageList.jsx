var MessageList = React.createClass({

	mixins: [ Reflux.connect(store) ],

	render: function () {

		var messages = this.state.messageList.map( function (item, i) {
			return(
				<div className="DataRow" key={i}>
					<div className="M1">{getDate(item.date)}</div>
					<div className="M2">{item.channel}</div>
					<div className="M3">{item.value}</div>
				</div>
			);
		});

		return (
			<div className="MessageFrame">
				{messages}
			</div>
		);
	}
});