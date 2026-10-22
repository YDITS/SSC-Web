/*!
 * 
 * SSC for Web
 * 
 * Copyright (C) 2024-2026 よね/Yone
 * Licensed under the Apache License 2.0.
 * 
 * https://github.com/YDITS/SSC-Web
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
