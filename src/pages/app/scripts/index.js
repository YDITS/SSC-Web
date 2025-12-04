/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { SSCWeb } from "./ssc-web.js";

document.addEventListener("DOMContentLoaded", async () => {
    const app = new SSCWeb();
    await app.run();
});
