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
    /**
     * @type {MapApiKey | null}
     */
    let mapApiKey;

    try {
        mapApiKey = new MapApiKey(Config.MAP_API_KEY);
    } catch (error) {
        console.error("MapApiKey のイニシャライズに失敗しました:", error.stack);
        alert(`MapApiKey のイニシャライズに失敗しました: ${error.stack}`);
        mapApiKey = null;
    }

    const debugMode = isDebugModeFromURLParam();

    const app = new SSCWeb({ mapApiKey, debugMode });

    await app.run();
}

function isDebugModeFromURLParam() {
    return new URL(window.location.href).searchParams.get("debug") !== null;
}
