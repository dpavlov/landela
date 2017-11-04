import React from 'react';
import Toolbar from './toolbar';
import Map from './map';
import MapSet from '../../map/map-set';

export default class Layout extends React.Component {
	state = {
		isDrawMarkerDisplayed: false,
		mapSet: new MapSet(),
		activeMapLayer: 'equipments'
	}
	updateMap = () => this.refs.map.getWrappedInstance().forceUpdate();
	handleSelectedSetChanged = (selected) => {
		this.setState({mapSet: selected});
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
					onSelect={this.handleSelectedSetChanged}
					activeLayer={this.state.activeMapLayer}
					isLeftPanelOpen={this.state.isLeftPanelOpen}
					displayDrawMarker={this.state.isDrawMarkerDisplayed}
				/>
			</div>
		);
	}
}
