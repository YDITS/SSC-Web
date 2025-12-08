/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { SSCWeb } from "./ssc-web/ssc-web.js";
import { MapApiKey } from "./packages/maps/types/api-key.js";

document.addEventListener("DOMContentLoaded", async () => {
    const app = new SSCWeb({
        mapApiKey: new MapApiKey("wiAJ7OPjFLLf0qS0KJYa"),
    });

    await app.run();
});
