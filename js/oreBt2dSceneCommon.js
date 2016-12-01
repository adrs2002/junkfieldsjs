
"use strict";

//2Dインターフェイス描画関連。

//oreCommonとScreenUpdater、両方の宣言が終わってから宣言する。
var oreBt2DSceneCom = oreBt2DSceneCom || {};

oreBt2DSceneCom.drawWpnInfo = function (setPos, _id) {

  //武器En残量枠
  oreCommon.conteText2D.strokeRect(setPos[0] + 5, setPos[1] + harf_4H, 20, -harf_4H);

  //武器有効射程枠
  oreCommon.conteText2D.fillRect(setPos[0] - 15, setPos[1] + harf_4H, 3, -harf_4H);

  //弾数を表示
  oreCommon.conteText2D.textAlign = 'right';
  oreCommon.conteText2D.fillStyle = drawCol_Grt;
  oreCommon.conteText2D.fillRect(setPos[0] - 20, setPos[1] + harf_4H + 5, 40, 20);
  oreCommon.conteText2D.fillStyle = drawCol_Gr1;
  oreCommon.conteText2D.fillText(("  " + "999").slice(-3), setPos[0], setPos[1] + harf_4H + 20);


  //武器名表示
  oreCommon.conteText2D.textAlign = 'center';
  oreCommon.conteText2D.fillStyle = drawCol_Grt;
  oreCommon.conteText2D.fillRect(setPos[0] - 40, setPos[1] - 30, 80, 20);
  oreCommon.conteText2D.fillStyle = drawCol_Gr1;
  oreCommon.conteText2D.fillText(ScreenUpdater.players[ScreenUpdater.mainViewID].MountWeapons[_id].wpnName, setPos[0], setPos[1] - 15);

  //武器セレクタ枠
  if (_id === ScreenUpdater.players[ScreenUpdater.mainViewID].bp.currentWpnUse[0] || _id === ScreenUpdater.players[ScreenUpdater.mainViewID].bp.currentWpnUse[1]) {
    oreCommon.conteText2D.strokeRect(setPos[0] - 40, setPos[1] - 10, 80, harf_4H + 40);
  }
}



//3桁の数字を表示し、さらに□で囲む
oreBt2DSceneCom.drawNumAndRect3 = function (viewStr, setPos) {

  oreCommon.conteText2D.textAlign = 'center';
  oreCommon.conteText2D.fillStyle = drawCol_Grt;
  oreCommon.conteText2D.fillRect(setPos[0] - 20, setPos[1] - 15, 40, 20);
  oreCommon.conteText2D.fillStyle = drawCol_Gr1;
  oreCommon.conteText2D.fillText(("  " + viewStr).slice(-3), setPos[0], setPos[1]);

  oreCommon.conteText2D.strokeRect(setPos[0] - 20, setPos[1] - 15, 40, 20);
  oreCommon.conteText2D.fillStyle = drawCol_Gr2;
}

//レーダーに表示するためのXY位置を算出する。[レーダー中心からのx､y, ３D軸上での距離]　が返る
oreBt2DSceneCom.getRaderViewPos = function (_pos) {
  var f1 = 0, fx = 0, fz = 0, baseLangth = 0;
  //レーダーは高さを考慮しないので、高さはゼロで距離を再考慮する
  oreCommon.sceneCom_TempV3.copy(_pos);
  oreCommon.sceneCom_TempV3.sub(ScreenUpdater.players[ScreenUpdater.mainViewID].CenterPos);
  f1 = oreCommon.sceneCom_TempV3.length();
  oreCommon.sceneCom_TempV3.y = 0;
  var f2 = oreMath.GetDifKaku(oreCommon.sceneCom_TempV3, ScreenUpdater.RotateXY.x);
  fx = Math.sin(f2) * f1;
  fz = Math.cos(f2) * f1;
  //求めた平面座標の長さが、レーダーレンジの何％かを調べ、レーダー幅に乗算して、やっと決定
  fx = fx / ScreenUpdater.RaderRangeMax;
  fx = Math.clamp(fx, -1.0, 1.0) * RanderHeight * 0.5;
  fz = fz / ScreenUpdater.RaderRangeMax;
  fz = Math.clamp(fz, -1.0, 1.0) * RanderHeight * 0.5;

  return [fx, fz, f1];
}



oreBt2DSceneCom.drawRaderBase = function () {
  //下地
  oreCommon.conteText2D.fillStyle = drawCol_Grt;
  oreCommon.conteText2D.strokeStyle = drawCol_Gr2;
  RanderHeight = harf_2H * 0.8;
  var startPos = [harf_W + harf_2W, harf_H - harf_2H - RanderHeight];
  RaderCentPos = [startPos[0] + RanderHeight * 0.5, startPos[1] + RanderHeight * 0.5];
  oreCommon.conteText2D.fillRect(startPos[0], startPos[1], RanderHeight, RanderHeight);

  var subHeight = RanderHeight;
  var subCount = 5;
  var enDraw = 1;
  //レーダー距離用の円を表示する
  if (ScreenUpdater.RaderRangeMax > 3000) {
    ScreenUpdater.RaderRangeMax = 3000;
    subCount = 3;
    enDraw = 1;
  } else if (ScreenUpdater.RaderRangeMax > 500) {
    ScreenUpdater.RaderRangeMax = 1000;
    subCount = 4;
    enDraw = 2;
  } else {
    ScreenUpdater.RaderRangeMax = 500;
    subCount = 5;
    enDraw = 3;
  }

  subHeight /= subCount * 2;
  oreCommon.conteText2D.strokeStyle = drawCol_Gr2;
  for (var i = 1; i <= subCount; i++) {
    oreCommon.conteText2D.beginPath();
    if (enDraw === i) {
      oreCommon.conteText2D.arc(RaderCentPos[0], RaderCentPos[1], subHeight * i, 0, Math.PI * 2, false);
    } else {
      oreCommon.conteText2D.arc(RaderCentPos[0], RaderCentPos[1], subHeight * i, -KD135, -KD045, false);
    }
    oreCommon.conteText2D.stroke();
  }

  //非視界エリア
  var RaderHarf = RanderHeight * 0.5;
  oreCommon.conteText2D.fillStyle = drawCol_Grt2;
  oreCommon.conteText2D.beginPath();
  oreCommon.conteText2D.moveTo(RaderCentPos[0], RaderCentPos[1]);
  oreCommon.conteText2D.arc(RaderCentPos[0], RaderCentPos[1], RaderHarf, -KD045, -KD135, false);
  oreCommon.conteText2D.closePath();
  oreCommon.conteText2D.fill();

  //左、右、下
  oreCommon.conteText2D.fillStyle = drawCol_Gr2;
  oreCommon.conteText2D.fillRect(RaderCentPos[0] - RaderHarf, RaderCentPos[1], subHeight, 1);
  oreCommon.conteText2D.fillRect(RaderCentPos[0] + RaderHarf, RaderCentPos[1], -subHeight, 1);
  oreCommon.conteText2D.fillRect(RaderCentPos[0], RaderCentPos[1] + RaderHarf, 1, -subHeight);
}



//キャラクターをＨＵＤに表示する
oreBt2DSceneCom.viewCharactorHUD = function (_c, _distantMax, tmpEnemySort) {
  if (_c.bp.On && _c.bp.id != ScreenUpdater.mainViewID) {
    var scrPos = ScreenUpdater.SceneToScreenPos(_c.CenterPos);
    var drawed = false;
    var f1 = 0, fx = 0, fz = 0, baseLangth = 0;

    //レーダーへの表示
    if (_c.bp.groupID === ScreenUpdater.players[ScreenUpdater.mainViewID].bp.groupID) {
      oreCommon.conteText2D.strokeStyle = drawCol_Gr1;
      oreCommon.conteText2D.fillStyle = drawCol_Gr1;
    } else if (_c.bp.groupID < 10) {
      oreCommon.conteText2D.strokeStyle = drawCol_Wh1;
      oreCommon.conteText2D.fillStyle = drawCol_Wh1;
    } else {
      oreCommon.conteText2D.strokeStyle = drawCol_Yl1;
      oreCommon.conteText2D.fillStyle = drawCol_Yl1;
    }

    var raderPos = oreBt2DSceneCom.getRaderViewPos(_c.CenterPos);
    baseLangth = raderPos[2];
    if (_distantMax < baseLangth) { _distantMax = baseLangth; }

    //レーダーに描画
    oreCommon.conteText2D.fillRect(RaderCentPos[0] + raderPos[0], RaderCentPos[1] + raderPos[1], 3, 3);

    //画面へのターゲット描画
    if (scrPos[2] < 1.0) {
      if (scrPos[0] > harf_W - harf_2W - harf_4W && scrPos[0] < harf_W + harf_2W + harf_4W &&
        scrPos[1] > harf_H - harf_2H - harf_4H && scrPos[1] < harf_H + harf_2H + harf_4H) {

        //ロックソート順計算
        if (_c.bp.groupID >= 10) {
          tmpEnemySort[_c.bp.id] = Math.abs(scrPos[0] - harf_W) * 0.1 + Math.abs(scrPos[1] - harf_H) * 0.1 + baseLangth;
        }

        //画面内描画は決定。
        oreCommon.conteText2D.strokeRect(scrPos[0] - 20, scrPos[1] - 20, 40, 40); //TD-BOX
        oreCommon.conteText2D.textAlign = 'left';
        oreCommon.conteText2D.fillText(_c.bp.ViewName, scrPos[0] + 25, scrPos[1] - 10);   //名称

        //HPバー
        //下地
        oreCommon.conteText2D.fillStyle = drawCol_Rd1;
        oreCommon.conteText2D.fillRect(scrPos[0] - 20, scrPos[1] - 32, 80, 6);
        //本体
        oreCommon.conteText2D.fillStyle = drawCol_Gr1;
        f1 = _c.bp.meca_Stat_Value_f[cEnChara_ParamFloat.life] / _c.bp.meca_Stat_Const_f[cEnConsts_ParamF.life_max];
        f1 *= 80;
        oreCommon.conteText2D.fillRect(scrPos[0] - 20, scrPos[1] - 32, Math.floor(f1), 6);
        //枠線
        //oreCommon.conteText2D.strokeStyle = drawCol_Gr1;
        //oreCommon.conteText2D.strokeRect(scrPos[0] - 20, scrPos[1] - 32, 80, 6);

        //距離
        oreCommon.conteText2D.textAlign = 'center';
        oreCommon.conteText2D.fillText(Math.floor(baseLangth), scrPos[0], scrPos[1] + 32);

        if (ScreenUpdater.players[ScreenUpdater.mainViewID].bp.CullentLockTgt == _c.bp.id) {
          //MG用の近距離円描画
          if (ScreenUpdater.cam3Pow === 0) {
            ScreenUpdater.players[ScreenUpdater.mainViewID].bp.TgtView_pos.copy(_c.CenterPos);
          }
          oreCommon.conteText2D.strokeStyle = drawCol_Rd1;

          if (ScreenUpdater.players[ScreenUpdater.mainViewID].bp.currentWpnUse[0] === 1) {

            oreCommon.conteText2D.lineWidth = 1; //線の太さ
            //基本円
            oreCommon.conteText2D.beginPath();
            oreCommon.conteText2D.arc(scrPos[0], scrPos[1], 40, 0, Math.PI * 2, false);
            oreCommon.conteText2D.stroke();
            //武器の距離との割合                    
            f1 = baseLangth / ScreenUpdater.players[ScreenUpdater.mainViewID].MountWeapons[1].wpn_reng;
            oreCommon.conteText2D.lineWidth = 6; //線の太さ
            oreCommon.conteText2D.beginPath();
            oreCommon.conteText2D.arc(scrPos[0], scrPos[1], 40, -KD090, Math.PI * 2 * f1, false);
            oreCommon.conteText2D.stroke();

          }
          else { //通常武器のカーソルも、その位置に
            oreCommon.conteText2D.lineWidth = 3; //線の太さ
            oreCommon.conteText2D.beginPath();
            oreCommon.conteText2D.arc(scrPos[0] - 20, scrPos[1], 15, KD090, Math.PI + KD090, false);
            oreCommon.conteText2D.stroke();

            oreCommon.conteText2D.beginPath();
            oreCommon.conteText2D.arc(scrPos[0] + 20, scrPos[1], 15, KD090, Math.PI + KD090, true);
            oreCommon.conteText2D.stroke();
          }
        }

        oreCommon.conteText2D.strokeStyle = drawCol_Rd1;
        oreCommon.conteText2D.lineWidth = 2; //線の太さ
        for (var m = 0; m < ScreenUpdater.players[ScreenUpdater.mainViewID].bp.WpnLockedTgt.length; m++) {
          if (ScreenUpdater.players[ScreenUpdater.mainViewID].bp.WpnLockedTgt[m] == _c.bp.id) {
            //ミサイルロックボックス表示
            oreCommon.conteText2D.beginPath(); //パスの描画を始める
            oreCommon.conteText2D.moveTo(scrPos[0], scrPos[1] - 30 - m * 5); //線の開始位置 
            oreCommon.conteText2D.lineTo(scrPos[0] + 30 + m * 5, scrPos[1]);
            oreCommon.conteText2D.lineTo(scrPos[0], scrPos[1] + 30 + m * 5);
            oreCommon.conteText2D.lineTo(scrPos[0] - 30 - m * 5, scrPos[1]);
            oreCommon.conteText2D.lineTo(scrPos[0], scrPos[1] - 30 - m * 5);  //元の位置
            oreCommon.conteText2D.stroke(); //線の終了
          }
        }

        oreCommon.conteText2D.lineWidth = 1;
      }

    }
  }
  return _distantMax;
}

///////////////////////

oreBt2DSceneCom.viewDisplayInfo = function () {

  //画面中央下のインフォ
  ScreenUpdater.DisplayInfoTime--;
  ScreenUpdater.DisplayInfoTime = Math.max(ScreenUpdater.DisplayInfoTime, 0);
  if (ScreenUpdater.DisplayInfoTime > 0) {
    if (ScreenUpdater.DisplayInfoType >= cEnConsts_DisplayInfoType.infCol_b) {
      oreCommon.conteText2D.strokeStyle = drawCol_Wh1;
      oreCommon.conteText2D.fillStyle = drawCol_Bl2;

    } else if (ScreenUpdater.DisplayInfoType >= cEnConsts_DisplayInfoType.infCol_Red) {
      oreCommon.conteText2D.strokeStyle = drawCol_Rd1;
      oreCommon.conteText2D.fillStyle = drawCol_Yl2;

    } else if (ScreenUpdater.DisplayInfoType >= cEnConsts_DisplayInfoType.infCol_Y_W) {
      oreCommon.conteText2D.strokeStyle = drawCol_Wh1;
      oreCommon.conteText2D.fillStyle = drawCol_Yl2;

    } else if (ScreenUpdater.DisplayInfoType >= cEnConsts_DisplayInfoType.infCol_yel) {
      oreCommon.conteText2D.strokeStyle = drawCol_Yl1;
      oreCommon.conteText2D.fillStyle = drawCol_Gr2;
    }
    else {
      oreCommon.conteText2D.strokeStyle = drawCol_Wh1;
      oreCommon.conteText2D.fillStyle = drawCol_Gr2;
    }
    oreCommon.conteText2D.lineWidth = 2;
    oreCommon.conteText2D.globalAlpha = Math.clamp(ScreenUpdater.DisplayInfoTime * 0.03, 1.0, 0.01);
    oreCommon.conteText2D.fillRect(harf_W - harf_4W, harf_H + harf_4H * 0.5, Math.max(harf_4W, 200), 20);
    oreCommon.conteText2D.strokeRect(harf_W - harf_4W - 2, harf_H + harf_4H * 0.5 - 2, Math.max(harf_4W, 200) + 4, 24);
    oreCommon.conteText2D.globalAlpha = 1.0;
    oreCommon.conteText2D.textAlign = 'center';
    oreCommon.conteText2D.fillStyle = oreCommon.conteText2D.strokeStyle;
    oreCommon.conteText2D.fillText(ScreenUpdater.DisplayInfoText, harf_W - harf_4W + Math.max(harf_4W, 200) * 0.5, harf_H + harf_4H * 0.5 + 15);
  }

  //画面右上のミッションリスト
  //RaderCentPos = [startPos[0] + RanderHeight * 0.5, startPos[1] + RanderHeight * 0.5];
  if (ScreenUpdater.MissionInfoText.length > 0) {

    oreCommon.conteText2D.textAlign = 'left';
    oreCommon.conteText2D.fillStyle = drawCol_Wh2;
    oreCommon.conteText2D.strokeStyle = drawCol_Grt3;

    ScreenUpdater.fillTextLine(oreCommon.conteText2D, ScreenUpdater.MissionInfoText, RaderCentPos[0] + RanderHeight * 0.5 + 10, RaderCentPos[1] - RanderHeight * 0.5 + 10, 1.5, true);

    //oreCommon.conteText2D.strokeText(ScreenUpdater.MissionInfoText, RaderCentPos[0] + RanderHeight * 0.5 + 10, RaderCentPos[1] - RanderHeight * 0.5 + 10);
    //oreCommon.conteText2D.fillText(MissionInfoText, RaderCentPos[0] + RanderHeight * 0.5 + 10, RaderCentPos[1] - RanderHeight * 0.5 + 10);

  }
}

//作戦目標文章を取得する
oreBt2DSceneCom.getMissionInfoText = function (_key) {
  if (oreCommon.nowLang == 0) {
    ScreenUpdater.MissionInfoText = msg_stage[_key];
  } else {
    ScreenUpdater.MissionInfoText = msg_stage_e[_key];
  }
}

//////////////////////////////////////////////////////////

oreBt2DSceneCom.stageMainRander_2D = function () {

  var viewStr = "";
  var i = 0, f = 0, m = 0;
  //2Dhud描画

  var tmpEnemySort = [];

  oreCommon.conteText2D.clearRect(0, 0, oreCommon.conteText2D.canvas.width, oreCommon.conteText2D.canvas.height);

  oreCommon.conteText2D.strokeStyle = drawCol_Gr1;
  oreCommon.conteText2D.fillStyle = drawCol_Gr2;
  oreCommon.conteText2D.setTransform(1, 0, 0, 1, 0, 0);
  oreCommon.conteText2D.lineWidth = 1;
  oreCommon.conteText2D.font = "12pt Arial";

  //方位計
  viewStr = oreMath.LimitKakuPI2(ScreenUpdater.RotateXY.x) * 180 / Math.PI;
  viewStr = (360 - viewStr) ^ 0;
  oreBt2DSceneCom.drawNumAndRect3(viewStr, [harf_W, 50]);

  //高度
  viewStr = (ScreenUpdater.players[ScreenUpdater.mainViewID].Pos.y) ^ 0;
  oreBt2DSceneCom.drawNumAndRect3(viewStr, [harf_W + harf_2W + 80, harf_H]);

  //上昇速度  //0.25が最大と考える
  viewStr = (ScreenUpdater.players[ScreenUpdater.mainViewID].bp.vect_Y * 100) ^ 0;    //-25～+25に
  m = viewStr + 25;  //0～100に
  f = 0;
  if (m != 0) {
    f = m * 0.01;
    f = Math.min(f, 1.0);
    f = Math.max(f, 0.0);
  }
  f = (harf_2H * f) ^ 0;
  m = harf_H + (harf_4H * 0.5);
  oreBt2DSceneCom.drawNumAndRect3(viewStr, [harf_W + harf_2W, m - f]);
  oreCommon.conteText2D.fillRect(harf_W + harf_2W + 30, m, 3, -harf_2H);


  //速度
  viewStr = (ScreenUpdater.players[ScreenUpdater.mainViewID].bp.Movespeed * 40) ^ 0;
  f = 0;
  if (viewStr > 0) {
    f = viewStr * 0.01;
    f = Math.min(f, 1.0);
  }
  f = (harf_2H * f) ^ 0;
  m = harf_H + (harf_4H * 0.5);
  oreBt2DSceneCom.drawNumAndRect3(viewStr, [harf_W - harf_2W, m - f]);
  oreCommon.conteText2D.fillRect(harf_W - harf_2W - 30, m - harf_2H, 3, harf_2H);

  //En
  f = ScreenUpdater.players[ScreenUpdater.mainViewID].bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] / ScreenUpdater.players[ScreenUpdater.mainViewID].bp.meca_Stat_Const_f[cEnConsts_ParamF.gein_max];
  oreCommon.conteText2D.fillRect(harf_W - harf_2W - 80, m, 20, -harf_2H * f);

  //En枠線
  oreCommon.conteText2D.strokeRect(harf_W - harf_2W - 80, m, 20, -harf_2H);

  //射撃目標円
  if (//ScreenUpdater.players[ScreenUpdater.mainViewID].bp.currentWpnUse[0] === 0
    ScreenUpdater.viewingEnemySort.length === 0 || ScreenUpdater.cam3Pow > 0) {
    if (ScreenUpdater.cam3Pow > 0) {
      oreCommon.conteText2D.strokeStyle = drawCol_Rd1;
      oreCommon.conteText2D.lineWidth = 3;
    }
    oreCommon.conteText2D.beginPath();
    oreCommon.conteText2D.arc(harf_W - 20, harf_H, 15, KD090, Math.PI + KD090, false);
    oreCommon.conteText2D.stroke();

    oreCommon.conteText2D.beginPath();
    oreCommon.conteText2D.arc(harf_W + 20, harf_H, 15, KD090, Math.PI + KD090, true);
    oreCommon.conteText2D.stroke();
  }
  else {
    //MG用の近距離円
    //ここはHudDrawで書く
  }

  //武器情報ウィンドウ
  oreCommon.conteText2D.lineWidth = 1;
  oreCommon.conteText2D.strokeStyle = drawCol_Gr1;
  //右手
  oreBt2DSceneCom.drawWpnInfo([harf_W + harf_4W, harf_H + harf_4H + 30], 0);
  //左手
  oreBt2DSceneCom.drawWpnInfo([harf_W - harf_4W, harf_H + harf_4H + 30], 1);

  //右肩
  oreBt2DSceneCom.drawWpnInfo([harf_W + harf_4W + 100, harf_H + harf_4H + 60], 2);
  //左肩
  oreBt2DSceneCom.drawWpnInfo([harf_W - harf_4W - 100, harf_H + harf_4H + 60], 3);

  //レーダー表示
  oreBt2DSceneCom.drawRaderBase();


  //次フレームレーダーレンジ選定用に、一番遠い描画対象を探す
  var distantMax = 0;
  //敵表示
  for (var i = 0; i < ScreenUpdater.players.length; i++) {
    distantMax = oreBt2DSceneCom.viewCharactorHUD(ScreenUpdater.players[i], distantMax, tmpEnemySort);
  }
  for (var i = 0; i < ScreenUpdater.etcObject.length; i++) {
    distantMax = oreBt2DSceneCom.viewCharactorHUD(ScreenUpdater.etcObject[i], distantMax, tmpEnemySort);
  }

  oreCommon.conteText2D.strokeStyle = drawCol_Gr1;
  oreCommon.conteText2D.lineWidth = 2;
  //WayPointを描画する
  if (ScreenUpdater.players[ScreenUpdater.mainViewID].bp.CpuThink.CpuParam.WayPoints != null && ScreenUpdater.players[ScreenUpdater.mainViewID].bp.CpuThink.CpuParam.WayPoints.length > 0) {
    var scrPos = ScreenUpdater.SceneToScreenPos(ScreenUpdater.players[ScreenUpdater.mainViewID].bp.CpuThink.CpuParam.WayPoints[ScreenUpdater.mainViewID].wayPointV);
    if (scrPos[2] < 1.0) {
      //HUDへのWayPointの表示
      oreCommon.conteText2D.beginPath();
      //oreCommon.conteText2D.arc(scrPos[0] - 10, scrPos[1] - 10, 20, 0, Math.PI * 2, false);
      oreCommon.conteText2D.moveTo(scrPos[0], scrPos[1] - 15); //線の開始位置 
      oreCommon.conteText2D.lineTo(scrPos[0] + 10, scrPos[1] + 10);
      oreCommon.conteText2D.lineTo(scrPos[0] - 10, scrPos[1] + 10);
      oreCommon.conteText2D.lineTo(scrPos[0], scrPos[1] - 15);  //元の位置
      oreCommon.conteText2D.stroke(); //線の終了
    }
    //レーダーへの表示
    var RaderPos = oreBt2DSceneCom.getRaderViewPos(ScreenUpdater.players[ScreenUpdater.mainViewID].bp.CpuThink.CpuParam.WayPoints[ScreenUpdater.mainViewID].wayPointV);
    oreCommon.conteText2D.beginPath(); //パスの描画を始める
    oreCommon.conteText2D.moveTo(RaderCentPos[0] + RaderPos[0], RaderCentPos[1] + RaderPos[1] - 3); //線の開始位置 
    oreCommon.conteText2D.lineTo(RaderCentPos[0] + RaderPos[0] + 1, RaderCentPos[1] + RaderPos[1] + 1);
    oreCommon.conteText2D.lineTo(RaderCentPos[0] + RaderPos[0] - 1, RaderCentPos[1] + RaderPos[1] + 1);
    oreCommon.conteText2D.lineTo(RaderCentPos[0] + RaderPos[0], RaderCentPos[1] + RaderPos[1] - 2);  //元の位置
    oreCommon.conteText2D.stroke(); //線の終了
    if (distantMax < RaderPos[2]) { distantMax = RaderPos[2]; }
  }

  /////////////////////
  if (stageRender_2D != null) { stageRender_2D(); }

  //レーダーレンジの最大距離は、１つ前フレームの値を使用することになる。まぁ大差はない。
  ScreenUpdater.RaderRangeMax = distantMax * 1.1;
  ScreenUpdater.RaderRangeMax = Math.max(ScreenUpdater.RaderRangeMax, ScreenUpdater.Rader_Min);
  //ロックオンソート順計算
  ScreenUpdater.viewingEnemySort = [];
  var tgtkeys = Object.keys(tmpEnemySort);
  for (var i = 0; i < tgtkeys.length; i++) {
    var nowDist = tmpEnemySort[tgtkeys[i]];
    var added = false;
    for (var m = 0; m < ScreenUpdater.viewingEnemySort.length; m++) {
      if (tmpEnemySort[tgtkeys[i]] < tmpEnemySort[ScreenUpdater.viewingEnemySort[m]]) {
        ScreenUpdater.viewingEnemySort.splice(m, 0, tgtkeys[i]);
        added = true;
        break;
      }
    }
    if (ScreenUpdater.viewingEnemySort.length === 0 || !added) { ScreenUpdater.viewingEnemySort.push(tgtkeys[i]); }
  }

  //プレイヤ－１のロック順を作成する
  ScreenUpdater.players[ScreenUpdater.mainViewID].bp.Lock_Tgt = [];
  if (ScreenUpdater.viewingEnemySort.length > 0) {
    ScreenUpdater.players[ScreenUpdater.mainViewID].bp.tgtLength = tmpEnemySort[ScreenUpdater.viewingEnemySort[0]];
    for (var i = 0; i < ScreenUpdater.viewingEnemySort.length; i++) {
      ScreenUpdater.players[ScreenUpdater.mainViewID].bp.Lock_Tgt.push(ScreenUpdater.viewingEnemySort[i]);
      if (oreCommon.debugMode) {
        oreCommon.conteText2D.fillText(ScreenUpdater.viewingEnemySort[i], 0, (i + 1) * 10);
      }
    }
    ScreenUpdater.players[ScreenUpdater.mainViewID].bp.CullentLockTgt = ScreenUpdater.players[ScreenUpdater.mainViewID].bp.Lock_Tgt[0];
  } else {
    ScreenUpdater.players[ScreenUpdater.mainViewID].bp.tgtLength = 0;
    ScreenUpdater.players[ScreenUpdater.mainViewID].bp.CullentLockTgt = -1;
  }

  //1行インフォ(HUD中央下)
  oreBt2DSceneCom.viewDisplayInfo();

  //達成時インフォ
  viewBigInfoText();
}
