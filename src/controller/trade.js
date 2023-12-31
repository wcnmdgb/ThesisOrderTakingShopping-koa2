
const config = require('../config');
const { findAllTrade, findTradeTypeAll, addTrade, updateTrade, findTradeTypeAllByIndex, updateTradeType, addTradeType, updateTradeByTypeId, findTrade, findbanlance, Cbalance } = require('../service/trade');

const { client } = require('../utils/redisClient')
const { RandomNumber } = require('../utils/order');

const { COrder, COrderTrade, findOrder, cgeOrder, derDetails, exportfindAllOrder, findAllOrder, findAllOrderByTime } = require('../service/order');
const fs = require('fs');



const { finOneCouppon } = require('../service/coupon')
const { AES_Decrypt } = require('../utils/crypt')
const expirationEvent = 60 * 60;
// const dayjs = require('dayjs');
const { subDay, addDay } = require('../utils/date');
const { WechatPay } = require('wechat-pay-nodejs');
//后期加入到数据库 过期时间
const { getAccessTonk, shipment } = require('../api/wxRequest');




class trade {


    //建立定时任务
    async findAllTarde(ctx, next) {
        //获取商品名称和状态
        const { productTypeId, index, tradeName, status } = ctx.request.query;

        try {
            const res = await findAllTrade({ product_type_id: productTypeId, name: tradeName, index: index, len: 10, status: status });
            //获取查询信息
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("查询商品名称和状态异常:" + e);
        }
    }

    async findTypeAll(ctx, next) {

        const { status } = ctx.request.query;
        try {
            const res = await findTradeTypeAll({ status: status });
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("查询商品类型异常:" + e);
        }
    }

    async createTarde(ctx, next) {
        const { name, desc, image, money, status, product_type_id } = ctx.request.body;
        try {
            if (await addTrade({ name: name, desc: desc, image: image, money: money * 100, status: status, product_type_id: product_type_id })) {
                ctx.success("添加成功");
            } else {
                ctx.fail(201, "添加失败")
            }
        } catch (e) {
            console.log("添加商品类型异常:" + e);
        }

    }
    async alterTrade(ctx, next) {
        const { id, name, desc, image, money, status, product_type_id } = ctx.request.body;
        try {
            if (await updateTrade({ id: id, name: name, desc: desc, image: image, money: money * 100, status: status, product_type_id: product_type_id })) {
                ctx.success("修改成功");
            } else {
                ctx.fail(201, "修改失败")
            }
        } catch (e) {
            console.log("修改商品类型异常:" + e);
        }

    }
    async shoptype(ctx, next) {

        const { name, index, status } = ctx.request.query;
        try {
            const res = await findTradeTypeAllByIndex({ label: name, index: index, status: status, len: 10 });
            ctx.success("查询成功", res)
        } catch (e) {
            console.log("查询商品类型异常:" + e);
        }
    }

    async createType(ctx, next) {
        const { label, status: status } = ctx.request.body;
        try {
            if (await addTradeType({ label: label, status: status })) {
                ctx.success("添加成功");
            } else {
                ctx.fail(201, "添加失败");
            }
        } catch (e) {
            console.log("添加商品类型异常:" + e);
        }
    }

    async aletshopType(ctx, next) {
        //修改类型也要改
        //点击下架全部下架 反之
        const { id, label, status } = ctx.request.body;
        try {
            if (await updateTradeType({ id, label: label, status: status })) {
                if (await updateTradeByTypeId({ product_type_id: id, status: status })) {
                    ctx.success("修改成功");
                }
            } else {
                ctx.fail(201, "修改失败");
            }
        } catch (e) {
            console.log("修改商品类型,同时修改子类异常:" + e);
        }
    }

    async delShopType(ctx, next) {
        //此处需要改

        //点击删除全部删除子类
        const { ids, del } = ctx.request.query;
        try {
            if (await updateTradeType({ id: JSON.parse(ids), del: del })) {
                if (await updateTradeByTypeId({ product_type_id: ids, del: del })) {
                    ctx.success("删除成功");
                }
            } else {
                ctx.fail(201, "删除失败");
            }
        } catch (e) {
            console.log("删除子类失败" + e);
        }
    }

    async delTarde(ctx, next) {
        const { ids, del } = ctx.request.query;
        try {
            if (await updateTrade({ id: JSON.parse(ids), del: del })) {
                ctx.success("修改成功");
            } else {
                ctx.fail(201, "修改失败")
            }
        } catch (e) {
            console.log("删除商品类型异常:" + e);
        }

    }

    async verifyProStatus(ctx, next) {
        const { orderItem } = ctx.request.body;
        //此处解析数据

        let orderItemJson = JSON.parse(AES_Decrypt(orderItem));
        ctx.state.JSON = ({ orderItemJson: orderItemJson })

        //获取已删除的信息
        try {
            const res = await findTrade({ status: 1, del: 1 });

            let newList = res.filter(item => orderItemJson.some(x => x.id === item.id));

            if (newList.length > 0) {
                ctx.fail(201, `${newList.map(item => { return item.name })}商品失效或者被删除`);

            } else {
                await next();
            }
        } catch (e) {
            console.log("获取下架或者删除的商品信息异常" + e);
        }

    }

    async verifyOrderId(ctx, next) {

        const { del } = ctx.request.body;

        const { orderItemJson } = ctx.state.JSON

        const { userId } = ctx.state.user


        //生成订单信息
        //使用redis存储key:userId ,value:orderId
        //然后使用orderId, [{item},{item}]
        let orderList = [];
        try {

            const res = await client.get(userId);
            //通过user_id获取订单号
            if (res) {
                orderList = JSON.parse(res);
            } else {
                await client.set(userId, JSON.stringify(orderItemJson));
                await client.expire(userId, expirationEvent)
                ctx.success("存储成功");
            }
            let newList = orderList.filter(item => !orderItemJson.some(x => x.id === item.id))
            if (del) {
                //删除
                await client.set(userId, JSON.stringify(newList));
                await client.expire(userId, expirationEvent)
                // client.disconnect();
                ctx.success("删除成功");
            } else {
                //替换
                //过滤掉表相同数据 然后合并
                await client.set(userId, JSON.stringify(newList.concat(orderItemJson)));
                // client.disconnect();
                await client.expire(userId, expirationEvent)
                ctx.success("添加成功");
            }
        } catch (e) {
            console.log("从redis获取订单的信息异常" + e);
        }
    }

    async generateOrder(ctx, next) {
        const { addrId, couponId, fristtime } = ctx.state.JSON;
        const { userId } = ctx.state.user
        let orderList = [];

        try {
            const res = await client.get(userId);
            await client.del(userId);
            if (res) {
                orderList = JSON.parse(res);
                //获取全部选择的元素
                let newOrderList = orderList.filter(item => {
                    return item.checked === true && item.value > 0;
                })
                let money = 0;
                newOrderList.forEach(item => {
                    money += item.money * item.value;
                })
                if (couponId !== undefined) {
                    const res = await finOneCouppon({ id: couponId });
                    money -= res.money;
                    console.log(money);
                }
                const orderCode = RandomNumber(couponId, fristtime);
                // 生成订单码
                await client.set(orderCode, "穷且益坚, 不坠青云之志");
                await client.expire(orderCode, expirationEvent);
                //设置过期时间的目的是通过key过期修改订单内容
                ctx.state.JSON = ({ addrId: addrId, couponId: couponId, money: money, orderCode: orderCode, orderList: newOrderList, userId: userId });
                await next();

            } else {
                ctx.fail(201, "购物车为空");
            }
        } catch (e) {
            console.log("将订单提交并且加入redis异常:" + e);
        }
    }

    async subOrder(ctx, next) {
        ///提交

        const { addrId, couponId, orderCode, orderList, userId, money } = ctx.state.JSON

        try {
            //将订单信息存储到数据库中
            const res = await COrder({ order_id: orderCode, user_id: userId, actual_payment: money, address_id: addrId, ip: config.uip, status: 0, del: 0, coupon_id: couponId })

            if (!res) {
                ctx.fail(201, "存储订单失败");
            }

            let ordertrades = [];
            orderList.forEach(element => {
                let orderTeade = {}
                orderTeade.order_id = orderCode
                orderTeade.number = element.value;
                orderTeade.trade_id = element.id;
                ordertrades.push(orderTeade)
            });

            if (await COrderTrade(ordertrades)) {
                ctx.success("存储订单成功", res);
            }
        } catch (e) {
            console.log("订单存储异常:" + e);
        }

    }


    async findOrder(ctx, next) {
        const { orderId, status } = ctx.request.query;

        const { userId } = ctx.state.user
        try {
            const order = await client.get("wx" + orderId);
            const res = await findOrder({ order_id: orderId, user_id: userId, status: status });


            Object.assign(res, { order: JSON.parse(order) });
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("获取订单异常" + e);
        }
    }


    async derDetails(ctx, next) {
        const { orderId, status } = ctx.request.query;
        const { userId } = ctx.state.user
        try {

            const res = await derDetails({ order_id: orderId, user_id: userId, status: status });

            ctx.success("查询成功", res);
        } catch (e) {
            console.log("查询订单详情异常" + e);
        }
    }

    async findOrderAll(ctx, next) {
        const { status, index, orderId } = ctx.request.query;

        const { userId, roleId } = ctx.state.user;

        try {
            let user_id = undefined;
            if (roleId === 0) {
                user_id = userId;
            }
            //使用user_id查询管理员表

            const res = await findAllOrder({ user_id: user_id, status: status, index: index, order_id: orderId });
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("查询全部订单异常:" + e);
        }
    }


    async alterOrder(ctx, next) {
        const { status, orderId } = ctx.request.body;

        const orderItem = await findOrder({ order_id: orderId });

        try {
            //支付方式为微信后点击确认,点击支付会修改微信中的状态
            if (orderItem.payment === 0 && status === 3) {
                const data = await getAccessTonk();
                //使用orderId获取到用户id
                const ces = await shipment(data.access_token, orderId, orderItem.user_id);
            }

            const res = await cgeOrder({ status: status, order_id: orderId });


            if (res) {
                ctx.success("修改成功");
            } else {
                ctx.fail(201, "修改失败")
            }
        } catch (e) {
            console.log("修改订单信息异常");
            ctx.fail(201, "修改失败")
        }

    }

    async verifyMoney(ctx, next) {
        const { payment, orderId } = ctx.request.body;

        const { userId } = ctx.state.user

        try {
            if (payment == 1) {
                //余额支付需要校验和扣除余额
                const moneys = await findbanlance({ user_id: userId });
                const orderinfo = await findOrder({ order_id: orderId });

                let money = 0;
                moneys.filter(item => {
                    if (item.status === 0) {
                        money += item.money;
                    } else if (item.status === 1) {
                        money -= item.money;
                    }
                })
                if (money >= orderinfo.actual_payment) {
                    const res = await Cbalance({ user_id: userId, money: orderinfo.actual_payment, status: 1 });
                    await cgeOrder({ status: 1, order_id: orderId, payment: payment });
                    ctx.success("支付成功");
                } else {
                    ctx.fail(201, "余额不足");
                }
            } else {
                ctx.success("支付成功");
            }
        } catch (e) {
            console.log("余额支付校验异常" + e);
        }

    }

    //订单提交到微信中
    async wxsub(ctx, next) {

        const { orderCode, userId, money } = ctx.state.JSON

        try {
            const wechatPay = new WechatPay({
                appid: config.wxPay.appId, // 应用ID
                mchid: config.wxPay.mchid, // 直连商户号
                cert_private_content: config.wxPay.api_key, // 商户API私钥内容
                cert_public_content: config.wxPay.api_cert, // 商户API证书内容
            })

            const params = {
                description: '鞋来鞋往_订单洗护', // 商品描述
                out_trade_no: orderCode, // 商户订单号
                notify_url: 'https://xlxwhxxh.cn/trade/confirm', // 通知地址

                amount: {
                    total: money, // 订单金额
                },

                payer: {
                    openid: userId, // 用户服务标识
                }
            }

            const { success, data } = await wechatPay.prepayJsapi(params);
            if (success) {
                await client.set("wx" + orderCode, JSON.stringify(data));
                await client.expire("wx" + orderCode, expirationEvent);
                await next();
            } else {
                ctx.fail(201, "加入订单失败")
            }
        } catch (e) {
            console.log("生成支付订单异常" + e);
        }

    }

    async payment(ctx, next) {

        const { payment, orderId } = ctx.request.body;
        try {
            const res = await cgeOrder({ status: 1, order_id: orderId, payment: payment });
            if (res) {
                ctx.success("修改成功")
            } else {

                await next();
            }
        } catch (e) {
            console.log("支付订单异常:" + e);
        }
    }

    //导出
    async exportOrder(ctx, next) {

        const statusMap = new Map([[0, "未付款"], [1, "待提货"], [2, "待清洗"], [3, "待配送"], [4, "已完成"], [5, "已收货"], [6, "已取消"]]);
        const paymentMap = new Map([[0, "微信支付"], [1, "余额支付"]])
        const res = await exportfindAllOrder({ status: undefined });
        const data = await res.map(item => ({
            id: item.id,
            用户id: item.user_id,
            订单id: item.order_id,
            总金额: item.actual_payment / 100,
            付款方式: paymentMap.get(item.payment),
            状态: statusMap.get(item.status),
            是否删除: item.del == 0 ? '未删除' : '删除',
            收货人: item.xlxw_address.consignee_name,
            手机号: item.xlxw_address.phone,
            地址: item.xlxw_address.dormitory_number + item.xlxw_address.lou_number,
            //显示地址
            描述: item.xlxw_address.desc,
            券减金额: item.xlxw_coupon ? item.xlxw_coupon.money / 100 : 0,
            创建时间: item.create_time,
            ip: item.ip
        }));
        const taskName = 'order-task'; // 任务名称

        await client.lPush(taskName, JSON.stringify(data));
        await client.publish('channel', 'message');
        ctx.success("导出任务建立,请等待");
    }

    async salesVolume(ctx, next) {

        let date = new Date();
        let endTime;
        let beginTime;

        endTime = addDay(date, 1);
        beginTime = subDay(date, 0);
        const res1 = await findAllOrderByTime({ beginTime: beginTime, endTime: endTime });

        endTime = subDay(date, 0);
        beginTime = subDay(date, 1);
        const res2 = await findAllOrderByTime({ beginTime: beginTime, endTime: endTime });

        endTime = addDay(date, 1);
        beginTime = subDay(date, 7);
        const res3 = await findAllOrderByTime({ beginTime: beginTime, endTime: endTime });

        beginTime = subDay(date, 30);
        endTime = addDay(date, 1);
        const res4 = await findAllOrderByTime({ beginTime: beginTime, endTime: endTime });

        const res5 = await findAllOrderByTime({ beginTime: undefined, endTime: undefined });

        ctx.success("查询成功", { "theDay": res1, "yesterDay": res2, "sevenDays": res3, "theMoth": res4, "theSum": res5 });

    }

    //返回余额的使用信息
    async findbanlance(ctx, next) {

        const { status } = ctx.request.query;
        const { userId } = ctx.state.user;
        try {
            const res = await findbanlance({ user_id: userId, status: status });
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("查询余额信息异常:" + e);
        }


    }

    async genbanlance(ctx, next) {
        const { userId } = ctx.state.user;
        const { item } = ctx.request.body;
        const fristtime = new Date().getTime();
        const orderCode = RandomNumber(undefined, fristtime);
        const moneyItem = JSON.parse(AES_Decrypt(item));

        const wechatPay = new WechatPay({
            appid: config.wxPay.appId, // 应用ID
            mchid: config.wxPay.mchid, // 直连商户号
            cert_private_content: config.wxPay.api_key, // 商户API私钥内容
            cert_public_content: config.wxPay.api_cert, // 商户API证书内容
        })

        const params = {
            description: '鞋来鞋往_订单洗护', // 商品描述
            out_trade_no: orderCode, // 商户订单号
            notify_url: 'https://xlxwhxxh.cn/trade/banlance', // 通知地址

            amount: {
                total: moneyItem.money * 100, // 订单金额
            },
            payer: {
                openid: userId, // 用户服务标识
            }
        }
        try {
            const { success, data } = await wechatPay.prepayJsapi(params);
            if (success) {
                await client.set("banlance" + orderCode, "订单");
                await client.expire("banlance" + orderCode, expirationEvent);
                ctx.success("加入订单成功", data);
            } else {
                ctx.fail(201, "加入订单失败")
            }
        } catch (e) {
            console.log("充值余额加入订单异常");
        }


    }

    async cgeblance(ctx, next) {
        ctx.success("成功");
        // const {userId} =ctx.state.user;
        // const {item} = ctx.request.body;
        // const moneyItem = JSON.parse(AES_Decrypt(item));
        // //查询金额
        // //此处需要将商品直接发货
        // try{
        //     const  orderCode= await client.get("wx"+userId);
        //     const {data} = await  getAccessTonk();
        //   //使用orderId获取到用户id
        //     const {errmsg} = await shipment(data.access_token,orderCode,userId);

        //     ctx.state.orderId={orderId:orderCode};

        //     if(errmsg==="ok"){
        //         const res =await Cbalance({user_id:userId,money:moneyItem.money*100});
        //         if(res){
        //             ctx.success("购买成功");
        //         }else {
        //         //此处需要退款
        //             await next();
        //         }
        //     }else{
        //         await next();
        //     }
        // }catch(e){
        //     console.log("充值余额异常:"+e);
        // }
    }


    //退款测试
    async RefundTest(ctx, next) {
        const { orderId } = ctx.state.orderId;
        const wechatPay = new WechatPay({
            appid: config.wxPay.appId, // 应用ID
            mchid: config.wxPay.mchid, // 直连商户号
            cert_private_content: config.wxPay.api_key, // 商户API私钥内容
            cert_public_content: config.wxPay.api_cert, // 商户API证书内容
        })
        const { data: { amount } } = await wechatPay.queryOrderByOutTradeNo(orderId);
        console.log("支付金额" + amount.payer_total);

        const fristtime = new Date().getTime();
        const orderCode = RandomNumber(undefined, fristtime);

        const params = {
            out_trade_no: orderId,
            out_refund_no: orderCode,
            reason: "支付异常",
            amount: {
                refund: amount.payer_total,
                total: amount.payer_total,
                currency: "CNY",
            },
        }
        try {
            const res = await wechatPay.createRefund(params);
            ctx.fail(201, "支付异常,支付金额已退回")
        } catch (e) {
            console.log("出现异常后退款异常:" + e);
        }

    }


    //查询文件a
    async findFile(ctx, next) {
        const filePath = `${config.webPath}/../xsxl/`;
        const str = /[\S]+订单表.xlsx/;

        try {
            const files = await fs.readdirSync(filePath);
            let dirfiles = [];

            files.forEach(file => {
                console.log(file);
                if (str.test(file)) {
                    dirfiles.push(file);
                }
            })
            ctx.success("成功", dirfiles);
        } catch (e) {
            console.log("查询文件异常:" + e);
        }
    }

    async download(ctx, next) {

        try {
            const { fileName } = ctx.request.body;

            const sanitizedFileName = encodeURIComponent(fileName);

            const filePath = `${config.webPath}/../xsxl/${fileName}`;
            const stats = fs.statSync(filePath);
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.set('Content-Disposition', `attachment; filename="${sanitizedFileName}"`);
            ctx.set('Content-Length', stats.size);
            const fileStream = await fs.createReadStream(filePath);

            fileStream.on('end', () => {
                fs.unlinkSync(filePath)

            })

            ctx.body = fileStream;
        } catch (e) {
            ctx.fail(404, "未找到下载文件");
        }

    }

    async delFiles(ctx, next) {
        try {
            const { fileNames } = ctx.request.body;
            fileNames.forEach(item => {
                const filePath = `${config.webPath}/../xsxl/${item}`;
                fs.unlinkSync(filePath);
            });
            ctx.success('清空完毕')
        } catch (e) {
            ctx.fail(201, "清空失败");
        }
    }

    //支付成功后的回调地址
    async confirm(ctx, next) {
        //支付后修改订单信息
        const { summary, resource } = ctx.request.body;

        //修改订单信息
        if (summary === '支付成功') {


            const wechatPay = new WechatPay({
                appid: config.wxPay.appId, // 应用ID
                mchid: config.wxPay.mchid, // 直连商户号
                cert_private_content: config.wxPay.api_key, // 商户API私钥内容
                cert_public_content: config.wxPay.api_cert, // 商户API证书内容
            })

            try {
                const decryptedDataText = wechatPay.decryptAesGcm({
                    ciphertext: resource.ciphertext, // 密文
                    associatedData: resource.associated_data, // 附加数据
                    nonce: resource.nonce, // 随机串
                    apiV3Key: config.wxPay.apiv3_key, // APIv3密钥
                })

                const { out_trade_no } = JSON.parse(decryptedDataText);
                const order = await findOrder({ order_id: out_trade_no, payment: 0, status: 1 });
                if (!order) {
                    const res = await cgeOrder({ status: 1, order_id: out_trade_no, payment: 0 });
                }
                ctx.success("购买成功");
            } catch (e) {
                //修改状态错误会将支付金额返还
                ctx.state.orderId = { orderId: out_trade_no };
                await next();
            }

        }

    }

    async banlance(ctx, next) {
        const { summary, resource } = ctx.request.body;
        //修改订单信息
        if (summary === '支付成功') {

            const wechatPay = new WechatPay({
                appid: config.wxPay.appId, // 应用ID
                mchid: config.wxPay.mchid, // 直连商户号
                cert_private_content: config.wxPay.api_key, // 商户API私钥内容
                cert_public_content: config.wxPay.api_cert, // 商户API证书内容
            })

            const decryptedDataText = wechatPay.decryptAesGcm({
                ciphertext: resource.ciphertext, // 密文
                associatedData: resource.associated_data, // 附加数据
                nonce: resource.nonce, // 随机串
                apiV3Key: config.wxPay.apiv3_key, // APIv3密钥
            })
            //取出支付的订单号和用户id
            const { out_trade_no, payer: { openid }, amount: { total } } = JSON.parse(decryptedDataText);


            if (await client.exists("banlance" + out_trade_no)) {
                try {
                    let money = 0;
                    if (total < 10000) {
                        money = total;
                    } else if (total >= 10000 && total < 20000) {
                        money = total + 500;
                    } else if (total >= 20000 && total < 50000) {
                        money = total + 2000
                    } else if (total >= 50000) {
                        money = total + 8000;
                    }
                    const res = await Cbalance({ user_id: openid, money: money });
                    await client.del('banlance' + out_trade_no);
                    console.log("余额充值成功");
                } catch (e) {
                    ctx.state.orderId = { orderId: out_trade_no };
                    await next();
                    console.log("充值余额异常:" + e);
                }

            }
        }
    }
}



module.exports = new trade()