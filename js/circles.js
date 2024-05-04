import { Renderer } from "./renderer.js";
const piUnicode = "\u03C0";
const canvas = document.getElementById("canvas");
const plotWidth = 1.2;
const plotHeight = 1.2;
const renderer = new Renderer(canvas, plotWidth, plotHeight);
const armLen = 1.0;
let theta = 0;
let theta2Rate = 2;
const rateSlider = document.getElementById("rateSlider");
const rateSpan = document.getElementById("rateValue");
rateSlider.oninput = () => {
    rateSpan.textContent = rateSlider.value;
};
rateSlider.onchange = () => {
    theta2Rate = parseFloat(rateSlider.value);
    rateSpan.textContent = theta2Rate.toString();
    reset();
};
const theta2RateSelect = document.getElementById("rateSelect");
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
theta2RateSelect.onchange(null);
function drawAxes() {
    renderer.drawLine(-plotWidth, 0, plotWidth, 0);
    renderer.drawLine(0, -plotHeight, 0, plotHeight);
    drawAxisLabels();
}
function drawAxisLabels() {
    renderer.ctx.font = "12px Arial";
    renderer.ctx.fillText("0", renderer.toCanvasX(plotWidth) - 10, renderer.toCanvasY(0) - 5);
    renderer.ctx.fillText(`2${piUnicode}`, renderer.toCanvasX(plotWidth) - 17, renderer.toCanvasY(0) + 15);
}
function draw() {
    renderer.clear();
    drawAxes();
    renderer.drawLine(0, 0, armLen * Math.cos(theta), armLen * Math.sin(theta));
    renderer.drawPoint(armLen * Math.cos(theta), armLen * Math.sin(theta));
    renderer.drawLine(0, 0, armLen * Math.cos(theta2Rate * theta), armLen * Math.sin(theta2Rate * theta));
    renderer.drawPoint(armLen * Math.cos(theta2Rate * theta), armLen * Math.sin(theta2Rate * theta));
}
function reset() {
    theta = 0;
    draw();
}
function update() {
    theta += 0.01;
    draw();
}
function main() {
    update();
    requestAnimationFrame(main);
}
main();
//# sourceMappingURL=circles.js.map