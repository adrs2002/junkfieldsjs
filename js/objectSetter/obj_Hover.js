/// <reference path="js/cEnBtPlayer.js"/>
/// <reference path="js/three.js"/>
/// <reference path="js/objectSetter/ObjSetter_Base.js"/>
/// <reference path="js/loaders/thrXfileLoader.js" />

"use strict";
//操作オブジェクトの元となるクラス。
//これは「1モデル（キャラクター1種類）」毎に用意され、
//各能力値などもここに格納されている。
//これも、操作キャラが増える度にインスタンスは【作られない】 ‥はず
function Obj_Hover()
{
    ObjectSetter.call(this, "Hover");
}

//オブジェクトのロードメソッド
Obj_Hover.prototype.load = function (object) {
    
    var self = this;

    self.modelObject = object.FrameInfo[0]; //XfileLoader_CopyObject(object.FrameInfo[0]);

    self.AnimationSetInfo = null;
    self.AnimationKeys = null
 
    self.name = "HMV-22C";
    //能力値セット
    self.meca_Stat_Const_f = [];
    self.meca_Stat_Const_f[cEnConsts_ParamF.warkS_up] = 0.01;//歩行速度上昇値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.warkS_max] = 0.3; //歩行速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.dashS_up] = 0.3; //ダッシュ速度上昇値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.dashS_max] = 1.5; //ダッシュ速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.body_height] = 6.5; //地上からの機体の中心・高さ	
    self.meca_Stat_Const_f[cEnConsts_ParamF.rool_S_stand] = 0.025; //機体の回転速度・立ち	
    self.meca_Stat_Const_f[cEnConsts_ParamF.rool_S_dash] = 0.015; //期待の回転速度・ダッシュ	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpS_up] = 0.04; //ジャンプの上昇速度	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpS_max] = 0.25; //ジャンプ上昇速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpD_up] = 0.05; //空中ダッシュ(斜めジャンプ)の速度上昇値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junpD_max] = 0.8; //空中ダッシュ(斜めジャンプ)の速度最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.junp_Kotyoku] = 30; //ジャンプ開始時の初期硬直	

    self.meca_Stat_Const_f[cEnConsts_ParamF.life_max] = 250; //HP最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.gein_max] = 1000; //ゲイン最大値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_dash] = 8; //ダッシュ時のゲイン使用値	
    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_junp] = 10; //ジャンプ時のゲイン使用値	
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
    self.meca_Stat_Const_f[cEnConsts_ParamF.Guse_Step] = 150; //ステップに最低限必要なEn残量

    //self.BarniaEffectBone.push(self.modelObject.skeleton.bones[37]);

    
    if (self.loadComplete != null) {
        self.loadComplete();
    }

}


inherits(Obj_Hover, ObjectSetter);

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