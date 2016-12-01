/**
 * @author Jey-en 
 * 改変自由：てきとーにやっちゃって
 */

//計測用オブジェクト
var JfTimeRulerObject = function (_name,_col) {

    this.Name = _name;
    this.Color = _col;
    this.beginTime = Date.now();
    this.spanTime = 0;
};
JfTimeRulerObject.prototype = {

    constructor: JfTimeRulerObject,
    stop: function () {
        var self = this;
        self.spanTime = Date.now() - self.beginTime;
    }
};


//モジュールクラス本体
var JfTimeRuler = function (_x, _y) {

    var setPos = [0, 60];
    if (_x != undefined && _y != undefined) {
        setPos = [_x, _y];
    }
    if (_x != undefined && _y != undefined) {
        setPos = [_x, _y];
    }

    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:300px; height:0px; opacity:0.9;z-index:2000';

    //初期位置を決める。デフォルトはThree.jsのStatsにかぶらないようにしている。
    container.style.left = setPos[0] + "px";
    container.style.top = setPos[1] + "px";

    var canvas = document.createElement('canvas');
    container.appendChild(canvas);
    var conteText2D = canvas.getContext("2d");

 
    ///////////////////////////////

    var targetFrameTime = 1000 / 60;   

    var timers = [];
    var timersCount = 0;
    var nowCuclTarget = "";
    var nowBeginTime = null;

    return {
        dom: container,
        pos: setPos,
        timers: timers,
        timersCount: timersCount,
        nowCuclTarget: nowCuclTarget,
        nowBeginTime: nowBeginTime,
        targetFrameTime: targetFrameTime,

        conteText2D: conteText2D,
        canvas:canvas,

        ///目標とするフレームレートの変更
        setTargetFrameRate: function (_f) {
            var self = this;
            self.targetFrameTime = 1000 / _f;
        },

        //現在の計測対象を止める。
        currentStop: function () {
            var self = this;
            if (self.nowCuclTarget != "") {
                self.timers[self.nowCuclTarget].stop();
                self.nowCuclTarget = "";
            }
        },

        //計測結果を描画
        update: function () {
            var self = this;
            self.currentStop();

            self.conteText2D.clearRect(0, 0, self.conteText2D.canvas.width, self.conteText2D.canvas.height);
            self.conteText2D.fillStyle = "rgba(0, 0, 0, 0.5)";
            self.conteText2D.fillRect(0, 0, self.conteText2D.canvas.width, self.conteText2D.canvas.height);
            self.conteText2D.textAlign = 'left';
            self.conteText2D.font = "10pt Arial";

            var totalTime = 0;
            var keys = Object.keys(self.timers);

            //時間かかったよバーの描画
            for (var i = 0; i < keys.length; i++) {
                var startPos = 0;
                if (totalTime > 0) {
                    startPos = totalTime / self.targetFrameTime;
                }
                startPos = startPos * self.conteText2D.canvas.width;
                var nowWidth = self.timers[keys[i]].spanTime / self.targetFrameTime;
                nowWidth = nowWidth * self.conteText2D.canvas.width;

                self.conteText2D.fillStyle = self.timers[keys[i]].Color;
                self.conteText2D.fillRect(startPos, 11, nowWidth, 10);

                totalTime += self.timers[keys[i]].spanTime;

                self.conteText2D.fillText(keys[i] + ':' + self.timers[keys[i]].spanTime, 5, 35 + i * 25);
                self.conteText2D.fillRect(0, 35 + i * 25 + 1, nowWidth, 10);
            }

            //トータル情報（一番上の文字）の描画
            self.conteText2D.fillStyle = 'rgb(255,255,255)';
            self.conteText2D.fillText('totalTime:' + totalTime, 5, 10);

            //目標フレーム地点に印を付ける。コレを超えていなければ万歳だね
            var line = self.conteText2D.canvas.width / 3;
            if (totalTime > self.targetFrameTime) {
                self.conteText2D.fillStyle = 'rgb(255, 0, 0)';
            } else {
                self.conteText2D.fillStyle = 'rgb(255, 255, 255)';
            }

            self.conteText2D.fillRect(line * 2, 0, 3, self.conteText2D.canvas.height);


            self.timers = [];
            self.timersCount = 0;
            self.nowCuclTarget = "";
        },

        //計測対象を追加して計測を開始する
        add: function (_name, _col) {
            var self = this;
            self.currentStop();

            self.nowCuclTarget = _name;
            var colObj = "rgb(";

            if (_col == undefined) {
                var result = self.timersCount % 3;
                switch (result) {
                    case 0: colObj += "0,100,255)"; break;
                    case 1: colObj += "0,255,0)"; break;
                    case 2: colObj += "255,255,0)"; break;
                }
            }
            else {
                colObj = _col;
            }

            var rurerOBj = new JfTimeRulerObject(_name, colObj);
            self.timers[_name] = rurerOBj;
            self.timersCount++;
        }


    }
};

if (typeof module === 'object') {

    module.exports = JfTimeRuler;

}