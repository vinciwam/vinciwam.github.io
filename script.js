import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    // 初始化滑块事件监听
    const sliders = ['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        slider.addEventListener('input', function(event) {
            const valueToShow = parseFloat(event.target.value);
            const valueElementId = `sliderValue${sliderId.slice(-1)}`;
            const valueElement = document.getElementById(valueElementId);
            valueElement.innerText = `Current Value: ${valueToShow.toFixed(2)}`;
            updateRobotArm(valueToShow, sliderId);
        });
    });

    initThreeJS();
});

let robotJoints = []; // 存储加载后的关节

function initThreeJS() {
    const container = document.getElementById('canvasContainer');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0x404040); // 背景光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(ambientLight, directionalLight);

    const loader = new GLTFLoader();
    const models = [ 'arm0.glb','arm1.glb', 'arm2.glb', 'arm3.glb', 'arm4.glb', 'arm5.glb', 'arm6.glb'];
    let modelPositions = [new THREE.Vector3(-0.1, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.03, 0, 0), new THREE.Vector3(0.1, 0, 0), new THREE.Vector3(0.13, 0, 0), new THREE.Vector3(0.2, 0, 0), new THREE.Vector3(0.23, 0, 0)];

 models.forEach((modelName, index) => {
        loader.load(
            `model/${modelName}`,
            function (gltf) {
                gltf.scene.position.copy(modelPositions[index]);
                scene.add(gltf.scene);

                // 假设每个模型都是一个Mesh而不是有关节的结构
                robotJoints[index] = gltf.scene; // 存储整个模型
            },
            undefined,
            function (error) {
                console.error(`Failed to load ${modelName}: ${error}`);
            }
        );
    });

function animate() {
    requestAnimationFrame(animate);

    updateRobotArm();

    camera.position.z = 0.4;
    camera.position.x = 0.1;
    camera.position.y = 0.3;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}


    animate();
}

function updateRobotArm() {
    const angles = [];
    for (let i = 0; i < 6; i++) {
        angles[i] = parseFloat(document.getElementById(`slider${i + 1}`).value);
    }

    // 计算旋转角度
    const arm0Rotation = 0; // arm0 固定在原点
    const arm1Rotation = angles[0];
    const arm2Rotation = angles[1] + arm1Rotation;
    const arm3Rotation = angles[2];
    const arm4Rotation = angles[3] + arm3Rotation;
    const arm5Rotation = angles[4];
    const arm6Rotation = angles[5] + arm5Rotation;

    // 更新每个关节的旋转
    if (robotJoints[0]) robotJoints[0].rotation.z = arm0Rotation; // arm0 固定
    if (robotJoints[1]) robotJoints[1].rotation.z = arm1Rotation-1.0472; // arm1
    if (robotJoints[2]) robotJoints[2].rotation.z = arm2Rotation+2.0944; // arm2
    if (robotJoints[3]) robotJoints[3].rotation.z = arm3Rotation -2.0944; // arm3
    if (robotJoints[4]) robotJoints[4].rotation.z = arm4Rotation -2.0944; // arm4
    if (robotJoints[5]) robotJoints[5].rotation.z = arm5Rotation; // arm5
    if (robotJoints[6]) robotJoints[6].rotation.z = arm6Rotation; // arm6
    updatePositions();

}

function updatePositions() {
    // 获取每个滑块的角度值
    const angles = [];
    for (let i = 0; i < 6; i++) {
        angles[i] = parseFloat(document.getElementById(`slider${i + 1}`).value);
    }

    // 假设 arm0 固定在原点
    if (robotJoints[0]) robotJoints[0].position.set(0, 0, 0); // arm0 固定在原点

    // 计算每个关节的位置
    let currentX = 0; // 从原点开始
    let currentY = 0;

    if (robotJoints[1]) {
        // arm1 的位置根据角度 angles[0]
        currentX = -0.0771+0.04011*Math.cos(angles[0]-2.6180);
        currentY = -0.0445+0.04011*Math.sin(angles[0]-2.6180);
        robotJoints[1].position.set(currentX, currentY, 0);
    }

    if (robotJoints[2]) {
        // arm2 的位置根据角度 angles[1]
        currentX += 0.04011*Math.cos(angles[0]-2.6180);
        currentY += 0.04011*Math.sin(angles[0]-2.6180);
        robotJoints[2].position.set(currentX, currentY, 0);
    }

    if (robotJoints[3]) {
        // arm3 的位置根据角度 angles[2]
        currentX = 0.0771+0.04011*Math.cos(angles[2]-0.5236);
        currentY = -0.0445+0.04011*Math.sin(angles[2]-0.5236);
        robotJoints[3].position.set(currentX, currentY, 0);
    }

    if (robotJoints[4]) {
        // arm4 的位置根据角度 angles[3]
        currentX += 0.04011*Math.cos(angles[2]-0.5236);
        currentY += 0.04011*Math.sin(angles[2]-0.5236);
        robotJoints[4].position.set(currentX, currentY, 0);
    }

    if (robotJoints[5]) {
        // arm5 的位置根据角度 angles[4]
        currentX = 0.04011*Math.cos(angles[4]+1.5708);
        currentY = 0.089+0.04011*Math.sin(angles[4]+1.5708);
        robotJoints[5].position.set(currentX, currentY, 0);
    }

    if (robotJoints[6]) {
        // arm6 的位置根据角度 angles[5]
        currentX +=0.04011*Math.cos(angles[4]+1.5708);
        currentY +=0.04011*Math.sin(angles[4]+1.5708);
        robotJoints[6].position.set(currentX, currentY, 0);
    }
}



async function submitNumbers() {
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    loadingDiv.style.display = 'block';

    const sliders = ['slider1', 'slider2', 'slider3', 'slider4', 'slider5', 'slider6'];
    const numbers = sliders.map(sliderId => parseFloat(document.getElementById(sliderId).value));

    try {
        const response = await fetch('https://vinciwam.github.io/submit-numbers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numbers: numbers })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        resultDiv.innerText = `Data submitted successfully! Response: ${data.message}`;
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerText = `Error submitting data: ${error.message}`;
    } finally {
        loadingDiv.style.display = 'none';
    }
}
