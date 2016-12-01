"use strict";



var tb_elm_j = null;
var tb_elm_e = null;

var missionList = {
  "0": ["テストステージ", "Test Stage", "Easy", "Easy", "墜落した輸送機を捜索・救助せよ", "Conbat Rescue", "true", "js/stagefile/scriptList_testStage.js"],
  "1": ["ダミーステージ", "Dummy Stage", "Hard", "Hard", "選択できまへん", "disabled test", "false", ""],
};


////////////////////////////////////
makeMissionList();

//テーブルにミッション一覧を割り当てる。スクロール?知らんな。
function makeMissionList() {
  tb_elm_j = document.getElementById("tb_missionList_j");
  tb_elm_e = document.getElementById("tb_missionList_e");

  //一度列を全削除
  for (var i = 0; i < tb_elm_j.rows.length;) {
    tb_elm_j.deleteRow(0);
    tb_elm_e.deleteRow(0);
  }

  var keys = Object.keys(missionList);
  for (var i = 0; i < keys.length; i++) {
    addMissionRow(i, 0, tb_elm_j);
    addMissionRow(i, 1, tb_elm_e);
  }

  _missionUrl = missionList[0][missionList[0].length - 1];
}

//ミッションリスト行をHTMLのTableに追加する
function addMissionRow(i, _engFlg, _table) {
  var row = _table.insertRow(-1);
  // セルの挿入
  var cell1 = row.insertCell(-1);
  var cell2 = row.insertCell(-1);
  var cell3 = row.insertCell(-1);
  // セルの内容入力
  cell1.insertAdjacentHTML("beforeend", missionList[i][0 + _engFlg]);
  cell2.insertAdjacentHTML("beforeend", missionList[i][2 + _engFlg]);
  cell3.insertAdjacentHTML("beforeend", missionList[i][4 + _engFlg]);

  if (i == 0) {
    row.classList.add('tr_mission_sel');
  } else {
    row.classList.add('tr_mission_unsel');
  }
}


//選択した行以外の色を変えたりできればいいな
function selectMissionRow(_r, _engFlg, _table) {

  if (missionList[0][missionList[_r].length - 1] == "") {
    return;
  }

  var keys = Object.keys(missionList);
  for (var i = 0; i < keys.length; i++) {
    //列の色を変える。だがどうやって。
  }

}