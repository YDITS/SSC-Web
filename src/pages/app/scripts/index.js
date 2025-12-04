/**
 * 
 * SSC for Web
 * 
 * Copyright (C) よね/Yone
 * 
 */

import { SSCWeb } from "./ssc-web.js";

document.addEventListener("DOMContentLoaded", async () => {
    const app = new SSCWeb();
    await app.run();
});
