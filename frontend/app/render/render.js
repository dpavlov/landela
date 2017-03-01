import Grid from './grid';
import MapRender from './map-render';
import NodeRender from './node-render';

export default class Render {
    constructor(settings, viewport, canvas, icons) {
      this.settings = settings;
      this.viewport = viewport;
    	this.canvas = canvas;
      if (canvas.getContext){
		    this.ctx = canvas.getContext('2d');
		    this.grid = new Grid(this.ctx);

        this.viewport.subscribe(function(scale, offset) {
          this.grid.scale(scale);
          this.grid.offset(offset);
        }.bind(this));

		    this.mapRender = new MapRender(this.viewport, this.ctx, new NodeRender(this.viewport, this.ctx, icons));
  		} else {
  			throw "Canvas is not supported"
  		}
    }
    render(map, delayFn) {
    	var sTs = Date.now();
    	this.clean();
      if (this.settings.grid) {
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
