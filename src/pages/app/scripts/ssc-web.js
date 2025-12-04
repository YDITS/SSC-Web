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
    constructor() { }

    async run() {
        this.map = new Map();
        this.p2pquake = new P2pquake(this.map);

        await this.map.initMap();
        await this.p2pquake.getEarthquakeInfo();

        setInterval(async () => await this.mainloop(), this.interval);
    }

    get interval() {
        return (8000);
    }

    async mainloop() {
        await this.p2pquake.getEarthquakeInfo();
    }
}
