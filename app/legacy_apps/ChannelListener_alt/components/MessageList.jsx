var MessageList = React.createClass({
	getInitialState: function () {
		//external passed in as prop
		return {
			msgList: []
		}
	},
	addMessage: function (value,channel,date) {
		//external
		this.state.msgList.push(
			{value: value, date:date, channel: channel}
		)
	},
	exportMessages: function () {
		//use XML DOM? optional
		//create a new component for output instead of console.log
		var xml = '<items>'
		this.state.msgList.forEach(function (item) {
			xml+= '<item>'
			xml+= '<date>'+item.date+'</date>'
			xml+= '<channel>'+item.channel+'</channel>'
			xml+= '<message>'+item.value+'</message>'
			xml+= '</item>'
		})
		xml += '</items>'
		console.log(xml)
	},
	render: function () {
		//again external data 
		var me=this
		var messages=this.state.msgList.map(function (item,i){
			return(
				<Message index={i} value={item.value} channel={item.channel} date={getDate(item.date)}/>
			)
		})
		return (
			<div className="MessageFrame">
			<table>
				<thead>
		        	<tr>
			        	<td>Date</td>
			        	<td>Channel</td>
			        	<td>Message</td>
		        	</tr>
				</thead>
				<tbody >
					{messages}
				</tbody>
			</table>
			</div>
		)
	}
})