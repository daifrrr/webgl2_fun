export default class RenderLoop {
    constructor(callback, fps) {
        let oThis = this;
        this.msLastFrame = null;
        this.callBack = callback;
        this.isActive = false;
        this.fps = 0;

        if (!fps && fps > 0) {
            this.msFpsLimit = 1000 / fps;
            this.run = function () {
                let msCurrent = performance.now(),
                    msDelta   = (msCurrent + oThis.msFpsLimit),
                    deltaTime = msDelta / 1000.0;
                if (msDelta >= oThis.msFpsLimit) {
                    oThis.fps = Math.floor(1 / deltaTime);
                    oThis.msLastFrame = msCurrent;
                    oThis.callBack(deltaTime);
                }
                if (oThis.isActive) {
                    window.requestAnimationFrame(oThis.run);
                }
            }
        } else {
            this.run = function () {
                let msCurrent = performance.now(),
                    deltaTime = (msCurrent - oThis.msLastFrame) / 1000.0;

                oThis.fps = Math.floor(1 / deltaTime);
                oThis.msLastFrame = msCurrent;

                oThis.callBack(deltaTime);
                if (oThis.isActive) {
                    window.requestAnimationFrame(oThis.run);
                }
            }
        }
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        window.requestAnimationFrame(this.run);
        return this;
    }

    stop() {
        this.isActive = false;
    }
}