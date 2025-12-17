/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { Version } from "https://cdn.yoneyo.com/scripts/version@1.0.0/version.js";

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
    static VERSION = new Version(1, 0, 0, Version.levels.stable);

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
     *     mapApiKey: MapApiKey,
     *     fetchIntervalMs: number,
     * }} param0 
     */
    constructor({
        mapApiKey,
        fetchIntervalMs = SSCWeb.DEFAULT_FETCH_INTERVAL_MS,
    }) {
        if (!(mapApiKey instanceof MapApiKey)) {
            throw new Error("`mapApiKey` が `MapApiKey` クラスのインスタンスではありません");
        }

        if (typeof fetchIntervalMs !== "number" || fetchIntervalMs < 1000) {
            throw new Error("`fetchIntervalMs` で 1000 未満のnumberが指定されました");
        }

        this.#mapApiKey = mapApiKey;
        this.#fetchIntervalMs = fetchIntervalMs;
    }

    /**
     * アプリを実行します
     * 
     * @returns {Promise<void>}
     */
    async run() {
        this.#loadElements();

        this.map = new Map({
            apiKey: this.#mapApiKey,
        });

        if (new URL(window.location.href).searchParams.get("debug") === "enable") {
            P2pquake.debugMode = true;
            console.debug("⚠️: デバッグモードが有効です。");
            document.getElementById("debugModeMarker").classList.add("enabled");

            setTimeout(() => {
                document.getElementById("debugModeMarker").classList.add("highlight");
                setTimeout(() => {
                    document.getElementById("debugModeMarker").classList.remove("highlight");
                }, 2000)
            }, 1000)
        }

        this.p2pquake = new P2pquake({
            onGotNewEarthquakeInformation: async ({ data }) => await this.#onGotNewEarthquakeInformation({ data }),
        });

        await this.map.initialize();
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
     * 新しい地震情報を取得したときの処理
     * 
     * @param {{
     *     data: P2pquakeItem[],
     * }}
     * @returns {Promise<void>}
     */
    async #onGotNewEarthquakeInformation({ data }) {
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
                let iconUrl = Icons.INT_ICONS[String(point.scale)] || Icons.INT_ICONS["-1"];

                this.map.newPoint(latLng.lat, latLng.lng, iconUrl);

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
