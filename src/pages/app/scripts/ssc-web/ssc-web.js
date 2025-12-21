/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { Version } from "https://cdn.yoneyo.com/scripts/version@1.0.0/version.js";
import { Render } from "https://cdn.yoneyo.com/scripts/render@1.0.0/render.js";

import { ElementsManager } from "../modules/elements-manager/elements-manager.js";
import { Map } from "../modules/maps/map.js";
import { MapApiKey } from "../modules/maps/types/api-key.js";
import { P2pquake } from "../modules/p2pquake/p2pquake.js";
import { P2pquakeItem, P2pquakePoint } from "../modules/p2pquake/data/p2pquake-data.js";
import { Icons } from "../modules/icons/icons.js";
import { AddressSearch } from "../modules/address-search/address-search.js";

/**
 * SSC for Web
 */
export class SSCWeb {
    /**
     * バージョン
     * 
     * @type {Version}
     */
    static VERSION = new Version(1, 1, 0, Version.levels.stable);

    /**
     * アプリケーション名
     */
    static NAME = "SSC for Web";

    /**
     * 短縮アプリケーション名
     */
    static SHORT_NAME = "SSC-Web";

    /**
     * アプリケーション説明
     */
    static DESCRIPTION = "Saitama Sora Cam が提供する防災情報Webアプリケーション。";

    /**
     * デフォルトの情報取得間隔 (ミリ秒)
     */
    static DEFAULT_FETCH_INTERVAL_MS = 10000;

    /**
     * 震度表示の種類
     * 0: 各都道府県
     * 1: すべての観測点
     * 2以上: すべての観測点のうち読み飛ばす間隔 (大規模な地震の場合、大きい値ほど軽量になる)
     * 
     * @returns {number}
     */
    static MAP_TYPE = 1;

    /**
     * @param {{
     *     mapApiKey: MapApiKey | null,
     *     fetchIntervalMs?: number,
     *     debugMode?: boolean,
     * }} param0 
     */
    constructor({
        mapApiKey,
        fetchIntervalMs = SSCWeb.DEFAULT_FETCH_INTERVAL_MS,
        debugMode = false,
    }) {
        if (!(mapApiKey instanceof MapApiKey) && mapApiKey !== null) {
            throw new Error("`mapApiKey` が `MapApiKey` クラスのインスタンス または null ではありません");
        }

        if (typeof fetchIntervalMs !== "number" || fetchIntervalMs < 1000) {
            throw new Error("`fetchIntervalMs` で 1000 未満のnumberが指定されました");
        }

        this.#mapApiKey = mapApiKey;
        this.#fetchIntervalMs = fetchIntervalMs;
        this.#debugMode = debugMode;
    }

    /**
     * アプリを実行します
     * 
     * @returns {Promise<void>}
     */
    async run() {
        this.#loadElements();

        if (this.#debugMode === true) {
            this.#enableDebugMode();
        }

        document.getElementById("menu-version").textContent = `Vers ${SSCWeb.VERSION.string}`;
        document.getElementById("expandInformationDetailsButton").addEventListener("click", () => this.#onClickInformationDetailsButton());
        const modals = document.getElementById("modals");

        const hideAllModals = () => {
            for (const modal of document.getElementsByClassName("modal")) {
                if (modal) {
                    modal.classList.remove("enabled");
                } else {
                    console.error(`モーダルの非表示に失敗しました: id="${targetId}" の要素が見つかりません`);
                }
            }
            modals.classList.remove("enabled");
        }

        modals.addEventListener("touchstart", event => {
            if (event.target !== modals) {
                return;
            }
            hideAllModals();
        });

        modals.addEventListener("click", event => {
            if (event.target !== modals) {
                return;
            }
            hideAllModals();
        });

        for (const button of document.getElementsByClassName("modal-button")) {
            button.addEventListener("click", event => {
                const targetId = button.dataset.target;
                const modal = document.getElementById(targetId);

                if (modal) {
                    modal.classList.add("enabled");
                    modals.classList.add("enabled");
                } else {
                    console.error(`モーダルの表示に失敗しました: id="${targetId}" の要素が見つかりません`);
                }
            });
        }

        for (const button of document.getElementsByClassName("modal__close-button")) {
            button.addEventListener("click", event => {
                const targetId = button.dataset.target;
                const modal = document.getElementById(targetId);

                if (modal) {
                    modal.classList.remove("enabled");
                    modals.classList.remove("enabled");
                } else {
                    console.error(`モーダルの非表示に失敗しました: id="${targetId}" の要素が見つかりません`);
                }
            });
        }

        const savedIconType = localStorage.getItem("ssc-web-icon-type");
        this.iconType = savedIconType || "ssc-v2";
        const scaleIconsSettingsPreviewRoot = document.getElementById("scale-icon-settings-preview-root");

        this.render = new Render();

        const icons = (type, scale) => {
            const { $img } = this.render;

            const iconUrl = (
                // 設定されたアイコン
                Icons.INT_ICONS?.[type]?.[String(scale)] ||

                // 設定値が不正のとき
                Icons.INT_ICONS?.["ssc-v2"]?.[String(scale)] ||

                // point.scale が不正のとき
                Icons.INT_ICONS?.["ssc-v2"]?.["-1"]
            );

            return $img({
                src: iconUrl,
                alt: `震度アイコン (${scale})`,
                width: 32,
                height: 32,
            });
        };

        const renderingScaleIconsPreview = () => {
            this.render.build({
                target: scaleIconsSettingsPreviewRoot,
                children: [
                    icons(this.iconType, "hypocenter"),
                    icons(this.iconType, "-1"),
                    icons(this.iconType, "10"),
                    icons(this.iconType, "20"),
                    icons(this.iconType, "30"),
                    icons(this.iconType, "40"),
                    icons(this.iconType, "45"),
                    icons(this.iconType, "50"),
                    icons(this.iconType, "55"),
                    icons(this.iconType, "60"),
                    icons(this.iconType, "70"),
                ],
            });
        };

        renderingScaleIconsPreview();

        this.elementsManager.getFromCache("#scale-icon-settings-select").addEventListener("change", event => {
            this.iconType = event.target.value;
            localStorage.setItem("ssc-web-icon-type", this.iconType);
            renderingScaleIconsPreview();
            this.#onGotNewEarthquakeInformation({ data: this.latestP2pquakeData });
        });

        this.p2pquake = new P2pquake({
            onGotNewEarthquakeInformation: async ({ data }) => await this.#onGotNewEarthquakeInformation({ data }),
        });

        await this.#initializeMap();
        await this.p2pquake.getEarthquakeInfo();

        setInterval(async () => await this.mainloop(), this.#fetchIntervalMs);
    }

    /**
     * メインループ
     * 
     * @returns {Promise<void>}
     */
    async mainloop() {
        await this.p2pquake.getEarthquakeInfo();
    }

    /**
     * マップのAPIキー
     * 
     * @type {MapApiKey}
     */
    #mapApiKey;

    /**
     * 情報取得間隔 (ミリ秒)
     * 
     * @type {number}
     */
    #fetchIntervalMs;

    /**
     * デバッグモードフラグ
     * 
     * @type {boolean}
     */
    #debugMode

    /**
     * HTML要素を読み込みます
     * 
     * @returns {void}
     */
    #loadElements() {
        this.elementsManager = new ElementsManager();
        this.elementsManager.getFromCache('#publishedTimeDisplay');
        this.elementsManager.getFromCache('#informationTitleDisplay');
        this.elementsManager.getFromCache('#occurredTimeDisplay');
        this.elementsManager.getFromCache('#hypocenterDisplay');
        this.elementsManager.getFromCache('#maxIntDisplay');
        this.elementsManager.getFromCache('#magnitudeDisplay');
        this.elementsManager.getFromCache('#depthDisplay');
        this.elementsManager.getFromCache('#tsunamiDisplay');
    }

    /**
     * @returns {void}
     */
    #onClickInformationDetailsButton() {
        this.elementsManager.getFromCache("#informationDetails").classList.toggle("enabled");
        this.elementsManager.getFromCache("#expandInformationDetails").classList.toggle("enabled");
    }

    #enableDebugMode() {
        P2pquake.debugMode = true;

        document.getElementById("debugModeMarker").classList.add("enabled");

        setTimeout(() => {
            document.getElementById("debugModeMarker").classList.add("highlight");
            setTimeout(() => {
                document.getElementById("debugModeMarker").classList.remove("highlight");
            }, 2000);
        }, 1000);

        console.debug("⚠️: デバッグモードが有効です。");
    }

    /**
     * @param {Map} map
     * @returns {Promise<void>}
     */
    async #initializeMap(map) {
        if (this.#mapApiKey instanceof MapApiKey) {
            this.map = new Map({
                apiKey: this.#mapApiKey,
            });

            await this.map.initialize();
        }
    }

    /**
     * 新しい地震情報を取得したときの処理
     * 
     * @param {{
     *     data: P2pquakeItem[],
     * }}
     * @returns {Promise<void>}
     */
    async #onGotNewEarthquakeInformation({ data }) {
        this.latestP2pquakeData = data;

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("`data` が配列ではないか、空の配列です");
        }

        const latestData = data[0];

        try {
            this.elementsManager.getFromCache('#publishedTimeDisplay').innerText = latestData.publishedTime;
            this.elementsManager.getFromCache('#informationTitleDisplay').innerText = latestData.typeText;
            this.elementsManager.getFromCache('#occurredTimeDisplay').innerText = latestData.occurredTime;
            this.elementsManager.getFromCache('#hypocenterDisplay').innerText = latestData.hypocenter.name;
            this.elementsManager.getFromCache('#maxIntDisplay').innerText = latestData.scaleText;
            this.elementsManager.getFromCache('#magnitudeDisplay').innerText = latestData.magnitudeText;
            this.elementsManager.getFromCache('#depthDisplay').innerText = latestData.depthText;
            this.elementsManager.getFromCache('#tsunamiDisplay').innerText = latestData.tsunamiText;
        } catch (error) {
            console.error(error);
        }

        const lat = latestData?.hypocenter?.lat;
        const lng = latestData?.hypocenter?.lng;
        this.map.bounds = L.latLngBounds();

        try {
            this.map.removeAllLayers();
        } catch (error) {
            throw new Error("新しい地震情報のマップ更新中にエラーが発生しました");
        }

        try {
            data = data[0].points;
            let points = [];
            let flag = 0;
            let prefFlag = [];

            data.forEach(async point => {
                if (SSCWeb.MAP_TYPE >= 2) {
                    if (flag == 40) {
                        flag = 0;
                    } else if (flag >= 1) {
                        flag++;
                        return;
                    }

                    flag++;
                } else if (SSCWeb.MAP_TYPE == 0) {
                    if (prefFlag.includes(point.pref)) {
                        return;
                    }
                    console.debug(prefFlag);
                    prefFlag.push(point.pref);
                }

                let latLng = await AddressSearch.getLatLng(point.pref + point.addr);

                let iconUrl = (
                    // 設定されたアイコン
                    Icons.INT_ICONS?.[this.iconType]?.[String(point.scale)] ||

                    // 設定値が不正のとき
                    Icons.INT_ICONS?.["ssc-v2"]?.[String(point.scale)] ||

                    // point.scale が不正のとき
                    Icons.INT_ICONS?.["ssc-v2"]?.["-1"]
                );

                this.map.newPoint(latLng.lat, latLng.lng, iconUrl, point.scale * 10);

                points.push(new P2pquakePoint({
                    "addr": point.addr,
                    "isArea": point.isArea,
                    "pref": point.pref,
                    "scale": point.scale,
                    "latitude": latLng.lat,
                    "longitude": latLng.lng,
                }));

                this.map.bounds.extend(L.latLng(latLng.lat, latLng.lng));
            });
        } catch (error) {
            console.error(error);
        }

        try {
            if (latestData.type !== "ScalePrompt") {
                setTimeout(() => this.map.setHypocenter(lat, lng), 1000);
                const hypocenterLatLng = L.latLng(lat, lng);
                this.map.bounds.extend(hypocenterLatLng);
            }
            setTimeout(() => {
                this.map.fitMap(this.map.bounds);
            }, 2000);
            setTimeout(() => {
                this.map.fitMap(this.map.bounds);
            }, 8000);
        } catch (error) {
            console.error(error);
        }
    }
}
