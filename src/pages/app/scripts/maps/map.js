/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

export class Map {
    constructor() { }

    get apiKey() {
        return ('wiAJ7OPjFLLf0qS0KJYa');
    }

    get defaultLatLng() {
        return ([36.0047000, 137.5930000]);
    }

    get defaultZoom() {
        return (5);
    }

    get mapStyle() {
        return ('https://api.maptiler.com/maps/8ec88df9-410c-4968-acf6-b79f27d971f1/style.json?key=GHvHPC7Le16USNGvdnNq');
    }

    initMap() {
        this.map = L.map('map', {
            center: this.defaultLatLng,
            zoom: this.defaultZoom,
            zoomControl: false,
        });

        L.maptilerLayer({
            apiKey: this.apiKey,
            style: this.mapStyle,
            navigationControl: false
        }).addTo(this.map);

        this.bounds = L.latLngBounds();
    }

    removeAllLayers() {
        this.map.eachLayer(layer => {
            if (!(layer instanceof L.Marker)) { return; }
            this.map.removeLayer(layer);
        })
    }

    initializeHypocenter(lat, lng) {
        this.hypocenterMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: "./images/hypocenter.png",
                iconSize: [32, 32]
            })
        }).addTo(this.map);
    }

    setHypocenter(lat, lng) {
        if (!this.hypocenterMarker) {
            this.initializeHypocenter(lat, lng);
            return;
        }

        this.hypocenterMarker.setLatLng([lat, lng]);
    }

    fitMap(lat, lng) {
        this.map.setView([lat, lng], 8);
    }

    newPoint(lat, lng, iconUrl) {
        L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: iconUrl,
                iconSize: [32, 32]
            })
        }).addTo(this.map);
    }
}
