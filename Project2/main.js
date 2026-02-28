import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from 'lil-gui';

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

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth motion
controls.dampingFactor = 0.05;

// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
let geometry = new THREE.BoxGeometry(
    params.width,
    params.height,
    params.depth,
    params.widthSegments,
    params.heightSegments,
    params.depthSegments
);

const solidMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00
});
const solidMesh = new THREE.Mesh(geometry, solidMaterial);
scene.add(solidMesh);
// const material = new THREE.MeshNormalMaterial({ color: 0x00ff00, wireframe: true });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true
});
const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
scene.add(wireframeMesh);

camera.position.z = 5;

function animate(time) {
  // solidMesh.rotation.x = time / 2000;
  // solidMesh.rotation.y = time / 1000;
  // wireframeMesh.rotation.x = time / 2000;
  // wireframeMesh.rotation.y = time / 1000;

  // requestAnimationFrame(animate);

  controls.update(); // required when damping enabled
  renderer.render(scene, camera);
}
function updateGeometry() {
  const oldSolidMeshGeometry = solidMesh.geometry;
  const oldwireframeMeshGeometry = wireframeMesh.geometry;

  solidMesh.geometry = new THREE.BoxGeometry(
    params.width,
    params.height,
    params.depth,
    params.widthSegments,
    params.heightSegments,
    params.depthSegments
  );
  wireframeMesh.geometry = new THREE.BoxGeometry(
    params.width,
    params.height,
    params.depth,
    params.widthSegments,
    params.heightSegments,
    params.depthSegments
  );

  oldSolidMeshGeometry.dispose();
  oldwireframeMeshGeometry.dispose();
}

scene.background = new THREE.Color("#c28e8e");
const gui = new GUI();

gui.add(params, 'width', 0.1, 5).onChange(updateGeometry);
gui.add(params, 'height', 0.1, 5).onChange(updateGeometry);
gui.add(params, 'depth', 0.1, 5).onChange(updateGeometry);

gui.add(params, 'widthSegments', 1, 10, 1).onChange(updateGeometry);
gui.add(params, 'heightSegments', 1, 10, 1).onChange(updateGeometry);
gui.add(params, 'depthSegments', 1, 10, 1).onChange(updateGeometry);
renderer.setAnimationLoop(animate);
