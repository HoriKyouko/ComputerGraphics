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
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 25;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 15;
controls.maxDistance = 35;

for(i = 0; i < sphere.geometry.vertices.length; i++){
    createUVWLines(i);
}

function createUVWLines(i) {
    var uGeo = new THREE.Geometry();
    var uMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    var uLine = new THREE.Line(uGeo, uMat);
    uLine.position.set(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    var uVec = new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    uVec.normalize();
    console.log("uVec X: " + uVec.x + " uVec Y: " + uVec.y + " uVec Z: " + uVec.z);
    
    var vGeo = new THREE.Geometry();
    var vMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    var vLine = new THREE.Line(vGeo, vMat);
    vLine.position.set(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z);
    /**
     * Uses zero vector for the perpendicular vector to uVec. I know this isn't what your suppose to do,
     * but any other method would not yield a dot product of zero. I tried several attempts at finding
     * another solution for creating a vector, all commented out down below in findingAVector(uVec), but
     * it would always give me a dot product for u*v that was just slightly off zero. This in turn would
     * affect the wVec since its found by taking a cross product of uVec and wVec.
     */
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
    console.log("uMagnitude " + uMagnitude);
    console.log("uDotv " + uDotv);
    
    vLine.geometry.vertices.push(new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z));
    vLine.geometry.vertices.push(vVec);
    vLine.rotation.set(0, 0, 1.5707963268);
    var vMagnitude = vVec.length();
    var vDotw = vVec.dot(wVec);
    // Since vVec is a zero vector the length is zero.
    console.log("vMagnitude " + vMagnitude);
    console.log("vDotw " + vDotw);
    
    wLine.geometry.vertices.push(new THREE.Vector3(geometry.vertices[i].x, geometry.vertices[i].y, geometry.vertices[i].z));
    wLine.geometry.vertices.push(wVec);
    wLine.rotation.set(1.5707963268, 0, 0);
    var wMagnitude = wVec.length();
    var wDotu = wVec.dot(uVec);
    // Since wVec is a zero vector because of uVec x vVec the length is zero.
    console.log("wMagnitude " + wMagnitude);
    console.log("wDotu " + wDotu);
    
    scene.add(sph, uLine, vLine, wLine);
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

//function findingAVector(uVec){
    /**
     * My attempt at making a matrix rotation of 90 degrees around the y axis to create
     * what is a perpendicular vector. Probably the closest I got to get it working, but
     * always ended up with one coordinate being capable of keeping my dot product from zero
     * unless they either had zero in the uVec or canceled each other out.
     * 
     * var matrix = new THREE.Matrix3();
        var uMatrix = new THREE.Matrix3();
        matrix.set( 1, 0,  0,
                    0, 0, -1,
                    0, 1,  0);
        uMatrix.set(uVec.x, 0, 0,
                    uVec.y, 0, 0, 
                    uVec.z, 0, 0,);
        matrix.multiplyMatrices(matrix, uMatrix);
        var vec = new THREE.Vector3(matrix.elements[0],matrix.elements[1],matrix.elements[2]);
     */
    
    /**
     * Second attempt was rather trivial just moving points around and giving the opposite ones a negative value.
     * ultimately this somewhat worked, but would leave one coordinate the same as the uVec coordinate for it.
     * 
     * var vec = new THREE.Vector3(-uVec.y, uVec.x, -uVec.z);
     */

     /**
      * Third attempt was same as second, but move them around so that they wouldn't have the same values
      * as the uVec.
      * 
      * var vec = new THREE.Vector3(-uVec.z, uVec.x, -uVec.y);
      */
    /**
     * Fourth attempt was trying to find a vx, vy, vz value that would allow for it to be orthogonal
     * and equal to zero. It used the matrix values computed from the first attempt since I could not
     * get a "x y z" values that was not the uVec "x y z" values without it.
     * 
     * var vx = ((uVec.y * matrix.elements[1]) + (uVec.z * matrix.elements[2]))/ uVec.x;
     * var vy = ((uVec.x * matrix.elements[0]) + (uVec.z * matrix.elements[2]))/ uVec.y;
     * var vz = ((uVec.x * matrix.elements[0]) + (uVec.y * matrix.elements[1]))/ uVec.z;
     * 
     * var vec = new THREE.Vector3(vx, vy, vz);
     */
    //return vec;
//}

animate();