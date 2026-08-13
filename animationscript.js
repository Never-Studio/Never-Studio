import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

const container = document.getElementById("homepageTitleDiv");

const scene = new THREE.Scene();

const areaLight = new THREE.RectAreaLight(backgroundC, 5, 100, 100);
areaLight.position.y = -1;
areaLight.lookAt(0, 0, 0);
scene.add(areaLight);

// Key light, positioned in front of the text.
const pointLight = new THREE.PointLight(0xffffff, 500, 0, 1.5);
pointLight.position.set(0, 0, 20);
scene.add(pointLight);

// Ambient fill so nothing goes fully black.
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
  50,
  container.offsetWidth / container.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.id = "animationCanvas";
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(backgroundC, 1);
renderer.setPixelRatio(window.devicePixelRatio);
window.scrollTo(0, 0);

let textMesh, textMaterial, loadedFont;
let alpha, rX, rY, xDif, zDif, yDif, rDif;
let changeSize = 0.5;

const fontLoader = new FontLoader();
fontLoader.load(
  "https://esm.sh/@compai/font-montserrat/data/typefaces/normal-700.json",
  function (font) {
    loadedFont = font;

    const geometry = new TextGeometry("n", {
      font: font,
      size: 80,
      depth: 25,
      curveSegments: 100,
      bevelEnabled: false,
      bevelThickness: 5,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 10,
    });

    textMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0.7,
    });

    textMesh = new THREE.Mesh(geometry, textMaterial);
    textMesh.position.set(0, 0, 0);

    // Center the text horizontally by shifting it left by half its width.
    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      geometry.translate(-geometry.boundingBox.max.x / 2, 0, 0);
    }

    scene.add(textMesh);
  }
);

const stage1Setup = () => {
  alpha = (Math.PI / 180) * 15;
  rX = 42;
  rY = 110;
  xDif = 0;
  yDif = -25;
  rDif = -1;
  camera.position.x = 40;
  camera.position.y = -5;
  camera.position.z = 40;
};

const stage1Step = () => {
  const lookX = Math.cos(alpha + (2 * Math.PI) / 360) * (rX + rDif) + xDif;
  const lookY = Math.sin(alpha + (2 * Math.PI) / 360) * (rY + rDif) + yDif;

  camera.lookAt(new THREE.Vector3(lookX, lookY, 36));
  camera.position.x = Math.cos(alpha) * rX + xDif;
  camera.position.y = Math.sin(alpha) * rY + yDif;
  camera.up.set(0, 1, 0).applyQuaternion(camera.quaternion);

  alpha += Math.PI / 360;
  return alpha < 0.3 * Math.PI;
};


const stage2Setup = () => {
  alpha = 0;
  rX = 2;
  rY = 50;
  xDif = 7;
  yDif = -30;
  rDif = 2;
  camera.position.z = 12.5;
  camera.up.set(0, 1, 0);
};

const stage2Step = () => {
  const lookX = Math.cos(alpha + Math.PI / 360) * (rX + rDif) + xDif;
  const lookY = Math.sin(alpha + Math.PI / 360) * (rY + rDif) + yDif;

  camera.lookAt(new THREE.Vector3(lookX, lookY, 12.5));
  camera.position.x = Math.cos(alpha) * rX + xDif;
  camera.position.y = Math.sin(alpha) * rY + yDif;
  camera.up.set(0, 1, 0).applyQuaternion(camera.quaternion);

  alpha += Math.PI / 90;
  return alpha < 0.7 * Math.PI;
};

// --- Stage 3: dive toward the origin ----------------------------------------
const stage3Setup = () => {
  xDif = -10;
  zDif = -10;
  camera.position.x = 40;
  camera.position.y = 15;
  camera.position.z = 40;
  camera.up.set(0, 1, 0);
};

const stage3Step = () => {
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.position.y -= 0.5;
  camera.position.x += 0.2;
  return camera.position.y > -10;
};


const stage4Setup = () => {
  alpha = 0;

  textMesh.geometry.dispose();
  const size = (80 * window.innerWidth) / 1700;
  textMesh.geometry = new TextGeometry("neverstudio", {
    font: loadedFont,
    size: size,
    depth: 1,
    curveSegments: 100,
    bevelEnabled: false,
    bevelThickness: 5,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 10,
  });

  textMesh.geometry.computeBoundingBox();
  if (textMesh.geometry.boundingBox) {
    textMesh.geometry.translate(-textMesh.geometry.boundingBox.max.x / 2, 0, 0);
  }
  textMesh.position.y += 5;

  camera.position.x = 0;
  camera.position.y = 50;
  camera.position.z = 100;
  camera.lookAt(new THREE.Vector3(0, camera.position.y, 0));
  camera.up.set(0, 1, 0);
};

const stage4Step = () => {
  changeSize = Math.cbrt(changeSize ** 2.2);
  textMesh.scale.x *= changeSize;
  textMesh.scale.y *= changeSize;
  camera.position.y *= changeSize;
  camera.lookAt(new THREE.Vector3(0, camera.position.y, 0));

  return textMesh.scale.x > 1 / 8;
};

const stageSetups = [stage1Setup, stage2Setup, stage3Setup, stage4Setup];
const stageSteps = [stage1Step, stage2Step, stage3Step, stage4Step];
let currentStage = 0;

function animate() {
  const stageStillRunning = stageSteps[currentStage]();

  if (!stageStillRunning) {
    if (currentStage + 1 < stageSetups.length) {
      currentStage++;
      stageSetups[currentStage]();
      stageSteps[currentStage]();
    } else {
      renderer.setAnimationLoop(null);
    }
  }

  renderer.render(scene, camera);
}

stageSetups[currentStage]();
stageSteps[currentStage]();


let animating = false;

function startAnimation(event) {
  if (animating) return;

  event.preventDefault();
  container.removeChild(document.getElementById("removeText"));
  container.appendChild(renderer.domElement);
  animating = true;
  renderer.setAnimationLoop(animate);
}

container.addEventListener("click", startAnimation);
document.body.addEventListener("keydown", startAnimation);
