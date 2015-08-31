var MessageList_XML = React.createClass({

    propTypes:{
        messageList: React.PropTypes.array
    },

    generateXML: function () {
        var space = '    ';
        var dblSpace = space + space;
        var xml = '<items>\n';
        this.props.messageList.forEach( function (item, i) {
            xml += space + '<item>\n';
            xml += dblSpace + '<date>' + item.date + '</date>\n';
            xml += dblSpace + '<name>' + item.name + '</name>\n';
            xml += dblSpace + '<time>' + item.value + '</time>\n';
            xml += space + '</item>\n';
        });
        xml += '</items>';
        return xml;
    },

    render: function () {
        return (
            <div className="MessageFrame_XML">
                <textarea className="xmlList" value={this.generateXML()}/>
            </div>
        );
    }
});