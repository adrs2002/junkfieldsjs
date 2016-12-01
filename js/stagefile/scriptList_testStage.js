"use strict";
var testStageScript = {};

var scriptList_TestStage = {};

//ステージロードの開始前に行われる、各種外部Jsファイル読み込み宣言。
//いわば、Include　みたいなもの。
//このファイルのおかげでページ遷移せずとも良いような想定をしているが、ThreeのScene絡みがどう動くかは未知数･･･動く保証はない！

scriptList_TestStage.loadedIncludeCount = 0;
scriptList_TestStage.loadingTargetCount = 0;

//ステージ中に使う変数も、ここでまとめて宣言するのがスマート
testStageScript.camPosAnimate = null;
testStageScript.camTargetAnimate = null;
testStageScript.EnemyPoints = [new THREE.Vector3(), new THREE.Vector3()];
testStageScript.WayPoint_V = [new THREE.Vector3(), new THREE.Vector3()];
testStageScript.alpha3WayPoints = new Array();


scriptList_TestStage.loadParam = -1;
scriptList_TestStage.loadingState = 1;


testStageScript.WayPointObj = null;
testStageScript.CarrierObj = null;
testStageScript.alpha3DestroyFlg = false;


////////////////////////////////////////////////////////

//コールバック地獄、はっじまっるよー
scriptList_TestStage.isEndInclude_1 = function() {
    scriptList_TestStage.loadedIncludeCount++;
    if (scriptList_TestStage.loadedIncludeCount >= scriptList_TestStage.loadingTargetCount && scriptList_TestStage.loadingState == 1) {
        scriptList_TestStage.loadingState = 2;

        //ここに来ただけ（DLしただけ）だと、宣言済みが安定しない？ので、保険のためTimeOutをしかける
        setTimeout(function() {
            scriptList_TestStage.loadedIncludeCount = 0;
            scriptList_TestStage.loadingTargetCount = 0;

            oreCommon.downloadScript('js/objectSetter/obj_SSR06.js', scriptList_TestStage.isEndInclude_2); scriptList_TestStage.loadingTargetCount++;
            oreCommon.downloadScript('js/objectSetter/obj_AAA1.js', scriptList_TestStage.isEndInclude_2); scriptList_TestStage.loadingTargetCount++;
            oreCommon.downloadScript('js/objectSetter/obj_AAA2.js', scriptList_TestStage.isEndInclude_2); scriptList_TestStage.loadingTargetCount++;
            oreCommon.downloadScript('js/objectSetter/obj_Track_1.js', scriptList_TestStage.isEndInclude_2); scriptList_TestStage.loadingTargetCount++;
            oreCommon.downloadScript('js/objectSetter/obj_Hover.js', scriptList_TestStage.isEndInclude_2); scriptList_TestStage.loadingTargetCount++;
            oreCommon.downloadScript('js/objectSetter/obj_BarniaObj.js', scriptList_TestStage.isEndInclude_2); scriptList_TestStage.loadingTargetCount++;
        }, 10);
    }
}

scriptList_TestStage.isEndInclude_2 = function() {
    scriptList_TestStage.loadedIncludeCount++;
    if (scriptList_TestStage.loadedIncludeCount >= scriptList_TestStage.loadingTargetCount && scriptList_TestStage.loadingState == 2 && oreCommon.BrefingScene != null) {
        scriptList_TestStage.loadingState = 3;
        setTimeout(function() {
            //3期インクルード。ステージで使うクラス（実体系）を読み込む
            scriptList_TestStage.loadedIncludeCount = 0;
            scriptList_TestStage.loadingTargetCount = 0;
            oreCommon.downloadScript('content/Message/stage_testStage.js', scriptList_TestStage.isEndInclude_3); scriptList_TestStage.loadingTargetCount++;
            oreCommon.downloadScript('js/stagefile/testStageScript.js', scriptList_TestStage.isEndInclude_3); scriptList_TestStage.loadingTargetCount++;
        }, 10);

    }
}

scriptList_TestStage.isEndInclude_3 = function() {
    scriptList_TestStage.loadedIncludeCount++;
    if (scriptList_TestStage.loadedIncludeCount >= scriptList_TestStage.loadingTargetCount && scriptList_TestStage.loadingState == 3 && testStageScript != null) {
        scriptList_TestStage.loadingState = 99;
        setTimeout(function() {
            //ここのLoadContentは、本戦用のロード。
            testStageScript.LoadContent();
            oreCommon.downloadScript('content/cv/teststage/stageCV_test.js', null);
            //ダイアログを消す(ここの部分はtitle部分のフラグにゆだねている)
            oreCommon.ChangeScene = true;
        }, 100);
    }
}

//////////////////////////////////////////////

oreCommon.ChangeScene = false;
//ブリーフィングのBGM
oreCommon.changeBGM('content/bgm_mp3/Trap.mp3');

//最初期インクルード。ベースクラスとなるモノを読み込む
oreCommon.downloadScript('content/Message/bref_testStage.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('content/cv/teststage/bref_test.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('js/stagefile/bref_testStage.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('js/clsPlayer.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('js/clsWeapon.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('js/clsCpuTink.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('js/clsEtcUnit.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('js/oreBt2dSceneCommon.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;
oreCommon.downloadScript('js/objectSetter/ObjSetter_Base.js', scriptList_TestStage.isEndInclude_1); scriptList_TestStage.loadingTargetCount++;

////////////

//シーンの進行状況管理
testStageScript.enumSceneSpan = {
    none: -1,
    brefLoading: 0,
    drawBrefing: 1,
    BrefingOut: 2,

    mainContentLoadWait: 10,

    mainContentLoadInit: 11,

    Bt00: 101,
    Bt01: 102,
    Bt02: 110,
    Bt03: 111,
    Bt04: 112,
    Bt05: 113,
    Bt06A: 114,
    Bt06B: 115,
    Bt07: 150,
    Bt07A: 151,
    Bt07B: 152,
    Bt08: 160,

    Bt99: 199,

    m_EnemyWave2: 120,
    m_EnemyWave2_bt: 121,

    m_EnemyWave3: 130,
    m_EnemyWave3_bt: 131,

    m_EnemyWave4: 140,
    m_EnemyWave4_bt: 141,


    m_EndBt: 200,

    m_EndScreen: 250,
}
