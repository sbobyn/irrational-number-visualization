export class Renderer {
    constructor(canvas, plotWidth, plotHeight, cx0 = 0, cy0 = 0) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.cw = canvas.width;
        this.ch = canvas.height;
        this.plotWidth = plotWidth;
        this.plotHeight = plotHeight;
        this.cx0 = cx0;
        this.cy0 = cy0;
    }
    clear() {
        this.ctx.clearRect(this.cx0, this.cy0, this.cw, this.ch);
    }
    toCanvasX(x) {
        let cx = x / this.plotWidth;
        cx = cx * 0.5 + 0.5;
        return cx * this.cw + this.cx0;
    }
    toCanvasY(y) {
        let cy = y / this.plotHeight;
        cy = cy * 0.5 + 0.5;
        return this.ch - cy * this.ch + this.cy0;
    }
    drawLine(x0, y0, x1, y1) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.toCanvasX(x0), this.toCanvasY(y0));
        this.ctx.lineTo(this.toCanvasX(x1), this.toCanvasY(y1));
        this.ctx.stroke();
    }
    drawPoint(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(this.toCanvasX(x), this.toCanvasY(y), 3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    drawArc(x, y, r, angle = Math.PI * 2, clockwise = false) {
        this.ctx.beginPath();
        this.ctx.arc(this.toCanvasX(x), this.toCanvasY(y), r, 0, angle, clockwise);
        this.ctx.stroke();
    }
}
//# sourceMappingURL=renderer.js.map