import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import DomUtils from '../utils/dom-utils';

import NetworkMap from '../../map/map';
import Node from '../../map/node';
import Port from '../../map/port';
import NodeSet from '../../map/node-set';

import Point from '../../geometry/point';
import Offset from '../../geometry/offset';
import Viewport from '../../viewport/viewport';
import Render from '../../render/render';

import Zoomer from './zoomer';
import Navigator from './navigator'

import CoordinateNodesIndex from '../../map/indexes/coordinate-nodes-index';

export class Map extends React.Component {
	constructor() {
    	super();
    	this.state = { container: null, render: null, viewport: null, scale: 1.0, moving: false, xMove: 0, yMove: 0 };
    	this.network = new NetworkMap('m1', 'Network', [
				new Node('1', 'n1', 'router', new Point(100, 100), [
					new Port('1', 'p1', new Point(50, 50)),
					new Port('2', 'p2', new Point(-50, -50))
				]),
				new Node('2', 'n2', 'router', new Point(100, 300)),
				new Node('3', 'n3', 'router', new Point(300, 100)),
				new Node('4', 'n4', 'router', new Point(300, 300))
			] );
			this.selectedSet = new NodeSet();
			this.index = new CoordinateNodesIndex(this.network);
  	}
		componentDidMount() {
	    window.addEventListener('resize', this.onResize.bind(this), false);

			let viewport = new Viewport(this.refs.stage.width, this.refs.stage.height);
	    let render = new Render(viewport, this.refs.stage, this.props.icons.icons);

			viewport.resize(DomUtils.width(this.refs.mapContainer), DomUtils.height(this.refs.mapContainer));

	    this.setState({render: render, viewport: viewport, container: this.refs.mapContainer});
  	}
  	componentDidUpdate() {
  		this.state.render.render(this.network, (delay) => console.log(delay + 'ms'));
  	}
  	onResize() {
  		let width = this.state.container ? DomUtils.width(this.state.container) : 500;
      let height = this.state.container ? DomUtils.height(this.state.container) : 500;
  		this.state.viewport.resize(width, height);
  		this.forceUpdate();
  	}
  	onMapZoom(delta) {
  		if (this.state.render) {
  			this.state.viewport.zoom(delta);
  			this.forceUpdate();
  		}
  	}
  	onMapMove(direction) {
  		if (this.state.viewport) {
	  		switch (direction) {
					case 'up':
						this.state.viewport.up(50);
						break;
					case 'dw':
						this.state.viewport.down(50);
						break;
					case 'lt':
						this.state.viewport.left(50);
						break;
					case 'rt':
						this.state.viewport.right(50);
						break;
					default:
						throw new Error("Unexpected direction: " + direction)
						break;
				}
				this.forceUpdate();
  		}
  	}

		onMouseClick(e) {
	 		if (this.index && this.state.viewport) {
				let clickPos = new Point(e.nativeEvent.clientX, e.nativeEvent.clientY);
				let node = this.index.find(this.state.viewport.toRealPosition(clickPos), this.state.viewport.scale());
				if (node) {
					if (node.isSelected()) {
						node.deselect();
						this.selectedSet.remove(node);
						this.props.onSelect(this.selectedSet.nodes());
					} else {
						node.select();
						this.selectedSet.add(node);
						this.props.onSelect(this.selectedSet.nodes());
					}
					this.forceUpdate();
				}
			}
	 	}

 	onMouseDown(e) {
 		this.setState({moving: true, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY})
 	}

 	onMouseMove(e) {
 		if (this.state.moving) {
 			if (this.state.viewport) {
 				this.state.viewport.move(new Offset(e.nativeEvent.screenX - this.state.xMove,  e.nativeEvent.screenY - this.state.yMove));
 			}
 			this.setState({xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY})
 		}
 	}

 	onMouseUp(e) {
 		this.setState({moving: false, xMove: 0, yMove: 0})
 	}

	render() {
		let width = this.state.container ? DomUtils.width(this.state.container) : 500;
    let height = this.state.container ? DomUtils.height(this.state.container) : 500;
		return (
			<div className="map" ref="mapContainer">
				<Zoomer onZoom={this.onMapZoom.bind(this)} isLeftPanelOpen={this.props.isLeftPanelOpen}/>
				<Navigator onMove={ this.onMapMove.bind(this) } />
				<canvas id="stage" width={width} height={height} ref="stage"
					onClick={this.onMouseClick.bind(this)}
					onMouseDown={this.onMouseDown.bind(this)}
					onMouseMove={this.onMouseMove.bind(this)}
					onMouseUp={this.onMouseUp.bind(this)}/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
  return {
    config: state.config,
		icons: state.icons
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
