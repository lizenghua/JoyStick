/**
 * @ Description:  摇杆控制类
 * @ Author: lzh
 * @ Date: 2019-07-17 16:31:55
 * @ Last Modified by: lzh
 * @ Last Modified time: 2019-07-18 17:33:26
 * @ copyright: youai
 */

import { ui } from "./ui/layaMaxUI";
import Event = Laya.Event;

export class JoyStick extends ui.joystickViewUI {
    /**最大滑动距离（超过距离则显示操纵杆） */
    private readonly _MaxMoveDistance: number = 10;
    /**触摸区域 */
    private _touchRect: Laya.Sprite;
    /**控制器中心点X坐标 */
    private _originPiontX: number;
    /**控制器中心点Y坐标 */
    private _originPiontY: number;
    /**控制器中心点 */
    private _originPiont: Laya.Point;
    /**操纵杆与控制中心点的距离（摇杆的滑动范围） */
    private _joystickRadius: number;
    /**摇杆与中心点的x轴距离 */
    private _deltaX: number;
    /**摇杆与中心点的y轴距离 */
    private _deltaY: number;
    /** 开始点击时的舞台X坐标 */
    private _startStageX: number;
    /** 开始点击时的舞台Y坐标 */
    private _startStageY: number;
    /**当前多点触摸id 防止摇杆上出现第二个手指时干扰第一个手指*/
    private _curTouchId: number = -1;
    /**是否触发TouchMove事件，触发则拦截Click事件 */
    private _isTouchMove: Boolean = false;
    /**摇杆的角度 */
    public angle: number = -1;
    /**摇杆的弧度 */
    public radians: number = -1;


    constructor(touchSp: Laya.Sprite) {
        super();
        this._touchRect = touchSp;

        this._touchRect.on(Event.MOUSE_DOWN, this, this._onMouseDown);
        this._touchRect.on(Event.MOUSE_UP, this, this._onMouseUp);
        this._touchRect.on(Event.MOUSE_OUT, this, this._onMouseUp);
    }

    public onAwake(): void {
        this._originPiontX = this.width / 2;
        this._originPiontY = this.height / 2;
        this._originPiont = new Laya.Point(this._originPiontX, this._originPiontY);
        this._joystickRadius = this._originPiontX - this.joystickPoint.width / 2;
        this.visible = false;
    }

    /**
     * 鼠标按下事件回调
     * @param evt 
     */
    private _onMouseDown(evt: Event): void {
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
    }

    /**
     * 鼠标移动事件回调
     * @param evt 
     */
    private _onMouseMove(evt: Event): void {
        //解决在设备上拖动到屏幕外面无法触发MOUSE_OUT和MOUSE_UP事件
        if (evt.touchId != this._curTouchId) return;
        if (!this.visible) {
            // 当滑动超过设定的距离时才显示操纵杆
            let moveDis: number = this.distanceSquare(this._startStageX, this._startStageY, evt.stageX, evt.stageY);
            if (moveDis > this._MaxMoveDistance * this._MaxMoveDistance) {
                this.visible = true;
                this._isTouchMove = true;
            }
        } else {
            //将移动时的鼠标屏幕坐标转化为摇杆局部坐标
            let locationPos: Laya.Point = this.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY), false);
            //更新摇杆控制点位置
            this.joystickPoint.pos(locationPos.x, locationPos.y);
            //更新控制点与摇杆中心点位置距离
            this._deltaX = locationPos.x - this._originPiont.x;
            this._deltaY = locationPos.y - this._originPiont.y;
            //计算控制点在摇杆中的角度
            let dx: number = this._deltaX * this._deltaX;
            let dy: number = this._deltaY * this._deltaY;
            this.angle = Math.atan2(this._deltaX, this._deltaY) * 180 / Math.PI;
            if (this.angle < 0) this.angle += 360;
            //对角度取整
            this.angle = Math.round(this.angle);
            //计算控制点在摇杆中的弧度
            this.radians = Math.PI / 180 * this.angle;
            //强制控制点与中心距离
            if (dx + dy >= this._joystickRadius * this._joystickRadius) {
                //控制点在半径的位置（根据弧度变化）
                let x: number = Math.floor(Math.sin(this.radians) * this._joystickRadius + this._originPiont.x);
                let y: number = Math.floor(Math.cos(this.radians) * this._joystickRadius + this._originPiont.y);
                this.joystickPoint.pos(x, y);
            }
            else {
                //不超过取原坐标
                this.joystickPoint.pos(locationPos.x, locationPos.y);
            }
        }
    }

    /**
     * 鼠标抬起事件回调
     * @param evt 
     */
    private _onMouseUp(evt: Event): void {
        // 如果不是上次的点击id，返回（避免多点抬起，以第一次按下id为准）
        if (evt.touchId != this._curTouchId) return;
        this.visible = false;
        this._touchRect.off(Event.MOUSE_MOVE, this, this._onMouseMove);
        //修改摇杆角度与弧度为-1（代表无角度）
        this.radians = this.angle = -1;
    }

    /**
     * 两点距离的平方
     * @param srcX 起始点X值
     * @param srcY 起始点Y值
     * @param desX 目标点X值
     * @param desY 目标点Y值
     */
    public distanceSquare(srcX: number, srcY: number, desX: number, desY: number): number {
        return (desX - srcX) * (desX - srcX) + (desY - srcY) * (desY - srcY);
    }
}