var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
    };
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "mainView.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    return GameConfig;
}());
exports.default = GameConfig;
GameConfig.init();
},{}],2:[function(require,module,exports){
"use strict";
/**
 * @ Description:  摇杆控制类
 * @ Author: lzh
 * @ Date: 2019-07-17 16:31:55
 * @ Last Modified by: lzh
 * @ Last Modified time: 2019-07-18 16:13:14
 * @ copyright: youai
 */
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("./ui/layaMaxUI");
var Event = Laya.Event;
var JoyStick = /** @class */ (function (_super) {
    __extends(JoyStick, _super);
    function JoyStick(touchSp) {
        var _this = _super.call(this) || this;
        /**最大滑动距离（超过距离则显示操纵杆） */
        _this._MaxMoveDistance = 10;
        /**当前多点触摸id 防止摇杆上出现第二个手指时干扰第一个手指*/
        _this._curTouchId = -1;
        /**是否触发TouchMove事件，触发则拦截Click事件 */
        _this._isTouchMove = false;
        /**摇杆的角度 */
        _this.angle = -1;
        /**摇杆的弧度 */
        _this.radians = -1;
        _this._touchRect = touchSp;
        _this._touchRect.on(Event.MOUSE_DOWN, _this, _this._onMouseDown);
        _this._touchRect.on(Event.MOUSE_UP, _this, _this._onMouseUp);
        _this._touchRect.on(Event.MOUSE_OUT, _this, _this._onMouseUp);
        return _this;
    }
    JoyStick.prototype.onAwake = function () {
        this._originPiontX = this.width / 2;
        this._originPiontY = this.height / 2;
        this._originPiont = new Laya.Point(this._originPiontX, this._originPiontY);
        this._joystickRadius = this._originPiontX - this.joystickPoint.width / 2;
        this.visible = false;
    };
    /**
     * 鼠标按下事件回调
     * @param evt
     */
    JoyStick.prototype._onMouseDown = function (evt) {
        //记录当前按下id
        this._curTouchId = evt.touchId;
        // 记录点击的坐标点
        this._startStageX = evt.stageX;
        this._startStageY = evt.stageY;
        this._isTouchMove = false;
        //更新摇杆到屏幕按下位置
        this.pos(Laya.stage.mouseX - this._originPiontX, Laya.stage.mouseY - this._originPiontY);
        //初始化摇杆控制点位置
        this.joystickPoint.pos(this._originPiontX, this._originPiontY);
        this._touchRect.on(Event.MOUSE_MOVE, this, this._onMouseMove);
    };
    /**
     * 鼠标移动事件回调
     * @param evt
     */
    JoyStick.prototype._onMouseMove = function (evt) {
        //解决在设备上拖动到屏幕外面无法触发MOUSE_OUT和MOUSE_UP事件，所以在点击的时候判断摇杆是否存在
        if (evt.touchId != this._curTouchId)
            return;
        if (!this.visible) {
            // 当滑动超过设定的距离时才显示操纵杆
            var moveDis = this.distanceSquare(this._startStageX, this._startStageY, evt.stageX, evt.stageY);
            console.log(moveDis);
            if (moveDis > this._MaxMoveDistance * this._MaxMoveDistance) {
                this.visible = true;
                this._isTouchMove = true;
            }
        }
        else {
            //将移动时的鼠标屏幕坐标转化为摇杆局部坐标
            var locationPos = this.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY), false);
            //更新摇杆控制点位置
            this.joystickPoint.pos(locationPos.x, locationPos.y);
            //更新控制点与摇杆中心点位置距离
            this._deltaX = locationPos.x - this._originPiont.x;
            this._deltaY = locationPos.y - this._originPiont.y;
            //计算控制点在摇杆中的角度
            var dx = this._deltaX * this._deltaX;
            var dy = this._deltaY * this._deltaY;
            this.angle = Math.atan2(this._deltaX, this._deltaY) * 180 / Math.PI;
            if (this.angle < 0)
                this.angle += 360;
            //对角度取整
            this.angle = Math.round(this.angle);
            //计算控制点在摇杆中的弧度
            this.radians = Math.PI / 180 * this.angle;
            //强制控制点与中心距离
            if (dx + dy >= this._joystickRadius * this._joystickRadius) {
                //控制点在半径的位置（根据弧度变化）
                var x = Math.floor(Math.sin(this.radians) * this._joystickRadius + this._originPiont.x);
                var y = Math.floor(Math.cos(this.radians) * this._joystickRadius + this._originPiont.y);
                this.joystickPoint.pos(x, y);
            }
            else {
                //不超过取原坐标
                this.joystickPoint.pos(locationPos.x, locationPos.y);
            }
        }
    };
    /**
     * 鼠标抬起事件回调
     * @param evt
     */
    JoyStick.prototype._onMouseUp = function (evt) {
        // 如果不是上次的点击id，返回（避免多点抬起，以第一次按下id为准）
        if (evt.touchId != this._curTouchId)
            return;
        this.visible = false;
        this._touchRect.off(Event.MOUSE_MOVE, this, this._onMouseMove);
        //修改摇杆角度与弧度为-1（代表无角度）
        this.radians = this.angle = -1;
    };
    /**
     * 两点距离的平方
     * @param srcX 起始点X值
     * @param srcY 起始点Y值
     * @param desX 目标点X值
     * @param desY 目标点Y值
     */
    JoyStick.prototype.distanceSquare = function (srcX, srcY, desX, desY) {
        return (desX - srcX) * (desX - srcX) + (desY - srcY) * (desY - srcY);
    };
    return JoyStick;
}(layaMaxUI_1.ui.joystickViewUI));
exports.JoyStick = JoyStick;
},{"./ui/layaMaxUI":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
var JoyStick_1 = require("./JoyStick");
var Main = /** @class */ (function () {
    function Main() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    };
    Main.prototype.onConfigLoaded = function () {
        //加载IDE指定的场景
        GameConfig_1.default.startScene && Laya.Scene.open(GameConfig_1.default.startScene);
        Main.joystick = new JoyStick_1.JoyStick(Laya.stage);
        Laya.stage.addChild(Main.joystick);
    };
    return Main;
}());
//激活启动类
new Main();
},{"./GameConfig":1,"./JoyStick":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene = Laya.Scene;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var joystickViewUI = /** @class */ (function (_super) {
        __extends(joystickViewUI, _super);
        function joystickViewUI() {
            return _super.call(this) || this;
        }
        joystickViewUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.loadScene("joystickView");
        };
        return joystickViewUI;
    }(Scene));
    ui.joystickViewUI = joystickViewUI;
    REG("ui.joystickViewUI", joystickViewUI);
    var mainViewUI = /** @class */ (function (_super) {
        __extends(mainViewUI, _super);
        function mainViewUI() {
            return _super.call(this) || this;
        }
        mainViewUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.loadScene("mainView");
        };
        return mainViewUI;
    }(Scene));
    ui.mainViewUI = mainViewUI;
    REG("ui.mainViewUI", mainViewUI);
})(ui = exports.ui || (exports.ui = {}));
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXJJREUgKDIpL3Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9HYW1lQ29uZmlnLnRzIiwic3JjL0pveVN0aWNrLnRzIiwic3JjL01haW4udHMiLCJzcmMvdWkvbGF5YU1heFVJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkEsZ0dBQWdHOztBQUVoRzs7RUFFRTtBQUNGO0lBYUk7SUFBYyxDQUFDO0lBQ1IsZUFBSSxHQUFYO1FBQ0ksSUFBSSxHQUFHLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFFakQsQ0FBQztJQWhCTSxnQkFBSyxHQUFRLEdBQUcsQ0FBQztJQUNqQixpQkFBTSxHQUFRLElBQUksQ0FBQztJQUNuQixvQkFBUyxHQUFRLFlBQVksQ0FBQztJQUM5QixxQkFBVSxHQUFRLE1BQU0sQ0FBQztJQUN6QixpQkFBTSxHQUFRLEtBQUssQ0FBQztJQUNwQixpQkFBTSxHQUFRLE1BQU0sQ0FBQztJQUNyQixxQkFBVSxHQUFLLGdCQUFnQixDQUFDO0lBQ2hDLG9CQUFTLEdBQVEsRUFBRSxDQUFDO0lBQ3BCLGdCQUFLLEdBQVMsS0FBSyxDQUFDO0lBQ3BCLGVBQUksR0FBUyxLQUFLLENBQUM7SUFDbkIsdUJBQVksR0FBUyxLQUFLLENBQUM7SUFDM0IsNEJBQWlCLEdBQVMsSUFBSSxDQUFDO0lBTTFDLGlCQUFDO0NBbEJELEFBa0JDLElBQUE7a0JBbEJvQixVQUFVO0FBbUIvQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7OztBQ3hCbEI7Ozs7Ozs7R0FPRzs7QUFFSCw0Q0FBb0M7QUFDcEMsSUFBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUUxQjtJQUE4Qiw0QkFBaUI7SUErQjNDLGtCQUFZLE9BQW9CO1FBQWhDLFlBQ0ksaUJBQU8s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ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXHJcblxyXG4vKlxyXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9NzIwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9MTI4MDtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWR3aWR0aFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJ0b3BcIjtcclxuICAgIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwibWFpblZpZXcuc2NlbmVcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG5cclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCIvKipcclxuICogQCBEZXNjcmlwdGlvbjogIOaRh+adhuaOp+WItuexu1xyXG4gKiBAIEF1dGhvcjogbHpoXHJcbiAqIEAgRGF0ZTogMjAxOS0wNy0xNyAxNjozMTo1NVxyXG4gKiBAIExhc3QgTW9kaWZpZWQgYnk6IGx6aFxyXG4gKiBAIExhc3QgTW9kaWZpZWQgdGltZTogMjAxOS0wNy0xOCAxNjoxMzoxNFxyXG4gKiBAIGNvcHlyaWdodDogeW91YWlcclxuICovXHJcblxyXG5pbXBvcnQgeyB1aSB9IGZyb20gXCIuL3VpL2xheWFNYXhVSVwiO1xyXG5pbXBvcnQgRXZlbnQgPSBMYXlhLkV2ZW50O1xyXG5cclxuZXhwb3J0IGNsYXNzIEpveVN0aWNrIGV4dGVuZHMgdWkuam95c3RpY2tWaWV3VUkge1xyXG4gICAgLyoq5pyA5aSn5ruR5Yqo6Led56a777yI6LaF6L+H6Led56a75YiZ5pi+56S65pON57q15p2G77yJICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9NYXhNb3ZlRGlzdGFuY2U6IG51bWJlciA9IDEwO1xyXG4gICAgLyoq6Kem5pG45Yy65Z+fICovXHJcbiAgICBwcml2YXRlIF90b3VjaFJlY3Q6IExheWEuU3ByaXRlO1xyXG4gICAgLyoq5o6n5Yi25Zmo5Lit5b+D54K5WOWdkOaghyAqL1xyXG4gICAgcHJpdmF0ZSBfb3JpZ2luUGlvbnRYOiBudW1iZXI7XHJcbiAgICAvKirmjqfliLblmajkuK3lv4PngrlZ5Z2Q5qCHICovXHJcbiAgICBwcml2YXRlIF9vcmlnaW5QaW9udFk6IG51bWJlcjtcclxuICAgIC8qKuaOp+WItuWZqOS4reW/g+eCuSAqL1xyXG4gICAgcHJpdmF0ZSBfb3JpZ2luUGlvbnQ6IExheWEuUG9pbnQ7XHJcbiAgICAvKirmk43nurXmnYbkuI7mjqfliLbkuK3lv4PngrnnmoTot53nprvvvIjmkYfmnYbnmoTmu5HliqjojIPlm7TvvIkgKi9cclxuICAgIHByaXZhdGUgX2pveXN0aWNrUmFkaXVzOiBudW1iZXI7XHJcbiAgICAvKirmkYfmnYbkuI7kuK3lv4PngrnnmoR46L206Led56a7ICovXHJcbiAgICBwcml2YXRlIF9kZWx0YVg6IG51bWJlcjtcclxuICAgIC8qKuaRh+adhuS4juS4reW/g+eCueeahHnovbTot53nprsgKi9cclxuICAgIHByaXZhdGUgX2RlbHRhWTogbnVtYmVyO1xyXG4gICAgLyoqIOW8gOWni+eCueWHu+aXtueahOiInuWPsFjlnZDmoIcgKi9cclxuICAgIHByaXZhdGUgX3N0YXJ0U3RhZ2VYOiBudW1iZXI7XHJcbiAgICAvKiog5byA5aeL54K55Ye75pe255qE6Iie5Y+wWeWdkOaghyAqL1xyXG4gICAgcHJpdmF0ZSBfc3RhcnRTdGFnZVk6IG51bWJlcjtcclxuICAgIC8qKuW9k+WJjeWkmueCueinpuaRuGlkIOmYsuatouaRh+adhuS4iuWHuueOsOesrOS6jOS4quaJi+aMh+aXtuW5suaJsOesrOS4gOS4quaJi+aMhyovXHJcbiAgICBwcml2YXRlIF9jdXJUb3VjaElkOiBudW1iZXIgPSAtMTtcclxuICAgIC8qKuaYr+WQpuinpuWPkVRvdWNoTW92ZeS6i+S7tu+8jOinpuWPkeWImeaLpuaIqkNsaWNr5LqL5Lu2ICovXHJcbiAgICBwcml2YXRlIF9pc1RvdWNoTW92ZTogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoq5pGH5p2G55qE6KeS5bqmICovXHJcbiAgICBwdWJsaWMgYW5nbGU6IG51bWJlciA9IC0xO1xyXG4gICAgLyoq5pGH5p2G55qE5byn5bqmICovXHJcbiAgICBwdWJsaWMgcmFkaWFuczogbnVtYmVyID0gLTE7XHJcbiAgICBcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IodG91Y2hTcDogTGF5YS5TcHJpdGUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3RvdWNoUmVjdCA9IHRvdWNoU3A7XHJcblxyXG4gICAgICAgIHRoaXMuX3RvdWNoUmVjdC5vbihFdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLl9vbk1vdXNlRG93bik7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hSZWN0Lm9uKEV2ZW50Lk1PVVNFX1VQLCB0aGlzLCB0aGlzLl9vbk1vdXNlVXApO1xyXG4gICAgICAgIHRoaXMuX3RvdWNoUmVjdC5vbihFdmVudC5NT1VTRV9PVVQsIHRoaXMsIHRoaXMuX29uTW91c2VVcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQXdha2UoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luUGlvbnRYID0gdGhpcy53aWR0aCAvIDI7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luUGlvbnRZID0gdGhpcy5oZWlnaHQgLyAyO1xyXG4gICAgICAgIHRoaXMuX29yaWdpblBpb250ID0gbmV3IExheWEuUG9pbnQodGhpcy5fb3JpZ2luUGlvbnRYLCB0aGlzLl9vcmlnaW5QaW9udFkpO1xyXG4gICAgICAgIHRoaXMuX2pveXN0aWNrUmFkaXVzID0gdGhpcy5fb3JpZ2luUGlvbnRYIC0gdGhpcy5qb3lzdGlja1BvaW50LndpZHRoIC8gMjtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOm8oOagh+aMieS4i+S6i+S7tuWbnuiwg1xyXG4gICAgICogQHBhcmFtIGV2dCBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfb25Nb3VzZURvd24oZXZ0OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIC8v6K6w5b2V5b2T5YmN5oyJ5LiLaWRcclxuICAgICAgICB0aGlzLl9jdXJUb3VjaElkID0gZXZ0LnRvdWNoSWQ7XHJcbiAgICAgICAgLy8g6K6w5b2V54K55Ye755qE5Z2Q5qCH54K5XHJcbiAgICAgICAgdGhpcy5fc3RhcnRTdGFnZVggPSBldnQuc3RhZ2VYO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0U3RhZ2VZID0gZXZ0LnN0YWdlWTtcclxuICAgICAgICB0aGlzLl9pc1RvdWNoTW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIC8v5pu05paw5pGH5p2G5Yiw5bGP5bmV5oyJ5LiL5L2N572uXHJcbiAgICAgICAgdGhpcy5wb3MoTGF5YS5zdGFnZS5tb3VzZVggLSB0aGlzLl9vcmlnaW5QaW9udFgsIExheWEuc3RhZ2UubW91c2VZIC0gdGhpcy5fb3JpZ2luUGlvbnRZKTtcclxuICAgICAgICAvL+WIneWni+WMluaRh+adhuaOp+WItueCueS9jee9rlxyXG4gICAgICAgIHRoaXMuam95c3RpY2tQb2ludC5wb3ModGhpcy5fb3JpZ2luUGlvbnRYLCB0aGlzLl9vcmlnaW5QaW9udFkpO1xyXG4gICAgICAgIHRoaXMuX3RvdWNoUmVjdC5vbihFdmVudC5NT1VTRV9NT1ZFLCB0aGlzLCB0aGlzLl9vbk1vdXNlTW92ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog6byg5qCH56e75Yqo5LqL5Lu25Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gZXZ0IFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9vbk1vdXNlTW92ZShldnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgLy/op6PlhrPlnKjorr7lpIfkuIrmi5bliqjliLDlsY/luZXlpJbpnaLml6Dms5Xop6blj5FNT1VTRV9PVVTlkoxNT1VTRV9VUOS6i+S7tu+8jOaJgOS7peWcqOeCueWHu+eahOaXtuWAmeWIpOaWreaRh+adhuaYr+WQpuWtmOWcqFxyXG4gICAgICAgIGlmIChldnQudG91Y2hJZCAhPSB0aGlzLl9jdXJUb3VjaElkKSByZXR1cm47XHJcbiAgICAgICAgaWYoIXRoaXMudmlzaWJsZSl7XHJcbiAgICAgICAgICAgIC8vIOW9k+a7keWKqOi2hei/h+iuvuWumueahOi3neemu+aXtuaJjeaYvuekuuaTjee6teadhlxyXG4gICAgICAgICAgICBsZXQgbW92ZURpczogbnVtYmVyID0gdGhpcy5kaXN0YW5jZVNxdWFyZSh0aGlzLl9zdGFydFN0YWdlWCwgdGhpcy5fc3RhcnRTdGFnZVksIGV2dC5zdGFnZVgsIGV2dC5zdGFnZVkpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZlRGlzKTtcclxuICAgICAgICAgICAgaWYobW92ZURpcyA+IHRoaXMuX01heE1vdmVEaXN0YW5jZSAqIHRoaXMuX01heE1vdmVEaXN0YW5jZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNUb3VjaE1vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIC8v5bCG56e75Yqo5pe255qE6byg5qCH5bGP5bmV5Z2Q5qCH6L2s5YyW5Li65pGH5p2G5bGA6YOo5Z2Q5qCHXHJcbiAgICAgICAgICAgIGxldCBsb2NhdGlvblBvczogTGF5YS5Qb2ludCA9IHRoaXMuZ2xvYmFsVG9Mb2NhbChuZXcgTGF5YS5Qb2ludChMYXlhLnN0YWdlLm1vdXNlWCwgTGF5YS5zdGFnZS5tb3VzZVkpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIC8v5pu05paw5pGH5p2G5o6n5Yi254K55L2N572uXHJcbiAgICAgICAgICAgIHRoaXMuam95c3RpY2tQb2ludC5wb3MobG9jYXRpb25Qb3MueCwgbG9jYXRpb25Qb3MueSk7XHJcbiAgICAgICAgICAgIC8v5pu05paw5o6n5Yi254K55LiO5pGH5p2G5Lit5b+D54K55L2N572u6Led56a7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhWCA9IGxvY2F0aW9uUG9zLnggLSB0aGlzLl9vcmlnaW5QaW9udC54O1xyXG4gICAgICAgICAgICB0aGlzLl9kZWx0YVkgPSBsb2NhdGlvblBvcy55IC0gdGhpcy5fb3JpZ2luUGlvbnQueTtcclxuICAgICAgICAgICAgLy/orqHnrpfmjqfliLbngrnlnKjmkYfmnYbkuK3nmoTop5LluqZcclxuICAgICAgICAgICAgdmFyIGR4OiBudW1iZXIgPSB0aGlzLl9kZWx0YVggKiB0aGlzLl9kZWx0YVg7XHJcbiAgICAgICAgICAgIHZhciBkeTogbnVtYmVyID0gdGhpcy5fZGVsdGFZICogdGhpcy5fZGVsdGFZO1xyXG4gICAgICAgICAgICB0aGlzLmFuZ2xlID0gTWF0aC5hdGFuMih0aGlzLl9kZWx0YVgsIHRoaXMuX2RlbHRhWSkgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hbmdsZSA8IDApIHRoaXMuYW5nbGUgKz0gMzYwO1xyXG4gICAgICAgICAgICAvL+WvueinkuW6puWPluaVtFxyXG4gICAgICAgICAgICB0aGlzLmFuZ2xlID0gTWF0aC5yb3VuZCh0aGlzLmFuZ2xlKTtcclxuICAgICAgICAgICAgLy/orqHnrpfmjqfliLbngrnlnKjmkYfmnYbkuK3nmoTlvKfluqZcclxuICAgICAgICAgICAgdGhpcy5yYWRpYW5zID0gTWF0aC5QSSAvIDE4MCAqIHRoaXMuYW5nbGU7XHJcbiAgICAgICAgICAgIC8v5by65Yi25o6n5Yi254K55LiO5Lit5b+D6Led56a7XHJcbiAgICAgICAgICAgIGlmIChkeCArIGR5ID49ICB0aGlzLl9qb3lzdGlja1JhZGl1cyAqIHRoaXMuX2pveXN0aWNrUmFkaXVzKSB7XHJcbiAgICAgICAgICAgICAgICAvL+aOp+WItueCueWcqOWNiuW+hOeahOS9jee9ru+8iOagueaNruW8p+W6puWPmOWMlu+8iVxyXG4gICAgICAgICAgICAgICAgdmFyIHg6IG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5zaW4odGhpcy5yYWRpYW5zKSAqIHRoaXMuX2pveXN0aWNrUmFkaXVzICsgdGhpcy5fb3JpZ2luUGlvbnQueCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgeTogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLmNvcyh0aGlzLnJhZGlhbnMpICogdGhpcy5fam95c3RpY2tSYWRpdXMgKyB0aGlzLl9vcmlnaW5QaW9udC55KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuam95c3RpY2tQb2ludC5wb3MoeCwgeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL+S4jei2hei/h+WPluWOn+WdkOagh1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qb3lzdGlja1BvaW50LnBvcyhsb2NhdGlvblBvcy54LCBsb2NhdGlvblBvcy55KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOm8oOagh+aKrOi1t+S6i+S7tuWbnuiwg1xyXG4gICAgICogQHBhcmFtIGV2dCBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfb25Nb3VzZVVwKGV2dDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAvLyDlpoLmnpzkuI3mmK/kuIrmrKHnmoTngrnlh7tpZO+8jOi/lOWbnu+8iOmBv+WFjeWkmueCueaKrOi1t++8jOS7peesrOS4gOasoeaMieS4i2lk5Li65YeG77yJXHJcbiAgICAgICAgaWYgKGV2dC50b3VjaElkICE9IHRoaXMuX2N1clRvdWNoSWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl90b3VjaFJlY3Qub2ZmKEV2ZW50Lk1PVVNFX01PVkUsIHRoaXMsIHRoaXMuX29uTW91c2VNb3ZlKTtcclxuICAgICAgICAvL+S/ruaUueaRh+adhuinkuW6puS4juW8p+W6puS4ui0x77yI5Luj6KGo5peg6KeS5bqm77yJXHJcbiAgICAgICAgdGhpcy5yYWRpYW5zID0gdGhpcy5hbmdsZSA9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Lik54K56Led56a755qE5bmz5pa5XHJcbiAgICAgKiBAcGFyYW0gc3JjWCDotbflp4vngrlY5YC8XHJcbiAgICAgKiBAcGFyYW0gc3JjWSDotbflp4vngrlZ5YC8XHJcbiAgICAgKiBAcGFyYW0gZGVzWCDnm67moIfngrlY5YC8XHJcbiAgICAgKiBAcGFyYW0gZGVzWSDnm67moIfngrlZ5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXN0YW5jZVNxdWFyZShzcmNYOiBudW1iZXIsIHNyY1k6IG51bWJlciwgZGVzWDogbnVtYmVyLCBkZXNZOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAoZGVzWCAtIHNyY1gpICogKGRlc1ggLSBzcmNYKSArIChkZXNZIC0gc3JjWSkgKiAoZGVzWSAtIHNyY1kpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgeyBKb3lTdGljayB9IGZyb20gXCIuL0pveVN0aWNrXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cdHB1YmxpYyBzdGF0aWMgam95c3RpY2s6IEpveVN0aWNrO1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG5cclxuXHRcdC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHRMYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xyXG5cdH1cclxuXHJcblx0b25Db25maWdMb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xyXG5cdFx0R2FtZUNvbmZpZy5zdGFydFNjZW5lICYmIExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUpO1xyXG5cdFx0TWFpbi5qb3lzdGljayA9IG5ldyBKb3lTdGljayhMYXlhLnN0YWdlKTtcclxuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoTWFpbi5qb3lzdGljayk7XHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xyXG5pbXBvcnQgRGlhbG9nPUxheWEuRGlhbG9nO1xyXG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbnZhciBSRUc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xuZXhwb3J0IG1vZHVsZSB1aSB7XHJcbiAgICBleHBvcnQgY2xhc3Mgam95c3RpY2tWaWV3VUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgam95c3RpY2tCZzpMYXlhLkltYWdlO1xuXHRcdHB1YmxpYyBqb3lzdGlja1BvaW50OkxheWEuSW1hZ2U7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJqb3lzdGlja1ZpZXdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUkVHKFwidWkuam95c3RpY2tWaWV3VUlcIixqb3lzdGlja1ZpZXdVSSk7XHJcbiAgICBleHBvcnQgY2xhc3MgbWFpblZpZXdVSSBleHRlbmRzIFNjZW5lIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwibWFpblZpZXdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUkVHKFwidWkubWFpblZpZXdVSVwiLG1haW5WaWV3VUkpO1xyXG59XHIiXX0=