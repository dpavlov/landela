import React from 'react';

import Point from '../../geometry/point';
import Offset from '../../geometry/offset';
import Size from '../../geometry/size';
import Bounds from '../../geometry/bounds';
import Indexes from '../utils/indexes';

import DomUtils from '../utils/dom-utils';
import StateMachine from '../../utils/state-machine';

import MiniMapRender from '../../render/mini-map-render'
import Viewport from '../../viewport/viewport';

export default class MiniMap extends React.Component {
  constructor(props){
    super(props);
    let wSize = new Size(window.innerWidth, window.innerHeight);
    let mSize = new Size(wSize.width * this.props.settings.width, wSize.height * this.props.settings.height);
    this.state = {
      style: {top: '0px', left: '0px', position: 'absolute', zIndex: 1},
      bounds: new Bounds(0, 0, mSize.width, mSize.height),
      scale: 1,
      objs: [],
    };
    this._render = null;
    this.viewport = null;
    this._draggingParams = {xMove: 0, yMove: 0};
    this._dragging = new StateMachine('init', [
			{event: 'frame-selected', from: 'init', to: 'ready-to-move'},
			{event: 'moved', from: 'ready-to-move', to: 'moving'},
			{event: 'reset', from: '*', to: 'init'}
		]);
  }
  componentDidMount() {
    this.position();
    window.addEventListener('resize', this.onResize, false);
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseout', (e) => {
			this._dragging = this._dragging.on('reset');
			this._draggingParams = {xMove: 0, yMove: 0};
		});
    this.viewport = new Viewport(this.state.bounds.width, this.state.bounds.height);
    this._render = new MiniMapRender(this.refs['mini-map'], this.viewport, null, this.icons);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.mapViewport && !this._render.mapViewport) {
      this._render.mapViewport = nextProps.mapViewport;
    }
    if (nextProps.source) {
      if (nextProps.source instanceof Indexes) {
        let scale = this.scale(nextProps);
        let objs = [];
        nextProps.source.visit( (obj, b) => {
          objs.push({type: obj.constructor.name.toLowerCase(), bounds: nextProps.boundsResolver(obj, b)});
        });
        this.setState({objs: objs, scale: scale});
      }
    }
  }
  scale(props) {
    let wx4Size = new Size(window.innerWidth, window.innerHeight);
    let mapBounds = props.source ? props.source.bounds() : new Bounds(0, 0, 0, 0);
    let mapSize = new Size(
      Math.max(Math.abs(mapBounds.x), Math.abs(mapBounds.x + mapBounds.width)),
      Math.max(Math.abs(mapBounds.y), Math.abs(mapBounds.y - mapBounds.height))
    ).double();
    let xScale = this.state.bounds.width / (mapSize.width > wx4Size.width ? mapSize.width : wx4Size.width);
    let yScale = this.state.bounds.height / (mapSize.height > wx4Size.height ? mapSize.height : wx4Size.height);
    return Math.min(xScale, yScale);
  }
  componentDidUpdate() {
    this._render.render(this.state.objs, this.state.scale, (delay) => console.log("Rendering mini-map took " + delay + " ms"));
  }
  position() {
    let wSize = new Size(window.innerWidth, window.innerHeight);
    let mSize = new Size(wSize.width * this.props.settings.width, wSize.height * this.props.settings.height);
    let wbrPoint = new Point(wSize.width, wSize.height);
    let mtlPoint = wbrPoint.shift(new Offset(-mSize.width - 10, -mSize.height - 20));
    let bounds = new Bounds(mtlPoint.x, mtlPoint.y, mSize.width, mSize.height);
    this.setState({ style: {... this.state.style, left: mtlPoint.x + 'px', top: mtlPoint.y + 'px'}, bounds: bounds });
    return bounds;
  }
  onResize = (e) => {
    this.position()
		this.viewport.resize(this.state.bounds.width, this.state.bounds.height);
    let scale = this.scale(this.props);
    this.setState({ scale: scale });
  }
  handleMouseClick(e) {
    if (!this._dragging.is('moving')) {
      let point = new Point(this.state.bounds.width / 2 - e.nativeEvent.layerX, this.state.bounds.height / 2 - e.nativeEvent.layerY);
      let scale =  1 / (this.state.scale * this._render.mapViewport.scale());
      this.props.onMapMoveTo && this.props.onMapMoveTo(point.withMultiplier(scale));
    }
    this._dragging = this._dragging.on('reset');
    this._draggingParams = {xMove: 0, yMove: 0};
  }
  handleMouseDown(e) {
    let point = new Point(e.nativeEvent.layerX, e.nativeEvent.layerY);
    let fBounds = this._render.frame(this.state.scale);
    if (fBounds.in(point, false)) {
      this._draggingParams = { xMove: e.nativeEvent.screenX, yMove: e.nativeEvent.screenY };
      this._dragging = this._dragging.on('frame-selected');
    }
  }
  handleMouseMove(e) {
    if (this._dragging.is('ready-to-move') || this._dragging.is('moving')) {
      let offset = new Offset(e.screenX - this._draggingParams.xMove, e.screenY - this._draggingParams.yMove);
      this.props.onMapMove && this.props.onMapMove(offset.inverse().withMultiplier(1 / this.state.scale));
      this._dragging = this._dragging.on('moved');
			this.forceUpdate();
    }
    this._draggingParams.xMove = e.screenX;
		this._draggingParams.yMove = e.screenY;
  }
  render() {
    if (this.props.settings.display) {
      return (
        <canvas ref="mini-map" id='mini-map' width={this.state.bounds.width} height={this.state.bounds.height} style={this.state.style} onClick={this.handleMouseClick.bind(this)} onMouseDown={this.handleMouseDown.bind(this)}></canvas>
      );
    } else {
      return null;
    }
  }
}
