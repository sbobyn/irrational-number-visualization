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

const mainCanvas = document.getElementById("main-canvas") as HTMLCanvasElement;
const mainCtx = mainCanvas.getContext("2d") as CanvasRenderingContext2D;

// zoomed in on the curve
const zoomCanvas = document.getElementById("zoom-canvas") as HTMLCanvasElement;
const zoomCtx = zoomCanvas.getContext("2d") as CanvasRenderingContext2D;

let zoomFactor = 3.0;

// store previous curve points
let prevXs: number[] = [];
let prevYs: number[] = [];

const cwidth = mainCanvas.width;
const cheight = mainCanvas.height;

const plotWidth = 1.2;
const plotHeight = 1.2;

// curves stay within -1,1, plotted in -1.2,1.2
const armLen = 0.5;
let theta1 = 0,
  theta2 = 0;

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

function xFromAngle(theta: number): number {
  return armLen * Math.cos(theta);
}

function yFromAngle(theta: number): number {
  return armLen * Math.sin(theta);
}

function toCanvasX(x: number): number {
  let cx = x / plotWidth;
  cx = cx * 0.5 + 0.5;
  return cx * cwidth;
}

function toCanvasY(y: number): number {
  let cy = y / plotHeight;
  cy = cy * 0.5 + 0.5;
  return cheight - cy * cheight;
}

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

function drawLine(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  ctx.beginPath();
  ctx.moveTo(toCanvasX(x0), toCanvasY(y0));
  ctx.lineTo(toCanvasX(x1), toCanvasY(y1));
  ctx.stroke();
}

function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.beginPath();
  ctx.arc(toCanvasX(x), toCanvasY(y), 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawArms() {
  drawPoint(mainCtx, 0, 0);
  drawPoint(mainCtx, xs[1], ys[1]);
  drawLine(mainCtx, 0, 0, xs[1], ys[1]);
  drawPoint(mainCtx, xs[2], ys[2]);
  drawLine(mainCtx, xs[1], ys[1], xs[2], ys[2]);
}

function drawMainCanvas() {
  mainCtx.clearRect(0, 0, cwidth, cheight);
  mainCtx.beginPath();
  for (let i = 0; i < prevXs.length - 1; i++) {
    mainCtx.moveTo(toCanvasX(prevXs[i]), toCanvasY(prevYs[i]));
    mainCtx.lineTo(toCanvasX(prevXs[i + 1]), toCanvasY(prevYs[i + 1]));
  }
  mainCtx.stroke();
  drawArms();
}

function drawZoomCanvas() {
  zoomCtx.clearRect(0, 0, cwidth, cheight);
  zoomCtx.beginPath();
  for (let i = 0; i < prevXs.length - 1; i++) {
    zoomCtx.moveTo(toZoomCanvasX(prevXs[i]), toZoomCanvasY(prevYs[i]));
    zoomCtx.lineTo(toZoomCanvasX(prevXs[i + 1]), toZoomCanvasY(prevYs[i + 1]));
  }
  zoomCtx.stroke();
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
  if (theta1 > Math.PI) {
    theta1 -= 2 * Math.PI;
    numInnerRotations++;
    innerRotSpan.textContent = numInnerRotations.toString();
  }
  if (theta2 > Math.PI) {
    theta2 -= 2 * Math.PI;
    numOuterRotations++;
    outerRotSpan.textContent = numOuterRotations.toString();
  }
  xs[1] = xFromAngle(theta1);
  ys[1] = yFromAngle(theta1);
  xs[2] = xs[1] + xFromAngle(theta2);
  ys[2] = ys[1] + yFromAngle(theta2);
  prevXs.push(xs[2]);
  prevYs.push(ys[2]);
}

function reset() {
  theta1 = 0;
  theta2 = 0;
  numInnerRotations = 0;
  numOuterRotations = 0;
  innerRotSpan.textContent = "0";
  outerRotSpan.textContent = "0";
  xs[1] = xFromAngle(theta1);
  ys[1] = yFromAngle(theta1);
  xs[2] = xs[1] + xFromAngle(theta2);
  ys[2] = ys[1] + yFromAngle(theta2);
  mainCtx.clearRect(0, 0, cwidth, cheight);
  zoomCtx.clearRect(0, 0, cwidth, cheight);
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

mainCtx.fillStyle = "white";
mainCtx.strokeStyle = "white";
mainCtx.lineWidth = 1;
zoomCtx.fillStyle = "white";
zoomCtx.strokeStyle = "white";
zoomCtx.lineWidth = 1;
update();
main();
