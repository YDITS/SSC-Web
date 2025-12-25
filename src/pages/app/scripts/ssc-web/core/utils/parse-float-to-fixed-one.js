/**
 * 
 * SSC for Web
 * 
 * Copyright (C) Saitama Sora Cam, よね/Yone
 * 改変や複製を一切禁じます。
 * 
 */

/**
 * 浮動小数点数を1桁の精度で固定する
 * 引数 `value` で number 型以外が渡された場合は "N/A" を返します
 * @param {number} value
 * @returns {string}
 */
export function parseFloatToFixedOne(value) {
    if (typeof value !== "number") {
        return "N/A";
    }

    const floatNumber = Number.parseFloat(value);
    const fixedFloat = floatNumber.toFixed(1);
    return fixedFloat;
}
