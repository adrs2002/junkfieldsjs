/// <reference path="three.min.js"/>
/// <reference path="objectSetter/ObjSetter_Base.js"/>
/// <reference path="cEnBtPlayer.js"/>
/// <reference path="clsConst.js"/>
/// <reference path="oreCommon.js"/>
/// <reference path="oreMath.js"/>
/// <reference path="clsPlayer.js"/>

"use strict";

function clsEtcUnit(_name, _baseObj) {
    this.ModelObject = _baseObj.modelObject;
    this.Animater = _baseObj.animationController;

    //////////////
    this.Pos = this.ModelObject.position;
    this.Rol = new THREE.Quaternion();

    this.rol_X = 0;
    this.rol_Z = 0;

    this.CenterPos = new THREE.Vector3();

    this.nowMotion_base = "";
    this.WeaponAnimationName = "";
    this.WeaponMotonStep = 0;

    this.bp = new strBtlObjectsPrm();

    this.BarniaEffectBone = _baseObj.BarniaEffectBone;

    this.BaseObject = _baseObj;
    this.init();

    threeComps.scene.add(this.ModelObject);

    this.tmpV3 = new THREE.Vector3();
    this.tmpV3_2 = new THREE.Vector3();
    this.tmpMx = new THREE.Matrix4();

    this.MountWeapons = [];

    this.bp.ViewName = _baseObj.name;
    if (_name != null && _name.length > 0) {
        this.bp.ViewName = _name;
    }
}


clsEtcUnit.prototype.beginAnimation = function (_motion, _wpnFlg, _AllWriteFlg) {

    if (this.Animater == null) { return; }

    if (_wpnFlg != null && !_wpnFlg) {
        if (this.nowMotion_base != _motion) {
            this.nowMotion_base = _motion;
            this.Animater.beginAnimation(_motion, _AllWriteFlg);
        }
    }
    else {
        this.WeaponAnimationName = _motion;
        var tmpPow = 0;
        if (this.WeaponMotonStep >= 3) { tmpPow = -0.1; }
        else if (this.WeaponMotonStep === 0) { tmpPow = 0.1; }
        else { tmpPow = 1; }
        this.Animater.beginAnimation(_motion, false, tmpPow);
    }
};

clsEtcUnit.prototype.init = function () {
    var self = this;

    self.bp.On = false;
    self.bp.HitOn = false;

    for (var i = 0; i < cEnStat_ParamTime.val_Max; i++) {
        self.bp.dist_time.push(0);
    }
    for (var i = 0; i < cEnStat_ParamTime.val_Max; i++) {
        self.bp.using_Time.push(0);
    }

    self.bp.meca_Stat_Const_f = self.BaseObject.meca_Stat_Const_f;

    self.bp.meca_Stat_Value_f = [];
    for (var i = 0; i < cEnChara_ParamFloat.val_Max; i++) {
        self.bp.meca_Stat_Value_f.push(0);
    }

    self.bp.weapon_use_Time = [];
    for (var i = 0; i < cEnWpnMontID.val_Max; i++) {
        self.bp.weapon_use_Time.push(0);
    }

    //各種、「初期値が最大値」になるものをセット
    self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.life] = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.life_max];
    self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.gein_max];
    self.bp.Centerheight.y = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.body_height];

    self.bp.Gldon[0] = true;
    self.bp.Pos = self.Pos;

}

clsEtcUnit.prototype.SetViewFlg = function (_flg) {

}

clsEtcUnit.prototype.SetMountWeapon = function (_wpn, mountID) {
    var self = this;
    self.MountWeapons[mountID] = _wpn;
    self.MountWeapons[mountID].launchGroupID = self.bp.groupID;

    self.BaseObject.mountWpnBone[mountID].mounting = self.MountWeapons[mountID];

    if (_wpn.mesh != null) {
        self.BaseObject.mountWpnBone[mountID].add(self.MountWeapons[mountID].mesh);

        self.MountWeapons[mountID].mesh.matrix = new THREE.Matrix4();
        self.MountWeapons[mountID].mesh.applyMatrix(self.BaseObject.mountWpnBone[mountID].MountMx);

        if (self.BaseObject.mountWpnBone[mountID].MountMx.elements[0] === -1) {
            self.MountWeapons[mountID].mesh.geometry.computeFaceNormals();
            self.MountWeapons[mountID].mesh.geometry.computeVertexNormals();
        }
    }

}


clsEtcUnit.prototype.getMoveInt = function (_v) {
    if (_v.x === 0 && _v.y === 0) { return 0; }
    else {
        if (_v.x === -1) {
            if (_v.y === -1) { return 1; }
            else if (_v.y === 1) { return 7; }
            else { return 4; }
        } else if (_v.x === 1) {
            if (_v.y === -1) { return 3; }
            else if (_v.y === 1) { return 9; }
            else { return 6; }
        } else {
            //横ベクトル無し
            if (_v.y === -1) { return 2; }
            else if (_v.y === 1) { return 8; }
        }
    }
}

///////////////////////////////////////////

clsEtcUnit.prototype.Update = function () {

    var self = this,
        i = 0, m = 0,
        rol_X = 0,
        rol_Z = 0,
        lp = new LocalParams(),
        tmp_Vect_Y = 0,
        Add_Vect_Y = 0,
        f1 = 0.0, f2 = 0.0,
        nb = 0,
        //「今たっている場所の」地面の高さ
        L_temp_Y = oreCommon.GetPosHeight(self.Pos),
        moveVect = new THREE.Vector2(),
        Add_Vect2 = new THREE.Vector2(),

        //移動に使用するY角度(操作プレイヤーならカメラ角度にする)
        MoveRol = self.bp.Rol_MstY,
        move = false,
        //エリアオーバーをしていないかどうかのフラグ
        //trueならエリアオーバー
        tmpgloundflg = false,
        //このフレームから開始した　というフラグ
        now_dash_flg = false, now_junp_flg = false, now_Step_flg = false,

        Now_RolBaseVect = new THREE.Vector3(0, 0, -1),
        dashEndFlg = false,

        LastVect = new THREE.Vector3(),
        ForceVect = new THREE.Vector3(),
        tmpLastPos = new THREE.Vector3(),
        Hitwall2 = false,
        NowAltitude = 0.0,
        f = 0.0;
    var tmpWpnID = -1;
    ////////
    ///機体の向きをベクトルに直した値
    oreCommon.tempQ_Y = new THREE.Quaternion();

    lp.L_now_Move_Int = 0;

    lp.L_nowMoveIntbyTgtVect = 0;

    lp.L_now_AnimeID = self.bp.now_A;
    lp.L_wpn_A = self.bp.wpn_A;

    lp.L_now_playerState = self.bp.playerState;
    //lp.L_now_Lock_Tgt = self.bp.Lock_Tgt[0];

    lp.L_moveVect_Y = 0;

    lp.L_ActFuct = 0.0;

    lp.L_AddTachEfeFlg = false;
    lp.L_AddDashStartFlg = false;
    lp.L_enyWpnUseFLg = false;
    lp.nowUsingWpnID = 0;
    lp.L_BaseActEndflg = false;
    lp.L_RolLock_Flg = false;
    lp.isNotRenewTgtPos = false;


    //前フレームのベクトル：２Ｄ
    lp.bef_Vect2D = new THREE.Vector2(self.bp.Vect2.X, self.bp.Vect2.Z);


    lp.TgtMoveSpeed = 0;
    lp.TmpAddSpeed = 0;

    ///武器使用中、自由に方向修正ができるかどうかのフラグ
    //bool CanWpAddRol = false;

    lp.IsDamage = false;

    //ステータス情報の更新
    for (nb = 0; nb < self.bp.dist_time.length; nb++) {
        if (self.bp.dist_time[nb] > 0) { self.bp.dist_time[nb]--;; }
    }

    self.enyWeaponUseFlg = false;

    for (i = 0; i < self.bp.weapon_use_Time.length; i++) {
        if (self.bp.weapon_use_Time[i] > 0) {
            self.enyWeaponUseFlg = true;
            lp.L_enyWpnUseFLg = true;
            tmpWpnID = i;
        }
    }

    //撃墜判定
    if (self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.life] < 0) {
        //煙エミッターを置く
        var _pat = new Particle();
        _pat.setPos(self.Pos);
        _pat.setSiz(3);
        _pat.setSizFactor(2);
        _pat.imageId2 = 0;
        _pat.efe_type = 3;
        _pat.HitOn = false;
        _pat.timeFactor_B = 0.75;
        particleComp.AddParticle(particleComp.pt_bill_Add, _pat);
        /*
            _pat = new Particle();
            _pat.setPos(self.Pos);
            _pat.imageId2 = 0;
            _pat.HitOn = false;
        */

        _pat.setSiz(1);
        _pat.setSizFactor(0);
        _pat.timeFactor_B = 0.75;
        _pat.efe_type = cEnBillbdEfeID.emitter_kokuen_s;

        particleComp.AddParticle(particleComp.pt_bill_Add, _pat);

        oreCommon.playStageSE("bom19_b", self.CenterPos, self.bp.id === 0);

        self.bp.On = false;
        //self.ModelObject.visible = false;
        //self.ModelObject.material.materials[0].visible = false;
        return;
    }


    //移動するかどうかの判断
    //AIによる移動制御
    self.bp.CpuThink.doMove(self.bp, self.Pos, true, true);
    MoveRol = self.bp.Lock_ene_R_Y;
    //移動する場合の処理

    if (self.bp.Inputs[0].KeyA) {
        Add_Vect2.x = -1;
        move = true;
    }
    if (self.bp.Inputs[0].KeyD) {
        Add_Vect2.x = +1;
        move = true;
    }
    if (self.bp.Inputs[0].KeyW) {
        Add_Vect2.y = 1;
        move = true;
    }
    if (self.bp.Inputs[0].KeyS) {
        Add_Vect2.y = -1;
        move = true;
    }

    lp.L_now_Move_Int = self.getMoveInt(Add_Vect2);
    lp.L_moveVect_Y = oreMath.MoveRolVectByInt(lp.L_now_Move_Int);
    if (move && lp.L_now_playerState === cEnPlayer_ActStatus.stand) { lp.L_now_playerState = cEnPlayer_ActStatus.walk; }


    oreCommon.tempQ_Y.setFromAxisAngle(oreMath.rotateAxisY, self.bp.Rol_MstY);
    Now_RolBaseVect.applyQuaternion(oreCommon.tempQ_Y);


    if (self.bp.viewHitMarkCount > 0) self.bp.viewHitMarkCount--;

    if (self.bp.viewAleatCount > 0) {
        self.bp.viewAleatCount--;
        if (self.bp.viewAleatCount === 0) {
            self.bp.viewAleatID = 0;
        }
    }
    if (self.bp.viewAleatCount_Hit > 0) self.bp.viewAleatCount_Hit--;


    // コントローラー情報から操作情報へ
    //self.bp.vect_Y = 0;

    //移動方向が変わったら、self.bp.Movespeedをゼロにしてみる
    //if (self.bp.Move_Int[1] != lp.L_now_Move_Int && self.bp.dashMode == 0) self.bp.Movespeed = 0;


    //強制ロールモードだった場合、バーニア及び歩行キーを無効
    if (self.bp.WpnRolLockFlg) {
        if (self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] === 0) { self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] = 1; }
    }


    //ダッシュ関連
    {

        //ダッシュ開始制御
        if (self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] === 0
            && self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] === 0
            //  && self.bp.dist_time[cEnStat_ParamTime.Stat_use_gain_time] === 0
            && self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] === 0    //ここのコメで、空中ダッシュありなしのONOFF
            && self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] > self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Guse_dashFast]
            && self.bp.using_Time[cEnStat_ParamTime.Stat_move_time] === 0
            && self.bp.dist_time[cEnStat_ParamTime.Stat_use_gain_time] === 0) {

            //入力的に、空白→ボタン　で確定となる
            if (self.bp.Gldon[1] &&
                self.bp.Inputs[0].keyShift
                && !self.bp.Inputs[1].keyShift &&
                self.CheckMoveInt(lp.L_now_Move_Int)//ダッシュは４方向のみ
            ) {

                self.bp.rol_vectY = 0;

                if (lp.L_now_Move_Int === 8) {
                    //ブーストダッシュ
                    now_dash_flg = true;
                    self.bp.dashMode = lEnDashMode.FirstRoling;
                } else {
                    //ステップ
                    now_Step_flg = true;
                }
                //self.bp.LastAct_RolY_f = MoveRol + lp.L_moveVect_Y;
                self.bp.LastAct_RolY_f = MoveRol;
            }

        }


        //ダッシュモーション指定
        if (now_dash_flg) {
            self.bp.LastAct_Move_Int = lp.L_now_Move_Int;

            self.bp.rol_tgtY = MoveRol; // SetRolTgtbyCam(lp.L_moveVect_Y);

            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.Dash_Start_Kaku] = self.bp.Rol_MstY;

            //ゲイン制御
            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] -= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Guse_dashFast];

            //操作キャラだったら、ブラーをOn
            //Game1.bloom.BlurPower = 3;

            //if (self.bp.control_Flg != -1) AllMain.CurrentScreen.SetPlaySound(self.Pos, cEnSoundNames.booster_Start8);

            if (self.bp.Gldon[1]) {   //地上ダッシュ
                lp.L_now_playerState = cEnPlayer_ActStatus.dash;
            }
            else {   //空中ダッシュ
                lp.L_now_playerState = cEnPlayer_ActStatus.dash_J;
                self.bp.vect_Y *= 0.5;
            }

            self.setBaseStat(lp);

        }


        //ダッシュ中制御
        if (self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] > 0) {
            lp.L_RolLock_Flg = true;
            self.bp.UnRefuelTime = 5;
            //self.Rol_vectY = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time]++;
            //ゲイン制御

            //オートパイロット中は、ゲインを減らさない？
            if (self.bp.AutoPirotTime <= 0) {
                self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] -= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Guse_dash];
                self.bp.using_Time[cEnStat_ParamTime.Stat_use_gain_time]++;
            }

            self.bp.dashMode = lEnDashMode.normalDash;
            self.SetDashSpeed(lp);
            //終了判定：ニュートラル、及び角度の判定
            if (self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] > self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Dash_FastBoostTime] + 45) {
                if (self.CheckDashEndMoveInt(lp.L_now_Move_Int) || !self.bp.Inputs[0].keyShift) {
                    dashEndFlg = true;
                }
            }
            //ゲイン封印フラグがたってたらその時点でtrue
            if (self.bp.dist_time[cEnStat_ParamTime.Stat_use_gain_time] > 0 || lp.L_enyWpnUseFLg) dashEndFlg = true;

            self.bp.dashMode = lEnDashMode.noDash;
            //ダッシュ終了処理
            if (dashEndFlg) {
                if (!lp.L_enyWpnUseFLg) {
                    self.bp.dashMode = lEnDashMode.noDash;
                    self.setBaseStat(lp);

                }
                else //終了条件を満たしたが、攻撃中のため終了できない状態がココ。
                {
                    lp.L_now_Move_Int = self.bp.Move_Int[1];
                    lp.L_moveVect_Y = AllMain.oreMath.MoveRolVectByInt(self.bp.Move_Int[1]);
                    lp.L_BaseActEndflg = true;
                    lp.L_RolLock_Flg = false;
                }

            }
            else {   //ダッシュ継続
                lp.L_now_Move_Int = self.bp.Move_Int[1];
            }

        }

    }   //ダッシュ処理　ここまで

    //ステップ処理
    //ステップモーション指定
    if (now_Step_flg) {
        self.bp.LastAct_Move_Int = lp.L_now_Move_Int;
        self.bp.rol_tgtY = MoveRol;
        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.Dash_wStart_Kaku] = self.bp.Rol_MstY;

        //ゲイン制御
        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] -= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Guse_Step];

        lp.L_now_playerState = cEnPlayer_ActStatus.step;
        self.setBaseStat(lp);
        self.bp.LastAct_RolY_f = MoveRol + lp.L_moveVect_Y;
    }
    //ステップ中制御
    if (self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] > 0) {
        lp.L_RolLock_Flg = true;
        self.bp.UnRefuelTime = 5;
        f = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.rool_S_stand] * 3;
        self.SetDiffRol2(f);
        //self.Rol_vectY = 0;
        self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time]++;

        if (self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] >= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.StepT_short]) {
            lp.L_now_playerState = cEnPlayer_ActStatus.tach_Down;
            self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.StepT_End];
            self.setBaseStat(lp);
        }
        else if (self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] >= 10) {
            lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_up] * 3;
            lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max] * 1.5;
        }
        else {   //開始前のスキ
            lp.TmpAddSpeed = 0;
            lp.TgtMoveSpeed = 0;
        }
    }


    {
        //ジャンプ関連
        /*
        //ジャンプ制御開始

        if (self.bp.Gldon[1] && self.bp.Inputs[0].keyShift
                   && !self.bp.Inputs[1].keyShift
            && !now_dash_flg && !now_Step_flg
            ) {
            if (self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] == 0 &&
                    self.bp.dist_time[cEnStat_ParamTime.Stat_use_gain_time] == 0
                 && self.bp.using_Time[cEnStat_ParamTime.Stat_move_time] == 0
                 && self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] > self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Guse_junpfast]
                ) {
                self.bp.IsDashJunp = (self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] > 3);

                lp.L_now_playerState = cEnPlayer_ActStatus.Junp;
                self.setBaseStat(lp);
                self.bp.vect_Y = 0;

            }
        }


        //ジャンプ中制御
        if (self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] > 0) {
            self.bp.using_Time[cEnStat_ParamTime.Stat_use_gain_time]++;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time]++;
            self.bp.UnRefuelTime = 10;

            if (self.bp.using_Time[cEnStat_ParamTime.Stat_Kaku_time] == 0 && self.bp.using_Time[cEnStat_ParamTime.Stat_BstKaku_Time] == 0) {
                //空中処理：通常
                if (lp.L_now_AnimeID == cEnPlayer_Motion.Junp) {
                    //  ジャンプ開始時の硬直↓
                    if (self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] > self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junp_Kotyoku]) {
                        //ゲイン制御
                        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] -= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Guse_junp];
                        self.bp.Gldon[1] = false;
                        self.bp.Gldon[0] = false;
                        //垂直ジャンプかどうかの判断
                        //if (prmP.LastAct_Move_Int == 0)
                        {
                            if (self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpS_max] > self.bp.vect_Y) {
                                self.bp.vect_Y += self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpS_up];
                            }
                            else {
                                self.bp.vect_Y -= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpS_up];
                            }
                        }

                        self.bp.vect_Y += 0.03; //最低この数字はたさないと上昇しない

                        {
                            //初期ブースト以外
                            //if (prmP.LastAct_Move_Int != 0)
                            {
                                lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpD_up];
                                lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpMoveFact];
                            }
                        }
                    }
                    else if (self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] == self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junp_Kotyoku]) {
                        //硬直終了直後。実質空中判定開始
                        self.bp.Gldon[1] = false;
                        self.bp.Gldon[0] = false;
                        //ゲイン制御
                        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] -= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Guse_junpfast];
                        self.bp.LastAct_Rol.copy(self.Rol);
                        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.Dash_Start_Kaku] = lp.L_moveVect_Y;
                        self.bp.LastAct_Move_Int = lp.L_now_Move_Int;
                        lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Dash_FastBoost];
                        lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max] * 1.5;

                        if (self.bp.vect_Y < 0) self.bp.vect_Y = 0;

                        //ジャンプ開始時
                        self.bp.vect_Y += self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpD_up] * 3;

                    }
                    else {   //初期硬直中
                        //if (prmP.IsDashJunp)
                        {
                            self.bp.Gldon[1] = true;
                            //横へのベクトルが維持できるようにする
                            self.bp.vect_Y = -0.05;
                            lp.L_now_Move_Int = self.bp.Move_Int[1];
                        }
                    }
                }


                if (lp.L_now_playerState == cEnPlayer_ActStatus.dash_J && self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max] > self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpD_max]) {
                    //空中ダッシュより地上ダッシュのほうが早かった場合、ダッシュ中に下向を加える
                    self.bp.vect_Y = -0.05;
                }

                //ジャンプ終了判定
                if (lp.L_now_playerState == cEnPlayer_ActStatus.Junp
                    && self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] > self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junp_Kotyoku] + 10
                    && (!self.bp.Inputs[0].keyShift || self.bp.dist_time[cEnStat_ParamTime.Stat_use_gain_time] > 0)) {
                    if (!lp.L_enyWpnUseFLg) {
                        lp.L_now_playerState = cEnPlayer_ActStatus.J_Down;
                        self.setBaseStat(lp);

                        //AllMain.CurrentScreen.SetPlaySound(self.Pos, cEnSoundNames.Bust_end8);
                    }
                }
                //下降中判定
                if (lp.L_now_playerState == cEnPlayer_ActStatus.J_Down || lp.L_enyWpnUseFLg) {
                    //tmp_Vect = Vector3.Transform(Vector3.UnitZ, Matrix.CreateRotationY(self.Rol_MstY + L_moveVect_Y)) * clsPlayerResource.CharaParams.CharaParam( meca_Id).meca_Stat_Const_f[ cEnConsts_ParamF.warkS_up];
                    lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.warkS_up];
                    lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpS_max];

                    //ジャンプ開始制御
                    if (self.bp.dist_time[cEnStat_ParamTime.Stat_use_gain_time] == 0) {
                        if (self.bp.Inputs[0].keyShift
                            && !self.bp.Inputs[1].keyShift
                            && !lp.L_enyWpnUseFLg) {
                            lp.L_now_playerState = cEnPlayer_ActStatus.Junp;
                            self.setBaseStat(lp);
                            self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junp_Kotyoku] + 1;
                            if (self.bp.vect_Y < 0) self.bp.vect_Y = 0;
                            //AllMain.CurrentScreen.SetPlaySound(self.Pos, cEnSoundNames.booster_Start8);
                        }
                    }
                }
                
            }
        }
        else {   //やられモーションでここに？
            if (!self.bp.Gldon[0] && lp.IsDamage) {
                if (self.bp.vect_Y > -2.5) {
                    if (self.bp.vect_Y > 0) {
                        self.bp.vect_Y -= 0.025;
                    }
                    else {
                        self.bp.vect_Y -= 0.010;
                    }
                }
            }
        }
        */
    } //ジャンプ&下降処理　ここまで


    //武器を撃つ
    {
        //何の武器を撃つか
        if (self.bp.Inputs[0].Mouse_L) {
            tmpWpnID = 0;
        }
        if (self.bp.Inputs[0].Mouse_R) {
            tmpWpnID = 1;
        }

        if (tmpWpnID >= 0 && self.bp.weapon_use_Time[tmpWpnID] != null) {
            self.MountWeapons[tmpWpnID].LinkUpdate(self.BaseObject.mountWpnBone[tmpWpnID]);

            if (self.bp.weapon_use_Time[tmpWpnID] === 0) {
                //打とうとしてる武器は確定。実際に打てるかの判断
                if (self.MountWeapons[tmpWpnID].CanBullet && self.bp.dist_time[cEnStat_ParamTime.Stat_Shot_time] === 0
                    && self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] === 0 && self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] === 0) {
                    //打てる。
                    self.WeaponMotonStep = 0;
                    lp.L_wpn_A = self.SetWeaponMotion(tmpWpnID);
                    self.bp.weapon_use_Time[tmpWpnID] = 1;
                    self.enyWeaponUseFlg = true;
                } else {
                    //打とうとしてるけど打てなかったのがココ
                }
            } else {
                //打ってる最中がココ
                self.bp.weapon_use_Time[tmpWpnID]++;
                //撃つ
                if (self.MountWeapons[tmpWpnID].CanBullet) {
                    self.MountWeapons[tmpWpnID].Fire(self.bp.TgtView_pos, self.bp.AttackFact, self.bp.id, tmpWpnID, [self.bp.Lock_Tgt[0]]);
                }
            }
        }
    }

    {
        //歩行制御
        if (lp.L_now_playerState === cEnPlayer_ActStatus.walk
            || lp.L_now_playerState === cEnPlayer_ActStatus.stand
        ) {

            self.SetMotionByKey(lp);

            if (lp.L_now_Lock_Tgt === -1) {
                //非ロックオン時、真横時は移動なし //2011/07/18　変更：横移動でも移動
                //if (L_now_Move_Int > 0 && L_now_Move_Int != 4 && L_now_Move_Int != 6)
                if (lp.L_now_Move_Int > 0 && lp.L_now_Move_Int != 5) {
                    lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.warkS_up];
                    lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.warkS_max];
                }
            }
            else {
                if (lp.L_now_Move_Int > 0 /*&& self.bp.Lw_AttakingLv == 0*/) {
                    lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.warkS_up];
                    lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.warkS_max];
                }
            }
        }

        if (self.bp.HitStoppingTime > 0) { lp.TmpAddSpeed = 0; lp.TgtMoveSpeed = 0; }

    }//歩行制御　ここまで

    ////////////////////

    {
        if (self.BaseObject.UpBodyBone != null) {
            self.BaseObject.UpBodyBone.appendMatrix.identity();
        }

        //回転方向制御
        //途中で変わってる可能性が高いので、再セット
        //self.Rol_vectY  = AllMain.oreMath.MoveRolVectByInt(ref lp.L_now_Move_Int);

        //ダメージ中ならself.Rol_vectYはゼロのまま
        if (!lp.IsDamage) {
            var tmpf, tmpf2, f3;
            //Vector3 tmpV_r;
            var tmpB;

            if (lp.L_now_Lock_Tgt === -1) {   //非ロックオン字
                //ダッシュしているときも別ロジック
                if (self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] === 0 && self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] === 0 && self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] === 0) {

                    //移動方向に前又は後ろがあったら、カメラの向きとの差を計算して回転方向を決定する
                    if (lp.L_now_playerState === cEnPlayer_ActStatus.walk ||
                        lp.L_now_playerState === cEnPlayer_ActStatus.stand ||
                        lp.L_now_playerState === cEnPlayer_ActStatus.Junp ||
                        lp.L_now_playerState === cEnPlayer_ActStatus.J_Down
                        //|| L_now_playerState == cEnPlayer_ActStatus.step
                    ) {
                        tmpf = 0.0;
                        var tmp3 = 0.0;

                        switch (lp.L_now_Move_Int) {

                            case 7: tmpf = -KD045; tmp3 = KD030; break;
                            case 4: tmpf = 0; tmp3 = KD045 + KD030; break;
                            case 1: tmpf = KD045; tmp3 = -KD030; break;

                            case 9: tmpf = KD045; tmp3 = -KD030; break;
                            case 6: tmpf = 0; tmp3 = -KD045 - KD030; break;
                            case 3: tmpf = -KD045; tmp3 = KD030; break;

                            case 2: tmpf = 0; break;

                            default:
                                break;
                        }


                        if (lp.L_enyWpnUseFLg) {
                            tmpf = 0;
                            //とりあえず上半身を強制的に正面に戻す
                            if (self.BaseObject.UpBodyBone != null) {
                                self.BaseObject.UpBodyBone.appendMatrix.makeRotationY(self.bp.Lock_ene_R_Y_dif);
                            }
                        }


                        if ((lp.L_now_Move_Int != 0 && lp.L_now_Move_Int != 5) || lp.L_enyWpnUseFLg) {
                            self.tmpV3.copy(self.bp.TgtView_pos);
                            self.tmpV3.sub(self.Pos);
                            tmpf2 = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.rool_S_stand];
                            if (lp.L_enyWpnUseFLg) { tmpf2 *= 2; }
                            tmpB = false;
                            self.SetDiffRol(self.tmpV3, tmpf, tmpf2, tmpB);


                            self.bp.rol_vectY

                        }

                    }

                }
                else if (!self.bp.Gldon[1]) {   //空中制御
                    if (rol_X != 0) {
                        rol_X *= 0.8;
                        if (Math.abs(rol_X) < 0.1) rol_X = 0;
                    }

                    if (lp.L_now_Move_Int != 0 && lp.L_now_Move_Int != 5) {
                        rol_Z += air_rol_Add;
                    }
                    else {
                        rol_Z *= 0.8;
                        if (Math.abs(rol_Z) < 0.1) rol_Z = 0;
                    }
                    f3 = lp.TgtMoveSpeed * 0.5;
                    //rol_Z = AllMain.oreMath.SettingKaku(rol_Z, (float)TgtMoveSpeed);
                    rol_Z = Math.clamp(rol_Z, -f3, f3);

                    self.tmpV3.copy(self.bp.TgtView_pos);
                    self.tmpV3.sub(self.Pos);
                    tmpf = 0.0;
                    tmpf2 = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.rool_S_stand];
                    if (lp.L_enyWpnUseFLg) { tmpf2 *= 2; }
                    tmpB = false;
                    self.SetDiffRol(self.tmpV3, tmpf, tmpf2, tmpB);

                }
            }

        }

    }////  回転制御

    {

        //移動の算出
        //前フレームの移動速度がターゲット速度を超えてなかったら、ベクトル加算
        //移動方向=tmp_Vectを算出する
        //Vector3 tmp_Vect = Vector3.Zero;
        var befHeight;

        befHeight = self.Pos.y;

        //移動方向の決定
        if (self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] > 0 || self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] > 0) {
            //ステップ中
            oreCommon.tempQ_Y.setFromAxisAngle(oreMath.rotateAxisY, self.bp.LastAct_RolY_f);
            self.tmpV3.set(0, 0, -1);
            self.tmpV3.applyQuaternion(oreCommon.tempQ_Y);

        }
        else {
            //それ以外
            oreCommon.tempQ_Y.setFromAxisAngle(oreMath.rotateAxisY, MoveRol/* + lp.L_moveVect_Y*/);
            self.tmpV3.set(0, 0, -1);
            self.tmpV3.applyQuaternion(oreCommon.tempQ_Y);
        }


        ////////////////////////////////////////
        ////////    最終的な移動（現在の加速値）の決定！
        //////////////////////////////////////////////////////////////////////////////  
        if (lp.TgtMoveSpeed != 0) {
            Add_Vect2.set(self.tmpV3.x, self.tmpV3.z);
            //Add_Vect2 = Vector2.Multiply(Add_Vect2, (float)lp.TmpAddSpeed);
            self.bp.Movespeed = self.bp.Movespeed + lp.TmpAddSpeed;
            self.bp.Movespeed = Math.min(self.bp.Movespeed, lp.TgtMoveSpeed);// * 0.5;

            Add_Vect2.multiplyScalar(self.bp.Movespeed);

            Add_Vect2.add(lp.bef_Vect2D);
            //目標を超えてた
            var overf = lp.TgtMoveSpeed - Add_Vect2.length();
            if (overf < 0) {
                if (Add_Vect2.length() > 0) Add_Vect2.normalize();

                Add_Vect2.multiplyScalar(lp.TgtMoveSpeed - overf * 0.6);
            }

            //格闘処理かつ空中処理だった場合、さらにYベクトルを乗算
            if (self.bp.using_Time[cEnStat_ParamTime.Stat_Kaku_time] > 0 && self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] > 0) {
                f1 = Math.Abs(self.bp.Lock_ene_V_N.y) - 0.5;
                if (f1 > 0)
                    Add_Vect2.multiplyScalar(1 - f1);
            }


        }
        else {   //ゼロだった場合。ゼロの原因（状況）により、減速値を指定
            Add_Vect2.set(lp.bef_Vect2D.x, lp.bef_Vect2D.y);

            //着地
            if (lp.L_now_playerState === cEnPlayer_ActStatus.tach_Down) {
                if (self.bp.dashWpnUseFlg) {
                    //Add_Vect2 *= clsPlayerResource.CharaParams.CharaParam(meca_Id).meca_Stat_Const_f[cEnConsts_ParamF.ext_brake] ;
                    Add_Vect2.multiplyScalar(self.bp.meca_Stat_Const_f[cEnConsts_ParamF.ext_brake]);
                }
                else {
                    //Add_Vect2 *=  clsPlayerResource.CharaParams.CharaParam(meca_Id).meca_Stat_Const_f[cEnConsts_ParamF.Stand_Brake];
                    Add_Vect2.multiplyScalar(self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Stand_Brake]);
                }

                //硬直中は、En回復量3倍
                //self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] += self.bp.meca_Stat_Const_f[cEnConsts_ParamF.gein_regeinS] * 2;
                //2011/11/24　すぐには回復させないようにした
                if (self.bp.motionTime < 10) {
                    //self.bp.UnRefuelTime = 2;
                    self.bp.dist_time[cEnStat_ParamTime.Stat_use_gain_time] = 2;
                }
                else {
                    //self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] += self.bp.meca_Stat_Const_f[cEnConsts_ParamF.gein_regeinS];
                }

                self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] += self.bp.meca_Stat_Const_f[cEnConsts_ParamF.gein_regeinS];

                //着地から立ちへのロジック
                if (Add_Vect2.length() <= self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Stand_Brake] * 0.5
                    && self.bp.motionTime > 15
                    && self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] === 0
                    && !lp.L_enyWpnUseFLg) {
                    {
                        lp.L_now_AnimeID = cEnPlayer_Motion.stand;
                        lp.L_ActFuct = 0.1;
                        self.bp.LastAct_Move_Int = 0;
                        lp.L_now_playerState = cEnPlayer_ActStatus.stand;
                        self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] = 0;
                        self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
                        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 0;
                        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.FactorAdd] = 0.1;
                        self.bp.dashWpnUseFlg = false;
                    }
                }
            }
            else {
                //突っ立ってた場合？
                //攻撃時移動減速処理
                Add_Vect2.multiplyScalar(self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Stand_Brake]);
            }
        }
        if (Add_Vect2.length() < 0.005) { Add_Vect2 = new THREE.Vector2(0, 0); } //ここでカットする値は、歩行及びダッシュ開始速度の最低必要値になる

        //self.bp.Vect = new Vector3(Add_Vect2.X, self.bp.vect_Y, Add_Vect2.Y);

        //移動速度調整値
        Add_Vect2.multiplyScalar(Master_Move_Rate);
        self.bp.Vect.set(Add_Vect2.x, self.bp.vect_Y, Add_Vect2.y);
        self.bp.Vect2.copy(Add_Vect2);
        self.bp.Movespeed = Add_Vect2.length();


        //角度の決定

        var befF = self.bp.Rol_MstY;

        if (self.bp.AutoPirotTime <= 0) {
            if (self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] > 0 && !lp.L_enyWpnUseFLg) { self.Rol_vectY = 0; }

            self.bp.Rol_MstY += self.bp.Rol_vectY;
            self.bp.Rol_MstY = oreMath.LimitKakuPI(self.bp.Rol_MstY);

            if (self.bp.rol_vectY > 0)
            { self.bp.rol_vectY -= 0.03; }
            else
            { self.bp.rol_vectY += 0.03; }
            if (Math.Abs(self.bp.rol_vectY) < 0.035) { self.bp.rol_vectY = 0; }

        }
        else {
            self.bp.Rol_MstY -= self.bp.rol_vectY;
            self.bp.rol_vectY = 0;
        }
        self.Rol.setFromAxisAngle(oreMath.rotateAxisY, self.bp.Rol_MstY);

        //地形や強制を考慮した最終的な移動の決定


        //ノックバックの強制ベクトル
        ForceVect = self.SetNockBackMove(true);

        if (lp.L_now_playerState != cEnPlayer_ActStatus.down_1 && lp.L_now_playerState != cEnPlayer_ActStatus.down_2)
        { ForceVect.y = 0; }

        //位置の仮決定
        LastVect.copy(self.bp.Vect);
        LastVect.add(self.bp.FrcVct);

        tmpLastPos.copy(self.Pos);
        tmpLastPos.add(LastVect);


        //最終ベクトル仮決定
        LastVect.copy(tmpLastPos);
        LastVect.sub(self.Pos);
        //LastVect.normalize();

        //移動後壁判定
        self.bp.HitWall = false;

        //if (!Hitwall2)
        {
            {
                if (self.bp.Gldon[1]) { self.rol_X = 0; self.rol_Z = 0; }

                //self.bp.vect_Y -= 0.05;
                //何もしていなくても、下向きのベクトルを付ける
                if (self.bp.vect_Y > -3) { self.bp.vect_Y -= 0.01; }


                self.bp.HitWall = false;
                //まず、進行方向直近が壁じゃないかどうかを調べる
                var v_p, vankF;
                self.tmpV3.copy(LastVect); self.tmpV3.normalize();

                //移動後の地点が高過ぎないかどうかをチェック

                L_temp_Y = oreCommon.GetPosHeight(tmpLastPos);

                //if (v_p == 0)
                if (L_temp_Y - self.Pos.y > 20)  //2011-2-24 50を20に
                {
                    //self.bp.Vect = Vector3.Zero;
                    LastVect.x = 0;
                    LastVect.z = 0;
                    //壁に当たってたというフラグ
                    //if (v_p == 0)
                    {
                        self.bp.HitWall = true;
                    }
                }
                else {
                    if (self.bp.Gldon[1]) {
                        /*  傾斜考慮は後回し

                        //次に、移動予定位置の高さを調べる
                        vankF = 0.5;
                        v_p = GetGroundMove(LastVect, self.Pos, f1, vankF);
                        if (v_p >= 0) {
                            //ただの歩行だったら、斜面の影響を受ける
                            if (self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] == 0) {
                                LastVect = Vector3.Multiply(LastVect, v_p);
                            }
                            //壁に当たってたというフラグ
                            if (v_p == 0) {
                                self.bp.HitWall = true;
                            }
                        }
                        else {
                            //傾斜でマイナスになるというフラグが帰ってきたら、下降モーションにしてしまえ
                            if (!lp.IsDamage) {
                                lp.L_now_playerState = cEnPlayer_ActStatus.J_Down;
                                setBaseStat(lp);
                                self.bp.Gldon[1] = false;
                            }
                        }
                        */

                        if (L_temp_Y - self.Pos.y < -20) {
                            //傾斜でマイナスになるというフラグが帰ってきたら、下降モーションにしてしまえ
                            if (lp.IsDamage === false) {
                                lp.L_now_playerState = cEnPlayer_ActStatus.J_Down;
                                self.setBaseStat(lp);
                                self.bp.Gldon[1] = false;
                            }
                        }
                    }
                }
            }
        }
        //LastVect = self.bp.Vect;

        //古い座標（加算前の座標）を保持   
        Now_RolBaseVect.copy(self.Pos);
        Now_RolBaseVect.add(LastVect);
        L_temp_Y = self.bp.berGldPos.y;

        //エリアオーバーチェック（スキップ中
        tmpgloundflg = true;
        /*
        if (self.bp.control_Flg != -1) {
            tmpgloundflg = true;
            AllMain.CurrentScreen.BtScreen.DistinctionPos2(Now_RolBaseVect);
        }
        else {
            tmpgloundflg = true;
        }
        */

        //if (!AllMain.CurrentScreen.BtScreen.isDemoCamUse) AllMain.CurrentScreen.BtScreen.LimitStageMax(prm);


        if (tmpgloundflg && !self.bp.HitWall) {
            //  !!  これが、ホントに最終一歩手前の座標の確定 !!  ------------------------------------------------------
            self.Pos.copy(Now_RolBaseVect);
        }


        self.Pos.y += LastVect.y;

        //地面に接地させる

        //地形の「端」の判別
        if (tmpgloundflg) {
            L_temp_Y = oreCommon.GetPosHeight(self.Pos);
        }


        if (!tmpgloundflg) {
            self.bp.berGldPos = L_temp_Y;
            if (self.bp.Gldon[1]) { self.Pos.y = L_temp_Y; }
        }

        //接地判定！
        if (self.bp.Gldon[1] && L_temp_Y >= self.Pos.y) {
            //簡易版
            self.Pos.y = L_temp_Y;
            NowAltitude = 0;
            self.bp.vect_Y = 0;
        }
        else {
            self.bp.berGldPos = L_temp_Y;
            var isTachDown = false;

            NowAltitude = L_temp_Y - self.Pos.y;
            if (NowAltitude < 0) NowAltitude = 0;

            //簡易着地判定　
            if (L_temp_Y > self.Pos.y - self.bp.vect_Y) {
                if (lp.L_now_playerState === cEnPlayer_ActStatus.J_Down || lp.L_now_playerState === cEnPlayer_ActStatus.Junp) {
                    //攻撃中は、着地させない
                    if (lp.L_enyWpnUseFLg) {
                    }
                    else {
                        //着地
                        lp.L_now_playerState = cEnPlayer_ActStatus.tach_Down;
                        self.setBaseStat(lp);
                        self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] = 25;
                        //self.Pos.y = L_temp_Y;
                    }
                }
                else if (lp.L_now_playerState === cEnPlayer_ActStatus.dash_J) {   //空中ダッシュだった場合。地上ダッシュのほうが早いキャラなら、地上ダッシュへ移行する
                    if (self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max] > self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpD_max]) {
                        self.bp.Gldon[1] = true; self.bp.Gldon[0] = true;
                        lp.L_now_playerState = cEnPlayer_ActStatus.dash;
                        self.bp.playerState = lp.L_now_playerState;
                        self.bp.motionTime = 0;
                        self.SetMotionByKey(lp);

                    }
                }

                self.Pos.y = L_temp_Y;
                self.bp.vect_Y = 0;
            }

            //ダウン開始からダウン中への判定
            if (self.bp.playerState === cEnPlayer_ActStatus.down_1) {
                if (L_temp_Y > self.Pos.Y) {
                    self.Pos.y = L_temp_Y;
                }

                if (self.bp.now_A === cEnPlayer_Motion.down_1_2) {
                    if (L_temp_Y >= self.Pos.y - 2 && !Hitwall2) {
                        self.bp.Gldon[0] = true; self.bp.Gldon[1] = true;
                        lp.L_now_playerState = cEnPlayer_ActStatus.down_2;
                        lp.L_now_AnimeID = cEnPlayer_Motion.down_2;
                        self.bp.motionTime = 0;

                        lp.L_AddTachEfeFlg = true;
                        lp.L_ActFuct = -1;
                        NowAltitude = 0;
                    }
                }
            }
        }

        {
            var Efe_siz = 10;
            //Vector3 tmpv;
            //tmpV3 = Vector3.Add(Pos, -CenterHeight);
            self.tmpV3.copy(self.Pos);
            /*
            if (lp.L_AddTachEfeFlg) {
                AllMain.CurrentScreen.BtScreen.BT_Effects.AddTachEffect(p, tmpV3, Efe_siz, self.bp.Vect);
                tmpV3 = Pos;
                AllMain.CurrentScreen.SetPlaySound(tmpV3, cEnSoundNames.bosu27);
            }

            if (lp.L_AddDashStartFlg && GldOn[0]) AllMain.CurrentScreen.BtScreen.BT_Effects.AddBackBlastEffect(p, tmpV3, Efe_siz, self.bp.Vect);
            */
        }

        //最終位置マジ決定
        LastVect.copy(self.Pos);
        LastVect.sub(tmpLastPos);

        //prmP.RenewMX(self.Pos, self.Rol);

        if (lp.L_now_playerState === self.bp.playerState) {
            self.bp.motionTime++;
        }
        else {
            self.bp.motionTime = 0;
        }
        //self.bp.LastFrameIsNotRenewPos = lp.isNotRenewTgtPos;

        //アニメーションIDが違っていれば、アニメーションを変更
        /*
        if (self.bp.now_A != lp.L_now_AnimeID) {
            var tmpB = true;
            self.ChangeFlame(lp.L_now_playerState, lp.L_now_AnimeID, lp.L_ActFuct, tmpB);
        }
        */
        self.bp.Gldon[0] = self.bp.Gldon[1];

        //あたり判定級の更新
        for (var i = 0; i < self.BaseObject.BoundingLinkers.length; i++) {
            self.BaseObject.BoundingLinkers[i].Update(self.Pos);
        }
    }

    //確定情報のセット
    self.bp.Inputs[1].copy(self.bp.Inputs[0]);
    self.bp.Move_Int[1] = lp.L_now_Move_Int;
    self.CenterPos.copy(self.Pos);
    self.CenterPos.add(self.bp.Centerheight);
    self.bp.Pos.copy(self.Pos);

    self.ModelObject.position.copy(self.Pos);
    oreCommon.tempQ_Y.setFromAxisAngle(oreMath.rotateAxisY, self.bp.Rol_MstY);
    self.ModelObject.setRotationFromQuaternion(oreCommon.tempQ_Y);

    //ゲイン回復
    self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] += self.bp.meca_Stat_Const_f[cEnConsts_ParamF.gein_regeinS];
    self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n] = Math.min(self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.gein_n], self.bp.meca_Stat_Const_f[cEnConsts_ParamF.gein_max]);

    for (var i = 0; i < self.MountWeapons.length; i++) {
        self.MountWeapons[i].FixedWpnUpdate(oreCommon.dulTime);
    }

}

//アニメーションがないオブジェクトのボーンのみを割り当てる
clsEtcUnit.prototype.BoneUpdate = function (_dultime) {
    var self = this;
    if (self.BaseObject.UpBodyBone != null) {
        self.tmpMx.copy(self.BaseObject.UpBodyBone.BaseMatrix);
        self.tmpMx.multiply(self.BaseObject.UpBodyBone.appendMatrix);
        self.BaseObject.UpBodyBone.matrix.identity();
        self.BaseObject.UpBodyBone.applyMatrix(self.tmpMx);
        self.BaseObject.UpBodyBone.updateMatrix();
        self.BaseObject.UpBodyBone.matrixWorldNeedsUpdate = true;
    }
}

//装備位置からモーションを返す
clsEtcUnit.prototype.SetWeaponMotion = function (tmpWpnID, _step) {
    var self = this;
    var L_now_AnimeID = 0;
    if (_step != undefined) { self.WeaponMotonStep = _step; }
    //モーションを指定
    switch (self.MountWeapons[tmpWpnID].wpn_type) {
        case cEnWpnType.RW_2_RF: L_now_AnimeID = cEnPlayer_Motion.RW_2_RF_N; break;
        case cEnWpnType.RW_2_MG: L_now_AnimeID = cEnPlayer_Motion.RW_2_MG_N; break;
        //RW_2_LC,
        case cEnWpnType.RW_2_BZ: L_now_AnimeID = cEnPlayer_Motion.RW_2_BZ; break;
        case cEnWpnType.LW_2_RF: L_now_AnimeID = cEnPlayer_Motion.LW_2_RF_N; break;
        case cEnWpnType.LW_2_MG: L_now_AnimeID = cEnPlayer_Motion.LW_2_MG_N; break;
        //case cEnWpnType.LW_2_LC: lp.L_now_AnimeID = cEnPlayer_Motion.LW_2_RF_N; break;
        case cEnWpnType.LW_2_BZ: L_now_AnimeID = cEnPlayer_Motion.LW_2_BZ; break;

        ////////////////////////////////
        case cEnWpnType.SW_2_N:
            if (tmpWpnID === 2 || tmpWpnID === 4) {
                L_now_AnimeID = cEnPlayer_Motion.SW_R;
            } else {
                L_now_AnimeID = cEnPlayer_Motion.SW_L;
            }
            break;
        case cEnWpnType.SW_2_LGT:
            if (tmpWpnID === 2 || tmpWpnID === 4) {
                L_now_AnimeID = cEnPlayer_Motion.SW_R_LGT;
            } else {
                L_now_AnimeID = cEnPlayer_Motion.SW_L_LGT;
            }
            break;
        case cEnWpnType.SW_2_GG_DL: L_now_AnimeID = cEnPlayer_Motion.SW_2_GG_DL; break;
        case cEnWpnType.SW_2_DL: L_now_AnimeID = cEnPlayer_Motion.SW_2_DL; break;

    }
    L_now_AnimeID = L_now_AnimeID + self.WeaponMotonStep;
    self.ChangeFlame_A(L_now_AnimeID, 1);

    return L_now_AnimeID;
}

clsEtcUnit.prototype.UpdateMounts = function () {
    /*  「武器の位置を合わせる」だけという使用目的なら、いらない。
    var self = this;
    //武器位置のセット
    var keys = Object.keys(self.BaseObject.mountWpnBone);
    for (var m = 0; m < keys.length; m++) {
        if (self.BaseObject.mountWpnBone[keys[m]].mounting != null) {
            self.BaseObject.mountWpnBone[keys[m]].mounting.mesh.matrix = new THREE.Matrix4();
            self.BaseObject.mountWpnBone[keys[m]].mounting.mesh.applyMatrix(self.BaseObject.mountWpnBone[keys[m]].MountMx);
            //self.BaseObject.mountWpnBone[keys[m]].mounting.mesh.applyMatrix(self.BaseObject.mountWpnBone[keys[m]].matrixWorld.multiply(self.BaseObject.mountWpnBone[keys[m]].MountMx));

        }
    }
    */
}

///////////////////////

/// <summary>
/// 再生フレームを変更する
/// </summary>
/// <param name="AfterState">変更後の基本ステータスNo</param>
/// <param name="AnimeId">変更するアニメID</param>
/// <param name="factorAdd">モーション補完加算地。　-1=モーション補完なし</param>
clsEtcUnit.prototype.ChangeFlame = function (AfterState, AnimeId, factorAdd) {
    var self = this;
    self.bp.playerState = AfterState;
    self.bp.bef_A = self.bp.now_A;
    self.bp.now_A = AnimeId;
    if (factorAdd === -1) {
        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 1;
    }
    else { self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 0; }

    if (factorAdd < 0.1) factorAdd = 0.1;
    self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.FactorAdd] = factorAdd;

    //ここは良くないなぁ。非常に良くない
    switch (AnimeId) {

        case cEnPlayer_Motion.stand: self.beginAnimation("stand", false, false); break;
        case cEnPlayer_Motion.walk: self.beginAnimation("walk", false, false); break;
        case cEnPlayer_Motion.walk_L: self.beginAnimation("walk_L", false, false); break;
        case cEnPlayer_Motion.walk_R: self.beginAnimation("walk_R", false, false); break;
        case cEnPlayer_Motion.back: self.beginAnimation("back", false, false); break;
        case cEnPlayer_Motion.dash_F: self.beginAnimation("dash", false, true); break;
        case cEnPlayer_Motion.tach_Down: self.beginAnimation("tach_Down", false, true); break;
        case cEnPlayer_Motion.Junp: self.beginAnimation("Junp", false, true); break;
        case cEnPlayer_Motion.J_Down: self.beginAnimation("J_Down", false, false); break;

        case cEnPlayer_Motion.Step_F: self.beginAnimation("dash_F", false, true); break;
        case cEnPlayer_Motion.Step_B: self.beginAnimation("dash_B", false, true); break;
        case cEnPlayer_Motion.Step_L: self.beginAnimation("dash_L", false, true); break;
        case cEnPlayer_Motion.Step_R: self.beginAnimation("dash_R", false, true); break;

        /////////////

    }

    if (AnimeId > cEnPlayer_Motion.RW_2_Base) { self.ChangeFlame_A(AnimeId, factorAdd) };

    //↓これはマダ
    //SetAnimeBones();

}


/// <summary>
/// 再生フレームを変更する（攻撃用）
/// </summary>
/// <param name="AnimeId">変更するアニメID</param>
/// <param name="factorAdd">モーション補完加算地。　-1=モーション補完なし</param>
clsEtcUnit.prototype.ChangeFlame_A = function (AnimeId, factorAdd) {
    var self = this;
    self.bp.wpn_A = AnimeId;
    if (factorAdd === -1) {
        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 1;
    }
    else { self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 0; }

    if (factorAdd < 0.1) factorAdd = 0.1;
    self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.FactorAdd] = factorAdd;

    //ここは良くないなぁ。非常に良くない
    switch (AnimeId) {

        case cEnPlayer_Motion.RW_2_RF_N: self.beginAnimation("RW_2_RF_N", true); break;
        case cEnPlayer_Motion.RW_2_RF_2_N: self.beginAnimation("RW_2_RF_2_N", true); break;
        case cEnPlayer_Motion.RW_2_RF_Shot_N: self.beginAnimation("RW_2_RF_Shot_N", true); break;
        case cEnPlayer_Motion.RW_2_RF_End_N: self.beginAnimation("RW_2_RF_End_N", true); break;

    }

    //↓これはマダ
    //SetAnimeBones();

}




/// <summary>
/// キー入力からモーションをセットする
/// </summary>
/// <param name="now_Move_Int">移動方向</param>
clsEtcUnit.prototype.SetMotionByKey = function (lp) {
    var self = this;
    self.bp.playerState = lp.L_now_playerState;
    self.bp.motionTime = 0;


    switch (lp.L_now_playerState) {
        //地上ダッシュ
        case cEnPlayer_ActStatus.dash:
            ////
            lp.L_now_AnimeID = cEnPlayer_Motion.dash_F;
            lp.L_ActFuct = 0.2;
            break;


        //空中ダッシュ
        case cEnPlayer_ActStatus.dash_J:
            lp.L_now_AnimeID = cEnPlayer_Motion.dash_S;
            lp.L_ActFuct = 0.2;
            break;


        //ステップ
        case cEnPlayer_ActStatus.step:
            switch (lp.L_nowMoveIntbyTgtVect) {
                case 2: lp.L_now_AnimeID = cEnPlayer_Motion.Step_B; lp.L_ActFuct = 0.2; break;
                case 1: lp.L_now_AnimeID = cEnPlayer_Motion.Step_B; lp.L_ActFuct = 0.2; break;
                case 3: lp.L_now_AnimeID = cEnPlayer_Motion.Step_B; lp.L_ActFuct = 0.2; break;

                case 8: lp.L_now_AnimeID = cEnPlayer_Motion.Step_F; lp.L_ActFuct = 0.2; break;
                case 7: lp.L_now_AnimeID = cEnPlayer_Motion.Step_F; lp.L_ActFuct = 0.2; break;
                case 9: lp.L_now_AnimeID = cEnPlayer_Motion.Step_F; lp.L_ActFuct = 0.2; break;

                case 4: lp.L_now_AnimeID = cEnPlayer_Motion.Step_L; lp.L_ActFuct = 0.2; break;
                case 6: lp.L_now_AnimeID = cEnPlayer_Motion.Step_R; lp.L_ActFuct = 0.2; break;
                default: break;
            }
            break;

        //歩き
        case cEnPlayer_ActStatus.stand:
        case cEnPlayer_ActStatus.walk:

            //if (self.enyWeaponUseFlg) { return; }

            if (lp.L_now_Move_Int === 0) {
                lp.L_now_AnimeID = cEnPlayer_Motion.stand; lp.L_ActFuct = 0.1;
            } else {

                //lp.L_now_AnimeID = cEnPlayer_Motion.walk; lp.L_ActFuct = 0.1;
                lp.L_ActFuct = 0.1
                switch (lp.L_now_Move_Int) {
                    case 2: lp.L_now_AnimeID = cEnPlayer_Motion.back; break;
                    case 1: lp.L_now_AnimeID = cEnPlayer_Motion.back; break;
                    case 3: lp.L_now_AnimeID = cEnPlayer_Motion.back; break;

                    case 8: lp.L_now_AnimeID = cEnPlayer_Motion.walk; break;
                    case 7: lp.L_now_AnimeID = cEnPlayer_Motion.walk; break;
                    case 9: lp.L_now_AnimeID = cEnPlayer_Motion.walk; break;

                    case 4: lp.L_now_AnimeID = cEnPlayer_Motion.walk_L; break;
                    case 6: lp.L_now_AnimeID = cEnPlayer_Motion.walk_R; break;
                    default: break;
                }
            }
            break;


    }
    return;
}

clsEtcUnit.prototype.SetDashSpeed = function (lp) {
    var self = this;

    switch (self.bp.dashMode) {
        case lEnDashMode.DashFirstKasoku:
            lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.Dash_FastBoost];
            lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max] * 1.5;
            break;

        case lEnDashMode.normalDash:
            if (self.bp.Gldon[1]) {   //地上ダッシュ
                lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_up];
                lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max];
                //addDashEffect();
            }
            else { //空中ダッシュ
                lp.TmpAddSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpD_up];
                lp.TgtMoveSpeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.junpD_max];
            }
            break;

        default:
            lp.TmpAddSpeed = 0;
            lp.TgtMoveSpeed = 0;
            break;
    }
}

/// <summary>目標までの回転角度、及び補正した回転角度を返す(攻撃時用) </summary>
/// <param name="add_f">tgtVectに向いた後に加算される、向きの加算地</param>
clsEtcUnit.prototype.SetDiffRol = function (TgtVect, add_f, rol_speed, SetTgtFlg) {
    var self = this;

    var tempf_1 = self.bp.Rol_MstY + add_f;
    var tempf = oreMath.GetDifKaku(TgtVect, tempf_1);
    if (SetTgtFlg) {
        self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.TGT_Dist_Kaku] = tempf;
    }


    //一度角度を修正しなおしたら、自由に角度調整できるフラグON
    if (SetTgtFlg && Math.abs(tempf) < clsConst.KD005) {
        self.bp.WpnKakuKetteidFlg = true;
    }

    tempf = Math.clamp(tempf, -rol_speed, rol_speed);

    self.bp.rol_vectY = tempf;
}

/// <summary>目標までの回転角度、及び補正した回転角度を返す(ダッシュ時用) </summary>
/// <param name="tempf">相手との相対角度</param>
clsEtcUnit.prototype.SetDiffRol2 = function (rol_speed) {
    var self = this;

    if (self.bp.WpnKakuKetteidFlg) return true;

    var refFlg = false;

    //現在の角度と、目標角度の差を出す
    var tempf = oreMath.LimitKakuPI(self.bp.Rol_MstY - self.bp.rol_tgtY);

    //補正前の角度で判別
    if (Math.abs(tempf) <= rol_speed) {
        refFlg = true;
    }

    tempf = Math.clamp(tempf, -rol_speed, rol_speed);

    self.bp.rol_vectY = tempf;
    return refFlg;
}


/// <summary>
/// 変更先のステータスのステータスパラメーターをセットする
/// </summary>
/// <param name="ActStatus"></param>
/// <param name="nowActInt"></param>
/// <param name="prmP.Move_Int">移動方向</param>
/// <param name="moveVect_Y">Y方向移動量。</param>
/// <param name="DownEfeFlg">着地エフェクトを出すかどうか</param>
clsEtcUnit.prototype.setBaseStat = function (lp) {
    var self = this;
    switch (lp.L_now_playerState) {
        //地上&空中ダッシュ

        case cEnPlayer_ActStatus.dash:
        case cEnPlayer_ActStatus.dash_J:
            //攻撃キャンセル用に、Endイベントを消去                    
            self.bp.Sub_A = 0;
            self.SetMotionByKey(lp);
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 1;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] = 0;
            self.bp.dist_time[cEnStat_ParamTime.Stat_Junp_time] = 15;
            self.AllWpnDistTimeSet(15, lp);
            self.AllWpnDistTimeSet(-1, lp);
            if (lp.L_enyWpnUseFLg) {
                lp.L_enyWpnUseFLg = false;
                tmpUs = 5;
            }
            self.bp.WpnRolLockFlg = false;
            //SetBarniaState(barniaUsingFlg.UseStart);
            self.bp.rol_X = 0; self.bp.rol_Z = 0;
            break;

        //ステップ
        case cEnPlayer_ActStatus.step:
            //攻撃キャンセル用に、Endイベントを消去                    
            self.bp.Sub_A = 0;
            self.SetMotionByKey(lp);
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] = 1;
            self.bp.dist_time[cEnStat_ParamTime.Stat_Junp_time] = 5;
            self.AllWpnDistTimeSet(-1, lp);
            lp.L_enyWpnUseFLg = false;
            self.bp.WpnRolLockFlg = false;
            //SetBarniaState(barniaUsingFlg.UseEnd);

            self.bp.Movespeed = self.bp.meca_Stat_Const_f[cEnConsts_ParamF.StepS_max] * 0.5;

            switch (lp.L_now_Move_Int) {
                case 8: lp.L_now_AnimeID = cEnPlayer_Motion.Step_F; break;
                case 2: lp.L_now_AnimeID = cEnPlayer_Motion.Step_B; break;
                case 4: lp.L_now_AnimeID = cEnPlayer_Motion.Step_L; break;
                case 6: lp.L_now_AnimeID = cEnPlayer_Motion.Step_R; break;
            }

            break;

        //ジャンプ
        case cEnPlayer_ActStatus.Junp:
            //攻撃キャンセル用に、Endイベントを消去
            self.AllWpnDistTimeSet(-1, lp);
            self.AllWpnDistTimeSet(15, lp);

            //切りのみｷｬﾝｾﾙ
            self.bp.using_Time[cEnStat_ParamTime.Stat_Kaku_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_BstKaku_Time] = 0;

            //SetMotionByKey(now_playerState, now_Move_Int, ref now_AnimeID, ref ActFuct);
            lp.L_now_AnimeID = cEnPlayer_Motion.Junp; lp.L_ActFuct = 0.2;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = 1;
            self.bp.dist_time[cEnStat_ParamTime.Stat_Junp_time] = 15;
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] = 0;
            //prm.Gldon[1] = true;
            //SetBarniaState(barniaUsingFlg.UseStart);
            break;

        //下降
        case cEnPlayer_ActStatus.J_Down:
            lp.L_now_AnimeID = cEnPlayer_Motion.J_Down;
            lp.L_ActFuct = 0.15;
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
            self.bp.motionTime = 0;
            //prm.dist_time[cEnStat_ParamTime.Stat_move_time] = 10;
            self.bp.dist_time[cEnStat_ParamTime.Stat_dash_time] = 10;
            self.bp.dist_time[cEnStat_ParamTime.Stat_Junp_time] = 10;

            //now_Move_Int = 0; moveVect_Y = 0f;
            self.AllWpnDistTimeSet(10, lp);
            if (self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] === 0) { self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = 1; }
            //SetBarniaState(barniaUsingFlg.UseEnd);
            break;

        //着地
        case cEnPlayer_ActStatus.tach_Down:
            lp.L_now_AnimeID = cEnPlayer_Motion.tach_Down;
            lp.L_ActFuct = 0.15;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_use_gain_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] = 0;
            self.bp.motionTime = 0;
            //prm.dist_time[cEnStat_ParamTime.Stat_move_time] = 35;
            lp.L_now_Move_Int = 0; lp.L_moveVect_Y = 0;
            self.AllWpnDistTimeSet(-1, lp);
            self.AllWpnDistTimeSet(5, lp);
            //DisableAnimationEnd();
            lp.L_AddTachEfeFlg = true;
            //WpnRolLockFlg = false; 
            self.bp.Gldon[1] = true; self.bp.Gldon[0] = true;
            self.bp.WpnKakuKetteidFlg = false;

            //if (self.bp.control_Flg != -1) AllMain.JPad[prm.control_Flg].SetVib(10, 0.5);

            //SetBarniaState(barniaUsingFlg.UseEnd);
            break;

        //よろけ
        case cEnPlayer_ActStatus.dmg1:

            lp.L_now_AnimeID = cEnPlayer_Motion.dmg;
            lp.L_ActFuct = 0.15;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_use_gain_time] = 0;
            self.bp.motionTime = 0;
            self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] = 999;

            lp.L_now_Move_Int = 0; lp.L_moveVect_Y = 0;
            self.AllWpnDistTimeSet(-1, lp);
            self.AllWpnDistTimeSet(10, lp);
            self.bp.WpnKakuKetteidFlg = false;
            //WpnRolLockFlg = false; 
            self.bp.Gldon[1] = true; self.bp.Gldon[0] = true;
            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.down_life_now] = 1;
            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 1;
            //self.bp.Sev_UsingTime = 0;
            //SetBarniaState(barniaUsingFlg.UseEnd);

            self.bp.Vect *= 0.4;

            FactSetFrame();

            if (prm.control_Flg != -1) AllMain.JPad[prm.control_Flg].SetVib(10, 0.5);
            break;

        //ダウン開始
        case cEnPlayer_ActStatus.down_1:

            lp.L_now_AnimeID = cEnPlayer_Motion.down_1;
            lp.TgtMoveSpeed = 0.15;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Step_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_use_gain_time] = 0;
            self.bp.motionTime = 0;
            self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] = 999;

            lp.L_now_Move_Int = 0; //moveVect_Y = 0f;
            self.AllWpnDistTimeSet(-1, lp);
            self.AllWpnDistTimeSet(10, lp);
            //WpnRolLockFlg = false; 
            self.bp.Gldon[1] = false; self.bp.Gldon[0] = false;
            //prm.meca_Stat_Value_f[cEnChara_ParamFloat.down_life_now] = 1;
            self.bp.Sev_UsingTime = 0;
            //SetBarniaState(barniaUsingFlg.UseEnd);
            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 1;
            self.bp.Vect *= 0.4;
            //if (self.bp.control_Flg != -1) AllMain.JPad[prm.control_Flg].SetVib(60, 1f);
            break;
        //起き上がり
        case cEnPlayer_ActStatus.downRise:

            lp.L_now_AnimeID = cEnPlayer_Motion.down_Rise;
            lp.L_ActFuct = 1;
            self.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_dash_time] = 0;
            self.bp.using_Time[cEnStat_ParamTime.Stat_use_gain_time] = 0;
            self.bp.motionTime = 0;
            //prm.dist_time[cEnStat_ParamTime.Stat_move_time] = 35;
            lp.L_now_Move_Int = 0; //moveVect_Y = 0f;
            self.AllWpnDistTimeSet(-1, lp);
            self.AllWpnDistTimeSet(1, lp);
            //WpnRolLockFlg = false; 
            self.bp.Gldon[1] = true; self.bp.Gldon[0] = true;
            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.down_life_now] = 1;
            self.bp.dist_time[cEnStat_ParamTime.Stat_move_time] = 10;
            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.DwnFactor] = 0;
            self.bp.meca_Stat_Value_f[cEnChara_ParamFloat.blendFactor] = 1;
            break;

        default: break;
    }

}


/// <summary>使用不可時間をセットする。引数が負の値だったら、使用中時間をリセットする</summary>
clsEtcUnit.prototype.AllWpnDistTimeSet = function (setTime, lp) {
    var self = this;

    if (setTime > 0) {
        self.bp.dist_time[cEnStat_ParamTime.Stat_Shot_time] = setTime;
        self.bp.dist_time[cEnStat_ParamTime.Stat_Kaku_time] = setTime;
        self.bp.dist_time[cEnStat_ParamTime.Stat_SubS_time] = setTime;
        self.bp.dist_time[cEnStat_ParamTime.Stat_ExAt_time] = setTime;
        self.bp.dist_time[cEnStat_ParamTime.Stat_BstKaku_Time] = setTime;
        self.bp.dist_time[cEnStat_ParamTime.Stat_BstShot_time] = setTime;
    }
    else {
        for (var i = 0; i < self.bp.weapon_use_Time.length; i++) {
            self.bp.weapon_use_Time[i] = 0;
        }

        self.bp.using_Time[cEnStat_ParamTime.Stat_Shot_time] = 0;
        self.bp.using_Time[cEnStat_ParamTime.Stat_Kaku_time] = 0;
        self.bp.using_Time[cEnStat_ParamTime.Stat_SubS_time] = 0;
        self.bp.using_Time[cEnStat_ParamTime.Stat_ExAt_time] = 0;
        self.bp.using_Time[cEnStat_ParamTime.Stat_BstKaku_Time] = 0;
        self.bp.using_Time[cEnStat_ParamTime.Stat_BstShot_time] = 0;
        self.bp.rapidCount = 0;
        self.bp.Sub_A = 0;
        self.bp.next_A = 0;
        //enyWpnUseFLg = false;
        self.bp.WpnRolLockFlg = false;
        self.bp.WpnKakuKetteidFlg = false;
        self.bp.dashWpnUseFlg = false;
        self.bp.WpnLaunchedFlg = false;

        if (lp != null) {
            lp.L_enyWpnUseFLg = false;
        }
        self.bp.Sub_A = 0;
        self.bp.next_A = 0;
        self.bp.rapidCount = 0;
        /*
        foreach (clsUseBarnia b in Lw_barnia)
    {
                   b.useEnd();
    }
    */
    }

}

/// <summary>
/// ノックバック移動のみを行わせる。
/// </summary>
clsEtcUnit.prototype.SetNockBackMove = function (isUseHitStop) {
    var ForceVect = new THREE.Vector3();
    var self = this;

    if (self.bp.NockBackVect.length() > 0 && (!isUseHitStop || self.bp.HitStopTgtTime === 0)) {
        ForceVect = self.bp.NockBackVect;
        if (ForceVect.length() > 4) {
            ForceVect.Normalize();
            ForceVect = ForceVect * 4;
        }
        self.bp.NockBackVect *= 0.95;
        if (self.bp.NockBackVect.length() < 0.2) {
            self.bp.NockBackVect.set(0, 0, 0);
            ForceVect.set(0, 0, 0);
        }
    }
    return ForceVect;
}


/// <summary>
/// ダッシュ開始のキー方向と現在のキー方向を見比べ、ダッシュ終了方向だったらtrueを返す
/// </summary>
/// <param name="GetKeyint"></param>
/// <returns></returns>
clsEtcUnit.prototype.CheckDashEndMoveInt = function (GetKeyint) {
    var self = this;
    switch (self.bp.LastAct_Move_Int) {
        case 0:
            //ニュートラルのため、true決定
            return true;
        case 1:
            return (GetKeyint != 1 && GetKeyint != 4 && GetKeyint != 2);
        case 2:
            return (GetKeyint != 1 && GetKeyint != 2 && GetKeyint != 3);
        case 3:
            return (GetKeyint != 2 && GetKeyint != 3 && GetKeyint != 6);
        case 4:
            return (GetKeyint != 1 && GetKeyint != 4 && GetKeyint != 7);
        case 5:
            //ニュートラルのため、true決定
            return true;
        case 6:
            return (GetKeyint != 3 && GetKeyint != 6 && GetKeyint != 9);
        case 7:
            return (GetKeyint != 4 && GetKeyint != 7 && GetKeyint != 8);
        case 8:
            return (GetKeyint != 7 && GetKeyint != 8 && GetKeyint != 9);
        case 9:
            return (GetKeyint != 8 && GetKeyint != 9 && GetKeyint != 6);

    }
    return true;
}

//入力されたキー方向が、ダッシュなど可能な４方向かどうかを判別
clsEtcUnit.prototype.CheckMoveInt = function (moveInt) {

    return moveInt === 2 || moveInt === 8 || moveInt === 4 || moveInt === 6;
}


/////////////




/////////////////////////////////////////////////////





///////////////////////////////////////////////////////////////////////////

function Animater() {
    this.modelObject = null;
    this.animationController = null;
    this.allBoneAnimation = new Array();
    this.upBodyAnimation = new Array();
}
Animater.prototype.createAnimation = function () { };
