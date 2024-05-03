import { Renderer } from "./renderer.js";
import { xFromAngle, yFromAngle } from "./utils.js";

export {};

const resetButton = document.getElementById("resetButton") as HTMLButtonElement;
resetButton.onclick = () => {
  reset();
};

const pauseButton = document.getElementById("pauseButton") as HTMLButtonElement;
let paused = false;
pauseButton.onclick = () => {
  paused = !paused;
  if (paused) {
    pauseButton.textContent = "Resume";
  } else {
    pauseButton.textContent = "Pause";
  }
};

const plotWidth = 1.2;
const plotHeight = 1.2;

const mainCanvas = document.getElementById("main-canvas") as HTMLCanvasElement;
const mainRenderer = new Renderer(mainCanvas, plotWidth, plotHeight);

// zoomed in on the curve
const zoomCanvas = document.getElementById("zoom-canvas") as HTMLCanvasElement;
const zoomRenderer = new Renderer(zoomCanvas, plotWidth, plotHeight);

let zoomFactor = 3.0;
const zoomSlider = document.getElementById("zoomSlider") as HTMLInputElement;
const zoomSpan = document.getElementById("zoomValue") as HTMLSpanElement;
zoomSlider.oninput = () => {
  zoomFactor = parseFloat(zoomSlider.value);
  zoomSpan.textContent = zoomFactor.toFixed(2);
};

// store previous curve points
let prevXs: number[] = [];
let prevYs: number[] = [];

const cwidth = mainCanvas.width;
const cheight = mainCanvas.height;

// curves stay within -1,1, plotted in -1.2,1.2
const armLen = 0.5;
const initTheta1 = Math.PI / 1.5;
const initTheta2 = 1.25 * Math.PI;
let theta1 = initTheta1,
  theta2 = initTheta2;

let deltaTheta = 0.01;
let theta2Rate = Math.PI;

let numInnerRotations = 0;
let numOuterRotations = 0;
const innerRotSpan = document.getElementById(
  "numInnerRotations"
) as HTMLSpanElement;
const outerRotSpan = document.getElementById(
  "numOuterRotations"
) as HTMLSpanElement;

let prevX = 0;
let prevY = 0;
let xs = new Float64Array(3);
let ys = new Float64Array(3);

const deltaThetaInput = document.getElementById(
  "deltaSlider"
) as HTMLInputElement;
const deltaThetaSpan = document.getElementById("deltaValue") as HTMLSpanElement;
deltaThetaInput.oninput = () => {
  deltaTheta = parseFloat(deltaThetaInput.value);
  deltaThetaSpan.textContent = deltaTheta.toFixed(3);
};
deltaThetaInput.oninput(null as any);

const rateSlider = document.getElementById("rateSlider") as HTMLInputElement;
const rateSpan = document.getElementById("rateValue") as HTMLSpanElement;
rateSlider.oninput = () => {
  rateSpan.textContent = rateSlider.value;
};
rateSlider.onchange = () => {
  theta2Rate = parseFloat(rateSlider.value);
  rateSpan.textContent = theta2Rate.toString();
  reset();
};

const theta2RateSelect = document.getElementById(
  "rateSelect"
) as HTMLSelectElement;
theta2RateSelect.onchange = () => {
  switch (theta2RateSelect.value) {
    case "pi":
      theta2Rate = Math.PI;
      rateSlider.disabled = true;
      break;
    case "e":
      theta2Rate = Math.E;
      rateSlider.disabled = true;
      break;
    case "phi":
      theta2Rate = (1 + Math.sqrt(5)) / 2;
      rateSlider.disabled = true;
      break;
    case "sqrt2":
      theta2Rate = Math.SQRT2;
      rateSlider.disabled = true;
      break;
    case "custom":
      rateSlider.disabled = false;
      theta2Rate = parseFloat(rateSlider.value);
      break;
  }
  rateSpan.textContent = theta2Rate.toString();
  reset();
};
theta2RateSelect.onchange(null as any);

function toZoomCanvasX(x: number): number {
  let zx = x - prevXs[prevXs.length - 1];
  zx *= zoomFactor;
  zx = zx / plotWidth;
  zx = zx * 0.5 + 0.5;
  return zx * cwidth;
}

function toZoomCanvasY(y: number): number {
  let zy = y - prevYs[prevYs.length - 1];
  zy *= zoomFactor;
  zy = zy / plotHeight;
  zy = zy * 0.5 + 0.5;
  return cheight - zy * cheight;
}

function drawArms() {
  mainRenderer.drawPoint(0, 0);
  mainRenderer.drawPoint(xs[1], ys[1]);
  mainRenderer.drawLine(0, 0, xs[1], ys[1]);
  mainRenderer.drawPoint(xs[2], ys[2]);
  mainRenderer.drawLine(xs[1], ys[1], xs[2], ys[2]);
}

function drawMainCanvas() {
  mainRenderer.clear();
  mainRenderer.ctx.beginPath();
  for (let i = 0; i < prevXs.length - 1; i++) {
    mainRenderer.ctx.moveTo(
      mainRenderer.toCanvasX(prevXs[i]),
      mainRenderer.toCanvasY(prevYs[i])
    );
    mainRenderer.ctx.lineTo(
      mainRenderer.toCanvasX(prevXs[i + 1]),
      mainRenderer.toCanvasY(prevYs[i + 1])
    );
  }
  mainRenderer.ctx.stroke();
  drawArms();
}

function drawZoomCanvas() {
  zoomRenderer.clear();
  zoomRenderer.ctx.beginPath();
  for (let i = 0; i < prevXs.length - 1; i++) {
    zoomRenderer.ctx.moveTo(toZoomCanvasX(prevXs[i]), toZoomCanvasY(prevYs[i]));
    zoomRenderer.ctx.lineTo(
      toZoomCanvasX(prevXs[i + 1]),
      toZoomCanvasY(prevYs[i + 1])
    );
  }
  zoomRenderer.ctx.stroke();
}

function draw() {
  drawMainCanvas();
  drawZoomCanvas();
}

function update() {
  prevX = xs[2];
  prevY = ys[2];
  theta1 += deltaTheta;
  theta2 += theta2Rate * deltaTheta;
  if (theta1 > Math.PI * 2 + initTheta1) {
    theta1 -= 2 * Math.PI;
    numInnerRotations++;
    innerRotSpan.textContent = numInnerRotations.toString();
  }
  if (theta2 > Math.PI * 2 + initTheta2) {
    theta2 -= 2 * Math.PI;
    numOuterRotations++;
    outerRotSpan.textContent = numOuterRotations.toString();
  }
  xs[1] = armLen * xFromAngle(theta1);
  ys[1] = armLen * yFromAngle(theta1);
  xs[2] = xs[1] + armLen * xFromAngle(theta2);
  ys[2] = ys[1] + armLen * yFromAngle(theta2);
  prevXs.push(xs[2]);
  prevYs.push(ys[2]);
}

function reset() {
  theta1 = initTheta1;
  theta2 = initTheta2;
  numInnerRotations = 0;
  numOuterRotations = 0;
  innerRotSpan.textContent = "0";
  outerRotSpan.textContent = "0";
  xs[1] = armLen * xFromAngle(theta1);
  ys[1] = armLen * yFromAngle(theta1);
  xs[2] = xs[1] + armLen * xFromAngle(theta2);
  ys[2] = ys[1] + armLen * yFromAngle(theta2);
  mainRenderer.clear();
  zoomRenderer.clear();
  prevXs = [];
  prevYs = [];
  update();
}

function main() {
  if (!paused) {
    update();
    draw();
  }
  requestAnimationFrame(main);
}

mainRenderer.ctx.fillStyle = "white";
mainRenderer.ctx.strokeStyle = "white";
mainRenderer.ctx.lineWidth = 1;
zoomRenderer.ctx.fillStyle = "white";
zoomRenderer.ctx.strokeStyle = "white";
zoomRenderer.ctx.lineWidth = 1;
update();
main();
