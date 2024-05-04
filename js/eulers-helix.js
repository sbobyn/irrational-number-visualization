import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const frustumSize = 3;
const aspect = canvas.width / canvas.height;
const camera = new THREE.OrthographicCamera((frustumSize * aspect) / -2, (frustumSize * aspect) / 2, frustumSize / 2, frustumSize / -2, 0.1, 3);
camera.position.set(1, 1, 0.25); // Adjust to ensure the scene is properly visible
const lookAt = new THREE.Vector3(0.5, 0.5, -0.5);
camera.lookAt(lookAt);
const controls = new OrbitControls(camera, canvas);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
let phase = 0;
let freq = 10;
let amp = 1 / 4;
let thetas = [];
for (let i = 0; i <= 2 * Math.PI + 0.01; i += 0.01) {
    thetas.push(-i);
}
const cosineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
const sineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const helixMaterial = new THREE.LineBasicMaterial({ color: 0x006600 });
let cosineGeometry = new THREE.BufferGeometry();
let sineGeometry = new THREE.BufferGeometry();
let helixGeometry = new THREE.BufferGeometry();
const cosineVertices = new Float32Array((thetas.length + 1) * 3);
const sineVertices = new Float32Array((thetas.length + 1) * 3);
const helixVertices = new Float32Array(thetas.length * 3);
cosineGeometry.setAttribute("position", new THREE.BufferAttribute(cosineVertices, 3));
sineGeometry.setAttribute("position", new THREE.BufferAttribute(sineVertices, 3));
helixGeometry.setAttribute("position", new THREE.BufferAttribute(helixVertices, 3));
scene.add(new THREE.Line(cosineGeometry, cosineMaterial));
scene.add(new THREE.Line(sineGeometry, sineMaterial));
scene.add(new THREE.Line(helixGeometry, helixMaterial));
// arrows
const origin = new THREE.Vector3(0, 0, 0);
const length = 1.5;
const headLength = 0.1;
const headWidth = 0.05;
// X-axis
const dirX = new THREE.Vector3(1, 0, 0);
const arrowX = new THREE.ArrowHelper(dirX, origin, length, 0x0000ff, headLength, headWidth);
scene.add(arrowX);
// Y-axis
const dirY = new THREE.Vector3(0, 1, 0);
const arrowY = new THREE.ArrowHelper(dirY, origin, length, 0xff0000, headLength, headWidth);
scene.add(arrowY);
// Z-axis
const dirZ = new THREE.Vector3(0, 0, 1);
const arrowZ = new THREE.ArrowHelper(dirZ, origin, length / 3, helixMaterial.color.getHex(), headLength, headWidth);
scene.add(arrowZ);
// helix arrow
const dirHelix = new THREE.Vector3(0, 0, 1);
const arrowHelix = new THREE.ArrowHelper(dirHelix, new THREE.Vector3(0.5, 0.5, 0), amp, helixMaterial.color.getHex(), headLength, headWidth);
scene.add(arrowHelix);
function update() {
    phase += 0.01;
    camera.lookAt(lookAt);
    // update helix arrow
    const newDir = new THREE.Vector3(Math.cos(freq * thetas[0] + phase) * amp, Math.sin(freq * thetas[0] + phase) * amp, 0);
    newDir.normalize();
    arrowHelix.setDirection(newDir);
    renderer.render(scene, camera);
}
function drawCosine() {
    const z = thetas[0];
    const x = Math.cos(freq * z + phase) * amp;
    const y = Math.sin(freq * z + phase) * amp;
    cosineVertices[0] = x + 0.5;
    cosineVertices[1] = y + 0.5;
    cosineVertices[2] = z;
    for (let i = 1; i < thetas.length + 1; i++) {
        const z = thetas[i];
        const x = Math.cos(freq * z + phase) * amp;
        cosineVertices[i * 3] = x + 0.5;
        cosineVertices[i * 3 + 1] = 0;
        cosineVertices[i * 3 + 2] = z;
    }
    cosineGeometry.attributes.position.needsUpdate = true;
}
function drawSine() {
    const z = thetas[0];
    const x = Math.cos(freq * z + phase) * amp;
    const y = Math.sin(freq * z + phase) * amp;
    sineVertices[0] = x + 0.5;
    sineVertices[1] = y + 0.5;
    sineVertices[2] = z;
    for (let i = 1; i < thetas.length + 1; i++) {
        const z = thetas[i];
        const y = Math.sin(freq * z + phase) * amp;
        sineVertices[i * 3] = 0;
        sineVertices[i * 3 + 1] = y + 0.5;
        sineVertices[i * 3 + 2] = z;
    }
    sineGeometry.attributes.position.needsUpdate = true;
}
function drawHelix() {
    for (let i = 0; i < thetas.length + 1; i++) {
        const z = thetas[i];
        const x = Math.cos(freq * z + phase) * amp;
        const y = Math.sin(freq * z + phase) * amp;
        helixVertices[i * 3] = x + 0.5;
        helixVertices[i * 3 + 1] = y + 0.5;
        helixVertices[i * 3 + 2] = z;
    }
    helixGeometry.attributes.position.needsUpdate = true;
}
function draw() {
    drawCosine();
    drawSine();
    drawHelix();
}
function main() {
    update();
    draw();
    requestAnimationFrame(main);
}
main();
//# sourceMappingURL=eulers-helix.js.map