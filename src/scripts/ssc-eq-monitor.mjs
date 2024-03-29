/**
 * 
 * SSC EQMonitor
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 
 * Licensed under by よね/Yone.
 * 
 */

import { Map } from "./maps/map.mjs";
import { P2pquake } from "./p2pquake/p2pquake.mjs";


export class SSCEqMonitor {
    constructor() {
        this.map = new Map();
        this.p2pquake = new P2pquake(this.map);
        this.map.initMap();
        this.p2pquake.getEarthquakeInfo();

        setInterval(() => this.mainloop(), this.interval);
    }


    get interval() {
        return(8000);
    }


    mainloop() {
        this.p2pquake.getEarthquakeInfo();
    }
}
