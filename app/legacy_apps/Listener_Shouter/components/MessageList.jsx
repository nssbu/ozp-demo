var MessageList = React.createClass({

    propTypes:{
        messageList: React.PropTypes.array
    },

    render: function () {

        var messages = this.props.messageList.map( function (item, i) {
            return(
                <tr key={i}>
                    <td>{moment(item.date).format('YYYY-MM-DD h:hh:ss')}</td>
                    <td>{item.channel}</td>
                    <td>{item.value}</td>
                </tr>
            );
        });

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
        );
    }
});