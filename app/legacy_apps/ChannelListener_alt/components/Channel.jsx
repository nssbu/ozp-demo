var Channel = React.createClass({
    onChange: function ( event ) {
        this.props.onToggle(this.props.index, this.props.value, event.target.checked)
    },

    onKill: function () {
        this.props.onRemove( this.props.index, this.props.value )
    },

    render: function () {
        return (
            <tr>
                <td><input type="button" className="icon-cross-white" onClick={this.onKill}/></td>
                <td><input type="checkbox" checked={this.props.checked} onChange={this.onChange} /></td>	
                <td>{this.props.value}</td>
            </tr>
        )
    }
})
