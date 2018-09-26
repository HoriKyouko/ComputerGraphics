/**
 * Created by Timothy Garrett
 * 08/30/18
 * For CAP 5725 Fall 2018
 * Professor Sumanta Pattanaik
 */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(5,5,5);

uniforms = {time: {value: 1.0}};

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: document.getElementById("frag").textContent,
    vertexShader: document.getElementById("vert").textContent,
});

var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 15;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 15;
controls.maxDistance = 35;

for(i = 0; i < sphere.geometry.vertices.length; i++)
    createUVWLines(i);

function createUVWLines(i) {
    var uGeo = new THREE.Geometry();
    var uMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var uLine = new THREE.LineSegments(uGeo, uMat);
    var uVec = new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    uVec.normalize();
    
    var vGeo = new THREE.Geometry();
    var vMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    var vLine = new THREE.LineSegments(vGeo, vMat);
    var vVec = new THREE.Vector3();
    vVec = findingAVector(uVec);
    vVec.normalize();
    
    var wGeo = new THREE.Geometry();
    var wMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var wLine = new THREE.LineSegments(wGeo, wMat);
    var wVec = new THREE.Vector3();
    wVec.crossVectors(uVec, vVec);
    wVec.normalize();
    
    var uStartPoint = new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    var vStartPoint = new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    var wStartPoint = new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);

    uVec.addScaledVector(uVec, 2);
    vVec.addScaledVector(vVec, 2);
    wVec.addScaledVector(wVec, 2);

    var uNewPoint = uStartPoint.clone();
    var vNewPoint = vStartPoint.clone();
    var wNewPoint = wStartPoint.clone();

    uLine.geometry.vertices.push(uStartPoint);
    uLine.geometry.vertices.push(uNewPoint.add(uVec));
    
    vLine.geometry.vertices.push(vStartPoint);
    vLine.geometry.vertices.push(vNewPoint.add(vVec));
    
    wLine.geometry.vertices.push(wStartPoint);
    wLine.geometry.vertices.push(wNewPoint.add(wVec));
    
    scene.add(uLine, vLine, wLine);
}

function animate(timestamp){
    requestAnimationFrame(animate);
    controls.update();
    uniforms.time.value = timestamp/1000;
    renderer.render(scene, camera);
}

function findingAVector(uVec){
    var tempVec = uVec.clone();
    var vVec = new THREE.Vector3();
    if(Math.abs(tempVec.x) < Math.abs(uVec.y) && Math.abs(tempVec.x) < Math.abs(uVec.z))
        tempVec.x = 1;
    else if(Math.abs(tempVec.y) < Math.abs(uVec.x) && Math.abs(tempVec.y) < Math.abs(uVec.z))
        tempVec.y = 1;
    else
        tempVec.z = 1;
        
    vVec.crossVectors(tempVec, uVec);
    return vVec;
}

animate();