//"use strict";

var _missionUrl = "";

function beginPointerLock() {
  if (ScreenUpdater.endingFlg) { return; }

  try {
    var body = document.body;
    body.requestPointerLock = body.requestPointerLock || body.mozRequestPointerLock || body.webkitRequestPointerLock;
    body.requestPointerLock();
  } catch (ex) { }
}

function exitPointerLock() {
  try {
    var body = document.body;
    body.exitPointerLock = body.exitPointerLock || body.mozExitPointerLock || body.webkitExitPointerLock;
    body.exitPointerLock();
  } catch (ex) {

  }
}



//言語変更
function changeLang(_flg) {
  if (_flg == undefined || _flg == -1) {
    oreCommon.nowLang += 1;
    if (oreCommon.nowLang > 1) { oreCommon.nowLang = 0; }
  }
  else {
    oreCommon.nowLang = _flg;
  }

  //ボタンの色変更
  setEnable_Btn('langbtn_jp', _flg === 0);
  setEnable_Btn('langbtn_jp2', _flg === 0);

  setEnable_Btn('langbtn_en', _flg === 1);
  setEnable_Btn('langbtn_en2', _flg === 1);

  //要素の表示：非表示
  //チュートリアルテーブル
  setDisplay_elm('tb_tu_j', _flg === 0);
  setDisplay_elm('tb_tu_e', _flg === 1);

  setDisplay_elm('tb_tu2_j', _flg === 0);
  setDisplay_elm('tb_tu2_e', _flg === 1);
  //ミッションテーブル
  setDisplay_elm('tb_missionList_j', _flg === 0);
  setDisplay_elm('tb_missionList_e', _flg === 1);
  setDisplay_elm('launch_j', _flg === 0);
  setDisplay_elm('launch_e', _flg === 1);

}

//ボタンの選択/非選択のクラス指定切り替え
function setEnable_Btn(_id, _flg) {
  var elm = document.getElementById(_id);
  if (elm == null) { return; }

  if (_flg) {
    elm.className = 'select';
  } else {
    elm.className = '';
  }
}

//要素の表示/非表示切り替え（display要素)
function setDisplay_elm(_id, _flg) {
  if (_flg) {
    document.getElementById(_id).style.display = "";
  } else {
    document.getElementById(_id).style.display = "none";
  }
}

//要素の表示/非表示切り替え（Visible要素)
function setVisible_elm(_id, _flg) {
  if (_flg) {
    document.getElementById(_id).style.visibility = "visible";
  } else {
    document.getElementById(_id).style.visibility = "hidden";
  }
}


//ガチスタート
function start_mission() {
  closeDialog('mission');
  setDisplay_elm("beginButton", false);
  if (!oreCommon.beginFlg) {
    //document.getElementById("beginButton").style.visibility = "hidden";
    oreCommon.beginFlg = true;
    document.getElementById("pinterLockUse").style.visibility = "visible";
    oreCommon.downloadScript(_missionUrl, null);
  }
}

function messageSkip() {
  ScreenUpdater.nowSceneID = ScreenUpdater.NextSceneID;
  ScreenUpdater.initScreenMsg();
  ScreenUpdater.viewEndingScreen();
}

//プレイ可能ミッションリストをDLする。
function getMissionList() {
  oreCommon.beginFlg = false;
  oreCommon.downloadScript('js/missionlist.js', null);
  ShowDialog('mission');
}

function game_Restart() {
  testStageScript.stageInit_reStart();
  setDisplay_elm("closediv_restart", false);
  closeDialog('Staff');
}

function game_end() {
  masterInitting();
  closeDialog('Staff');
}

function closeDialog(_dialog) {
  setDisplay_elm("dialogback", false);
  setDisplay_elm("dialog_" + _dialog, false);
  /*
            document.getElementById().style.display = "none";
            document.getElementById(.style.display = "none";
  */
  document.getElementById("dialog_" + _dialog).className = '';
  document.getElementById("dialogBody_" + _dialog).className = '';

  oreCommon.PauseFlg = false;
}

function ShowDialog(_dialog) {
  setDisplay_elm("dialogback", true);
  setDisplay_elm("dialog_" + _dialog, true);

  document.getElementById("dialog_" + _dialog).className = 'active';
  document.getElementById("dialogBody_" + _dialog).className = 'active';
  oreCommon.PauseFlg = true;
}

function togulRestart(_isEnding) {

  setDisplay_elm("closediv_restart", _isEnding);
  setDisplay_elm("closediv_staff", !_isEnding);
  setDisplay_elm("beginButton", !_isEnding);
  /*
            if(_isEnding){
              document.getElementById("closediv_restart").style.display = "inherit";
              document.getElementById("closediv_staff").style.display = "none";
              document.getElementById("beginButton").style.display = "none";
            }else{
              document.getElementById("beginButton").style.display = "inherit";
              document.getElementById("closediv_staff").style.display = "inherit";
              document.getElementById("closediv_restart").style.display = "none";
            }
  */
}

function masterInitting() {
  try {
    if (testStageScript != null) {
      testStageScript = {};
      delete testStageScript; //strictモードがOnだと、 deleteできないんだってさ…うーん微妙（まぁこのdeleteにどのくらいの意味があるか…
    }
  } catch (e) { }

  try {
    threeComps.destructor();
  } catch (e) { }

  togulRestart(false);
  beginStageInit_Master();
}

///////////////////////////
