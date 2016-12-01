
"use strict";

var loadStep2_begin = false;

//ブリーフィング中
oreCommon.BrefingScene = null;
oreCommon.BrefingScene = {};

oreCommon.BrefingScene.BrefUpdater = function () {
    var scrTmpMx = new THREE.Matrix4();
    var scrTmpV3 = new THREE.Vector3();

    oreCommon.BrefingScene.checkBeginLoad2();

    //地形ビューのカメラ位置更新
    if (testStageScript.camPosAnimate != null) {
        testStageScript.camPosAnimate.update(oreCommon.dulTime * 2);
        testStageScript.camTargetAnimate.update(oreCommon.dulTime * 2);

        var tmpObj = testStageScript.camPosAnimate.getNowMatrix();
        if (tmpObj != null) {
            scrTmpMx.copy(tmpObj);
            scrTmpMx.multiplyScalar(oreCommon.groundMapSize);
            threeComps.camera_back.position.setFromMatrixPosition(scrTmpMx);

            tmpObj = testStageScript.camTargetAnimate.getNowMatrix();
            if (tmpObj != null) {
                scrTmpMx.copy(tmpObj);
            }
            scrTmpMx.multiplyScalar(oreCommon.groundMapSize);
            scrTmpV3.setFromMatrixPosition(scrTmpMx);
            threeComps.camera_back.lookAt(scrTmpV3);
        }
    }

    if (ScreenUpdater.msgView_big >= msg_bref.length && !oreCommon.ChangeScene) {
        //全イベントリスナーを消去
        oreCommon.setEvent_Load();
        ScreenUpdater.scene_spanTime = 0;
        oreCommon.ChangeScene = true;
    }

    if (ScreenUpdater.scene_spanTime > ScreenUpdater.lineCountMax * 2 && ScreenUpdater.msgView_big === 0 && cv_bref_load != null) {
        oreCommon.MessageClickEvent();
        //ScreenUpdater.msgView_big = 1;
    }

    if (ScreenUpdater.scene_spanTime > 255 && ScreenUpdater.msgView_big >= msg_bref.length) {
        ScreenUpdater.nowSceneID++;
        oreCommon.ChangeScene = false;
        oreCommon.setEvent_Load();
        ScreenUpdater.NowScene.Render_2D = function () { oreCommon.BrefingScene.BrefingOutRender(); };
        ScreenUpdater.NowScene.Render3D = function () { nullRender(); };
        ScreenUpdater.NowScene.Update = function () { oreCommon.BrefingScene.BrefingOutUpdate(); };
    }
}


oreCommon.BrefingScene.BrefingRender = function () {
    oreCommon.conteText2D.clearRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);
    oreCommon.conteText2D.fillStyle = "rgb(0, 0, 0)";
    //oreCommon.conteText2D.fillRect(0, 0, oreCommon.canvas2D.clientWidth, oreCommon.canvas2D.clientHeight);

    if (ScreenUpdater.msgView_big === 0) {
        ScreenUpdater.drawJfLine(false);
    }

    if (ScreenUpdater.msgView_big < msg_bref.length) {
        if (ScreenUpdater.msgView_big > 0) {
            ScreenUpdater.drawJfLine(true);
        }
        ScreenUpdater.viewBrefingMessage();
    }
    else {
        ScreenUpdater.drawJfLine(true);
        ScreenUpdater.drawFadeOut();
    }

}

oreCommon.BrefingScene.checkBeginLoad2 = function () {
    if (oreCommon.loadEndCount >= oreCommon.loadContentCount - 1 && !loadStep2_begin && testStageScript != null) {
        loadStep2_begin = true;
        testStageScript.LoadContent2();
    }
}
///////////////////////////////////////////////////////////

//ブリーフィングが終わり、ロード中の画面
oreCommon.BrefingScene.BrefingOutUpdate = function () {

    oreCommon.BrefingScene.checkBeginLoad2();

    if (oreCommon.loadEndCount >= oreCommon.loadContentCount && cv_Stage_load && loadStep2_begin) {
        //どうあがいても確実に読む必要のあるモノがこちら
        oreCommon.AlpBillTex = threeComps.texLoader.load('content/efobj/AlpBillTex.png');
        var nowMat = new THREE.MeshBasicMaterial();
        nowMat.depthTest = true;
        nowMat.side = THREE.DoubleSide;
        nowMat.blending = THREE.NormalBlending;
        oreCommon.igeo_alp = particleComp.makeGeo_bill(oreCommon.AlpBillTex, nowMat);

        oreCommon.AddBillTex = threeComps.texLoader.load('content/efobj/AddBillTex.png');
        oreCommon.igeo = particleComp.makeGeo_bill(oreCommon.AddBillTex);

        testStageScript.stageInit_individually();
        
        testStageScript.stageInit_reStart();
        //メイン部ループ宣言
        oreCommon.ChangeScene = false;
        setEvent_MainRoop();
        ScreenUpdater.NowScene.Render3D = function () { ScreenUpdater.stageMainRander(); };
        ScreenUpdater.NowScene.Render_2D = function () { oreBt2DSceneCom.stageMainRander_2D(); };
        ScreenUpdater.NowScene.Update = function () { ScreenUpdater.stageMainUpdater(); };

        //ブリーフィング音声は消しちゃう（少しでも軽くなれば良い）
        VcOjs_bref = null;
    }
}

//ブリーフィングが終わり、ロード中の画面
oreCommon.BrefingScene.BrefingOutRender = function () {

    oreCommon.conteText2D.clearRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);
    oreCommon.conteText2D.fillStyle = "rgb(0, 0, 0)";
    oreCommon.conteText2D.fillRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);

    oreCommon.conteText2D.font = "11pt Arial";
    oreCommon.conteText2D.fillStyle = 'white';
    oreCommon.conteText2D.textAlign = 'left';
    oreCommon.conteText2D.fillText('now loading...     ' + oreCommon.loadEndCount.toString() + " / " + oreCommon.loadContentCount.toString(), 100, 100);

    if (!loadStep2_begin) {
        oreCommon.conteText2D.fillText('...and more... prease wait...', 100, 130);
    }

}

//////////////////////////////////

//下記ステージに使うモノの前に、優先的に読み込ませたいモノのロード
oreCommon.BrefingScene.LoadContent_zero = function () {

    var tes = "";
    tes = ";";

    //悲劇的なことに、Scaleに負の値を入れると、ray.intersectObjectが使えなくなる模様。
    threeComps.loader.load(['content/ground/state4_height_cam.x', false], function (object) {
        var loadEnd = function (_object) {
            oreCommon.heightObject = _object.FrameInfo[0];
            oreCommon.heightObject.name = "brefMap";
            threeComps.scene_back.add(oreCommon.heightObject);

            oreCommon.heightObject.material.materials[0].visible = true;
            oreCommon.heightObject.material.materials[0].wireframe = true;
            oreCommon.heightObject.material.materials[0].side = THREE.DoubleSide;
            oreCommon.heightObject.material.materials[0].fog = false;

            var keys = Object.keys(_object.AnimationSetInfo);
            testStageScript.camPosAnimate = new XActionInfo();
            //testStageScript.camPosAnimate = 
            testStageScript.camPosAnimate.createAnimation("", 0, 1000, true, false, _object.AnimationSetInfo[keys[0]]["Animation5"]);
            testStageScript.camPosAnimate.begin(1, 1, true);

            testStageScript.camTargetAnimate = new XActionInfo();
            //testStageScript.camTargetAnimate = 
            testStageScript.camTargetAnimate.createAnimation("", 0, 1000, true, false, _object.AnimationSetInfo[keys[0]]["Animation1"]);
            testStageScript.camTargetAnimate.begin(1, 1, true);

            //これらのWayPointの「Y座標」を、接地させる必要がある&倍率はAnimationにはかかってないので、乗算する
            var L_temp_Y = 0.0;// oreCommon.GetPosHeight(self.Pos);

            testStageScript.WayPoint_V[0].setFromMatrixPosition(_object.AnimationSetInfo[keys[0]]["Animation2"].KeyFrames[0].Matrix);
            testStageScript.WayPoint_V[0].copy(oreCommon.SetGroundFixPoint(testStageScript.WayPoint_V[0], oreCommon.groundMapSize, true));

            testStageScript.WayPoint_V[1].setFromMatrixPosition(_object.AnimationSetInfo[keys[0]]["Animation2"].KeyFrames[1].Matrix);
            testStageScript.WayPoint_V[1].copy(oreCommon.SetGroundFixPoint(testStageScript.WayPoint_V[1], oreCommon.groundMapSize, true));

            testStageScript.EnemyPoints[0].setFromMatrixPosition(_object.AnimationSetInfo[keys[0]]["Animation3"].KeyFrames[0].Matrix);
            testStageScript.EnemyPoints[0].copy(oreCommon.SetGroundFixPoint(testStageScript.EnemyPoints[0], oreCommon.groundMapSize, true));

            testStageScript.EnemyPoints[1].setFromMatrixPosition(_object.AnimationSetInfo[keys[0]]["Animation3"].KeyFrames[1].Matrix);
            testStageScript.EnemyPoints[1].copy(oreCommon.SetGroundFixPoint(testStageScript.EnemyPoints[1], oreCommon.groundMapSize, true));

            for (var i = 0; i < _object.AnimationSetInfo[keys[0]]["Animation4"].KeyFrames.length; i++) {
                var wp = new strWayPointParam();
                wp.wayPointV.setFromMatrixPosition(_object.AnimationSetInfo[keys[0]]["Animation4"].KeyFrames[i].Matrix);
                wp.wayPointV.copy(oreCommon.SetGroundFixPoint(wp.wayPointV, oreCommon.groundMapSize, true));
                wp.waypointType = cEnCpuWayPointID.Navi_d;
                wp.StayTime = 1;    //ゼロはそのポイントで無限停滞
                testStageScript.alpha3WayPoints.push(wp);
            }

            oreCommon.heightObject.scale.multiplyScalar(oreCommon.groundMapSize);
            oreCommon.heightObject.updateMatrix();

            _object = null;
        };
        setTimeout(loadEnd(object), 10);

    }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    /////////////
}

oreCommon.BrefingScene.LoadContent_zero();