



const { el } = require('date-fns/locale');
const { findCoupon, createCoupon, findGivCopupon, finOneCouppon, cgeCoupponU, alterCoupon, subNumberCoupon, findUserCoupon, CCouponUser, FindCouppon, findOneCouponUser } = require('../service/coupon')
const { AES_Decrypt } = require("../utils/crypt");
const { number } = require('joi');


class Coupon {

    async findAllCoupon(ctx, next) {
        try {
            const { title, money, status, index } = ctx.request.query;
            const res = await findCoupon({ title: title, money: money, status: status, index: index, len: 10 });
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("优惠券查询代码错误:" + e);
        }


    }

    async createCoupon(ctx, next) {

        const { title, money, condition, number, status } = ctx.request.body;

        const { userId } = ctx.state.user;


        try {
            if (await createCoupon({ title: title, money: money * 100, condition: condition * 100, number: number, status: status, user_id: userId })) {
                ctx.success("添加成功");

            } else {
                ctx.fail(201, "添加失败")
            }
        } catch (e) {
            console.log("优惠券添加代码异常:" + e);
        }

    }

    async alterCoupon(ctx, next) {

        const { id, title, status, del } = ctx.request.body;
        try {
            if (await alterCoupon({ id: id, title: title, status: status, del: del })) {
                ctx.success("修改成功");
            } else {
                ctx.fail(201, "修改失败")
            }
        } catch (e) {
            console.log("修改优惠券代码异常" + e);
        }
    }

    async delCoupon(ctx, next) {
        const { ids } = ctx.request.query;
        try {
            if (await alterCoupon({ id: JSON.parse(ids), del: 1 })) {
                ctx.success("删除成功");
            } else {
                ctx.fail(201, "删除失败");
            }
        } catch (e) {
            console.log("删除优惠券代码异常:" + e);
        }
    }

    async findUserCoupon(ctx, next) {

        const { userId } = ctx.state.user

        const { status, condition } = ctx.request.query;

        try {
            const res = await findUserCoupon({ user_id: userId, status: status, condition })
            //获取用户自己的优惠券

            ctx.success("获取成功", res);
        } catch (e) {
            console.log("获取用户优惠券异常:" + e);
        }
    }

    //查询全部的券
    async findCoupon(ctx, next) {
        try {
            const res = await FindCouppon({ status: 0 });
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("获取全部的优惠券异常:" + e);
        }

    }

    //校验是否抢购过

    async checkCouppon(ctx, next) {

        const { userId } = ctx.state.user

        const { couponId } = ctx.request.body;


        try {
            ctx.state.userinfo = { userId: userId, couponId: couponId };

            const res = await findOneCouponUser({ user_id: userId, coupon_id: couponId });
            console.log(res);

            if (res) {
                ctx.fail(201, "已抢过票");

            } else {
                await next();
            }
        } catch (e) {
            console.log("校验是否抢购过券异常:" + e);
            ctx.fail(201, "已抢过票");
        }



    }
    //校验是否有余票

    async obtainCouppon(ctx, next) {

        const { userId, couponId } = ctx.state.userinfo
        //获取用户信息
        const res = await finOneCouppon({ id: couponId, status: 0 });
        console.log(res);
        //在couponUser中添加 一列
        if (!res) {
            ctx.fail(201, "没有余券")
        } else {
            let status = res.number === 1 ? 2 : 0;
            ctx.state.status = { status: status, number: res.number - 1 };
            await next();
        }
        //修改coupon中的number
    }

    async seizeCoupons(ctx, next) {

        const { status, number } = ctx.state.status;
        const { userId, couponId } = ctx.state.userinfo
        try {
            if (await subNumberCoupon({ id: couponId, status: status, number: number })) {
                //添加一列
                if (await CCouponUser({ user_id: [userId], coupon_id: couponId })) {

                    ctx.success("抢券成功");
                } else {
                    ctx.fail(201, "抢券失败")
                }
            } else {
                ctx.fail(201, "抢券失败")
            }
        } catch (e) {
            console.log("抢券异常:" + e);
            ctx.fail(201, "抢券失败")
        }
    }

    async verifyCoupponU(ctx, next) {


        const { orderAes } = ctx.request.body;
        const orderJson = JSON.parse(AES_Decrypt(orderAes));

        const fristtime = new Date().getTime();
        ctx.state.JSON = ({ addrId: orderJson.addrId, couponId: orderJson.couponId, fristtime: fristtime });


        try {
            if (orderJson.couponId === undefined) {
                await next();

            } else {

                const { userId } = ctx.state.user
                const res = await cgeCoupponU({ coupon_id: orderJson.couponId, user_id: userId, status: 1 })

                if (res) {
                    await next();
                } else {
                    ctx.fail(201, "优惠券错误")
                }
            }
        } catch (e) {
            console.log("判断购物是否使用券和修改券状态异常:" + e);
        }
    }

    async findGivcouppon(ctx, next) {
        const { status } = ctx.request.query;
        try {
            const res = await findGivCopupon({ status: status })
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("查询不同状态的券异常:" + e);
        }

    }

    //校验是否拥有
    async verifyHave(ctx, next) {

        const { userId, couponId } = ctx.request.body;
        try {
            const res = await findOneCouponUser({ user_id: userId, coupon_id: couponId });
            if (res) {
                ctx.fail(201, "用户已获得过该券")
            } else {
                await next();
            }
        } catch (e) {
            console.log("查询用户是否获得过该券异常:" + e);
        }
    }
    //校验数量是否足够
    async verifyNumber(ctx, next) {

        const { userId, couponId } = ctx.request.body;
        try {
            const res = await finOneCouppon({ id: couponId, status: 3 });
            if (res.number >= userId.length) {
                ctx.state.orderNumber = { number: res.number - userId.length };
                await next();
            } else {
                ctx.fail(201, "余券数量不够");
            }
        } catch (e) {
            console.log("判断余券数量异常:" + e);
        }

    }


    async subGiveCoupon(ctx, next) {

        const { userId, couponId } = ctx.request.body;
        const { number } = ctx.state.orderNumber;
        try {
            if (await subNumberCoupon({ id: couponId, number: number })) {

                if (await CCouponUser({ user_id: userId, coupon_id: couponId })) {

                    ctx.success("发券成功");
                } else {
                    ctx.fail(201, "发券失败");
                }
            }
        } catch (e) {
            console.log("发券异常:" + e);
        }

    }

}

module.exports = new Coupon()