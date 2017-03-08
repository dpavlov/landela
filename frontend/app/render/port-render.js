import Offset from '../geometry/offset';
import Point from '../geometry/point';

export default class PortRender {
  constructor(viewport, ioCanvas) {
    this.ioCanvas = ioCanvas;
    this.viewport = viewport;
  }
  render(port) {
    var portCenter = this.viewport.portDisplayCenter(port);
    let pSide = this.viewport.withScale(14);
    let pRadius = this.viewport.withScale(4);
    let portStyle = {
      lineWidth: 1,
      fillStyle: port.isSelected() ? '#FFCC03' : '#000000',
      strokeStyle: port.isSelected() ? '#FFCC03' : '#c0e2f7'
    };
    let portPoint = portCenter.shift(new Offset(- pSide / 2, - pSide / 2));
    this.ioCanvas.roundedRectangle(portPoint, pSide, pSide, pRadius, portStyle);
  }
};
