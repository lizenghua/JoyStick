/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui {
    export class joystickViewUI extends Scene {
		public joystickBg:Laya.Image;
		public joystickPoint:Laya.Image;
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("joystickView");
        }
    }
    REG("ui.joystickViewUI",joystickViewUI);
    export class mainViewUI extends Scene {
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.loadScene("mainView");
        }
    }
    REG("ui.mainViewUI",mainViewUI);
}