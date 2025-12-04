/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { DateFormatter } from "../../utils/date-formatter/date-formatter.js";

export class P2pquakeItem {
    constructor(item) {
        this.type = item.type;

        this.publishedTime = DateFormatter.dateFormat({
            date: new Date(item.publishedTime),
            formatType: DateFormatter.formatTypes.FULL
        });

        this.occurredTime = DateFormatter.dateFormat({
            date: new Date(item.occurredTime),
            formatType: DateFormatter.formatTypes.TIME_ONLY_NO_SECONDS
        });

        this.occurredTime += "頃";

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

    get scaleText() {
        return (this.scaleTextToJp[String(this.scale)]);
    }

    get scaleTextToJp() {
        return ({
            "-1": "不明",
            "10": "1",
            "20": "2",
            "30": "3",
            "40": "4",
            "45": "5弱",
            "50": "5強",
            "55": "5弱",
            "60": "5強",
            "70": "7"
        });
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
        return (this.tsunamiTextToJp[this.domesticTsunami]);
    }

    get typeText() {
        return (this.typeTextToJp[this.type]);
    }

    get typeTextToJp() {
        return ({
            "ScalePrompt": "震度速報",
            "Destination": "震源情報",
            "ScaleAndDestination": "震源・震度情報",
            "DetailScale": "各地の震度情報",
            "Foreign": "遠地地震情報",
            "Other": "地震情報"
        });
    }

    get tsunamiTextToJp() {
        return ({
            'None': '心配なし',
            'Unknown': '影響は不明',
            'Checking': '影響を現在調査中',
            'NonEffective': '若干の海面変動、被害の心配なし',
            'Watch': '津波注意報が発表',
            'Warning': '大津波警報・津波警報が発表'
        });
    }
}

export class P2pquakePoint {
    constructor(item) {
        this.addr = item.addr;
        this.isArea = item.isArea;
        this.pref = item.pref;
        this.scale = item.scale;
        this.latitude = item.latitude;
        this.longitude = item.longitude;
    }

    get scaleText() {
        return (this.scaleTextToJp[String(this.scale)]);
    }

    get scaleTextToJp() {
        return ({
            "-1": "不明",
            "10": "1",
            "20": "2",
            "30": "3",
            "40": "4",
            "45": "5弱",
            "50": "5強",
            "55": "5弱",
            "60": "5強",
            "70": "7"
        });
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
        return (this.tsunamiTextToJp[this.domesticTsunami]);
    }

    get typeText() {
        return (this.typeTextToJp[this.type]);
    }

    get typeTextToJp() {
        return ({
            "ScalePrompt": "震度速報",
            "Destination": "震源情報",
            "ScaleAndDestination": "震源・震度情報",
            "DetailScale": "各地の震度情報",
            "Foreign": "遠地地震情報",
            "Other": "地震情報"
        });
    }

    get tsunamiTextToJp() {
        return ({
            'None': '津波の心配なし',
            'Unknown': '津波の影響は不明',
            'Checking': '津波の影響を現在調査中',
            'NonEffective': '若干の海面変動が予想されるが、被害の心配はなし',
            'Watch': '津波注意報が発表',
            'Warning': '津波警報等（大津波警報・津波警報あるいは津波注意報）が発表'
        });
    }
}
