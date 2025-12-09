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
