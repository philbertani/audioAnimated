import * as THREE from "three"
import {fragmentShaders,vertexShader} from "./GPUshaders"


export function createShaderModel(scene,uniforms,shaderFunc) {

    let sFunc = shaderFunc
    if (shaderFunc>fragmentShaders.length-1) {
        //default to Luminescent Tiles
        sFunc = 3
        console.log('please check your graphicsFunc setup, out of bounds shader func #',shaderFunc)
    }

    const camera   = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );  //we just have a plane so no perspective required
    const fragPlane = new THREE.PlaneGeometry( 1.9, 1.9 );  //the plane that fills the whole screen
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShaders[sFunc],
        uniforms
    });

    const frag_plane = new THREE.Mesh(fragPlane, material);
    scene.add(frag_plane);

    return {camera, material}
}

export function animateShaderModel(GL,md,time) {
    const uu = GL.material.uniforms
    uu.iMusic.value = new THREE.Vector4( (md.sumLow*md.sumLow/2),md.sumMid*10,md.sum*md.sum*20,md.wsum1)
    uu.iTime.value = time
}

export function createVertexModel(scene,aspect) {

    const fov = 50;

    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 5  //200 

    const light = new THREE.DirectionalLight( "white", 1)
    light.position.set(-10,0,10)
    scene.add(light)

    const light2 = new THREE.PointLight("orange",1.3)
    
    camera.add(light2)
    camera.position.set(0,0,4)
    camera.lookAt(0,0,0)
    scene.add(camera)

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const phong = new  THREE.MeshPhongMaterial({color:"rgb(80,60,250)"});
    const cube = new THREE.Mesh( geometry, phong );
    cube.rotateZ(.5)
    cube.rotateX(.3)
    scene.add( cube );

    return {camera,cube,light,light2}

}

export function animateVertexModel(GL,md) {

    GL.cube.rotation.x =  md.sumLow - md.wsum1
    GL.cube.rotation.y =  md.sumMid
    GL.cube.rotation.z =  md.sumHigh
    GL.cube.position.z =  md.sum*1.3

    GL.light2.intensity = md.sum*md.sum*md.sum*1.7
}

export function d12Vertices() {

    const t = (1 + Math.sqrt(5)) / 2;
    const r = 1 / t;

    const vertices = [

        // (±1, ±1, ±1)
        - 1, - 1, - 1, - 1, - 1, 1,
        - 1, 1, - 1, - 1, 1, 1,
        1, - 1, - 1, 1, - 1, 1,
        1, 1, - 1, 1, 1, 1,

        // (0, ±1/φ, ±φ)
        0, - r, - t, 0, - r, t,
        0, r, - t, 0, r, t,

        // (±1/φ, ±φ, 0)
        - r, - t, 0, - r, t, 0,
        r, - t, 0, r, t, 0,

        // (±φ, 0, ±1/φ)
        - t, 0, - r, t, 0, - r,
        - t, 0, r, t, 0, r
    ];

    return vertices;
}
