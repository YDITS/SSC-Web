/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { DateFormatter } from "../../date-formatter/date-formatter.js";
import { DateFormatterFormatTypes } from "../../date-formatter/types/format-types.js";
import { parseFloatToFixedOne } from "../../utils/parse-float-to-fixed-one.js";

export class P2pquakeItem {
    /**
     * 震度値を文字列表現に変換するオブジェクト
     */
    static SCALE_TEXT_TO_JP = {
        "-1": "不明",
        "10": "1",
        "20": "2",
        "30": "3",
        "40": "4",
        "45": "5弱",
        "50": "5強",
        "55": "6弱",
        "60": "6強",
        "70": "7",
    };

    /**
     * 電文種別値を文字列表現に変換するオブジェクト
     */
    static TYPE_TEXT_TO_JP = {
        "ScalePrompt": "震度速報",
        "Destination": "震源情報",
        "ScaleAndDestination": "震源・震度情報",
        "DetailScale": "各地の震度情報",
        "Foreign": "遠地地震情報",
        "Other": "地震情報",
        "Unknown": "不明"
    }

    /**
     * 津波情報値を文字列表現に変換するオブジェクト
     */
    static TSUNAMI_TEXT_TO_JP = {
        "None": "心配なし",
        "Unknown": "影響は不明",
        "Checking": "影響を現在調査中",
        "NonEffective": "若干の海面変動、被害の心配なし",
        "Watch": "津波注意報が発表中",
        "Warning": "大津波警報または津波警報が発表中",
    }

    /**
     * @param {*} item
     */
    constructor(item) {
        this.type = item.type;

        this.publishedTime = DateFormatter.dateFormat({
            date: new Date(item.publishedTime),
            formatType: DateFormatterFormatTypes.FORMAT_TYPES.FULL
        });

        this.occurredTime = DateFormatter.dateFormat({
            date: new Date(item.occurredTime),
            formatType: DateFormatterFormatTypes.FORMAT_TYPES.DATETIME_ONLY_NO_YEARSDATE_NO_SECONDS
        });

        this.occurredTime += " ごろ";

        this.scale = item.scale;
        this.magnitude = item.magnitude;
        this.depth = item.depth;
        this.domesticTsunami = item.domesticTsunami;
        this.hypocenter = {
            name: item.hypoName,
            lat: item.hypoLat,
            lng: item.hypoLng
        }
        this.points = item.points;
    }

    /**
     * 電文種別の文字列表現
     */
    get typeText() {
        return P2pquakeItem.TYPE_TEXT_TO_JP[this.type] || P2pquakeItem.TYPE_TEXT_TO_JP["Unknown"];
    }

    /**
     * 震度の文字列表現
     */
    get scaleText() {
        if (this.type === "Destination") {
            return "-";
        }

        return P2pquakeItem.SCALE_TEXT_TO_JP[String(this.scale)] || P2pquakeItem.SCALE_TEXT_TO_JP["-1"];
    }

    /**
     * 震源深さの文字列表現
     */
    get depthText() {
        if (this.type === "ScalePrompt") {
            return ("調査中");
        }

        if (this.depth === -1) {
            return ("不明");
        } else if (this.depth === 0) {
            return ("ごく浅い");
        } else {
            return (`約 ${this.depth}km`);
        }
    }

    /**
     * 地震の規模 (マグニチュード Mj) の文字列表現
     */
    get magnitudeText() {
        if (this.type === "ScalePrompt") {
            return ("調査中");
        }

        if (this.magnitude === -1) {
            return ("不明");
        } else {
            const fixedMagnitude = parseFloatToFixedOne(this.magnitude);
            return (`M ${fixedMagnitude}`);
        }
    }

    /**
     * 津波情報の文字列表現
     */
    get tsunamiText() {
        return P2pquakeItem.TSUNAMI_TEXT_TO_JP[this.domesticTsunami] || P2pquakeItem.TSUNAMI_TEXT_TO_JP["Unknown"];
    }
}

export class P2pquakePoint {
    static SCALE_TEXT_TO_JP = {
        "-1": "不明",
        "10": "1",
        "20": "2",
        "30": "3",
        "40": "4",
        "45": "5弱",
        "50": "5強",
        "55": "6弱",
        "60": "6強",
        "70": "7",
    };

    static TYPE_TEXT_TO_JP = {
        "ScalePrompt": "震度速報",
        "Destination": "震源情報",
        "ScaleAndDestination": "震源・震度情報",
        "DetailScale": "各地の震度情報",
        "Foreign": "遠地地震情報",
        "Other": "地震情報",
        "Unknown": "不明"
    }

    static TSUNAMI_TEXT_TO_JP = {
        "None": "心配なし",
        "Unknown": "影響は不明",
        "Checking": "影響を現在調査中",
        "NonEffective": "若干の海面変動、被害の心配なし",
        "Watch": "津波注意報が発表中",
        "Warning": "大津波警報または津波警報が発表中",
    }

    /**
     * @param {{
     *     addr: string,
     *     isArea: boolean,
     *     pref: string,
     *     scale: number,
     *     latitude: number,
     *     longitude: number,
     * }}
     */
    constructor({
        addr,
        isArea,
        pref,
        scale,
        latitude,
        longitude,
    }) {
        this.addr = addr;
        this.isArea = isArea;
        this.pref = pref;
        this.scale = scale;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    get typeText() {
        return P2pquakePoint.TYPE_TEXT_TO_JP[this.type];
    }

    get scaleText() {
        return P2pquakePoint.SCALE_TEXT_TO_JP[String(this.scale)] || P2pquakePoint.SCALE_TEXT_TO_JP["-1"];
    }

    get depthText() {
        if (this.depth === -1) {
            return ("不明");
        } else if (this.depth === 0) {
            return ("ごく浅い");
        } else {
            return (`約${this.depth}km`);
        }
    }

    get magnitudeText() {
        if (this.magnitude === -1) {
            return ("不明");
        } else {
            return (`M ${this.magnitude}`);
        }
    }

    get tsunamiText() {
        return P2pquakePoint.TSUNAMI_TEXT_TO_JP[this.domesticTsunami] || P2pquakePoint.TSUNAMI_TEXT_TO_JP["Unknown"];
    }
}
