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
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY_NO_SECONDS || formatType === DateFormatterFormatTypes.FORMAT_TYPES.DATETIME_ONLY_NO_YEARS_NO_SECONDS ? "" : secondsPart,
        ].join("");

        const yearPart = [
            date.getFullYear(),
            "年",
        ].join("");

        const monthPart = [
            DateFormatter.#pad(date.getMonth() + 1),
            "月",
        ].join("");

        const datePart = [
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.DATETIME_ONLY_NO_YEARS_NO_SECONDS || formatType === DateFormatterFormatTypes.FORMAT_TYPES.DATETIME_ONLY_NO_YEARSDATE_NO_SECONDS ? "" : yearPart,
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.DATETIME_ONLY_NO_YEARSDATE_NO_SECONDS ? "" : monthPart,
            DateFormatter.#pad(date.getDate()),
            "日",
        ].join("");

        const formatted = [
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY || formatType === DateFormatterFormatTypes.FORMAT_TYPES.TIME_ONLY_NO_SECONDS ? "" : datePart,
            formatType === DateFormatterFormatTypes.FORMAT_TYPES.FULL || formatType === DateFormatterFormatTypes.FORMAT_TYPES.DATETIME_ONLY_NO_YEARS_NO_SECONDS ? " " : "",
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
            throw new Error("`num` が number ではありません");
        }

        return num.toString().padStart(2, '0');
    }
}
