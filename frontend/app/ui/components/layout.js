import React from 'react';
import Toolbar from './toolbar';
import Map from './map';
import LeftPanel from './left-panel';

export default class Layout extends React.Component {
	state = {
		isLeftPanelOpen: false,
		leftPanelTargets: []
	}
	handleLeftPanelStateChanged = (selected) => {
		let isLeftPanelOpen = selected.length > 0;
		this.setState({leftPanelTargets: selected, isLeftPanelOpen: isLeftPanelOpen});
	}
	render() {
		return (
			<div id='layout'>
			    <Toolbar/>
			    <Map
						onSelect={this.handleLeftPanelStateChanged}
						isLeftPanelOpen={this.state.isLeftPanelOpen}/>
					<LeftPanel open={this.state.isLeftPanelOpen} targets={this.state.leftPanelTargets}/>
			</div>
		);
	}
}
