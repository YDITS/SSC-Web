/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { P2pquakeItem } from "./data/p2pquake-data.js";

export class P2pquake {
    /**
     * @param {{
     *     onGotNewEarthquakeInformation: ({ data: P2pquakeItem[] }) => any,
     * }}
     */
    constructor({
        onGotNewEarthquakeInformation = ({ data }) => { },
    }) {
        if (typeof onGotNewEarthquakeInformation !== "function") {
            throw new Error("`onGotNewEarthquakeInformation` must be a function.");
        }

        this.#onGotNewEarthquakeInformationCallback = onGotNewEarthquakeInformation;
    }

    /**
     * 震度表示の種類
     * 0: 各都道府県
     * 1: すべての観測点
     * 2以上: すべての観測点のうち読み飛ばす間隔 (大規模な地震の場合、大きい値ほど軽量になる)
     */
    get mapType() {
        return (1);
    }

    get apiEndpoint() {
        return ('https://api.p2pquake.net/v2/history?codes=551&limit=1');
    }

    async getEarthquakeInfo() {
        const response = await fetch(this.apiEndpoint);
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
            this.#onGotNewEarthquakeInformationCallback({ data: formattedData });
        } catch (error) {
            console.error('コールバックの実行中にエラーが発生しました:', error);
        }
    }

    /**
     * @type {({ data: P2pquakeItem[] }) => any}
     */
    #onGotNewEarthquakeInformationCallback;

    /**
     * @type {P2pquakeItem[]}
     */
    #latestData;
}
