import IOCanvas from './io-canvas';
import Point from '../geometry/point';
import Size from '../geometry/size';
import Offset from '../geometry/offset';
import Bounds from '../geometry/bounds';

export default class MiniMapRender {
    constructor(canvas, viewport) {
      this.viewport = viewport;
      this.mapViewport = null;
      if (canvas.getContext){
		    let ctx = canvas.getContext('2d');
        this.ioCanvas = new IOCanvas(canvas, ctx);
  		} else {
  			throw "Canvas is not supported"
  		}
    }
    mapScale() {
      return this.mapViewport ? this.mapViewport.scale() : 1;
    }
    offset() {
      return this.mapViewport ? this.mapViewport.offset().xInverse() : new Offset(0, 0);
    }
    frame(mmScale) {
      let scaledWindowSize = new Size(
        window.innerWidth,
        window.innerHeight
      );
      let mapCenter = this.offset().toPoint().withMultiplier(mmScale);
      let halfWidth = scaledWindowSize.halfWidth() * mmScale;
      let halfHeight = scaledWindowSize.halfHeight() * mmScale;

      let mapDispCenter = this.viewport.toDispPosition(mapCenter);
      return new Bounds(mapDispCenter.x - halfWidth, mapDispCenter.y - halfHeight, halfWidth * 2, halfHeight * 2);
    }
    render(objs, mmScale, delayFn) {
    	var sTs = Date.now();
    	this.clean();
      let sStyle = { lineWidth: '0.5', strokeStyle: '#c0e2f7', fillStyle: null };
      let nStyle = { lineWidth: '1', strokeStyle: '#c0e2f7', fillStyle: null };
      let scale = this.mapScale() * mmScale;
      for (var i = 0; i < objs.length; i++) {
        let bounds = objs[i].bounds;
        if (objs[i].type === 'site') {
          let center = this.viewport.toDispPosition(bounds.center().withMultiplier(scale));
          let w = bounds.width * scale;
          let h = bounds.height * scale;
          this.ioCanvas.rectangle(new Point(center.x - w / 2, center.y - h / 2), w, h, sStyle);
        } else if (objs[i].type === 'node') {
          let center = this.viewport.toDispPosition(bounds.center().withMultiplier(scale));
          this.ioCanvas.circle(center, (bounds.width / 2) * scale, nStyle);
        }
      }
      let fBounds = this.frame(mmScale);
      let fStyle = { lineWidth: '2', strokeStyle: 'rgb(255, 64, 129)', fillStyle: null };
      this.ioCanvas.rectangle(fBounds.tl(), fBounds.width, fBounds.height, fStyle);

      delayFn && delayFn(Date.now() - sTs);
    }
    clean() {
    	this.ioCanvas.clear();
    }
};
