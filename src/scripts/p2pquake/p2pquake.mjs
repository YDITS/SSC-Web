/**
 * 
 * SSC EQMonitor
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 
 * Licensed under by よね/Yone.
 * 
 */

import { P2pquakeItem, P2pquakePoint } from "./p2pquakeData.mjs";


export class P2pquake {
    constructor(map) {
        this.map = map;
    }


    /**
     * 震度表示の種類
     * 0: 各都道府県
     * 1: すべての観測点
     * 2以上: すべての観測点のうち読み飛ばす間隔 (大規模な地震の場合、大きい値ほど軽量になる)
     */
    get mapType() {
        return (0);
    }


    get apiEndpoint() {
        return ('https://api.p2pquake.net/v2/history?codes=551&limit=1');
    }


    getEarthquakeInfo() {
        fetch(this.apiEndpoint, {
            headers: {}
        })
            .then(response => response.json())
            .then(data => {
                let _data = [];

                data.forEach(list => {
                    _data.push(new P2pquakeItem({
                        "type": list.issue.type,
                        "publishedTime": list.issue.time,
                        "occurredTime": list.earthquake.time,
                        "hypoName": list.earthquake.hypocenter.name,
                        "scale": list.earthquake.maxScale,
                        "magnitude": list.earthquake.hypocenter.magnitude,
                        "depth": list.earthquake.hypocenter.depth,
                        "domesticTsunami": list.earthquake.domesticTsunami,
                        "hypoLat": list.earthquake.hypocenter.latitude,
                        "hypoLng": list.earthquake.hypocenter.longitude,
                        "points": list.points,
                    }));
                });

                this.displayEarthquakeInfo(_data);
                this.displayEarthquakeScales(_data)
                this.data = _data;
            })
            .catch(error => {
                console.error('地震情報を取得できませんでした:', error);
            });
    }


    displayEarthquakeInfo(data) {
        try {
            let earthquakeData = data[0]; // 最新の地震情報を取得
            let publishedTimeElement = document.getElementById('publishedTime');
            let typeElement = document.getElementById('eqinfoType');
            let timeElement = document.getElementById('eqinfoTime');
            let hypoElement = document.getElementById('eqinfoHypo');
            let scaleElement = document.getElementById('eqinfoScale');
            let magnitudeElement = document.getElementById('eqinfoMag');
            let depthElement = document.getElementById('eqinfoDepth');
            let tsunamiElement = document.getElementById('eqinfoTsunami');

            publishedTimeElement.innerText = earthquakeData.publishedTime;
            typeElement.innerText = earthquakeData.typeText;
            timeElement.innerText = earthquakeData.publishedTime;
            hypoElement.innerText = earthquakeData.hypocenter.name;
            scaleElement.innerText = earthquakeData.scaleText;
            magnitudeElement.innerText = earthquakeData.magnitudeText;
            depthElement.innerText = earthquakeData.depthText;
            tsunamiElement.innerText = earthquakeData.tsunamiText;

            let lat = earthquakeData.hypocenter.lat;
            let lng = earthquakeData.hypocenter.lng;

            this.map.setHypocenter(lat, lng);
        } catch (error) {
            console.error(error)
        }
    }


    displayEarthquakeScales(data) {
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

            this.points = points;
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
