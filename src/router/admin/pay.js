const Router = require('koa-router')

const config =require('../../config');
const { getWxOrder } = require('../../api/wxRequest');

const { WechatPay } =require('wechat-pay-nodejs');



const router = new Router()


router.post('/pay',async (ctx,next)=>
{

 const wechatPay = new WechatPay({
    appid: config.wxPage.appId, // 应用ID
    mchid: config.wxPage.mchid, // 直连商户号
    cert_private_content: config.wxPage.api_key, // 商户API私钥内容
    cert_public_content:  config.wxPage.api_cert, // 商户API证书内容
})

const params={
    description: '鞋来鞋往_订单洗护', // 商品描述
    out_trade_no: '2021190402037', // 商户订单号
    notify_url: 'https://pay.xlxwhxxh.cn/pay', // 通知地址

    amount: {
    total: 1, // 订单金额
    },

    payer: {
      openid: 'onKOC65RCxmcpgDKTvv_QdyaiRW8', // 用户服务标识
    }
}

    const {data} = await wechatPay.prepayJsapi(params);
})






module.exports = router