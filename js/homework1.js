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
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 25;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 15;
controls.maxDistance = 35;

var material2 = new THREE.LineBasicMaterial({color: 0x0000ff});
var geometry2 = new THREE.Geometry();
geometry2.vertices.push(new THREE.Vector3(-6.123233998228043e-16,-5,0));
geometry2.vertices.push(new THREE.Vector3(0,10,0));
//geometry2.vertices.push(new THREE.Vector3(10,0,0));

var line = new THREE.Line(geometry2, material2);

scene.add(line);

for(i = 0; i < geometry.vertices.length; i++){
    var geo = new THREE.SphereGeometry(1,3,2);
    var mat = new THREE.MeshBasicMaterial({color: 0xff0000 });
    var sph = new THREE.Mesh(geo, mat);
    sph.position.set(geometry.vertices[i].x,geometry.vertices[i].y,geometry.vertices[i].z);
    scene.add(sph);
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();