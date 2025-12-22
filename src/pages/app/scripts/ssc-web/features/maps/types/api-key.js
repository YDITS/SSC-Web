/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

export class MapApiKey {
    /**
     * @param {string} value 
     */
    constructor(value) {
        if (typeof value !== "string" || value.length === 0) {
            throw new Error("Map API Key が有効な string ではありません");
        }

        this.#value = value;
    }

    get value() {
        return this.#value;
    }

    /**
     * @type {string}
     */
    #value;
}
