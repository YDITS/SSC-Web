/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

export class DateFormatter {
    constructor() { }

    /**
     * 
     * @param {{
     *     date: Date,
     *     formatType: string
     * }} param0 
     * @returns 
     */
    static dateFormat({
        date,
        formatType = this.formatTypes.FULL,
    }) {
        return [
            formatType === this.formatTypes.TIME_ONLY || formatType === this.formatTypes.TIME_ONLY_NO_SECONDS ? "" : [
                date.getFullYear(),
                "年",
                DateFormatter.#pad(date.getMonth() + 1),
                "月",
                DateFormatter.#pad(date.getDate()),
                "日 ",
            ].join(""),
            formatType === this.formatTypes.DATE_ONLY ? "" : [
                DateFormatter.#pad(date.getHours()),
                "時",
                DateFormatter.#pad(date.getMinutes()),
                "分",
                formatType === DateFormatter.formatTypes.TIME_ONLY_NO_SECONDS ? "" : [
                    DateFormatter.#pad(date.getSeconds()),
                    "秒",
                ].join(""),
            ].join(""),
        ].join("");
    }

    static #pad(num) {
        return num.toString().padStart(2, '0');
    }

    static get formatTypes() {
        return {
            FULL: "FULL",
            DATE_ONLY: "DATE_ONLY",
            TIME_ONLY: "TIME_ONLY",
            TIME_ONLY_NO_SECONDS: "TIME_ONLY_NO_SECONDS",
        };
    }
}
