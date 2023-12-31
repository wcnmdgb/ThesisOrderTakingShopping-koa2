

const config = require('../config/index')
const {request} =require('../utils/request');


class wxRequest {

    
    async wxOption(code){
        return request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            params: {
                 appid: config.wxPay.appId, //小程序的appid
                 secret: config.wxPay.secret, //小程序的secret
                 js_code: code, //调用uni.login()成功后获得的code码
                 grant_type: 'authorization_code'
            },
            method: 'GET',
        })
    }
    
    async getAccessTonk(){
        return  request({
            url: 'https://api.weixin.qq.com/cgi-bin/token',
            params: {
                 appid: config.wxPay.appId, //小程序的appid
                 secret: config.wxPay.secret, //小程序的secret
                 grant_type: 'client_credential'
            },
            method: 'GET',
        })
    } 
    
    //订单状态改为发货
    async shipment(token,orderId,openId){
        return request({
            url: `https://api.weixin.qq.com/wxa/sec/order/upload_shipping_info?access_token=${token}`,
            data: {
                order_key:{
                    order_number_type:1,	
                    out_trade_no: orderId,
                    mchid: config.wxPay.mchid,
                },
                logistics_type:3,
                delivery_mode:1,
                shipping_list:[{
                    item_desc:"鞋来鞋往-订单"
                 }],
                upload_time: new Date(),
                payer:{
                    openid:openId
                }
            },
            method: 'POST',
        })   
    }
 
}
module.exports = new wxRequest()
