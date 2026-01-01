/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * Licensed under the Apache License 2.0
 * 
 * https://github.com/YDITS/SSC-Web
 * 
 */

import { P2pquakeItem } from "./data/p2pquake-data.js";

/**
 * P2P地震情報 API クライアント
 */
export class P2pquake {
    /**
     * API エンドポイント
     */
    static API_ENDPOINT = 'https://api.p2pquake.net/v2/history?codes=551&limit=1';

    /**
     * @param {{
     *     onGotNewEarthquakeInformation: async ({ data: P2pquakeItem[] }) => Promise<any>,
     * }}
     */
    constructor({
        onGotNewEarthquakeInformation = async ({ data }) => { },
    }) {
        if (typeof onGotNewEarthquakeInformation !== "function") {
            throw new Error("`onGotNewEarthquakeInformation` が `function` コールバック関数ではありません");
        }

        this.#onGotNewEarthquakeInformationCallback = onGotNewEarthquakeInformation;
    }

    /**
     * 新しい地震情報を取得します
     * 
     * @returns {Promise<void>}
     */
    async getEarthquakeInfo() {
        let url;

        if (P2pquake.debugMode === true) {
            url = P2pquake.API_ENDPOINT + "&offset=" + new Date().getSeconds();
        } else {
            url = P2pquake.API_ENDPOINT;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (this.lastId === data[0].id) {
            this.lastId = data[0].id;
            return;
        }

        this.lastId = data[0].id;

        /**
         * @type {P2pquakeItem[]}
         */
        let formattedData = [];

        data.forEach(item => {
            formattedData.push(new P2pquakeItem({
                type: item.issue.type,
                publishedTime: item.issue.time,
                occurredTime: item.earthquake.time,
                hypoName: item.earthquake.hypocenter.name,
                scale: item.earthquake.maxScale,
                magnitude: item.earthquake.hypocenter.magnitude,
                depth: item.earthquake.hypocenter.depth,
                domesticTsunami: item.earthquake.domesticTsunami,
                hypoLat: item.earthquake.hypocenter.latitude,
                hypoLng: item.earthquake.hypocenter.longitude,
                points: item.points,
            }));
        });

        this.#latestData = formattedData;

        try {
            await this.#onGotNewEarthquakeInformationCallback({ data: formattedData });
        } catch (error) {
            console.error('コールバックの実行中にエラーが発生しました', error);
        }
    }

    /**
     * 最新の地震情報
     * 
     * @type {P2pquakeItem[]}
     */
    get latestData() {
        return this.#latestData;
    }

    /**
     * 新しい地震情報を取得したときのコールバック関数
     * 
     * @type {async ({ data: P2pquakeItem[] }) => Promise<any>}
     */
    #onGotNewEarthquakeInformationCallback;

    /**
     * 最新の地震情報
     * 
     * @type {P2pquakeItem[]}
     */
    #latestData;

    static debugMode = false;
}
