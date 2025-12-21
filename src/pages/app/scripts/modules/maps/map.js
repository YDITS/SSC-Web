/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { MapApiKey } from "./types/api-key.js";

export class Map {
    /**
     * デフォルトの緯度/軽度
     */
    static DEFAULT_LAT_LNG = [36.0047000, 137.5930000];

    /**
     * デフォルトのズームレベル
     */
    static DEFAULT_ZOOM = 5;

    /**
     * マップスタイルのJSONパス
     */
    static MAP_STYLE = "https://api.maptiler.com/maps/8ec88df9-410c-4968-acf6-b79f27d971f1/style.json?key=GHvHPC7Le16USNGvdnNq";
    // static MAP_STYLE_YDITS = "https://api.maptiler.com/maps/ba979b60-0cf8-4087-8cdc-5bb919540c08/style.json?key=3ft2uVdfAwtgfKQGIT8U";

    /**
     * @param {{
     *     apiKey: MapApiKey,
     * }} param0 
     */
    constructor({ apiKey }) {
        this.#apiKey = apiKey;
    }

    /**
     * イニシャライズする
     * 
     * @returns {Promise<void>}
     */
    async initialize() {
        this.map = L.map('map', {
            attributionControl: false,
            center: Map.DEFAULT_LAT_LNG,
            zoom: Map.DEFAULT_ZOOM,
            minZoom: 4,
            maxZoom: 11,
            zoomSnap: 0,
            zoomDelta: 2,
            zoomControl: false,
            wheelDebounceTime: 0,
            zoomAnimation: false,
            fadeAnimation: false,
        });

        L.maptilerLayer({
            apiKey: this.#apiKey,
            style: Map.MAP_STYLE,
            navigationControl: false
        }).addTo(this.map);

        this.bounds = L.latLngBounds();
    }

    /**
     * すべてのレイヤー要素を削除する
     * 
     * @returns {Promise<void>}
     */
    removeAllLayers() {
        this.map.eachLayer(layer => {
            if (!(layer instanceof L.Marker)) { return }
            this.map.removeLayer(layer);
        })
    }

    /**
     * 震央をイニシャライズする
     * 
     * @param {number} lat 
     * @param {number} lng 
     */
    initializeHypocenter(lat, lng) {
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error("緯度経度が number ではありません");
        }

        this.hypocenterMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: "./images/v2/hypocenter.png",
                iconSize: [32, 32]
            }),
            zIndexOffset: 999,
        }).addTo(this.map);
    }

    /**
     * 
     * @param {*} lat 
     * @param {*} lng 
     * @returns 
     */
    setHypocenter(lat, lng) {
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error("緯度経度が number ではありません at setHypocenter");
        }

        this.initializeHypocenter(lat, lng);
        // this.hypocenterMarker.setLatLng([lat, lng]);
    }

    /**
     * 指定された緯度/経度にマップを移動する
     * 
     * @param {L.latLng | LatLng | {lat: number, lng: number } | [number, number] } latLng
     */
    moveMap(latLng) {
        this.map.setView(latLng, 8);
    }

    /**
     * 指定された緯度+経度+Boundsにマップを移動する
     * 
     * @param {L.latLngBounds | LatLngBounds | LatLng[]} bounds
     */
    fitMap(bounds) {
        this.map.fitBounds(bounds, { maxZoom: 8 });
        this.map.zoomOut(0.5);
    }

    /**
     * 新しい観測点を追加し、表示する
     * 
     * @param {number} lat 
     * @param {number} lng 
     * @param {string} iconUrl 
     */
    newPoint(lat, lng, iconUrl) {
        L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: iconUrl,
                iconSize: [24, 24]
            })
        }).addTo(this.map);
    }

    /**
     * APIキー
     * 
     * @type {MapApiKey}
     */
    #apiKey;

    /**
     * Bounds
     * 
     * @type {L.LatLngBounds}
     */
    bounds;
}
