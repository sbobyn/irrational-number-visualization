import { Renderer } from "./renderer.js";

const thetaUnicode = "\u03B8";

const plotWidth = Math.PI;
const plotHeight = 1.4;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
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
  // sine wave
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
  cosArcRenderer.ctx.fillText(
    `y = sin(${thetaUnicode})`,
    5,
    canvas.height / 2 + 15
  );
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
  cosArcRenderer.ctx.fillText(`x = cos(${thetaUnicode})`, 5, 15);
}

function drawCircle() {
  ctx.lineWidth = 2;
  circleRenderer.ctx.strokeStyle = "green";
  circleRenderer.ctx.fillStyle = "green";
  circleRenderer.ctx.fillText(
    `z(${thetaUnicode}) = x(${thetaUnicode}) + iy(${thetaUnicode})`,
    canvas.width * (2 / 3) + 5,
    15
  );
  circleRenderer.drawArc(
    0,
    0,
    circleRenderer.cw / (2 * plotHeight),
    -(Math.PI + phase),
    true
  );
  ctx.lineWidth = 1;
  const x = Math.cos(Math.PI + phase) / plotHeight;
  const y = Math.sin(Math.PI + phase) / plotHeight;
  circleRenderer.drawPoint(x, y);
  circleRenderer.drawLine(0, 0, x, y);
  circleRenderer.ctx.strokeStyle = "red";
  circleRenderer.drawLine(-1, Math.sin(Math.PI + phase) / plotHeight, x, y);
  circleRenderer.drawLine(0, 0, 0, y);

  circleRenderer.ctx.strokeStyle = "blue";
  circleRenderer.drawLine(Math.cos(Math.PI + phase) / plotHeight, 1, x, y);
  circleRenderer.drawLine(0, 0, x, 0);
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

function drawGrid() {
  cosArcRenderer.ctx.strokeStyle = "#dddddd";
  circleRenderer.ctx.strokeStyle = "#dddddd";
  cosineRenderer.ctx.strokeStyle = "#dddddd";
  sineRenderer.ctx.strokeStyle = "#dddddd";
  // cosine arc
  // horizontal
  cosArcRenderer.drawArc(
    -1,
    -1,
    cosArcRenderer.cw * 0.5 * (1 + Math.cos(Math.PI) / plotHeight),
    -Math.PI / 2,
    true
  );
  cosArcRenderer.drawArc(-1, -1, cosArcRenderer.cw * 0.5, -Math.PI / 2, true);
  cosArcRenderer.drawArc(
    -1,
    -1,
    cosArcRenderer.cw * (1 - 0.5 * (1 + Math.cos(Math.PI) / plotHeight)),
    -Math.PI / 2,
    true
  );
  // circle
  // horizontal
  circleRenderer.drawLine(-1, 0, 1, 0);
  circleRenderer.drawLine(-1, 1 / plotHeight, 1, 1 / plotHeight);
  circleRenderer.drawLine(-1, -1 / plotHeight, 1, -1 / plotHeight);
  //vertical
  circleRenderer.drawLine(0, -1, 0, 1);
  circleRenderer.drawLine(1 / plotHeight, -1, 1 / plotHeight, 1);
  circleRenderer.drawLine(-1 / plotHeight, -1, -1 / plotHeight, 1);
  // cosine & sine
  // horizontal
  cosineRenderer.drawLine(-Math.PI, 1, Math.PI, 1);
  cosineRenderer.drawLine(-Math.PI, 0, Math.PI, 0);
  cosineRenderer.drawLine(-Math.PI, -1, Math.PI, -1);
  sineRenderer.drawLine(-Math.PI, 1, Math.PI, 1);
  sineRenderer.drawLine(-Math.PI, 0, Math.PI, 0);
  sineRenderer.drawLine(-Math.PI, -1, Math.PI, -1);
  // vertical
  cosineRenderer.drawLine(-phase, -1, -phase, 1);
  sineRenderer.drawLine(-phase, -1, -phase, 1);
  if (-phase + Math.PI / 2 < Math.PI) {
    cosineRenderer.drawLine(-phase + Math.PI / 2, -1, -phase + Math.PI / 2, 1);
    sineRenderer.drawLine(-phase + Math.PI / 2, -1, -phase + Math.PI / 2, 1);
  }
  if (-phase - Math.PI / 2 > -Math.PI) {
    cosineRenderer.drawLine(-phase - Math.PI / 2, -1, -phase - Math.PI / 2, 1);
    sineRenderer.drawLine(-phase - Math.PI / 2, -1, -phase - Math.PI / 2, 1);
  }
  if (-phase + Math.PI < Math.PI) {
    cosineRenderer.drawLine(-phase + Math.PI, -1, -phase + Math.PI, 1);
    sineRenderer.drawLine(-phase + Math.PI, -1, -phase + Math.PI, 1);
  }
  if (-phase - Math.PI > -Math.PI) {
    cosineRenderer.drawLine(-phase - Math.PI, -1, -phase - Math.PI, 1);
    sineRenderer.drawLine(-phase - Math.PI, -1, -phase - Math.PI, 1);
  }

  if (-phase + (3 / 2) * Math.PI < Math.PI) {
    cosineRenderer.drawLine(
      -phase + (3 / 2) * Math.PI,
      -1,
      -phase + (3 / 2) * Math.PI,
      1
    );
    sineRenderer.drawLine(
      -phase + (3 / 2) * Math.PI,
      -1,
      -phase + (3 / 2) * Math.PI,
      1
    );
  }
  if (-phase - (3 / 2) * Math.PI > -Math.PI) {
    cosineRenderer.drawLine(
      -phase - (3 / 2) * Math.PI,
      -1,
      -phase - (3 / 2) * Math.PI,
      1
    );
    sineRenderer.drawLine(
      -phase - (3 / 2) * Math.PI,
      -1,
      -phase - (3 / 2) * Math.PI,
      1
    );
  }
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

  ctx.lineWidth = 1;
  drawGrid();
  drawBorders();
  ctx.lineWidth = 2;
  drawSine();
  drawCosine();
  drawCircle();
  ctx.lineWidth = 1;
  drawCosArc();
  requestAnimationFrame(draw);
}

draw();
