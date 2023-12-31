const CryptoJS = require('crypto-js');

/**
 * AES 加密
 * @param word: 需要加密的文本
 * KEY: // 需要前后端保持一致
 * mode: ECB // 需要前后端保持一致
 * pad: Pkcs7 //前端 Pkcs7 对应 后端 Pkcs5
 */
const KEY = CryptoJS.enc.Utf8.parse('d7b85f5e214abcdr');

exports.AES_Encrypt = (plaintext) => {
    let ciphertext = CryptoJS.AES.encrypt(plaintext, KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString()
    return ciphertext;
}

/**
 * AES 解密
 * @param jsonStr
 */
exports.AES_Decrypt = (jsonStr) => {
    let plaintext = CryptoJS.AES.decrypt(jsonStr, KEY, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)

    return plaintext;
}

//MD5加密
exports.MD5_Encrypt = (plaintext) => {
    const ciphertext = CryptoJS.MD5(plaintext).toString();
    return ciphertext;
}