import IOCanvas from './io-canvas';
import Point from '../geometry/point';
import Size from '../geometry/size';
import Offset from '../geometry/offset';
import Bounds from '../geometry/bounds';

export default class MiniMapRender {
    constructor(canvas, viewport, parentViewport) {
      this.viewport = viewport;
      this.parentViewport = null;
      if (canvas.getContext){
		    let ctx = canvas.getContext('2d');
        this.ioCanvas = new IOCanvas(canvas, ctx);
  		} else {
  			throw "Canvas is not supported"
  		}
    }
    withParentScale(v) {
      return this.parentViewport ? this.parentViewport.withScale(v) : v
    }
    frame(mmScale) {
      let pScale = this.parentViewport ? this.parentViewport.scale() : 1;
      let scale = mmScale / pScale;

      let offset = this.parentViewport ? this.parentViewport.offset().xInverse().withMultiplier(scale) : new Offset(0, 0);
      let wSize = new Size(window.innerWidth * scale, window.innerHeight * scale);
      let tlPoint = new Point(- wSize.halfWidth(), - wSize.halfHeight()).shift(offset);
      let bounds = new Bounds(tlPoint.x , tlPoint.y, wSize.width, wSize.height);

      let center = this.viewport.toDispPosition(bounds.center());

      return new Bounds(center.x - bounds.width / 2, center.y - bounds.height / 2, bounds.width, bounds.height)
    }
    render(objs, mmScale, delayFn) {
    	var sTs = Date.now();
    	this.clean();
      let sStyle = { lineWidth: '0.5', strokeStyle: '#c0e2f7', fillStyle: null };
      let nStyle = { lineWidth: '1', strokeStyle: '#c0e2f7', fillStyle: null };
      for (var i = 0; i < objs.length; i++) {
        let bounds = objs[i].bounds;
        if (objs[i].type === 'site') {
          let center = this.viewport.toDispPosition(bounds.center().withMultiplier(mmScale));
          let w = this.withParentScale(bounds.width * mmScale);
          let h = this.withParentScale(bounds.height * mmScale);
          this.ioCanvas.rectangle(new Point(center.x - w / 2, center.y - h / 2), w, h, sStyle);
        } else if (objs[i].type === 'node') {
          let center = this.viewport.toDispPosition(bounds.center().withMultiplier(mmScale));
          this.ioCanvas.circle(center, this.withParentScale(bounds.width * mmScale / 2), nStyle);
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
