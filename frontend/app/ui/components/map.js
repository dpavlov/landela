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

	state = {
		container: null,
		render: null,
		viewport: null,
		moving: false,
		xMove: 0,
		yMove: 0,
		renderDelay: 0
	};

	constructor() {
    	super();
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
			this.index = null;
  	}
		componentDidMount() {
	    window.addEventListener('resize', this.onResize.bind(this), false);

			let viewport = new Viewport(this.refs.stage.width, this.refs.stage.height);
	    let render = new Render(viewport, this.refs.stage, this.props.icons.icons);
			let width = DomUtils.width(this.refs.mapContainer);
			let height = DomUtils.height(this.refs.mapContainer);

			viewport.resize(width, height);

			this.index = new CoordinateNodesIndex(this.network, this._nodeSize.bind(this));

			this.props.onViewportStateChanged && this.props.onViewportStateChanged(viewport.state());

	    this.setState({render: render, viewport: viewport, container: this.refs.mapContainer});

			document.addEventListener('mouseout', (e) => this.setState({moving: false}));
  	}
  	componentDidUpdate() {
  		this.state.render.render(this.network, (delay) => console.log(delay));
  	}
		_nodeSize(node) {
			let nSize = this.props.settings.sizes[node.type];
			return nSize ? {width: nSize[0], height: nSize[1]} : {width: 128, height: 128};
		}
  	onResize() {
  		let width = this.state.container ? DomUtils.width(this.state.container) : 500;
      let height = this.state.container ? DomUtils.height(this.state.container) : 500;
  		this.state.viewport.resize(width, height);
			this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.state.viewport.state());
  		this.forceUpdate();
  	}
  	onMapZoom(delta) {
  		if (this.state.render) {
  			this.state.viewport.zoom(delta);
				this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.state.viewport.state());
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
				this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.state.viewport.state());
				this.forceUpdate();
  		}
  	}

		onMouseClick(e) {
	 		if (this.index && this.state.viewport) {
				let xOffset = DomUtils.offsetLeft(this.refs.stage);
				let yOffset = DomUtils.offsetTop(this.refs.stage);
				let clickPos = new Point(e.nativeEvent.clientX - xOffset, e.nativeEvent.clientY - yOffset);
				let node = this.index.find(this.state.viewport.toRealPosition(clickPos));
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
		let xOffset = DomUtils.offsetLeft(this.refs.stage);
		let yOffset = DomUtils.offsetTop(this.refs.stage);

		let dispPos = new Point(e.nativeEvent.clientX - xOffset, e.nativeEvent.clientY - yOffset);
		let realPos = this.state.viewport.toRealPosition(dispPos);

		this.props.onPosition && this.props.onPosition(dispPos, realPos);

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
				<Zoomer settings={this.props.settings.zoomer} onZoom={this.onMapZoom.bind(this)} isLeftPanelOpen={this.props.isLeftPanelOpen}/>
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
		settings: state.config.state === 'Done' ? state.config.config.settings.map : {},
		icons: state.icons
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
