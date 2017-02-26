import Point from '../geometry/point';
import Offset from '../geometry/offset';

export default class Grid { 
    constructor(ctx) {
    	this.ctx = ctx;
        this._offset = new Offset(0, 0);
        this._scale = 1.0;
    }
    scale(newScale) {
        this._scale = newScale;
    }
    offset(newOffset) {
        this._offset = newOffset;
    }
    render(wStage, hStage, scale) {    

        var topCenter = new Point(wStage / 2, 0).xShift(this._offset);
        var bottomCenter = new Point(wStage / 2, hStage).xShift(this._offset);
        var leftCenter = new Point(0, hStage / 2).yShift(this._offset);
        var rightCenter = new Point(wStage, hStage / 2).yShift(this._offset)

        this.line(topCenter, bottomCenter, "rgba(255,255,255,0.3)");
    	this.line(leftCenter, rightCenter, "rgba(255,255,255,0.3)");

        var center = new Point((wStage / 2), (hStage / 2))

    	this.text("0,0", center.shift(new Offset(3, -3)).shift(this._offset))

    	var wGridStep = 50 * this._scale;

    	var vLeftGridTotal = ((wStage / 2) - this._offset.xOffset) / wGridStep;
        var vRightGridTotal = ((wStage / 2) + this._offset.xOffset) / wGridStep;
    	var hTopGridTotal = ((hStage / 2) - this._offset.yOffset) / wGridStep;
        var hBottomGridTotal = ((hStage / 2) + this._offset.yOffset) / wGridStep;

    	for (var i = 1; i < vLeftGridTotal; i++) {
    		this.line(new Point(wStage / 2 + i * wGridStep, 0).xShift(this._offset), new Point(wStage / 2 + i * wGridStep, hStage).xShift(this._offset), "rgba(255,255,255,0.1)");
            this.text(50 * i, new Point(wStage / 2 + i * wGridStep, hStage / 2).shift(new Offset(3, 10)).shift(this._offset))
    	}

        for (var i = 1; i < vRightGridTotal; i++) {
            this.line(new Point(wStage / 2 - i * wGridStep, 0).xShift(this._offset), new Point(wStage / 2 - i * wGridStep, hStage).xShift(this._offset), "rgba(255,255,255,0.1)");
            this.text(-50 * i, new Point(wStage / 2 - i * wGridStep, hStage / 2).shift(new Offset(3, 10)).shift(this._offset))
        }

    	for (var i = 1; i < hTopGridTotal; i++) {
    		this.line(new Point(0, hStage / 2 + i * wGridStep).yShift(this._offset), new Point(wStage, hStage / 2 + i * wGridStep).yShift(this._offset), "rgba(255,255,255,0.1)");
    	    this.text(-50 * i, new Point(wStage / 2, hStage / 2 + i * wGridStep).shift(new Offset(3, 10)).shift(this._offset))
        }

        for (var i = 1; i < hBottomGridTotal; i++) {
            this.line(new Point(0, hStage / 2 - i * wGridStep).yShift(this._offset), new Point(wStage, hStage / 2 - i * wGridStep).yShift(this._offset), "rgba(255,255,255,0.1)");
            this.text(50 * i, new Point(wStage / 2, hStage / 2 - i * wGridStep).shift(new Offset(3, 10)).shift(this._offset))
        }


    }
    line(s, e, style) {
    	this.ctx.strokeStyle = style;
    	this.ctx.beginPath();
		this.ctx.moveTo(s.x, s.y);
		this.ctx.lineTo(e.x, e.y);
		this.ctx.stroke();
    }
    text(t, s) {
    	this.ctx.font="10px Georgia";
    	this.ctx.fillStyle = "rgba(255,255,255,0.3)";
    	this.ctx.fillText(t, s.x, s.y);
    }
};