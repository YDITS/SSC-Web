/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

export class ElementsManager {
    /**
     * キャッシュされた Elements
     */
    get elements() {
        return this.#elements;
    }

    /**
     * Element を取得する
     * キャッシュを使用せずに新しく取得します。
     * 
     * @param {*} selectors
     * @returns {NodeListOf<any> | HTMLElement}
     */
    get(selectors) {
        const element = document.querySelectorAll(selectors);

        if (element.length === 1) {
            this.#elements[selectors] = element[0];
            return element[0];
        }

        this.#elements[selectors] = element;
        return element;
    }

    /**
     * Element を取得する
     * キャッシュを使用して取得します。
     * キャッシュがないときは新しく取得します。
     * 
     * @param {*} selectors
     * @returns {NodeListOf<any> | HTMLElement}
     */
    getFromCache(selector) {
        let element = this.#elements[selector];

        if (!(element instanceof Array || element instanceof HTMLElement)) {
            element = this.get(selector);
        }

        return element;
    }

    /**
     * キャッシュされた Elements
     * 
     * @type {{ query: NodeListOf<any> | HTMLElement }}
     */
    #elements = {};
}
