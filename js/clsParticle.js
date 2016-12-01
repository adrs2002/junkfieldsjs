/// <reference path="three.min.js"/>
"use strict";

var particleComp = particleComp || {};


particleComp.pat_Max = 300;
particleComp.pt_bill_Add = [];
particleComp.pt_bill_Alp = [];
particleComp.pt_Obj_Add = [];
particleComp.pt_bullet_Add = [];
particleComp.uv_set = new THREE.Vector2(0.125, 0.125);
particleComp.p_tmpf = 0;
particleComp.p_tmpf2 = 0;


particleComp.emitterParams = [];
particleComp.emitterMax = 5;



/// <summary>ビルボードエフェクト指定</summary>
var cEnBillbdEfeID =
    {
        /// <summary>通常丸型爆発</summary>
        bom_1: 0,
        /// <summary>上に広がる爆発 </summary>
        bom_2: 1,
        /// <summary>赤⇒黒煙になる爆発 </summary>
        bom_A_new: 2,

        /// <summary>Hit用汎用炸裂 </summary>
        splead_1: 3,
        /// <summary>中央が開いた炸裂(衝撃波）</summary>
        spSonic_1: 4,

        /// <summary>土煙用煙</summary>
        kemuri_1: 5,
        /// <summary>土煙用煙2</summary>
        kemuri_2: 6,
        /// <summary>大型炸裂</summary>
        splead_2: 7,

        /// <summary>煙3</summary>
        kemuri_3: 8,
        /// <summary>最初が紅い煙</summary>
        kemuri_4: 9,

        /// <summary>チャージエフェクト</summary>
        cargeEf: 10,

        /// <summary>アニメーションする渦</summary>
        uzu_1: 11,

        /// <summary>1枚の細い渦</summary>
        uzu_2: 12,

        /// <summary>鋭い棒</summary>
        Bou_A: 13,

        /// <summary>爆風用球体</summary>
        Ball: 14,

        /// <summary>白煙</summary>
        kemuri_Add: 15,

        /// <summary>つぶ、粒子</summary>
        Tubu: 16,

        /// <summary>単純な●パーティ来る</summary>
        Simple: 17,

        /// <summary>円柱</summary>
        EnTyu: 18,

        /// <summary>円柱(上が広がっている）</summary>
        EnTyu2: 19,


        /// <summary>撃破時エミッター 前フリ爆発あり+黒煙</summary>
        emitter_destroy: 2000,
        /// <summary>撃破時エミッター 爆発のみ+黒煙</summary>
        emitter_destroy2: 2001,
        /// <summary>撃破時エミッター　 爆発のみで黒煙が出ない </summary>
        emitter_destroy3: 2002,
        /// <summary>指定方向に１列に爆発を５個出す </summary>
        emitter_VectBlast5: 2003,

        /// <summary>撃破後の黒煙（小）</summary>
        emitter_kokuen_s: 3000,
        /// <summary>撃破後の黒煙（大）</summary>
        emitter_kokuen: 3001,

        /// <summary>ユーザーが変更できるエフェクト</summary>
        emitter_edit: 9999,
    }

//ユーザー変更調整用パラメータ
var emitterParam = function () {
    this.Enabled = true;
    this.AddtiveImages = false;
    this.interval = 10;
    this.spleadPower = 2.0;
    this.efe_type = 0;
    this.efeImgSpeed = 1.0;
    this.matType = 0;
    this.efeSize = 5.0;
    this.efeSizeFactor = 1.0;
    this.viscosity = 0.00;
    this.visco_Y_Disable = false;
    this.moveType = "2";

    this.moveSpeed = 1.0;
};


///パーティくる更新
particleComp.ParticeUpdate = function (_ptArray, _dul) {
    var tmpPt = new THREE.Matrix4();
    for (var i = 0; i < _ptArray.length; i++) {
        _ptArray[i].update(_dul);
    }
}

///パーティクル追加
particleComp.AddParticle = function (_ptArray, _pat) {
    for (var i = 0; i < _ptArray.length; i++) {
        if (!_ptArray[i].On) {
            _ptArray[i].SetOn(_pat);
            break;
        }
    }
}


///パーティクル表示のためのバッファ更新
particleComp.ParticeSetGL = function (_ptArray, _igeo, _is3d, _isBurret) {
    var nowCount = 0;
    if (_igeo == null) { return; }


    var tmpPt = new THREE.Matrix4();
    var viewProjection = new THREE.Matrix4();
    var tmpV3 = new THREE.Vector3();
    //まず、パーティクルをソートする
    var sortedIndex = [];
    var sortTarget = [];

    viewProjection.copy(threeComps.camera.matrixWorld);
    viewProjection.multiply(threeComps.camera.matrixWorldInverse);
    viewProjection.multiply(threeComps.camera.projectionMatrix);


    for (var i = 0; i < _ptArray.length; i++) {
        sortedIndex.push(i);
        if (_ptArray[i].On) {
            nowCount++;
            //視点からの距離を配列に入れていく
            tmpV3 = _ptArray[i].getPos();

            //いい加減な計算だけど、これでとりあえずなんとかなってる～　　ような
            tmpV3.sub(threeComps.camera.position);
            sortTarget.push(tmpV3.length());

        } else {
            sortTarget.push(-10000 + i);
        }
    };

    sortedIndex = CombSort(sortedIndex, sortTarget, _ptArray.length, false);

    for (var i = 0; i < sortedIndex.length; i++) {

        tmpPt = _ptArray[sortedIndex[i]].GetHLSL_OutMX(tmpPt);

        /// m11,m12,m13 ...Vect3,XYZ Pos,
        /// m21,m22,m23 ...Vect3 XYZ Rol(別の統合Matrixから取得),
        /// m31,m32,m33 ...Vect3 XYZ siz3D,
        /// m41,m42,m43,m44 ...Vect4 Colors,
        /// m14...AddUVPos_X,
        /// m24...AddUVPos_Y
        /// m34...Siz2D

        /*  未練
        var idx = i * _igeo.attributes.exmat.itemSize;

        for (var m = 0; m < _igeo.attributes.exmat.itemSize; m++) {
            _igeo.attributes.exmat.array[idx + m] = tmpPt.elements[m];
        }
        */

        /*
            var translations = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 3), 3, 1);
            var adduv = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 2), 2, 1);

            var ptcol = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 3), 3, 1);
            var addsize = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max), 1, 1);
        */

        if (_ptArray[sortedIndex[i]].On) {
            _igeo.attributes.translation.array[i * 3 + 0] = tmpPt.elements[0];
            _igeo.attributes.translation.array[i * 3 + 1] = tmpPt.elements[1];
            _igeo.attributes.translation.array[i * 3 + 2] = tmpPt.elements[2];
        }
        else {
            _igeo.attributes.translation.array[i * 3 + 1] = -1000;
        }

        if (_is3d) {
            _igeo.attributes.addsize3d.array[i * 3 + 0] = tmpPt.elements[8];
            _igeo.attributes.addsize3d.array[i * 3 + 1] = tmpPt.elements[9];
            if (!_isBurret) {
                _igeo.attributes.addsize3d.array[i * 3 + 2] = tmpPt.elements[10];
            } else {
                _igeo.attributes.addsize3d.array[i * 3 + 2] = tmpPt.elements[10] * Math.min(_ptArray[sortedIndex[i]].TimeA * 0.003, 1);
            }
            _igeo.attributes.addvect.array[i * 3 + 0] = tmpPt.elements[4];
            _igeo.attributes.addvect.array[i * 3 + 1] = tmpPt.elements[5];
            _igeo.attributes.addvect.array[i * 3 + 2] = tmpPt.elements[6];
        } else {
            _igeo.attributes.addsize.array[i * 1 + 0] = tmpPt.elements[8];
        }

        _igeo.attributes.ptcol.array[i * 4 + 0] = tmpPt.elements[12];
        _igeo.attributes.ptcol.array[i * 4 + 1] = tmpPt.elements[13];
        _igeo.attributes.ptcol.array[i * 4 + 2] = tmpPt.elements[14];
        _igeo.attributes.ptcol.array[i * 4 + 3] = tmpPt.elements[15];

        _igeo.attributes.adduv.array[i * 2 + 0] = tmpPt.elements[3];
        _igeo.attributes.adduv.array[i * 2 + 1] = tmpPt.elements[7];
    }
    _igeo.attributes.translation.needsUpdate = true;

    if (_is3d) {
        _igeo.attributes.addsize3d.needsUpdate = true;
        _igeo.attributes.addvect.needsUpdate = true;
    } else {
        _igeo.attributes.addsize.needsUpdate = true;
    }

    _igeo.attributes.ptcol.needsUpdate = true;
    _igeo.attributes.adduv.needsUpdate = true;

    return nowCount;
}



particleComp.makeGeo_bill = function (_tex, useMat) {
    //頂点の自力作成。PlaneGeometryでいいって？まぁそう言うな。いろいろあるんだ。
    var geo = new THREE.Geometry();
    geo.vertices.push(new THREE.Vector3(-1, 1, 0)); //左上
    geo.vertices.push(new THREE.Vector3(1, 1, 0));//右上
    geo.vertices.push(new THREE.Vector3(-1, -1, 0));//左下
    geo.vertices.push(new THREE.Vector3(1, -1, 0));//右下


    geo.faces = [
        new THREE.Face3(0, 1, 2, new THREE.Vector3(0, 0, 1).normalize()),
        new THREE.Face3(2, 1, 3, new THREE.Vector3(0, 0, 1).normalize())
    ];

    //ここのUVの値のMaxを1ではなくすることにより、画像の一部のみを表示するようにしている
    geo.faceVertexUvs[0] = [];
    geo.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0.125),
        new THREE.Vector2(0.125, 0.125),
        new THREE.Vector2(0, 0)
    ]);

    geo.faceVertexUvs[0].push([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.125, 0.125),
        new THREE.Vector2(0.125, 0)
    ]);

    //自作シェーダーとマテリアルの割り当て。
    var nowMat = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('indexbill_vs').textContent,
        fragmentShader: document.getElementById('indexbill_fs').textContent,
        uniforms: {
            texture: { type: 't', value: _tex }
        }
    });

    nowMat.transparent = true;
    nowMat.depthFunc = THREE.NeverDepth;
    nowMat.depthWrite = false;
    if (useMat != null) {
        nowMat.depthTest = useMat.depthTest;
        nowMat.side = useMat.side;
        nowMat.blending = useMat.blending;
    } else {
        nowMat.depthTest = true;
        nowMat.side = THREE.DoubleSide;
        nowMat.blending = THREE.AdditiveBlending;
    }

    geo.computeFaceNormals();

    geo.verticesNeedUpdate = true;
    geo.normalsNeedUpdate = true;
    geo.colorsNeedUpdate = true;
    geo.uvsNeedUpdate = true;
    geo.groupsNeedUpdate = true;

    //ジオメトリをコピー
    var bgeo = new THREE.BufferGeometry().fromGeometry(geo);

    // ジオメトリインスタンシング用のバッファを生成
    var _igeo = new THREE.InstancedBufferGeometry();

    // 頂点データをコピーし、バッファに設定
    var vertices = bgeo.attributes.position.clone();
    _igeo.addAttribute('position', vertices);

    // 実際に手でバッファを作る場合は以下のように`BufferAttribute`を生成する
    // var rawVertices = data.vertices;
    // var vertices = new THREE.BufferAttribute(new Float32Array(rawVertices), 3);
    // geometory.addAttribute('position', vertices);

    // UVデータをコピーし、バッファに設定
    var uvs = bgeo.attributes.uv.clone();
    _igeo.addAttribute('uv', uvs);

    // インスタンス向けの個別のデータ
    //exmat = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 16), 16, 1);

    var translation = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 3), 3, 1);
    var adduv = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 2), 2, 1);

    var ptcol = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 4), 4, 1);
    var addsize = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max), 1, 1);


    //////////////
    ////  exmat の中身は、以下のように定義
    ////    exmat[0].xyz = position.xyz
    ////    exmat[1].xyz = rotation.xyz
    ////    exmat[2].xyz = scale.xyz
    ////    exmat[3].xyz = color.xyz(rgb)
    ////    exmat[0].w  =  uv-adding.x
    ////    exmat[1].w  =  uv-adding.y
    ////    exmat[2].w  =  Siz2D

    /// m11,m12,m13 ...Vect3,XYZ Pos,
    /// m21,m22,m23 ...Vect3 XYZ Rol(別の統合Matrixから取得),
    /// m31,m32,m33 ...Vect3 XYZ siz3D,
    /// m41,m42,m43,m44 ...Vect4 Colors,
    /// m14...AddUVPos_X,
    /// m24...AddUVPos_Y
    /// m34...Siz2D
    ///   GetHLSL_OutMX を参照


    //それぞれの初期値を設定
    var vector = new THREE.Vector4();
    /*
    for (var i = 0, ul = exmat.count; i < ul; i++) {
        //位置
        var x = Math.random() * 100 - 50;
        var y = Math.random() * 100 - 50;
        var z = Math.random() * 100 - 50;
        vector.set(x, y, z, 0).normalize();
        translations.setXYZ(i, x + vector.x * 3, y + vector.y * 3, z + vector.z * 3);

        ptcol.setXYZ(i, Math.random(), Math.random(), Math.random());

        //画像の初期もずらして、バラけるようにアニメーション
        var rand = Math.floor(Math.random() * 6);
        adduv.setXY(i, rand, 0);

        addsize.setX(i, Math.random() * 8);
    }
    */
    //インスタンスとシェーダーアトリビュートの関連付け確定
    //_igeo.addAttribute('exmat', exmat);

    _igeo.addAttribute('translation', translation);
    _igeo.addAttribute('ptcol', ptcol);
    _igeo.addAttribute('adduv', adduv);
    _igeo.addAttribute('addsize', addsize);

    var mesh = new THREE.Mesh(_igeo, nowMat);
    mesh.frustumCulled = false;
    threeComps.scene.add(mesh);

    return _igeo;
}


///ビルボードではない、普通のオブジェクトを利用するインスタンス化
particleComp.makeGeo_obj = function (model, _tex, useMat) {

    //自作シェーダーとマテリアルの割り当て。
    var nowMat = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('indexObj_vs').textContent,
        fragmentShader: document.getElementById('indexbill_fs').textContent,
        uniforms: {
            texture: { type: 't', value: _tex }
        }
    });

    nowMat.transparent = true;
    nowMat.depthFunc = THREE.NeverDepth;
    nowMat.depthWrite = false;
    if (useMat != null) {
        nowMat.depthTest = useMat.depthTest;
        nowMat.side = useMat.side;
        nowMat.blending = useMat.blending;
    } else {
        nowMat.depthTest = true;
        nowMat.side = THREE.DoubleSide;
        nowMat.blending = THREE.AdditiveBlending;
    }

    //ジオメトリをコピー
    var bgeo = new THREE.BufferGeometry().fromGeometry(model);

    // ジオメトリインスタンシング用のバッファを生成
    var _igeo = new THREE.InstancedBufferGeometry();

    // 頂点データをコピーし、バッファに設定
    var vertices = bgeo.attributes.position.clone();
    _igeo.addAttribute('position', vertices);

    // 実際に手でバッファを作る場合は以下のように`BufferAttribute`を生成する
    // var rawVertices = data.vertices;
    // var vertices = new THREE.BufferAttribute(new Float32Array(rawVertices), 3);
    // geometory.addAttribute('position', vertices);

    // UVデータをコピーし、バッファに設定
    var uvs = bgeo.attributes.uv.clone();
    _igeo.addAttribute('uv', uvs);

    // インスタンス向けの個別のデータ
    //exmat = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 16), 16, 1);

    var translation = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 3), 3, 1);
    var adduv = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 2), 2, 1);

    var ptcol = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 4), 4, 1);
    var addsize3d = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 3), 3, 1);
    var addvect = new THREE.InstancedBufferAttribute(new Float32Array(particleComp.pat_Max * 3), 3, 1);
    //それぞれの初期値を設定
    var vector = new THREE.Vector4();
    /*
    for (var i = 0, ul = exmat.count; i < ul; i++) {
        //位置
        var x = Math.random() * 100 - 50;
        var y = Math.random() * 100 - 50;
        var z = Math.random() * 100 - 50;
        vector.set(x, y, z, 0).normalize();
        translations.setXYZ(i, x + vector.x * 3, y + vector.y * 3, z + vector.z * 3);

        ptcol.setXYZ(i, Math.random(), Math.random(), Math.random());

        //画像の初期もずらして、バラけるようにアニメーション
        var rand = Math.floor(Math.random() * 6);
        adduv.setXY(i, rand, 0);

        addsize.setX(i, Math.random() * 8);
    }
    */
    //インスタンスとシェーダーアトリビュートの関連付け確定
    //_igeo.addAttribute('exmat', exmat);

    _igeo.addAttribute('translation', translation);
    _igeo.addAttribute('ptcol', ptcol);
    _igeo.addAttribute('adduv', adduv);
    _igeo.addAttribute('addsize3d', addsize3d);
    _igeo.addAttribute('addvect', addvect);

    var mesh = new THREE.Mesh(_igeo, nowMat);
    mesh.frustumCulled = false;
    threeComps.scene.add(mesh);

    return _igeo;
}


//パーティクル初期化
particleComp.particle_init = function () {
    particleComp.pt_bill_Add = new Array();
    for (var i = 0; i < particleComp.pat_Max; i++) {
        var pt = new Particle();
        pt.imageId2 = 0;
        particleComp.pt_bill_Add.push(pt);
    }
    particleComp.pt_bill_Alp = new Array();
    for (var i = 0; i < particleComp.pat_Max; i++) {
        var pt = new Particle();
        pt.imageId2 = 1;
        particleComp.pt_bill_Alp.push(pt);
    }
    //////////
    particleComp.pt_bullet_Add = new Array();
    for (var i = 0; i < particleComp.pat_Max; i++) {
        var pt = new Particle();
        pt.imageId2 = -1;
        particleComp.pt_bullet_Add.push(pt);
    }

    particleComp.pt_Obj_Add = new Array();
    for (var i = 0; i < particleComp.pat_Max; i++) {
        var pt = new Particle();
        pt.imageId2 = 1;
        particleComp.pt_Obj_Add.push(pt);
    }
}




//////////////////////////////////////////////////////////////////////////////////////////////////

var Particle = function () {

    this.tmpV3 = new THREE.Vector3;

    /// <summary>
    /// 圧縮構造体。
    ///     m11,m12,m13 ...Vect3,XYZ Pos,
    ///     m21,m22,m23 ...Vect3 XYZ Vect,
    ///     m31,m32,m33 ...Vect3 XYZ siz3D,
    ///     m41,m42,m43 ...Vect3 XYZ sizFactor3D,
    ///     m14 ...float power, 動き強度係数。この数がVectに掛けられ、移動する。0なら移動しない 
    ///     m24 ...float power2,　強度変化計数。この値がm14に枚フレーム加算される。マイナスなら徐々に遅くなり、プラスなら徐々に早くなる
    ///     m34  ...float sizFactor,PosVectSizAndFact
    /// </summary>
    this.PosVectSizAndFact = new THREE.Matrix4;
    /*
    this.Pos = new THREE.Vector3;
    this.Vect = new THREE.Vector3;
    this.siz3D = new THREE.Vector3;
    this.sizFactor3D = new THREE.Vector3;
    */
    /// <summary>
    /// その他格納値１・
    ///     m11,m12,m13 ...Vect3,XYZ Rol ,

    ///     m21,m22...float Rol_x, Rol_y,
    ///                                             旧：m31,m32...float LastKakuX,LastKakuY,
    ///     m21,m22,m23 ...Vect3 XYZ OldVect,
    ///     m41,m42...float AdduvPosX,AdduvPosY,
    ///     m14...float movedf,
    ///     m24...float reng,
    ///     m14...float alphaSub,
    ///     m43...float Hitradius
    /// </summary>

    this.RolandETC1 = new THREE.Matrix4;


    /// <summary>実際に存在するかどうかのフラグ</summary>
    this.On = false;
    /// <summary>当たり判定フラグ</summary>
    this.HitOn = false;
    /// <summary>表示フラグ</summary>
    this.ViewFlg = false;
    /// <summary>地上に沿うかどうかのフラグ </summary>
    this.Gldon = false;
    /// <summary>trueなら逆向きにする</summary>
    this.Revarsflg = false;
    /// <summary>時間１</summary>
    this.TimeA = 0;
    /// <summary>時間２</summary>
    this.TimeB = 0;
    /// <summary>時間２への加算係数</summary>
    this.timeFactor_B = 0;
    /// <summary>エフェクトの種類 </summary>
    this.efe_type = 0;
    /// <summary>画像指定ID </summary>
    this.imageId = 0;
    /// <summary>画像指定ID(オブジェクトエフェクト用のモデル指定：または加算透明：0，アルファ：1 -1：3Dオブジェクト) </summary>
    this.imageId2 = 0;
    /// <summary>マテリアル種別</summary>
    this.matType = 0;

    this.ptAlpha = 1.0;
    /// <summary>当たり判定連結数 </summary>
    this.Hitcount = 0;
    /// <summary>当たり判定球 </summary>
    //private BoundingSphere hitball;

    /// <summary>残像を出す場合、カーブさせるかどうか</summary>
    this.ZanzoCarveFlg = false;

    /// <summary>ロックオンターゲット(Bulletで使用)</summary>
    this.TgtId = -1;
    /// <summary>リンクオブジェクトのID。-1ならリンクなし。PlayerID,MountPos,Pos連番</summary>
    this.LinkId = [-1, -1, -1, -1];

    /// <summary>打った機体のグループID </summary>
    this.launchGroupID = 0;

    /// <summary>残像用マトリックス </summary>
    this.zanzoMatrix = null;
    /// <summary>残像を出すかどうかのフラグ</summary>
    this.zanzoInt = 0;


    /// <summary>角度オーバーフラグX</summary>
    this.kakuFlgX = 0;

    /// <summary>角度オーバーフラグY</summary>
    this.kakuFlgY = 0;

    /// <summary>ロックチェック間隔 </summary>
    this.LockCheckDist = 0;

    /// <summary>
    /// 配列番号
    /// </summary>
    this.indexID = 0;

    /// <summary>地面とのチェックカウンタ</summary>
    this.checkCounter = 0;

    /// <summary>emitterチェックカウンタ</summary>
    this.EmitCounter = 0;

    /// <summary>玉で使う、角度修正保持値</summary>
    this.Addvect = new THREE.Vector3;

    /// <summary>ランダム回転を適用するかどうか </summary>
    this.RandRoll = 0;

    /// <summary>出現時のフレーム数</summary>
    this.fastFrame = 0;

    /// <summary>終末弾道フラグ</summary>
    this.terminalFlg = false;

    /// <summary>加算透明させるかどうかのフラグ</summary>
    this.isDrawAdd = true;

    this.tempF = 0.0;

    this.BulletObj = null;

    this.ExtColor = new THREE.Vector3;

    this.befPos = new THREE.Vector3();

    this.ChageToKaku = new THREE.Vector3();

    this.HoseiPrm_DMG = 1.0;    //玉管理時のダメージ補正倍率

    this.lock_distNow = 0;
    //ロックオン中の敵ID。100未満ならPlayer属性、100以上なら100を引いてEnemyObj属性
    this.Lock_eneID = -1;
}

Particle.prototype = {
    constructor: Particle,

    /// <summary>
    /// HLSLに出力されるMatrix
    /// m11,m12,m13 ...Vect3,XYZ Pos,
    /// m21,m22,m23 ...Vect3 XYZ Rol(別の統合Matrixから取得),
    /// m31,m32,m33 ...Vect3 XYZ siz3D,
    /// m41,m42,m43,m44 ...Vect4 Colors,
    /// m14...AddUVPos_X,
    /// m24...AddUVPos_Y
    /// m34...Siz2D
    /// </summary>
    GetHLSL_OutMX: function (refMx) {
        var tgtIndex = 0;

        tgtIndex = 1;

        //refMx = PosVectSizAndFact;
        refMx.elements[0] = this.PosVectSizAndFact.elements[0];
        refMx.elements[1] = this.PosVectSizAndFact.elements[1];
        refMx.elements[2] = this.PosVectSizAndFact.elements[2];

        //set UvAdd
        refMx.elements[3] = this.RolandETC1.elements[12];
        refMx.elements[7] = this.RolandETC1.elements[13];
        refMx.elements[11] = tgtIndex;

        //set Vector
        refMx.elements[4] = this.PosVectSizAndFact.elements[4];
        refMx.elements[5] = this.PosVectSizAndFact.elements[5];
        refMx.elements[6] = this.PosVectSizAndFact.elements[6];

        //set Size
        refMx.elements[8] = this.PosVectSizAndFact.elements[8];
        refMx.elements[9] = this.PosVectSizAndFact.elements[9];
        refMx.elements[10] = this.PosVectSizAndFact.elements[10];

        if (this.imageId2 === 1) {
            refMx.elements[12] = 1;
            refMx.elements[13] = 1;
            refMx.elements[14] = 1;
            refMx.elements[15] = this.ptAlpha;
            /*
            refMx.elements[12] = this.ExtColor.x;
            refMx.elements[13] = this.ExtColor.y;
            refMx.elements[14] = this.ExtColor.z;
            refMx.elements[15] = 1.0;
            */
        } else {
            refMx.elements[15] = this.ptAlpha;
            switch (this.matType) {
                case 0:
                    refMx.elements[12] = 1.5;
                    refMx.elements[13] = 0.4;
                    refMx.elements[14] = 0.2;
                    break;
                case 1:
                    refMx.elements[12] = 0.2;
                    refMx.elements[13] = 1.5;
                    refMx.elements[14] = 0.4;
                    break;
                case 2:
                    refMx.elements[12] = 0.2;
                    refMx.elements[13] = 0.4;
                    refMx.elements[14] = 1.5;
                    break;
                default:
                    refMx.elements[12] = 1.5;
                    refMx.elements[13] = 1.5;
                    refMx.elements[14] = 1.5;
                    break;
            }
        }
        return refMx;
    },

    /// <summary>
    /// PosにVectを足す
    /// </summary>
    AddPosVect: function () {
        //ps.Pos = ps.Pos + ps.VECT;
        this.PosVectSizAndFact.elements[0] += this.PosVectSizAndFact.elements[4] * this.PosVectSizAndFact.elements[3];
        this.PosVectSizAndFact.elements[1] += this.PosVectSizAndFact.elements[5] * this.PosVectSizAndFact.elements[3];
        this.PosVectSizAndFact.elements[2] += this.PosVectSizAndFact.elements[6] * this.PosVectSizAndFact.elements[3];
        this.RolandETC1.elements[3] += this.PosVectSizAndFact.elements[3];

        this.PosVectSizAndFact.elements[3] += this.PosVectSizAndFact.elements[7];
        if (this.PosVectSizAndFact.elements[3] < 0) { this.PosVectSizAndFact.elements[3] = 0; }
    },

    AddSize: function () {
        //ps.Pos = ps.Pos + ps.VECT;
        this.PosVectSizAndFact.elements[8] += this.PosVectSizAndFact.elements[12];
        this.PosVectSizAndFact.elements[9] += this.PosVectSizAndFact.elements[13];
        this.PosVectSizAndFact.elements[10] += this.PosVectSizAndFact.elements[14];
    },

    setPos: function (_v) {
        this.PosVectSizAndFact.elements[0] = _v.x;
        this.PosVectSizAndFact.elements[1] = _v.y;
        this.PosVectSizAndFact.elements[2] = _v.z;
    },

    getPos: function () {
        this.tmpV3.x = this.PosVectSizAndFact.elements[0];
        this.tmpV3.y = this.PosVectSizAndFact.elements[1];
        this.tmpV3.z = this.PosVectSizAndFact.elements[2];
        return this.tmpV3;
    },

    setVect: function (_v) {
        this.PosVectSizAndFact.elements[4] = _v.x;
        this.PosVectSizAndFact.elements[5] = _v.y;
        this.PosVectSizAndFact.elements[6] = _v.z;
    },

    getVect: function () {
        this.tmpV3.x = this.PosVectSizAndFact.elements[4] * this.PosVectSizAndFact.elements[3];
        this.tmpV3.y = this.PosVectSizAndFact.elements[5] * this.PosVectSizAndFact.elements[3];
        this.tmpV3.z = this.PosVectSizAndFact.elements[6] * this.PosVectSizAndFact.elements[3];
        return this.tmpV3;
    },

    setSiz: function (_f) {
        this.PosVectSizAndFact.elements[8] = _f;
        this.PosVectSizAndFact.elements[9] = _f;
        this.PosVectSizAndFact.elements[10] = _f;
    },

    setSizFactor: function (_f) {
        this.PosVectSizAndFact.elements[12] = _f;
        this.PosVectSizAndFact.elements[13] = _f;
        this.PosVectSizAndFact.elements[14] = _f;
    },


    setSiz3D: function (_v) {
        this.PosVectSizAndFact.elements[8] = _v.x;
        this.PosVectSizAndFact.elements[9] = _v.y;
        this.PosVectSizAndFact.elements[10] = _v.z;
    },

    setSiz3D_2: function (_x, _y, _z) {
        this.PosVectSizAndFact.elements[8] = _x;
        this.PosVectSizAndFact.elements[9] = _y;
        this.PosVectSizAndFact.elements[10] = _z;
    },

    setSizFactor3D: function (_v) {
        this.PosVectSizAndFact.elements[12] = _v.x;
        this.PosVectSizAndFact.elements[13] = _v.y;
        this.PosVectSizAndFact.elements[14] = _v.z;
    },

    getAlphaSub: function () {
        return this.RolandETC1.elements[4];
    },
    setAlphaSub: function (_f) {
        this.RolandETC1.elements[4] = _f;
    },

    setAddUv: function (_x, _y) {
        this.RolandETC1.elements[12] = _x;
        this.RolandETC1.elements[13] = _y;
    },

    setSpeed: function (_f) {
        this.PosVectSizAndFact.elements[3] = _f;
    },

    //動き粘性
    setViscosity: function (_f) {
        this.PosVectSizAndFact.elements[7] = _f;
    },

    setRange: function (_f) {
        this.RolandETC1.elements[7] = _f;
    },


    SetOn: function (_tmpP) {
        this.On = true;
        this.TimeA = 0;
        this.TimeB = 0;
        this.timeFactor_B = 1;
        this.PosVectSizAndFact.elements[7] = 0;
        this.checkCounter = 3;
        this.EmitCounter = 0;
        this.terminalFlg = false;
        this.ChageToKaku.set(0, 0, 0);
        this.ptAlpha = 1.0;
        if (_tmpP != undefined) {
            this.PosVectSizAndFact.copy(_tmpP.PosVectSizAndFact);
            this.RolandETC1.copy(_tmpP.RolandETC1);
            this.TimeB = _tmpP.TimeB;
            this.timeFactor_B = _tmpP.timeFactor_B;
            if (this.timeFactor_B === 0) { this.timeFactor_B = 1; }

            this.PosVectSizAndFact.elements[7] = _tmpP.PosVectSizAndFact.elements[7];

            this.matType = _tmpP.matType;
            this.imageId = _tmpP.imageId;
            //this.imageId2 = _tmpP.imageId2;
            this.efe_type = _tmpP.efe_type;
            this.HitOn = _tmpP.HitOn;
            this.launchGroupID = _tmpP.launchGroupID;
            this.HoseiPrm_DMG = _tmpP.HoseiPrm_DMG;
            if (_tmpP.LinkId != null) {
                this.LinkId = [_tmpP.LinkId[0], _tmpP.LinkId[1], _tmpP.LinkId[2], _tmpP.LinkId[3]];
            }

            this.Lock_eneID = _tmpP.Lock_eneID;
        }
        this.BulletObj = _tmpP.BulletObj;
        this.RolandETC1.elements[13] = 1;
        this.RolandETC1.elements[12] = 1;

    },

    SetOff: function () {
        this.On = false;
        this.ViewFlg = false;
        this.TimeA = 0;
        this.TimeB = 0;
        this.setSiz(0);
    },

    //引数のパーティクルをコピーする
    copy: function (_pat) {
        this.efe_type = _pat.efe_type;
        this.PosVectSizAndFact.copy(_pat.PosVectSizAndFact);
        this.RolandETC1.copy(_pat.RolandETC1);
        this.imageId = _pat.imageId;
        this.imageId2 = _pat.imageId2;
        this.matType = _pat.matType;
        this.timeFactor_B = _pat.timeFactor_B;
    },

    //地面との判定チェック
    getHitCheck_Ground: function () {
        this.checkCounter--;
        if (this.checkCounter < 1) {
            //当たり判定チェック（地面との)
            var baseV = new THREE.Vector3();
            baseV.y = -1;
            var C_pos = new THREE.Vector3();
            C_pos.copy(this.getPos());
            C_pos.y = 2000;

            var ray = new THREE.Raycaster(C_pos, baseV.normalize());

            // 交差判定
            var objs = ray.intersectObject(oreCommon.heightObject);
            for (var i = 0; i < objs.length; i++) {
                if (objs[0].point.y > this.PosVectSizAndFact.elements[1]) {
                    this.SetOff();
                    //爆発を出す
                    var _pat = new Particle();
                    _pat.setPos(this.getPos());
                    _pat.setSiz(10);
                    _pat.setSizFactor(0.2);
                    particleComp.AddParticle(particleComp.pt_bill_Alp, _pat);
                }
            }

            this.checkCounter = 2;
        }

    },

    //各キャラクターとの判定
    getHitCheck_Chara: function () {

        var tmpVp = new THREE.Vector3();
        tmpVp.copy(this.getVect());
        var ray = new THREE.Raycaster(this.befPos, tmpVp.normalize());

        for (var i = 0; i < ScreenUpdater.players.length; i++) {
            if (this.getHitCheck_Chara_step2(ray, ScreenUpdater.players[i])) { return; }
        }

        for (var i = 0; i < ScreenUpdater.etcObject.length; i++) {
            if (this.getHitCheck_Chara_step2(ray, ScreenUpdater.etcObject[i])) { return; }
        }

    },

    getHitCheck_Chara_step2: function (ray, _c) {
        if (_c.bp.On && _c.bp.groupID != this.launchGroupID) {
            var hitV = null;
            for (var m = 0; m < _c.BaseObject.BoundingLinkers.length; m++) {
                var hitV = ray.ray.intersectSphere(_c.BaseObject.BoundingLinkers[m].BoundingSphere);
                if (hitV != null) {
                    //方角（ベクトル）は命中一致。あとは距離
                    hitV.sub(this.befPos);
                    var f = hitV.length();
                    if (f <= this.PosVectSizAndFact.elements[3] + _c.BaseObject.BoundingLinkers[m].Radius) {
                        this.SetOff();
                        //命中時爆発を出す
                        var _pat = null;
                        if (this.BulletObj != undefined && this.BulletObj.blt_efe_Hit_Efe != undefined && this.BulletObj.blt_efe_Hit_Efe.length > 0) {
                            for (var i = 0; i < this.BulletObj.blt_efe_Hit_Efe.length; i++) {
                                _pat = new Particle();
                                _pat.copy(this.BulletObj.blt_efe_Hit_Efe[i]);
                                _pat.setPos(this.getPos());
                                this.tmpV3.set(0, 0, 0);
                                _pat.setVect(this.tmpV3);
                                _pat.setSpeed(0);
                                _pat.setRange(255); //Vectをセットしたら必ずRangeもセットしないと即消えになってしまう
                                switch (_pat.imageId2) {
                                    case -1: particleComp.AddParticle(particleComp.pt_Obj_Add, _pat); break;
                                    case 0: particleComp.AddParticle(particleComp.pt_bill_Add, _pat); break;
                                    case 1: particleComp.AddParticle(particleComp.pt_bill_Alp, _pat); break;
                                }
                            }
                        } else {
                            _pat = new Particle();
                            _pat.setPos(this.getPos());
                            _pat.setSiz(10);
                            _pat.setSizFactor(0.2);
                            particleComp.AddParticle(particleComp.pt_bill_Alp, _pat);
                        }

                        //さらにダメージを与える
                        _c.bp.meca_Stat_Value_f[cEnChara_ParamFloat.life] -= this.BulletObj.attack_P * this.HoseiPrm_DMG;


                        if (_c.bp.meca_Stat_Value_f[cEnChara_ParamFloat.life] <= 0) {
                            if (this.LinkId[0] === 0) {
                                //撃墜表示
                                addDisplayInfo(cEnConsts_DisplayInfoType.EnemyDestroy, 120, "DESTORY");
                            }
                        } else {
                            if (this.LinkId[0] === 0) {
                                //命中表示
                                addDisplayInfo(cEnConsts_DisplayInfoType.EnemyHit, 75, "HIT");
                            } else {
                                //ヘイト値加算
                            }
                        }


                        return true;
                    }
                }
            }
        }
        return false;
    },

    //ロックオン時の玉の動き
    lockOnMove: function () {
        if (this.BulletObj.missileFlg) {
            this.lock_distNow++;
            if (this.lock_distNow >= this.BulletObj.lock_distFrame || this.terminalFlg) {
                if (this.TimeA >= this.BulletObj.lock_direy) {
                    //追尾ベクトルを再計算
                    this.lock_distNow = 0;
                    //距離から、何F後に着弾するかを割り出す
                    var tgtV4 = null;
                    //this.Lock_eneID = 0;
                    if (this.Lock_eneID < 100) {
                        if (ScreenUpdater.players[this.Lock_eneID] == undefined || !ScreenUpdater.players[this.Lock_eneID].bp.On) { return; }
                        tgtV4 = oreMath.GetYosokuPos(this.getPos(), ScreenUpdater.players[this.Lock_eneID], this.BulletObj.tama_speed);
                    } else {
                        if (ScreenUpdater.etcObject[this.Lock_eneID - 100] == undefined || !ScreenUpdater.etcObject[this.Lock_eneID - 100].bp.On) { return; }
                        tgtV4 = oreMath.GetYosokuPos(this.getPos(), ScreenUpdater.etcObject[this.Lock_eneID - 100], this.BulletObj.tama_speed);
                    }
                    if (tgtV4.w <= this.BulletObj.lock_distFrame) { this.terminalFlg = true; }
                    else {
                        //敵の近くに行くまでは、やや上方を狙うと本物っぽい
                        if (tgtV4.w > 50) {
                            tgtV4.y += 20;
                        }
                    }
                    //割り出し後の位置からベクトル再計算
                    var tgtV = new THREE.Vector3();
                    tgtV.set(tgtV4.x, tgtV4.y, tgtV4.z);
                    tgtV.sub(this.getPos());
                    tgtV.normalize();   //的に100％向かうベクトル　がこちら

                    //現在のベクトルを用意
                    var tgtV_now = new THREE.Vector3();
                    tgtV_now.copy(this.getVect());

                    this.tmpV3.copy(this.getVect());
                    this.tmpV3.sub(tgtV);
                    var vectLeng = this.tmpV3.length();
                    vectLeng = this.BulletObj.kaku_max / vectLeng;
                    if (vectLeng > 1.0) { vectLeng = 1.0; }
                    tgtV_now.lerp(tgtV, vectLeng);
                    tgtV_now.normalize();

                    this.setVect(tgtV_now);
                }
            }
            //割り出したベクトルが急に曲がりすぎないようにする
            /*
            var kaku_base = oreMath.VectorToRad(this.getVect().normalize());
            var kaku_to = oreMath.VectorToRad(this.ChageToKaku);
            if (kaku_to[0] === 0 && kaku_to[1] === 0) {
            } else {
                var dif_kaku = [0, 0];
                for (var i = 0; i < 2; i++) {
                    dif_kaku[i] = Math.clamp(kaku_to[i] - kaku_base[i], this.BulletObj.kaku_max * -1, this.BulletObj.kaku_max);
                }
                tgtV = oreMath.RoltoVector(kaku_base[0] + dif_kaku[0], kaku_base[1] + dif_kaku[1]);
                this.setVect(tgtV.normalize());
            }
            */

        }
    },
    ///////////////////////////////////

    update: function (_dul) {
        if (this.On) {
            this.ViewFlg = true;
            this.befPos.copy(this.getPos());
            this.AddPosVect();
            this.AddSize();
            this.TimeA += _dul;
            this.TimeB += this.timeFactor_B;
            if (this.RolandETC1.elements[3] > this.RolandETC1.elements[7]) {
                this.SetOff();
            }

            //test 
            //this.setSiz( 3 + this.TimeA * 0.05);

            if (this.HitOn && this.efe_type < 1000) {

                //ミサイル系なら追尾する
                this.lockOnMove();
                //地面との判定チェック
                this.getHitCheck_Ground();
                //こっちは各キャラクターとの判定
                this.getHitCheck_Chara();

                //通過時に出すエフェクト
                if (this.BulletObj.ActEfe_Emit_Int > 0) {
                    this.EmitCounter--;
                    if (this.EmitCounter <= 0 && this.BulletObj.blt_efe_Act_Efe != undefined) {
                        //通過時子パーティクルを追加
                        this.EmitCounter = this.BulletObj.ActEfe_Emit_Int;
                        var _pat = new Particle();
                        _pat.copy(this.BulletObj.blt_efe_Act_Efe);
                        _pat.setPos(this.getPos());
                        this.tmpV3.set(0, 0, 0);
                        _pat.setVect(this.tmpV3);
                        _pat.setSpeed(0);
                        _pat.setRange(255); //Vectをセットしたら必ずRangeもセットしないと即消えになってしまう
                        switch (_pat.imageId2) {
                            case -1: particleComp.AddParticle(particleComp.pt_Obj_Add, _pat); break;
                            case 0: particleComp.AddParticle(particleComp.pt_bill_Add, _pat); break;
                            case 1: particleComp.AddParticle(particleComp.pt_bill_Alp, _pat); break;
                        }
                    }
                }
            }


            this.tempF = this.TimeB / 4;
            //RolandETC1  m41,m42...float AdduvPosX,AdduvPosY,
            if (this.imageId2 === 0) {
                switch (this.efe_type) {
                    case 0:
                        //小さめ炸裂
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 3;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        //else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        //else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 1:
                        //大きめ炸裂
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 2;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        //else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        //else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 2:
                        //渦
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 1;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        else { this.SetOff(); }
                        break;

                    case 3:
                        //中心穴あき炸裂
                        this.ptAlpha = 1.0 - this.tempF * 0.25;
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 4;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        //else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        //else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        //else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        //else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 4:
                        //乗算用白煙
                        this.RolandETC1.elements[13] = 0;//1 - particleComp.uv_set.y * 8;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        //else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        //else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    //チャージがまだ



                    case 101:
                        //大きめ炸裂グラ固定の玉
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 2;
                        this.RolandETC1.elements[12] = 0;
                        break;


                    case cEnBillbdEfeID.emitter_kokuen_s:
                        this.EmitCounter--;
                        if (this.EmitCounter < 1) {
                            var _pat = new Particle();
                            oreCommon.sceneCom_TempV3.copy(this.getPos());
                            oreCommon.sceneCom_TempV3.x += (Math.random() - 0.5) * this.PosVectSizAndFact.elements[8];
                            oreCommon.sceneCom_TempV3.z += (Math.random() - 0.5) * this.PosVectSizAndFact.elements[8];
                            _pat.efe_type = 5;
                            _pat.setPos(oreCommon.sceneCom_TempV3);
                            particleComp.p_tmpf2 = Math.random();
                            particleComp.p_tmpf = particleComp.p_tmpf2;
                            if (particleComp.p_tmpf < 0.5) { particleComp.p_tmpf += 0.5; }
                            //particleComp.p_tmpf += 1;
                            _pat.setSiz(this.PosVectSizAndFact.elements[8] * particleComp.p_tmpf);
                            //particleComp.p_tmpf = particleComp.p_tmpf2 - 0.5;
                            _pat.setSizFactor(particleComp.p_tmpf * 0.3);
                            //particleComp.p_tmpf = particleComp.p_tmpf2;
                            //if (particleComp.p_tmpf > 0.5) { particleComp.p_tmpf -= 0.5; }
                            _pat.timeFactor_B = 0.001 + particleComp.p_tmpf * 0.05;
                            oreCommon.sceneCom_TempV3.set(0, _pat.PosVectSizAndFact.elements[8] * 3, 0);
                            _pat.setVect(oreCommon.sceneCom_TempV3);
                            _pat.setSpeed(_pat.timeFactor_B * 2);
                            _pat.setRange(255); //Vectをセットしたら必ずRangeもセットしないと即消えになってしまう
                            particleComp.AddParticle(particleComp.pt_bill_Alp, _pat);
                            this.EmitCounter = 20 + Math.min(this.TimeA * 0.0001, 40);
                        }

                        this.RolandETC1.elements[13] = 0;//1 - particleComp.uv_set.y * 8;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else { this.TimeB = 0; }

                        break;


                    case cEnBillbdEfeID.emitter_kokuen:
                        this.EmitCounter--;
                        if (this.EmitCounter < 1) {
                            var _pat = new Particle();
                            oreCommon.sceneCom_TempV3.copy(this.getPos());
                            oreCommon.sceneCom_TempV3.x += (Math.random() - 0.5) * this.PosVectSizAndFact.elements[8] * 2;
                            oreCommon.sceneCom_TempV3.z += (Math.random() - 0.5) * this.PosVectSizAndFact.elements[8] * 2;
                            _pat.efe_type = 5;
                            _pat.setPos(oreCommon.sceneCom_TempV3);
                            particleComp.p_tmpf2 = Math.random();
                            particleComp.p_tmpf = particleComp.p_tmpf2;
                            if (particleComp.p_tmpf < 0.5) { particleComp.p_tmpf += 0.5; }
                            //particleComp.p_tmpf += 1;
                            _pat.setSiz(this.PosVectSizAndFact.elements[8] * particleComp.p_tmpf);
                            particleComp.p_tmpf = particleComp.p_tmpf2 - 0.5;
                            _pat.setSizFactor(particleComp.p_tmpf2);
                            particleComp.p_tmpf = particleComp.p_tmpf2;
                            if (particleComp.p_tmpf > 0.5) { particleComp.p_tmpf -= 0.5; }
                            _pat.timeFactor_B = 0.001 + particleComp.p_tmpf * 0.05;
                            oreCommon.sceneCom_TempV3.set(0, _pat.PosVectSizAndFact.elements[8], 0);
                            _pat.setVect(oreCommon.sceneCom_TempV3);
                            _pat.setSpeed(_pat.timeFactor_B * 2);
                            _pat.setRange(255); //Vectをセットしたら必ずRangeもセットしないと即消えになってしまう
                            particleComp.AddParticle(particleComp.pt_bill_Alp, _pat);
                            this.EmitCounter = 20;
                        }

                        this.RolandETC1.elements[13] = 0;//1 - particleComp.uv_set.y * 8;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1;; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        //else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else { this.TimeB = 0; }

                        break;


                    case cEnBillbdEfeID.emitter_edit:
                        this.EmitCounter--;
                        if (this.EmitCounter < 1 && particleComp.emitterParams[this.matType].Enabled) {
                            var _pat = new Particle();
                            oreCommon.sceneCom_TempV3.copy(this.getPos());
                            oreCommon.sceneCom_TempV3.x += (Math.random() - 0.5) * this.PosVectSizAndFact.elements[8] * particleComp.emitterParams[this.matType].spleadPower;
                            oreCommon.sceneCom_TempV3.z += (Math.random() - 0.5) * this.PosVectSizAndFact.elements[8] * particleComp.emitterParams[this.matType].spleadPower;
                            _pat.setPos(oreCommon.sceneCom_TempV3);

                            _pat.efe_type = particleComp.emitterParams[this.matType].efe_type;

                            _pat.setSiz(particleComp.emitterParams[this.matType].efeSize);
                            _pat.setSizFactor(particleComp.emitterParams[this.matType].efeSizeFactor);

                            _pat.timeFactor_B = 0.1 + particleComp.emitterParams[this.matType].efeImgSpeed;

                            switch (particleComp.emitterParams[this.matType].moveType) {
                                case "0": oreCommon.sceneCom_TempV3.set(0, 0, 0); break;
                                case "1": oreCommon.sceneCom_TempV3.set(0, Math.random(), 0); break;
                                case "2": oreCommon.sceneCom_TempV3.set((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)); break;
                            }
                            _pat.setVect(oreCommon.sceneCom_TempV3);

                            _pat.setSpeed(particleComp.emitterParams[this.matType].moveSpeed);
                            _pat.setRange(255); //Vectをセットしたら必ずRangeもセットしないと即消えになってしまう
                            _pat.setViscosity(particleComp.emitterParams[this.matType].viscosity);
                            _pat.matType = particleComp.emitterParams[this.matType].matType;
                            if (particleComp.emitterParams[this.matType].AddtiveImages) {
                                particleComp.AddParticle(particleComp.pt_bill_Add, _pat);
                            }
                            else {
                                particleComp.AddParticle(particleComp.pt_bill_Alp, _pat);
                            }

                            this.EmitCounter = particleComp.emitterParams[this.matType].interval;
                            //他のエミッターのタイミングも合わせる必要がある
                            if (this.matType === 1) {
                                for (var i = 0; i < particleComp.pt_bill_Add.length; i++) {
                                    if (particleComp.pt_bill_Add[i].On && particleComp.pt_bill_Add[i].efe_type === cEnBillbdEfeID.emitter_edit && particleComp.pt_bill_Add[i].matType > 1) {
                                        particleComp.pt_bill_Add[i].EmitCounter = 0;
                                    }
                                }
                            }

                        }
                        break;

                }
            } else if (this.imageId2 === 1) {
                //this.ExtColor.x = 1; this.ExtColor.y = 1; this.ExtColor.z = 1;
                this.ptAlpha = 0.8;
                switch (this.efe_type) {

                    case 0:
                        //
                        this.ptAlpha = 0.8 - this.tempF * 0.1;
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 1:
                        //
                        this.ptAlpha = 0.8 - this.tempF * 0.1;
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 2;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 2:
                        //やや上に指向性のある爆発
                        this.ptAlpha = 0.8 - this.tempF * 0.1;
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 3;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 3:
                        //煙１＠白い
                        this.ptAlpha = 0.4 - this.tempF * 0.05;
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 4;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        //else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 4:
                        //煙2＠灰色
                        this.ptAlpha = 0.4 - this.tempF * 0.05;
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 5;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        //else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }
                        break;

                    case 5:
                        //赤→黒煙に変わる爆発
                        this.ptAlpha = 0.8 - this.tempF * 0.1;
                        this.RolandETC1.elements[13] = 1 - particleComp.uv_set.y * 6;
                        if (this.tempF <= 1) { this.RolandETC1.elements[12] = 0; }
                        else if (this.tempF <= 2) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 1; }
                        else if (this.tempF <= 3) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 2; }
                        else if (this.tempF <= 4) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 3; }
                        else if (this.tempF <= 5) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 4; }
                        else if (this.tempF <= 6) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 5; }
                        else if (this.tempF <= 7) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 6; }
                        else if (this.tempF <= 8) { this.RolandETC1.elements[12] = particleComp.uv_set.x * 7; }
                        else { this.SetOff(); }

                        if (this.timeFactor_B < 0.25) { this.timeFactor_B += 0.01; }

                        break;

                }
            } else {
                this.RolandETC1.elements[13] = 0;
                this.RolandETC1.elements[12] = 0;
            }
        }
    },

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////

/// <summary>
/// 昆布･･･コムソート
/// コレ今回いみあるかな？
/// </summary>
/// <param int[]  name="tgtIndex">ソート前の値のIndex値を格納する配列</param>
/// <param float[]  name="data">ソート対象配列</param>
/// <param ushort name="tgtlen">対象の要素数。ソート対象は、配列の要素数にはしていない。</param>
/// <param bool name="SortFlg">ソートのフラグ。trueで昇順、　false で降順になる</param>
function CombSort(tgtIndex, data, tgtlen, SortFlg) {
    if (tgtlen <= 1) return tgtIndex;

    //var tgtIndex = [];

    var shrink = 1.3;
    var gap = tgtlen;
    var flag = true;

    var Islast = false;

    //退避値
    var escf = 0.0;
    var escI = 0;

    while (true) {

        gap = (gap / shrink) ^ 0;
        if (gap <= 1) { gap = 1; Islast = true; }
        if ((gap === 9) || (gap === 10)) { gap = 11; }

        for (var i = 0; i + gap < tgtlen; i++) {
            if (SortFlg) {
                flag = data[i] > data[i + gap];
            } else {
                flag = data[i] < data[i + gap];
            }

            if (flag) {
                escf = data[i];
                data[i] = data[i + gap];
                data[i + gap] = escf;

                escI = tgtIndex[i];
                tgtIndex[i] = tgtIndex[i + gap];
                tgtIndex[i + gap] = escI;
            }

        }

        if (Islast) {
            break;
        }
    }

    return tgtIndex;
}

