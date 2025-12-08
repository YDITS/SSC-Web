/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { Version } from "https://cdn.yoneyo.com/scripts/version@1.0.0/version.js";

import { Map } from "../packages/maps/map.js";
import { MapApiKey } from "../packages/maps/types/api-key.js";
import { P2pquake } from "../packages/p2pquake/p2pquake.js";
import { P2pquakeItem, P2pquakePoint } from "../packages/p2pquake/data/p2pquake-data.js";

export class SSCWeb {
    static VERSION = new Version(1, 0, 0, Version.levels.dev);

    static NAME = "SSC for Web";
    static SHORT_NAME = "SSC-Web";
    static DESCRIPTION = "Saitama Sora Cam が提供する防災情報Webアプリケーション。";

    static DEFAULT_FETCH_INTERVAL_MS = 10000;

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
            throw new Error("`mapApiKey` must be an instance of MapApiKey.");
        }

        if (typeof fetchIntervalMs !== "number" || fetchIntervalMs < 1000) {
            throw new Error("`fetchIntervalMs` must be a number greater than or equal to 1000.");
        }

        this.#mapApiKey = mapApiKey;
        this.#fetchIntervalMs = fetchIntervalMs;
    }

    /**
     * @returns {Promise<void>}
     */
    async run() {
        this.map = new Map({
            apiKey: this.#mapApiKey,
        });

        this.p2pquake = new P2pquake({
            onGotNewEarthquakeInformation: ({ data }) => this.#onGotNewEarthquakeInformation({ data }),
        });

        await this.map.initialize();
        await this.p2pquake.getEarthquakeInfo();

        setInterval(async () => await this.mainloop(), this.#fetchIntervalMs);
    }

    /**
     * @returns {Promise<void>}
     */
    async mainloop() {
        await this.p2pquake.getEarthquakeInfo();
    }

    #mapApiKey;
    #fetchIntervalMs;

    /**
     * @param {{
     *     data: P2pquakeItem[],
     * }}
     */
    #onGotNewEarthquakeInformation({ data }) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("`data` must be a non-empty array of P2pquakeItem.");
        }

        const latestData = data[0];

        try {
            let $publishedTimeDisplay = document.getElementById('publishedTimeDisplay');
            let $infoTypeDisplay = document.getElementById('informationTitleDisplay');
            let $occurredTimeDisplay = document.getElementById('occurredTimeDisplay');
            let $hypocenterDisplay = document.getElementById('hypocenterDisplay');
            let $maxIntDisplay = document.getElementById('maxIntDisplay');
            let $magnitudeDisplay = document.getElementById('magnitudeDisplay');
            let $depthDisplay = document.getElementById('depthDisplay');
            let $tsunamiDisplay = document.getElementById('tsunamiDisplay');

            $publishedTimeDisplay.innerText = latestData.publishedTime;
            $infoTypeDisplay.innerText = latestData.typeText;
            $occurredTimeDisplay.innerText = latestData.occurredTime;
            $hypocenterDisplay.innerText = latestData.hypocenter.name;
            $maxIntDisplay.innerText = latestData.scaleText;
            $magnitudeDisplay.innerText = latestData.magnitudeText;
            $depthDisplay.innerText = latestData.depthText;
            $tsunamiDisplay.innerText = latestData.tsunamiText;
        } catch (error) {
            console.error(error);
        }

        const lat = latestData?.hypocenter?.lat;
        const lng = latestData?.hypocenter?.lng;

        if (typeof lat !== "number" || typeof lng !== "number") {
            throw new Error("Hypocenter latitude and longitude must be numbers.");
        }

        try {
            this.map.removeAllLayers();
            this.map.fitMap(lat, lng);
            this.map.setHypocenter(lat, lng);
        } catch (error) {
            throw new Error("Failed to update map with new earthquake information.");
        }

        try {
            data = data[0].points;
            let points = [];
            let flag = 0;
            let prefFlag = [];

            data.forEach(async point => {
                if (this.mapType >= 2) {
                    if (flag == 40) {
                        flag = 0;
                    } else if (flag >= 1) {
                        flag++;
                        return;
                    }

                    flag++;
                } else if (this.mapType == 0) {
                    if (prefFlag.includes(point.pref)) {
                        return;
                    }
                    console.debug(prefFlag);
                    prefFlag.push(point.pref);
                }


                console.debug(flag);

                let latLng = await this.getLatLng(point.pref + point.addr);
                let iconUrl = this.iconUrl(String(point.scale));

                this.map.newPoint(latLng.lat, latLng.lng, iconUrl);

                points.push(new P2pquakePoint({
                    "addr": point.addr,
                    "isArea": point.isArea,
                    "pref": point.pref,
                    "scale": point.scale,
                    "latitude": latLng.lat,
                    "longitude": latLng.lng,
                }));
            });
        } catch (error) {
            console.error(error);
        }
    }

    async getLatLng(title) {
        let latLng = null;

        let a = "https://";
        let b = "msearch.";
        let c = "gsi";
        let d = ".go.jp";
        let e = "/address-search";
        let f = "/AddressSearch";
        let g = "?q=";

        await fetch(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${title}`)
            .then(response => response.json())
            .then(data => {
                data = data[0];
                let lng = data.geometry.coordinates[0];
                let lat = data.geometry.coordinates[1];

                latLng = {
                    "lat": lat,
                    "lng": lng,
                }
            });

        return (latLng);
    }

    iconUrl(scale) {
        switch (scale) {
            case "-1":
                return ("./images/radius/unknown.png");
                break;

            case "10":
                return ("./images/square/1.png");
                break;

            case "20":
                return ("./images/square/2.png");
                break;

            case "30":
                return ("./images/square/3.png");
                break;

            case "40":
                return ("./images/square/4.png");
                break;

            case "45":
                return ("./images/square/5-.png");
                break;

            case "50":
                return ("./images/square/5+.png");
                break;

            case "55":
                return ("./images/square/6-.png");
                break;

            case "60":
                return ("./images/square/6+.png");
                break;

            case "70":
                return ("./images/square/7.png");
                break;

            default:
                return ("./images/radius/unknown.png");
                break;
        }
    }
}

