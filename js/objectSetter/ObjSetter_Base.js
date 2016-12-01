/// <reference path="../three.min.js"/>

"use strict";
//操作オブジェクトの元となるクラス
//いわばC#のabstructクラスっぽいことをやってみたかった
function ObjectSetter(name)
{
    this.name = name;
    this.modelObject = null;

    this.AnimationSetInfo = null;
    this.AnimationKeys = null;

    this.animationController = null;

    this.BarniaEffectBone = [];
    this.BulletEffectBone = [];

    this.mountWpnBone = [];

    this.allBoneAnimation = new Array();
    this.upBodyAnimation = new Array();
    
    /// <summary>CPU思考</summary>
    //this.CpuParam = new strCpuParams();

    //各「機体」で持っているパラメータ
    this.meca_Stat_Const_f = [];

    this.BoundingLinkers = [new BoundingLinker()];
}

ObjectSetter.prototype = {};
//クラスメソッドの定義
ObjectSetter.prototype.init = function () { 

};

ObjectSetter.prototype.loadComplete = function () { };

///////////////////////////////////

//ボーンに併せて動くアタリ判定球（BondingSphere)
function BoundingLinker(_bone, _radius, _transPoint) {
    this.LinkBone = _bone != undefined ? _bone : null;
    this.Radius = _radius != undefined ? _radius : 10;
    this.transPoint = _transPoint != undefined ? _transPoint : new THREE.Vector3(0,5,0);

    this.BoundingSphere = new THREE.Sphere(new THREE.Vector3(), _radius);

    this.tmpV3 = new THREE.Vector3();
}

BoundingLinker.prototype.Update = function (_pos) {
    if (this.LinkBone == null) {
        this.BoundingSphere.set(_pos, this.Radius);
    }
    else {
        this.tmpV3.copy(this.transPoint);
        this.LinkBone.localToWorld(this.tmpV3);
        this.BoundingSphere.set(this.tmpV3, this.Radius);
    }
}

////////////////////////


var inherits = function (childCtor, parentCtor) {
    // 子クラスの prototype のプロトタイプとして 親クラスの
    // prototype を指定することで継承が実現される
    Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};