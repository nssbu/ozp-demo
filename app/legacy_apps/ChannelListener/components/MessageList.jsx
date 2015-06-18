var MessageList = React.createClass({
	getInitialState: function () {
		return {
			mList: []
		}
	},
	addMessage: function(value,channel,date){
		this.state.mList.push(
			{value: value, date:date, channel: channel}
		)
	},
	exportMessages: function(){
		var xml = '<items>'
		this.state.mList.map(function (item){
			xml+= '<item>'
			xml+= '<date>'+item.date+'</date>'
			xml+= '<channel>'+item.channel+'</channel>'
			xml+= '<message>'+item.value+'</message>'
			xml+= '</item>'
		})
		xml += '</items>'
		alert(xml)
	},
	render: function () {
		var me=this
		var style={
			border: '2px solid black'
		}
		var messages=this.state.mList.map(function (item,i){
			return(
				<Message index={i} value={item.value} channel={item.channel} date={getDate(item.date)}/>
			)
		})
		return (
			<table style={style}>
				<thead><tr>
					<td children='_Date_________________'/>
					<td children='_Ch_'/>
					<td children='_Message___________________' />
				</tr></thead>
				<tbody>{messages}</tbody>
			</table>
		)
	}
})