var MessageList = React.createClass({
	getInitialState: function () {
		return {
			msgList: []
		}
	},
	addMessage: function(value,channel,date){
		this.state.msgList.push(
			{value: value, date:date, channel: channel}
		)
	},
	exportMessages: function(){
		var xml = '<items>'
		this.state.msgList.map(function (item){
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
		var messages=this.state.msgList.map(function (item,i){
			return(
				<Message index={i} value={item.value} channel={item.channel} date={getDate(item.date)}/>
			)
		})
		return (
			<div className="MessageFrame">{messages}</div>
		)
	}
})