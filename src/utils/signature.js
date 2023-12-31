const config = require('../config/index');
const crypto = require('crypto');

class signature {

    async generate(qType, url, body) {
        const data = qType + "\n" + url + "\n" + config.wxPage.timestamp + "\n" + config.wxPage.nonce_str + "\n" + body + "\n";
        console.log("获取的信息" + data);

        const privateKeyObject = crypto.createPrivateKey({
            key: config.wxPage.api_key,
            format: 'pem',
            type: 'pkcs1' // 或 'pkcs8'
        });

        // 创建SHA256 with RSA签名对象
        const sign = crypto.createSign('RSA-SHA256');

        // 更新要签名的数据
        sign.update(data);

        // 对数据进行签名并转为Base64格式
        const signature = sign.sign(privateKeyObject, 'base64');

        return signature;
    }


}

module.exports = new signature();