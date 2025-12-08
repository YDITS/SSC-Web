/**!
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

import { DateFormatterFormatTypes } from "./types/format-types.js";

export class DateFormatter {
    /**
     * @param {{
     *     date: Date,
     *     formatType: string
     * }} param0 
     * @returns 
     */
    static dateFormat({
        date,
        formatType = DateFormatterFormatTypes.FORMAT_TYPES.FULL,
    }) {
        return [
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY || formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY_NO_SECONDS ? "" : [
                date.getFullYear(),
                "年",
                DateFormatter.#pad(date.getMonth() + 1),
                "月",
                DateFormatter.#pad(date.getDate()),
                "日 ",
            ].join(""),
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.DATE_ONLY ? "" : [
                DateFormatter.#pad(date.getHours()),
                "時",
                DateFormatter.#pad(date.getMinutes()),
                "分",
                formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY_NO_SECONDS ? "" : [
                    DateFormatter.#pad(date.getSeconds()),
                    "秒",
                ].join(""),
            ].join(""),
        ].join("");
    }

    static #pad(num) {
        return num.toString().padStart(2, '0');
    }
}
