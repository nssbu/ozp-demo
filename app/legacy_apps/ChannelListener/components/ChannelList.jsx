var ChannelList = React.createClass({
	
	mixins: [ Reflux.connect(store) ],

	render: function () {
		var channels = this.state.channelList.map(function (item,i) {
			removeFunction = function () {
				actions.removeChannel(i, item.value);
			};
			toggleFunction = function () {
				actions.toggleChannel(i);
			};
			return(
				<div className="DataRow">
					<div className="ch1">
						<input type="button" className="icon-cross-white" onClick={removeFunction}/>
					</div>
					<div className="ch2">
						<input type="checkbox" onChange={toggleFunction} checked={item.checked}/>
					</div>	
					<div className="ch3">
						{item.value}
					</div>
				</div>
			);
		});
		return (
			<div className="ChannelFrame" draggable="false" onDrop={this.props.drop} onDragOver={this.props.dragOver}>
				{channels}
			</div>
		);
	}
});