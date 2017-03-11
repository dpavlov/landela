import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import DomUtils from '../utils/dom-utils';

import MapGenerator from '../../map/gen/random-map-generator';

import Point from '../../geometry/point';
import Offset from '../../geometry/offset';
import Bounds from '../../geometry/bounds';
import Viewport from '../../viewport/viewport';
import Render from '../../render/render';

import NodeIcons from '../../utils/node-icons';

import Zoomer from './zoomer';
import Navigator from './navigator';
import DrawMarker from './draw-marker/draw-marker';

import Indexes from './indexes';

import Selection from './selection'

export class Map extends React.Component {

	state = {
		container: null,
		render: null,
		viewport: null,
		movingState: null,
		movingTarget: null,
		xMove: 0,
		yMove: 0,
		renderDelay: 0
	};

	constructor() {
		super();
		this.network = MapGenerator.generate(new Bounds(- 1000, -700, 2000, 1400), 15, 0.1);
		this.selection = null;
		this.indexes = null;
	}
	componentDidMount() {
		window.addEventListener('resize', this.onResize.bind(this), false);
		window.addEventListener('keydown', this.handleKeyDown.bind(this), false);

		let viewport = new Viewport(this.refs.stage.width, this.refs.stage.height);
		let icons = new NodeIcons(this.props.icons.icons, viewport.isScaleInRange.bind(viewport));
		let render = new Render(this.props.settings.render, viewport, this.refs.stage, icons);
		let width = DomUtils.width(this.refs.mapContainer);
		let height = DomUtils.height(this.refs.mapContainer);

		viewport.resize(width, height);

		this.indexes = new Indexes(viewport, this.network, icons);

		this.selection = new Selection(render);

		this.props.onViewportStateChanged && this.props.onViewportStateChanged(viewport.state());

		document.addEventListener('mouseout', (e) => this.setState({movingState: null}));
		document.addEventListener('mousemove', this.onMouseMove.bind(this));

		this.setState({render: render, viewport: viewport, container: this.refs.mapContainer});
	}
	componentDidUpdate() {
		this.state.render.render(this.network, (delay) => console.log(delay));
	}
	onResize() {
		let width = this.state.container ? DomUtils.width(this.state.container) : 500;
		let height = this.state.container ? DomUtils.height(this.state.container) : 500;
		this.state.viewport.resize(width, height);
		this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.state.viewport.state());
		this.forceUpdate();
	}
	handleAdd = (aType, name) => {
		let x = DomUtils.width(this.state.container) / 2;
		let y = DomUtils.height(this.state.container) / 2;
		let realPos = this.state.viewport.toRealPosition(new Point(x, y));
		let newNode = new Node('n' + Math.random(), name, aType, realPos);
		this.network.nodes.push(newNode);
		this.nodesIndex.insert(newNode);
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
			let delta = this.state.render.grid.step();
			switch (direction) {
				case 'up':
				this.state.viewport.up(delta);
				break;
				case 'dw':
				this.state.viewport.down(delta);
				break;
				case 'lt':
				this.state.viewport.left(delta);
				break;
				case 'rt':
				this.state.viewport.right(delta);
				break;
				default:
				throw new Error("Unexpected map move direction: " + direction)
				break;
			}
			this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.state.viewport.state());
			this.forceUpdate();
		}
	}
	handleKeyDown(e) {
		var moves = ['lt', 'up', 'rt', 'dw'];
		if(e.keyCode && e.keyCode > 36 && e.keyCode < 41) this.onMapMove(moves[e.keyCode - 37]);
		return true;
	}
	onGridAlign = () => {
		let offset = this.state.render.grid.align(this.state.viewport.offset());
		this.state.viewport.move(offset);
		this.forceUpdate();
	}
	getMouseRealPoint(e) {
		let xOffset = DomUtils.offsetLeft(this.refs.stage);
		let yOffset = DomUtils.offsetTop(this.refs.stage);
		let point = new Point(e.nativeEvent.clientX - xOffset, e.nativeEvent.clientY - yOffset);
		return { disp: point, real: this.state.viewport.toRealPosition(point) };
	}
	onMouseClick(e) {
		if (this.state.movingState !== 'moving') {
			if (this.state.viewport) {
				let target = this.indexes.findByPoint(this.getMouseRealPoint(e));
				if (target) {
					this.selection.select(target, this.forceUpdate.bind(this), (selectedSet) => {
						this.props.onSelect(selectedSet.nodes());
						this.forceUpdate();
					})
				}
			}
		} else {
			if (this.state.movingTarget !== 'map') {
				this.indexes.update(this.state.movingTarget);
			}
		}
		this.setState({movingState: null, xMove: 0, yMove: 0});
	}

	onMouseDown(e) {
		let target = this.indexes.findByPoint(this.getMouseRealPoint(e));
		if (target) {
			this.setState({movingState: 'init', movingTarget: target, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY});
		} else {
			this.setState({movingState: 'init', movingTarget: 'map', xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY});
		}
	}

	onMouseMove(e) {
		if (this.state.movingState === 'init' || this.state.movingState === 'moving') {
			let offset = new Offset(e.screenX - this.state.xMove,  e.screenY - this.state.yMove)
			if (this.state.movingTarget === 'map') {
				if (this.state.viewport) {
					this.state.viewport.move(offset);
				}
			} else {
				this.state.movingTarget.move(offset.withReverseMultiplier(this.state.viewport.scale()));
			}
			this.setState({movingState: 'moving', xMove: e.screenX, yMove: e.screenY})
		}
	}

	render() {
		let width = this.state.container ? DomUtils.width(this.state.container) : 500;
		let height = this.state.container ? DomUtils.height(this.state.container) : 500;
		return (
			<div className="map" ref="mapContainer">
			<Zoomer settings={this.props.settings.zoomer} onZoom={this.onMapZoom.bind(this)} isLeftPanelOpen={this.props.isLeftPanelOpen}/>
			<Navigator onMove={ this.onMapMove.bind(this) } />
			{
				this.props.displayDrawMarker
					? <DrawMarker container={this.refs.mapContainer} onAdd={this.handleAdd} onGridAlign={this.onGridAlign} settings={this.props.settings['draw-marker']}/>
					: null
			}
			<canvas id="stage" width={width} height={height} ref="stage"
			onClick={this.onMouseClick.bind(this)}
			onMouseDown={this.onMouseDown.bind(this)}/>
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
