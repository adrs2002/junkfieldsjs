
"use strict";

var titleImage = null;
var titleImage_B = null;

var beginBrefScreen = false;

var beginDetectStart = 0;

function beginStageInit_Master() {
    //タイトル画面表示のためのシーン
    threeComps.scene = null;
    beginDetectStart = 0;
    oreCommon.beginFlg = false;

    if (oreCommon.canvas3D == null) { }

    oreCommon.canvas3D.style.visibility = "hidden";

    ScreenUpdater.NowScene = new ScreenUpdater.UpdaterBase();

    titleImage = new Image();
    titleImage.src = "content/Junk_title.png";

    titleImage_B = new Image();
    titleImage_B.src = "content/title_Back.jpg";

    ScreenUpdater.NowScene.Update = function () { titleScreenUpdater(); };
    ScreenUpdater.NowScene.Render_2D = function () { titleScreenRender(); };
    ScreenUpdater.NowScene.Render3D = function () { nullRender(); };
    oreCommon.setEvent_Load();

    ScreenUpdater.msgView_big = 0;
    ScreenUpdater.msgView_small = 0;
}



function titleScreenUpdater() {

    if (oreCommon.beginFlg && beginDetectStart == 0) {
        //ダウンロード開始
        ThreeSceneInit();
        oreCommon.BrefingScene = null;
        oreCommon.BrefingScene = {};

        oreCommon.downloadScript('js/stagefile/scriptList_testStage.js', null);
        beginDetectStart = Date.now() - 1;
        ScreenUpdater.scene_spanTime = 1;
    }

    if (oreCommon.beginFlg && beginDetectStart > 1) {
        if (Math.max(1.0 - ScreenUpdater.scene_spanTime * 0.0005, 0) <= 0 && oreCommon.ChangeScene && cv_bref_load && oreCommon.BrefingScene != null && msg_bref != null) {
            //ブリーフィング開始判断
            oreCommon.resizeWindow();
            oreCommon.ChangeScene = false;
            ScreenUpdater.msgView_big = 0;
            ScreenUpdater.scene_spanTime = 0;
            ScreenUpdater.NowScene.Update = function () { oreCommon.BrefingScene.BrefUpdater(); };
            ScreenUpdater.NowScene.Render_2D = function () { oreCommon.BrefingScene.BrefingRender(); };
            ScreenUpdater.NowScene.Render3D = function () { nullRender(); };
            oreCommon.setEvent_Bref();
        }
    }
}

function titleScreenRender() {
    oreCommon.conteText2D.clearRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);
    oreCommon.conteText2D.fillStyle = "rgb(0, 0, 0)";
    oreCommon.conteText2D.fillRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);

    //縦横比を守り、中央に表示
    var nowPos = [0, 0, 0, 0];
    //縦は、画面の縦で決定
    nowPos[3] = oreCommon.conteText2D.canvas.height;
    //横の大きさを、縦から計算
    nowPos[2] = titleImage_B.width * (nowPos[3] / titleImage_B.height);
    //中央に表示させるため、その半分の値を算出
    nowPos[0] = (oreCommon.conteText2D.canvas.width * 0.5) - (nowPos[2] * 0.5);

    if (oreCommon.beginFlg) {
        oreCommon.conteText2D.globalAlpha = Math.max(1.0 - ScreenUpdater.scene_spanTime * 0.0005, 0);
    }
    oreCommon.conteText2D.drawImage(titleImage_B, nowPos[0], nowPos[1], nowPos[2], nowPos[3]);


    nowPos[3] = titleImage.height;
    //横の大きさを、縦から計算
    nowPos[2] = titleImage.width;
    //中央に表示させるため、その半分の値を算出
    nowPos[0] = (oreCommon.conteText2D.canvas.width * 0.5) - (titleImage.width * 0.5);
    nowPos[1] = (oreCommon.conteText2D.canvas.height * 0.5) - (titleImage.height * 0.5) - 100;

    if (!oreCommon.beginFlg) {
        oreCommon.conteText2D.globalAlpha = Math.min(ScreenUpdater.scene_spanTime * 0.0005, 1.0);
    }

    oreCommon.conteText2D.drawImage(titleImage, nowPos[0], nowPos[1], nowPos[2], nowPos[3]);

    oreCommon.conteText2D.globalAlpha = 1.0;

    oreCommon.conteText2D.font = "11pt Arial";
    oreCommon.conteText2D.fillStyle = 'white';
    oreCommon.conteText2D.textAlign = 'left';
    //oreCommon.conteText2D.fillText('title', 100, 100);

}
//////////////////////////
