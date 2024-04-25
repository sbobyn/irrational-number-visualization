// for drawing curves over time (never cleared)
const bottomCanvas = document.getElementById(
  "bottomcanvas"
) as HTMLCanvasElement;
const bottomCtx = bottomCanvas.getContext("2d") as CanvasRenderingContext2D;

// for drawing current arm angles (cleared every frame)
const topCanvas = document.getElementById("topcanvas") as HTMLCanvasElement;
const topCtx = topCanvas.getContext("2d") as CanvasRenderingContext2D;

const cwidth = bottomCanvas.width;
const cheight = bottomCanvas.height;

const plotWidth = 1.2;
const plotHeight = 1.2;

// curves stay within -1,1, plotted in -1.5,1.5
const armLen = 0.5;
let theta1 = 0,
  theta2 = 0;

let deltaTheta = 0.01;
let theta2Rate = Math.PI;

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
  // to -1,1
  let cx = x / plotWidth;
  // to 0,1
  cx = cx * 0.5 + 0.5;
  // to canvas
  return cx * cwidth;
}

function toCanvasY(y: number): number {
  // to -1,1
  let cy = y / plotHeight;
  // to 0,1
  cy = cy * 0.5 + 0.5;
  // to canvas
  return cheight - cy * cheight;
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

function drawCurve() {
  drawLine(bottomCtx, prevX, prevY, xs[2], ys[2]);
}

function drawArms() {
  topCtx.clearRect(0, 0, cwidth, cheight);
  drawPoint(topCtx, 0, 0);
  drawPoint(topCtx, xs[1], ys[1]);
  drawLine(topCtx, 0, 0, xs[1], ys[1]);
  drawPoint(topCtx, xs[2], ys[2]);
  drawLine(topCtx, xs[1], ys[1], xs[2], ys[2]);
}

function draw() {
  drawCurve();
  drawArms();
}

function update() {
  prevX = xs[2];
  prevY = ys[2];
  theta1 += deltaTheta;
  theta2 += theta2Rate * deltaTheta;
  xs[1] = xFromAngle(theta1);
  ys[1] = yFromAngle(theta1);
  xs[2] = xs[1] + xFromAngle(theta2);
  ys[2] = ys[1] + yFromAngle(theta2);
}

function reset() {
  theta1 = 0;
  theta2 = 0;
  xs[1] = xFromAngle(theta1);
  ys[1] = yFromAngle(theta1);
  xs[2] = xs[1] + xFromAngle(theta2);
  ys[2] = ys[1] + yFromAngle(theta2);
  bottomCtx.clearRect(0, 0, cwidth, cheight);
  topCtx.clearRect(0, 0, cwidth, cheight);
  update();
}

function main() {
  update();
  draw();
  requestAnimationFrame(main);
}

topCtx.fillStyle = "white";
topCtx.strokeStyle = "white";
topCtx.lineWidth = 1;
bottomCtx.fillStyle = "white";
bottomCtx.strokeStyle = "white";
bottomCtx.lineWidth = 1;
update();
main();
