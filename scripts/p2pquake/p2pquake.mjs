
import { P2pquakeItem } from "./p2pquakeData.mjs";


export class P2pquake {
    constructor(map) {
        this.map = map;
    }


    get apiEndpoint() {
        return ('https://api.p2pquake.net/v2/history?codes=551&limit=1');
    }


    getEarthquakeInfo() {
        fetch(this.apiEndpoint, {
            headers: { }
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
                    }));
                });

                this.displayEarthquakeInfo(_data);
                this.data = _data;
            })
            .catch(error => {
                console.error('地震情報を取得できませんでした:', error);
            });
    }


    displayEarthquakeInfo(data) {
        try {
            let earthquakeData = data[0]; // 最新の地震情報を取得
            let typeElement = document.getElementById('eqinfoType');
            let timeElement = document.getElementById('eqinfoTime');
            let hypoElement = document.getElementById('eqinfoHypo');
            let scaleElement = document.getElementById('eqinfoScale');
            let magnitudeElement = document.getElementById('eqinfoMag');
            let depthElement = document.getElementById('eqinfoDepth');
            let tsunamiElement = document.getElementById('eqinfoTsunami');

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


    iconUrl(scale) {
        switch (scale) {
            case -1:
                return ("./images/");
                break;

            case 10:
                return ("./images/1.png");
                break;

            case 20:
                return ("./images/2.png");
                break;

            case 30:
                return ("./images/3.png");
                break;

            case 40:
                return ("./images/4.png");
                break;

            case 45:
                return ("./images/5-.png");
                break;

            case 50:
                return ("./images/5+.png");
                break;

            case 55:
                return ("./images/6-.png");
                break;

            case 60:
                return ("./images/6+.png");
                break;

            case 70:
                return ("./images/7.png");
                break;

            default:
                return ("./images/");
                break;
        }
    }

}
