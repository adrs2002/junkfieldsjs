

/// <summary>武器種別</summary>
cEnWpnType
    = {
        RW_1: 0,
        LW_1: 1,
        SW_1: 2,
        RW_2_RF: 3,
        RW_2_MG: 4,
        //RW_2_LC,
        RW_2_BZ: 5,
        LW_2_RF: 6,
        LW_2_MG: 7,
        LW_2_LC: 8,
        LW_2_BZ: 9,
        ////
        SW_2_N: 10,
        SW_2_LGT: 11,
        SW_2_GG_DL: 12,
        SW_2_DL: 13,


        Null: 12,
    }

/// <summary>リンクの配列ＩＤ</summary>
cEnLinkID
    = {
        playerID: 0,
        mountID: 1,
        useWpnID: 2,
        BulletPosID: 3,
    }

/// <summary>装備箇所ID</summary>
cEnWpnMontID
    = {
        R_Hand: 0,
        L_Hand: 1,
        R_Sholder_1: 2,
        L_Sholder_1: 3,
        R_Sholder_2: 4,
        L_Sholder_2: 5,

        val_Max: 6,
    }


/// <summary>使用中及び使用不可能時間ID</summary>
cEnStat_ParamTime
    = {
        /// <summary>使用中及び使用不可能時間ID・ショット</summary>
        Stat_Shot_time: 0,
        /// <summary>使用中及び使用不可能時間ID・格闘</summary>
        Stat_Kaku_time: 1,
        /// <summary>使用中及び使用不可能時間ID・サブ攻撃</summary>
        Stat_SubS_time: 2,
        /// <summary>使用中及び使用不可能時間ID・バーストショット</summary>
        Stat_BstShot_time: 3,
        /// <summary>使用中及び使用不可能時間ID・バースト格闘</summary>
        Stat_BstKaku_Time: 4,
        /// <summary>使用中及び使用不可能時間ID・Expアタック</summary>
        Stat_ExAt_time: 5,
        /// <summary>使用中及び使用不可能時間ID・移動</summary>
        Stat_move_time: 6,
        /// <summary>使用中及び使用不可能時間ID・ダッシュ</summary>
        Stat_dash_time: 7,
        /// <summary>使用中及び使用不可能時間ID・ジャンプ</summary>
        Stat_Junp_time: 8,
        /// <summary>使用中及び使用不可能時間ID・ステップ</summary>
        Stat_Step_time: 9,
        /// <summary>使用中及び使用不可能時間ID・ゲイン使用</summary>
        Stat_use_gain_time: 10,
        /// <summary>同一アニメーション維持数 </summary>
        motion_time: 11,


        val_Max: 12,
    }

/// <summary>
/// 能力値構造体引数ID関連
/// </summary>
cEnConsts_ParamF
    = {
        /// <summary>歩行速度上昇値</summary>
        warkS_up: 0,
        /// <summary>歩行速度最大値</summary>
        warkS_max: 1,
        /// <summary>ダッシュ速度上昇値</summary>
        dashS_up: 2,
        /// <summary>ダッシュ速度最大値</summary>
        dashS_max: 3,
        /// <summary>地上からの機体の中心・高さ</summary>
        body_height: 4,
        /// <summary>機体の回転速度・立ち</summary>
        rool_S_stand: 5,
        /// <summary>期待の回転速度・ダッシュ</summary>
        rool_S_dash: 6,
        /// <summary>ジャンプの上昇速度</summary>
        junpS_up: 7,
        /// <summary>ジャンプ上昇速度最大値</summary>
        junpS_max: 8,
        /// <summary>ジャンプ上昇速度最大値（ナナメ）</summary>
        junpS_max2: 9,
        /// <summary>ジャンプ開始時硬直</summary>
        junp_Kotyoku: 10,
        /// <summary>空中ダッシュの速度上昇値</summary>
        junpD_up: 11,
        /// <summary>空中ダッシュの速度最大値</summary>
        junpD_max: 12,
        /// <summary>空中での左右移動倍率</summary>
        junpMoveFact: 13,

        /// <summary>ステップの速度上昇値</summary>
        StepS_up: 14,
        /// <summary>ステップの速度最大値</summary>
        StepS_max: 15,

        /// <summary>ステップの最低時間</summary>
        StepT_short: 16,
        /// <summary>ステップの最大時間</summary>
        StepT_max: 17,
        /// <summary>ステップの終了中のスキ時間</summary>
        StepT_End: 18,

        /// <summary>HP最大値</summary>
        life_max: 19,
        /// <summary>ゲイン最大値</summary>
        gein_max: 20,
        /// <summary>ダッシュ時のゲイン使用値</summary>
        Guse_dash: 21,
        /// <summary>ダッシュ【開始時】のゲイン使用値</summary>
        Guse_dashFast: 22,
        /// <summary>ジャンプ時のゲイン使用値</summary>
        Guse_junp: 23,
        /// <summary>ジャンプ【開始時】のゲイン使用値</summary>
        Guse_junpfast: 24,
        /// <summary>ステップ時のゲイン使用値</summary>
        Guse_Step: 25,
        /// <summary>ステップ【開始時】のゲイン使用値</summary>
        Guse_Stepfast: 26,

        /// <summary>通常時のゲイン回復値</summary>
        gein_regeinS: 27,
        /// <summary>武器装備時のゲイン占有倍率 </summary>
        gein_wpnFact: 28,
        /// <summary>摩擦係数のようなもの：立ちからの加速の遅さ １を超えてはいけない</summary>
        Stand_Brake: 29,
        /// <summary>ダッシュ後のブレーキ性能 １を超えてはいけない</summary>
        ext_brake: 30,
        /// <summary>ダッシュ開始時の硬直フレーム時間 </summary>
        Dash_KotyokuTime: 31,
        /// <summary>ダッシュ初期時のブースト時間 </summary>
        Dash_FastBoostTime: 32,
        /// <summary>ダッシュ開始時の所期ブースト加速度 </summary>
        Dash_FastBoost: 33,
        /// <summary>Rw攻撃時、強制振り向き角度　右 </summary>
        Rw_RolLock_R: 34,
        /// <summary>Rw攻撃時、強制振り向き角度　左 </summary>
        Rw_RolLock_L: 35,

        /// <summary>被ダメ⇒よろけまでの値 </summary>
        Dmg_Tolerance: 36,
        /// <summary>被ダメ⇒ダウンまでの値 </summary>
        Don_Tolerance: 37,

        /// <summary>ＬＷで付加されるセービングフレーム数</summary>
        SevTime: 38,
        /// <summary>ＬＷで付加される、ダウン耐久乗算値（少ないほうがセビ中にダウンしなくなる）</summary>
        Sev_Power: 39,
        /// <summary>壁にさえぎられた半ロック常態から、完全にロックが切れるまでの時間</summary>
        savHalfLockTime: 40,
        /// <summary>ロックオン可能距離</summary>
        LockRange: 41,

        /// <summary>気力</summary>
        //Kiryoku,
        /// <summary>プラーナ</summary>
        //MaxPlana,

        val_Max: 42,

    }

/// <summary>
/// ゲーム中のキャラのパラメーター（変動値）
/// </summary>
cEnChara_ParamFloat
    = {
        /// <summary>現在のHP</summary>
        life: 0,
        /// <summary>現在の歩行速度</summary>
        warkS_n: 1,
        /// <summary>値現在のダッシュ速度</summary>
        dashS_n: 2,
        /// <summary>現在のジャンプ速度</summary>
        junpS_n: 3,
        /// <summary>現在の空中ダッシュ速度</summary>
        junpD_n: 4,
        /// <summary>？</summary>
        junpS_up_Fast: 5,
        /// <summary>ダウン無敵時間の値</summary>
        down_life: 6,
        /// <summary>無敵時間の現在の値</summary>
        down_life_now: 7,
        /// <summary>ゲイン残量</summary>
        gein_n: 8,
        /// <summary>マウントによるゲイン使用量　Constの場合はかかる倍率</summary>
        Guse_mountuse: 9,
        /// <summary>発射する弾にかかる速度関数</summary>
        shot_Spd_F: 10,
        /// <summary>現在のロックオン目標までの角度(Y)</summary>
        TGT_Dist_Kaku: 11,
        /// <summary>ダッシュ開始時の機体角度(Y)</summary>
        Dash_Start_Kaku: 12,
        /// <summary>ボーン変形のブレンドファクター</summary>
        blendFactor: 13,
        /// <summary>上半身用のブレンドファクタ－</summary>
        blendFactor_up: 14,
        /// <summary>blendFactorへのフレーム加算係数。</summary>
        FactorAdd: 15,

        /// <summary>ダウン値。</summary>
        DwnFactor: 16,

        // Plana,

        ///Kiryoku,
        /// <summary>現在のロックオン目標までの角度(Y):ひとつ前</summary>
        TGT_Dist_Kaku_Last: 17,
        /// <summary>現在のロックオン目標までの距離  ひとつ前</summary>
        TGT_Dist_Last: 18,

        val_Max: 19,

    }

/// <summary>
/// 出現中のタマのパラメータ
/// </summary>
cEnShot_Param
    = {
        /// <summary>その玉を誰が出したかのID</summary>
        Shot_by: 0,
        shot_type: 1,
        shot_ID: 2,
        shot_lock_ID: 3,
        shot_out: 4,
        shot_reng: 5,
        /// <summary>5ﾌﾚｰﾑ間保持用ロールベクターX</summary>
        shot_rol_X_nexting: 6,
        /// <summary>5ﾌﾚｰﾑ間保持用ロールベクターZ</summary>
        shot_rol_Z_nexting: 7,
        shot_speed: 8,
        shot_speed_Base: 9,

        val_Max: 10,
    }

/// <summary>
/// 格闘のコンビネーションパターン
/// </summary>
cEnLw1ComboSet
    = {
        Lw1Base: 0,
        LL: 1,
        LLL: 2,
        LR: 3,
        LS: 4,
        LLR: 5,
        LLS: 6,
        LLLL: 7,
    }

/// <summary>
/// プレイヤーモーション管理。
/// </summary>
cEnPlayer_Motion
    = {
        stand: 0,
        init: 1,
        walk: 2,
        walk_R: 2.1,
        walk_L: 2.2,
        back: 3,
        dash_F: 4,
        /// <summary>空中ダッシュ</summary>
        //dash_S : 4,
        tach_Down: 5,
        Junp: 6,
        J_Down: 7,
        Step_F: 8,
        Step_R: 9,
        Step_L: 10,
        Step_B: 11,

        dmg: 12,
        down_1: 13,
        down_1_2: 14,
        down_2: 15,
        down_Rise: 16,

        /// <summary>モーション指定時の中継のみに使用</summary>
        RW_2_Base: 17,

        RW_2_RF_N: 18,
        RW_2_RF_2_N: 19,
        RW_2_RF_Shot_N: 20,
        RW_2_RF_End_N: 21,

        RW_2_MG_N: 22,
        RW_2_MG_2_N: 23,
        RW_2_MG_Shot_N: 24,
        RW_2_MG_End_N: 25,

        RW_2_BZ: 26,
        RW_2_BZ_2: 27,
        RW_2_BZ_Shot: 28,
        RW_2_BZ_End: 29,

        /// <summary>左手１段目</summary>
        LW_2_RF_N: 30,
        LW_2_RF_2: 31,
        LW_2_RF_Shot: 32,
        LW_2_RF_End: 33,
        /// <summary>L→L　とつないだ時の２段目</summary>
        LW_2_MG_N: 34,
        LW_2_MG_2: 35,
        LW_2_MG_Shot: 36,
        LW_2_MG_End: 37,
        /// <summary>L→R　とつないだ時の２段目</summary>
        LW_2_BZ: 38,
        LW_2_BZ_2: 39,
        LW_2_BZ_Shot: 40,
        LW_2_BZ_End: 41,

        //SW///////////////////////////////////
        SW_1: 42,
        SW_1_2: 43,
        SW_1_Shot: 44,
        SW_1_End: 45,

        SW_R: 46,
        SW_R_2: 47,
        SW_R_Shot: 48,
        SW_R_End: 49,

        SW_R_LGT: 50,
        SW_R_LGT_2: 51,
        SW_R_LGT_Shot: 52,
        SW_R_LGT_End: 53,

        SW_L: 54,
        SW_L_2: 55,
        SW_L_Shot: 56,
        SW_L_End: 57,

        SW_L_LGT: 58,
        SW_L_LGT_2: 59,
        SW_L_LGT_Shot: 60,
        SW_L_LGT_End: 61,

        SW_2_GG_DL: 62,
        SW_2_GG_DL_2: 63,
        SW_2_GG_DL_Shot: 64,
        SW_2_GG_DL_End: 65,

        SW_2_DL: 66,
        SW_2_DL_2: 67,
        SW_2_DL_Shot: 68,
        SW_2_DL_End: 69,

        down_dead: 70,

        maxval: 71,

    }

//武器使用モーション
cEnWeaponMotionID =
    {
        /// <summary>モーション指定時の中継のみに使用</summary>
        RW_2_Base: 0,

        RW_2_RF_N: 1,
        RW_2_RF_N_S: 2,
        RW_2_RF_2_N: 3,
        RW_2_RF_Shot_N: 4,
        RW_2_RF_End_N: 5,

        RW_2_RF_R: 6,
        RW_2_RF_R_S: 7,
        RW_2_RF_2_R: 8,
        RW_2_RF_Shot_R: 9,
        RW_2_RF_End_R: 10,

        RW_2_RF_L: 11,
        RW_2_RF_L_S: 12,
        RW_2_RF_2_L: 13,
        RW_2_RF_Shot_L: 14,
        RW_2_RF_End_L: 15,

        RW_2_MG_N: 16,
        RW_2_MG_N_S: 17,
        RW_2_MG_2_N: 18,
        RW_2_MG_Shot_N: 19,
        RW_2_MG_End_N: 20,

        RW_2_MG_R: 21,
        RW_2_MG_R_S: 22,
        RW_2_MG_2_R: 23,
        RW_2_MG_Shot_R: 24,
        RW_2_MG_End_R: 25,


        RW_2_MG_L: 26,
        RW_2_MG_L_S: 27,
        RW_2_MG_2_L: 28,
        RW_2_MG_Shot_L: 29,
        RW_2_MG_End_L: 30,


        RW_2_BZ: 31,
        RW_2_BZ_S: 32,
        RW_2_BZ_2: 33,
        RW_2_BZ_Shot: 34,
        RW_2_BZ_End: 35,

        ////////////////////////////
        LW_1: 36,
        LW_1_2: 37,
        LW_1_AT: 38,
        LW_1_End: 39,

        /////////////////////
        SW_R: 40,
        SW_R_S: 41,
        SW_R_2: 42,
        SW_R_Shot: 43,
        SW_R_End: 44,

        SW_R_LGT: 45,
        SW_R_LGT_S: 46,
        SW_R_LGT_2: 47,
        SW_R_LGT_Shot: 48,
        SW_R_LGT_End: 49,

        SW_L: 50,
        SW_L_S: 51,
        SW_L_2: 52,
        SW_L_Shot: 53,
        SW_L_End: 54,

        SW_L_LGT: 55,
        SW_L_LGT_S: 56,
        SW_L_LGT_2: 57,
        SW_L_LGT_Shot: 58,
        SW_L_LGT_End: 59,

        SW_2_GG_DL: 60,
        SW_2_GG_DL_S: 61,
        SW_2_GG_DL_2: 62,
        SW_2_GG_DL_Shot: 63,
        SW_2_GG_DL_End: 64,

        SW_2_DL: 65,
        SW_2_DL_S: 66,
        SW_2_DL_2: 67,
        SW_2_DL_Shot: 68,
        SW_2_DL_End: 69,

    }

/// <summary>
/// プレイヤーのモーションステータス（大分類）
/// </summary>
cEnPlayer_ActStatus
    = {
        /// <summary>立ち</summary>
        stand: 0,
        /// <summary>歩き</summary>
        walk: 1,
        /// <summary>地上ダッシュ</summary>
        dash: 2,
        /// <summary>空中ダッシュ</summary>
        dash_J: 3,
        /// <summary>ステップ</summary>
        step: 4,
        /// <summary>ジャンプ </summary>
        Junp: 5,
        /// <summary>下降</summary>
        J_Down: 6,
        /// <summary>着地</summary>
        tach_Down: 7,

        /// <summary>よろけ</summary>
        dmg1: 8,
        /// <summary>ダウン開始</summary>
        down_1: 9,
        /// <summary>ダウン中</summary>
        down_2: 10,
        /// <summary>起き上がり</summary>
        downRise: 11,

        /// <summary>起き上がり</summary>
        dead: 12,


        val_Max: 13,

    }

/// <summary>
/// CPU専用的のモーション
/// </summary>
cEnEnemy_Motion
    = {
        stand: 0,
        Move_F: 1,
        Move_R: 2,
        Move_L: 3,
        Move_B: 4,

        W_1: 5,
        W_1_2: 6,
        W_1_Shot: 7,
        W_1_End: 8,

        W_2: 9,
        W_2_2: 10,
        W_2_Shot: 11,
        W_2_End: 12,

        dead_1: 13,

        maxval: 14,

    }


barniaUsingFlg
    = {
        init: 0,
        UseStart: 1,
        UseEnd: 2,

    }


/// <summary>
/// ダッシュ状況
/// </summary>
lEnDashMode =
    {
        noDash: 0,
        FirstRoling: 1,
        DashFirstKasoku: 2,
        normalDash: 3,
        Dash_ending: 4,

    }

//HUD上1行情報欄への表示種別
cEnConsts_DisplayInfoType
    = {
        none: 0,    //表示なし
        EnemyHit: 11,   //敵に命中

        EmInfo_w: 21,  //ステージ文字表示：Lv0

        //////////////////////
        infCol_yel: 50,
        EnemyDestroy: 51,   //敵を撃破

        PlayerDmg: 61, //プレイヤー被弾

        EmInfo_w2: 71,  //ステージ文字表示：Lv1

        //////////////////////
        infCol_Y_W: 100,      //黄背景に白字
        PlayerDmg2: 101, //プレイヤー被弾 yaba

        //////////////////////
        infCol_Red: 200,    //黄背景に赤字
        PlayerDestroy: 201, //プレイヤー破壊

        EmInfo_r: 211, //ステージ文字表示：Lv2

        ///////////////////
        infCol_b: 800,
        EmInfo_b: 801,  //クリア表示専用：青背景に白地
    }