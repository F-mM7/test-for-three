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
    i == 1 ? mat(0xff0000) : null, // right
    i == -1 ? mat(0xff8000) : null, // left
    j == 1 ? mat(0xffffff) : null, // up
    j == -1 ? mat(0xffff00) : null, // down
    k == 1 ? mat(0x00ff00) : null, // front
    k == -1 ? mat(0x0000ff) : null, // back
  ];
}

for (let i = -1; i < 2; ++i)
  for (let j = -1; j < 2; ++j)
    for (let k = -1; k < 2; ++k) {
      const box = new THREE.Mesh(geometry, materials(i, j, k));
      box.position.set(i * L, j * L, k * L);
      scene.add(box);
      boxes.push(box);
    }

const op = {
  R: [0, 1, -1],
  L: [0, -1, 1],
  U: [1, 1, -1],
  D: [1, -1, 1],
  F: [2, 1, -1],
  B: [2, -1, 1],
};

for (const name in op) {
  const tr = $("<tr>");
  $("<button>")
    .text(name)
    .on("click", rot.bind(0, op[name][0], op[name][1], op[name][2]))
    .appendTo(tr);
  $("<button>")
    .text(name + "'")
    .on("click", rot.bind(0, op[name][0], op[name][1], -op[name][2]))
    .appendTo(tr);
  $("<button>")
    .text(name + "2")
    .on("click", rot.bind(0, op[name][0], op[name][1], op[name][2] * 2))
    .appendTo(tr);
  $("#buttons").append(tr);
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

const controls = new TrackballControls(camera, canvas);
controls.panSpeed = 0;
controls.zoomSpeed = 0;
controls.rotateSpeed = 4;

tick();

// 毎フレーム時に実行されるループイベントです
function tick() {
  // カメラコントローラーを更新
  controls.update();

  // レンダリング
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
}
