import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import DomUtils from '../utils/dom-utils';

import MapGenerator from '../../map/gen/simple-map-generator';

import Point from '../../geometry/point';
import Offset from '../../geometry/offset';
import Bounds from '../../geometry/bounds';
import Viewport from '../../viewport/viewport';
import Render from '../../render/render';

import NodeIcons from '../../utils/node-icons';
import StateMachine from '../../utils/state-machine';
import Site from '../../map/site';

import Zoomer from './zoomer';
import Navigator from './navigator';
import DrawMarker from './draw-marker/draw-marker';

import Indexes from './indexes';

import Selection from './selection'

export class Map extends React.Component {

	state = {
		container: null,
	};

	constructor() {
		super();
		this.network = MapGenerator.generate(new Bounds(- 1000, -700, 2000, 1400), 15, 0.1);
		this.selection = null;
		this.indexes = null;
		this._render = null;
		this.viewport = null;

		this._draggingParams = {target: null, xMove: 0, yMove: 0};
		this._dragging = new StateMachine('init', [
			{event: 'move-target-selected', from: 'init', to: 'ready-to-move'},
			{event: 'moved', from: 'ready-to-move', to: 'moving'},
			{event: 'left-resize-target-selected', from: 'init', to: 'ready-to-left-resize'},
			{event: 'resized', from: 'ready-to-left-resize', to: 'left-resizing'},
			{event: 'right-resize-target-selected', from: 'init', to: 'ready-to-right-resize'},
			{event: 'resized', from: 'ready-to-right-resize', to: 'right-resizing'},
			{event: 'top-resize-target-selected', from: 'init', to: 'ready-to-top-resize'},
			{event: 'resized', from: 'ready-to-top-resize', to: 'top-resizing'},
			{event: 'bottom-resize-target-selected', from: 'init', to: 'ready-to-bottom-resize'},
			{event: 'resized', from: 'ready-to-bottom-resize', to: 'bottom-resizing'},
			{event: 'reset', from: '*', to: 'init'}
		]);
	}
	componentDidMount() {
		window.addEventListener('resize', this.onResize.bind(this), false);
		window.addEventListener('keydown', this.handleKeyDown.bind(this), false);

		this.viewport = new Viewport(this.refs.stage.width, this.refs.stage.height);
		let icons = new NodeIcons(this.props.icons.icons, this.viewport.isScaleInRange.bind(this.viewport));
		this._render = new Render(this.props.settings.render, this.viewport, this.refs.stage, icons);
		let width = DomUtils.width(this.refs.mapContainer);
		let height = DomUtils.height(this.refs.mapContainer);

		this.viewport.resize(width, height);

		this.indexes = new Indexes(this.viewport, this.network, icons);

		this.selection = new Selection(this._render);

		this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.viewport.state());

		document.addEventListener('mouseout', (e) => this.setState({movingState: null}));
		document.addEventListener('mousemove', this.onMouseMove.bind(this));

		this.setState({container: this.refs.mapContainer});
	}
	componentDidUpdate() {
		this._render.render(this.network, (delay) => console.log(delay));
	}
	onResize() {
		let width = this.state.container ? DomUtils.width(this.state.container) : 500;
		let height = this.state.container ? DomUtils.height(this.state.container) : 500;
		this.viewport.resize(width, height);
		this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.viewport.state());
		this.forceUpdate();
	}
	handleAdd = (aType, name) => {
		let x = DomUtils.width(this.state.container) / 2;
		let y = DomUtils.height(this.state.container) / 2;
		let realPos = this.viewport.toRealPosition(new Point(x, y));
		let newNode = new Node('n' + Math.random(), name, aType, realPos);
		this.network.nodes.push(newNode);
		this.nodesIndex.insert(newNode);
		this.forceUpdate();
	}
	onMapZoom(delta) {
		if (this._render) {
			this.viewport.zoom(delta);
			this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.viewport.state());
			this.forceUpdate();
		}
	}
	onMapMove(direction) {
		if (this.viewport) {
			let delta = this._render.grid.step();
			switch (direction) {
				case 'up':
					this.viewport.up(delta);
					break;
				case 'dw':
					this.viewport.down(delta);
					break;
				case 'lt':
					this.viewport.left(delta);
					break;
				case 'rt':
					this.viewport.right(delta);
					break;
				default:
					throw new Error("Unexpected map move direction: " + direction)
					break;
			}
			this.props.onViewportStateChanged && this.props.onViewportStateChanged(this.viewport.state());
			this.forceUpdate();
		}
	}
	handleKeyDown(e) {
		var moves = ['lt', 'up', 'rt', 'dw'];
		if(e.keyCode && e.keyCode > 36 && e.keyCode < 41) this.onMapMove(moves[e.keyCode - 37]);
		return true;
	}
	onGridAlign = () => {
		let offset = this._render.grid.align(this.viewport.offset());
		this.viewport.move(offset);
		this.forceUpdate();
	}
	getMouseRealPoint(e) {
		let xOffset = DomUtils.offsetLeft(this.refs.stage);
		let yOffset = DomUtils.offsetTop(this.refs.stage);
		let point = new Point(e.nativeEvent.clientX - xOffset, e.nativeEvent.clientY - yOffset);
		return { disp: point, real: this.viewport.toRealPosition(point) };
	}
	onMouseClick(e) {
		if (!this._dragging.isAnyOf(['moving', 'left-resizing', 'right-resizing', 'top-resizing', 'bottom-resizing'])) {
			if (this.viewport) {
				let target = this.indexes.findByPoint(this.getMouseRealPoint(e));
				if (target) {
					this.selection.select(target, this.forceUpdate.bind(this), (selectedSet) => {
						this.props.onSelect(selectedSet.nodes());
						this.forceUpdate();
					})
				}
			}
		} else {
			if (this._draggingParams.target !== 'map') {
				this.indexes.update(this._draggingParams.target);
			}
		}
		this._dragging = this._dragging.on('reset');
		this._draggingParams = {target: null, xMove: 0, yMove: 0};
	}

	onMouseDown(e) {
		let pos = this.getMouseRealPoint(e);
		let target = this.indexes.findByPoint(pos);
		if (target) {
			if (target instanceof Site) {
				if (this._render.mapRender.siteRender.isPointInMoveHandler(target, pos.disp)) {
					this._draggingParams = {target: target, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY};
					this._dragging = this._dragging.on('move-target-selected');
				} else {
					let handler = this._render.mapRender.siteRender.isPointInResizeHandler(target, pos.disp);
					if (handler) {
						this._draggingParams = {target: target, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY};
						this._dragging = this._dragging.on(handler + '-resize-target-selected');
					} else {
						this._draggingParams = {target: 'map', xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY};
						this._dragging = this._dragging.on('move-target-selected');
					}
				}
			} else {
				this._draggingParams = {target: target, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY};
				this._dragging = this._dragging.on('move-target-selected');
			}
		} else {
			this._draggingParams = {target: 'map', xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY};
			this._dragging = this._dragging.on('move-target-selected');
		}
	}

	onMouseMove(e) {
		let offset = new Offset(e.screenX - this._draggingParams.xMove,  e.screenY - this._draggingParams.yMove);
		let target = this._draggingParams.target;
		if (this._dragging.is('ready-to-move') || this._dragging.is('moving')) {
			if (target === 'map') {
				this.viewport.move(offset);
			} else {
				target.move(offset.withReverseMultiplier(this.viewport.scale()));
			}
			this._dragging = this._dragging.on('moved');
			this.forceUpdate();
		} else if (this._dragging.isAnyOf(['ready-to-left-resize', 'left-resizing'])) {
			target.resize('left', offset.withReverseMultiplier(this.viewport.scale()));
			this._dragging = this._dragging.on('resized');
			this.forceUpdate();
		} else if (this._dragging.isAnyOf(['ready-to-right-resize', 'right-resizing'])) {
			target.resize('right', offset.withReverseMultiplier(this.viewport.scale()));
			this._dragging = this._dragging.on('resized');
			this.forceUpdate();
		} else if (this._dragging.isAnyOf(['ready-to-top-resize', 'top-resizing'])) {
			target.resize('top', offset.withReverseMultiplier(this.viewport.scale()));
			this._dragging = this._dragging.on('resized');
			this.forceUpdate();
		} else if (this._dragging.isAnyOf(['ready-to-bottom-resize', 'bottom-resizing'])) {
			target.resize('bottom', offset.withReverseMultiplier(this.viewport.scale()));
			this._dragging = this._dragging.on('resized');
			this.forceUpdate();
		}
		this._draggingParams.xMove = e.screenX;
		this._draggingParams.yMove = e.screenY;
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
