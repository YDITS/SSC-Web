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
        this.value = value;
    }

    /**
     * @type {string}
     */
    value;

    /**
     * @type {string}
     */
    #value;

    get value() {
        return this.#value;
    }

    set value(newValue) {
        this.#value = newValue;
    }
}
