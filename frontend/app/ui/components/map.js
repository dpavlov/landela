import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import DomUtils from '../utils/dom-utils';

import NetworkMap from '../../map/map';
import Node from '../../map/node';
import Site from '../../map/site';
import Port from '../../map/port';
import Link from '../../map/link';
import NodeSet from '../../map/node-set';

import Point from '../../geometry/point';
import Offset from '../../geometry/offset';
import Viewport from '../../viewport/viewport';
import Render from '../../render/render';

import Bezier from '../../utils/bezier';

import Zoomer from './zoomer';
import Navigator from './navigator';
import DrawMarker from './draw-marker/draw-marker';

import CoordinateIndex from '../../map/indexes/coordinate-index';

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
		let sPort = new Port('11', 'port-1', new Point(50, 50));
		let ePort = new Port('41', 'port-1', new Point(-50, -50));
		this.network = new NetworkMap('m1', 'Network',
		[
			new Site('1', 'site-1', new Point(650, 500), 300, 400).attachNodes([
				new Node('12', 'n12', 'router', new Point(0, 0))
			]),
			new Site('2', 'site-2', new Point(-500, 350), 300, 250).attachNodes([
				new Node('21', 'n21', 'router', new Point(50, 50))
			])
		], [
			new Node('1', 'n1', 'router', new Point(100, 100)).attachPorts(
				[
					sPort,
					new Port('12', 'port-2', new Point(-50, -50))
				]
			),
			new Node('2', 'n2', 'router', new Point(100, 300)),
			new Node('3', 'n3', 'router', new Point(350, 100)),
			new Node('4', 'n4', 'router', new Point(400, 400)).attachPorts([
				new Port('42', 'port-2', new Point(50, 50)),
				ePort
			])
		], [
			new Link('l1', sPort, ePort)
		]);
		this.selectedSet = new NodeSet();
		this.sitesIndex = null;
		this.nodesIndex = null;
		this.portsIndex = null;
		this.linksIndex = null;
		this.linkControlsIndex = null;
	}
	componentDidMount() {
		window.addEventListener('resize', this.onResize.bind(this), false);
		window.addEventListener('keydown', this.handleKeyDown.bind(this), false);

		let viewport = new Viewport(this.refs.stage.width, this.refs.stage.height);
		let render = new Render(this.props.settings.render, viewport, this.refs.stage, this.props.icons.icons);
		let width = DomUtils.width(this.refs.mapContainer);
		let height = DomUtils.height(this.refs.mapContainer);

		viewport.resize(width, height);

		this.sitesIndex = new CoordinateIndex(this.network.sites, site => site.bounds());
		this.nodesIndex = new CoordinateIndex(this.network.nodes.concat(this.network.siteNodes()), node => node.bounds(this.props.settings.sizes[node.type]));
		this.portsIndex = new CoordinateIndex(this.network.ports(), port => port.bounds());
		this.linksIndex = new CoordinateIndex(this.network.links, link => {
			let sPortCenter = viewport.portDisplayCenter(link.sPort);
			let ePortCenter = viewport.portDisplayCenter(link.ePort);
			let cp1 = new Point(sPortCenter.x + link.sControlPoint.center.x, sPortCenter.y - link.sControlPoint.center.y);
			let cp2 = new Point(ePortCenter.x + link.eControlPoint.center.x, ePortCenter.y - link.eControlPoint.center.y);
			let curve = new Bezier(sPortCenter, cp1, cp2, ePortCenter);
			return curve.bounds();
		}, (point, link) => {
			let sPortCenter = viewport.portDisplayCenter(link.sPort);
			let ePortCenter = viewport.portDisplayCenter(link.ePort);
			let cp1 = new Point(sPortCenter.x + link.sControlPoint.center.x, sPortCenter.y - link.sControlPoint.center.y);
			let cp2 = new Point(ePortCenter.x + link.eControlPoint.center.x, ePortCenter.y - link.eControlPoint.center.y);
			let curve = new Bezier(sPortCenter, cp1, cp2, ePortCenter);
			var p = curve.project(point);
			return Math.abs(p.x - point.x) < 5 && Math.abs(p.y - point.y) < 5;
		});
		this.linkControlsIndex = new CoordinateIndex(this.network.linkControls(), control => {
			var portCenter = control.port.absCenter();
			let wControlPoint = 10;
			let hControlPoint = 10;
			return {
				x: portCenter.x + control.center.x - wControlPoint / 2,
				y: portCenter.y + control.center.y - hControlPoint / 2,
				width: wControlPoint,
				height: hControlPoint
			};
		});

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
	onMouseClick(e) {
		if (this.state.movingState !== 'moving') {
			if (this.nodesIndex && this.state.viewport) {
				let xOffset = DomUtils.offsetLeft(this.refs.stage);
				let yOffset = DomUtils.offsetTop(this.refs.stage);
				let clickPos = new Point(e.nativeEvent.clientX - xOffset, e.nativeEvent.clientY - yOffset);
				let port = this.portsIndex.find(this.state.viewport.toRealPosition(clickPos));
				if (port) {
					if (port.isSelected()) {
						port.deselect();
					} else {
						port.select();
					}
					this.forceUpdate();
				} else {
					let node = this.nodesIndex.find(this.state.viewport.toRealPosition(clickPos));
					if (node) {
						if (node.isSelected()) {
							node.deselect();
							this.state.render.animateNodeDeselect(node, () => this.forceUpdate(), () => {
								this.selectedSet.remove(node);
								this.props.onSelect(this.selectedSet.nodes());
							});
						} else {
							this.state.render.animateNodeSelect(node, () => this.forceUpdate(), () => {
								node.select();
								this.selectedSet.add(node);
								this.props.onSelect(this.selectedSet.nodes());
							});
						}
					} else {
						let link = this.linksIndex.find(clickPos);
						if (link) {
							if (link.isSelected()) {
								link.deselect();
							} else {
								link.select();
							}
							this.forceUpdate();
						} else {
							let site = this.sitesIndex.find(this.state.viewport.toRealPosition(clickPos));
							if (site) {
								if (site.isSelected()) {
									site.deselect();
								} else {
									site.select();
								}
								this.forceUpdate();
							}
						}
					}
				}
			}
		} else {
			if (this.state.movingTarget !== 'map') {
				if (this.state.movingTarget instanceof Node) {
					this.nodesIndex.remove(this.state.movingTarget);
					this.nodesIndex.insert(this.state.movingTarget);
				} else if (this.state.movingTarget instanceof Site) {
					this.sitesIndex.remove(this.state.movingTarget);
					this.sitesIndex.insert(this.state.movingTarget);
				}
			}
		}
		this.setState({movingState: null, xMove: 0, yMove: 0});
	}

	onMouseDown(e) {
		let xOffset = DomUtils.offsetLeft(this.refs.stage);
		let yOffset = DomUtils.offsetTop(this.refs.stage);
		let clickPos = new Point(e.nativeEvent.clientX - xOffset, e.nativeEvent.clientY - yOffset);
		let linkControl = this.linkControlsIndex.find(this.state.viewport.toRealPosition(clickPos));
		if (linkControl) {
			this.setState({movingState: 'init', movingTarget: linkControl, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY});
		} else {
			let port = this.portsIndex.find(this.state.viewport.toRealPosition(clickPos));
			if (port) {
				this.setState({movingState: 'init', movingTarget: port, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY});
			} else {
				let node = this.nodesIndex.find(this.state.viewport.toRealPosition(clickPos));
				if (node) {
					this.setState({movingState: 'init', movingTarget: node, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY});
				} else {
					let site = this.sitesIndex.find(this.state.viewport.toRealPosition(clickPos));
					if (site) {
						this.setState({movingState: 'init', movingTarget: site, xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY});
					} else {
						this.setState({movingState: 'init', movingTarget: 'map', xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY});
					}
				}
			}
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
