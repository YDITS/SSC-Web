/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

export class AddressSearch {
    /**
     * @param {string} address
     * @returns {Promise<{ lat: number, lng: number }>}
     */
    static async getLatLng(address) {
        const url = new URL(AddressSearch.#ENDPOINT_URL);
        url.searchParams.append('q', address);

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`緯度経度を取得できませんでした: ${response.status} ${response.statusText}`, { cause: response });
        }

        const data = await response.json();
        const lat = data[0]?.geometry?.coordinates[1];
        const lng = data[0]?.geometry?.coordinates[0];

        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error("緯度経度が number ではありません");
        }

        return { lat, lng };
    }

    /**
     * エンドポイントURL
     */
    static #ENDPOINT_URL = 'https://msearch.gsi.go.jp/address-search/AddressSearch';
}
