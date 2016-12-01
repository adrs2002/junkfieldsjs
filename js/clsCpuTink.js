"use strict";

/// <summary>
/// CPU思考種別・距離
/// </summary>
var cEnCPUThinkID_Dist =
    {
        /// <summary>動かない</summary>
        notset: 0,
        /// <summary>基本。Out～Midの中間 </summary>
        basic: 1,
        /// <summary>アウトレンジ（一番遠い</summary>
        Out: 2,
        Mid: 3,
        Col: 4,
        /// <summary>武器によって変える・ちょっと頭いい</summary>
        byWpn: 5,
        /// <summary>特定ルート上を巡回する</summary>
        root: 6,

        maxval: 7,
    }

/// <summary>
/// ＣＰＵのタイプを表す
/// </summary>
var cEnCPUTypeID =
    {
        /// <summary>プレイヤーと同じ操作キャラ </summary>
        chara: 0,
        /// <summary>車系（地面に沿う、地面に沿って傾く。空中動作が無い</summary>
        car: 1,
        /// <summary>空中浮遊系（地面の影響を受けない）+ 高度あり</summary>
        air: 2,
        /// <summary>巡航ミソ</summary>
        air2: 3,

        /// <summary>空中浮遊系（地面の影響を受けない）</summary>
        hover: 4,

        /// <summary>向き制御のみ</summary>
        RolOnly: 5,

        /// <summary>ヘリのローター</summary>
        rolter: 6,
        /// <summary>添えつけオブジェクト（移動しない）</summary>
        structure: 7,



        maxval: 8,
    }

/// <summary>
/// CPU思考に関連するパラメータ
/// </summary>
function strCpuParams() {   //Level系は、全て数値は0～10でセットすること       

    /// <summary>CPU思考間隔 </summary>
    this.Cpu_actDist = 30;
    /// <summary>移動レベル。この値が低いと突っ立ってることに</summary>
    this.Cpu_MoveLevel = 0.5;
    /// <summary>標準でとりうる間合い</summary>
    this.Cpu_BaseDist = 500;
    /// <summary>ブーストを使った行動をするレベル</summary>
    this.Cpu_BustLevel = 0.5;
    /// <summary>攻撃行動をする確立。</summary>
    this.Cpu_AttackLevel = 0.5;
    /// <summary>弾の回避行動をとる確立</summary>
    this.Cpu_breakLevel = 0.2;
    /// <summary>攻撃時、RWを使用する確立</summary>
    this.Cpu_RW_like = 0.8;
    /// <summary>攻撃時、LWを使用する確立</summary>
    this.Cpu_LW_like = 0.50;
    /// <summary>攻撃時、SWを使用する確立</summary>
    this.Cpu_SW_like = 0.5;

    /// <summary>ＣＰＵのタイプ</summary>
    this.CpuType = cEnCPUTypeID.chara;
    /// <summary>間合いタイプ </summary>
    this.DistType = cEnCPUThinkID_Dist.Mid;

    /// <summary>タイプ目標距離と実際の距離との差異 </summary>
    this.nowDist = 0;

    /// <summary>巡回、または目標地点</summary>
    //  public List<strWayPointParam> WayPoints;
    this.WayPoints = new Array();

    /// <summary>現在のWPについてからの停滞時間</summary>
    this.wayPointStayTime = 0;

    this.nowWayPointIndex = 0;

    //WayPointまでの距離
    this.nowWayPointsDist = 0;

    //WayPointから離れてよい許容範囲。0以下なら考慮しない
    this.AllowWayPointDist = -1;

    /// <summary>前の思考時間からの間隔 </summary>
    this.nowThinkDist = 0;

    /// <summary>攻撃目標となるもののID </summary>
    //public List<short> tgtList;
    this.tgtList = new Array();

    /// <summary>回避行動をとっているかどうかのフラグ</summary>
    this.BreakingFlg = false;

    /// <summary>回避行動をとる予約のフラグ</summary>
    this.BreakingYoyakuFlg = false;

    /// <summary>ＣＰＵキー計算用プール配列</summary>
    this.tmpPad = new Array();

    /// <summary>自動操縦時間</summary>
    this.AutomodeTime = 0;

    //一度でも目標とするWPに到達したというフラグ（CapPoint用）
    this.DetectCapPoint = false;

}

function clsCpuThink() {

    this.CpuParam = new strCpuParams();

}



/// <summary>
/// CPU思考操作クラス
/// </summary>

clsCpuThink.prototype = {
    constructor: clsCpuThink,


    /// <summary>
    /// CPU思考実行
    /// </summary>
    /// <param name="enID"></param>
    /// <param name="KeySet"></param>
    // ref strBtlObjectsPrm bp, ref strPlayerParamSet pp, bool isEnemyMode
    ThinkCpu: function (bp, _nowPos, isEnemyMode, _isFirst) {

        this.CpuParam.nowThinkDist++;

        //if (!this.CpuParam.BreakingYoyakuFlg)
        {

            if (this.CpuParam.Cpu_actDist > 0 && this.CpuParam.nowThinkDist > this.CpuParam.Cpu_actDist) {
                //初期化
                bp.Inputs[0].KeyA = false;
                bp.Inputs[0].KeyD = false;
                bp.Inputs[0].KeyS = false;
                bp.Inputs[0].KeyW = false;
                bp.Inputs[0].keyShift = false;
                bp.Inputs[0].Mouse_L = false;
                bp.Inputs[0].Mouse_R = false;

                this.CpuParam.nowThinkDist = 0;
                this.CpuParam.BreakingFlg = false;

                this.doMove(bp, _nowPos, isEnemyMode, _isFirst);

            }
            else {   //間隔未到達。前回と同じ行動を
                //bp.Inputs[0].copy(bp.Inputs[1]);
            }
        }
        /*
        else
        {
            this.CpuParam.BreakingYoyakuFlg = false;
            //前フレームでセット済みの値を使用する
        }
        */

    },

    addWayPoint: function (_wpParam) {
        this.CpuParam.WayPoints.push(_wpParam);
    },

    reWriteWayPoint: function (_idx, _v, _type) {
        if (_v != null) {
            this.CpuParam.WayPoints[_idx].wayPointV.copy(_v);
        }
        if (_type != null) {
            this.CpuParam.WayPoints[_idx].waypointType = _type;
        }
    },

    /// <summary>
    /// 非常用となる、フリーウェイポイントを作成する
    /// </summary>
    /// <returns></returns>
    makeFreeWP: function () {
        var wp = new strWayPointParam();
        wp.wayPointV = Vector3.Zero;
        wp.waypointType = cEnCpuWayPointID.free;
        wp.StayTime = long.MaxValue;
        return wp;
    },

    /// <summary>
    /// 非常用となる、フリーウェイポイントを作成する
    /// </summary>
    /// <returns></returns>
    makeStayWP: function () {
        var wp = new strWayPointParam();
        wp.wayPointV = new Vector3(0, 0, 0);
        wp.waypointType = cEnCpuWayPointID.stay;
        wp.StayTime = long.MaxValue;
        return wp;
    },

    /// <summary>
    /// 次のターゲットを探す。今回ターゲットが変わった場合にtrueを帰す
    /// </summary>
    /// <param name="cp"></param>
    SeachTgt: function (/*strBtlObjectsPrm*/ bp) {
        var nowTgtOBJ = null;//攻撃対象のオブジェクト

        //敵対象を全てリストアップし、一番近いものをターゲットとする
        var tgtList = new Array();
        var tgtLength = [];

        for (var i = 0; i < ScreenUpdater.players.length; i++) {
            if (bp.groupID != ScreenUpdater.players[i].bp.groupID && ScreenUpdater.players[i].bp.On) {
                tgtList.push(i);
                tgtLength[i] = ScreenUpdater.players[i].bp.GetDistance(bp.Pos, ScreenUpdater.players[i]);
            }
        }

        for (var i = 0; i < ScreenUpdater.etcObject.length; i++) {
            if (ScreenUpdater.etcObject[i].bp.groupID > 0 && bp.groupID != ScreenUpdater.etcObject[i].bp.groupID && ScreenUpdater.etcObject[i].bp.On) {
                tgtList.push(i + 100);
                tgtLength[i + 100] = ScreenUpdater.etcObject[i].bp.GetDistance(bp.Pos, ScreenUpdater.etcObject[i]);
            }
        }

        var find = -1;
        var nowLength = 99999999;
        for (var i = 0; i < tgtList.length; i++) {
            if (nowLength > tgtLength[tgtList[i]]) {
                find = tgtList[i];
                nowLength = tgtLength[tgtList[i]];
            }
        }

        if (find > -1) {
            if (find < 100) {
                nowTgtOBJ = ScreenUpdater.players[find];
            } else {
                find -= 100;
                nowTgtOBJ = ScreenUpdater.etcObject[find];
            }
        }

        bp.tgtLength = nowLength;


        return nowTgtOBJ;
        /*
       
        if (bp.Lock_use_Flg == false)
        {
            bp.Lock_use_Flg = true;
            //this.CpuParam.tmpPad[cEnPadFuncName.LockOnKey] = true;
            refB = true;
        }

            
        //return;
        for (var i = 0; i < 999; i++)
        {
            if (this.CpuParam.tgtList == null)
            {
                bp.Lock_use_Flg = false;
                break;
            }

            if (this.CpuParam.tgtList.Count == 0)
            {
                bp.Lock_use_Flg = false;
                break;
            }

            //ターゲット候補が既に撃墜されていたら、配列から消去
            if (!this.CheckTargetOn(this.CpuParam.tgtList[0]))
            {
                //削除できるものかどうかチェック
                var canDelete = true;
                if (this.CpuParam.tgtList[0] < 2)
                {
                    if (BT_Players[this.CpuParam.tgtList[0]].control_Flg != -1)
                    {
                        canDelete = false;
                        break;
                    }
                }
                if (canDelete)
                {
                    this.CpuParam.tgtList.splice(0,1);
                    bp.Lock_use_Flg = false;
                }
            }
            else
            {
                break;
            }
        }
 

        if (bp.Lock_use_Flg)
        {
            var nowTgt = this.CpuParam.tgtList[0];
            if (bp.LastHitEnemy > -1)
            {
                if (CheckTargetOn(bp.LastHitEnemy))
                {
                    bp.Lock_Tgt[0] = bp.LastHitEnemy;
                }
                bp.LastHitEnemy = -1;
            }
            else
            {
                if (bp.Lock_Tgt[0] != nowTgt)
                {
                    //bp.L_G_Pad[1].PadStat[cEnPadFuncName.LockOnKey] = true;
                    //this.CpuParam.tmpPad[cEnPadFuncName.LockOnKey] = false;
                }
                else
                {
                    //this.CpuParam.tmpPad[cEnPadFuncName.LockOnKey] = false;
                }
            }
        }

       
        */
    },


    /// <summary>
    ///  移動を決める
    /// </summary>
    doMove: function (/* strBtlObjectsPrm*/ bp, _nowPos, /*bool*/ isEnemyMode, _isFirst) {

        var getI = 0;

        if (this.CpuParam.WayPoints.length === 0) { this.CpuParam.WayPoints.push(this.makeStayWP()); }

        oreCommon.v1.copy(_nowPos);
        oreCommon.v2.copy(this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].wayPointV);

        //エリアオーバーのチェック
        if (this.CpuParam.CpuType < cEnCPUTypeID.RolOnly) {
            var tmpgloundflg = true; // Game1.CurrentScreen.chkStageMax(v1);
            if (!tmpgloundflg) {
                //エリアオーバー。強制的にWayPointを追加
                if (this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType === cEnCpuWayPointID.capPoint ||
                    this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType === cEnCpuWayPointID.free) {
                    //中心地に向かうWayPointを設定
                    var wp = new strWayPointParam();
                    wp.StayTime = 10;
                    wp.waypointType = cEnCpuWayPointID.Navi_d;
                    wp.wayPointV = Game1.CurrentScreen.stageCenterPos;
                    this.CpuParam.WayPoints.push(this.CpuParam.nowWayPointIndex, wp);
                    bp.Lock_use_Flg = false;
                    this.CpuParam.AutomodeTime = 150;
                }
            }
            else {
                if (this.CpuParam.AutomodeTime > 0) {
                    this.CpuParam.AutomodeTime--;
                    this.CpuParam.AutomodeTime = Math.clamp(this.CpuParam.AutomodeTime, 1, 150);
                }
            }
        }
        //#endregion

        switch (this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType) {
            case cEnCpuWayPointID.Navi_d:
            case cEnCpuWayPointID.Navi_w:
            case cEnCpuWayPointID.capPoint:
                this.CpuParam.nowThinkDist = 20;    //WPに向かう場合は、ちまちま確認する
                //#region ナビポイント
                var chgWayPointFlg = false;
                if (this.CpuParam.CpuType < cEnCPUTypeID.RolOnly) {
                    if (oreMath.tgtLeng2(oreCommon.v1, oreCommon.v2) < 300) {
                        this.CpuParam.wayPointStayTime++;
                        if (oreMath.tgtLeng2(oreCommon.v1, oreCommon.v2) < 50) {
                            if (this.CpuParam.wayPointStayTime >= this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].StayTime &&
                                this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].StayTime > 0) {
                                chgWayPointFlg = true;
                            }
                        }
                    }

                    if (this.CpuParam.AutomodeTime === 1) {
                        this.CpuParam.AutomodeTime = 0;
                        chgWayPointFlg = true;
                    }

                    if (chgWayPointFlg && _isFirst && this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType != cEnCpuWayPointID.capPoint) {
                        this.ChangeWP(bp);
                        this.doMove(bp, _nowPos, isEnemyMode, false);
                        return;
                    }
                    else {
                        //そのウェイポイントに向かう
                        var wp_tgtV = new THREE.Vector3;
                        wp_tgtV.copy(oreCommon.v1);
                        wp_tgtV.sub(oreCommon.v2);
                        //ロックオンを解除
                        bp.Lock_use_Flg = false; bp.M_Lock_use_Flg = false;

                        //向きを修正
                        //var tgtR_v = oreMath.GetDifKaku(wp_tgtV, bp.Rol_MstY);

                        bp.Inputs[0].KeyA = false;
                        bp.Inputs[0].KeyD = false;
                        bp.Inputs[0].KeyS = false;
                        bp.Inputs[0].keyShift = false;

                        if (wp_tgtV.length() > 50) {
                            bp.TgtView_pos.copy(this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].wayPointV);
                            bp.Inputs[0].KeyW = true;
                        }
                        else {
                            bp.Inputs[0].KeyW = false;
                        }

                        bp.Lock_ene_V.copy(wp_tgtV);
                        bp.Lock_ene_V_N.copy(wp_tgtV);
                        bp.Lock_ene_V_N.normalize();
                        bp.Lock_ene_R_Y = oreMath.GetDifKakuY(bp.Lock_ene_V_N);
                        this.CpuParam.nowWayPointsDist = wp_tgtV.length();

                        var tmpf = oreMath.LimitKakuPI(bp.Lock_ene_R_Y - bp.Rol_MstY);

                        if (bp.dist_time[cEnStat_ParamTime.Stat_move_time] === 0) {
                            if (Math.abs(tmpf) < 0.025 && this.CpuParam.nowWayPointsDist > 50) {
                                //if (this.CpuParam.Cpu_BustLevel > Math.random()) 
                                {
                                    bp.Inputs[1].keyShift = false;
                                    bp.Inputs[0].keyShift = true;
                                }
                            }
                        }
                    }

                    if (this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType == cEnCpuWayPointID.capPoint && this.CpuParam.wayPointStayTime > 0) {
                        this.CpuParam.nowThinkDist = 0;
                        if (this.CpuParam.nowWayPointsDist < this.CpuParam.AllowWayPointDist || this.CpuParam.AllowWayPointDist <= 0) {
                            this.doAttack(bp);
                        } else {
                            //ここに来た時点で「WPから離れすぎ」なので、バーニアで移動する
                            bp.Inputs[1].keyShift = false;
                            bp.Inputs[0].keyShift = true;
                        }
                    }

                    if(bp.dist_time[cEnStat_ParamTime.Stat_move_time] > 0){ bp.Inputs[0].keyShift = false; }

                }
                else {
                    bp.Inputs[0].KeyA = false;
                    bp.Inputs[0].KeyD = false;
                    bp.Inputs[0].KeyW = false;
                    bp.Inputs[0].KeyS = false;
                }

                //#endregion

                break;

            //case cEnCpuWayPointID.capPoint:
            case cEnCpuWayPointID.free:

                //#region CAPポイント

                if (this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].StayTime > 0) {
                    this.CpuParam.wayPointStayTime++;
                }
                else {
                    this.CpuParam.wayPointStayTime = 0;
                }

                if (this.CpuParam.wayPointStayTime > this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].StayTime) {
                    this.ChangeWP(bp);
                    this.doMove(bp, _nowPos, isEnemyMode, false);
                }
                else {
                    //戦闘行動ロジック     

                    //攻撃行動
                    this.CpuParam.nowWayPointsDist = 0;
                    this.doAttack(bp);
                    /*
                    if (!this.doAttack(bp) && this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType === cEnCpuWayPointID.capPoint) {
                        //一回移動に書き換えて、戻す
                        this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType = cEnCpuWayPointID.Navi_d;
                        this.doMove(bp, _nowPos, isEnemyMode, false);
                        this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex].waypointType = cEnCpuWayPointID.capPoint;
                    }
                    */
                    /*
                    if (!this.CpuParam.BreakingFlg) this.doAttack(bp);
                    if (!isEnemyMode)
                    {
                        //回避行動
                        this.CpuParam.BreakingYoyakuFlg = true;
                        this.doBreak(ref bp, ref this.CpuParam.tmpPad);
                    }*/

                }
                break;
            //#endregion
            default: break;
        }



    },

    /// <summary>
    /// WPを変える
    /// </summary>
    /// <param name="bp"></param>
    ChangeWP: function (/* strBtlObjectsPrm*/ bp) {
        this.CpuParam.nowWayPointIndex++;
        this.CpuParam.wayPointStayTime = 0;
        if (this.CpuParam.nowWayPointIndex > this.CpuParam.WayPoints.length - 1) {
            this.CpuParam.nowWayPointIndex = this.CpuParam.WayPoints.length - 1;
            if (this.CpuParam.WayPoints.length === 0) {
                this.CpuParam.WayPoints[this.CpuParam.nowWayPointIndex] = makeFreeWP();
            }
        }
        /*
        //自分がStickIDになっているやつがいたら、WPを進ませる？
        for (var i = 0; i < Bt_Enemys.Count; i++)
        {
            if (Bt_Enemys[i].sticID_2 == bp.id && Bt_Enemys[i].ID != bp.id)
            {
                ChangeWP(Bt_Enemys[i].prm);
            }
        }*/
    },

    /// <summary>
    /// 武器使用のためのボタンをセットする
    /// </summary>
    /// <param name="bp"></param>
    /// <param name="pp"></param>
    /// <param name="nowWpnID"></param>
    /// <param name="this.CpuParam.tmpPad"></param>
    SetUseWeaponBtn: function (bp, nowWpnID) {
        var tgtMountWpn = 0;

        this.CpuParam.tmpPad[cEnPadFuncName.R_shotKey] = false;
        this.CpuParam.tmpPad[cEnPadFuncName.L_shotKey] = false;
        this.CpuParam.tmpPad[cEnPadFuncName.S_R_shotKey] = false;
        this.CpuParam.tmpPad[cEnPadFuncName.S_L_shotKey] = false;

        switch (nowWpnID) {
            case cEnPadFuncName.R_shotKey:
                this.CpuParam.tmpPad[cEnPadFuncName.R_shotKey] = true;
                tgtMountWpn = cEnWpnMountPosEnum.MountID_RW2;
                break;
            case cEnPadFuncName.L_shotKey:
                this.CpuParam.tmpPad[cEnPadFuncName.L_shotKey] = true;
                break;
            case cEnPadFuncName.S_R_shotKey:
                this.CpuParam.tmpPad[cEnPadFuncName.S_R_shotKey] = true;
                tgtMountWpn = cEnWpnMountPosEnum.MountID_SW_R;
                break;
            case cEnPadFuncName.S_L_shotKey:
                this.CpuParam.tmpPad[cEnPadFuncName.S_L_shotKey] = true;
                tgtMountWpn = cEnWpnMountPosEnum.MountID_SW_L;
                break;
        }

        //チャージ考慮 通常時の換装使用％
        var NowRand = 30;

        if (bp.weapons[tgtMountWpn].USE_weaponID === 0
            && bp.weapons[tgtMountWpn].Now_Zandan === 0) {   //玉ナシ。当然つかわない
            NowRand = 0;
        }
        else {   //玉あり
            //Wpn２がチャージしているかどうか
            if (bp.weapons[tgtMountWpn].CanBullet_En) {
                NowRand = 80;
            }
            else if (bp.weapons[tgtMountWpn - 1].CanBullet_En) {
                NowRand = 15;
            }
            else {
                NowRand = 30;
            }
        }


    },

    ///武器を撃つかどうか決める
    chkWpnReng: function (bp, wpnId) {
        if (bp.Weapons[wpnId] != null) {
            if (bp.tgtLength * 0.7 < bp.Weapons[wpnId].wpn_reng * Master_Shot_Renge_Rate) {
                return true;
            }
        }
        return false;
    },

    checkMoveVectWall: function (bp, tgtI) {
        //入力されたキーにより、どの方向に移動することになるかを出す
        oreCommon.sceneCom_TempQ1.setFromAxisAngle(oreMath.rotateAxisY, bp.Lock_ene_R_Y + oreMath.MoveRolVectByInt(tgtI));
        oreCommon.v1.set(0, 0, -this.CpuParam.Cpu_actDist * 0.3);
        oreCommon.v1.applyQuaternion(oreCommon.tempQ_Y);

        //その方向が壁じゃないかをチェックする
        var height = oreCommon.GetPosHeight(oreCommon.v1);
        return (height < bp.Pos.y + 30);
    },

    checkedMoveKeyInt: function (tgtI, _moved) {
        for (var i = 0; i < _moved.length; i++) {
            if (_moved[i] === tgtI) { return false; }
        }
        return true;
    },

    //進みたい方向に壁がないかどうかをチェックしながら、進行方向を決定する
    decisionMoveKey: function (tgtSabun, bp, _moved) {
        var moveDetectd = false;
        var nowTgtI = 2;
        var boostLikePow = 0.1;
        if (tgtSabun < -50 || (_moved.length === 3 && this.checkedMoveKeyInt(nowTgtI, _moved))) {
            _moved.push(nowTgtI);
            //近すぎたので遠くしたい
            if (this.checkMoveVectWall(bp, nowTgtI)) { bp.Inputs[0].KeyS = true; moveDetectd = true; boostLikePow = 1.5; }
        }

        nowTgtI = 8;
        if (tgtSabun > 50 || (_moved.length === 3 && this.checkedMoveKeyInt(nowTgtI, _moved))) {
            _moved.push(nowTgtI);
            //遠すぎたので近くしたい
            if (this.checkMoveVectWall(bp, nowTgtI)) { bp.Inputs[0].KeyW = true; moveDetectd = true; boostLikePow = 1.5; }
        }

        if (!moveDetectd) {
            if (bp.CpuThink.CpuParam.Cpu_MoveLevel > Math.random()) {
                nowTgtI = 4;
                if (0.5 > Math.random() || (_moved.length == 3 && this.checkedMoveKeyInt(nowTgtI, _moved))) {
                    _moved.push(nowTgtI);
                    if (this.checkMoveVectWall(bp, nowTgtI)) { bp.Inputs[0].KeyA = true; moveDetectd = true; boostLikePow = 1.0; }
                }

                if (!moveDetectd) {
                    nowTgtI = 6;
                    if (0.5 > Math.random() || (_moved.length === 3 && this.checkedMoveKeyInt(nowTgtI, _moved))) {
                        _moved.push(nowTgtI);
                        if (this.checkMoveVectWall(bp, nowTgtI)) { bp.Inputs[0].KeyD = true; moveDetectd = true; boostLikePow = 1.0; }
                    }
                }
            }
        }

        if (!moveDetectd && _moved.length < 4) {
            this.decisionMoveKey(tgtSabun, bp, _moved);
        } else {
            bp.Inputs[0].keyShift = false;
            if (bp.CpuThink.CpuParam.Cpu_BustLevel * boostLikePow > Math.random()) {
                bp.Inputs[0].keyShift = true;
            }
        }
    },

    /// <summary>
    ///　攻撃行動
    /// </summary>
    doAttack: function (bp) {

        var nowTgtOBJ = null;
        //ターゲットが存在してるかどうかチェック
        nowTgtOBJ = this.SeachTgt(bp);

        if (nowTgtOBJ == null) { return false; }

        bp.Inputs[0].Mouse_L = false;
        bp.Inputs[0].Mouse_R = false;
        bp.Inputs[1].Mouse_L = false;
        bp.Inputs[1].Mouse_R = false;

        bp.Inputs[0].KeyA = false;
        bp.Inputs[0].KeyD = false;
        bp.Inputs[0].KeyW = false;
        bp.Inputs[0].KeyS = false;
        bp.Inputs[0].keyShift = false;
        bp.Inputs[1].keyShift = false;

        //打つ地点を決める
        bp.Lock_Tgt = [nowTgtOBJ.bp.id];
        bp.CullentLockTgt = nowTgtOBJ.bp.id;
        bp.TgtView_pos.copy(nowTgtOBJ.CenterPos);
        bp.Lock_ene_V.copy(bp.Pos);
        bp.Lock_ene_V.sub(nowTgtOBJ.CenterPos);
        //角度が一致していたら、打つ?
        bp.Lock_ene_V_N.copy(bp.Lock_ene_V);
        bp.Lock_ene_V_N.normalize();
        bp.Lock_ene_R_Y = oreMath.GetDifKakuY(bp.Lock_ene_V_N);

        bp.Lock_ene_R_Y_dif = oreMath.LimitKakuPI(bp.Lock_ene_R_Y - bp.Rol_MstY);

        //攻撃処理決定
        //遠かったら移動する
        var tgtSabun = bp.tgtLength - this.CpuParam.Cpu_BaseDist;

        if (Math.abs(tgtSabun) > 100) {
            bp.Inputs[0].keyShift = true;
        }

        this.decisionMoveKey(tgtSabun, bp, []);

        //ジャンプ中は、打たない？
        if (bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] > 30) { return; }

        //if (Math.abs(bp.Lock_ene_R_Y_dif) < 0.1) 
        {
            //角度は近いため、打てる。
            //射程が近い武器からチェックしていく必要がある
            var wpnDetect = false;

            if (this.chkWpnReng(bp, 1)) {
                if (bp.CpuThink.CpuParam.Cpu_LW_like > Math.random()) {
                    bp.currentWpnUse[0] = 1;
                    bp.Inputs[0].Mouse_L = true;
                    wpnDetect = true;
                }
            }
            if (!wpnDetect) {
                if (this.chkWpnReng(bp, 0)) {
                    if (bp.CpuThink.CpuParam.Cpu_RW_like > Math.random()) {
                        bp.currentWpnUse[0] = 0;
                        bp.Inputs[0].Mouse_L = true;
                        wpnDetect = true;
                    }
                }
            }

            if (!wpnDetect) {
                if (this.chkWpnReng(bp, 3)) {
                    if (bp.CpuThink.CpuParam.Cpu_SW_like > Math.random() && bp.weapon_use_Time[2] == 0 && bp.weapon_use_Time[3] == 0) {
                        bp.currentWpnUse[1] = 3;
                        bp.Inputs[0].Mouse_R = true;
                        wpnDetect = true;
                    }
                }
            }

            if (!wpnDetect) {
                if (this.chkWpnReng(bp, 2)) {
                    if (bp.CpuThink.CpuParam.Cpu_SW_like > Math.random() && bp.weapon_use_Time[2] == 0 && bp.weapon_use_Time[3] == 0) {
                        bp.currentWpnUse[1] = 2;
                        bp.Inputs[0].Mouse_R = true;
                        wpnDetect = true;
                    }
                }
            }
        }

        //一番ラクな方法として、1番目の武器を撃つことだけ

        return true;

        this.CpuParam.tmpPad[cEnPadFuncName.R_shotKey] = false;
        this.CpuParam.tmpPad[cEnPadFuncName.L_shotKey] = false;
        this.CpuParam.tmpPad[cEnPadFuncName.S_R_shotKey] = false;
        this.CpuParam.tmpPad[cEnPadFuncName.S_L_shotKey] = false;

        if (bp.Lock_use_Flg === true && !nowCngFlg) {
            //#region 攻撃キー入力

            //障害物があったら、打たない？
            if (!bp.IsTgtShot && bp.id < 1000)

                var enyBullet = false;
            for (var i = 0; i < bp.weapon_use_Time.Length; i++) {
                if (bp.weapon_use_Time[i] > 0 && bp.weapon_use_Time[i] < 40) enyBullet = true; break;
            }

            //ジャンプしたばっかりだったら、攻撃しない
            if (bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] > 0 &&
                bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] < 60) {
                enyBullet = true;
            }

            //#region プレイヤー操作キャラの場合

            //if (!enyBullet)
            {
                if (bp.weapons[cEnWpnMountPosEnum.MountID_LW1].USE_weaponID > 0) {
                    if (this.CpuParam.Cpu_LW_like > 0) {
                        //if (bp.Lock_ene_V_Len < clsPlayerResource.makedWpn.WpnObj(bp.weapons[cEnWpnMountPosEnum.MountID_LW1].USE_weaponID).wpn_reng)
                        if (bp.weapons[cEnWpnMountPosEnum.MountID_LW1].InRange[0]) {
                            if (this.CpuParam.Cpu_LW_like > Game1.StageResourses.randoms.GetRand100()) {
                                SetUseWeaponBtn(bp, cEnPadFuncName.L_shotKey);
                                enyBullet = true;
                            }
                        }
                    }
                }
            }

            //ジャンプ中は、ＳＷは打たない！
            if (this.CpuParam.Cpu_SW_like > 0 && !enyBullet) {
                //CPUは、右に射程が短いほうの武器を設置すれば、使い分けができるはず？
                if (bp.weapons[cEnWpnMountPosEnum.MountID_SW_R].USE_weaponID > 0 && bp.weapons[cEnWpnMountPosEnum.MountID_SW_R].CanBullet) {
                    //if (bp.Lock_ene_V_Len < clsPlayerResource.makedWpn.WpnObj(bp.weapons[cEnWpnMountPosEnum.MountID_SW_R].USE_weaponID).wpn_reng)
                    if (bp.weapons[cEnWpnMountPosEnum.MountID_SW_R].InRange[0]) {
                        if (this.CpuParam.Cpu_SW_like > Game1.StageResourses.randoms.GetRand100()) {
                            SetUseWeaponBtn(bp, cEnPadFuncName.S_R_shotKey);
                            enyBullet = true;
                        }
                    }
                }

                //if (!enyBullet)
                {
                    if (bp.weapons[cEnWpnMountPosEnum.MountID_SW_L].USE_weaponID > 0 && bp.weapons[cEnWpnMountPosEnum.MountID_SW_L].CanBullet) {
                        //if (bp.Lock_ene_V_Len < clsPlayerResource.makedWpn.WpnObj(bp.weapons[cEnWpnMountPosEnum.MountID_SW_L].USE_weaponID).wpn_reng)
                        if (bp.weapons[cEnWpnMountPosEnum.MountID_SW_L].InRange[0]) {
                            if (this.CpuParam.Cpu_SW_like > Game1.StageResourses.randoms.GetRand100()) {
                                SetUseWeaponBtn(bp, cEnPadFuncName.S_L_shotKey);
                                enyBullet = true;
                            }
                        }
                    }
                }


                if (bp.weapons[cEnWpnMountPosEnum.MountID_RW2].USE_weaponID > 0) {
                    if (this.CpuParam.Cpu_RW_like > 0 && bp.weapons[cEnWpnMountPosEnum.MountID_RW2].CanBullet) {
                        if (bp.weapons[cEnWpnMountPosEnum.MountID_RW2].InRange[0]) {
                            if (this.CpuParam.Cpu_RW_like > Game1.StageResourses.randoms.GetRand100()) {
                                SetUseWeaponBtn(bp, cEnPadFuncName.R_shotKey);
                                //return;
                            }
                        }



                        //#endregion
                    }
                    else {
                        //#region 敵の場合
                        if (bp.weapons[cEnWpnMountPosEnum.MountID_RW1].USE_weaponID > 0) {
                            if (this.CpuParam.Cpu_RW_like > 0 && bp.weapons[cEnWpnMountPosEnum.MountID_RW1].CanBullet) {
                                if (bp.weapons[cEnWpnMountPosEnum.MountID_RW1].InRange[0]) {
                                    if (this.CpuParam.Cpu_RW_like > Game1.StageResourses.randoms.GetRand100()) {
                                        SetUseWeaponBtn(bp, cEnPadFuncName.R_shotKey);
                                        //return;
                                    }
                                }
                            }
                        }
                        if (bp.weapons[cEnWpnMountPosEnum.MountID_RW2].USE_weaponID > 0) {
                            if (this.CpuParam.Cpu_RW_like > 0 && bp.weapons[cEnWpnMountPosEnum.MountID_RW2].CanBullet) {
                                if (bp.weapons[cEnWpnMountPosEnum.MountID_RW2].InRange[0]) {
                                    if (this.CpuParam.Cpu_SW_like > Game1.StageResourses.randoms.GetRand100()) {
                                        SetUseWeaponBtn(bp, cEnPadFuncName.S_R_shotKey);
                                        //return;
                                    }

                                }

                                //#endregion
                            }
                        }
                        else {
                            //ホントは障害物回避のためのルーチンを組ませたいところ

                        }

                        //#endregion

                        if (this.CpuParam.CpuType < cEnCPUTypeID.RolOnly) {
                            //#region 間合い調整ロジック

                            if (!this.CpuParam.BreakingFlg) {
                                if (!bp.HitWall) {
                                    var tmpBarniaLike = this.CpuParam.Cpu_BustLevel;

                                    var tgtThinkDist = bp.Lock_ene_V.Length() - this.CpuParam.Cpu_BaseDist;

                                    this.CpuParam.nowDist = tgtThinkDist;
                                    var tmpR = Game1.StageResourses.randoms.GetRand100();


                                    //if (this.CpuParam.CpuType == cEnCPUTypeID.chara || this.CpuParam.CpuType == cEnCPUTypeID.air || this.CpuParam.CpuType == cEnCPUTypeID.car)
                                    {

                                        //差が100程度（+-250*0.2の近く)なら、左右どっちかに移動する（間合いキープ）
                                        if (Math.Abs(tgtThinkDist) < 40) {
                                            this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = false;
                                            this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = false;
                                            this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = false;
                                            this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = false;
                                            if (tmpR > 50) {
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = true;
                                            }
                                            else {
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = true;
                                            }
                                        }
                                        else {
                                            if (tgtThinkDist > 0) {   //遠いので距離を詰める
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = true;
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = false;
                                            }
                                            else {   //誓いので距離を離す
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = true;
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = false;
                                            }

                                            //さらに色を出して、+-200程度の場合は、斜めに移動させてみようか
                                            if (Math.Abs(tgtThinkDist) < 70) {
                                                if (tmpR > 50) {
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = true;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = false;
                                                }
                                                else {
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = true;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = false;
                                                }
                                            }
                                            else {
                                                //100以上離れていたら結構遠いということで、バーニア値に加算
                                                tmpBarniaLike += 30;
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = false;
                                                this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = false;
                                            }

                                            //敵と離れすぎていたら、一度際索敵させてみるか？
                                            if (tgtThinkDist > 70) {
                                                bp.L_G_Pad[1].PadStat[cEnPadFuncName.LockOnKey] = false;
                                                bp.L_G_Pad[0].PadStat[cEnPadFuncName.LockOnKey] = false;
                                                this.CpuParam.tmpPad[cEnPadFuncName.LockOnKey] = true;
                                            }

                                        }

                                        if (bp.IsTgtShot) {
                                            if (Last1KeyInt === 0 || Last1KeyInt === 5) {
                                                //前回左右キーがなかった場合
                                                if (tmpR < 30) {
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = true;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = false;
                                                    tmpBarniaLike *= 2;
                                                }
                                                else if (tmpR < 60) {
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = true;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = false;
                                                    tmpBarniaLike *= 2;
                                                }
                                                else {
                                                    //とりあえず飛ばしとけ
                                                    tmpBarniaLike *= 5;
                                                }
                                            }
                                            else {
                                                //おなじ方向に移動し続けさせる
                                                if (tmpR > 10) {
                                                    tmpBarniaLike *= 2;
                                                }
                                                else {
                                                    //とりあえず飛ばしとけ
                                                    tmpBarniaLike *= 5;
                                                    bp.L_G_Pad[1].PadStat[cEnPadFuncName.Junp] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = false;
                                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = false;
                                                }
                                            }
                                        }
                                    }

                                    if (bp.enyWeaponUseFlg && !this.CpuParam.tmpPad[cEnPadFuncName.Junp]) { tmpBarniaLike *= 0.5; }

                                    //bp.L_G_Pad[1].PadStat[cEnPadFuncName.Junp] = false;
                                    //バーニア好みレベルに応じて、バーに亜使用
                                    if (Game1.StageResourses.randoms.GetRand100() < tmpBarniaLike) {
                                        this.CpuParam.tmpPad[cEnPadFuncName.Junp] = true;

                                        if (bp.using_Time[cEnStat_ParamTime.Stat_use_gain_time] === 0)
                                        { bp.L_G_Pad[1].PadStat[cEnPadFuncName.Junp] = false; }
                                    }
                                }
                                else {
                                    //壁に当たっていた場合。

                                    //とりあえず飛ばしとけ
                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = false;
                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = false;
                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = false;
                                    this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = false;
                                    this.CpuParam.tmpPad[cEnPadFuncName.Junp] = true;

                                }

                                //#endregion
                            }
                            else if (this.CpuParam.CpuType >= cEnCPUTypeID.RolOnly)//固定オブジェ RolOnlyは、行動メソッドの中で回転を決定している   
                            {
                                this.CpuParam.tmpPad[cEnPadFuncName.MoveLeft] = false;
                                this.CpuParam.tmpPad[cEnPadFuncName.MoveRight] = false;
                                this.CpuParam.tmpPad[cEnPadFuncName.MoveUp] = false;
                                this.CpuParam.tmpPad[cEnPadFuncName.MoveDown] = false;
                                this.CpuParam.tmpPad[cEnPadFuncName.Junp] = false;

                            }
                        }
                    }
                }
            }
        }

    },


    /// <summary>
    /// 回避行動をする
    /// </summary>
    doBreak: function (bp) {
        if (this.CpuParam.BreakingYoyakuFlg) {
            this.CpuParam.BreakingFlg = false;
            if (this.CpuParam.CpuType < cEnCPUTypeID.air && bp.id < 1000) {
                //そぃつを狙っている玉リスト
                //LinkedList<Particle> FlowList = Game1.CurrentScreen.BT_Effects.PlayerFlowList[bp.id];
                var tmpV = new THREE.Vector3;

                //一番攻撃力が高い玉を捜す
                var tgtPart = new Particle();
                bp.tmpP.Init();

                var flowListCount = Game1.CurrentScreen.BT_Effects.PlayerFlowList[bp.id].Count;
                var tgtIndex = 0;
                if (flowListCount > 1) {
                    bp.tmpP = Game1.CurrentScreen.BT_Effects.PlayerFlowList[bp.id].First.Value;
                    //Game1.CurrentScreen.BT_Effects.PlayerFlowList[bp.id].RemoveFirst();
                    /*
                    for (Particle l_p in Game1.CurrentScreen.BT_Effects.PlayerFlowList[bp.id])
                    {
                        if (clsP_Resource.makedBullet.BltObj(bp.tmpP.Efe_type).attack_P < clsP_Resource.makedBullet.BltObj(l_p.Efe_type).attack_P)
                    {
                        bp.tmpP = l_p;
                    }
                    */
                    for (var ptk = 0; ptk < BT_Effects.PlayerFlowList[bp.id].length; ptk++) {
                        if (clsP_Resource.makedBullet.BltObj(bp.tmpP.Efe_type).attack_P < clsP_Resource.makedBullet.BltObj(l_p.Efe_type).attack_P) {
                            bp.tmpP = l_p;
                        }
                    }
                }
            }

            if (BT_Effects.PlayerFlowList[bp.id].Count > 0) {
                var tmpMoveint = Game1.StageResourses.randoms.GetRand100();

                //【その玉をよけるかどうか】のフラグが必要
                if (tmpMoveint < this.CpuParam.Cpu_breakLevel) {

                    //回避判定ロジック --------------------------------------------------

                    //１．敵弾の現在の位置と、自機の現在の位置のべくとるを取得
                    tmpV = bp.tmpP.POS - bp.Pos;
                    tmpV.Normalize();

                    //２・そのベクトルと、敵弾の持っているベクトルを加算し、正規化
                    tmpV = Vector3.Add(tmpV, bp.tmpP.VECT);
                    tmpV.Normalize();

                    //３・v2とプレイヤの進行方向を加算し、ベクトルが減ったなら、回避が必要な弾とする
                    tmpV = Vector3.Add(tmpV, bp.Vect);
                    if (tmpV.Length() < 1) {
                        //#region 回避決定

                        this.CpuParam.BreakingFlg = true;
                        this.CpuParam.nowThinkDist = -30;

                        //避けに徹するため、武器は封印！
                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.R_shotKey] = false;
                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.L_shotKey] = false;
                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.S_R_shotKey] = false;
                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.S_L_shotKey] = false;

                        //float tgtR_v = Game1.oreMath.oreMath.GetDifKakuV(ref bp.Lock_ene_V_N, ref tmpV);
                        tmpV.Normalize();
                        var tgtR_v = Game1.oreMath.oreMath.oreMath.GetDifKakuY(tmpV);

                        //角度を8方向に
                        var Key4 = Game1.oreMath.Get_DistKakuInt8(tgtR_v);

                        //奪取にするため、前回をニュートラル、前々回を今回と同一方向に
                        //ニュートラル処理
                        //bp.L_G_Pad[1].PadStat[cEnPadFuncName.Junp] = false;

                        this.CpuParam.tmpPad[cEnPadFuncName.Junp] = true;


                        tmpMoveint = Game1.StageResourses.randoms.GetRand100();

                        //回避方向決定
                        //このkeyは、弾の方向
                        switch (Key4) {
                            case 2:
                            case 8:
                                bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveUp] = false;
                                bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveDown] = false;

                                if (tmpMoveint > 50) {
                                    bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveLeft] = true;
                                    //pp.Move_Int[clsConst.NowKey_int - 1] = 4;
                                    tmpMoveint = 4;
                                }
                                else {
                                    bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveRight] = true;
                                    //pp.Move_Int[clsConst.NowKey_int - 1] = 6;
                                    tmpMoveint = 6;
                                }
                                break;

                            default:
                                if (bp.Move_Int.Last.Value === Key4) {   //同じ方向だった場合。とりあえず適当なキーを入れる・・・？
                                    if (tmpMoveint < 40) {
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveLeft] = true;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveRight] = false;
                                    }
                                    else if (tmpMoveint < 80) {
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveLeft] = false;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveRight] = true;
                                    }

                                    tmpMoveint = Game1.StageResourses.randoms.GetRand100();
                                    if (tmpMoveint < 40) {
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveUp] = true;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveDown] = false;
                                    }
                                    else if (tmpMoveint < 80) {
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveUp] = false;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveDown] = true;
                                    }
                                    //moveIntを再編集･･･
                                    var dummy = 0;

                                    oreMath.GetMoveIntbyKey(this.CpuParam.tmpPad, tmpMoveint, dummy);

                                    if (tmpMoveint === Key4) {   //まだ同じだったら,開き直ってジャンプさせちゃれ
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveLeft] = false;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveRight] = false;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveUp] = false;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.MoveDown] = false;
                                        bp.L_G_Pad[0].PadStat[cEnPadFuncName.Junp] = true;

                                        //ジャンプさせるために、前のキーをfalseに
                                        bp.L_G_Pad[1].PadStat[cEnPadFuncName.Junp] = false;
                                        tmpMoveint = 0;
                                    }

                                    //pp.Move_Int[clsConst.NowKey_int - 1] = tmpMoveint;
                                }

                                break;
                        }

                        //上のメソで、２つ削除して１つしか追加していないため、最後に強制的に「ゼロ」を追加
                        /*
                        旧ダッシュ操作のためのロジック(キー2回でダッシュ)
                        bp.Move_Int.RemoveLast();
                        bp.Move_Int.RemoveLast();
                        bp.Move_Int.AddLast(0);
                        bp.Move_Int.AddLast(tmpMoveint);
                        */
                        //バーニア好みレベルに応じて、バーに亜使用
                        if (Game1.StageResourses.randoms.GetRand100() < this.CpuParam.Cpu_BustLevel + 20) {
                            if (bp.using_Time[cEnStat_ParamTime.Stat_dash_time] === 0) {
                                bp.L_G_Pad[1].PadStat[cEnPadFuncName.Junp] = false;
                            }
                            bp.L_G_Pad[0].PadStat[cEnPadFuncName.Junp] = true;
                        }

                        //#endregion
                    }
                }
            }
        }
        else {

        }

    },

    /////////////


}

