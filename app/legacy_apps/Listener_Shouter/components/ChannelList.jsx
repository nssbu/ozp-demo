var ChannelList = React.createClass({

    propTypes:{
        drop: React.PropTypes.func,
        dragOver: React.PropTypes.func,
        removeChannel: React.PropTypes.func,
        toggleChannel: React.PropTypes.func,
        channelList: React.PropTypes.array
    },

    render: function () {
        var me = this;
        var channels = this.props.channelList.map(function (item,i) {
            removeFunction = function () {
                me.props.removeChannel(i, item.value);
            };
            toggleFunction = function () {
                me.props.toggleChannel(i);
            };
            return(
                <tr key={item.value}>
                    <td>
                        <input type="button" className="icon-cross-white" onClick={removeFunction}/>
                    </td>
                    <td>
                        <input type="checkbox" onChange={toggleFunction} checked={item.checked}/>
                    </td>    
                    <td>
                        {item.value}
                    </td>
                </tr>
            );
        });

        return (
            <div className="ChannelFrame" draggable="false" onDrop={this.props.drop} onDragOver={this.props.dragOver}>
                <table>
                    <thead>
                        <tr>
                            <td>Remove</td>
                            <td>Active</td>
                            <td>Channel name</td>
                        </tr>
                    </thead>
                    <tbody>
                        {channels}
                    </tbody>
                </table>
            </div>
        );
    }
});