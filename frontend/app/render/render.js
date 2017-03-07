import Grid from './grid';
import MapRender from './map-render';
import SiteRender from './site-render';
import NodeRender from './node-render';
import LinkRender from './link-render';
import IOCanvas from './io-canvas';

export default class Render {
    constructor(settings, viewport, canvas, icons) {
      this.settings = settings;
      this.viewport = viewport;
    	this.canvas = canvas;
      if (canvas.getContext){
		    this.ctx = canvas.getContext('2d');
        this.ioCanvas = new IOCanvas(this.ctx);
		    this.grid = new Grid(this.settings.grid, this.ioCanvas);

        this.viewport.subscribe(function(scale, offset) {
          this.grid.scale(scale);
          this.grid.offset(offset);
        }.bind(this));
        let nodeRender = new NodeRender(this.viewport, this.ctx, icons);
        let siteRender = new SiteRender(settings.site, this.viewport, this.ctx, nodeRender);
        let linkRender = new LinkRender(settings.link, this.viewport, this.ctx, this.ioCanvas);
		    this.mapRender = new MapRender(this.viewport, this.ctx, siteRender, nodeRender, linkRender);
  		} else {
  			throw "Canvas is not supported"
  		}
    }
    animateNodeDeselect(node, update, done) {
      this.mapRender.nodeRender.animateNodeDeselect(node, update, done);
    }
    animateNodeSelect(node, update, done) {
      this.mapRender.nodeRender.animateNodeSelect(node, update, done);
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
