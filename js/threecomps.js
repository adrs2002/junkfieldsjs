/// <reference path="three.min.js"/>

"use strict";

//よく使いそうなThreeJS系をまとめたやつ。使用自由。
var threeComps = {};

threeComps.manager = null;
threeComps.camera = null;
threeComps.camera_back = null;

var stats = null;

threeComps.renderer = null;
threeComps.scene = null;
threeComps.scene_back = null;

//var clock = new THREE.Clock();
threeComps.texLoader = null;
threeComps.loader = null;

threeComps.THREE_onProgress = null;
threeComps.THREE_onError = null;

//ブルームエフェクトのパラメーター
threeComps.params = {
    projection: 'normal',
    background: false,
    exposure: 1.0,
    bloomStrength: 0.4,
    bloomThreshold: 1.0,
    bloomRadius: 0.64
};
//ブルーム関連
threeComps.renderScene_back = null;
threeComps.renderScene = null;
threeComps.effectFXAA = null;
threeComps.bloomPass = null;
threeComps.composer = null;
threeComps.copyShader = null;

/////////////////////////////////////////////

//turee.js関連を初期化する。何回走ってもいいようになっている
threeComps.init = function () {

    threeComps.manager = new THREE.LoadingManager();
    threeComps.manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    threeComps.THREE_onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            var fileStr = "";
            if (xhr.target != null && xhr.target.responseURL != null) {
                fileStr = xhr.target.responseURL;
            }
            console.log(fileStr + "  -> " + Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    threeComps.THREE_onError = function (xhr) {
        var fileStr = "";
        if (xhr.target != null && xhr.target.responseURL != null) {
            fileStr = xhr.target.responseURL;
        }
        console.log(fileStr + "  Load Error!");
    };

    threeComps.texLoader = new THREE.TextureLoader(threeComps.manager);
    threeComps.loader = new XfileLoader(threeComps.manager, threeComps.texLoader);

    //////////////////

    threeComps.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2500);
    threeComps.camera.addQ = new THREE.Quaternion();

    threeComps.scene = new THREE.Scene();
    //threeComps.scene.add(new THREE.AmbientLight(0x999999));

    threeComps.scene_back = new THREE.Scene();
    threeComps.scene_back.add(new THREE.AmbientLight(0x999999));

    threeComps.camera_back = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 300000);
    threeComps.camera_back.addQ = new THREE.Quaternion();



    threeComps.renderer = new THREE.WebGLRenderer();
    threeComps.renderer.setPixelRatio(window.devicePixelRatio);
    //threeComps.renderer.setSize(window.innerWidth, window.innerHeight);
    threeComps.renderer.setSize(oreCommon.canvas3D.clientWidth, oreCommon.canvas3D.clientHeight);
    threeComps.renderer.setClearColor(0x000000);
    threeComps.renderer.autoClear = false;
    oreCommon.canvas3D.appendChild(threeComps.renderer.domElement);

    if (stats == null) {
        stats = new Stats();
        oreCommon.canvas3D.appendChild(stats.dom);
    }

    //ブルームエフェクト
    threeComps.renderScene_back = new THREE.RenderPass(threeComps.scene_back, threeComps.camera_back);
    threeComps.renderScene = new THREE.RenderPass(threeComps.scene, threeComps.camera);
    threeComps.renderScene.clear = false;
    // threeComps.renderScene.clear = true;
    threeComps.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    threeComps.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    threeComps.copyShader = new THREE.ShaderPass(THREE.CopyShader);
    threeComps.copyShader.renderToScreen = true;
    threeComps.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);//1.0, 9, 0.5, 512);
    threeComps.composer = new THREE.EffectComposer(threeComps.renderer);
    threeComps.composer.setSize(window.innerWidth, window.innerHeight);

    threeComps.composer.addPass(threeComps.renderScene_back);
    threeComps.composer.addPass(threeComps.renderScene);

    threeComps.composer.addPass(threeComps.effectFXAA);
    threeComps.composer.addPass(threeComps.bloomPass);
    threeComps.composer.addPass(threeComps.copyShader);
    //threeComps.renderer.toneMapping = THREE.ReinhardToneMapping;
    threeComps.renderer.gammaInput = true;
    threeComps.renderer.gammaOutput = true;
    threeComps.renderer.toneMappingExposure = Math.pow(threeComps.params.exposure, 4.0);

}


threeComps.destructor = function () {
    threeComps.manager = null;
    threeComps.camera = null;
    threeComps.camera_back = null;

    threeComps.renderer = null;
    threeComps.scene = null;
    threeComps.scene_back = null;

    threeComps.texLoader = null;
    threeComps.loader = null;

    threeComps.THREE_onProgress = null;
    threeComps.THREE_onError = null;

    threeComps.composer = null;
}