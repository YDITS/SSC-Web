/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 
 */

import { Map } from "./maps/map.js";
import { P2pquake } from "./p2pquake/p2pquake.js";

export class SSCWeb {
    constructor() {
        this.map = new Map();
        this.p2pquake = new P2pquake(this.map);
        this.map.initMap();
        this.p2pquake.getEarthquakeInfo();

        setInterval(() => this.mainloop(), this.interval);
    }

    get interval() {
        return (8000);
    }

    mainloop() {
        this.p2pquake.getEarthquakeInfo();
    }
}
