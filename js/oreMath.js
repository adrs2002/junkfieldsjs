/// <reference path="three.min.js"/>
"use strict";

var oreMath = {};

//８方角判別用
oreMath.Kaku_8_Limit = (20 * 3.141592 / 180.0);
oreMath.Kaku_9_Limit = (75 * 3.141592 / 180.0);
oreMath.Kaku_6_Limit = (105 * 3.141592 / 180.0);
oreMath.Kaku_3_Limit = (160 * 3.141592 / 180.0);

//４方角判別用
oreMath.Kaku_4_8_Limit = (45 * 3.141592 / 180.0);
oreMath.Kaku_4_6_Limit = (135 * 3.141592 / 180.0);

oreMath.addCamVect = new THREE.Vector3(0, 0, 1);
oreMath.rotateAxisY = new THREE.Vector3(0, 1, 0).normalize();
oreMath.rotateAxisX = new THREE.Vector3(1, 0, 0).normalize();
oreMath.VectUnitZ = new THREE.Vector3(0, 0, 1).normalize();


/// <summary>
/// 上下左右移動のキー情報から、移動方向Intを取得する
/// </summary>
oreMath.GetMoveIntbyKey = function (PadStat, now_Move_Int, rol_Y) {
    now_Move_var = 0;
    if (PadStat[GEnPadMapID.MoveUp])   //キー　↑
    {
        now_Move_var = 8;
    }
    else if (PadStat[GEnPadMapID.MoveDown])   //キー　↑
    {
        now_Move_var = 2;
    }
    //////左右//////////////
    if (PadStat[GEnPadMapID.MoveLeft]) {
        if (now_Move_var === 8) now_Move_var = 7;
        else if (now_Move_var === 2) now_Move_var = 1;
        else now_Move_var = 4;
    }
    else if (PadStat[GEnPadMapID.MoveRight]) {
        if (now_Move_var === 8) now_Move_var = 9;
        else if (now_Move_var === 2) now_Move_var = 3;
        else now_Move_var = 6;
    }

    rol_Y = oreMath.MoveRolVectByInt(now_Move_Int);


}

/// <summary>
/// 指定された移動方向に向かうためのキーを設定する
/// </summary>
/// <param name="l_keys"></param>
/// <param name="moveIit"></param>
oreMath.GetMoveKeybyMoveint = function (l_keys, moveIit) {
    for (var i = 0; i < 4; i++) {
        l_keys[i] = false;
    }
    switch (moveIit) {
        case 1:
            l_keys[GEnPadMapID.MoveLeft] = true;
            l_keys[GEnPadMapID.MoveUp] = true;
            break;
        case 2:
            l_keys[GEnPadMapID.MoveUp] = true;
            break;
        case 3:
            l_keys[GEnPadMapID.MoveRight] = true;
            l_keys[GEnPadMapID.MoveUp] = true;
            break;
        case 4:
            l_keys[GEnPadMapID.MoveLeft] = true;
            break;
        case 6:
            l_keys[GEnPadMapID.MoveRight] = true;
            break;
        case 7:
            l_keys[GEnPadMapID.MoveLeft] = true;
            l_keys[GEnPadMapID.MoveDown] = true;
            break;
        case 8:
            l_keys[GEnPadMapID.MoveDown] = true;
            break;
        case 9:
            l_keys[GEnPadMapID.MoveRight] = true;
            l_keys[GEnPadMapID.MoveDown] = true;
            break;
    }
}

/// <summary>
///　指定された移動方向から、向く角度を算出する
/// </summary>
/// <param name="nowMoveInt"></param>
/// <returns></returns>
oreMath.MoveRolVectByInt = function (nowMoveInt) {
    switch (nowMoveInt) {

        case 8: return 0.0;
        case 7: return MathHelper.Pi * +0.25;
        case 9: return MathHelper.Pi * -0.25;
        case 4: return MathHelper.Pi * +0.5;
        case 6: return MathHelper.Pi * -0.5;
        case 2: return MathHelper.Pi;
        case 1: return MathHelper.Pi * +0.75;
        case 3: return MathHelper.Pi * -0.75;
        default: return 0.0;

    }
}



/// <summary>
/// 指定された２つの角度の差を求める
/// </summary>
/// <param name="k1"></param>
/// <param name="k2"></param>
/// <returns></returns>
oreMath.GetDifKaku_F2 = function (k1, k2) {

    if (k1 < 0 && k2 < 0) {
        return oreMath.LimitKakuPI(k1 + k2);
    }
    else {
        return oreMath.LimitKakuPI(k1 - k2);
    }

}

/// <summary>
/// 指定された角度を+-PI以内にして返す
/// </summary>
/// <param name="tgt"></param>
/// <returns></returns>
//[Obsolete("MathHelper.WrapAngleを使用してください")]
oreMath.LimitKakuPI = function (tgt) {
    if (tgt === 0) return 0;

    var nowf = tgt;

    while (nowf < -Math.PI)
        nowf += Math.PI * 2;

    while (nowf > Math.PI)
        nowf -= Math.PI * 2;

    return nowf;

}

///指定された角度を2PI以内（0～360の計算ができるように）で返す
oreMath.LimitKakuPI2 = function (tgt) {
    if (tgt === 0) return 0;

    var nowf = tgt;

    while (nowf < 0)
        nowf += Math.PI * 2;

    while (nowf > Math.PI * 2)
        nowf -= Math.PI * 2;

    return nowf;
}


/// <summary>
/// 指定したベクトルのY軸から見た回転角度を取得する
/// </summary>
/// <param name="tmpV"></param>
/// <returns></returns>
oreMath.GetDifKakuY = function (tmpV) {
    var tempf = Math.atan2(tmpV.x, tmpV.z);

    return oreMath.LimitKakuPI(tempf);

}

/// <summary>
/// 指定したベクトルのX軸から見た回転角度を取得する
/// </summary>
/// <param name="tmpV"></param>
/// <returns></returns>
oreMath.GetDifKakuX = function (tmpV) {
    return Math.atan2(Math.sqrt(tmpV.x * tmpV.x + tmpV.z * tmpV.z), tmpV.y);
}

/// <summary>
/// 指定した角度とベクトルの差を求める
/// </summary>
/// <param name="tmpV"></param>
/// <param name="NowRol"></param>
/// <returns></returns>
oreMath.GetDifKaku = function (tmpV, NowRol) {
    var tempf = oreMath.GetDifKakuY(tmpV);
    tempf -= oreMath.LimitKakuPI(NowRol);
    return oreMath.LimitKakuPI(tempf);
}

/// <summary>
/// ２つのベクトルの相対角度を取る
/// </summary>
/// <param name="v1"></param>
/// <param name="v2"></param>
/// <returns></returns>
oreMath.GetDifKakuV = function (v1, v2) {
    var f1, f2;
    f1 = oreMath.GetDifKakuY(v1);
    f2 = oreMath.GetDifKakuY(v2);
    f1 -= oreMath.LimitKakuPI(f2);
    return oreMath.LimitKakuPI(f1);
}

/// <summary>
/// 2つのベクトルを加算し、長さが最初より短くなっていればTrueを返す
/// =90度以上後方にあったらTrueを返す
/// </summary>
/// <param name="v3"></param>
/// <param name="tgt"></param>
/// <returns></returns>
oreMath.CheckBack = function (v3, tgt) {
    if (v3.length() === 0 || tgt.length() === 0) return false;

    var v1 = new THREE.Vector3();
    v1.copy(v3);
    var v2 = new THREE.Vector3();
    v2.copy(tgt);

    v1.normalize();
    v2.normalize();


    return !(v1.dot(v2) > 0);
}

/// <summary>
/// ベクトルをY,Xの角度にする
/// </summary>
/// <param name="tmpV"></param>
/// <param name="kaku_Y"></param>
/// <param name="kaku_X"></param>
oreMath.VectorToRad = function (tmpV) {

    return [oreMath.oreMath.GetDifKakuY(tmpV), oreMath.GetDifKakuX(tmpV)];

}

/// <summary>
/// 指定された点(Tgt_pos)をnow_Posから注視する、正規化されたmatrixを作成する
/// </summary>
/// <param name="nowViewPos"></param>
/// <param name="Tgt_pos"></param>
/// <returns></returns>
oreMath.makeTgtmatrix = function (now_Pos, Tgt_pos) {
    var tgtMatrix = new THREE.Matrix4();

    var x = new THREE.Vector3();
    var y = new THREE.Vector3();
    var z = new THREE.Vector3();

    z.copy(Tgt_pos);
    z.sub(now_Pos);
    z.normalize();


    x.crossVectors(z, oreMath.rotateAxisY);
    x.normalize();

    y.crossVectors(z, x);
    y.normalize();

    tgtMatrix.M11 = x.x; tgtMatrix.M12 = x.y; tgtMatrix.M13 = x.z;
    tgtMatrix.M21 = y.x; tgtMatrix.M22 = y.y; tgtMatrix.M33 = y.z;
    tgtMatrix.M31 = z.x; tgtMatrix.M32 = z.y; tgtMatrix.M33 = z.z;

    return tgtMatrix;
}


/// <summary>
/// ２点から見て、別の２点が同じ側にあるかどうか調べる関数
/// </summary>
/// <param name="r1">見る点1</param>
/// <param name="r2">見る点2</param>
/// <param name="p1">ポイント1</param>
/// <param name="p2">ポイント2</param>
/// <returns></returns>
/*
                                        var SameDirection( r1,  r2,  p1,  p2)
                                    {
                                        double r1x = r1.X;
                                        double r1z = r1.Z;
                                        double nvZ = r1z - r2.Z;
                                        double nvX = r1x - r2.X;
                                        double vx = p1.X - r1x;
                                        double vz = p1.Z - r1z;
                                        double lx = p2.X - r1x;
                                        double lz = p2.Z - r1z;
                                        return (nvX * vx + nvZ * vz) * (nvX * lx + nvZ * lz) > 0;
                                    }
                                    */

/// <summary>
/// 対象の点が、３角形を構成する３点の内側にあるかどうかを調べる
/// </summary>
/// <param name="triangle_p">３角形を構成する３点</param>
/// <param name="tgt_p">対象の点</param>
/// <returns></returns>
/*
                                    function IsInsideTriangle(Vector3[] triangle_p, Vector3 tgt_p)
                                        {
                                            if (!SameDirection(triangle_p[0], triangle_p[1], triangle_p[2], tgt_p))
                                                return false;
                                            if (!SameDirection(triangle_p[1], triangle_p[2], triangle_p[0], tgt_p))
                                                return false;
                                            if (!SameDirection(triangle_p[2], triangle_p[0], triangle_p[1], tgt_p))
                                                return false;

                                            return true;
                                        }
                                        */
/// <summary>
/// Y軸にkakudo分回転させたベクトルを返す
/// </summary>
/// <param name="tgt"></param>
/// <param name="kakudo"></param>
/// <returns></returns>
oreMath.RolVectorY = function (tgt, kakudo) {

    var refV = new THREE.Vector3();
    refV.copy(tgt);
    refV.x = (tgt.x * Math.cos(kakudo) - tgt.z * Math.sin(kakudo));
    refV.z = (tgt.x * Math.sin(kakudo) + tgt.z * Math.cos(kakudo));
    return refV;

}

/// <summary>
/// X軸にkakudo分回転させたベクトルを返す
/// </summary>
/// <param name="tgt"></param>
/// <param name="kakudo"></param>
/// <returns></returns>
oreMath.RolVectorX = function (tgt, kakudo) {
    var refV = new THREE.Vector3();
    refV.copy(tgt);
    refV.Y = (tgt.x * Math.sin(kakudo) + tgt.y * Math.cos(kakudo));
    return refV;
}

/// <summary>
/// 指定したｘとｙに回転したベクトルを返す
/// </summary>
/// <param name="tgt"></param>
/// <param name="kaku_x"></param>
/// <param name="kaku_y"></param>
oreMath.RoltoVector = function (tgt, kaku_x, kaku_y) {
    var refV = new THREE.Vector3();
    refV.copy(tgt);
    refV = oreMath.RolVectorY(refV, kaku_y);
    refV = oreMath.RolVectorX(refV, kaku_x);
    return refV;
}


/// <summary>
/// 指定したｘとｙに向くためのベクトルを返す
/// </summary>
/// <param name="tgt"></param>
/// <param name="kaku_x"></param>
/// <param name="kaku_y"></param>
oreMath.RoltoVector = function (kaku_x, kaku_y) {
    var nq = new THREE.Quaternion();
    nq.setFromEuler(new THREE.Euler(kaku_x, kaku_y, 0), false);
    return new THREE.Vector3(nq.x, nq.y, nq.z);
}


/// <summary>
/// 	Floatで入ってきた相対角度から、方角としてのＩｎｔ型を返す
/// </summary>
/// <param name="kakudo"></param>
/// <returns></returns>
oreMath.Get_DistKakuInt8 = function (dist_kaku) {
    if (dist_kaku < 0) {
        dist_kaku = Math.Abs(dist_kaku);
        if (dist_kaku < oreMath.Kaku_8_Limit) return 8;
        if (dist_kaku < oreMath.Kaku_9_Limit) return 2;
        if (dist_kaku < oreMath.Kaku_6_Limit) return 6;
        if (dist_kaku < oreMath.Kaku_3_Limit) return 3;
        return 2;
    }
    else {
        dist_kaku = Math.Abs(dist_kaku);
        if (dist_kaku < oreMath.Kaku_8_Limit) return 8;
        if (dist_kaku < oreMath.Kaku_9_Limit) return 7;
        if (dist_kaku < oreMath.Kaku_6_Limit) return 4;
        if (dist_kaku < oreMath.Kaku_3_Limit) return 1;
        return 2;
    }
}

/// <summary>
/// 	Floatで入ってきた相対角度から、４方角のＩｎｔ型を返す
/// </summary>
/// <param name="kakudo"></param>
/// <returns></returns>
oreMath.Get_DistKakuInt4 = function (dist_kaku) {
    if (dist_kaku < 0) {
        dist_kaku = Math.abs(dist_kaku);
        if (dist_kaku < oreMath.Kaku_4_8_Limit) return 8;
        if (dist_kaku < oreMath.Kaku_4_6_Limit) return 6;
        return 2;
    }
    else {
        dist_kaku = Math.abs(dist_kaku);
        if (dist_kaku < oreMath.Kaku_4_8_Limit) return 8;
        if (dist_kaku < oreMath.Kaku_4_6_Limit) return 4;
        return 2;
    }
}


/// <summary>
/// 指定したベクトルを向くMatrixを作成する
/// </summary>
/// <param name="tgtV">向きたいベクトル</param>
/// <returns></returns>
oreMath.V_to_rolM = function (baseV) {
    var dctV = new THREE.Vector3();
    dctV.copy(baseV);
    dctV.cross(oreMath.rotateAxisY);

    var mx = new THREE.Matrix4();

    mx.set(dctV.x, dctV.y, dctV.z, 0,
        0, 1, 0, 0,
        baseV.x, baseV.y, baseV.z, 0,
        0, 0, 0, 1);
}

/// <summary>
/// XZ平面で見た２点間の距離を返す
/// </summary>
/// <param name="v1"></param>
/// <param name="v2"></param>
/// <returns></returns>
oreMath.tgtLeng2 = function (_v1, _v2) {
    var v1 = new THREE.Vector2();
    var v2 = new THREE.Vector2();

    v1.set(_v1.x, _v1.z);
    v2.set(_v2.x, _v2.z);

    v1.sub(v2);
    return v1.length();
}

/// <summary>
/// 武器IDから、２つのベクトルを移動する際に掛かる時間を測定する
/// </summary>
/// <param name="BasePos"></param>
/// <param name="rockVect"></param>
/// <param name="BulletID"></param>
/// <returns></returns>
oreMath.GetYosokuDist = function (BasePos, rockVect, /*clsBurret*/ brt) {
    //敵の予測位置を産出する
    var nv = new THREE.Vector3();
    nv.copy(rockVect);
    nv.sub(BasePos);
    //目標地点まで到達するには何フレームかかるかを産出
    return nv.length() / brt.tama_speed;

}

/// <summary>
/// 武器と敵IDから、着弾時の位置を予測する
/// </summary>wwwww
/// <param name="BasePos"></param>
/// <param name="TgtID"></param>
/// <param name="BulletID"></param>
/// <returns></returns>
oreMath.GetYosokuPos = function (BasePos, TgtObj, speed) {

    if (TgtObj.bp.Movespeed === 0) return TgtObj.CenterPos;

    var nv = new THREE.Vector3();
    nv.copy(TgtObj.CenterPos);
    nv.sub(BasePos);
    //単純な目標地点まで到達するには何フレームかかるかを産出
    var f = nv.length();
    f = f / speed;

    var LoggetI;
    //10フレ以内だったら予測いらなくね？
    if (f > 10.0) {

        //最後のベクトル　*　玉移動がかかる時間で、予測位置を出す。かなりおおざっぱだが
        nv.copy(TgtObj.CenterPos);
        nv.x += TgtObj.bp.Vect.x * 10; // * f;  fだと大きく動きすぎてキモかった
        nv.z += TgtObj.bp.Vect.z * 10; // * f;

    }
    else {
        nv.copy(TgtObj.CenterPos);
    }

    //予測地点の地形を考慮する

    var tmpgloundflg = false;
/*
    if (AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].GldOn[1])
    {
        //地形考慮
        var L_temp_Y = oreCommon.GetPosHeight(nv) + TgtObj.CenterPos.y;
        if (L_temp_Y > nv.y) { nv.y = L_temp_Y; }
    }
*/
    return new THREE.Vector4(nv.x, nv.y, nv.z, f);
}

/// <summary>
/// oreMath.GetYosokuPos Step1 　敵の位置を返すだけ
/// </summary>
/// <param name="TgtID"></param>
/// <returns></returns>
oreMath.getYosokuPos_St1 = function (TgtID) {
    return ScreenUpdater.players[TgtID].bp.CenterTgtPos;
}


/// <summary>
/// oreMath.GetYosokuPos Step2 　直近５フレームのベクトルを返す
/// </summary>
/// <param name="TgtID"></param>
/// <returns></returns>
oreMath.getYosokuPos_St2 = function (TgtID) {
    /*
            Vector3 nv = new Vector3();
            var LoggetI = 0;
            for (var i = clsConst.NowKey_int; i > clsConst.NowKey_var - 5; i--)
            {
                LoggetI = i;
                nv = Vector3.Add(nv, AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].prmP.getOldVect(ref LoggetI));
            }
            nv = Vector3.Multiply(nv, 0.2f);
            return nv;
            */

}



/// <summary>
/// 武器と敵IDから、着弾時の位置を予測する(max３フレーム先しか狙わないver）
/// </summary>
/// <param name="BasePos"></param>
/// <param name="TgtID"></param>
/// <param name="BulletID"></param>
/// <returns></returns>
oreMath.GetYosokuPos3 = function (BasePos, TgtID, speed, heightSetFlg, rockVect) {
    /*
        //敵の予測位置を産出する
        Vector3 nv = new Vector3();
        rockVect = oreMath.getYosokuPos_St1(ref TgtID);
        nv = Vector3.Add(rockVect, -BasePos);
        //目標地点まで到達するには何フレームかかるかを産出
        var f = nv.Length() / speed;

        var LoggetI;
        //10フレ以内だったら予測いらなくね？
        if (f > 3.0)
        {
            f = 3.0f;

            //現在の敵位置に、過去5フレームの平均値を加算し、それを目標地点とする 
            nv = oreMath.getYosokuPos_St2(ref TgtID);

            //空中の状態で分岐
            if (!AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].GldOn[0] && heightSetFlg)
            {
                //空中状態の理由によって分岐
                //ダメージだった場合で上昇値だった場合、ゼロにする
                //ジャンプタイムがゼロで空中なら、ダメージ処理での空中とする
                if (AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].prm.using_Time[ cEnStat_ParamTime.Stat_Junp_time] == 0)
                {
                    if (nv.Y > 0) nv.Y = 0.5f;
                }
                rockVect.Y = BasePos.Y;
            }


            rockVect = Vector3.Add(rockVect, Vector3.Multiply(nv, f));

            if (AllMain.CurrentScreen.BtScreen.ClosedAreaFlg)
            {
                rockVect.x = MathHelper.Clamp(rockVect.x, AllMain.CurrentScreen.BtScreen.MoveArea[(int)Ground_Pos_ID.X_min],
                                                         AllMain.CurrentScreen.BtScreen.MoveArea[(int)Ground_Pos_ID.X_max]);

                rockVect.z = MathHelper.Clamp(rockVect.z, AllMain.CurrentScreen.BtScreen.MoveArea[(int)Ground_Pos_ID.Z_min],
                                                         AllMain.CurrentScreen.BtScreen.MoveArea[(int)Ground_Pos_ID.Z_max]);
            }

        }

        //予測地点の地形を考慮する

        var tmpgloundflg = false;

        //if (AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].GldOn[1])
        {
            //地形考慮
            var L_temp_Y = AllMain.CurrentScreen.BtScreen.GetLandHeight(ref rockVect, ref tmpgloundflg);

            //機体自体の高さ考慮
            if (TgtID < 1000)
            {
                //壁の上を予測してしまう、「としこ宇宙へ」を防ぐ
                if (AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].GldOn[1])
                {
                    if (L_temp_Y > BasePos.Y + 20) L_temp_Y = AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].Pos.Y;
                }

                if (heightSetFlg) L_temp_Y += AllMain.CurrentScreen.BtScreen.BT_Players[TgtID].CenterHeight.Y;
            }

            if (L_temp_Y > rockVect.Y)//&& Math.Abs(L_temp_Y - rockVect.Y) < 5)
            {
                rockVect.Y = L_temp_Y;
            }
        }
        */
}

/// <summary>
/// Matrixから角度XYZを返す
/// </summary>
/// <param name="mx"></param>
/// <returns></returns>
oreMath.GetAngleV3fromMatrix = function (m) {

    var rerV = new THREE.Vector3();

    var E = new THREE.Euler();
    E.setFromRotationMatrix(m, 'XYZ', false);

    return rerV.set(E.x, E.y, E.z);
}

/// <summary>
/// 目標とする数値に足りなかったら、加算する。オーバーしていたら減算する
/// </summary>
/// <param name="IsFusu">trueなら負の計算を行う</param>
/// <returns></returns>
oreMath.AddingAndDecFloat = function (tgtF, MaxF, AddingF, decF, IsFusu) {
    if (!IsFusu) {
        if (MaxF > tgtF) {
            tgtF += AddingF;
        }
        else {
            tgtF -= decF;
        }
    }
    else {
        if (-MaxF < tgtF) {
            tgtF -= AddingF;
        }
        else {
            tgtF += decF;
        }
    }
}



/// <summary>
/// 対象ポイントから円形にセットされたPosを返す
/// </summary>
/// <param name="BasePos">円の中心位置</param>
/// <param name="_count">セットするPosの個数</param>
/// <param name="Dist">中心位置からの距離</param>
oreMath.GetRolPoints = function (BasePos, _count, Dist) {
    var refPoses = [];

    var vDist = new THREE.Vector3;
    vDist.set(0, 0, Dist);

    var q = new THREE.Quaternion();

    var tmp_rol = Math.PI * 2 / _count;
    for (var i = 0; i < _count; i++) {

        q.set(0, 1, 0, tmp_rol * i);
        refPoses.push(vDist.applyQuaternion(q));

    }

    return refPoses;
}


/// <summary>
/// 指定された移動方向から、向く角度を算出する
/// </summary>
oreMath.MoveRolVectByInt = function (nowMoveInt) {
    switch (nowMoveInt) {
        case 8: return 0;
        case 7: return Math.PI * +0.25;
        case 9: return Math.PI * -0.25;
        case 4: return Math.PI * +0.5;
        case 6: return Math.PI * -0.5;
        case 2: return Math.PI;
        case 1: return Math.PI * +0.75;
        case 3: return Math.PI * -0.75;
        default: return 0;


    }
}

