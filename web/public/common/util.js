var CTRL_MODE;
(function (CTRL_MODE) {
    CTRL_MODE[CTRL_MODE["INVALID"] = 0] = "INVALID";
    CTRL_MODE[CTRL_MODE["REMOTE"] = 1] = "REMOTE";
    CTRL_MODE[CTRL_MODE["EAGLE"] = 2] = "EAGLE";
    CTRL_MODE[CTRL_MODE["PANORAMA"] = 3] = "PANORAMA";
    CTRL_MODE[CTRL_MODE["WANDER"] = 4] = "WANDER";
})(CTRL_MODE || (CTRL_MODE = {}));
var VIEW_MODE;
(function (VIEW_MODE) {
    VIEW_MODE[VIEW_MODE["INVALID"] = 1] = "INVALID";
    VIEW_MODE[VIEW_MODE["_2D"] = 2] = "_2D";
    VIEW_MODE[VIEW_MODE["_3D"] = 3] = "_3D";
})(VIEW_MODE || (VIEW_MODE = {}));
class RemoteParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_nHeight = 0.0;
    }
}
class EagleParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_nDistance = 0.0;
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
    }
}
class PanoramaParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        this.m_nDistance = 0.0;
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
    }
}
class WanderParam {
    constructor() {
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_mPosition = { x: 0.0, y: 0.0, z: 0.0 };
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
    }
}
class CameraCtrl {
    constructor(pCamera) {
        this.m_pCamera = null;
        this.m_pTransform = null;
        this.m_eCtrlMode = CTRL_MODE.REMOTE;
        this.m_nViewMode = 3;
        this.m_nLng = 0.0;
        this.m_nLat = 0.0;
        this.m_nDistance = 0.0;
        this.m_nPitch = 0.0;
        this.m_nYaw = 0.0;
        this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        this.m_pFlyTask = null;
        this.m_pCamera = pCamera;
        this.m_pTransform = this.m_pCamera.transform;
    }
    Jump(eMode, pParam) {
        this.m_eCtrlMode = eMode;
        if (CTRL_MODE.REMOTE === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = pParam.m_nHeight;
            this.m_nPitch = 90.0;
            this.m_nYaw = 0.0;
            this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        }
        else if (CTRL_MODE.EAGLE === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = pParam.m_nDistance;
            this.m_nPitch = pParam.m_nPitch;
            this.m_nYaw = pParam.m_nYaw;
            this.m_mTarget = { x: 0.0, y: 0.0, z: 0.0 };
        }
        else if (CTRL_MODE.PANORAMA === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = pParam.m_nDistance;
            this.m_nPitch = pParam.m_nPitch;
            this.m_nYaw = pParam.m_nYaw;
            this.m_mTarget = { x: pParam.m_mTarget.x, y: pParam.m_mTarget.y, z: pParam.m_mTarget.z };
        }
        else if (CTRL_MODE.WANDER === eMode) {
            this.m_nLng = pParam.m_nLng;
            this.m_nLat = pParam.m_nLat;
            this.m_nDistance = 0.0;
            this.m_nPitch = pParam.m_nPitch;
            this.m_nYaw = pParam.m_nYaw;
            this.m_mTarget = { x: pParam.m_mPosition.x, y: pParam.m_mPosition.y, z: pParam.m_mPosition.z };
        }
    }
    Fly(eMode, pParam, nSpeed_) {
        let pThis = this;
        pThis.m_pFlyTask = {
            m_eMode: eMode,
            m_pParam: pParam,
            Update: function () {
                let bComplete = true;
                let bSpeed = nSpeed_ ? nSpeed_ : 0.1;
                if (undefined !== this.m_pParam.m_nLng) {
                    let nBias = this.m_pParam.m_nLng - pThis.m_nLng;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        pThis.m_nLng += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nLng = this.m_pParam.m_nLng;
                    }
                }
                if (undefined !== this.m_pParam.m_nLat) {
                    let nBias = this.m_pParam.m_nLat - pThis.m_nLat;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        pThis.m_nLat += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nLat = this.m_pParam.m_nLat;
                    }
                }
                let nDistance = undefined != this.m_pParam.m_nHeight ? this.m_pParam.m_nHeight : this.m_pParam.m_nDistance;
                if (undefined !== nDistance) {
                    let nBias = nDistance - pThis.m_nDistance;
                    if (-1.0 > nBias || 1.0 < nBias) {
                        pThis.m_nDistance += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nDistance = nDistance;
                    }
                }
                if (undefined !== this.m_pParam.m_nPitch) {
                    let nBias = this.m_pParam.m_nPitch - pThis.m_nPitch;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_nPitch += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nPitch = this.m_pParam.m_nPitch;
                    }
                }
                if (undefined !== this.m_pParam.m_nYaw) {
                    let nBias = this.m_pParam.m_nYaw - pThis.m_nYaw;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_nYaw += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_nYaw = this.m_pParam.m_nYaw;
                    }
                }
                let mTarget = undefined != this.m_pParam.m_mTarget ? this.m_pParam.m_mTarget : this.m_pParam.m_mPosition;
                if (undefined !== mTarget) {
                    let nBias = mTarget.x - pThis.m_mTarget.x;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_mTarget.x += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_mTarget.x = mTarget.x;
                    }
                    nBias = mTarget.y - pThis.m_mTarget.y;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_mTarget.y += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_mTarget.y = mTarget.y;
                    }
                    nBias = mTarget.z - pThis.m_mTarget.z;
                    if (-1 > nBias || 1 < nBias) {
                        pThis.m_mTarget.z += nBias * bSpeed;
                        bComplete = false;
                    }
                    else {
                        pThis.m_mTarget.z = mTarget.z;
                    }
                }
                if (bComplete) {
                    pThis.m_eCtrlMode = this.m_eMode;
                }
                else {
                    pThis.m_pTransform.position = { x: 0, y: 0, z: 0 };
                    pThis.m_pTransform.euler = { x: 0, y: 0, z: 0 };
                    pThis.m_pTransform.Rotate2({ x: 1, y: 0, z: 0 }, pThis.pitch, 1);
                    pThis.m_pTransform.Rotate2({ x: 0, y: 1, z: 0 }, pThis.yaw, 0);
                    pThis.m_pTransform.position = pThis.target;
                    pThis.m_pTransform.Translate(MiaokitJS.Vector3.Scale(-pThis.distance, { x: 0, y: 0, z: 1 }), 1);
                }
                return bComplete;
            }
        };
    }
    Move(nOffsetX, nOffsetY, nWidth, nHeight) {
        if (CTRL_MODE.REMOTE === this.ctrlMode || CTRL_MODE.EAGLE === this.ctrlMode) {
            let nDistance = this.distance;
            let nLng = this.lng;
            let nLat = this.lat;
            if (nDistance > 6378137.0) {
                nDistance = 6378137.0;
            }
            if (nDistance < 0.0) {
                nDistance = 0.0;
            }
            let nAngle = nDistance / 6378137.0 * 120.0;
            let offsetLng = nOffsetX / nWidth * nAngle;
            let offsetLat = nOffsetY / nHeight * nAngle;
            let rYaw = (this.yaw / 180.0) * Math.PI;
            nLng += offsetLng * Math.cos(rYaw);
            nLat -= offsetLng * Math.sin(rYaw);
            nLat += offsetLat * Math.cos(rYaw);
            nLng += offsetLat * Math.sin(rYaw);
            this.lng = nLng;
            this.lat = nLat;
        }
        else if (CTRL_MODE.PANORAMA === this.ctrlMode) {
            let nViewHeight = 1.0 * this.distance;
            let nFactor = nViewHeight / nHeight;
            nOffsetX *= nFactor;
            nOffsetY *= nFactor;
            let mTarget = this.target;
            if (2 === this.m_nViewMode) {
                mTarget.x += nOffsetX;
                mTarget.z += nOffsetY;
            }
            else {
                let rYaw = (this.yaw / 180.0) * Math.PI;
                mTarget.x += nOffsetX * Math.cos(rYaw);
                mTarget.z -= nOffsetX * Math.sin(rYaw);
                mTarget.z += nOffsetY * Math.cos(rYaw);
                mTarget.x += nOffsetY * Math.sin(rYaw);
            }
            this.target = mTarget;
        }
    }
    Rotate(nOffsetX, nOffsetY, nWidth, nHeight) {
        if (CTRL_MODE.REMOTE !== this.ctrlMode) {
            let nPitch = this.pitch;
            let nYaw = this.yaw;
            nYaw += nOffsetX / nWidth * 180;
            nPitch += nOffsetY / nHeight * 90.0;
            if (5.0 > nPitch) {
                nPitch = 5.0;
            }
            if (90.0 < nPitch) {
                nPitch = 90.0;
            }
            this.pitch = nPitch;
            this.yaw = nYaw;
        }
    }
    Scale(nDelta, nWidth, nHeight) {
        let nDistance = this.distance;
        nDistance += nDelta * nDistance * 0.05;
        this.distance = nDistance;
    }
    Update() {
        if (this.m_pFlyTask) {
            if (this.m_pFlyTask.Update()) {
                this.m_pFlyTask = null;
            }
            return;
        }
        if (CTRL_MODE.WANDER !== this.m_eCtrlMode) {
            if (CTRL_MODE.REMOTE === this.m_eCtrlMode) {
                if (20000.0 > this.height) {
                    this.m_eCtrlMode = CTRL_MODE.EAGLE;
                    console.log("自动切换到鹰眼模式");
                }
                else {
                    let nBias = this.m_nPitch - 90.0;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        this.m_nPitch -= nBias * 0.1;
                    }
                    nBias = this.m_nYaw - 0.0;
                    if (-0.1 > nBias || 0.1 < nBias) {
                        this.m_nYaw -= nBias * 0.1;
                    }
                }
            }
            else if (CTRL_MODE.EAGLE === this.m_eCtrlMode) {
                if (20000.0 < this.distance) {
                    this.m_eCtrlMode = CTRL_MODE.REMOTE;
                    console.log("自动切换到遥感模式");
                }
                else {
                    let nBias = this.m_nPitch - 85.0;
                    if (0.1 < nBias) {
                        this.m_nPitch -= nBias * 0.1;
                    }
                    nBias = 5.0 - this.m_nPitch;
                    if (0.1 < nBias) {
                        this.m_nPitch += nBias * 0.1;
                    }
                }
            }
            if (CTRL_MODE.PANORAMA !== this.m_eCtrlMode) {
                let mTarget = this.target;
                let nBias = mTarget.x - 0.0;
                if (-0.1 > nBias || 0.1 < nBias) {
                    mTarget.x += nBias * 0.1;
                }
                nBias = mTarget.y - 0.0;
                if (-0.1 > nBias || 0.1 < nBias) {
                    mTarget.y += nBias * 0.1;
                }
                nBias = mTarget.z - 0.0;
                if (-0.1 > nBias || 0.1 < nBias) {
                    mTarget.z += nBias * 0.1;
                }
                this.target = mTarget;
            }
            if (2 === this.m_nViewMode) {
                this.m_pTransform.position = { x: 0, y: 0, z: 0 };
                this.m_pTransform.euler = { x: 0, y: 0, z: 0 };
                this.m_pTransform.Rotate2({ x: 1, y: 0, z: 0 }, 90, 0);
                this.m_pTransform.position = this.target;
                this.m_pTransform.Translate(MiaokitJS.Vector3.Scale(-this.distance, { x: 0, y: 0, z: 1 }), 1);
            }
            else {
                this.m_pTransform.position = { x: 0, y: 0, z: 0 };
                this.m_pTransform.euler = { x: 0, y: 0, z: 0 };
                this.m_pTransform.Rotate2({ x: 1, y: 0, z: 0 }, this.pitch, 1);
                this.m_pTransform.Rotate2({ x: 0, y: 1, z: 0 }, this.yaw, 0);
                this.m_pTransform.position = this.target;
                this.m_pTransform.Translate(MiaokitJS.Vector3.Scale(-this.distance, { x: 0, y: 0, z: 1 }), 1);
            }
        }
        else {
            console.log("未实现漫游模式");
        }
    }
    get ctrlMode() {
        return this.m_eCtrlMode;
    }
    get viewMode() {
        return this.m_nViewMode;
    }
    set viewMode(mode) {
        if (this.m_nViewMode !== mode) {
            this.m_nViewMode = mode;
            MiaokitJS.Miaokit.cameraMode = mode;
        }
    }
    get curView() {
        return {
            m_eCtrlMode: this.m_eCtrlMode,
            m_nLng: this.m_nLng,
            m_nLat: this.m_nLat,
            m_mTarget: this.m_mTarget,
            m_nDistance: this.m_nDistance,
            m_nPitch: this.m_nPitch,
            m_nYaw: this.m_nYaw
        };
    }
    get lng() {
        return this.m_nLng;
    }
    set lng(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode || CTRL_MODE.EAGLE === this.m_eCtrlMode) {
            this.m_nLng = value;
        }
    }
    get lat() {
        return this.m_nLat;
    }
    set lat(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode || CTRL_MODE.EAGLE === this.m_eCtrlMode) {
            this.m_nLat = value;
        }
    }
    get height() {
        return this.m_nDistance;
    }
    set height(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode) {
            this.m_nDistance = value;
        }
    }
    get distance() {
        return this.m_nDistance;
    }
    set distance(value) {
        if (CTRL_MODE.REMOTE === this.m_eCtrlMode || CTRL_MODE.EAGLE === this.m_eCtrlMode || CTRL_MODE.PANORAMA === this.m_eCtrlMode) {
            this.m_nDistance = value;
        }
    }
    get pitch() {
        return this.m_nPitch;
    }
    set pitch(value) {
        if (CTRL_MODE.EAGLE === this.m_eCtrlMode || CTRL_MODE.PANORAMA === this.m_eCtrlMode || CTRL_MODE.WANDER === this.m_eCtrlMode) {
            this.m_nPitch = value;
        }
    }
    get yaw() {
        return this.m_nYaw;
    }
    set yaw(value) {
        if (CTRL_MODE.EAGLE === this.m_eCtrlMode || CTRL_MODE.PANORAMA === this.m_eCtrlMode || CTRL_MODE.WANDER === this.m_eCtrlMode) {
            this.m_nYaw = value;
        }
    }
    get target() {
        return { x: this.m_mTarget.x, y: this.m_mTarget.y, z: this.m_mTarget.z };
    }
    set target(value) {
        if (CTRL_MODE.PANORAMA === this.m_eCtrlMode) {
            this.m_mTarget.x = value.x;
            this.m_mTarget.y = value.y;
            this.m_mTarget.z = value.z;
        }
    }
    get position() {
        return { x: this.m_mTarget.x, y: this.m_mTarget.y, z: this.m_mTarget.z };
    }
    set position(value) {
        if (CTRL_MODE.WANDER === this.m_eCtrlMode) {
            this.m_mTarget.x = value.x;
            this.m_mTarget.y = value.y;
            this.m_mTarget.z = value.z;
        }
    }
}
MiaokitJS.UTIL = MiaokitJS.UTIL || {};
MiaokitJS.UTIL.CTRL_MODE = CTRL_MODE;
MiaokitJS.UTIL.VIEW_MODE = VIEW_MODE;
MiaokitJS.UTIL.RemoteParam = RemoteParam;
MiaokitJS.UTIL.EagleParam = EagleParam;
MiaokitJS.UTIL.PanoramaParam = PanoramaParam;
MiaokitJS.UTIL.WanderParam = WanderParam;
MiaokitJS.UTIL.CameraCtrl = CameraCtrl;
class App {
    constructor() {
        this.m_pContainer = null;
        this.m_pCanvas2D = null;
        this.m_pCanvasCtx2D = null;
        this.OnGUI = null;
        this.m_nTick = null;
        this.m_nTime = 0;
        this.m_aAnalyze = null;
        this.m_pCamera = null;
        this.m_pCameraCtrl = null;
        this.m_pPicker = null;
        this.m_pGis = null;
        this.m_pProject = null;
    }
    Preload() {
        this.m_pProject.Preload();
    }
    Start() {
        let pContainer = document.getElementById("unityContainer");
        let pCanvas2D = document.createElement("canvas");
        pCanvas2D.id = "2d";
        pCanvas2D.width = pContainer.offsetWidth;
        pCanvas2D.height = pContainer.offsetHeight;
        pCanvas2D.style.width = "100%";
        pCanvas2D.style.height = "100%";
        pCanvas2D.style.top = "0rem";
        pCanvas2D.style.bottom = "0rem";
        pCanvas2D.style.left = "0rem";
        pCanvas2D.style.right = "0rem";
        pCanvas2D.style.position = "absolute";
        pCanvas2D.style.zIndex = "1";
        pContainer.appendChild(pCanvas2D);
        MiaokitJS["Miaokit"]["ResizeCavans"](pCanvas2D.width, pCanvas2D.height);
        this.m_pContainer = pContainer;
        this.m_pCanvas2D = pCanvas2D;
        this.m_pCanvasCtx2D = pCanvas2D.getContext('2d');
        this.m_pCamera = MiaokitJS.Miaokit.camera;
        this.m_pCameraCtrl = new MiaokitJS.UTIL.CameraCtrl(this.m_pCamera);
        this.m_pPicker = new MiaokitJS.UTIL.EntityPicker(this.m_pCameraCtrl);
        if (MiaokitJS.m_pConfig.GIS) {
            this.m_pGis = MiaokitJS.Miaokit.gis;
            this.m_pGis.imageServer = MiaokitJS.m_pConfig.GIS.m_pImageServer;
            if (MiaokitJS.m_pConfig.GIS.m_pTerrainServer) {
                this.m_pGis.terrainServer = MiaokitJS.m_pConfig.GIS.m_pTerrainServer;
            }
        }
        if (MiaokitJS.m_pConfig.DIORS) {
            for (let pDior of MiaokitJS.m_pConfig.DIORS) {
                pDior.m_pDior = new MiaokitJS.Dioramas3MX(pDior.m_pPath, !this.m_pGis ? null : {
                    m_pGis: this.m_pGis,
                    m_mLngLat: pDior.m_mLngLat,
                    m_mOffset: pDior.m_nOffset
                });
            }
        }
        this.RegisterEvent(this.m_pCanvas2D, MiaokitJS.Miaokit.cameraCtrl);
        this.m_pProject.Start();
    }
    Update() {
        this.m_nTick++;
        this.Draw2D();
        this.m_pCameraCtrl.Update();
        this.m_pProject.Update();
    }
    ActiveTile(pTile) {
        this.m_pProject.ActiveTile(pTile);
    }
    Draw2D() {
        this.m_pCanvasCtx2D.clearRect(0, 0, this.m_pCanvas2D.clientWidth, this.m_pCanvas2D.clientHeight);
        this.Analyze();
        if (this.OnGUI) {
            this.OnGUI(this.m_pCanvas2D, this.m_pCanvasCtx2D);
        }
    }
    Analyze() {
        if (1 === this.m_nTick % 60) {
            let nTime = MiaokitJS.Time();
            if (this.m_nTime) {
                this.m_aAnalyze = MiaokitJS.Miaokit.Analyze((60 / ((nTime - this.m_nTime) / 1000)).toFixed(0));
                this.m_nTime = nTime;
            }
            else {
                this.m_aAnalyze = MiaokitJS.Miaokit.Analyze(1);
                this.m_nTime = nTime;
            }
        }
        let pCanvas = this.m_pCanvasCtx2D;
        let aInfo = this.m_aAnalyze;
        let nOffset = 68;
        if (aInfo) {
            pCanvas.font = "14px Microsoft YaHei";
            pCanvas.strokeStyle = "black";
            pCanvas.lineWidth = 2;
            pCanvas.fillStyle = "#FFFFFF";
            for (let pInfo of aInfo) {
                pCanvas.strokeText(pInfo, 10, nOffset);
                pCanvas.fillText(pInfo, 10, nOffset);
                nOffset += 18;
            }
            if (MiaokitJS.Profiler) {
                let pInfo = MiaokitJS.Profiler.m_pMsg;
                pCanvas.strokeText(pInfo, 10, nOffset);
                pCanvas.fillText(pInfo, 10, nOffset);
                nOffset += 18;
            }
        }
    }
    RegisterEvent(pCavans, pCamera) {
        let nDrag = -1;
        let nPressTime = MiaokitJS.Time();
        let nClickTime = 0;
        let pThis = this;
        let pLastObj = null;
        pCavans.addEventListener("mousewheel", function (e) {
            pThis.m_pCameraCtrl.Scale(e.deltaY / Math.abs(e.deltaY), pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
        }, true);
        pCavans.addEventListener("DOMMouseScroll", function (e) {
            pThis.m_pCameraCtrl.Scale(e.detail / Math.abs(e.detail), pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
        }, true);
        pCavans.addEventListener("mousedown", function (e) {
            nDrag = e.button;
            if (2 === nDrag) {
                nDrag = 1;
            }
            nPressTime = MiaokitJS.Time();
        }, false);
        pCavans.addEventListener("mouseup", function (e) {
            nDrag = -1;
            if (250 > MiaokitJS.Time() - nPressTime) {
                if (500 > MiaokitJS.Time() - nClickTime) {
                    let pSelect = null;
                    if (0 == e.button) {
                        pSelect = pThis.m_pPicker.Select();
                    }
                    else if (2 == e.button) {
                        pSelect = pThis.m_pPicker.UnSelect();
                    }
                    if (pSelect) {
                        if (pSelect && pSelect.m_pViewState) {
                            pSelect.m_pViewState.m_mTarget = pSelect.m_pObject3D.transform.position;
                            pThis.m_pCameraCtrl.Fly(MiaokitJS.SVECLASS.CTRL_MODE.PANORAMA, pSelect.m_pViewState);
                        }
                    }
                    if (pThis["pObject2"]) {
                        pThis["pObject2"].Destory();
                        pThis["pObject2"] = null;
                    }
                    else if (pThis["pObject"]) {
                        pThis["pObject"].Destory();
                        pThis["pObject"] = null;
                    }
                }
                else {
                }
                nClickTime = MiaokitJS.Time();
            }
        }, false);
        pCavans.addEventListener("mouseout", function (e) {
            nDrag = -1;
        }, false);
        pCavans.addEventListener("mousemove", function (e) {
            MiaokitJS.ShaderLab.Pipeline.Picker = {
                Feedback: (pObject, nSubmesh) => {
                    if (pObject) {
                        if (!pLastObj || pLastObj.m_nID !== pObject.m_nID) {
                            if (pLastObj) {
                                pLastObj.highlight = false;
                            }
                            console.log(pObject.name, nSubmesh);
                            pObject.highlight = true;
                            pLastObj = pObject;
                        }
                    }
                },
                x: e.clientX,
                y: e.clientY
            };
            if (0 === nDrag) {
                pThis.m_pCameraCtrl.Move(-e.movementX, e.movementY, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
            }
            else if (1 === nDrag) {
                pThis.m_pCameraCtrl.Rotate(e.movementX, e.movementY, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
            }
        }, false);
        let pStartEvent = null;
        let Distance = function (p0, p1) {
            let mVec = { x: p0.x - p1.x, y: p0.y - p1.y };
            return Math.sqrt((mVec.x * mVec.x) + (mVec.y * mVec.y));
        };
        pCavans.addEventListener("touchstart", function (e) {
            if (1 == e.touches.length) {
                nDrag = 2;
                pStartEvent = e;
            }
            else if (2 == e.touches.length) {
            }
        }, false);
        pCavans.addEventListener("touchmove", function (e) {
            e.preventDefault();
            if (e.touches == null)
                return;
            if (1 == e.touches.length && 2 == nDrag) {
                let nDeltaX = e.touches[0].clientX - pStartEvent.touches[0].clientX;
                let nDeltaY = e.touches[0].clientY - pStartEvent.touches[0].clientY;
                pStartEvent = e;
                pThis.m_pCameraCtrl.Move(nDeltaX * -2, nDeltaY * 2, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
            }
            else if (2 == e.touches.length && 2 == pStartEvent.touches.length) {
                let mStartPoint = { x: (pStartEvent.touches[0].clientX + pStartEvent.touches[1].clientX) * 0.5, y: (pStartEvent.touches[0].clientY + pStartEvent.touches[1].clientY) * 0.5 };
                let mCurPoint = { x: (e.touches[0].clientX + e.touches[1].clientX) * 0.5, y: (e.touches[0].clientY + e.touches[1].clientY) * 0.5 };
                let mMoveDelta = { x: -mCurPoint.x + mStartPoint.x, y: mCurPoint.y - mStartPoint.y };
                let mStartPoint0 = { x: pStartEvent.touches[0].clientX, y: pStartEvent.touches[0].clientY };
                let mStartPoint1 = { x: pStartEvent.touches[1].clientX, y: pStartEvent.touches[1].clientY };
                let mCurPoint0 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                let mCurPoint1 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
                let nScaleDelta = Distance(mCurPoint0, mCurPoint1) - Distance(mStartPoint1, mStartPoint0);
                pStartEvent = e;
                pThis.m_pCameraCtrl.Rotate(mMoveDelta.x * -5, mMoveDelta.y * 5, pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
                if (Math.abs(nScaleDelta) > 10) {
                    pThis.m_pCameraCtrl.Scale(-nScaleDelta / Math.abs(nScaleDelta), pThis.m_pCanvas2D.clientWidth, pThis.m_pCanvas2D.clientHeight);
                }
            }
            else {
                pStartEvent = e;
            }
        }, false);
        pCavans.addEventListener("touchend", function (e) { nDrag = -1; pStartEvent = null; }, false);
    }
}
MiaokitJS.UTIL = MiaokitJS.UTIL || {};
MiaokitJS.UTIL.App = App;
MiaokitJS.App = new App();
class EntityPicker {
    constructor(pCameraCtrl) {
        this.m_pFirstView = [];
        this.m_pCameraCtrl = null;
        this.m_aStack = [];
        this.m_aSceneStack = [];
        this.m_pCameraCtrl = pCameraCtrl;
    }
    Select() {
        let pObject = MiaokitJS.Miaokit.PickEntity(0xFFFFFFF);
        if (pObject) {
            let nEntity = this.Stack(pObject);
            if (nEntity) {
                if (nEntity !== this.entity) {
                    nEntity.m_pViewState = nEntity.m_pUserData.viewState;
                    if (this.entity) {
                        this.entity.m_pObject3D.highlight = false;
                    }
                    this.m_aStack.push(nEntity);
                    this.entity.m_pObject3D.highlight = true;
                }
                else {
                    if ("Attachment" === nEntity.m_pUserData._type_name) {
                        if (2 === nEntity.m_pUserData.entityType && 202 === nEntity.m_pUserData.secondType) {
                            this.EnterScene(nEntity.m_pUserData.flag);
                            return this.entity;
                        }
                    }
                }
            }
            if (1 === this.m_aStack.length) {
                this.m_pFirstView = this.m_pCameraCtrl.curView;
            }
            return nEntity;
        }
        return null;
    }
    UnSelect() {
        if (0 < this.m_aStack.length) {
            let pLast = this.m_aStack.pop();
            if (pLast) {
                pLast.m_pObject3D.highlight = false;
            }
            if (this.entity) {
                this.entity.m_pObject3D.highlight = true;
            }
            else {
                this.PopScene();
            }
            if (0 === this.m_aStack.length && this.m_pFirstView) {
                this.m_pCameraCtrl.Jump(this.m_pFirstView.m_eCtrlMode, this.m_pFirstView);
                this.m_pFirstView = null;
            }
        }
        else {
            this.PopScene();
        }
        return this.entity;
    }
    Stack(pObject) {
        if (null === this.scene) {
            this.FindScene(pObject);
            if (null === this.scene) {
                return null;
            }
        }
        let pTop = this.entity;
        let pLast = null;
        let pPush = null;
        while (pObject) {
            let pItem = this.CheckStackable(pObject);
            if (pItem) {
                if (pTop && pTop.m_pObject3D === pItem.m_pObject3D) {
                    pPush = pLast || pTop;
                    break;
                }
                else {
                    pLast = pItem;
                }
            }
            pObject = pObject.parent;
        }
        if (!pTop) {
            pPush = pLast;
        }
        return pPush;
    }
    FindScene(pObject) {
        while (pObject) {
            let pItem = this.CheckStackable(pObject);
            if (pItem && "Scene" === pItem.m_pUserData._type_name) {
                this.PushScene(pItem.m_pUserData);
                return;
            }
            pObject = pObject.parent;
        }
    }
    CheckStackable(pObject) {
        let pData = pObject.data;
        if (pData) {
            let bStackable = false;
            if (null == this.scene && null == this.entity) {
                if ("Scene" === pData._type_name) {
                    bStackable = true;
                }
            }
            else {
                if (1 < this.scene.layers.length && ("Layer" === pData._type_name || "Scene" === pData._type_name)) {
                    bStackable = true;
                }
                else if ("Layer" === pData._type_name) {
                    bStackable = true;
                }
                else if ("Attachment" === pData._type_name) {
                    if (0 < pData.entityType && 1 < pData.secondType) {
                        bStackable = true;
                    }
                }
                else if (pData.stackable) {
                    bStackable = true;
                }
            }
            if (bStackable) {
                return {
                    m_pObject3D: pObject,
                    m_pUserData: pData,
                    m_pViewState: null
                };
            }
        }
        return null;
    }
    ClearStack() {
        if (this.entity) {
            this.entity.m_pObject3D.highlight = false;
            this.m_aStack = [];
        }
    }
    EnterScene(nIndex) {
        let pScene = MiaokitJS.Miaokit.GetScene(nIndex);
        if (pScene) {
            this.ClearStack();
            this.PushScene(pScene);
            let pEntity = {
                m_pObject3D: pScene.object3D,
                m_pUserData: pScene,
                m_pViewState: pScene.viewState
            };
            this.m_aStack.push(pEntity);
            this.entity.m_pObject3D.highlight = true;
            console.log("进入场景:", pScene);
        }
    }
    EnterScene2(pScene) {
        if (pScene) {
            this.ClearStack();
            this.PushScene(pScene);
            let pEntity = {
                m_pObject3D: pScene.object3D,
                m_pUserData: pScene,
                m_pViewState: pScene.viewState
            };
            this.m_aStack.push(pEntity);
            this.entity.m_pObject3D.highlight = true;
            console.log("进入场景:", pScene);
        }
    }
    PushScene(pScene) {
        if (1 < this.m_aSceneStack.length) {
            this.scene.object3D.active = false;
        }
        console.log("场景入栈：", pScene.id);
        this.m_aSceneStack.push(pScene);
        this.ActiveScene(pScene);
        let pBinding = pScene.binding;
        if (pBinding) {
            let pBindingObj = pBinding.object3D;
            if (pBindingObj) {
                pBindingObj.active = false;
            }
        }
    }
    PopScene() {
        if (0 < this.m_aSceneStack.length) {
            if (1 < this.m_aSceneStack.length) {
                this.scene.object3D.active = false;
            }
            console.log("场景出栈：", this.scene.id);
            let pScene = this.m_aSceneStack.pop();
            let pBinding = pScene.binding;
            if (pBinding) {
                let pBindingObj = pBinding.object3D;
                if (pBindingObj) {
                    pBindingObj.active = true;
                }
            }
        }
    }
    ActiveScene(pScene) {
        if (pScene.OnSelect) {
            pScene.OnSelect();
        }
        pScene.object3D.active = true;
    }
    get entity() {
        if (0 < this.m_aStack.length) {
            return this.m_aStack[this.m_aStack.length - 1];
        }
        return null;
    }
    get scene() {
        if (0 < this.m_aSceneStack.length) {
            return this.m_aSceneStack[this.m_aSceneStack.length - 1];
        }
        return null;
    }
    get indoor() {
        return 1 < this.m_aSceneStack.length;
    }
}
MiaokitJS.UTIL = MiaokitJS.UTIL || {};
MiaokitJS.UTIL.EntityPicker = EntityPicker;
MiaokitJS.ShaderLab.Pipeline = {
    RenderTarget: [null,
        { ID: 1, Format: "RGBA16_FLOAT" },
        { ID: 2, Format: "RGBA16_FLOAT" },
        { ID: 3, Format: "D24_UNORM" },
        { ID: 4, Format: "RGBA16_FLOAT" },
        { ID: 5, Format: "RGBA16_FLOAT" },
    ],
    Resource: [null,
        { ID: 1, TYPE: "2D", URL: "./data/star.jpg" },
    ],
    Pass: [
        {
            Name: "绘制天空盒",
            Type: "Clear",
            Mask: ["Opaque"],
            RenderTarget: [1, 0],
            ClearTarget: {
                Color: { r: 0.198, g: 0.323, b: 0.561, a: 1.0 },
                Depth: 1.0
            },
        },
        {
            Name: "绘制不透明物体",
            Type: "Render",
            Mask: ["Opaque"],
            RenderTarget: [1, 3],
            ClearTarget: {
                Depth: 1.0
            },
            Depth: {
                Func: "LEQUAL",
                Write: true
            },
            Postprocess: (gl) => {
                if (MiaokitJS.ShaderLab.Pipeline.Picker) {
                    MiaokitJS.ShaderLab.PickObject();
                }
            }
        },
        {
            Name: "绘制半透明物体",
            Type: "Render",
            Mask: ["Transparent"],
            RenderTarget: [1, 3],
            Depth: {
                Func: "LEQUAL",
                Write: false
            },
            Blend: {
                ColorFunc: "FUNC_ADD",
                ColorSrc: "ONE",
                ColorDest: "ONE",
                AlphaFunc: "FUNC_ADD",
                AlphaSrc: "ONE",
                AlphaDest: "ONE"
            }
        },
        {
            Name: "提取物体轮廓",
            Type: "Postprocess",
            Mask: [],
            RenderTarget: [2, 3],
            Shader: "EdgeDetection",
            SetUniforms: function (aAttr, gl) {
                let aTarget = MiaokitJS.ShaderLab.Pipeline.RenderTarget;
                aAttr[8]("u_MainTex", [0, aTarget[1].Handle, 0, 0]);
                aAttr[8]("u_InvTexSize", aTarget[1].Size);
            }
        },
        {
            Name: "提取画面高光部分",
            Type: "Postprocess",
            Mask: [],
            RenderTarget: [4, 0],
            Shader: "HDR",
            SetUniforms: function (aAttr, gl) {
                let aTarget = MiaokitJS.ShaderLab.Pipeline.RenderTarget;
                aAttr[8]("u_MainTex", [0, aTarget[2].Handle, 0, 0]);
                aAttr[8]("u_InvTexSize", aTarget[2].Size);
            }
        },
        {
            Name: "模糊高光",
            Type: "Postprocess",
            Mask: [],
            Shader: "GaussianBlur",
            PingpongCount: 1,
            Pingpong: [
                {
                    RenderTarget: [5, 0],
                    SetUniforms: function (aAttr, gl) {
                        let aTarget = MiaokitJS.ShaderLab.Pipeline.RenderTarget;
                        aAttr[8]("u_MainTex", [0, aTarget[4].Handle, 0, 0]);
                        aAttr[8]("u_InvTexSize", [aTarget[4].Size[0], 0.0, 0.0, 0.0]);
                    }
                },
                {
                    RenderTarget: [4, 0],
                    SetUniforms: function (aAttr, gl) {
                        let aTarget = MiaokitJS.ShaderLab.Pipeline.RenderTarget;
                        aAttr[8]("u_MainTex", [0, aTarget[5].Handle, 0, 0]);
                        aAttr[8]("u_InvTexSize", [0.0, aTarget[5].Size[1], 0.0, 0.0]);
                    }
                }
            ]
        },
        {
            Name: "提交图像",
            Type: "Postprocess",
            Mask: [],
            Shader: "Present",
            SetUniforms: function (aAttr, gl) {
                let aTarget = MiaokitJS.ShaderLab.Pipeline.RenderTarget;
                aAttr[8]("u_MainTex", [0, aTarget[2].Handle, 0, 0]);
                aAttr[8]("u_MinorTex", [0, aTarget[4].Handle, 0, 0]);
                aAttr[8]("u_InvTexSize", aTarget[1].Size);
            }
        }
    ],
    Picker: null,
    InternalShader: [
        "Default", "Wall", "Default", "Default",
        "Default", "Default", "Default", "GIS",
        "Mapbox", "Mapbox2", "Dioramas", "Mapbox2",
        "Cosmos", "Ground", "Sky", "Present"
    ],
};
let PNTT = `
varying vec4 v_Position;
varying vec4 v_Normal;
varying vec4 v_Tangent;
varying vec4 v_UV;

void PNTT()
{
    v_Position.xyz = ObjectToWorldPos(a_Position.xyz);
    v_Normal.xyz = ObjectToWorldNormal(a_Normal.xyz);
    v_Tangent.xyz = ObjectToWorldNormal(a_Tangent.xyz);
    v_UV = vec4(a_UV, 0.0, 0.0);
    
    vec3 mBinormal = normalize(cross(v_Tangent.xyz, v_Normal.xyz));
    v_Position.w = mBinormal.x;
    v_Normal.w = mBinormal.y;
    v_Tangent.w = mBinormal.z;
}
`;
let PNTT_P = `
varying vec4 v_Position;
varying vec4 v_Normal;
varying vec4 v_Tangent;
varying vec4 v_UV;

void PNTT(vec3 mPosition, vec3 mNormal, vec3 mTangent)
{
    v_Position.xyz = ObjectToWorldPos(mPosition.xyz);
    v_Normal.xyz = ObjectToWorldNormal(mNormal.xyz);
    v_Tangent.xyz = ObjectToWorldNormal(mTangent.xyz);
    v_UV = vec4(a_UV, 0.0, 0.0);

    vec3 mBinormal = normalize(cross(v_Tangent.xyz, v_Normal.xyz));
    v_Position.w = mBinormal.x;
    v_Normal.w = mBinormal.y;
    v_Tangent.w = mBinormal.z;
}
`;
let PNT_SPHERE = `
// 左上角经度、左上角纬度、经度跨距、纬度跨距
uniform vec4 u_LngLat;

varying vec4 v_Position;
varying vec4 v_Normal;
varying vec4 v_UV;

vec4 SPHERE(float nTessell)
{
    float nLng = u_LngLat.x + u_LngLat.z * a_Position.x;
    float nLat = u_LngLat.y - u_LngLat.w * a_Position.y;

    float nY = sin(nLat);
    float nX = cos(nLat) * cos(nLng);
    float nZ = cos(nLat) * sin(nLng);

    v_Normal.xyz = vec3(nX, nY, nZ);
    v_Position.xyz = ObjectToWorldPos(v_Normal.xyz);
    v_UV = vec4(a_Position.xy / 64.0, 0.0, 0.0);
    
    v_Normal.w = 0.0;
    v_Position.w = 0.0;
    
    return ObjectToClipPos(v_Normal.xyz);
}
`;
let BRDF = MiaokitJS.ShaderLab.Shader["Common"]["BRDF"] + `
varying vec4 v_Position;
varying vec4 v_Normal;
varying vec4 v_Tangent;
varying vec4 v_UV;

vec3 BRDF_LIGHT()
{
    // 当前切线计算有漏洞，会导致插值出0
    if(0.3 < length(v_Tangent.xyz))
    {
        vec3 _Light = normalize(u_Sunlight.xyz);
        vec3 _ViewDir = normalize(u_EyePos.xyz - v_Position.xyz);
        
        return BRDF(_Light, _ViewDir, v_Normal.xyz, v_Tangent.xyz, vec3(v_Position.w, v_Normal.w, v_Tangent.w)) * 0.4;
    }

    return vec3(0.0, 0.0, 0.0);
}
`;
let BRDF_P = MiaokitJS.ShaderLab.Shader["Common"]["BRDF"] + `
varying vec4 v_Position;
varying vec4 v_Normal;
varying vec4 v_Tangent;
varying vec4 v_UV;

vec3 BRDF_LIGHT(vec3 mTangent, vec3 mBinormal)
{
    vec3 _Light = normalize(u_Sunlight.xyz);
    vec3 _ViewDir = normalize(u_EyePos.xyz - v_Position.xyz);
        
    return BRDF(_Light, _ViewDir, v_Normal.xyz, mTangent, mBinormal) * 0.4;
}
`;
let ATMOS_VS = MiaokitJS.ShaderLab.Shader["Common"]["AtmosphereVS"];
let ATMOS_FS = MiaokitJS.ShaderLab.Shader["Common"]["AtmosphereFS"];
MiaokitJS.ShaderLab.Shader["Default"] = {
    name: "Default",
    type: "Render",
    mark: ["Opaque"],
    vs_src: PNTT + `
vec4 vs()
{
    PNTT();

    return ObjectToClipPos(a_Position.xyz);
}
        `,
    fs_src: BRDF + `
vec4 fs()
{
    vec4 mColor = Tex2D(u_MainTex, v_UV.xy);
    
    mColor.rgb += BRDF_LIGHT();
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Wall"] = {
    name: "Wall",
    type: "Render",
    mark: ["Transparent"],
    vs_src: PNTT + `
vec4 vs()
{
    PNTT();

    return ObjectToClipPos(a_Position.xyz);
}
        `,
    fs_src: BRDF + `
vec4 fs()
{
    vec4 mColor = vec4(0.3, 0.3, 0.3, 1.0);

    mColor.rgb += BRDF_LIGHT();
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Corner"] = {
    name: "Corner",
    type: "Render",
    mark: ["Transparent"],
    vs_src: `
vec4 vs()
{
    return ObjectToClipPos(a_Position.xyz);
}
        `,
    fs_src: `
vec4 fs()
{
    vec4 mColor = vec4(1.98, 3.23, 5.61, 1.0);

    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Mapbox"] = {
    name: "Mapbox",
    type: "Render",
    mark: ["Opaque"],
    vs_src: PNTT_P + ATMOS_VS + `
vec4 vs()
{
    PNTT();
    
    Atmosphere(normalize(u_Sunlight.xyz), v_Position.xyz);
    
    return ObjectToClipPos(a_Position.xyz);
}
        `,
    fs_src: BRDF + ATMOS_FS + `
vec4 fs()
{
    vec4 mColor = vec4(0.6019608, 0.7862745, 0.8254902, 1.0);
    
    mColor.rgb += BRDF_LIGHT();

    mColor = AtmosphereLight(mColor, normalize(u_Sunlight.xyz));
    mColor.a = 1.0;

    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Mapbox2"] = {
    name: "Mapbox2",
    type: "Render",
    mark: ["Opaque"],
    vs_src: PNTT_P + ATMOS_VS + `
vec4 vs()
{
    PNTT();
    
    Atmosphere(normalize(u_Sunlight.xyz), v_Position.xyz);
    
    return ObjectToClipPos(a_Position.xyz);
}
        `,
    fs_src: BRDF + ATMOS_FS + `
vec4 fs()
{
    vec4 mColor = vec4(0.6019608, 0.7862745, 0.8254902, 1.0);
    
    mColor.rgb += BRDF_LIGHT();

    mColor = AtmosphereLight(mColor, normalize(u_Sunlight.xyz));
    mColor.a = 1.0;

    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Dioramas"] = {
    name: "Dioramas",
    type: "Render",
    mark: ["Opaque"],
    vs_src: PNTT_P + ATMOS_VS + `
vec4 vs()
{
    float n = a_Normal.x; 
    float nx = n / 8.0;  n = floor(nx); nx = (nx - n) * 4.0 - 1.0;
    float ny = n / 8.0;  n = floor(ny); ny = (ny - n) * 4.0 - 1.0;
    float nz = (n - 2.0) * 0.5;

    PNTT(a_Position.xyz, vec3(nx, ny, nz), a_Tangent.xyz);
    
    Atmosphere(normalize(u_Sunlight.xyz), v_Position.xyz);

    return ObjectToClipPos(a_Position.xyz);
}
        `,
    fs_src: BRDF + ATMOS_FS + `
vec4 fs()
{
    vec4 mColor = Tex2D(u_MainTex, v_UV.xy);
    
    mColor.rgb += BRDF_LIGHT();
    mColor.rgb = clamp(mColor.rgb, 0.0, 1.0);
    
    mColor = AtmosphereLight(mColor, normalize(u_Sunlight.xyz));
    mColor.a = 1.0;
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["GIS"] = {
    name: "GIS",
    type: "Render",
    mark: ["Opaque"],
    vs_src: MiaokitJS.ShaderLab.Shader["Common"]["AtmosphereVS"] + `
// 左上角经度、左上角纬度、经纬度宽度、经纬度跨距
uniform vec4 u_LngLat;
// 高度图缩放、高度图偏移X、高度图偏移Y、瓦片层级
uniform vec4 u_Tile;
// 地学高度图
uniform sampler2D _HeightTex;

varying vec3 v_Normal;
varying vec2 v_UV;

vec4 CalNormal(float nTexU, float nTexV)
{
	vec4 aUV[5];
	aUV[0] = vec4(nTexU, nTexV, 0.0, 0.0);
	aUV[1] = vec4(nTexU - u_LngLat.w, nTexV, 0.0, 0.0);
	aUV[2] = vec4(nTexU + u_LngLat.w, nTexV, 0.0, 0.0);
	aUV[3] = vec4(nTexU, nTexV - u_LngLat.w, 0.0, 0.0);
	aUV[4] = vec4(nTexU, nTexV + u_LngLat.w, 0.0, 0.0);
    
	float aHeight[5];
	aHeight[0] = 0.0; aHeight[1] = 0.0; aHeight[2] = 0.0; aHeight[3] = 0.0; aHeight[4] = 0.0;
    
	for (int i = 0; i < 5; i++)
	{
		aUV[i].xy /= u_LngLat.z;
		aUV[i].x = aUV[i].x * u_Tile.x + u_Tile.y;
		aUV[i].y = aUV[i].y * u_Tile.x + u_Tile.z;
        
		vec4 mHeight = texture2D(_HeightTex, aUV[i].xy);
		float nHeight = ((mHeight.r * 256.0 * 256.0 * 256.0) + (mHeight.g * 256.0 * 256.0) + (mHeight.b * 256.0)) * 0.001;
        
		aHeight[i] = nHeight;
	}
    
	float nLng = (u_LngLat.x + nTexU) / 131072.0 * 3.141592654;
	float nLat = (u_LngLat.y - nTexV) / 131072.0 * 3.141592654;
    
	vec3 mNormal = vec3(0.0, 0.0, 0.0);
	vec3 mBinormal = vec3(0.0, 0.0, 0.0);
	vec3 mTangent = vec3(0.0, 0.0, 0.0);
    
	mNormal.y = sin(nLat);
	mNormal.x = cos(nLat) * cos(nLng);
	mNormal.z = cos(nLat) * sin(nLng);
    
	mBinormal.y = sin(nLat);
	mBinormal.x = cos(nLat) * cos(nLng + 1.57079633);
	mBinormal.z = cos(nLat) * sin(nLng + 1.57079633);
    
	mTangent.y = sin(nLat + 1.57079633);
	mTangent.x = cos(nLat + 1.57079633) * cos(nLng);
	mTangent.z = cos(nLat + 1.57079633) * sin(nLng);
    
	float nScale = 1.0 / ((u_LngLat.w / 131072.0 *  3.141592654) * 6378137.0);
    nScale *= 2.0;
	mNormal += mBinormal * (aHeight[1] - aHeight[2]) * nScale + mTangent * (-aHeight[3] + aHeight[4]) * nScale;
	normalize(mNormal);
    
	return vec4(mNormal, aHeight[0]);
}

vec4 vs()
{
    float nTexU = u_LngLat.w * a_Position.x;
	float nTexV = u_LngLat.w * a_Position.y;
    
	float nLng = (u_LngLat.x + nTexU) / 131072.0 * 3.141592654;
	float nLat = (u_LngLat.y - nTexV) / 131072.0 * 3.141592654;
    
	float nVertexY = sin(nLat);
	float nVertexX = cos(nLat) * cos(nLng);
	float nVertexZ = cos(nLat) * sin(nLng);
    
	vec4 mNormal = vec4(0.0, 0.0, 0.0, 0.0);
	if (8.0 < u_Tile.w)
	{
		mNormal = CalNormal(nTexU, nTexV);
		mNormal.w -= 1000.0;
	}
	else
	{
		mNormal = vec4(nVertexX, nVertexY, nVertexZ, 0.0);
	}
    
    nTexU /= u_LngLat.z;
	nTexV /= u_LngLat.z;
	/*网格从左上角开始，影响贴图从左下角开始*/
	nTexV = 1.0 - nTexV;
    
    v_UV = vec2(nTexU, nTexV);
    v_Normal = ObjectToWorldNormal(mNormal.xyz);
    
    vec3 mPos = vec3(nVertexX, nVertexY, nVertexZ) * (6378137.0 + (mNormal.w));
    vec3 mLightDir = normalize(u_Sunlight.xyz);
    Atmosphere(mLightDir, ObjectToWorldPos(mPos));
    
	return ObjectToClipPos(mPos);
}
        `,
    fs_src: MiaokitJS.ShaderLab.Shader["Common"]["BRDF"] + MiaokitJS.ShaderLab.Shader["Common"]["AtmosphereFS"] + `
varying vec3 v_Normal;
varying vec2 v_UV;

vec4 fs()
{
    vec4 mColor = Tex2D(u_MainTex, v_UV);
    
    vec3 _ViewDir = normalize(v_ViewDir.xyz);
    vec3 _Light = normalize(u_Sunlight.xyz);
    mColor.rgb += BRDF(_Light, _ViewDir, v_Normal, vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0)) * 0.4;
    
    mColor = AtmosphereLight(mColor, normalize(u_Sunlight.xyz));
    mColor.a = 1.0;
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Cosmos"] = {
    name: "Cosmos",
    type: "Clear",
    mark: ["Opaque"],
    uniform_values: [["u_MainTex", 1]],
    vs_src: PNT_SPHERE + `
vec4 vs()
{
    return SPHERE(64.0);
}
        `,
    fs_src: `
varying vec4 v_UV;

vec4 fs()
{
    vec4 mColor = Tex2D(u_MainTex, v_UV.xy);
    mColor.a = 1.0;
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Sky"] = {
    name: "Sky",
    type: "Clear",
    mark: ["Opaque"],
    vs_src: PNT_SPHERE + ATMOS_VS + `
vec4 vs()
{
    vec4 mClip = SPHERE(64.0);

    Atmosphere(normalize(u_Sunlight.xyz), v_Position.xyz);
    
    return mClip;
}
        `,
    fs_src: ATMOS_FS + `
vec4 fs()
{
    return AtmosphereColor(vec4(1.0, 1.0, 1.0, 1.0), normalize(u_Sunlight.xyz));
}
        `
};
MiaokitJS.ShaderLab.Shader["Ground"] = {
    name: "Ground",
    type: "Clear",
    mark: ["Opaque"],
    vs_src: PNT_SPHERE + ATMOS_VS + `
vec4 vs()
{
    vec4 mClip = SPHERE(64.0);

    Atmosphere(normalize(u_Sunlight.xyz), v_Position.xyz);
    
    return mClip;
}
        `,
    fs_src: BRDF_P + ATMOS_FS + `
vec4 fs()
{
    vec4 mColor = vec4(0.1019608, 0.2862745, 0.3254902, 1.0);
    
    mColor.rgb += BRDF_LIGHT(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0));

    mColor = AtmosphereLight(mColor, normalize(u_Sunlight.xyz));
    mColor.a = 1.0;
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["EdgeDetection"] = {
    name: "EdgeDetection",
    type: "Postprocess",
    mark: ["Opaque"],
    vs_src: `
varying vec2 v_UV;

vec4 vs()
{
    v_UV = a_UV;

    return vec4(a_Position, 1.0);
}
        `,
    fs_src: `
uniform vec4 u_InvTexSize;
varying vec2 v_UV;

#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#define FXAA_SPAN_MAX     8.0

vec4 fs()
{
    vec4 _OffsetUV = vec4(-1.0, 1.0, 1.0, 1.0) * vec4(u_InvTexSize.xy, u_InvTexSize.xy);
    
    /// 采样中心及周边斜角4个点的颜色================================
    vec4 _Color0 = Tex2D(u_MainTex, v_UV);
    vec4 _Color1 = Tex2D(u_MainTex, v_UV + _OffsetUV.xy); // NW
    vec4 _Color2 = Tex2D(u_MainTex, v_UV - _OffsetUV.xy); // SE
    vec4 _Color3 = Tex2D(u_MainTex, v_UV + _OffsetUV.zw); // NE
    vec4 _Color4 = Tex2D(u_MainTex, v_UV - _OffsetUV.zw); // SW
    
    /// 获取中心及周边斜角4个点的颜色混合次数========================
    float _Count0 = ceil(_Color0.a);
    float _Count1 = ceil(_Color1.a);
    float _Count2 = ceil(_Color2.a);
    float _Count3 = ceil(_Color3.a);
    float _Count4 = ceil(_Color4.a);
    
    /// 计算中心及周边斜角4个点的颜色灰度============================
    vec3 _Luma = vec3(0.299, 0.587, 0.114);
    
    float _LumaM  = dot(_Color0.rgb / _Count0, _Luma);
    float _LumaNW = dot(_Color1.rgb / _Count1, _Luma);
    float _LumaNE = dot(_Color3.rgb / _Count3, _Luma);
    float _LumaSW = dot(_Color4.rgb / _Count4, _Luma);
    float _LumaSE = dot(_Color2.rgb / _Count2, _Luma);
    
    float _LumaMin = min(_LumaM, min(min(_LumaNW, _LumaNE), min(_LumaSW, _LumaSE)));
    float _LumaMax = max(_LumaM, max(max(_LumaNW, _LumaNE), max(_LumaSW, _LumaSE)));
    
    ///计算选中对象轮廓==============================================
    _Count1 = ceil(_Count1 - _Color1.a);
    _Count2 = ceil(_Count2 - _Color2.a);
    _Count3 = ceil(_Count3 - _Color3.a);
    _Count4 = ceil(_Count4 - _Color4.a);

    float _Diff1 = (_Count1 - _Count2) * 0.5;
	float _Diff2 = (_Count3 - _Count4) * 0.5;
	float _Diff = length(vec2(_Diff1, _Diff2));
    
    ///FXAA处理======================================================
    vec2 _Dir = vec2(-((_LumaNW + _LumaNE) - (_LumaSW + _LumaSE)), ((_LumaNW + _LumaSW) - (_LumaNE + _LumaSE)));

    float _DirReduce = max((_LumaNW + _LumaNE + _LumaSW + _LumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
    float _RcpDirMin = 1.0 / (min(abs(_Dir.x), abs(_Dir.y)) + _DirReduce);

    _Dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), _Dir * _RcpDirMin)) * u_InvTexSize.xy;

    vec4 _Blend0 = Tex2D(u_MainTex, v_UV + _Dir * (1.0 / 3.0 - 0.5));
    vec4 _Blend1 = Tex2D(u_MainTex, v_UV + _Dir * (2.0 / 3.0 - 0.5));
    vec4 _Blend2 = Tex2D(u_MainTex, v_UV + _Dir * -0.5);
    vec4 _Blend3 = Tex2D(u_MainTex, v_UV + _Dir *  0.5);

    vec3 _ColorA = vec3(0.0, 0.0, 0.0);
    _ColorA += _Blend0.rgb / _Blend0.a;
    _ColorA += _Blend1.rgb / _Blend1.a;
    _ColorA *= 0.5;

    vec3 _ColorB = vec3(0.0, 0.0, 0.0);
    _ColorB += _Blend2.rgb / _Blend2.a;
    _ColorB += _Blend3.rgb / _Blend3.a;
    _ColorB *= 0.25;
    _ColorB += 0.5 * _ColorA;

    float _LumaB = dot(_ColorB, _Luma);
    if ((_LumaB < _LumaMin) || (_LumaB > _LumaMax))
    {
        _Color0.rgb = _ColorA;
    }
    else
    {
        _Color0.rgb = _ColorB;
    }
    ///计算素描线条==================================================
    _Color0.a = _LumaM / (_LumaMax - _LumaMin);
    ///叠加选中对象轮廓==============================================
    _Color0.rgb += vec3(5.0, 0.7, 0.0) * _Diff;
    
    return _Color0;
}
        `
};
MiaokitJS.ShaderLab.Shader["HDR"] = {
    name: "HDR",
    type: "Postprocess",
    mark: ["Opaque"],
    vs_src: `
varying vec2 v_UV;

vec4 vs()
{
    v_UV = a_UV;

    return vec4(a_Position, 1.0);
}
        `,
    fs_src: `
uniform vec4 u_InvTexSize;
varying vec2 v_UV;

vec4 fs()
{
    vec4 mColor = Tex2D(u_MainTex, v_UV);
    
    mColor.r = 1.0 < mColor.r ? mColor.r - 1.0: 0.0;
    mColor.g = 1.0 < mColor.g ? mColor.g - 1.0: 0.0;
    mColor.b = 1.0 < mColor.b ? mColor.b - 1.0: 0.0;
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["GaussianBlur"] = {
    name: "GaussianBlur",
    type: "Postprocess",
    mark: ["Opaque"],
    vs_src: `
varying vec2 v_UV;

vec4 vs()
{
    v_UV = a_UV;

    return vec4(a_Position, 1.0);
}
        `,
    fs_src: `
uniform vec4 u_InvTexSize;
varying vec2 v_UV;

vec4 fs()
{
    vec4 mColor = vec4(0.0, 0.0, 0.0, 0.0);
    
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 15.0) * 0.004094;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 14.0) * 0.006254;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 13.0) * 0.008415;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 12.0) * 0.010576;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 11.0) * 0.015011;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 10.0) * 0.019447;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 9.0) * 0.023882;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 8.0) * 0.029568;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 7.0) * 0.035255;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 6.0) * 0.040941;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 5.0) * 0.046286;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 4.0) * 0.051632;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 3.0) * 0.056977;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 2.0) * 0.059024;
    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 1.0) * 0.061071;

    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 15.0) * 0.004094;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 14.0) * 0.006254;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 13.0) * 0.008415;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 12.0) * 0.010576;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 11.0) * 0.015011;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 10.0) * 0.019447;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 9.0) * 0.023882;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 8.0) * 0.029568;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 7.0) * 0.035255;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 6.0) * 0.040941;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 5.0) * 0.046286;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 4.0) * 0.051632;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 3.0) * 0.056977;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 2.0) * 0.059024;
    mColor += Tex2D(u_MainTex, v_UV + u_InvTexSize.xy * 1.0) * 0.061071;

    mColor += Tex2D(u_MainTex, v_UV - u_InvTexSize.xy * 1.0) * 0.063119;
    
    return mColor;
}
        `
};
MiaokitJS.ShaderLab.Shader["Present"] = {
    name: "Present",
    type: "Postprocess",
    mark: ["Opaque"],
    vs_src: `
varying vec2 v_UV;

vec4 vs()
{
    v_UV = a_UV;

    return vec4(a_Position, 1.0);
}
        `,
    fs_src: `
uniform sampler2D u_MinorTex;
uniform vec4 u_InvTexSize;
varying vec2 v_UV;

vec4 fs()
{
    vec4 mColor = Tex2D(u_MainTex, v_UV);
    mColor += Tex2D(u_MinorTex, v_UV);
    
    return mColor;
}
        `
};
