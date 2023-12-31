
const { readPem } = require('./file');



module.exports = {

    token: {
        adminKey: 'TuWpXi4FFJ2FCMRp',
        userKey: 'XusjhuJXHxxSDSD'
    },
    webPath: __dirname,
    uip: '127.0.0.1',
    prot: 3000,
    MYSQL_HOST: '159.75.106.72',
    MYSQL_USER: 'root',
    MYSQL_PWD: 'mysql_aRtHDP',
    MYSQL_DB: 'xlxw',

    wxPay: {
        // 应用ID
        appId: 'wx8c185cdbcef9e6e1',
        // 直连商户号
        mchid: '1650425077',
        // 商户API私钥内容
        api_key: readPem('/apiclient_key.pem'),
        // 商户API证书内容
        api_cert: readPem('/apiclient_cert.pem'),
        //序列号
        serial_no: '5FFC19651C60A7B8E5768E9F5219FC37CB631E75',
        //密钥
        secret: 'bab7eec28a274999915b4337ccfd57a2',

        apiv3_key: '8ZXyw4u5WgKdJGWdAJWxoC5vhZgA9wrE'
    }
}
