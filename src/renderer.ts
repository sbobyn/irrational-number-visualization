export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cw: number;
  ch: number;
  plotWidth: number;
  plotHeight: number;

  constructor(
    canvas: HTMLCanvasElement,
    plotWidth: number,
    plotHeight: number
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.cw = canvas.width;
    this.ch = canvas.height;
    this.plotWidth = plotWidth;
    this.plotHeight = plotHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cw, this.ch);
  }

  toCanvasX(x: number): number {
    let cx = x / this.plotWidth;
    cx = cx * 0.5 + 0.5;
    return cx * this.cw;
  }

  toCanvasY(y: number): number {
    let cy = y / this.plotHeight;
    cy = cy * 0.5 + 0.5;
    return this.ch - cy * this.ch;
  }

  drawLine(x0: number, y0: number, x1: number, y1: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.toCanvasX(x0), this.toCanvasY(y0));
    this.ctx.lineTo(this.toCanvasX(x1), this.toCanvasY(y1));
    this.ctx.stroke();
  }

  drawPoint(x: number, y: number) {
    this.ctx.beginPath();
    this.ctx.arc(this.toCanvasX(x), this.toCanvasY(y), 3, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
