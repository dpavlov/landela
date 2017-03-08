import Offset from '../geometry/offset';

export default class LinkRender {
  constructor(settings, viewport, ioCanvas) {
    this.settings = settings;
    this.ioCanvas = ioCanvas;
    this.viewport = viewport;
  }
  render(link) {
      let sPortCenter = this.viewport.portDisplayCenter(link.sPort);
      let ePortCenter = this.viewport.portDisplayCenter(link.ePort);
      let scpCenter = link.sControlPoint.center.withMultiplier(this.viewport.scale());
      let ecpCenter = link.eControlPoint.center.withMultiplier(this.viewport.scale());

      let linkLineStyle = {
        lineWidth: 1,
        strokeStyle: link.isSelected() ? 'yellow' : '#c0e2f7'
      };

      let scPoint = sPortCenter.add(scpCenter.yInverse())
      let ecPoint = ePortCenter.add(ecpCenter.yInverse())

      this.ioCanvas.bezier(sPortCenter, ePortCenter, scPoint, ecPoint, linkLineStyle);

      if (link.isSelected()) {
        let cpStyle = { fillStyle:  "#222222" };
        let cpLineStyle = { lineWidth: 1, strokeStyle: '#000000' };
        let wControlPoint = this.viewport.withScale(10);
        let hControlPoint = this.viewport.withScale(10);
        let cpHalfOffset = new Offset(- wControlPoint / 2, - hControlPoint / 2);
        let scTopPoint = scPoint.shift(cpHalfOffset);
        let ecTopPoint = ecPoint.shift(cpHalfOffset);

        this.ioCanvas.line(sPortCenter, scPoint, cpLineStyle);
        this.ioCanvas.rectangle(scTopPoint, wControlPoint, hControlPoint, cpStyle);

        this.ioCanvas.line(ePortCenter, ecPoint, cpLineStyle);
        this.ioCanvas.rectangle(ecTopPoint, wControlPoint, hControlPoint, cpStyle);
      }
  }
};
