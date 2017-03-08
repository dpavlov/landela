import Grid from './grid';
import MapRender from './map-render';
import SiteRender from './site-render';
import NodeRender from './node-render';
import PortRender from './port-render';
import LinkRender from './link-render';
import IOCanvas from './io-canvas';
import SelectionAnimation from './selection-animation';

export default class Render {
    constructor(settings, viewport, canvas, icons) {
      this.settings = settings;
      this.viewport = viewport;
    	this.canvas = canvas;
      if (canvas.getContext){
		    this.ctx = canvas.getContext('2d');
        this.ioCanvas = new IOCanvas(this.ctx);
		    this.grid = new Grid(this.settings.grid, this.ioCanvas);
        this.selectionAnimation = new SelectionAnimation(viewport, this.ioCanvas, icons);
        this.viewport.subscribe(function(scale, offset) {
          this.grid.scale(scale);
          this.grid.offset(offset);
        }.bind(this));
        let portRender = new PortRender(this.viewport, this.ioCanvas);
        let nodeRender = new NodeRender(this.viewport, this.ioCanvas, icons, portRender);
        let siteRender = new SiteRender(settings.site, this.viewport, this.ioCanvas, nodeRender);
        let linkRender = new LinkRender(settings.link, this.viewport, this.ioCanvas);
		    this.mapRender = new MapRender(this.viewport, siteRender, nodeRender, linkRender);
  		} else {
  			throw "Canvas is not supported"
  		}
    }
    select(target, updateCallback, doneCallback) {
      this.selectionAnimation.select(target, updateCallback, doneCallback);
    }
    deselect(target, updateCallback, doneCallback) {
      this.selectionAnimation.deselect(target, updateCallback, doneCallback);
    }
    render(map, delayFn) {
    	var sTs = Date.now();
    	this.clean();
      if (this.settings.grid.display) {
        this._layer0(this.grid);
      }
      this._layer1(map);
      delayFn && delayFn(Date.now() - sTs);
    }
    clean() {
    	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    _layer0(grid) {
    	grid.render(this.canvas.width, this.canvas.height);
    }
    _layer1(map) {
    	this.mapRender.render(map);
    }
};
