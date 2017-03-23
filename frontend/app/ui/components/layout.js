import React from 'react';
import Toolbar from './toolbar';
import Map from './map';
import LeftPanel from './left-panel';
import MapSet from '../../map/map-set';

export default class Layout extends React.Component {
	state = {
		isLeftPanelOpen: false,
		isDrawMarkerDisplayed: false,
		mapSet: new MapSet(),
		activeMapLayer: 'equipments',
		miniMapSource: null
	}
	updateMap = () => this.refs.map.getWrappedInstance().forceUpdate();
	handleLeftPanelStateChanged = (selected) => {
		let isLeftPanelOpen = !selected.isEmpty();
		this.setState({mapSet: selected, isLeftPanelOpen: isLeftPanelOpen});
	}
	handleDrawMarkerStateChange = (newState) => {
		this.setState({isDrawMarkerDisplayed: newState});
	}
	handleMapLayerChanged = (layer) => {
		this.setState({activeMapLayer: layer});
	}
	handleMakeLink = (linkType) => {
		this.refs.map.getWrappedInstance().makeLinks(linkType);
	}
	handleDeselect = (obj) => {
		this.refs.map.getWrappedInstance().deselect(obj);
	}
	handleDelete = (obj) => {
		this.refs.map.getWrappedInstance().remove(obj);
	}
	render() {
		return (
			<div id='layout'>
			    <Toolbar isDrawMarkerDisplayed={this.state.isDrawMarkerDisplayed} onDrawMarkerStateChanged={this.handleDrawMarkerStateChange} onMapLayerChanged={this.handleMapLayerChanged}/>
			    <Map
						ref="map"
						onSelect={this.handleLeftPanelStateChanged}
						activeLayer={this.state.activeMapLayer}
						isLeftPanelOpen={this.state.isLeftPanelOpen}
						displayDrawMarker={this.state.isDrawMarkerDisplayed}
						/>
					<LeftPanel
						open={this.state.isLeftPanelOpen}
						mapSet={this.state.mapSet}
						onMakeLink={this.handleMakeLink}
						updateMap={this.updateMap}
						onDeselect={this.handleDeselect}
						onDelete={this.handleDelete}/>
			</div>
		);
	}
}
