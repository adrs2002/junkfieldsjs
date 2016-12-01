/// <reference path="three.min.js"/>
/// <reference path="objectSetter/ObjSetter_Base.js"/>
/// <reference path="cEnBtPlayer.js"/>
/// <reference path="clsConst.js"/>
/// <reference path="oreCommon.js"/>
/// <reference path="oreMath.js"/>
/// <reference path="clsParticle.js"/>

"use strict";



/// <summary>
/// 発射時の受け渡し用クラス これがParticleクラスに乗る
/// </summary>
function strBulletStr() {
    this.byID = 0;
    this.WpnID = -1;
    this.LockEneID = -1;
    this.rockVect = new THREE.Vector3();
    this.rapCount = 0;
    this.launchGroupID = 0;
    this.tgtPos = new THREE.Vector3();
    this.isPosCrach = false;
    this.wpnLevel = 0;
}

/// <summary>
/// 武器クラス
/// </summary>
function clsWeapon() {

    ///<summary>配列ID</summary>
    this.WpnID = 0;

    ///発射陣営ID
    this.launchGroupID = 0;

    this.WpnName = "";
    ///<summary>発射位置のポジション(銃口Mxからのローカル）</summary>
    this.BulletPos = new THREE.Vector3();
    ///<summary>発射ベクトル(銃口Mxからのローカル）</summary>
    this.BulletVect = new Array();

    ///<summary>どの弾丸を使用するか</summary>
    this.UseBulletId = -1;

    ///<summary>種別</summary>
    //this.wpn_type=cEnWpnType.N_Shot;

    ///<summary>MAX玉数</summary>
    this.wpn_kazu_max = 0;

    ///<summary>武器使用でチャージになった時、この値以上にならないと使用できない、というフラグ</summary>
    this.wpn_en_Charge = 0;


    ///<summary>射程　ここでの射程は、弾薬の射程ではなく、CPU判断に使う射程　長めに取っておく</summary>
    this.wpn_reng = 0;
    ///<summary>チャージエフェクトを出すかどうか</summary>
    this.charge = 0;

    ///<summary>次玉装填間隔（ほぼバルカン専用パラメータ）</summary>
    this.wpn_reload_next = 0;
    this.wpn_reload_now = 0;

    ///<summary>時間差を利用しての発射回数</summary>
    this.Dley_Su = 0;
    ///<summary>時間差を利用する際の時間差</summary>
    this.Dley_Time = 0;

    ///<summary>発射時のエフェクト＆銃口(銃口にリンクしない)</summary>
    this.wpn_efe_fire = new Array();
    ///<summary>発射時のエフェクト(銃口にリンクしする)</summary>
    this.wpn_efe_fire_Link = new Array();

    ///<summary>ロック時、敵機ベクトルと銃口ベクトルどっちを優先にするか(trueなら銃口)</summary>
    this.VectPrimaryType = true;

    ///<summary>発射時の効果音</summary>
    this.wpnSoundStr = "";

    ///<summary>打てるかどうかの判別(モーション含む）</summary>
    this.CanBullet = true;

    ///<summary>打てるかどうかの判別(弾数、気合の状況などの見える数値のみ）</summary>
    this.CanBullet_En = false;

    ///<summary>残段数</summary>
    this.Now_Zandan = 0;

    ///<summary>リロードタイム(ReroadNextの初期値）</summary>
    this.Reload_Time = 0;

    ////<summary>次弾発射への間隔。0で発射可能MGでは最重要パラメータ</summary>
    ///<summary>Reload_Time>ReloadNextになると、1発回復。</summary>
    this.ReloadNext = 0;

    ///<summary>射出時の変換後まとりっくす</summary>
    this.W_Matrix = new THREE.Matrix4();

    ///<summary>射出時のローカルMatrix</summary>
    this.L_Matrix = new THREE.Matrix4();

    ///<summary>発射位置のＰｏｓ(ローカルではなく、グローバル)</summary>
    this.Saki_Pos = new Array();

    ///<summary>発射位置の角度(ローカルではなく、グローバル)</summary>
    this.Saki_Rol = new Array();

    ///<summary>半分より下回ったかどうか。下回った後は、半分以上に回復しないと打てない</summary>
    this.LowHarf = false;

    ///<summary>射程内に入ったかどうかの判別0が今、1が過去</summary>
    this.InRange = [false, false];//=newbool[2];

    ///<summary>弾情報</summary>
    this.bullet = new clsBurret();

    ///<summary>リロードで弾が増えたエフェクトを追加するかどうかのフラグ</summary>
    this.isAddEf2D = false;

    ///<summary>リロードで弾が増えたエフェクトを追加するかどうかのフラグ（派手なVer）</summary>
    this.isAddEf2D_B = false;

    //玉出すときに必要な引数軍
    this.L_P = new Particle();
    ////this.BltParticleStr;

    this.tmpV3 = new THREE.Vector3();
    this.tmpV3_2 = new THREE.Vector3();

    this.BulletingTgtList = new Array();

    //攻撃散布界。大きいほど散らばる
    this.dispersion = 0;

}


/// <summary>
/// 毎時間通る、武器状態更新処理
/// </summary>
clsWeapon.prototype.FixedWpnUpdate = function (_dul) {
    var self = this;
    //装備情報を更新
    /*
        if (self.Now_Zandan < self.wpn_kazu_max) {
            self.Reload_Time++;
            if (self.Reload_Time >= self.ReloadNext) {
                self.Now_Zandan++;
                self.Reload_Time = 0;
    
                //弾増えたでエフェクト追加
                self.isAddEf2D = true;
            }
        }
        else { self.Reload_Time = 0; }
    */

    if (self.wpn_reload_now > 0) {
        self.wpn_reload_now -= _dul;
        self.wpn_reload_now = Math.max(self.wpn_reload_now, 0);
    }

    //打てるかどうかの判別
    self.CanBullet = /*self.Now_Zandan > 0 &&*/ self.wpn_reload_now === 0;

}

//ボーンを反映させた場所の更新
clsWeapon.prototype.LinkUpdate = function (_mountBase) {
    var self = this;

    for (var i = 0; i < self.BulletPos.length; i++) {
        self.tmpV3.copy(self.BulletPos[i]);
        self.Saki_Pos[i].copy(_mountBase.localToWorld(self.tmpV3));

        self.tmpV3_2.copy(self.BulletPos[i]);
        self.tmpV3_2.add(self.BulletVect[i]);
        self.tmpV3_2 = _mountBase.localToWorld(self.tmpV3_2);
        self.tmpV3_2.sub(self.tmpV3);
        self.Saki_Rol[i].copy(self.tmpV3_2);
    }
}


clsWeapon.prototype.Fire = function (_tgtPos, _pow, _baseid, _mountPos, _tgtIDs) {
    var self = this;
    var i = 0, m = 0;
    //装備情報を更新
    self.Now_Zandan--;
    self.wpn_reload_now = self.wpn_reload_next;

    //玉を出す
    for (i = 0; i < self.Saki_Pos.length; i++) {

        self.tmpV3.copy(_tgtPos);
        //カメラの視点ベクトルを玉に載せる
        self.tmpV3.sub(self.Saki_Pos[i]);
        self.tmpV3.normalize();
        if (this.dispersion > 0.0) {
            self.tmpV3.x += this.dispersion * (Math.random() - 0.5);
            self.tmpV3.y += this.dispersion * (Math.random() - 0.5);
            self.tmpV3.z += this.dispersion * (Math.random() - 0.5);
            self.tmpV3.normalize();
        }
        self.L_P.setVect(self.tmpV3);
        self.L_P.setPos(self.Saki_Pos[i]);

        //玉に関しては、sizの扱いが特殊になる。 Siz は変動する値（最初はZにゼロを入れている）、Factor　が目標とする値となる
        self.L_P.setSiz(self.bullet.Obj_siz.z);
        self.L_P.setSiz3D(self.bullet.Obj_siz);
        self.L_P.setRange(self.bullet.range * Master_Shot_Renge_Rate);
        self.L_P.setSpeed(self.bullet.tama_speed * Master_Shot_Speed_Rate);
        self.L_P.imageId2 = 0;
        self.L_P.matType = self.bullet.draw_type;
        self.L_P.efe_type = 101;
        self.L_P.HitOn = true;
        self.L_P.BulletObj = self.bullet;
        self.L_P.launchGroupID = self.launchGroupID;
        self.L_P.LinkId = [_baseid, _mountPos, 0, 0];

        if (_pow != undefined) {
            self.L_P.HoseiPrm_DMG = _pow;
        }
        if (_tgtIDs != undefined) {
            for (var m = 0; m < _tgtIDs.length; m++) {
                self.L_P.Lock_eneID = _tgtIDs[m];
                particleComp.AddParticle(particleComp.pt_bullet_Add, self.L_P);
            }
        }
        else {
            particleComp.AddParticle(particleComp.pt_bullet_Add, self.L_P);
        }

        for (m = 0; m < self.wpn_efe_fire.length; m++) {
            //エフェクトを出す            
            self.wpn_efe_fire[m].setPos(self.Saki_Pos[i]);
            switch (self.L_P.imageId2) {
                case -1: particleComp.AddParticle(particleComp.pt_Obj_Add, self.wpn_efe_fire[m]); break;
                case 0: particleComp.AddParticle(particleComp.pt_bill_Add, self.wpn_efe_fire[m]); break;
                case 1: particleComp.AddParticle(particleComp.pt_bill_Alp, self.wpn_efe_fire[m]); break;
            }
        }
    }
    //音を鳴らす
    oreCommon.playStageSE(self.wpnSoundStr, self.Saki_Pos[0], _baseid === 0);
}

/// <summary>
/// リセット
/// </summary>
clsWeapon.prototype.ResetWpn = function () {
    var self = this;
    self.wpn_reload_now = 0;
    self.LowHarf = false;
    self.Now_Zandan = self.wpn_kazu_max;
    self.Reload_Time = 0;

    self.InRange = [false, false];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

clsWeapon.prototype.create = function (_mesh, _name) {

    this.mesh = _mesh;
    this.wpnName = _name;
    var _pat = new Particle();
    // MBT主砲
    if (_name == "MCN-001-S") {

        this.BulletPos = [new THREE.Vector3(0, 1, -8)];
        this.Saki_Pos = [new THREE.Vector3(0, 1, -8)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.RW_2_RF;
        this.wpn_kazu_max = 999;
        this.wpn_en_Charge = 100;
        this.wpn_reng = 6000;
        this.charge = false;
        this.wpn_reload_next = 3000;
        this.dley_Su = 1;
        this.dley_Time = 1;

        this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "gun08";
        this.canBullet = false;
        this.canBullet_En = false;

        this.nowZandan = 999;
        this.reloadTime = 0;
        this.reloadNext = 0;

        this.w_Matrix = null;
        this.l_Matrix = null;

        this.lowHarf = false;

        this.inRange = false;

        this.bullet = null;

        this.dispersion = 0.001;
        this.wpn_efe_fire = new Array();
        {

        }

        this.wpn_efe_fire_Link = new Array();
        {

        }


        return this;
    }
    else if (_name == "RRF-011S") {

        this.BulletPos = [new THREE.Vector3(0, 0.6, -8)];
        this.Saki_Pos = [new THREE.Vector3(0, 0.6, -8)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.RW_2_RF;
        this.wpn_kazu_max = 20;
        this.wpn_en_Charge = 0;
        this.wpn_reng = 700;
        this.charge = false;
        this.wpn_reload_next = 100;
        this.dley_Su = 1;
        this.dley_Time = 1;

        //this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "gun08";
        this.canBullet = false;

        this.nowZandan = 20;
        this.Reload_Time = 0;
        this.ReloadNext = 0;

        this.W_Matrix = null;
        this.L_Matrix = null;

        this.LowHarf = false;

        this.InRange = false;

        this.bullet = null;

        this.isAddEf2D;
        this.isAddEf2D_B;
        this.dispersion = 0.003;

        this.wpn_efe_fire = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(3);
            _pat.setSizFactor(0.5);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 1;
            _pat.HitOn = false;
            this.wpn_efe_fire.push(_pat);
        }

        this.wpn_efe_fire_Link = new Array();
        {

        }

        //玉
        this.bullet = new clsBurret();
        this.bullet.imageId = 1;
        this.bullet.Obj_siz.set(5, 5, 30);
        this.bullet.range = 1000;
        this.bullet.tama_speed = 10;
        this.bullet.attack_P = 100;

        this.bullet.blt_efe_Hit_Efe = new Array();
        return this;
    }
    else if (_name == "DMG-171S") {

        this.BulletPos = [new THREE.Vector3(0, 1, -8)];
        this.Saki_Pos = [new THREE.Vector3(0, 1, -8)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.LW_2_MG;
        this.wpn_kazu_max = 20;
        this.wpn_en_Charge = 0;
        this.wpn_reng = 200;
        this.charge = false;
        this.wpn_reload_next = 100;
        this.dley_Su = 1;
        this.dley_Time = 1;

        //this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "gun28";
        this.canBullet = false;

        this.nowZandan = 200;
        this.Reload_Time = 0;
        this.ReloadNext = 0;

        this.W_Matrix = null;
        this.L_Matrix = null;

        this.LowHarf = false;

        this.InRange = false;

        this.wpn_efe_fire = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(1);
            _pat.setSizFactor(0.2);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            this.wpn_efe_fire.push(_pat);
        }

        this.wpn_efe_fire_Link = new Array();
        {

        }

        this.dispersion = 0.03;
        //玉
        this.bullet = new clsBurret();
        this.bullet.imageId = 1;
        this.bullet.Obj_siz.set(1, 1, 20);
        this.bullet.range = 300;
        this.bullet.tama_speed = 15;
        this.bullet.attack_P = 15;
        //命中時エフェ
        this.bullet.blt_efe_Hit_Efe = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(3);
            _pat.setSizFactor(0.2);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            _pat.timeFactor_B = 1;
            this.bullet.blt_efe_Hit_Efe.push(_pat);
        }
        return this;
    } else if (_name == "BMS-003S") {

        this.BulletPos = [new THREE.Vector3(0.75, 1.8, -2)];
        this.Saki_Pos = [new THREE.Vector3(0.75, 1.8, -2)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.SW_2_N;
        this.wpn_kazu_max = 24;
        this.wpn_en_Charge = 0;
        this.wpn_reng = 2500;
        this.charge = false;
        this.wpn_reload_next = 3000;
        this.dley_Su = 6;
        this.dley_Time = 1;

        //this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "burst00";
        this.canBullet = false;

        this.nowZandan = 24;
        this.Reload_Time = 0;
        this.ReloadNext = 0;

        this.W_Matrix = null;
        this.L_Matrix = null;

        this.LowHarf = false;

        this.InRange = false;

        this.bullet = null;

        this.isAddEf2D = false;
        this.isAddEf2D_B = false;

        this.wpn_efe_fire = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(2);
            _pat.setSizFactor(0.2);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            this.wpn_efe_fire.push(_pat);
        }

        this.wpn_efe_fire_Link = new Array();
        {

        }

        //玉
        this.bullet = new clsBurret();
        this.bullet.missileFlg = true;
        this.bullet.tama_speed = 3;
        this.bullet.lock_direy = 1000;
        this.bullet.lock_distFrame = 20;
        this.bullet.kaku_max = 0.01;
        this.bullet.range = 3000;
        this.bullet.tama_speed = 5;
        this.bullet.attack_P = 150;
        this.bullet.ActEfe_Emit_Int = 2;

        this.bullet.missileFlg = true;
        this.bullet.tama_speed = 3;
        this.bullet.lock_direy = 500;  //これは経過ミリ秒で指定
        this.bullet.lock_distFrame = 10;    //これは経過フレーム数で指定..ややこしい
        this.bullet.kaku_max = 2.0; //めっちゃ追う！避けられるか！　っていうので2.0かな。

        this.bullet.blt_efe_Act_Efe = new Particle();
        {
            this.bullet.blt_efe_Act_Efe.imageId2 = 0; //1
            this.bullet.blt_efe_Act_Efe.efe_type = 4; //3
            this.bullet.blt_efe_Act_Efe.matType = 5;
            this.bullet.blt_efe_Act_Efe.setSiz(2);
            this.bullet.blt_efe_Act_Efe.setSizFactor(0.1);
            this.bullet.blt_efe_Act_Efe.timeFactor_B = 0.5;

        }

        this.bullet.blt_efe_Hit_Efe = new Array();

        return this;

    } else if (_name == "BBC-001S") {

        this.BulletPos = [new THREE.Vector3(0, 1.8, -9)];
        this.Saki_Pos = [new THREE.Vector3(0, 1.8, -9)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.SW_2_N;
        this.wpn_kazu_max = 6;
        this.wpn_en_Charge = 0;
        this.wpn_reng = 3700;
        this.charge = false;
        this.wpn_reload_next = 100;
        this.dley_Su = 1;
        this.dley_Time = 1;

        //this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "gun11_r";
        this.canBullet = false;

        this.nowZandan = 20;
        this.Reload_Time = 0;
        this.ReloadNext = 0;

        this.W_Matrix = null;
        this.L_Matrix = null;

        this.LowHarf = false;

        this.InRange = false;

        this.bullet = null;

        this.isAddEf2D;
        this.isAddEf2D_B;

        this.wpn_efe_fire = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(15);
            _pat.setSizFactor(0.2);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 1;
            _pat.HitOn = false;
            _pat.timeFactor_B = 0.5;
            this.wpn_efe_fire.push(_pat);

            _pat = new Particle();
            _pat.setSiz(10);
            _pat.setSizFactor(0.5);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 3;
            _pat.HitOn = false;
            _pat.timeFactor_B = 0.8;
            this.wpn_efe_fire.push(_pat);

            _pat = new Particle();
            _pat.setSiz(10);
            _pat.setSizFactor(1);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 2;
            _pat.HitOn = false;
            _pat.timeFactor_B = 1;
            this.wpn_efe_fire.push(_pat);
        }

        this.wpn_efe_fire_Link = new Array();
        {

        }

        //玉
        this.bullet = new clsBurret();
        this.bullet.imageId = 1;
        this.bullet.Obj_siz.set(10, 10, 30);
        this.bullet.range = 4000;
        this.bullet.tama_speed = 25;
        this.bullet.attack_P = 800;
        //通過時efe
        this.bullet.ActEfe_Emit_Int = 10;
        this.bullet.blt_efe_Act_Efe = new Particle();
        {
            this.bullet.blt_efe_Act_Efe.imageId2 = 0;
            this.bullet.blt_efe_Act_Efe.efe_type = 3;
            this.bullet.blt_efe_Act_Efe.setSiz(10);
            this.bullet.blt_efe_Act_Efe.setSizFactor(0.5);
            this.bullet.blt_efe_Act_Efe.timeFactor_B = 1;
        }

        //命中時エフェ
        this.bullet.blt_efe_Hit_Efe = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(15);
            _pat.setSizFactor(0.5);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 1;
            _pat.HitOn = false;
            _pat.timeFactor_B = 0.7;
            this.bullet.blt_efe_Hit_Efe.push(_pat);

            _pat = new Particle();
            _pat.setSiz(5);
            _pat.setSizFactor(1);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 3;
            _pat.HitOn = false;
            _pat.timeFactor_B = 1;
            this.bullet.blt_efe_Hit_Efe.push(_pat);

            _pat = new Particle();
            _pat.setSiz(10);
            _pat.setSizFactor(0.1);
            _pat.setSpeed(0);
            _pat.imageId2 = 1;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            _pat.timeFactor_B = 0.5;
            this.bullet.blt_efe_Hit_Efe.push(_pat);
        }
        return this;
    }
    else if (_name == "AAA-GUN") {

        this.BulletPos = [new THREE.Vector3(2, 0, 6), new THREE.Vector3(-2, 0, 6)];
        this.Saki_Pos = [new THREE.Vector3(2, 0, 6), new THREE.Vector3(-2, 0, 6)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.LW_2_MG;
        this.wpn_kazu_max = 20;
        this.wpn_en_Charge = 0;
        this.wpn_reng = 200;
        this.charge = false;
        this.wpn_reload_next = 200;
        this.dley_Su = 1;
        this.dley_Time = 1;

        //this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "gun28";
        this.canBullet = false;

        this.nowZandan = 200;
        this.Reload_Time = 0;
        this.ReloadNext = 0;

        this.W_Matrix = null;
        this.L_Matrix = null;

        this.LowHarf = false;

        this.InRange = false;

        this.wpn_efe_fire = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(1);
            _pat.setSizFactor(0.2);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            this.wpn_efe_fire.push(_pat);
        }

        this.wpn_efe_fire_Link = new Array();
        {

        }

        this.dispersion = 0.2;
        //玉
        this.bullet = new clsBurret();
        this.bullet.imageId = 1;
        this.bullet.Obj_siz.set(0.5, 0.5, 10);
        this.bullet.range = 300;
        this.bullet.tama_speed = 15;
        this.bullet.attack_P = 5;
        //命中時エフェ
        this.bullet.blt_efe_Hit_Efe = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(3);
            _pat.setSizFactor(0.2);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            _pat.timeFactor_B = 1;
            this.bullet.blt_efe_Hit_Efe.push(_pat);
        }
        return this;
    } else if (_name == "ACA-GUN") {

        this.BulletPos = [new THREE.Vector3(2, -0.3, 10), new THREE.Vector3(-2, -0.3, 10)];
        this.Saki_Pos = [new THREE.Vector3(2, -0.3, 10), new THREE.Vector3(-2, -0.3, 10)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.LW_2_MG;
        this.wpn_kazu_max = 20;
        this.wpn_en_Charge = 0;
        this.wpn_reng = 400;
        this.charge = false;
        this.wpn_reload_next = 1500;
        this.dley_Su = 1;
        this.dley_Time = 1;

        //this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "gun28";
        this.canBullet = false;

        this.nowZandan = 200;
        this.Reload_Time = 0;
        this.ReloadNext = 0;

        this.W_Matrix = null;
        this.L_Matrix = null;

        this.LowHarf = false;

        this.InRange = false;

        this.wpn_efe_fire = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(1);
            _pat.setSizFactor(0.2);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            this.wpn_efe_fire.push(_pat);
        }

        this.wpn_efe_fire_Link = new Array();
        {

        }

        this.dispersion = 0.01;
        //玉
        this.bullet = new clsBurret();
        this.bullet.imageId = 1;
        this.bullet.Obj_siz.set(1.5, 1.5, 25);
        this.bullet.range = 1000;
        this.bullet.tama_speed = 10;
        this.bullet.attack_P = 35;
        //命中時エフェ
        this.bullet.blt_efe_Hit_Efe = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(5);
            _pat.setSizFactor(0.5);
            _pat.setSpeed(0);
            _pat.imageId2 = 1;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            _pat.timeFactor_B = 1;
            this.bullet.blt_efe_Hit_Efe.push(_pat);
        }
        return this;
    }
    else if (_name == "RRF-121B") {

        this.BulletPos = [new THREE.Vector3(0, 0.6, -8)];
        this.Saki_Pos = [new THREE.Vector3(0, 0.6, -8)];
        this.BulletVect = [new THREE.Vector3(0, 0, -1)];
        this.Saki_Rol = [new THREE.Vector3(0, 0, -1)];

        this.wpn_type = cEnWpnType.RW_2_RF;
        this.wpn_kazu_max = 20;
        this.wpn_en_Charge = 0;
        this.wpn_reng = 1300;
        this.charge = false;
        this.wpn_reload_next = 100;
        this.dley_Su = 1;
        this.dley_Time = 1;

        //this.vectPrimaryType = cEnWpnVectType.normal;
        this.wpnSoundStr = "gun08";
        this.canBullet = false;

        this.nowZandan = 20;
        this.Reload_Time = 0;
        this.ReloadNext = 0;

        this.W_Matrix = null;
        this.L_Matrix = null;

        this.LowHarf = false;

        this.InRange = false;

        this.bullet = null;

        this.isAddEf2D;
        this.isAddEf2D_B;
        this.dispersion = 0.001;

        this.wpn_efe_fire = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(3);
            _pat.setSizFactor(0.6);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 1;
            _pat.matType = 1;
            _pat.HitOn = false;
            this.wpn_efe_fire.push(_pat);
        }

        this.wpn_efe_fire_Link = new Array();
        {
        }

        //玉
        this.bullet = new clsBurret();
        this.bullet.draw_type = 1;
        this.bullet.imageId = 1;
        this.bullet.Obj_siz.set(2, 2, 50);
        this.bullet.range = 1000;
        this.bullet.tama_speed = 10;
        this.bullet.attack_P = 80;

        this.bullet.blt_efe_Hit_Efe = new Array();
        {
            _pat = new Particle();
            _pat.setSiz(3);
            _pat.setSizFactor(0.3);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 0;
            _pat.HitOn = false;
            _pat.timeFactor_B = 1;
            _pat.matType = 1;
            this.bullet.blt_efe_Hit_Efe.push(_pat);

            _pat = new Particle();
            _pat.setSiz(5);
            _pat.setSizFactor(0.1);
            _pat.setSpeed(0);
            _pat.imageId2 = 0;
            _pat.efe_type = 1;
            _pat.HitOn = false;
            _pat.timeFactor_B = 0.7;
            _pat.matType = 1;
            this.bullet.blt_efe_Hit_Efe.push(_pat);
        }
        return this;
    }


    ////////////////////


}



////////////////////////////////////////////////////


/// <summary>
/// 弾情報
/// </summary>
function clsBurret() {
    /// <summary>玉のタイプ(ゲーム内タイプ） </summary>
    this.type = 0;
    ///<summary>玉のタイプ(描画タイプ）enumMaterialTypeに準拠</summary>
    this.draw_type = 0;
    ///<summary>玉のグラフィックオブジェクト。0ならオブジェクトなし</summary>
    this.imageId;
    ///<summary>攻撃力（補正を考えてない、際弱の値）</summary>
    this.attack_P;
    ///<summary>ダウン攻撃力</summary>
    this.down_P;
    ///<summary>玉速LW用ならば加速MAX値</summary>
    this.tama_speed;
    ///<summary>射程。CPUはこの距離から「振ってくる」という設定になるため、慎重に設定する</summary>
    this.range;
    ///<summary>判定サイズ。LWの場合、Zが切り範囲。Xが有効角度となる</summary>
    this.hantei_siz;
    ///<summary>玉オブジェクトのサイズ</summary>
    this.Obj_siz = new THREE.Vector3();

    ///<summary>1フレームの追尾角度(0は追尾ナシ）通常を0.05とする</summary>
    this.kaku_max = 0.01;
    ///<summary>ロック後、追尾の修正を開始するまでの空白フレーム。このフレーム間はまっすぐ進む</summary>
    this.lock_direy;
    //ロックオン中の敵ID。100未満ならPlayer属性、100以上なら100を引いてEnemyObj属性
    //this.Lock_eneID =-1;

    ///<summary>裂玉にロックを引き継ぐか</summary>
    this.spread_lock;
    ///<summary>裂後の玉ID</summary>
    this.wpn_spread_ID;
    ///<summary>発射後、何フレーム後に分裂するか</summary>
    this.wpn_spread_direy;
    ///<summary>的との距離がどのくらいで分裂するか(0は分裂ナシ、-1で即分裂)</summary>
    this.wpn_spread_dist;
    ///<summary>散布界　数が大きいほど広がる</summary>
    this.wpn_spread_kaku;
    ///<summary>分裂する数</summary>
    this.wpn_spread_KaZu;
    ///<summary>当たり判定球連結数</summary>
    this.hitcount;
    ///<summary>発射時(分裂時）のエフェクト</summary>
    //this.wpn_efe_fire_Efe;//=newList<Particle>();
    ///<summary>HIT時のエフェクト(直接構造体指定)</summary>
    this.blt_efe_Hit_Efe;//=newList<EasyParticle>();
    ///<summary>通過時のエフェクト(直接構造体指定)</summary>
    this.blt_efe_Act_Efe;//=newList<Particle>();
    ///<summary>通過時エフェクト表示間隔0なら出現しない</summary>
    this.ActEfe_Emit_Int;
    ///<summary>残像エフェクト表示間隔0なら出現しない</summary>
    this.ActEfe_Zanzo_int;
    ///<summary>残像エフェクトがカーブするかどうか</summary>
    this.ActEfe_Zanzo_Carve;

    ///<summary>ロック後のロックチェック間隔</summary>
    this.lock_distFrame = -1;
    ///<summary>現在のロックチェック間隔</summary>
    //this.lock_distNow = 0;

    ///<summary>爆風ありかどうか</summary>
    this.IsBlast;

    ///<summary>重力に負けるフラグ　この数分、毎フレームYが減産される</summary>
    this.IsGrabity;

    ///<summary>爆風</summary>
    this.BlastP;

    ///<summary>着弾時の効果音</summary>
    this.hitSoundStr = "";

    ///<summary>ミサイルフラグ</summary>
    this.missileFlg = false;

    ///<summary>Hit時、めり込む時間</summary>
    this.HitStopTime;

    ///<summary>目標地点で爆発するかどうか？</summary>
    this.isCrachPoint;

    ///<summary>地面に沿うかどうか</summary>
    this.IsGroundSweep;

    ///<summary>玉のレベル。相殺に関係する。
    ///0～５＝そのレベル以下を貫通、同レベルなら相殺　>１０＝下位レベルを貫通、同レベルは打ち消さない</summary>
    this.BulletLv;

    ///<summary>
    ///玉のダメージ補正に関するパラメータ
    ///</summary>
    //this.HoseiPrm = 1.0;

    ///<summary>命中時、ノックバックに強制的に加えるYベクトル
    ///ゼロは無視させるので、真横に移動させたかったら　-0.01fとかにする
    ///</summary>
    this.HitAddY;
}

