import React from 'react';

import Point from '../../geometry/point';
import Offset from '../../geometry/offset';
import Size from '../../geometry/size';
import Bounds from '../../geometry/bounds';
import Indexes from '../utils/indexes';

import DomUtils from '../utils/dom-utils';

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
  }
  componentDidMount() {
    this.position();
    window.addEventListener('resize', this.onResize, false);
    this.viewport = new Viewport(this.state.bounds.width, this.state.bounds.height);
    this.parentViewport = null;
    this._render = new MiniMapRender(this.refs['mini-map'], this.viewport, this.parentViewport);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewport && !this._render.parentViewport) {
      this._render.parentViewport = nextProps.viewport;
    }
    if (nextProps.source) {
      if (nextProps.source instanceof Indexes) {
        let scale = this.scale(nextProps);
        let objs = [];
        nextProps.source.visit( (obj, b) => {
          objs.push({type: obj.constructor.name.toLowerCase(), bounds: new Bounds(b.x, b.y, b.width, b.height)});
        });
        this.setState({objs: objs, scale: scale});
      }
    }
  }
  scale(props) {
    let wx4Size = new Size(window.innerWidth, window.innerHeight).double().double();
    let mapBounds = props.source ? props.source.bounds() : new Bounds(0, 0, 0, 0);
    let xScale = this.state.bounds.width / (mapBounds.width > wx4Size.width ? mapBounds.width : wx4Size.width);
    let yScale = this.state.bounds.height / (mapBounds.height > wx4Size.height ? mapBounds.height : wx4Size.height);
    return Math.max(xScale, yScale);
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
    let pScale = this.parentViewport ? this.parentViewport.scale() : 1;
    let point = new Point(this.state.bounds.width / 2 - e.nativeEvent.layerX, this.state.bounds.height / 2 - e.nativeEvent.layerY);
    this.props.onMapMoveTo && this.props.onMapMoveTo(point.withMultiplier(1 / this.state.scale));
  }
  render() {
    if (this.props.settings.display) {
      return (
        <canvas ref="mini-map" id='mini-map' width={this.state.bounds.width} height={this.state.bounds.height} style={this.state.style} onClick={this.handleMouseClick.bind(this)}></canvas>
      );
    } else {
      return null;
    }
  }
}
