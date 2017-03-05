import React from 'react';
import Toolbar from './toolbar';
import Map from './map';
import LeftPanel from './left-panel';

export default class Layout extends React.Component {
	state = {
		isLeftPanelOpen: false,
		isDrawMarkerDisplayed: false,
		leftPanelTargets: []
	}
	handleLeftPanelStateChanged = (selected) => {
		let isLeftPanelOpen = selected.length > 0;
		this.setState({leftPanelTargets: selected, isLeftPanelOpen: isLeftPanelOpen});
	}
	handleDrawMarkerStateChange = (newState) => {
		this.setState({isDrawMarkerDisplayed: newState});
	}
	render() {
		return (
			<div id='layout'>
			    <Toolbar isDrawMarkerDisplayed={this.state.isDrawMarkerDisplayed} onDrawMarkerStateChanged={this.handleDrawMarkerStateChange}/>
			    <Map
						onSelect={this.handleLeftPanelStateChanged}
						isLeftPanelOpen={this.state.isLeftPanelOpen}
						displayDrawMarker={this.state.isDrawMarkerDisplayed}
						/>
					<LeftPanel open={this.state.isLeftPanelOpen} targets={this.state.leftPanelTargets}/>
			</div>
		);
	}
}
