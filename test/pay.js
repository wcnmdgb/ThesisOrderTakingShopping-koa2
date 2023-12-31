const config = require('../src/config');

const { getWxOrder } = require('../src/api/wxOrder');


class pay{
    async payOrder(){
     const param = {
        mchid: config.wxPage.mchid,
        appid: config.wxPage.appId,
        out_trade_no: "2021190402037",
        description: "鞋来鞋往-洗护中心",
        notify_url: "https://pay.xlxwhxxh.cn/pay",
        amount: {
            total: 1,
            currency: "CNY"
        },
        payer: {
            openid: "onKOC65RCxmcpgDKTvv_QdyaiRW8"
            }
        }
      const res = await getWxOrder(param);
      console.log(res);
  }
}



