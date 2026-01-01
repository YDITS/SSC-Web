/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * Licensed under the Apache License 2.0
 * 
 * https://github.com/YDITS/SSC-Web
 * 
 */

import { Render } from "https://cdn.yoneyo.com/scripts/render@1.0.0/render.js";
import { Config } from "./config.js";
import { SSCWeb } from "./ssc-web/ssc-web.js";
import { MapApiKey } from "./ssc-web/features/maps/types/api-key.js";

/**
 * デバッグモードフラグのURLパラメータ
 * @type {string}
 */
const DEBUG_URL_PARAM_KEY = "debug";

document.addEventListener("DOMContentLoaded", () => {
    run().catch(error => {
        console.error("アプリケーションのイニシャライズに失敗しました", error);
        alert(`アプリケーションのイニシャライズに失敗しました: ${error.stack}`);
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
    const mapApiKey = initializeMapApiKey(Config.MAP_API_KEY);

    /**
     * @type {boolean}
     */
    const debugMode = isDebugModeFromURLParamOfCurrentWindowLocation(DEBUG_URL_PARAM_KEY);

    /**
     * @type {SSCWeb}
     */
    const app = initializeSSCWeb({ mapApiKey, debugMode });

    await app.run();
}

/**
 * MapApiKey をイニシャライズします  
 * MAP_API_KEY の値が不正なときは null を返します。
 * @param {string} apiKey
 * @returns {MapApiKey | null}
 */
function initializeMapApiKey(apiKey) {
    try {
        return new MapApiKey(apiKey);
    } catch (error) {
        onFailedInitializeMapApiKey(error);
        return null;
    }
}

/**
 * MapApiKey のイニシャライズに失敗したときの処理
 * @param {*} error
 */
function onFailedInitializeMapApiKey(error) {
    console.error("MapApiKey のイニシャライズに失敗しました:", error.stack);
    displayFailedInitializeMapApiKey(error);
}

/**
 * マップの表示の失敗をレンダリングします
  * @returns {void}
 */
function displayFailedInitializeMapApiKey(error) {
    /**
     * @type {Render}
     */
    const render = new Render();

    /**
     * @type {{
     *     $p: ({ textContent }: { textContent: string }) => HTMLElement,
     *     $style: ({ innerHTML }: { innerHTML: string }) => HTMLElement,
     * }}
     */
    const { $div, $p, $style } = render;

    /**
     * @type {HTMLElement}
     */
    const $map = document.getElementById("map");

    render.build({
        target: $map,
        children: [
            $div({
                children: [
                    $p({
                        id: "map-error-message",
                        textContent: `マップの表示に失敗しました: MapApiKey のイニシャライズに失敗しました: ${error.message}`,
                    }),
                ],
            }),
            $style({
                textContent: (`
                    #map-error-message {
                        color: #f88;
                    }
                `),
            }),
        ],
    });
}

/**
 * SSCWeb をイニシャライズします
 * @param {{
 *     mapApiKey: MapApiKey | null,
 *     debugMode: boolean,
 * }}
 * @returns {SSCWeb | null}
 */
function initializeSSCWeb({ mapApiKey, debugMode }) {
    return new SSCWeb({ mapApiKey, debugMode });
}

/**
 * URL パラメータからデバッグモードかどうかを取得します
 * @returns {boolean}
 */
function isDebugModeFromURLParamOfCurrentWindowLocation(paramKey) {
    const urlParams = initializeURLSearchParamsOfCurrentWindowLocation();
    const debugMode = urlParams.get(paramKey);
    return debugMode !== null;
}

/**
 * URLSearchParams をイニシャライズします
 * @returns {URLSearchParams}
 */
function initializeURLSearchParamsOfCurrentWindowLocation() {
    return new URLSearchParams(window.location.search);
}
