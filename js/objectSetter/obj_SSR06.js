/// <reference path="../cEnBtPlayer.js"/>
/// <reference path="../three.min.js"/>
/// <reference path="../objectSetter/ObjSetter_Base.js"/>
/// <reference path="../loaders/thrXfileLoader.js" />

"use strict";
//操作オブジェクトの元となるクラス。
//これは「1モデル（キャラクター1種類）」毎に用意され、
//各能力値などもここに格納されている。
//これも、操作キャラが増える度にインスタンスは【作られない】 ‥はず
function Obj_SSR06() {
    ObjectSetter.call(this, "SSR06");
}

//オブジェクトのロードメソッド
Obj_SSR06.prototype.load = function (object) {

    var self = this;

    self.name = "SSR-006";
    self.modelObject = object.FrameInfo[0]; //XfileLoader_CopyObject(object.FrameInfo[0]);
    self.modelObject.scale.multiplyScalar(Master_Chara_Size);
    //self.modelObject.scale.set(-Master_Chara_Size, Master_Chara_Size, Master_Chara_Size);

    self.AnimationSetInfo = object.AnimationSetInfo;
    self.AnimationKeys = Object.keys(object.AnimationSetInfo);

    //武器装備箇所のセット
    for (var i = 0; i < self.modelObject.skeleton.bones.length; i++) {
        if (self.modelObject.skeleton.bones[i].name.indexOf('R_Wpn2') > -1) {
            self.mountWpnBone[0] = self.modelObject.skeleton.bones[i];
            self.mountWpnBone[0].mounting = null;
            //武器装備に必要な角度を足す
            var rolx = new THREE.Matrix4();
            rolx.makeRotationX(Math.PI);
            self.mountWpnBone[0].MountMx = rolx;
        }

        if (self.modelObject.skeleton.bones[i].name.indexOf('L_Wpn') > -1) {
            self.mountWpnBone[1] = self.modelObject.skeleton.bones[i];
            self.mountWpnBone[1].mounting = null;
            //武器装備に必要な角度を足す
            var rolx = new THREE.Matrix4();
            rolx.makeRotationX(Math.PI);
            self.mountWpnBone[1].MountMx = rolx;
        }

        if (self.modelObject.skeleton.bones[i].name.indexOf('SW2_R_mp_2') > -1) {
            self.mountWpnBone[2] = self.modelObject.skeleton.bones[i];
            self.mountWpnBone[2].mounting = null;
            var refz = new THREE.Matrix4();
            refz.elements[0] = -1;
            self.mountWpnBone[2].MountMx = refz;
        }


        if (self.modelObject.skeleton.bones[i].name.indexOf('SW2_L_mp_2') > -1) {
            self.mountWpnBone[3] = self.modelObject.skeleton.bones[i];
            self.mountWpnBone[3].mounting = null;
            //武器装備に必要な角度を足す
            var refz = new THREE.Matrix4();
            //refz.elements[0] = -1;
            self.mountWpnBone[3].MountMx = refz;
        }

        if (self.modelObject.skeleton.bones[i].name.indexOf('Bone01') > -1) {
            self.UpBodyBone = self.modelObject.skeleton.bones[i];
        }

        //BarniaEffectBone
        if (self.modelObject.skeleton.bones[i].name.indexOf('BarniaBaseR') > -1 && self.modelObject.skeleton.bones[i].name.indexOf('_2') == -1) {
            self.BarniaEffectBone[0] = self.modelObject.skeleton.bones[i];
            self.BarniaEffectBone[0].mounting = null;
            //バーニアマウントに必要な角度とスケールを足す
            var rolx = new THREE.Matrix4();
            rolx.makeRotationX(Math.PI);
            rolx.elements[10] = 1.5;
            rolx.elements[0] *= 0.3;
            rolx.elements[5] *= 0.3;
            self.BarniaEffectBone[0].MountMx = rolx;
        }

        if (self.modelObject.skeleton.bones[i].name.indexOf('BarniaBaseL') > -1 && self.modelObject.skeleton.bones[i].name.indexOf('_2') == -1) {
            self.BarniaEffectBone[1] = self.modelObject.skeleton.bones[i];
            self.BarniaEffectBone[1].mounting = null;
            //バーニアマウントに必要な角度を足す
            var rolx = new THREE.Matrix4();
            rolx.makeRotationX(Math.PI);
            rolx.elements[10] = 1.3;
            rolx.elements[0] *= 0.2;
            rolx.elements[5] *= 0.2;
            self.BarniaEffectBone[1].MountMx = rolx;
        }
    }



    //アニメーションコントローラーをセット＆作成する
    var keys = Object.keys(object.AnimationSetInfo);
    self.animationController = new XAnimationObject();
    self.allBoneAnimation = new Array();
    self.upBodyAnimation = new Array();
    //全身を使うアニメーション
    self.animationController.set(self.modelObject, object.AnimationSetInfo[keys[0]], keys[0]);
    //上半身のみに適用するアニメーション
    self.animationController.addAnimation(object.AnimationSetInfo[keys[0]], keys[0] + "_up", ["Frame2_Bone01"]);

    //アニメーションの定義作成
    {
        self.animationController.createAnimation("stand", keys[0], 10, 11, true);
        self.animationController.createAnimation("walk", keys[0], 50, 81, true);
        self.animationController.createAnimation("back", keys[0], 100, 131, true);
        self.animationController.createAnimation("walk_R", keys[0], 3100, 3131, true);
        self.animationController.createAnimation("walk_L", keys[0], 3150, 3181, true);
        self.animationController.createAnimation("dash", keys[0], 150, 180, false, true);
        self.animationController.createAnimation("kiri1", keys[0], 2400, 2480, true);
        self.animationController.createAnimation("kiri2", keys[0], 2500, 2560, true);

        self.animationController.createAnimation("dash_F", keys[0], 150, 180, false, true);
        self.animationController.createAnimation("dash_R", keys[0], 200, 230, false, true);
        self.animationController.createAnimation("dash_L", keys[0], 250, 280, false, true);
        self.animationController.createAnimation("dash_B", keys[0], 300, 330, false, true);

        self.animationController.createAnimation("tach_Down", keys[0], 350, 352, false, true);

        self.animationController.createAnimation("Junp", keys[0], 415, 440, false, true);
        self.animationController.createAnimation("J_Down", keys[0], 440, 470, false, true);

        self.animationController.createAnimation("dmg", keys[0], 500, 540, false, true);
        self.animationController.createAnimation("down_1", keys[0], 600, 615, false, true);
        self.animationController.createAnimation("down_1_2", keys[0], 625, 650, false, true);
        self.animationController.createAnimation("down_2", keys[0], 650, 680, false, true);
        self.animationController.createAnimation("down_Rise", keys[0], 700, 735, false, true);
        self.animationController.createAnimation("down_dead", keys[0], 600, 680, false, true);

        ///////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////

        ////Wpnモーション
        self.animationController.createAnimation("RW_1_N", keys[0] + "_up", 1010, 1020, false, true);
        self.animationController.createAnimation("RW_1_2_N", keys[0] + "_up", 1029, 1030, false, true);
        self.animationController.createAnimation("RW_1_Shot_N", keys[0] + "_up", 1032, 1050, false, true);
        self.animationController.createAnimation("RW_1_End_N", keys[0] + "_up", 1032, 1050, false, false);  //繰り返さない＆最後モーションを維持せず、破棄

        /////////////////////
        self.animationController.createAnimation("RW_2_RF_N", keys[0] + "_up", 1510, 1523, false, true);
        self.animationController.createAnimation("RW_2_RF_2_N", keys[0] + "_up", 1529, 1530, false, true);
        self.animationController.createAnimation("RW_2_RF_Shot_N", keys[0] + "_up", 1530, 1550, false, true);
        self.animationController.createAnimation("RW_2_RF_End_N", keys[0] + "_up", 1550, 1560, false, false);

        /////////////////////
        self.animationController.createAnimation("RW_2_MG_N", keys[0] + "_up", 2005, 2015, false, true);
        self.animationController.createAnimation("RW_2_MG_2_N", keys[0] + "_up", 2020, 2021, false, true);
        self.animationController.createAnimation("RW_2_MG_Shot_N", keys[0] + "_up", 2020, 2022, false, true);
        self.animationController.createAnimation("RW_2_MG_End_N", keys[0] + "_up", 2022, 2035, false, false);

        ////////////////////
        self.animationController.createAnimation("RW_2_BZ", keys[0] + "_up", 2205, 2225, false, true);
        self.animationController.createAnimation("RW_2_BZ_2", keys[0] + "_up", 2229, 2230, false, true);
        self.animationController.createAnimation("RW_2_BZ_Shot_N", keys[0] + "_up", 2235, 2260, false, true);
        self.animationController.createAnimation("RW_2_BZ_End", keys[0] + "_up", 2260, 2271, false, false);

        //////
        self.animationController.createAnimation("LW_2_MG_N", keys[0] + "_up", 2910, 2923, false, true);
        self.animationController.createAnimation("LW_2_MG_2_N", keys[0] + "_up", 2929, 2930, false, true);
        self.animationController.createAnimation("LW_2_MG_Shot_N", keys[0] + "_up", 2930, 2933, false, true);
        self.animationController.createAnimation("LW_2_MG_End_N", keys[0] + "_up", 2935, 2936, false, false);
        //////////
        ////////////

        self.animationController.createAnimation("SW_R", keys[0], 2700, 2720, false, true);
        self.animationController.createAnimation("SW_R_2", keys[0], 2729, 2730, false, true);
        self.animationController.createAnimation("SW_R_Shot", keys[0], 2731, 2740, false, true);
        self.animationController.createAnimation("SW_R_End", keys[0], 2740, 2750, false, false);
        /////////////
        self.animationController.createAnimation("SW_L", keys[0], 2600, 2620, false, true);
        self.animationController.createAnimation("SW_L_2", keys[0], 2629, 2630, false, true);
        self.animationController.createAnimation("SW_L_Shot", keys[0], 2631, 2640, false, true);
        self.animationController.createAnimation("SW_L_End", keys[0], 2640, 2650, false, false);
        /////////////
        self.animationController.createAnimation("Fire1", keys[0] + "_up", 1000, 1050, false);
        self.animationController.createAnimation("Fire2", keys[0] + "_up", 2600, 2680, false);
    }


    //能力値セット
    self.meca_Stat_Const_f = [];
    self.meca_Stat_Const_f[cEnConsts_ParamF.warkS_up] = 0.02;//歩行速度上昇値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.warkS_max] = 0.5; //歩行速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.dashS_up] = 0.3; //ダッシュ速度上昇値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max] = 1.5; //ダッシュ速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.body_height] = 7.5 * Master_Chara_Size; //地上からの機体の中心・高さ	
    self.meca_Stat_Const_f[cEnConsts_ParamF.rool_S_stand] = 0.025; //機体の回転速度・立ち	
    self.meca_Stat_Const_f[cEnConsts_ParamF.rool_S_dash] = 0.015; //期待の回転速度・ダッシュ	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpS_up] = 0.04; //ジャンプの上昇速度	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpS_max] = 0.25; //ジャンプ上昇速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpD_up] = 0.05; //空中ダッシュ(斜めジャンプ)の速度上昇値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpD_max] = 0.8; //空中ダッシュ(斜めジャンプ)の速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junp_Kotyoku] = 30; //ジャンプ開始時の初期硬直	

    self.meca_Stat_Const_f[cEnConsts_ParamF.life_max] = 2300; //HP最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.gein_max] = 1000; //ゲイン最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_dash] = 2; //ダッシュ時のゲイン使用値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_junp] = 5; //ジャンプ時のゲイン使用値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_junpfast] = 100; //ジャンプ初期時のゲイン使用値	

    self.meca_Stat_Const_f[cEnConsts_ParamF.gein_regeinS] = 8; //通常時のゲイン回復値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Stand_Brake] = 0.7; //摩擦係数のようなもの：立ちからの加速の遅さ	
    self.meca_Stat_Const_f[cEnConsts_ParamF.ext_brake] = 0.85; //ダッシュ後のブレーキ性能 	

    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_dashFast] = 100; //ダッシュに最低限必要なEn残量
    self.meca_Stat_Const_f[cEnConsts_ParamF.Dash_KotyokuTime] = 15; //ダッシュ開始時の硬直フレーム時間	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Dash_FastBoostTime] = 25; //ダッシュ初期時のブースト時間(実質、上の硬直時間を引いた数だけ適用	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Dash_FastBoost] = 0.5; //ダッシュ開始時の所期ブースト加速度	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Rw_RolLock_R] = (95 * 3.141592 / 180.0); //Rw攻撃時、強制振り向き角度　右	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Rw_RolLock_L] = -(105 * 3.141592 / 180.0); //Rw攻撃時、強制振り向き角度　左	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Dmg_Tolerance] = 3.5;  //被ダメ⇒よろけまでの値  一番ダウンしないヤツで４～５くらい？	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Don_Tolerance] = 6; //被ダメ⇒ダウンまでの値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.SevTime] = 15; //ＬＷで付加されるセービングフレーム数	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Sev_Power] = 0.5; //ＬＷで付加される、ダウン耐久乗算値（少ないほうがセビ中にダウンしなくなる）	
    self.meca_Stat_Const_f[cEnConsts_ParamF.savHalfLockTime] = 45; //壁にさえぎられた半ロック常態から、完全にロックが切れるまでの時間	
    self.meca_Stat_Const_f[cEnConsts_ParamF.LockRange] = 4500 * Master_Shot_Renge_Rate; // ロック可能距離	
    self.meca_Stat_Const_f[cEnConsts_ParamF.gein_wpnFact] = 0.8;  //武器装備時、武器の重さがEn制限に与える倍数　大きいほど影響を受ける

    self.meca_Stat_Const_f[cEnConsts_ParamF.StepT_short] = 60; // ステップの最低時間	
    self.meca_Stat_Const_f[cEnConsts_ParamF.StepT_End] = 20;  //ステップの終了中のスキ時間
    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_Step] = 250; //ステップに最低限必要なEn残量

    var sphereLink1 = new BoundingLinker(self.modelObject.skeleton.bones[2], 7 * Master_Chara_Size);
    var sphereLink2 = new BoundingLinker(self.modelObject.skeleton.bones[40], 5 * Master_Chara_Size);

    self.BoundingLinkers = [sphereLink1, sphereLink2];

    if (self.loadComplete != null) {
        self.loadComplete();
    }

}

Obj_SSR06.prototype.UpdateBoundings = function (_pos) {

    var Spheres = [];

    return Spheres;
}

inherits(Obj_SSR06, ObjectSetter);

///////////////////////////////////////////////////////
/*
function Animater_SSR06()
{
    Animater.call(this);
}
inherits(Animater_SSR06, Animater);

//古くて使ってない？
Animater_SSR06.prototype.createAnimation = function( _modelobj, _animation)
{
    this.animationController = new XAnimationObject();

    var keys = Object.keys(_animation);
    //全身を使うアニメーション
    this.animationController.set(_modelobj, _animation[keys[0]], keys[0]);
    //上半身のみに適用するアニメーション
    this.animationController.addAnimation(_animation[keys[0]], keys[0] + "_up", ["Frame2_Bone01"]);
    {
        this.animationController.createAnimation("stand", keys[0], 10, 11, true); 
        this.animationController.createAnimation("wark", keys[0], 50, 82, true);
        this.animationController.createAnimation("back", keys[0], 100, 130, true); 
        this.animationController.createAnimation("dash", keys[0], 150, 180, true); 
        this.animationController.createAnimation("kiri1", keys[0], 2400, 2480, true);
        this.animationController.createAnimation("kiri2", keys[0], 2500, 2560, true); 

        this.animationController.createAnimation("Fire1", keys[0] + "_up", 1000, 1050, false); 
        this.animationController.createAnimation("Fire2", keys[0] + "_up", 2600, 2680, false); 
    }
}
*/