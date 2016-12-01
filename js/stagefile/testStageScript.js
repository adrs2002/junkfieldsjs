/// <reference path="../three.modules.js"/>
/// <reference path="../oreCommon.js"/>
/// <reference path="../ScreenUpdater.js"/>

"use strict";
var testStageScript = testStageScript || {};

//ステージで使う、読み込ませる要素の指定
//ロード数コンテンツの数（oreCommon.loadContentCount)と、ロード済みカウント(oreCommon.loadContentCount)のセットを忘れないことだ
testStageScript.LoadContent = function () {

    oreCommon.loadEndCount = 0;
    oreCommon.loadContentCount = 0;
    oreCommon.cotentEndLoad = false;
    threeComps.manager.onLoad = function () {
        if (oreCommon.debugMode) { console.log("load end"); }
    };

    oreCommon.loadContentCount++;
    threeComps.loader.load(['content/ground/SkyBoll_1.x', false], function (object) {
        var loadEnd = function (_object) {
            oreCommon.skyBallObject = _object.FrameInfo[0]
            threeComps.scene_back.add(oreCommon.skyBallObject);
            oreCommon.skyBallObject.scale.setScalar(oreCommon.groundMapSize + 2000);
            oreCommon.skyBallObject.material.materials[0].visible = false;
            oreCommon.skyBallObject.material.materials[0].fog = false;
            _object = null;
            oreCommon.loadEndCount++;
        };
        setTimeout(loadEnd(object), 10);
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);


    oreCommon.loadContentCount++;
    threeComps.loader.load(['content/ground/state4.x', false], function (object) {
        var loadEnd = function (_object) {
            oreCommon.groundOBject = _object.FrameInfo[0]
            threeComps.scene.add(oreCommon.groundOBject);
            oreCommon.groundOBject.scale.multiplyScalar(oreCommon.groundMapSize);
            oreCommon.groundOBject.material.materials[0].visible = false;
            _object = null;
            oreCommon.loadEndCount++;

            /*
            var nhelper1 = new THREE.FaceNormalsHelper(oreCommon.groundOBject, 10, 0xffff00);
            threeComps.scene.add(nhelper1);
            */
        };
        setTimeout(loadEnd(object), 10);
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    oreCommon.loadContentCount++;
    threeComps.loader.load(['content/efobj/laserA.x', false], function (_object) {
        oreCommon.igeo_tama = particleComp.makeGeo_obj(_object.FrameInfo[0].geometry, threeComps.texLoader.load('content/efobj/BurretAll.jpg'), null);
        _object = null;
        oreCommon.loadEndCount++;
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);


    oreCommon.loadContentCount++;
    threeComps.loader.load(['content/wayPointObj.x', false], function (_object) {
        testStageScript.WayPointObj = _object.FrameInfo[0];
        //色を緑に替えようか
        threeComps.scene.add(testStageScript.WayPointObj);
        testStageScript.WayPointObj.material.materials[0].side = THREE.DoubleSide;
        testStageScript.WayPointObj.material.materials[0].color.r = 0.1;
        testStageScript.WayPointObj.material.materials[0].color.g = 1.0;
        testStageScript.WayPointObj.material.materials[0].color.b = 0.2;
        testStageScript.WayPointObj.material.materials[0].emissive.r = 0;
        testStageScript.WayPointObj.material.materials[0].emissive.g = 1;
        testStageScript.WayPointObj.material.materials[0].emissive.b = 0.2;

        testStageScript.WayPointObj.scale.multiplyScalar(5);
        testStageScript.WayPointObj.material.materials[0].visible = false;
        _object = null;
        oreCommon.loadEndCount++;
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    oreCommon.loadContentCount++;
    threeComps.loader.load(["content/SSR06_Born2.x", true, true], function (object) {
        var loadEnd = function (_object) {
            var ssr06_base = new Obj_SSR06();
            ssr06_base.load(_object);
            var player = new clsPlayer("Bravo 1", ssr06_base);

            player.ChangeFlame(cEnPlayer_ActStatus.J_Down, cEnPlayer_Motion.J_Down, 1);
            player.bp.using_Time[cEnStat_ParamTime.Stat_Junp_time] = 1;

            player.Pos.x = +130;
            player.bp.id = 0;
            player.bp.groupID = 1;
            /*   これができればよかった･･･
             ssr06_base = new Obj_SSR06();
             ssr06_base.load(object);
             player2 = Player_init("SSR06", ssr06_base);
             player2.Animater.beginAnimation("dash");
             */
            ScreenUpdater.players[0] = player;
            _object = null;
            oreCommon.loadEndCount++;

            //装備用武器をここでロード
            threeComps.loader.load(['content/wpn/RRF_1.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[0].SetMountWeapon(wpn.create(object.FrameInfo[0], "RRF-011S"), 0);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(['content/wpn/Rw_BltLifl_A.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[0].SetMountWeapon(wpn.create(object.FrameInfo[0], "DMG-171S"), 1);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            //装備用武器をここでロード
            threeComps.loader.load(['content/wpn/BMS_3.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 0;
                var wpn = new clsWeapon();
                ScreenUpdater.players[0].SetMountWeapon(wpn.create(object.FrameInfo[0], "BMS-003S"), 2);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            //装備用武器をここでロード
            threeComps.loader.load(['content/wpn/BBC_1.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[0].SetMountWeapon(wpn.create(object.FrameInfo[0], "BBC-001S"), 3);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            //付加されるバーニアをセットする
            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[0].SetMountBarnia(barnia_base, 0);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[0].SetMountBarnia(barnia_base, 1);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        };
        setTimeout(loadEnd(object), 10);
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    oreCommon.loadContentCount++;
    threeComps.loader.load(["content/SSR06_Born2.x", true, true], function (object) {
        var loadEnd = function (_object) {
            var ssr06_base = new Obj_SSR06();
            ssr06_base.load(_object);
            var player = new clsPlayer("Bravo 2", ssr06_base);
            player.ChangeFlame(cEnPlayer_ActStatus.J_Down, cEnPlayer_Motion.J_Down, 1);
            player.Pos.x = 0;
            player.bp.id = 1;
            player.bp.groupID = 1;
            player.bp.CpuThink.CpuParam.Cpu_BustLevel = 1;
            player.bp.AttackFact = 0.3;

            ScreenUpdater.players[1] = player;
            ScreenUpdater.players[1].ModelObject.material.materials[0].visible = false;
            _object = null;
            oreCommon.loadEndCount++;

            //装備用武器をここでロード
            //CPUに持たせる武器は、右手：近接　左手：遠距離　にしとくのがベター

            threeComps.loader.load(['content/wpn/RRF_1.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[1].SetMountWeapon(wpn.create(object.FrameInfo[0], "RRF-011S"), 0);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(['content/wpn/Rw_BltLifl_A.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[1].SetMountWeapon(wpn.create(object.FrameInfo[0], "DMG-171S"), 1);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);


            //付加されるバーニアをセットする
            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[1].SetMountBarnia(barnia_base, 0);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[1].SetMountBarnia(barnia_base, 1);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        };
        setTimeout(loadEnd(object), 10);
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    ///
    //敵用
    oreCommon.loadContentCount++;
    threeComps.loader.load(["content/SSR06_Born2.x", true, true], function (object) {
        var loadEnd = function (_object) {
            var ssr06_base = new Obj_SSR06();
            _object.FrameInfo[0].material.materials[0].visible = false;
            ssr06_base.load(_object);
            var player = new clsPlayer("SSR06", ssr06_base);
            player.ChangeFlame(cEnPlayer_ActStatus.J_Down, cEnPlayer_Motion.J_Down, 1);
            player.Pos.x = 0;
            player.bp.id = 2;
            player.bp.groupID = 11;
            player.bp.groupID_3 = 0;
            player.bp.CpuThink.CpuParam.Cpu_BustLevel = 0.5;
            player.bp.AttackFact = 0.2;

            ScreenUpdater.players[2] = player;
            ScreenUpdater.players[2].ModelObject.material.materials[0].visible = false;
            _object = null;
            oreCommon.loadEndCount++;

            //装備用武器をここでロード
            //CPUに持たせる武器は、右手：近接　左手：遠距離　にしとくのがベター            

            threeComps.loader.load(['content/wpn/Rw_Bmlf_2.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[2].SetMountWeapon(wpn.create(object.FrameInfo[0], "RRF-121B"), 0);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(['content/wpn/Rw_BltLifl_A.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[2].SetMountWeapon(wpn.create(object.FrameInfo[0], "DMG-171S"), 1);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);


            //装備用武器をここでロード
            threeComps.loader.load(['content/wpn/BMS_3.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 0;
                var wpn = new clsWeapon();
                ScreenUpdater.players[2].SetMountWeapon(wpn.create(object.FrameInfo[0], "BMS-003S"), 2);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);


            //付加されるバーニアをセットする
            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[2].SetMountBarnia(barnia_base, 0);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[2].SetMountBarnia(barnia_base, 1);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        };
        setTimeout(loadEnd(object), 10);
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    ///
    //敵用2
    oreCommon.loadContentCount++;
    threeComps.loader.load(["content/SSR06_Born2.x", true, true], function (object) {
        var loadEnd = function (_object) {
            var ssr06_base = new Obj_SSR06();
            _object.FrameInfo[0].material.materials[0].visible = false;
            ssr06_base.load(_object);
            var player = new clsPlayer("SSR06", ssr06_base);
            player.ChangeFlame(cEnPlayer_ActStatus.J_Down, cEnPlayer_Motion.J_Down, 1);
            player.Pos.x = 0;
            player.bp.id = 3;
            player.bp.groupID = 11;
            player.bp.groupID_3 = 0;
            player.bp.CpuThink.CpuParam.Cpu_BustLevel = 0.5;
            player.bp.AttackFact = 0.3;

            ScreenUpdater.players[3] = player;
            ScreenUpdater.players[3].ModelObject.material.materials[0].visible = false;
            _object = null;
            oreCommon.loadEndCount++;

            //装備用武器をここでロード
            //CPUに持たせる武器は、右手：近接　左手：遠距離　にしとくのがベター            

            threeComps.loader.load(['content/wpn/Rw_Bmlf_2.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[3].SetMountWeapon(wpn.create(object.FrameInfo[0], "RRF-121B"), 0);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(['content/wpn/Rw_BltLifl_A.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 1;
                var wpn = new clsWeapon();
                ScreenUpdater.players[3].SetMountWeapon(wpn.create(object.FrameInfo[0], "DMG-171S"), 1);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);


            //装備用武器をここでロード
            threeComps.loader.load(['content/wpn/BBC_1.x', false], function (object) {
                //object.FrameInfo[0].material.materials[0].visible = false;
                threeComps.scene.add(object.FrameInfo[0]);
                object.FrameInfo[0].material.materials[0].side = 0;
                var wpn = new clsWeapon();
                ScreenUpdater.players[3].SetMountWeapon(wpn.create(object.FrameInfo[0], "BBC-001S"), 2);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);


            //付加されるバーニアをセットする
            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[3].SetMountBarnia(barnia_base, 0);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

            threeComps.loader.load(["content/efobj/BarniaA.x", true, true], function (_barniaObj) {
                var loadEnd2 = function (_barniaObj) {
                    var barnia_base = new Obj_BarniaObj(_barniaObj);
                    ScreenUpdater.players[3].SetMountBarnia(barnia_base, 1);
                    _barniaObj = null;
                };
                setTimeout(loadEnd2(_barniaObj), 10);
            }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        };
        setTimeout(loadEnd(object), 10);
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);


}

testStageScript.LoadContent2 = function () {

    //ご丁寧にここで定義した順に読んでくれているような？

    //墜落してる輸送機
    oreCommon.loadContentCount++;
    threeComps.loader.load(["content/enemys/Carrier_B_boro.x", false], function (object) {
        testStageScript.CarrierObj = object.FrameInfo[0];
        threeComps.scene.add(testStageScript.CarrierObj);
        testStageScript.CarrierObj.material.materials[0].visible = false;
        testStageScript.CarrierObj.scale.setScalar(2);
        oreCommon.loadEndCount++;
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    ///////////////////////////////////////////
    //groupID_3 = 0; 敵トラック１ Alpha3
    oreCommon.loadContentCount++;
    threeComps.loader.load(["content/enemys/track1.x", false], function (object) {
        var loadEnd = function (_object) {

            //ココはロードが終わってから通る＝変数がどうなってるかしったこっちゃないので、全て値は手打ちで指定する

            var ene_base = new Obj_Track_1();
            _object.FrameInfo[0].material.materials[0].visible = false;
            ene_base.load(_object);
            var enemy = new clsEtcUnit("Alpha 3", ene_base);
            enemy.ChangeFlame(0, 0, 1);
            enemy.Pos.x = 0;
            enemy.bp.id = 100;
            enemy.bp.id2 = -1;
            enemy.bp.groupID = 0;
            enemy.bp.groupID_3 = 0;

            ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
            ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

            //すぴーど早いしマジ硬い            
            ScreenUpdater.etcObject[enemy.bp.id - 100].bp.meca_Stat_Const_f[cEnConsts_ParamF.life_max] = 755;
            ScreenUpdater.etcObject[enemy.bp.id - 100].bp.meca_Stat_Value_f[cEnChara_ParamFloat.life] = 755;
            ScreenUpdater.etcObject[enemy.bp.id - 100].bp.meca_Stat_Const_f[cEnConsts_ParamF.warkS_max] = 0.95;

            _object = null;
            oreCommon.loadEndCount++;
        };
        setTimeout(loadEnd(object), 10);
    }, threeComps.THREE_onProgress, threeComps.THREE_onError);
    ////////



    {
        //groupID_3 = 1; やられ役1　トラック
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/track1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_Track_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 101;
                enemy.bp.id2 = 1;
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 1;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        //やられ役2　トラック
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/track1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_Track_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 102;
                enemy.bp.id2 = 1;
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 1;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        //敵トラック4
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/track1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_Track_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 103;
                enemy.bp.id2 = 1;
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 1;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);
        ////////////
    }

    {
        //groupID_3 = 2; 敵トラックB1 敵合流小隊1
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/track1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_Track_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 104;
                enemy.bp.id2 = 0;
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 2;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        //敵トラックB2 敵合流小隊2
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/track1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_Track_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 105;
                enemy.bp.id2 = 0;
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 2;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);
    }
    //////////

    //groupID_3 = 3; 本Wave1 AAA1   
    {

        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 106;
                enemy.bp.id2 = 1;   //このid2で出現位置を管理
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 3;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                var wpn = new clsWeapon();
                ScreenUpdater.etcObject[enemy.bp.id - 100].SetMountWeapon(wpn.create(null, "AAA-GUN"), 0);

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        //groupID_3 = 3; 本Wave1 AAA1   
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 107;
                enemy.bp.id2 = 1;   //このid2で出現位置を管理
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 3;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                var wpn = new clsWeapon();
                ScreenUpdater.etcObject[enemy.bp.id - 100].SetMountWeapon(wpn.create(null, "AAA-GUN"), 0);

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    }

    {

        //groupID_3 = 4; 本Wave２左側 からAAA＆ACA   
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 108;
                enemy.bp.id2 = 0;   //このid2で出現位置を管理
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 4;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                var wpn = new clsWeapon();
                ScreenUpdater.etcObject[enemy.bp.id - 100].SetMountWeapon(wpn.create(null, "AAA-GUN"), 0);

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA2.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 109;
                enemy.bp.id2 = 0;   //このid2で出現位置を管理
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 4;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                var wpn = new clsWeapon();
                ScreenUpdater.etcObject[enemy.bp.id - 100].SetMountWeapon(wpn.create(null, "ACA-GUN"), 0);

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

    }

    {

        //groupID_3 = 5; 敵本Wave3　左右同時　　２つずつ
        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA2.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 110;
                enemy.bp.id2 = 0;   //このid2で出現位置を管理 1は向かって左 0が右
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 5;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                var wpn = new clsWeapon();
                ScreenUpdater.etcObject[enemy.bp.id - 100].SetMountWeapon(wpn.create(null, "ACA-GUN"), 0);

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 111;
                enemy.bp.id2 = 0;   //このid2で出現位置を管理 1は向かって左 0が右
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 5;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA2.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 112;
                enemy.bp.id2 = 1;   //このid2で出現位置を管理 1は向かって左 0が右
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 5;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                var wpn = new clsWeapon();
                ScreenUpdater.etcObject[enemy.bp.id - 100].SetMountWeapon(wpn.create(null, "ACA-GUN"), 0);

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);

        oreCommon.loadContentCount++;
        threeComps.loader.load(["content/enemys/Ene_AAA1.x", false], function (object) {
            var loadEnd = function (_object) {
                var ene_base = new Obj_AAA_1();
                _object.FrameInfo[0].material.materials[0].visible = false;
                ene_base.load(_object);
                var enemy = new clsEtcUnit("", ene_base);
                enemy.ChangeFlame(0, 0, 1);
                enemy.Pos.x = 0;
                enemy.bp.id = 113;
                enemy.bp.id2 = 1;   //このid2で出現位置を管理 1は向かって左 0が右
                enemy.bp.groupID = 11;
                enemy.bp.groupID_3 = 5;

                ScreenUpdater.etcObject[enemy.bp.id - 100] = enemy;
                ScreenUpdater.etcObject[enemy.bp.id - 100].ModelObject.material.materials[0].visible = false;

                var wpn = new clsWeapon();
                ScreenUpdater.etcObject[enemy.bp.id - 100].SetMountWeapon(wpn.create(null, "AAA-GUN"), 0);

                _object = null;
                oreCommon.loadEndCount++;
            };
            setTimeout(loadEnd(object), 10);
        }, threeComps.THREE_onProgress, threeComps.THREE_onError);
    }

    {

    }
    oreCommon.cotentEndLoad = true;
}


///////////////////////////////////////////////////////////////////////////////////////////

//ステージ個別の初期状態（リセット状態）をココでセットする
//ここはステージが変わらない限り、一度しか走らない！
testStageScript.stageInit_individually = function () {
    threeComps.scene.fog = new THREE.Fog(0x100020, 750, 1500);
    threeComps.scene.add(new THREE.AmbientLight(0x333344));
    //threeComps.scene_back.add(new THREE.AmbientLight(0x999999));

    var light = new THREE.DirectionalLight(0xaaeeff, 0.65);
    light.position.set(10, 100, 1).normalize();
    light.castShadow = true;
    light.shadowDarkness = 0.85;
    light.shadowCameraVisible = true;
    /*
    light.shadowCameraNear = 2;
    light.shadowCameraFar = 5;
    light.shadowCameraLeft = -0.5;
    light.shadowCameraRight = 0.5;
    light.shadowCameraTop = 0.5;
    light.shadowCameraBottom = -0.5;
    */

    threeComps.scene.add(light);
    //threeComps.scene_back.add(light);

    light = new THREE.DirectionalLight(0x220011, 0.5);
    light.position.set(-1, -1, -1).normalize();
    threeComps.scene.add(light);
    //sthreeComps.scene_back.add(light);

    /////////////////
    threeComps.params = {
        projection: 'normal',
        background: false,
        exposure: 1.0,
        /*
        bloomStrength: 0.5,
        bloomThreshold: 0.5,
        bloomRadius: 0.84*/
        bloomStrength: 0.8,
        bloomThreshold: 0.6,
        bloomRadius: 0.64
    };
    threeComps.bloomPass.threshold = threeComps.params.bloomThreshold;
    threeComps.bloomPass.strength = threeComps.params.bloomStrength;
    threeComps.bloomPass.radius = threeComps.params.bloomRadius;
    threeComps.renderer.toneMappingExposure = Math.pow(threeComps.params.exposure, 4.0);

    oreCommon.heightObject.material.materials[0].visible = false;

    try {
        var selectedObject = threeComps.scene_back.getObjectByName("brefMap");
        threeComps.scene_back.remove(selectedObject);
    } catch (ex) { }
}

///ステージ初期化（ここは再スタート毎に何回でも走る）
testStageScript.stageInit_reStart = function () {

    oreCommon.changeBGM('content/bgm_mp3/Battle.mp3');
    ScreenUpdater.stage_Initting();

    oreCommon.groundOBject.material.materials[0].visible = true;
    oreCommon.heightObject.material.materials[0].visible = false;
    oreCommon.heightObject.material.needsUpdate = true;
    oreCommon.heightObject.material.materials[0].needsUpdate = true;
    testStageScript.WayPointObj.material.materials[0].visible = true;
    oreCommon.skyBallObject.material.materials[0].visible = true;

    //進行連番リセット
    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt00;
    ScreenUpdater.scene_spanTime = 0;
    ScreenUpdater.msgView_big = 0;
    ScreenUpdater.msgView_small = 0;
    ScreenUpdater.msgView_Span = 0;
    testStageScript.alpha3DestroyFlg = false;

    ScreenUpdater.endingFlg = false;
    /////////////////

    testStageScript.WayPointObj.position.copy(testStageScript.WayPoint_V[1]);

    var keys = Object.keys(ScreenUpdater.players);
    for (var i = 0; i < keys.length; i++) {
        //武器などのパラメータを全て初期化

        ScreenUpdater.players[keys[i]].init();

        ScreenUpdater.players[keys[i]].ModelObject.material.materials[0].visible = true;
        ScreenUpdater.players[keys[i]].bp.On = true;

        ScreenUpdater.players[keys[i]].Pos.x = testStageScript.WayPoint_V[0].x + i * -20;
        ScreenUpdater.players[keys[i]].Pos.y = testStageScript.WayPoint_V[0].y;
        ScreenUpdater.players[keys[i]].Pos.z = testStageScript.WayPoint_V[0].z + i * -20;

        //WayPointを初期化
        ScreenUpdater.players[keys[i]].bp.CpuThink = new clsCpuThink();
        var wp = new strWayPointParam();
        if (i === 0) {
            wp.wayPointV.copy(testStageScript.WayPoint_V[1]);
            wp.waypointType = cEnCpuWayPointID.Navi_d;
            wp.StayTime = 0;
        }
        else if (ScreenUpdater.players[keys[i]].bp.groupID === 1) {
            wp.wayPointV.copy(testStageScript.WayPoint_V[1]);
            wp.wayPointV.x += -20; wp.wayPointV.z += -20;
            wp.waypointType = cEnCpuWayPointID.capPoint;
            wp.StayTime = 0;

            //攻撃思考パラメータセット
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_actDist = 25;   //フレーム数
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_BustLevel = 0.5;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_MoveLevel = 0.7;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_BaseDist = 300;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_AttackLevel = 0.8;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_RW_like = 0.8;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_LW_like = 0.8;

            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.AllowWayPointDist = 500 * oreCommon.groundMapSize;
        }
        else {

            //敵のSSR06
            var nowEnePoint = i % 2;
            ScreenUpdater.players[keys[i]].Pos.x = testStageScript.EnemyPoints[nowEnePoint].x;
            ScreenUpdater.players[keys[i]].Pos.y = testStageScript.EnemyPoints[nowEnePoint].y;
            ScreenUpdater.players[keys[i]].Pos.z = testStageScript.EnemyPoints[nowEnePoint].z;

            wp.wayPointV.copy(testStageScript.WayPoint_V[1]);
            wp.waypointType = cEnCpuWayPointID.capPoint;
            wp.StayTime = 0;

            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_actDist = 30;   //フレーム数
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_BustLevel = 0.3;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_BaseDist = 400;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_AttackLevel = 0.3;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_RW_like = 0.7;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_LW_like = 0.5;
            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_SW_like = 0.8;

            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.Cpu_MoveLevel = 0.3;

            ScreenUpdater.players[keys[i]].bp.setOn(false, ScreenUpdater.players[keys[i]]);

            ScreenUpdater.players[keys[i]].bp.CpuThink.CpuParam.AllowWayPointDist = 400 * oreCommon.groundMapSize;
        }

        ScreenUpdater.players[keys[i]].bp.CpuThink.addWayPoint(wp);
        ScreenUpdater.players[keys[i]].bp.Weapons = ScreenUpdater.players[keys[i]].MountWeapons;

    }

    keys = Object.keys(ScreenUpdater.etcObject);
    for (var i = 0; i < ScreenUpdater.etcObject.length; i++) {
        ScreenUpdater.etcObject[i].init();
        ScreenUpdater.etcObject[keys[i]].ModelObject.material.materials[0].visible = false;
        ScreenUpdater.etcObject[keys[i]].ModelObject.visible = false;
        ScreenUpdater.etcObject[keys[i]].bp.AttackFact = 0.1;

        ScreenUpdater.etcObject[keys[i]].bp.CpuThink = new clsCpuThink();
        if (i === 0) {
            //Alpha3
            for (var m = 0; m < testStageScript.alpha3WayPoints.length; m++) {
                ScreenUpdater.etcObject[keys[i]].bp.CpuThink.addWayPoint(testStageScript.alpha3WayPoints[m]);
            }
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.nowWayPointIndex = 1;
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.Cpu_BustLevel = 0;
        }
        else {
            //出現位置セット
            var wp = new strWayPointParam();
            wp.wayPointV.copy(testStageScript.EnemyPoints[ScreenUpdater.etcObject[keys[i]].bp.id2]);
            wp.waypointType = cEnCpuWayPointID.Navi_d;
            wp.StayTime = 1;
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.addWayPoint(wp);

            wp = new strWayPointParam();
            wp.wayPointV.copy(testStageScript.WayPoint_V[1]);
            if (ScreenUpdater.etcObject[keys[i]].MountWeapons == null || ScreenUpdater.etcObject[keys[i]].MountWeapons.length == 0) {
                wp.waypointType = cEnCpuWayPointID.Navi_d;
            }
            else {
                wp.waypointType = cEnCpuWayPointID.free;
            }
            wp.StayTime = 0;
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.addWayPoint(wp);

            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.Cpu_actDist = 100;   //フレーム数
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.nowWayPointIndex = 1;
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.Cpu_BustLevel = 0;
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.Cpu_BaseDist = 500;
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.Cpu_AttackLevel = 0.3;
            ScreenUpdater.etcObject[keys[i]].bp.CpuThink.CpuParam.Cpu_RW_like = 1.0;

            ScreenUpdater.etcObject[keys[i]].bp.Weapons = ScreenUpdater.etcObject[keys[i]].MountWeapons;
        }

    }

    testStageScript.CarrierObj.material.materials[0].visible = true;
    testStageScript.CarrierObj.position.copy(testStageScript.WayPoint_V[1]);

    var _pat = new Particle();
    _pat.setPos(testStageScript.WayPoint_V[1]);
    _pat.setSiz(30);
    _pat.setSizFactor(0);
    _pat.imageId2 = 0;
    _pat.efe_type = cEnBillbdEfeID.emitter_kokuen;
    _pat.HitOn = false;
    _pat.timeFactor_B = 0.7;
    particleComp.AddParticle(particleComp.pt_bill_Add, _pat);

    //散らす

    for (var i = 0; i < 5; i++) {
        _pat = new Particle();
        oreCommon.sceneCom_TempV3.copy(testStageScript.WayPoint_V[1]);

        oreCommon.sceneCom_TempV3.x += (Math.random() - 0.5) * 50;
        oreCommon.sceneCom_TempV3.z += (Math.random() - 0.5) * 100 + 100;

        _pat.setPos(oreCommon.sceneCom_TempV3);
        _pat.setSiz(20);
        _pat.setSizFactor(0);
        _pat.imageId2 = 0;
        _pat.efe_type = cEnBillbdEfeID.emitter_kokuen;
        _pat.HitOn = false;
        _pat.TimeB = i;
        _pat.timeFactor_B = 0.7;
        particleComp.AddParticle(particleComp.pt_bill_Add, _pat);
    }

    ScreenUpdater.DisplayInfoText = "YOU HAVE CONTROLE";
    ScreenUpdater.DisplayInfoType = cEnConsts_DisplayInfoType.EmInfo_w;
    ScreenUpdater.DisplayInfoTime = 240;

    if (oreCommon.debugMode) {
        //ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt01;
    }

    oreCommon.isMapMoveLimit = false;
}

///////////


//Bravo 2を1のやや後方に来るようにする
testStageScript.setPlayer2WP = function () {

    if (ScreenUpdater.nowSceneID < testStageScript.enumSceneSpan.Bt02) {
        //プレイヤーについていきながら、付近の敵を排除
        oreCommon.tempQ_Y.set(0, 0, 0, 1);
        oreCommon.tempQ_Y.setFromAxisAngle(oreMath.rotateAxisY, ScreenUpdater.players[0].bp.Rol_MstY);
        oreCommon.sceneCom_TempV3.set(15, 0, 15);
        oreCommon.sceneCom_TempV3.applyQuaternion(oreCommon.tempQ_Y);
        oreCommon.sceneCom_TempV3.add(ScreenUpdater.players[0].Pos);

        ScreenUpdater.players[1].bp.CpuThink.reWriteWayPoint(0, oreCommon.sceneCom_TempV3, cEnCpuWayPointID.capPoint);
    } else {
        //WP付近の敵を排除
        oreCommon.sceneCom_TempV3.copy(testStageScript.WayPoint_V[1]);
        ScreenUpdater.players[1].bp.CpuThink.reWriteWayPoint(0, oreCommon.sceneCom_TempV3, cEnCpuWayPointID.capPoint);
    }

}

function getStageTargetCam() {
    if (oreCommon.debugKeyInt === 1) {
        threeComps.camera.position.add(ScreenUpdater.players[1].Pos);
        oreCommon.sceneCom_TempV3.add(ScreenUpdater.players[1].Pos);
    }
    else {
        if (ScreenUpdater.etcObject[oreCommon.debugKeyInt - 2] != null) {
            threeComps.camera.position.add(ScreenUpdater.etcObject[oreCommon.debugKeyInt - 2].Pos);
            oreCommon.sceneCom_TempV3.add(ScreenUpdater.etcObject[oreCommon.debugKeyInt - 2].Pos);
        }
    }

}

//ステージ個別で発生させるイベント
function stageUpdater() {

    var tmpCount = 0;
    ScreenUpdater.msgView_Span += oreCommon.dulTime;
    switch (ScreenUpdater.nowSceneID) {

        case testStageScript.enumSceneSpan.Bt00:
            testStageScript.setPlayer2WP();
            oreBt2DSceneCom.getMissionInfoText("Bt00");
            if (ScreenUpdater.msgView_big <= 3) {
                ScreenUpdater.msgViewKey = "Bt00_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();

                if (ScreenUpdater.msgView_small == 0 && ScreenUpdater.msgView_Span == 0 && !oreCommon.isGameCleared) {
                    if (ScreenUpdater.msgView_big == 1) {
                        ShowDialog('tu_move');
                    } else if (ScreenUpdater.msgView_big == 4) {
                        ShowDialog('tu_boost');
                    }
                }
            }
            else {
                //WPとの距離を計測し、近かったら次シーンへ
                oreCommon.sceneCom_TempV3.copy(ScreenUpdater.players[0].bp.CpuThink.CpuParam.WayPoints[0].wayPointV);
                oreCommon.sceneCom_TempV3.sub(ScreenUpdater.players[0].Pos);

                if (oreCommon.sceneCom_TempV3.length() < 100) {
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt01;
                    
                    ScreenUpdater.initScreenMsg();
                    ScreenUpdater.DisplayInfoText = "PASSING WP 4";
                    ScreenUpdater.DisplayInfoType = cEnConsts_DisplayInfoType.EmInfo_w;
                    ScreenUpdater.DisplayInfoTime = 240;

                    oreCommon.isMapMoveLimit = true;
                }
            }

            break;

        case testStageScript.enumSceneSpan.Bt01:
            testStageScript.setPlayer2WP();
            oreBt2DSceneCom.getMissionInfoText("Bt01");
            if (ScreenUpdater.msgView_big <= 6) {
                ScreenUpdater.msgViewKey = "Bt01_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }
            else {
                //W時間経過のみで次シーンへ
                if (ScreenUpdater.msgView_Span > 5000) {
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt02;
                    ScreenUpdater.initScreenMsg();

                    //敵出現
                    ScreenUpdater.setBeginEnemy(1);
                    ScreenUpdater.DisplayInfoText = "MISSION UPDATE";
                    ScreenUpdater.DisplayInfoType = cEnConsts_DisplayInfoType.EmInfo_w2;
                    ScreenUpdater.DisplayInfoTime = 180;
                    testStageScript.setPlayer2WP();
                }
            }

            break;

        case testStageScript.enumSceneSpan.Bt02:
            oreBt2DSceneCom.getMissionInfoText("Bt02");
            if (ScreenUpdater.msgView_big < 100) {
                if (ScreenUpdater.msgView_big <= 5) {
                    ScreenUpdater.msgViewKey = "Bt02_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                    ScreenUpdater.ViewAndPlayCV_Stage();
                }
                else {
                    //出現中の全敵撃破で次シーン
                    if (ScreenUpdater.getArriveCount(ScreenUpdater.etcObject) === 0) {
                        ScreenUpdater.msgView_big = 100;
                        ScreenUpdater.msgViewKey = "Bt02_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                        ScreenUpdater.ViewAndPlayCV_Stage();
                        //敵出現
                        ScreenUpdater.setBeginEnemy(2);
                    }
                }
            } else {
                if (ScreenUpdater.msgView_big <= 103) {
                    ScreenUpdater.msgViewKey = "Bt02_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                    ScreenUpdater.ViewAndPlayCV_Stage();
                }
                else {
                    //出現中の全敵撃破で次シーン
                    if (ScreenUpdater.getArriveCount(ScreenUpdater.etcObject) === 0) {
                        ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt03;
                        ScreenUpdater.initScreenMsg();
                        //敵出現
                        ScreenUpdater.setBeginEnemy(3);
                    }
                }
            }


            break;

        case testStageScript.enumSceneSpan.Bt03:
            oreBt2DSceneCom.getMissionInfoText("Bt03");
            if (ScreenUpdater.msgView_big <= 6) {
                ScreenUpdater.msgViewKey = "Bt03_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }
            else {
                //出現中の全敵撃破で次シーン
                if (ScreenUpdater.getArriveCount(ScreenUpdater.etcObject) === 0) {
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt04;
                    ScreenUpdater.initScreenMsg();

                    ScreenUpdater.setBeginEnemy(4);

                }
            }

            break;

        case testStageScript.enumSceneSpan.Bt04:
            oreBt2DSceneCom.getMissionInfoText("Bt04");
            if (ScreenUpdater.msgView_big <= 16 && !oreCommon.debugMode) {
                ScreenUpdater.msgViewKey = "Bt04_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }
            else {
                //W時間経過のみで次シーンへ
                if (ScreenUpdater.msgView_Span > 5000) {
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt05;
                    ScreenUpdater.initScreenMsg();

                    ScreenUpdater.setBeginEnemy(5);
                    ScreenUpdater.setBeginEnemy(0);   //アルファ３
                    oreCommon.changeBGM('content/bgm_mp3/Obstacle.mp3');
                    ScreenUpdater.players[1].bp.CpuThink.CpuParam.AllowWayPointDist = 200;
                }
            }

            //敵がいなくなってたら、補充？
            if (ScreenUpdater.getArriveCount(ScreenUpdater.etcObject) === 0) {
                ScreenUpdater.setBeginEnemy(5);
            }

            break;

        case testStageScript.enumSceneSpan.Bt05:
            oreBt2DSceneCom.getMissionInfoText("Bt05");
            if (ScreenUpdater.msgView_big <= 7) {
                ScreenUpdater.msgViewKey = "Bt05_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }

            {
                //アルファ３（敵ID=100）の状況でのみ次に遷移
                if (ScreenUpdater.etcObject[0].bp.meca_Stat_Value_f[cEnChara_ParamFloat.life] <= 0) {
                    //撃破成功
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt06B;
                    testStageScript.alpha3DestroyFlg = true;
                    ScreenUpdater.initScreenMsg();
                } else {
                    //離脱判定
                    oreCommon.sceneCom_TempV3.copy(testStageScript.alpha3WayPoints[testStageScript.alpha3WayPoints.length - 1].wayPointV);
                    oreCommon.sceneCom_TempV3.sub(ScreenUpdater.etcObject[0].Pos);
                    if (oreCommon.sceneCom_TempV3.length() < 100) {
                        ScreenUpdater.etcObject[0].ModelObject.material.materials[0].visible = false;
                        ScreenUpdater.etcObject[0].ModelObject.visible = false;
                        ScreenUpdater.etcObject[0].bp.On = false;
                        ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt06A;
                        testStageScript.alpha3DestroyFlg = false;
                        ScreenUpdater.initScreenMsg();
                    }
                }
            }

            break;

        case testStageScript.enumSceneSpan.Bt06A:
        case testStageScript.enumSceneSpan.Bt06B:
            if (ScreenUpdater.msgView_big <= 4) {
                if (testStageScript.alpha3DestroyFlg) {
                    ScreenUpdater.msgViewKey = "Bt06B_";
                } else {
                    ScreenUpdater.msgViewKey = "Bt06A_";
                }
                ScreenUpdater.msgViewKey = ScreenUpdater.msgViewKey + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }
            else {
                //敵全滅で次シーンへ
                if (ScreenUpdater.getArriveCount(ScreenUpdater.etcObject) === 0) {
                    //更に増援
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.m_EnemyWave2;
                    ScreenUpdater.initScreenMsg();
                    ScreenUpdater.players[1].bp.CpuThink.CpuParam.AllowWayPointDist = 500;

                    ScreenUpdater.players[2].ModelObject.visible = true;
                    ScreenUpdater.players[2].bp.On = true;
                    ScreenUpdater.players[2].bp.setOn(true, ScreenUpdater.players[2]);

                    if (testStageScript.alpha3DestroyFlg) {
                        ScreenUpdater.players[3].ModelObject.visible = true;
                        ScreenUpdater.players[3].bp.On = true;
                        ScreenUpdater.players[3].bp.setOn(true, ScreenUpdater.players[3]);
                    }
                }
            }
            break;

        case testStageScript.enumSceneSpan.m_EnemyWave2:
            //敵全滅で次シーンへ
            if (ScreenUpdater.getArriveCount(ScreenUpdater.etcObject) === 0 && ScreenUpdater.getArriveCount(ScreenUpdater.players) === 0) {
                //更に増援
                ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.m_EnemyWave3;
                ScreenUpdater.initScreenMsg();
            }
            break;

        case testStageScript.enumSceneSpan.m_EnemyWave3:
            //敵全滅で次シーンへ
            if (ScreenUpdater.getArriveCount(ScreenUpdater.etcObject) === 0 && ScreenUpdater.getArriveCount(ScreenUpdater.players) === 0) {
                //エンディング
                ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt07;
                ScreenUpdater.initScreenMsg();
                oreCommon.isGameCleared = true;
                ScreenUpdater.NextSceneID = testStageScript.enumSceneSpan.Bt99;
                setVisible_elm('messageSkip', true);
            }
            break;


        case testStageScript.enumSceneSpan.Bt07:
            if (ScreenUpdater.msgView_big <= 5) {
                ScreenUpdater.msgViewKey = "Bt07_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }
            else {
                //Alpha3撃破状況で分岐
                if (testStageScript.alpha3DestroyFlg) {
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt07B;
                    ScreenUpdater.initScreenMsg();
                    ScreenUpdater.msgView_big = 6;
                } else {
                    ScreenUpdater.nowSceneID = testStageScript.enumSceneSpan.Bt07A;
                    ScreenUpdater.initScreenMsg();
                    ScreenUpdater.msgView_big = 6;
                }
            }
            break;


        case testStageScript.enumSceneSpan.Bt07A:

            if (ScreenUpdater.msgView_big <= 7) {
                ScreenUpdater.msgViewKey = "Bt07A_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }
            else {
                //終了！
                ScreenUpdater.viewEndingScreen();
            }
            break;

        case testStageScript.enumSceneSpan.Bt07B:
            if (ScreenUpdater.msgView_big <= 12) {
                ScreenUpdater.msgViewKey = "Bt07B_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
                ScreenUpdater.ViewAndPlayCV_Stage();
            }
            else {
                //終了！
                ScreenUpdater.viewEndingScreen();
            }
            break;

        //終了テスト
        case testStageScript.enumSceneSpan.Bt99:
            //ScreenUpdater.msgViewKey = "Bt99_" + ('00' + ScreenUpdater.msgView_big).slice(-3);
            // ScreenUpdater.ViewAndPlayCV_Stage();
            break;
        //////////////

    }

}

function stageRender_2D() {

    if (ScreenUpdater.nowSceneID === testStageScript.enumSceneSpan.Bt00 && ScreenUpdater.scene_spanTime < 2000) {
        ScreenUpdater.drawFadeIn();
    }
    ScreenUpdater.viewStagegMessage();

}