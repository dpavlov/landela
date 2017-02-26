import React from 'react';

import Paper from 'material-ui/Paper';
import Slider from 'material-ui/Slider';

export default class Zoomer extends React.Component {
	constructor() {
    super();
    this.state = { scale: 1.0 };
  }

  onZoom(event, newValue) {
  	this.props.onZoom && this.props.onZoom(newValue - this.state.scale);
  	this.setState({scale: newValue});
  }
	render() {
		return (
			<div id='map-zoomer' className={this.props.isLeftPanelOpen ? "with-left-panel" : "without-left-panel"}>
				<Paper zDepth={1} style={{height: 250, width: 40, padding: 10}}>
					<Slider style={{height: 200, zIndex: 2}} axis="y" defaultValue={1.0} min={this.props.settings.min} max={this.props.settings.max} step={this.props.settings.step} onChange={this.onZoom.bind(this)}/>
				</Paper>
			</div>
		);
	}
}
