// サイズを指定
const width = 600;
const height = 600;

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);

// シーンを作成
const scene = new THREE.Scene();

// 箱を作成
const L = 1;
const rate = 0.9;
const boxes = [];

const geometry = new THREE.BoxGeometry(L * rate, L * rate, L * rate);

function mat(color) {
  return new THREE.MeshBasicMaterial({ color: color });
}

function materials(i, j, k) {
  return [
    i == 1 ? mat(0xff0000) : mat(0x400000), // right
    i == -1 ? mat(0xff7f00) : mat(0x402000), // left
    j == 1 ? mat(0xffffff) : mat(0x404040), // up
    j == -1 ? mat(0xffff00) : mat(0x404000), // down
    k == 1 ? mat(0x00ff00) : mat(0x004000), // front
    k == -1 ? mat(0x0000ff) : mat(0x000040), // back
  ];
}

// function materials(i, j, k) {
//   return [
//     i == 1 ? mat(0xff0000) : null, // right
//     i == -1 ? mat(0xff8000) : null, // left
//     j == 1 ? mat(0xffffff) : null, // up
//     j == -1 ? mat(0xffff00) : null, // down
//     k == 1 ? mat(0x00ff00) : null, // front
//     k == -1 ? mat(0x0000ff) : null, // back
//   ];
// }

for (let i = -1; i < 2; ++i)
  for (let j = -1; j < 2; ++j)
    for (let k = -1; k < 2; ++k) {
      const box = new THREE.Mesh(geometry, materials(i, j, k));
      box.position.set(i * L, j * L, k * L);
      scene.add(box);
      boxes.push(box);
    }

for (let i = 0; i < 3; ++i) {
  const tr = $("<tr>");
  for (let l = -1; l < 2; ++l)
    for (let t = 1; t < 4; ++t) {
      $("<button>").text("test").on("click", rot.bind(0, i, l, t)).appendTo(tr);
    }
  tr.appendTo($("#buttons"));
}
const axis_name = ["x", "y", "z"];
function rot(axis_id, layer, angle) {
  const axis = new THREE.Vector3();
  axis[axis_name[axis_id]] = 1;

  const q_rot = new THREE.Quaternion();
  q_rot.setFromAxisAngle(axis, ((Math.PI * 2) / 4) * angle);

  for (const box of boxes)
    if (Math.round(box.position[axis_name[axis_id]]) == layer) {
      box.position.applyQuaternion(q_rot);
      box.applyQuaternion(q_rot);
    }

  renderer.render(scene, camera);
}

// カメラを作成
const camera = new THREE.PerspectiveCamera(60, width / height);
camera.position.set(3, 3, 3);
// camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.OrbitControls(camera, canvas);
// 滑らかにカメラコントローラーを制御する
controls.enableDamping = true;
controls.dampingFactor = 0.2;

tick();

// 毎フレーム時に実行されるループイベントです
function tick() {
  // カメラコントローラーを更新
  controls.update();

  // レンダリング
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}
