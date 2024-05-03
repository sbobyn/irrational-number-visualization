import { Renderer } from "./renderer.js";

const plotWidth = Math.PI;
const plotHeight = 1.4;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasRenderer = new Renderer(canvas, plotWidth, plotHeight);
const cosineRenderer = new Renderer(canvas, plotWidth, plotHeight, 0, 0);
cosineRenderer.cw = canvas.width * (2 / 3);
cosineRenderer.ch = canvas.height / 2;
const sineRenderer = new Renderer(
  canvas,
  plotWidth,
  plotHeight,
  0,
  canvas.height / 2
);
sineRenderer.cw = canvas.width * (2 / 3);
sineRenderer.ch = canvas.height / 2;
const circleRenderer = new Renderer(
  canvas,
  1,
  1,
  canvas.width * (2 / 3),
  canvas.height / 2
);
circleRenderer.cw = canvas.width / 3;
circleRenderer.ch = canvas.height / 2;
const cosArcRenderer = new Renderer(canvas, 1, 1, canvas.width * (2 / 3), 0);
cosArcRenderer.cw = canvas.width / 3;
cosArcRenderer.ch = canvas.height / 2;

let phase = 0;

let thetas: number[] = [];
for (let i = -Math.PI; i <= Math.PI + 0.01; i += 0.01) {
  thetas.push(i);
}

function drawSine() {
  sineRenderer.ctx.strokeStyle = "red";
  sineRenderer.ctx.beginPath();
  for (let i = 0; i < thetas.length; i++) {
    const x = thetas[i];
    const y = Math.sin(x + phase);
    sineRenderer.ctx.lineTo(
      sineRenderer.toCanvasX(x),
      sineRenderer.toCanvasY(y)
    );
  }
  sineRenderer.ctx.stroke();
  sineRenderer.ctx.fillStyle = "red";
  sineRenderer.drawPoint(Math.PI, Math.sin(Math.PI + phase));
  cosArcRenderer.ctx.fillText("sin(x)", 2, canvas.height / 2 + 12);
}

function drawCosine() {
  cosineRenderer.ctx.strokeStyle = "blue";
  cosineRenderer.ctx.beginPath();
  let i = 0;
  for (i; i < thetas.length; i++) {
    const x = thetas[i];
    const y = Math.cos(x + phase);
    cosineRenderer.ctx.lineTo(
      cosineRenderer.toCanvasX(x),
      cosineRenderer.toCanvasY(y)
    );
  }
  cosineRenderer.ctx.stroke();
  cosineRenderer.ctx.fillStyle = "blue";
  cosineRenderer.drawPoint(Math.PI, Math.cos(Math.PI + phase));
  cosArcRenderer.ctx.font = "12px Arial";
  cosArcRenderer.ctx.fillText("cos(x)", 2, 10);
}

function drawCircle() {
  circleRenderer.ctx.strokeStyle = "black";
  circleRenderer.ctx.fillStyle = "black";
  circleRenderer.drawArc(
    0,
    0,
    circleRenderer.cw / (2 * plotHeight),
    -(Math.PI + phase),
    true
  );
  const x = Math.cos(Math.PI + phase) / plotHeight;
  const y = Math.sin(Math.PI + phase) / plotHeight;
  circleRenderer.drawPoint(x, y);
  circleRenderer.drawLine(0, 0, x, y);
  circleRenderer.ctx.strokeStyle = "red";
  circleRenderer.drawLine(-1, Math.sin(Math.PI + phase) / plotHeight, x, y);
  circleRenderer.ctx.strokeStyle = "blue";
  circleRenderer.drawLine(Math.cos(Math.PI + phase) / plotHeight, 1, x, y);
}

function drawCosArc() {
  cosArcRenderer.ctx.strokeStyle = "blue";
  cosArcRenderer.ctx.fillStyle = "blue";
  cosArcRenderer.drawPoint(Math.cos(phase + Math.PI) / plotHeight, -1);
  cosArcRenderer.drawArc(
    -1,
    -1,
    cosArcRenderer.cw * 0.5 * (1 + Math.cos(Math.PI + phase) / plotHeight),
    -Math.PI / 2,
    true
  );
}

function drawBorders() {
  canvasRenderer.ctx.strokeStyle = "black";
  canvasRenderer.drawLine(-plotWidth, 0, plotWidth, 0);
  canvasRenderer.drawLine(
    plotWidth / 3,
    -plotHeight,
    plotWidth / 3,
    plotHeight
  );
}

function draw() {
  phase += 0.01;
  if (phase > Math.PI) {
    phase -= Math.PI * 2;
  }
  canvasRenderer.clear();
  cosineRenderer.clear();
  sineRenderer.clear();
  circleRenderer.clear();
  cosArcRenderer.clear();
  drawBorders();
  drawSine();
  drawCosine();
  drawCircle();
  drawCosArc();
  requestAnimationFrame(draw);
}

draw();
