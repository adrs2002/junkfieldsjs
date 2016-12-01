/// <reference path="three.min.js"/>

"use strict";
/// <summary>90度</summary>
var KD090 = Math.PI / 2;
/// <summary>89度(真横先回時、後ろ向きになりにくいようにしている)</summary>
var KD089 = Math.PI / 2 - 0.01;

/// <summary>135度</summary>
var KD135 = Math.PI / 2 + Math.PI / 4;
/// <summary>45度</summary>
var KD045 = Math.PI / 4;
/// <summary>60度</summary>
var KD060 = Math.PI / 3;
/// <summary>30度</summary>
var KD030 = Math.PI / 6;

/// <summary>15度</summary>
var KD015 = Math.PI / 12;

/// <summary>90度を加算するmatrix</summary>
var mx_rol090 = new THREE.Matrix4();
mx_rol090.makeRotationFromEuler(new THREE.Euler(-KD090, 0, 0));

var qt_rol090 = new THREE.Quaternion();
qt_rol090.setFromEuler(new THREE.Euler(-KD090, 0, 0));

///<summary>２Ｄスプライト　としてのエフェクトの最大数</summary>
var SpliteEfect_MAX = 50;
///<summary>３Ｄオブジェクトとしてのエフェクトの最大数</summary>
var ObjectEfect_MAX = 100;
///<summary>出現する弾の最大数</summary>
var StageShot_MAX = 100;
///<summary>マップに落っこちている武器の最大数</summary>
var F_wapon_MAX = 50;
///<summary>定義する武器最大数</summary>
var wapon_MAX = 100;
///<summary>定義済み武器数</summary>
var now_Wapon_max = 35;
///<summary>敵の同時出現数</summary>
var enemy_MAX = 50;
///<summary>乱数構造体最大数</summary>
var rand_MAX =255;

///<summary>レーダーに映る敵の最大数</summary>
var rader_img_max = 50;
///<summary>レーダー描画範囲（+-の片方）</summary>
var rader_WH_max = 100;

///<summary>ログを取るキーの最大数</summary>
var Key_Log_MAX = 30;
///<summary>プレイヤーの位置・角度情報のログ数</summary>
var PlayerStruct_Log_MAX = 30;
///<summary>プレイヤーの位置・角度情報のログから「現在の」位置のインデックス指定値</summary>
var NowKey_int = (Key_Log_MAX - 1);

/// <summary>ダッシュ等のコマンド入力受け入れ時間</summary>
var Command_AcceptTime1 = 15;

///<summary>小のけぞり無敵時間</summary>
var invtime_1 = 18;
///<summary>大のけぞり無敵時間</summary>
var invtime_2 = 30;
///<summary>ダウン時の無敵時間</summary>
var invtime_3 = 45;

/// <summary>弾の射程・調整用倍率</summary>
var Master_Shot_Renge_Rate = 1.5; //1.0;
///<summary>弾のスピード・調整用倍率</summary>
var Master_Shot_Speed_Rate = 1.5; //0.1;
///<summary>弾の追尾修正角度・調整用倍率</summary>
var Master_Shot_Kaku_Rate = 0.6; //0.45f

//移動速度にかける倍率。全キャラにかかる
var Master_Move_Rate = 2.0;

//大きさ。全キャラにかける
var Master_Chara_Size = 2.0; 

///<summary>何フレーム遅延した位置をカメラが見るか</summary>
var CAM_LAZY_OF_FRAME = 5; //3;
//var CAM_LAZY_OF_FRAME = 1;

///<summary>障害物回避要の余裕を持たせるエリア 標準は100</summary>
var hit_Pos_Dist = 100;
///<summary>プレイヤ同士の当たり判定距離(球範囲)</summary>
var hit_Player_Dist = 8;
///<summary>１フレームに旋回できる最大値 攻撃時に使用</summary>
var ROL_Y_FrameToRol_Max = 0.25;
/// <summary>武器拾得時の許容範囲 </summary>
var WpnGet_Tolerance = 10.0;

/// <summary>経過フレーム格納数 </summary>
var PassedFrameSu = 3;

/// <summary>enumなどの最大値</summary>
var em_Maxval = "Maxval";

/// <summary>剣の残像用エフェクトモデルのボーン数</summary>
var LW_bone_Max = 5;

/// <summary>剣の残像用エフェクトモデルのボーンにセットする値の過去ログ値</summary>
var LW_bone_Set_Max = 20;

/// <summary>衝突判定の判定分割数  </summary>
var tgtModMax = 3;

var ZanzoLog_Max = 30;
/// <summary>上の値-1をセットする</summary>
var ZanzoLog_Max_Acsess = 29;

/// <summary>X軸に90度回転するためのMatrix</summary>
//var mx_X_90 = new THREE.Matrix4();
//mx_X_90.makeBasis(KD090, 0,0);

//        #region 画像セット関連定数

/// <summary>画像位置：戦闘時、RWの横位置</summary>
var imgSet_BT_WpnBar_RW_X = 520;
/// <summary>画像位置：戦闘時、SWの横位置</summary>
var imgSet_BT_WpnBar_SW_X = 120;

/// <summary>画像位置：戦闘時、Wpn1の縦位置</summary>
var imgSet_BT_WpnBar_Wp1_Y = 401;
/// <summary>画像位置：戦闘時、Wpn2の横位置</summary>
var imgSet_BT_WpnBar_Wp2_Y = 451;

/// <summary>画像位置：戦闘時、WpnのEnバーのMax幅</summary>
var imgSet_BT_WpnBar_W = 158;
/// <summary>画像位置：戦闘時、WpnのEnバーのMax高</summary>
var imgSet_BT_WpnBar_H = 13;


/// <summary>メッセージ枠・背景用 </summary>
//var imgGetRec_imgW = new Rectangle(0, 0, 1, 1);

/// <summary>メッセージ枠・メニューなどの1列表示用の小枠 </summary>
//var imgGetRec_msgWin_S = new Rectangle(40, 40, 220, 320);

/// <summary>メッセージ枠・メインメッセージなどの複数行表示用の大枠 </summary>
//var imgGetRec_msgWin_L = new Rectangle(65, 390, 680, 195);

/// <summary>メッセージウィンドウの共通背景色</summary>
var Img_MsgWinBG_G = 64;

//      #endregion

/// <summary>CPU位置取り用間合い値</summary>
//public static float[] CpuSampleDist = new float[(int)cEnCPUThinkID_Dist.maxval];

//       #region  ミッション結果データテーブル用列名
/// <summary>撃墜した兵器名 </summary>
var ResDT_Col_UnitName = "UnitName";
/// <summary>特殊名称（パイロット名など）</summary>
var ResDT_Col_ExtName = "ExtName";
/// <summary>単品コスト</summary>
var ResDT_Col_Point = "Point";
/// <summary>撃墜時間（フレーム）</summary>
var ResDT_Col_Frame = "Frame";
/// <summary>箇所（Vect3）</summary>
var ResDT_Col_Pos = "Pos";
/// <summary>使用武器ID </summary>
var ResDT_Col_WpID = "WpID";
//        #endregion

var air_rol_Add = 0.05;