import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from 'lil-gui';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { initHandDetection } from './handDetection.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedObject = null;

const params = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls.getHelper());

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth motion
controls.dampingFactor = 0.05;

transformControls.addEventListener('dragging-changed', (event) => {
  controls.enabled = !event.value;
});


let geometry = new THREE.BoxGeometry(
    params.width,
    params.height,
    params.depth,
    params.widthSegments,
    params.heightSegments,
    params.depthSegments
);
const cubeGroup = new THREE.Group();

const solidMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00
});
const solidMesh = new THREE.Mesh(geometry, solidMaterial);
// scene.add(solidMesh);
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true
});
const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
// scene.add(wireframeMesh);

solidMesh.userData.parent = cubeGroup;
wireframeMesh.userData.parent = cubeGroup;

cubeGroup.add(solidMesh);
cubeGroup.add(wireframeMesh);

scene.add(cubeGroup);

const selectableObjects = [cubeGroup];

camera.position.z = 5;

function animate(time) {
  controls.update(); // required when damping enabled
  renderer.render(scene, camera);
}
function updateGeometry() {
  // const oldSolidMeshGeometry = solidMesh.geometry;
  // const oldwireframeMeshGeometry = wireframeMesh.geometry;

  // solidMesh.geometry = new THREE.BoxGeometry(
  //   params.width,
  //   params.height,
  //   params.depth,
  //   params.widthSegments,
  //   params.heightSegments,
  //   params.depthSegments
  // );
  // wireframeMesh.geometry = new THREE.BoxGeometry(
  //   params.width,
  //   params.height,
  //   params.depth,
  //   params.widthSegments,
  //   params.heightSegments,
  //   params.depthSegments
  // );

  // oldSolidMeshGeometry.dispose();
  // oldwireframeMeshGeometry.dispose();
    const oldSolid = solidMesh.geometry;
  const oldWire = wireframeMesh.geometry;

  const newGeometry = new THREE.BoxGeometry(
    params.width,
    params.height,
    params.depth,
    params.widthSegments,
    params.heightSegments,
    params.depthSegments
  );

  solidMesh.geometry = newGeometry;
  wireframeMesh.geometry = newGeometry.clone();

  oldSolid.dispose();
  oldWire.dispose();
}

scene.background = new THREE.Color("#c28e8e");

window.addEventListener("click", onMouseClick);
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Only raycast the solid mesh for simplicity
  const intersects = raycaster.intersectObject(solidMesh);

  if (intersects.length > 0) {
    selectObject(intersects[0].object.userData.parent);
  } else {
    deselectObject();
  }
}

function selectObject(object) {
  if (selectedObject === object) return;

  deselectObject();

  selectedObject = object;

  // Highlight the solid mesh
  object.children[0].material.color.set(0xff0000);

  transformControls.attach(object); // attach the whole group
}

function deselectObject() {
  if (!selectedObject) return;

  // Reset color
  selectedObject.children[0].material.color.set(0x00ff00);

  transformControls.detach();
  selectedObject = null;
}

// Move mode
transformControls.setMode('translate');

// Rotate mode
transformControls.setMode('rotate');

// Scale mode
transformControls.setMode('scale');

window.addEventListener('keydown', function (event) {
  switch(event.key.toLowerCase()) {
    case 'w': transformControls.setMode('translate'); break;
    case 'e': transformControls.setMode('rotate'); break;
    case 'r': transformControls.setMode('scale'); break;
  }
});

const gui = new GUI();

// const instructions = {
//   controls:
//     "W → Move (Translate)\n" +
//     "E → Rotate\n" +
//     "R → Scale\n" +
//     "Click → Select/Deselect object\n" +
//     "Drag arrows → Transform selected object"
// };

gui.add(params, 'width', 0.1, 5).onChange(updateGeometry);
gui.add(params, 'height', 0.1, 5).onChange(updateGeometry);
gui.add(params, 'depth', 0.1, 5).onChange(updateGeometry);

gui.add(params, 'widthSegments', 1, 10, 1).onChange(updateGeometry);
gui.add(params, 'heightSegments', 1, 10, 1).onChange(updateGeometry);
gui.add(params, 'depthSegments', 1, 10, 1).onChange(updateGeometry);

const folder = gui.addFolder("Instructions");
folder.add({w: "Move (Translate)"}, "w").name("W").disable();
folder.add({e: "Rotate"}, "e").name("E").disable();
folder.add({r: "Scale"}, "r").name("R").disable();
folder.open();

initHandDetection().catch(console.error);

renderer.setAnimationLoop(animate);
