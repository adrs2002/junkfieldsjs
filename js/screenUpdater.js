/// <reference path="oreCommon.js"/>
"use strict";

//ここは、いわば【1フレーム（60ないし30/1秒）で更新が行われるとする、【内容】のアップデート。
//画像の更新（RequestAnimaionFrame)とは別で走る。
//XNA.DirectXでいう Update　がコレ、　Draw　が　RequestAnimaionFrame　となる

var ScreenUpdater = ScreenUpdater || {};

ScreenUpdater.nowSceneID = 0;
ScreenUpdater.nowSubSceneID = 0;

ScreenUpdater.NextSceneID = 0;

ScreenUpdater.scene_spanTime = 0;
ScreenUpdater.msgView_big = 0;
ScreenUpdater.msgView_small = 0;
ScreenUpdater.msgView_Span = 0;
ScreenUpdater.msgViewKey = "";

ScreenUpdater.endingFlg = false;

ScreenUpdater.NowScene = null;

ScreenUpdater.players = [];
ScreenUpdater.etcObject = new Array();

ScreenUpdater.MissionInfoText = "";

ScreenUpdater.BigInfoTextPool = new Array();
ScreenUpdater.BigInfoText = ["", ""];
ScreenUpdater.BigInfoTextViewTime = 0;
ScreenUpdater.BigInfoTextViewTime_B = 0;
ScreenUpdater.BigInfoTextViewType = [0, 0];


ScreenUpdater.mainViewID = 0;
ScreenUpdater.UpdateFrameRate = 30;
ScreenUpdater.frameTime = 1000 / ScreenUpdater.UpdateFrameRate;
ScreenUpdater.masterSpeedPow = 2.0;


ScreenUpdater.RotateXY = new THREE.Vector2(0, 0);
ScreenUpdater.cam_lookAt = new THREE.Vector3(0, 0, 1);

ScreenUpdater.Rader_Min = 500;
ScreenUpdater.RaderRangeMax = ScreenUpdater.Rader_Min;

ScreenUpdater.nowInputs = new FrameInput();

ScreenUpdater.cam2Pow = 0.0;
ScreenUpdater.cam2Enable = false;
ScreenUpdater.cam3Pow = 0.0;
ScreenUpdater.cam3Enable = false;

ScreenUpdater.DisplayInfoType = 0;
ScreenUpdater.DisplayInfoTime = 0;
ScreenUpdater.DisplayInfoText = "";

var drawCol_Gr1 = 'rgb(0, 255, 10)';
var drawCol_Gr2 = 'rgb(0, 150, 0)';
var drawCol_Grt = 'rgba(0, 100, 0, 0.3)';
var drawCol_Grt2 = 'rgba(0, 150, 0, 0.4)';
var drawCol_Grt3 = 'rgba(0, 100, 0, 0.8)';

var drawCol_Rd1 = 'rgb(255, 10, 0)';

var drawCol_Yl1 = 'rgb(200, 200, 10)';
var drawCol_Yl2 = 'rgb(150, 150, 10)';


var drawCol_Bl2 = 'rgb(0, 50, 200)';

var drawCol_Wh1 = 'rgb(200,200,200)'
var drawCol_Wh2 = 'rgb(250,250,250)'

var RanderHeight = 128;
var RaderCentPos = [200, 200];
var harf_W;
var harf_H;
var harf_2W;
var harf_2H;
var harf_4W;
var harf_4H;

ScreenUpdater.viewingEnemySort = new Array();

////////////////////////////////////////////////////////

ScreenUpdater.UpdaterBase = function () {

    var nowTime = Date.now();
    oreCommon.dulTime = nowTime - oreCommon.LastDateTime;
    oreCommon.LastDateTime = nowTime;

    setTimeout(ScreenUpdater.UpdaterBase, ScreenUpdater.frameTime);
    if (oreCommon.PauseFlg) { return; }

    harf_W = oreCommon.conteText2D.canvas.width / 2;
    harf_H = oreCommon.conteText2D.canvas.height / 2;
    harf_2W = oreCommon.conteText2D.canvas.width / 4;
    harf_2H = oreCommon.conteText2D.canvas.height / 4;
    harf_4W = oreCommon.conteText2D.canvas.width / 8;
    harf_4H = oreCommon.conteText2D.canvas.height / 8;

    if (ScreenUpdater.NowScene != null) {
        ScreenUpdater.scene_spanTime += oreCommon.dulTime;
        ScreenUpdater.NowScene.Update();
    }
}

//完全に全ステージで共通化できる初期化がココ
ScreenUpdater.stage_Initting = function () {
    //ステージ共通の初期状態（リセット状態）をココでセットする

    //全パーティクルをリセット
    particleComp.particle_init();

    //全ユニットの出現状態、位置をリセット
    //var keys = Object.keys(ScreenUpdater.players);
    for (var i = 0; i < ScreenUpdater.players.length; i++) {
        ScreenUpdater.players[i].init();
    }

    for (var i = 0; i < ScreenUpdater.etcObject.length; i++) {
        ScreenUpdater.etcObject[i].init();
    }

    ScreenUpdater.RotateXY = new THREE.Vector2(Math.PI, 0);

}

function nullRender() {

}

/////////////////////////////////////////////////////////////////////////////////




//メインとなるコンテンツ更新アップデート命令
ScreenUpdater.stageMainUpdater = function () {

    //HIT判定
    particleComp.ParticeUpdate(particleComp.pt_bullet_Add, ScreenUpdater.frameTime);
    particleComp.ParticeUpdate(particleComp.pt_bill_Alp, ScreenUpdater.frameTime);
    particleComp.ParticeUpdate(particleComp.pt_bill_Add, ScreenUpdater.frameTime);
    particleComp.ParticeUpdate(particleComp.pt_Obj_Add, ScreenUpdater.frameTime);

    //カメラ位置更新
    ScreenUpdater.cameraUpdate();
    var keys = null;
    //各オブジェクトアップデート
    if (ScreenUpdater.players != null) {
        keys = Object.keys(ScreenUpdater.players);
        for (var i = 0; i < keys.length; i++) {
            if (ScreenUpdater.players[keys[i]].bp.On || ScreenUpdater.players[keys[i]].bp.DeadTime > 0) {
                ScreenUpdater.players[keys[i]].Update();
                //アニメーターをアップデート
                ScreenUpdater.players[keys[i]].Animater.update(oreCommon.dulTime);
                //付属されているオブジェクトも更新
                ScreenUpdater.players[keys[i]].UpdateMounts(oreCommon.dulTime);

                if (ScreenUpdater.players[keys[i]].bp.DeadTime > 0) {
                    ScreenUpdater.players[keys[i]].bp.DeadTime -= oreCommon.dulTime;
                    if (ScreenUpdater.players[keys[i]].bp.DeadTime < 0) { ScreenUpdater.players[keys[i]].bp.DeadTime = 0; }
                }
            }
        }
    }

    if (ScreenUpdater.etcObject != null) {
        keys = Object.keys(ScreenUpdater.etcObject);
        for (var i = 0; i < keys.length; i++) {
            if (ScreenUpdater.etcObject[keys[i]].bp.On) {
                ScreenUpdater.etcObject[keys[i]].Update();
                if (ScreenUpdater.etcObject[i].Animater != null) {
                    ScreenUpdater.etcObject[i].Animater.update(oreCommon.dulTime);
                }
                else {
                    ScreenUpdater.etcObject[i].BoneUpdate(oreCommon.dulTime);
                }
            }
        }
    }

    ScreenUpdater.LastMouseMoment.set(0, 0);
    //ScreenUpdater.nowInputs.init();
    if (stageUpdater != null) { stageUpdater(); }

}

//描画
ScreenUpdater.stageMainRander = function () {
    if (oreCommon.PauseFlg) { return; }
    var keys = null;
    /*
        keys = Object.keys(ScreenUpdater.players);
        for (var i = 0; i < keys.length; i++) {
            ScreenUpdater.players[keys[i]].Animater.update(oreCommon.dulTime);
    
            //付属されているオブジェクトも更新
            ScreenUpdater.players[keys[i]].UpdateMounts();
        }
   
    for (var i = 0; i < ScreenUpdater.etcObject.length; i++) {
        if (ScreenUpdater.etcObject[i].Animater != null) { ScreenUpdater.etcObject[i].Animater.update(oreCommon.dulTime); }
    }
    */

    particleComp.ParticeSetGL(particleComp.pt_bill_Alp, oreCommon.igeo_alp, false, false);
    particleComp.ParticeSetGL(particleComp.pt_bill_Add, oreCommon.igeo, false, false);
    particleComp.ParticeSetGL(particleComp.pt_bullet_Add, oreCommon.igeo_tama, true, true);
    particleComp.ParticeSetGL(particleComp.pt_Obj_Add, oreCommon.igeo_obj, true, false);

}


function addDisplayInfo(_type, _time, _text) {
    if (_type >= ScreenUpdater.DisplayInfoType || ScreenUpdater.DisplayInfoTime === 0) {
        ScreenUpdater.DisplayInfoType = _type;
        ScreenUpdater.DisplayInfoTime = _time;
        ScreenUpdater.DisplayInfoText = _text;
    }
}



function viewBigInfoText() {
    /*
    
var MissionInfo = "";

var ScreenUpdater.BigInfoTextPool = new Array();
var ScreenUpdater.BigInfoText = ["", ""];
var ScreenUpdater.BigInfoTextViewTime = 0;
var ScreenUpdater.BigInfoTextViewTime_B = 0;
var BigInfoTextViewType  = [0,0];
 */



}



//指定したVector3の画面上の位置を取得する
ScreenUpdater.SceneToScreenPos = function (_v) {

    oreCommon.sceneCom_TempV3.copy(_v);
    oreCommon.sceneCom_TempV3.project(threeComps.camera);
    oreCommon.sceneCom_TempV3.x = Math.clamp(oreCommon.sceneCom_TempV3.x, -1, 1);
    oreCommon.sceneCom_TempV3.x = (oreCommon.sceneCom_TempV3.x * harf_W) + harf_W;
    oreCommon.sceneCom_TempV3.y = -(oreCommon.sceneCom_TempV3.y * harf_H) + harf_H;

    return [oreCommon.sceneCom_TempV3.x, oreCommon.sceneCom_TempV3.y, oreCommon.sceneCom_TempV3.z];   //視点に対しての表裏は z に入ってくる（1.0を超えてたらカメラの裏側）
}



var nowCamTarget = 0;
///カメラ位置の更新
ScreenUpdater.cameraUpdate = function () {

    var vects = [ScreenUpdater.LastMouseMoment.x, ScreenUpdater.LastMouseMoment.y];

    vects[0] = Math.clamp(vects[0], -5, +5);
    vects[1] = Math.clamp(vects[1], -5, +5);

    var rotatePow = 1.0 - ScreenUpdater.cam3Pow;
    if (rotatePow < 0.05) { rotatePow = 0.05; }

    if (!isNaN(vects[0])) { ScreenUpdater.RotateXY.x -= 0.01 * vects[0] * rotatePow; }
    if (!isNaN(vects[1])) { ScreenUpdater.RotateXY.y -= 0.005 * vects[1] * rotatePow; }

    oreCommon.tempQ_Y.set(0, 0, 0, 1);
    oreCommon.tempQ_Y.setFromAxisAngle(oreMath.rotateAxisY, ScreenUpdater.RotateXY.x);

    oreCommon.tempQ_X.set(0, 0, 0, 1);
    oreCommon.tempQ_X.setFromAxisAngle(oreMath.rotateAxisX, ScreenUpdater.RotateXY.y);
    oreCommon.tempQ_Y.multiply(oreCommon.tempQ_X);

    //注視点
    oreCommon.sceneCom_TempV3.set(0, 10, -1000);
    oreCommon.sceneCom_TempV3.applyQuaternion(oreCommon.tempQ_Y);

    //カメラ位置
    oreCommon.sceneCom_TempV3_2.set(0, 25, 55); //ここが、被写体からどのくらい離れた位置にカメラを置くのか、の値 (0, 13, 30); 

    if (ScreenUpdater.cam2Enable) { ScreenUpdater.cam2Pow += 0.05; } else { ScreenUpdater.cam2Pow -= 0.05; }
    ScreenUpdater.cam2Pow = Math.clamp(ScreenUpdater.cam2Pow, 0, 1);
    var tmpf_cam = ScreenUpdater.cam2Pow * 20;
    oreCommon.sceneCom_TempV3_2.z -= tmpf_cam;

    oreCommon.sceneCom_TempV3_2.applyQuaternion(oreCommon.tempQ_Y);

    threeComps.camera.position.copy(oreCommon.sceneCom_TempV3_2);
    if (!oreCommon.debugMode || oreCommon.debugKeyInt === -1) {
        threeComps.camera.position.add(ScreenUpdater.players[ScreenUpdater.mainViewID].Pos);
        oreCommon.sceneCom_TempV3.add(ScreenUpdater.players[ScreenUpdater.mainViewID].Pos);
    } else {
        getStageTargetCam();
    }

    //スナイパー時のずーむ
    if (ScreenUpdater.cam3Enable) { ScreenUpdater.cam3Pow += 0.005; } else { ScreenUpdater.cam3Pow -= 0.1; }
    ScreenUpdater.cam3Pow = Math.clamp(ScreenUpdater.cam3Pow, 0, 1);
    tmpf_cam = ScreenUpdater.cam3Pow * 42;
    threeComps.camera.fov = 45 - tmpf_cam;
    threeComps.camera.updateProjectionMatrix();
    threeComps.copyShader.uniforms['nigths'].value = ScreenUpdater.cam3Pow * 0.5;

    threeComps.camera_back.position.copy(threeComps.camera.position);

    threeComps.camera.lookAt(oreCommon.sceneCom_TempV3);
    ScreenUpdater.cam_lookAt.copy(oreCommon.sceneCom_TempV3);
    threeComps.camera_back.lookAt(oreCommon.sceneCom_TempV3);

    //空（天球オブジェクト）は、位置だけはカメラにくっついてくるようにする
    oreCommon.sceneCom_TempV3_2.copy(threeComps.camera.position);
    oreCommon.sceneCom_TempV3_2.y = 0;
    oreCommon.skyBallObject.position.copy(oreCommon.sceneCom_TempV3_2);

}


/// <summary>
/// IDから、目標の[現在の位置]を返す。
/// </summary>
/// <param name="TgtID"></param>
/// <param name="tgtV"></param>
ScreenUpdater.GetTgtPos = function (TgtID) {
    if (TgtID < 100) {
        return ScreenUpdater.players[TgtID].CenterTgtPos;
    } else {
        return ScreenUpdater.etcObject[TgtID - 100].CenterTgtPos;
    }
}

////////////////////////////////////////////////////////////

///指定配列の中の、Bp.Onの数をカウントする
ScreenUpdater.getArriveCount = function (_array) {
    var tmpCount = 0;
    var keys = Object.keys(_array);
    for (var i = 0; i < keys.length; i++) {
        if (_array[keys[i]].bp.On && _array[keys[i]].bp.groupID != ScreenUpdater.players[0].bp.groupID) {
            tmpCount++;
        }
    }
    return tmpCount;
}

///敵配列のGrroupID３の出現グループの敵を出現させる
ScreenUpdater.setBeginEnemy = function (_grpId) {
    var keys = Object.keys(ScreenUpdater.etcObject);
    for (var i = 0; i < keys.length; i++) {
        if (ScreenUpdater.etcObject[keys[i]].bp.groupID_3 === _grpId) {

            ScreenUpdater.etcObject[keys[i]].Pos.copy(ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.WayPoints[0].wayPointV);
            ScreenUpdater.etcObject[keys[i]].Pos.x += (Math.random() - 0.5) * 20;
            ScreenUpdater.etcObject[keys[i]].Pos.z += (Math.random() - 0.5) * 30;

            ScreenUpdater.etcObject[keys[i]].bp.setOn(true, ScreenUpdater.etcObject[keys[i]]);
        }
    }
}


///////////////////////////////////////////////////////

//Updateにて適用した、マウスの最終位置
ScreenUpdater.LastMousePos = new THREE.Vector2;
//マウスイベントにて取得したマウス位置をガバガバに格納する入れ物
ScreenUpdater.LastDetectMousePos = new THREE.Vector2;
ScreenUpdater.LastMouseMoment = new THREE.Vector2;

//////////////////////////////////////////////////////////////




function onMouseMove(e) {

    ScreenUpdater.LastMouseMoment.set(e.movementX || e.mozMovementX || e.webkitMovementX, e.movementY || e.mozMovementY || e.webkitMovementY);

    if (ScreenUpdater.LastMouseMoment.x === undefined) {
        ScreenUpdater.LastMouseMoment.x = e.clientX - ScreenUpdater.LastDetectMousePos.x;
        ScreenUpdater.LastMouseMoment.y = e.clientY - ScreenUpdater.LastDetectMousePos.y;

        ScreenUpdater.LastDetectMousePos.x = e.clientX;
        ScreenUpdater.LastDetectMousePos.y = e.clientY;
    }

    if (e.buttons !== undefined) {
        //var mouseClick = ((e.buttons & 0x0001) ? true : false);
        ScreenUpdater.nowInputs.Mouse_L = ((e.buttons & 0x0001) ? true : false);
        ScreenUpdater.nowInputs.Mouse_R = ((e.buttons & 2) == 2 ? true : false);
    }

    //console.log(e.buttons);

}

function onMousedown(e) {
    if (e.buttons !== undefined) {
        ScreenUpdater.nowInputs.Mouse_L = ((e.buttons & 0x0001) ? true : false);
        ScreenUpdater.nowInputs.Mouse_R = ((e.buttons & 2) == 2 ? true : false);
    }
}

function onMouseup(e) {
    if (e.buttons !== undefined) {
        ScreenUpdater.nowInputs.Mouse_L = ((e.buttons & 0x0001) ? true : false);
        ScreenUpdater.nowInputs.Mouse_R = ((e.buttons & 2) == 2 ? true : false);
    }
}


//本戦闘中のイベントセット
function setEvent_MainRoop() {
    //イベントリスナーを消去
    RemoveAllEvents();

    //追加
    oreCommon.nowMouseMoveEvent = function (e) {
        onMouseMove(e);
    };
    document.addEventListener("mousemove", oreCommon.nowMouseMoveEvent, false);

    oreCommon.nowMouseDownEvent = function (e) {
        onMousedown(e);
    };
    document.addEventListener('mousedown', oreCommon.nowMouseDownEvent, false);

    oreCommon.nowMouseUpEvent = function (e) {
        onMouseup(e);
    };
    document.addEventListener('mouseup', oreCommon.nowMouseUpEvent, false);

    oreCommon.nowKeydownEvent = function (e) {
        keydown(e);
    };
    document.addEventListener('keydown', oreCommon.nowKeydownEvent, false);

    oreCommon.nowKeyUpEvent = function (e) {
        keyup(e);
    };
    document.addEventListener('keyup', oreCommon.nowKeyUpEvent, false);
}

function keydown(e) {

    if (e.keyCode === 65) { ScreenUpdater.nowInputs.KeyA = true; }
    if (e.keyCode === 87) { ScreenUpdater.nowInputs.KeyW = true; }
    if (e.keyCode === 83) { ScreenUpdater.nowInputs.KeyS = true; }
    if (e.keyCode === 68) { ScreenUpdater.nowInputs.KeyD = true; }

    ScreenUpdater.nowInputs.keyShift = e.shiftKey;

    if (e.keyCode >= 48 && e.keyCode <= 57) { oreCommon.debugKeyInt = e.keyCode - 48; }
}

function keyup(e) {
    if (e.keyCode === 65) { ScreenUpdater.nowInputs.KeyA = false; }
    if (e.keyCode === 87) { ScreenUpdater.nowInputs.KeyW = false; }
    if (e.keyCode === 83) { ScreenUpdater.nowInputs.KeyS = false; }
    if (e.keyCode === 68) { ScreenUpdater.nowInputs.KeyD = false; }

    if (e.keyCode >= 48 && e.keyCode <= 57) { oreCommon.debugKeyInt = -1; }

    if (ScreenUpdater.nowInputs.keyShift) { ScreenUpdater.nowInputs.keyShift = e.shiftKey; }

}


//////////////////////////////////////
ScreenUpdater.lineCountMax = 50;
ScreenUpdater.drawJfLine = function (_max) {
    //縦横比で大きい方/30とする
    var rctSize = Math.max(oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height) / ScreenUpdater.lineCountMax;
    oreCommon.conteText2D.lineWidth = 2;
    oreCommon.conteText2D.strokeStyle = "#005500";

    var lineCount = ScreenUpdater.scene_spanTime;

    if (_max) {
        lineCount = 999;
    } else {
        console.log('draw : %s', ScreenUpdater.scene_spanTime);
    }

    for (var i = 0; i < Math.min(lineCount, ScreenUpdater.lineCountMax); i++) {
        oreCommon.conteText2D.beginPath();
        oreCommon.conteText2D.moveTo(0, i * rctSize);
        oreCommon.conteText2D.lineTo(oreCommon.conteText2D.canvas.width, i * rctSize);
        //パスを閉じる（最後の座標から開始座標に向けてラインを引く）
        //oreCommon.conteText2D.closePath();
        //現在のパスを輪郭表示する
        oreCommon.conteText2D.stroke();
    }

    lineCount = lineCount - ScreenUpdater.lineCountMax;
    for (var i = 0; i < Math.min(lineCount, ScreenUpdater.lineCountMax); i++) {
        oreCommon.conteText2D.beginPath();
        oreCommon.conteText2D.moveTo(i * rctSize, 0);
        oreCommon.conteText2D.lineTo(i * rctSize, oreCommon.conteText2D.canvas.width);
        oreCommon.conteText2D.stroke();
    }

}


ScreenUpdater.viewBrefingMessage = function () {
    //文字を1文字ずつ時間経過で表示させる
    ScreenUpdater.msgViewKey = msg_bref[ScreenUpdater.msgView_big];
    var nowText = txt_bref[ScreenUpdater.msgViewKey];
    if (oreCommon.nowLang == 1) {
        nowText = txt_bref_e[ScreenUpdater.msgViewKey];
    }

    if (nowText == null || nowText === "") { return; }
    var nowLength = (Math.min(ScreenUpdater.scene_spanTime * 0.2, nowText.length)) ^ 0;

    //文字背景ボックス
    var widthHarf = Math.min(harf_W - 100, 320);
    oreCommon.conteText2D.globalAlpha = 1.0
    oreCommon.conteText2D.fillStyle = drawCol_Grt3;
    oreCommon.conteText2D.strokeStyle = drawCol_Gr2;
    oreCommon.conteText2D.fillRect(harf_W - widthHarf, harf_H + harf_4H, widthHarf * 2, harf_2H);

    oreCommon.conteText2D.font = "12pt Arial";
    oreCommon.conteText2D.fillStyle = 'white';
    oreCommon.conteText2D.textAlign = 'left';
    ScreenUpdater.fillTextLine(oreCommon.conteText2D, nowText.substring(0, nowLength), harf_W - widthHarf + 10, harf_H + harf_4H + 30, 1.4);

}


ScreenUpdater.viewStagegMessage = function () {
    //文字を1文字ずつ時間経過で表示させる
    var nowText = txt_stage[ScreenUpdater.msgViewKey];
    if (oreCommon.nowLang == 1) {
        nowText = txt_stage_e[ScreenUpdater.msgViewKey];
    }

    if (nowText == null || nowText === "") { return; }
    var nowLength = (Math.min(ScreenUpdater.msgView_small * 0.2, nowText.length)) ^ 0;

    if (time_stage[ScreenUpdater.msgViewKey] > ScreenUpdater.msgView_small && nowLength > 0) {

        //文字背景ボックス
        var widthHarf = Math.min(harf_W - 100, 320);
        oreCommon.conteText2D.globalAlpha = 1.0
        oreCommon.conteText2D.fillStyle = drawCol_Grt3;
        oreCommon.conteText2D.strokeStyle = drawCol_Gr2;
        oreCommon.conteText2D.fillRect(harf_W - widthHarf, harf_H + harf_4H, widthHarf * 2, harf_2H);

        //文字本体
        oreCommon.conteText2D.font = "12pt Arial";
        oreCommon.conteText2D.fillStyle = 'white';
        oreCommon.conteText2D.textAlign = 'left';
        ScreenUpdater.fillTextLine(oreCommon.conteText2D, nowText.substring(0, nowLength), harf_W - widthHarf + 10, harf_H + harf_4H + 30, 1.3);


        /*  封印・エスコン調文字表記
        oreCommon.conteText2D.font = "14pt Arial";
        oreCommon.conteText2D.fillStyle = 'white';
        oreCommon.conteText2D.textAlign = 'center';
        ScreenUpdater.fillTextLine(oreCommon.conteText2D, "《"  + nowText + "》", harf_W, harf_4H, 1.0);
        */
    }
}

//文字を切り替える＆文字IDに沿った音声を発声させる
ScreenUpdater.ViewAndPlayCV_Stage = function () {
    if (ScreenUpdater.msgView_small === 0) {
        //メッセージ切り替わり＝音声再生
        var nowText = txt_stage[ScreenUpdater.msgViewKey];
        if (nowText != null || nowText != "") {
            oreCommon.playAudio_CV(VcOjs_Stage[ScreenUpdater.msgViewKey], true);
        }
    }

    ScreenUpdater.msgView_small++;
    if (time_stage[ScreenUpdater.msgViewKey] <= ScreenUpdater.msgView_Span || (oreCommon.debugMode && ScreenUpdater.msgView_Span > 500)) {
        ScreenUpdater.msgView_big++;
        ScreenUpdater.msgView_small = 0;
        ScreenUpdater.msgView_Span = 0;
    }
}


ScreenUpdater.drawFadeOut = function () {
    var nowDraw = Math.min(ScreenUpdater.scene_spanTime, 200);
    nowDraw = nowDraw * 0.005;
    oreCommon.conteText2D.fillStyle = "rgba(0, 0, 0," + nowDraw + ")";
    oreCommon.conteText2D.fillRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);
}


ScreenUpdater.drawFadeIn = function () {
    var nowDraw = Math.min(ScreenUpdater.scene_spanTime, 200);
    nowDraw = nowDraw * 0.005;

    if (nowDraw >= 1.0) { return; }

    nowDraw = 1.0 - nowDraw;
    oreCommon.conteText2D.fillStyle = "rgba(0, 0, 0," + nowDraw + ")";
    oreCommon.conteText2D.fillRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);
}


ScreenUpdater.viewEndingScreen = function () {
    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt99;
    ScreenUpdater.initScreenMsg();
    ScreenUpdater.endingFlg = true;
    setVisible_elm('messageSkip', false);
    oreCommon.changeBGM("");
    ShowDialog('Staff');
    togulRestart(true);
    exitPointerLock();
}

//表示メッセージを初期化する(IDのみ)
ScreenUpdater.initScreenMsg = function () {
    ScreenUpdater.msgView_big = 1;
    ScreenUpdater.msgView_small = 0;
    ScreenUpdater.msgView_Span = 0;
}

///////////////////////////
ScreenUpdater.fillTextLine = function (context, _text, x, y, margin, _ifFutidori) {
    var textList = _text.split('\n');
    var lineHeight = context.measureText("□").width;
    if (margin == null || margin === 0) {
        lineHeight = lineHeight + lineHeight * 0.5;
    }
    else {
        lineHeight = lineHeight + lineHeight * margin;
    }

    textList.forEach(function (text, i) {
        if (_ifFutidori != undefined && _ifFutidori) {
            context.strokeText(text, x, y + lineHeight * i);
        }
        context.fillText(text, x, y + lineHeight * i);
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function FrameInput() {
    this.Mouse_L = false;
    this.Mouse_R = false;
    this.WheelD = 0;

    this.KeyW = false;
    this.KeyS = false;
    this.KeyA = false;
    this.KeyD = false;

    this.keyShift = false;
}

FrameInput.prototype =
    {
        copy: function (_base) {
            this.Mouse_L = _base.Mouse_L;
            this.Mouse_R = _base.Mouse_R;
            this.WheelD = _base.WheelD;

            this.KeyW = _base.KeyW;
            this.KeyS = _base.KeyS;
            this.KeyA = _base.KeyA;
            this.KeyD = _base.KeyD;

            this.keyShift = _base.keyShift;

            return this;
        },

        init: function () {
            this.Mouse_L = false;
            this.Mouse_R = false;
            this.WheelD = 0;

            this.KeyW = false;
            this.KeyS = false;
            this.KeyA = false;
            this.KeyD = false;

            this.keyShift = false;
        }

    };
