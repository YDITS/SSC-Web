/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { SSCWeb } from "./ssc-web/ssc-web.js";
import { Config } from "./config.js";
import { MapApiKey } from "./modules/maps/types/api-key.js";

document.addEventListener("DOMContentLoaded", () => {
    run().catch(error => {
        console.error("アプリのイニシャライズ中にエラーが発生しました", error);
    });
});

/**
 * アプリを実行します
 * 
 * @returns {Promise<void>}
 */
async function run() {
    const mapApiKey = new MapApiKey(Config.MAP_API_KEY);

    const app = new SSCWeb({
        mapApiKey: mapApiKey,
    });

    await app.run();
}
