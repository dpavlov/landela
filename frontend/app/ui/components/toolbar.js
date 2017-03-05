import React from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

export default class Toolbar extends React.Component {
	handleDrawMarkerButton = (newState) => {
    return (e) => {
      this.props.onDrawMarkerStateChanged && this.props.onDrawMarkerStateChanged(newState);
    }
  }
	render() {
		let rightButtons = this.props.isDrawMarkerDisplayed ? (
			 <RaisedButton label="Hide draw marker" secondary={true} onTouchTap={this.handleDrawMarkerButton(false).bind(this)}/>
		) : (
			 <RaisedButton label="Show draw marker" secondary={true} onTouchTap={this.handleDrawMarkerButton(true).bind(this)}/>
		);
		return (
			<div className='toolbar'>
		 		<AppBar title={"Landela"} iconElementRight={rightButtons} />
			</div>
		);
	}
}
