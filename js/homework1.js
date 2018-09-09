/**
 * Created by Timothy Garrett
 * 08/30/18
 * For CAP 5725 Fall 2018
 * Professor Sumanta Pattanaik
 */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(5,5,5);
var material = new THREE.MeshNormalMaterial({wireframe: false});
//material.visible = false;
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 25;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 15;
controls.maxDistance = 35;

/*var material2 = new THREE.LineBasicMaterial({color: 0x0000ff});
var geometry2 = new THREE.Geometry();
var material3 = new THREE.LineBasicMaterial({color: 0xff0000});
var geometry3 = new THREE.Geometry();
var material4 = new THREE.LineBasicMaterial({color: 0x00ff00});
var geometry4 = new THREE.Geometry();
geometry2.vertices.push(new THREE.Vector3(-2.9389262199401855,4.0450849533081055,0));
geometry2.vertices.push(new THREE.Vector3(-6.123233998228043e-16,-5,0));*/

/*geometry2.vertices.push(new THREE.Vector3(0,5,0));
geometry2.vertices.push(new THREE.Vector3(0,10,0));
geometry3.vertices.push(new THREE.Vector3(0,5,0));
geometry3.vertices.push(new THREE.Vector3(5,10,0));
geometry4.vertices.push(new THREE.Vector3(0,5,0));
geometry4.vertices.push(new THREE.Vector3(0,0,5));
geometry2.vertices.push(new THREE.Vector3(5,5,5));*/

/*var line = new THREE.Line(geometry2, material2);
var line2 = new THREE.Line(geometry3, material3);
var line3 = new THREE.Line(geometry4, material4);
scene.add(line, line2, line3);*/

for(i = 0; i < sphere.geometry.vertices.length; i++){
    createUVWLines(i);
}

function createUVWLines(i) {
    var uGeo = new THREE.Geometry();
    var uMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var uLine = new THREE.Line(uGeo, uMat);
    uLine.position.set(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    var uVec = new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    //uVec.ceil();
    uVec.normalize();
    console.log("uVec X: " + uVec.x + " uVec Y: " + uVec.y + " uVec Z: " + uVec.z);
    
    var vGeo = new THREE.Geometry();
    var vMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    var vLine = new THREE.Line(vGeo, vMat);
    vLine.position.set(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    var vVec = new THREE.Vector3();
    //vVec = findingAVector(uVec);
    vVec.normalize();
    console.log("vVec X: " + vVec.x + " vVec Y: " + vVec.y + " vVec Z: " + vVec.z);
    
    var wGeo = new THREE.Geometry();
    var wMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var wLine = new THREE.Line(wGeo, wMat);
    wLine.position.set(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    var wVec = new THREE.Vector3();
    wVec.crossVectors(uVec, vVec);
    wVec.normalize();
    console.log("wVec X: " + wVec.x + " wVec Y: " + wVec.y + " wVec Z: " + wVec.z);
    
    var geo = new THREE.SphereGeometry(1, 3, 2);
    var mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var sph = new THREE.Mesh(geo, mat);
    sph.position.set(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    
    uLine.geometry.vertices.push(new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z));
    uLine.geometry.vertices.push(uVec);
    var uMagnitude = uVec.length();
    var uDotv = uVec.dot(vVec);
    //console.log("uMagnitude " + uMagnitude);
    console.log("uDotv " + uDotv);
    
    vLine.geometry.vertices.push(new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z));
    vLine.geometry.vertices.push(vVec);
    vLine.rotation.set(0, 0, 1.5707963268);
    var vMagnitude = vVec.length();
    var vDotw = vVec.dot(wVec);
    //console.log("vMagnitude " + vMagnitude);
    console.log("vDotw " + vDotw);
    
    wLine.geometry.vertices.push(new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z));
    wLine.geometry.vertices.push(wVec);
    wLine.rotation.set(1.5707963268, 0, 0);
    var wMagnitude = wVec.length();
    var wDotu = wVec.dot(uVec);
    //console.log("wMagnitude " + wMagnitude);
    console.log("wDotu " + wDotu);
    
    scene.add(sph, uLine, vLine, wLine);
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function findingAVector(uVec){
    var matrix = new THREE.Matrix3();
    var uMatrix = new THREE.Matrix3();
    matrix.set( 1, 0,  0,
                0, 0, -1,
                0, 1,  0);
    uMatrix.set(uVec.x, 0, 0,
                uVec.y, 0, 0, 
                uVec.z, 0, 0,);
    matrix.multiplyMatrices(matrix, uMatrix);
    var vec = new THREE.Vector3(matrix.elements[0],matrix.elements[1],matrix.elements[2]);

    var vec2 = new THREE.Vector3(-uVec.z, uVec.x, -uVec.y);
    return vec2;
}

animate();