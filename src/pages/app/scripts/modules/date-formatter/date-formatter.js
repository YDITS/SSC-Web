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
        const secondsPart = [
            DateFormatter.#pad(date.getSeconds()),
            "秒",
        ].join("");

        const timePart = [
            DateFormatter.#pad(date.getHours()),
            "時",
            DateFormatter.#pad(date.getMinutes()),
            "分",
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY_NO_SECONDS ? "" : secondsPart,
        ].join("");

        const datePart = [
            date.getFullYear(),
            "年",
            DateFormatter.#pad(date.getMonth() + 1),
            "月",
            DateFormatter.#pad(date.getDate()),
            "日",
        ].join("");

        const formatted = [
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY || formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY_NO_SECONDS ? "" : datePart,
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.FULL ? " " : "",
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.DATE_ONLY ? "" : timePart,
        ].join("");

        return formatted;
    }

    /**
     * 数値を2桁の文字列にパディングします
     * 
     * @param {number} num 
     * @returns {string}
     */
    static #pad(num) {
        if (typeof num !== "number") {
            throw new Error("`num` must be a number.");
        }

        return num.toString().padStart(2, '0');
    }
}
