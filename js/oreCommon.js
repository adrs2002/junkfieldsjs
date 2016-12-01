"use strict";


//どんなサイトでも使えそうな俺関数をまとめたやつ。俺コモン。使用自由。動作保証なし！
var oreCommon = {};

oreCommon.debugMode = false;
oreCommon.isGameCleared = false;
oreCommon.nowLang = 0;
oreCommon.debugKeyInt = -1;
oreCommon.LastDateTime = null;

oreCommon.dulTime = null;
oreCommon.LastDateTIme_amime = null;
oreCommon.dulTime_anime = null;

oreCommon.loadEndCount = 0;
oreCommon.loadContentCount = 0;

oreCommon.canvas3D = null;
oreCommon.contentDiv = null;
oreCommon.canvas2D = null;
oreCommon.conteText2D = null;
oreCommon.ChangeScene = false;

oreCommon.heightObject = null;
oreCommon.beginFlg = false;
oreCommon.groundOBject = null;
oreCommon.skyBallObject = null;
oreCommon.PauseFlg = false;

oreCommon.cotentEndLoad = false;

oreCommon.AddBillTex = null;
oreCommon.AlpBillTex = null;
oreCommon.igeo = null;
oreCommon.igeo_alp = null;
oreCommon.igeo_tama = null;
oreCommon.igeo_obj = null;

oreMath.rotateAxisY = new THREE.Vector3(0, 1, 0).normalize();
oreMath.rotateAxisX = new THREE.Vector3(1, 0, 0).normalize();

//マップの広さの倍率。
oreCommon.groundMapSize = 1.5;
oreCommon.isMapMoveLimit = false;
oreCommon.MapMoveLimit = 750.0;
oreCommon.MapMoveLimitCenter = new THREE.Vector3(0, 0, 0);

//１メソッド内の使い捨て変数。いちいちnewするよりidentityのほうが早いと思ってね…実際どうなんだろ
oreCommon.sceneCom_TempV3 = new THREE.Vector3();
oreCommon.sceneCom_TempV3_2 = new THREE.Vector3();
oreCommon.sceneCom_TempV3_3 = new THREE.Vector3();
oreCommon.v1 = new THREE.Vector3();
oreCommon.v2 = new THREE.Vector3();
oreCommon.tempQ_Y = new THREE.Quaternion();
oreCommon.tempQ_X = new THREE.Quaternion();
oreCommon.sceneCom_TempQ1 = new THREE.Quaternion();
oreCommon.sceneCom_TempQ2 = new THREE.Quaternion();

var cv_bref_load = false;

oreCommon.BrefingScene = null;  //このブリーフィングシーンは、全ブリーフィング共通で使われる（その都度初期化される）設計

oreCommon.canPlayCommonCV = false;  //共用攻撃時CVを再生していいかどうかのフラグ

///共通で必要なものの初期化
oreCommon.commonInit = function () {

    oreCommon.LastDateTime = Date.now();
    oreCommon.contentDiv = document.getElementById('contents');
    oreCommon.canvas3D = document.getElementById('canvase3d');
    oreCommon.canvas3D.style.visibility = "hidden";
    //document.body.appendChild(oreCommon.canvas3D);

    XfileLoader_IsUvYReverse = true;
    XfileLoader_IsPosZReverse = true;

    oreCommon.canvas2D = document.getElementById('canvase2d');
    oreCommon.conteText2D = oreCommon.canvas2D.getContext("2d");
    oreCommon.canvas2D.oncontextmenu = onContextMenu;

    ////////////
    oreCommon.resizeWindow();

    oreCommon.animate();
    ScreenUpdater.UpdaterBase();

    //開始チェック
    //BeginChecker();
}

//Three.jsに関連するものの初期化
function ThreeSceneInit() {

    oreCommon.canvas3D.style.visibility = "visible";
    while (oreCommon.canvas3D.firstChild) {
        oreCommon.canvas3D.removeChild(oreCommon.canvas3D.firstChild);
    }

    threeComps.init();
    oreCommon.resizeWindow();

}


//最低限コンテンツ読み込み完了＆開始可能判断。
function BeginChecker() {
    if (cv_bref_load != null && oreCommon.heightObject != null) {
        document.getElementById("beginButton").style.visibility = "visible";
        changeLang(0);
    } else {
        setTimeout(BeginChecker, ScreenUpdater.frameTime);
    }
}


oreCommon.SetGroundFixPoint = function (_v, _scale, _zReverse) {
    oreCommon.sceneCom_TempV3.copy(_v);

    oreCommon.sceneCom_TempV3.y = oreCommon.GetPosHeight(oreCommon.sceneCom_TempV3);

    if (_scale != null) {
        oreCommon.sceneCom_TempV3.x *= _scale; oreCommon.sceneCom_TempV3.y *= _scale; oreCommon.sceneCom_TempV3.z *= _scale;
    }
    /*
        if (_zReverse != null && _zReverse) {
            oreCommon.sceneCom_TempV3.x *= -1;
            //oreCommon.sceneCom_TempV3.z *= -1;
        }
    */
    return oreCommon.sceneCom_TempV3;
}

///グラフィック要素の更新
oreCommon.animate = function () {

    requestAnimationFrame(oreCommon.animate);

    if (stats != null) { stats.update(); }

    oreCommon.render();
}

///グラフィック要素の更新
oreCommon.render = function () {

    if (ScreenUpdater.NowScene != null) {

        var nowTime = Date.now();
        oreCommon.dulTime_anime = nowTime - oreCommon.LastDateTIme_amime;
        oreCommon.LastDateTIme_amime = nowTime;

        if (oreCommon.PauseFlg) { return; }

        if (threeComps.scene != null) {

            threeComps.renderer.clear(true, true, true);

            //個別3Dグラフィックセット
            ScreenUpdater.NowScene.Render3D();
            //three.jsによるレンダー
            //背景のレンダ
            //threeComps.renderer.render(threeComps.scene_back, threeComps.camera_back);

            //threeComps.renderer.render(threeComps.scene, threeComps.camera);
            //threeComps.renderer.toneMappingExposure = Math.pow(threeComps.params.exposure, 4.0);
            threeComps.composer.render();
        }

        //個別2Dグラフィックセット
        ScreenUpdater.NowScene.Render_2D();
    }

}

//右クリックで何も起きないようにする
function onContextMenu() {
    return false;
}

oreCommon.nowClickEvent = null;
oreCommon.nowMouseMoveEvent = null;
oreCommon.nowMouseDownEvent = null;
oreCommon.nowMouseUpEvent = null;
oreCommon.nowKeydownEvent = null;
oreCommon.nowKeyUpEvent = null;

function RemoveAllEvents() {
    oreCommon.canvas2D.removeEventListener('click', oreCommon.nowClickEvent, false);
    document.removeEventListener('mousemove', oreCommon.nowMouseMoveEvent, false);
    document.removeEventListener('mousedown', oreCommon.nowMouseDownEvent, false);
    document.removeEventListener('mouseup', oreCommon.nowMouseUpEvent, false);
    document.removeEventListener('keydown', oreCommon.nowKeydownEvent, false);
    document.removeEventListener('keyup', oreCommon.nowKeyUpEvent, false);
}

oreCommon.setEvent_Bref = function () {
    //イベントリスナーを消去
    RemoveAllEvents();

    //追加
    oreCommon.nowClickEvent = function () { oreCommon.MessageClickEvent() };
    oreCommon.canvas2D.addEventListener("click", oreCommon.nowClickEvent, false);

    oreCommon.nowMouseUpEvent = function () { oreCommon.MessageMouseUp() };
    document.addEventListener("mouseup", oreCommon.nowMouseUpEvent, false);
}

//マウスクリックでメッセージを最後まで表示させる
oreCommon.MessageClickEvent = function () {
    if (oreCommon.PauseFlg) { return; }

    if (ScreenUpdater.msgView_big > 0) {
        if (msg_bref[ScreenUpdater.msgView_big] != null && msg_bref[ScreenUpdater.msgView_big].length != null && ScreenUpdater.scene_spanTime > msg_bref[ScreenUpdater.msgView_big].length) {
            ScreenUpdater.msgView_big++;
            ScreenUpdater.scene_spanTime = 0;
            //CV再生
            if (cv_bref_load != null) {
                oreCommon.playAudio_CV(VcOjs_bref[msg_bref[ScreenUpdater.msgView_big]], true);
            }

        } else {
            ScreenUpdater.scene_spanTime = 9999;
        }
    } else {
        if (ScreenUpdater.scene_spanTime > 1500) { ScreenUpdater.msgView_big++; }
    }
}

oreCommon.MessageMouseUp = function () {
    oreCommon.MessageClickEvent();
}


oreCommon.setEvent_Load = function () {
    //イベントリスナーを消去
    RemoveAllEvents();
}


oreCommon.UsingWpnShift = false;
if (window.WheelEvent) {
    // ------------------------------------------------------------
    // ホイールを操作すると実行されるイベント
    // ------------------------------------------------------------
    window.addEventListener("wheel", function (e) {
        oreCommon.UsingWpnShift = !oreCommon.UsingWpnShift;
    });
}

/////////////


/////////////

oreCommon.lastPlayAudio_CV = [null, null];
oreCommon.voiceTogl = 0;

//キャラの音声を同時に発声されない制御を含めた再生
oreCommon.playAudio_CV = function (_audio, _flg) {

    //if (_flg == "1") {
    if (_flg) {
        //トグル封印中
        oreCommon.voiceTogl = 0;

        try {
            if (oreCommon.lastPlayAudio_CV != null && oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl] != null) {
                oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl].pause();
                oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl].currentTime = 0;  // 再生位置を0秒にする
                oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl] = null;
            }
        } catch (e) {
        }


        if (_audio == null || _audio == undefined) { return; }

        try {
            //ChangeTogl_CV();
            oreCommon.voiceTogl = 0;
            oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl] = new Audio(_audio);
            //oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl].currentTime = 0;  // 再生位置を0秒にする
            oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl].volume = oreCommon.vol_CV;
            oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl].play();

        } catch (e) {
            //ぐしゃっと握りつぶす。よくあることさ
            var errstr = e.message;
        }

    }
}

oreCommon.volumeDistant_Max = 500;   //この距離以降なら、音声が最低になる距離

//ステージ内効果音再生（距離によって音量を変えるようにする想定
oreCommon.playStageSE = function (_audioStr, _pos, _isPlayer) {
    oreCommon.sceneCom_TempV3.copy(_pos);
    oreCommon.sceneCom_TempV3.sub(ScreenUpdater.players[ScreenUpdater.mainViewID].CenterPos);
    var distF = oreCommon.sceneCom_TempV3.length();
    //発音したのがメインプレイヤーじゃない場合、音量の最大値を下げるようにする
    if (_isPlayer !== undefined && !_isPlayer) { distF += oreCommon.volumeDistant_Max * 0.5; }
    //distFに、距離による効果音倍率をかける。
    if (distF > 0) {
        distF = distF / oreCommon.volumeDistant_Max;
        distF = Math.clamp(distF, 0.01, 0.99);
        distF = 1.0 - distF;
    } else { distF = 1.0; }
    //左右振りとか出来るのかねぇ･･･
    oreCommon.PlayCommonSound(_audioStr, distF);
}

oreCommon.PlayCommonSound = function (_soundStr, val) {
    //音量調整とかあったらココ

    //var nowT = Date.now();
    oreCommon.playAudio(CommonSounds[_soundStr], val, oreCommon.vol_SE);
    //seTime.push(Date.now() - nowT);
}

//var seTime = new Array();

//CVではなく、重ねて再生してOKなサウンド再生
oreCommon.vol_SE = 1.0;
oreCommon.vol_CV = 1.0;
oreCommon.commonAudioToglID = 0;
oreCommon.commonAudioToglArray = [null, null, null, null, null];

oreCommon.playAudio = function (_audio, val, masterV) {
    if (_audio == null || _audio == undefined) { return; }
    /*
    var cmAudio = new Audio(_audio);
    cmAudio.volume = val * masterV;
    cmAudio.play();*/

    var tgtVol = val * masterV;
    if (tgtVol < 0.1) { return; }   //小さすぎる場合は、再生しない

    oreCommon.commonAudioToglID++;
    if (oreCommon.commonAudioToglID >= 5) { oreCommon.commonAudioToglID = 0; }
    try {
        if (oreCommon.commonAudioToglArray[oreCommon.commonAudioToglID] != null) {
            oreCommon.commonAudioToglArray[oreCommon.commonAudioToglID].pause();
            oreCommon.commonAudioToglArray[oreCommon.commonAudioToglID].currentTime = 0;  // 再生位置を0秒にする
            oreCommon.commonAudioToglArray[oreCommon.commonAudioToglID] = null;
        }
    } catch (e) {
        //ぐしゃっと握りつぶす。よくあることさ
        var errstr = e.message;
    }

    try {
        oreCommon.commonAudioToglArray[oreCommon.commonAudioToglID] = new Audio(_audio);
        //oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl].currentTime = 0;  // 再生位置を0秒にする
        oreCommon.commonAudioToglArray[oreCommon.commonAudioToglID].volume = tgtVol;
        oreCommon.commonAudioToglArray[oreCommon.commonAudioToglID].play();
    } catch (e) {
        //ぐしゃっと握りつぶす。よくあることさ
        var errstr = e.message;
    }

}

oreCommon.nowBGM = null;
oreCommon.vol_BGM = 1.0;
oreCommon.changeBGM = function (file) {
    if (oreCommon.nowBGM != null) {
        oreCommon.nowBGM.pause();
    }

    if (file != null && file.length > 0) {
        oreCommon.nowBGM = new Audio(file);
        oreCommon.nowBGM.loop = true;
        oreCommon.nowBGM.volume = oreCommon.vol_BGM;
        oreCommon.nowBGM.play();
    }
}

oreCommon.CommonCV_interval =0;

oreCommon.PlayCommonCV = function (_playerId, cvType) {
    if (!oreCommon.canPlayCommonCV || !cv_Cpmmon_a_load || oreCommon.CommonCV_interval < 1000) { return; }

    if(Math.random() < 0.6){return;}

    var voiceID = "";
    switch (cvType) {
        case cEn_CommonVoiceType.Rw_normal:
            switch (_playerId) {
                case 0:
                    voiceID = "p1_atk_" + oreMath.GetRamdomParInt(2);
                    break;
                case 1:
                    voiceID = "p2_atk_0"; // + oreMath.GetRamdomParInt(5);
                    break;
            }
            break;

        case cEn_CommonVoiceType.Lw_nowmal:
            switch (_playerId) {
                case 0:
                    voiceID = "p1_atk_L_" + oreMath.GetRamdomParInt(2);
                    break;
                case 1:
                    voiceID = "p2_atk_L_";  + oreMath.GetRamdomParInt(3);
                    break;
            }
            break;
    }

    if (voiceID != "" && VcOjs_Cpmmon_a[voiceID] != null) {
        oreCommon.playAudio_CV(VcOjs_Cpmmon_a[voiceID], true);
        oreCommon.CommonCV_interval =0;
    }
}





oreCommon.setAudioVolume = function (obj, val) {
    if (obj != null) {
        obj.volume = val;
    }
}

//ボリューム変更
oreCommon.changeVolumeBase = function (_value, _type) {
    switch (_type) {
        case 'cv': oreCommon.vol_CV = _value;
            if (oreCommon.lastPlayAudio_CV != undefined && oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl] != undefined) {
                oreCommon.setAudioVolume(oreCommon.lastPlayAudio_CV[oreCommon.voiceTogl], oreCommon.vol_CV);
            }
            break;
        case 'se': oreCommon.vol_SE = _value; break;  //SEは1度発声するとオブジェクトを取っていないため、後から取得できない。まぁ短い音だし･･･
        case 'bgm': oreCommon.vol_BGM = _value;
            oreCommon.setAudioVolume(oreCommon.nowBGM, oreCommon.vol_BGM);
            break;
    }
}

//////////////////////////////////////////


//画面サイズの変更
oreCommon.resizeWindow = function () {

    var rect = oreCommon.contentDiv.getBoundingClientRect();
    var nowHeight = (window.innerHeight - 200);

    //描画canvasサイズを全て再計算
    oreCommon.canvas3D.style.left = rect.left + 'px';
    oreCommon.canvas3D.style.top = rect.top + 'px';
    oreCommon.canvas3D.style.width = rect.width + 'px';
    oreCommon.canvas3D.style.height = nowHeight + 'px';

    oreCommon.canvas2D.style.left = rect.left + 'px';
    oreCommon.canvas2D.style.top = rect.top + 'px';
    oreCommon.canvas2D.style.width = rect.width + 'px';
    oreCommon.canvas2D.style.height = nowHeight + 'px';

    oreCommon.conteText2D.canvas.width = rect.width;
    oreCommon.conteText2D.canvas.height = nowHeight;

    //アス比も全て再計算
    if (threeComps.camera != null) {
        threeComps.camera.aspect = rect.width / nowHeight;
        threeComps.camera.updateProjectionMatrix();

        threeComps.camera_back.aspect = rect.width / nowHeight;
        threeComps.camera_back.updateProjectionMatrix();
    }

    if (threeComps.renderer != null) {
        //Three.jsの画面描画のサイズ変更がコレ・・・だけど、threeComps.composer使ってるからコレ意味ないかも？
        threeComps.renderer.setSize(rect.width, nowHeight);

        //Three.jsのブルーム処理プラグインでの画面サイズ再計算
        if (threeComps.effectFXAA != null) {
            threeComps.effectFXAA.uniforms['resolution'].value.set(1 / oreCommon.conteText2D.canvas.width, 1 / oreCommon.conteText2D.canvas.height);
        }
        if (threeComps.bloomPass != null) {
            threeComps.bloomPass.setSize(oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);
        }
        if (threeComps.composer != null) {
            threeComps.composer.setSize(oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);
        }
    }

}


///////////////////
//////////////////  どっかから持ってきた系
/////////////////

oreCommon.downloadScript = function (src, callback) {
    var done = false;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = src;
    head.appendChild(script);
    script.onload = function () {
        if (!done && (!this.readyState ||
            this.readyState == "loaded" || this.readyState == "complete")) {
            done = true;
            if (callback != undefined) { callback(); }
        }
    };
}


////////////////
///指定位置の高さを返す
oreCommon.GetPosHeight = function (_pos) {
    var L_temp_Y = -9999;
    if (oreCommon.heightObject != null) {
        var baseV = new THREE.Vector3();
        baseV.y = -1;
        var C_pos = new THREE.Vector3();
        C_pos.copy(_pos);
        C_pos.y = 10000;
        var ray = new THREE.Raycaster(C_pos, baseV.normalize());
        // 交差判定
        var objs = ray.intersectObject(oreCommon.heightObject);

        //シーン全体を対象とする場合は第二引数にtrueを指定してこんな感じに。その時は複数当たると配列で帰ってくるので、「一番近い点」にするのを忘れないことだ
        //var objs = ray.intersectObjects(scene.children, true);
        for (var i = 0; i < objs.length; i++) {
            L_temp_Y = objs[0].point.y;
        }
    }
    return L_temp_Y;
}



//DOMの子要素を末代に至るまで徹底的に殺す
oreCommon.kill_matsudai = function (elem) {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
}

/////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////
//ファイルが読み込まれると同時に実行される。そのため、「ファイル内のメソッド」を呼びたいなら、最後に置くのが吉。
oreCommon.commonInit();

///////////////////////////////////////////////////////////
var queue_sizing = null; // キューをストック
var queue_sizing_wait = 200; // 0.3秒後に実行の場合 。これ無いと頻繁に走って大変。
window.addEventListener('resize', function () {
    // イベント発生の都度、キューをキャンセル 
    clearTimeout(queue_sizing);
    queue_sizing = setTimeout(function () {
        if (oreCommon != null) { oreCommon.resizeWindow(); }
    }, queue_sizing_wait);
}, false);


////////////////////////////////////////
//どこからでも参照したい軽クラス的な。増えたらファイルを分けるさ…
/// <summary>
/// ウェイポイントの種類を表す
/// </summary>
var cEnCpuWayPointID =
    {
        /// <summary>経由地。移動が主目的(急がない)</summary>
        Navi_w: 1,
        /// <summary>経由地。移動が主目的(急ぐ)</summary>
        Navi_d: 2,
        /// <summary>経由地。移動が主目的(戦闘はする)</summary>
        //Navi_AT,
        /// <summary>停滞地。ウェイポイントから離れすぎないように戦闘する</summary>
        capPoint: 3,
        /// <summary>自由目的地。ウェイポイントを無視して自由な距離で戦闘する</summary>
        free: 10,
        /// <summary>何か目的が発生するまで何もしないでとどまる</summary>
        stay: 99,
    }

/// <summary>
/// ウェイポイント用パラメータ
/// </summary>
var strWayPointParam = function () {
    /// <summary>ウェイポイントタイプID </summary>
    this.waypointType = cEnCpuWayPointID.Navi_w;
    /// <summary>ウェイポイントの場所</summary>
    this.wayPointV = new THREE.Vector3;
    /// <summary>とどまる時間(フレーム)</summary>
    this.StayTime = 0;
}
