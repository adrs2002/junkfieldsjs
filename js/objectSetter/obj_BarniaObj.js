
"use strict";

function Obj_BarniaObj(object) {

  this.nowUseMode = "dmy";

  this.name = "Barnia";
  this.modelObject = object.FrameInfo[0]; //XfileLoader_CopyObject(object.FrameInfo[0]);

  this.ModelObject = this.modelObject;

  this.AnimationSetInfo = object.AnimationSetInfo;
  this.AnimationKeys = Object.keys(object.AnimationSetInfo);

  //アニメーションコントローラーをセット＆作成する
  var keys = Object.keys(object.AnimationSetInfo);
  this.animationController = new XAnimationObject();
  this.allBoneAnimation = new Array();
  this.upBodyAnimation = new Array();
  //全身を使うアニメーション
  this.animationController.set(this.modelObject, object.AnimationSetInfo[keys[0]], keys[0]);
  //上半身のみに適用するアニメーション
  //self.animationController.addAnimation(object.AnimationSetInfo[keys[0]], keys[0] + "_up", ["Frame2_Bone01"]);
  this.animationController.createAnimation("init", keys[0], 9, 10, false, true);
  this.animationController.createAnimation("use", keys[0], 10, 35, false, true);
  this.animationController.createAnimation("stop", keys[0], 36, 50, false, true);
  if (this.loadComplete != null) {
    this.loadComplete();
  }
  //this.nowMotion_base = "";
  this.Animater = this.animationController;
  this.ModelObject.castShadow = false;
  
  //質感セット
  for (var i = 0; i < this.ModelObject.material.materials.length; i++) {
    this.ModelObject.material.materials[i].side = THREE.DoubleSide;
    this.ModelObject.material.materials[i].color.set(0x1133ff);
    this.ModelObject.material.materials[i].specular.set(0x000000);
    this.ModelObject.material.materials[i].shininess = 0;
    this.ModelObject.material.materials[i].reflectivity = 0;
    //this.ModelObject.material.materials[0].emissive.set(0x5555ff);
    this.ModelObject.material.materials[i].transparent = true;
    this.ModelObject.material.materials[i].depthTest = true;
    this.ModelObject.material.materials[i].blending = THREE.AdditiveBlending;
    this.ModelObject.material.materials[i].depthFunc = THREE.NeverDepth;
    this.ModelObject.material.materials[i].depthWrite = false;

  }
}

Obj_BarniaObj.prototype.SetUse = function (_flg) {
  var self = this;
  if (_flg != self.nowUseMode) {
    if (_flg) {
      self.Animater.beginAnimation("use", true);
    } else {
      self.Animater.beginAnimation("stop", true);
    }
  }
  self.nowUseMode = _flg;

  if (_flg) {    
    //self.animationController.ActionInfo["use"].nowMorphPower = 1.0;
    self.modelObject.skeleton.bones[0].appendMatrix.makeRotationZ(ScreenUpdater.scene_spanTime % 100 * 0.01);
  }

};
