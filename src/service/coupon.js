const { object, date } = require('joi');
const { Op } = require("sequelize");
const Sequelize = require('sequelize');
const Coupon = require('../db/index').xlxw_coupon
const CouponUser = require('../db/index').xlxw_coupon_user
const AdminUser = require('../db/index').admin_user

class CoupponService {

    async findCoupon({ id, money, condition, user_id, number, status, del = 0, title, index, len }) {
        const whereOpt = {};

        id && Object.assign(whereOpt, { id });
        money != undefined && Object.assign(whereOpt, { money });
        condition && Object.assign(whereOpt, { condition });
        user_id && Object.assign(whereOpt, { user_id });
        number && Object.assign(whereOpt, { number });
        status != undefined && Object.assign(whereOpt, { status });
        del != undefined && Object.assign(whereOpt, { del });
        title && Object.assign(whereOpt, { title: { [Op.startsWith]: title } });

        const res = await Coupon.findAndCountAll({
            attributes: ['id', 'money', 'condition', 'user_id', 'number', 'status', 'title'],
            where: whereOpt,
            include: [
                {
                    model: AdminUser,
                    attributes: ['user_name']
                }
            ],
            offset: (index - 1) * len,
            limit: len

        })

        return res ? res : null;


    }

    async createCoupon({ money, condition, user_id, number, status, del = 0, title }) {
        const CouponOpt = {};

        money != undefined && Object.assign(CouponOpt, { money });
        condition && Object.assign(CouponOpt, { condition });
        user_id && Object.assign(CouponOpt, { user_id });
        number && Object.assign(CouponOpt, { number });
        status != undefined && Object.assign(CouponOpt, { status });
        del != undefined && Object.assign(CouponOpt, { del });
        title && Object.assign(CouponOpt, { title });
        console.log("打印" + JSON.stringify(CouponOpt));

        const res = await Coupon.create(CouponOpt);
        return res ? res.dataValues : null;

    }

    async alterCoupon({ id, money, condition, user_id, number, status, del, title }) {
        const CouponOpt = {};
        const WhereOpt = {};

        id && Object.assign(WhereOpt, { id });
        money != undefined && Object.assign(CouponOpt, { money });
        condition && Object.assign(CouponOpt, { condition });
        user_id && Object.assign(CouponOpt, { user_id });
        number && Object.assign(CouponOpt, { number });
        status != undefined && Object.assign(CouponOpt, { status });
        del != undefined && Object.assign(CouponOpt, { del });
        title && Object.assign(CouponOpt, { title });
        const res = await Coupon.update(CouponOpt, { where: WhereOpt });
        return res ? res : null;
    }


    async subNumberCoupon({ id, money, condition, user_id, number: number, status, del, title }) {
        const CouponOpt = {};
        const WhereOpt = {};

        id && Object.assign(WhereOpt, { id });
        money != undefined && Object.assign(CouponOpt, { money });
        condition && Object.assign(CouponOpt, { condition });
        user_id && Object.assign(CouponOpt, { user_id });
        status != undefined && Object.assign(CouponOpt, { status });
        del != undefined && Object.assign(CouponOpt, { del });
        title && Object.assign(CouponOpt, { title });
        number != undefined && Object.assign(CouponOpt, { number });
        // Object.assign(CouponOpt, { number: Sequelize.literal('`number` - 1') });
        console.log("获取值为" + CouponOpt)

        const res = await Coupon.update(CouponOpt, { where: WhereOpt });
        return res ? res : null;
    }


    //查询用户对应的优惠券
    async findUserCoupon({ id, user_id, create_time, update_time, coupon_id, status, condition }) {
        console.log("解析id" + id);
        const whereOpt = {};
        const whereCoupon = {};
        id && Object.assign(whereOpt, { id });
        user_id && Object.assign(whereOpt, { user_id });
        create_time && Object.assign(whereOpt, { create_time });
        update_time && Object.assign(whereOpt, { update_time });

        coupon_id && Object.assign(whereOpt, { coupon_id });
        status != undefined && Object.assign(whereOpt, { status });


        condition && Object.assign(whereCoupon, { condition: { [Op.lte]: condition } })
        const res = await CouponUser.findAll({
            where: whereOpt,
            attributes: ['id', 'user_id', 'create_time', 'update_time', 'coupon_id', 'status'],
            include: [
                {
                    model: Coupon,
                    where: whereCoupon,
                    attributes: ['id', 'money', 'condition', 'user_id', 'number', 'status', 'title']
                }
            ],
        })
        return res ? res : null;
    }





    async FindCouppon({ id, money, condition, admin_user_id, number = 0, status = 0, del = 0, title, user_id }) {

        const WhereOpt = {};
        id != undefined && Object.assign(WhereOpt, { id });
        money != undefined && Object.assign(WhereOpt, { money });
        condition && Object.assign(WhereOpt, { condition });
        admin_user_id && Object.assign(WhereOpt, { user_id: admin_user_id });
        //number数量大于0
        Object.assign(WhereOpt, { number: { [Op.gt]: number } });
        status != undefined && Object.assign(WhereOpt, { status });
        del != undefined && Object.assign(WhereOpt, { del });
        title && Object.assign(WhereOpt, { title });

        // const CouponUserWhere = {}

        // user_id && Object.assign(CouponUserWhere, { user_id });

        const res = await Coupon.findAll({

            where: WhereOpt,
            attributes: ['id', 'money', 'condition', 'user_id', 'number', 'status', 'title'],
            include: [
                {
                    model: CouponUser,
                    // where: CouponUserWhere,
                    attributes: ['user_id']
                }
            ],
        })
        return res ? res : null;

    }




    async findOneCouponUser({ id, user_id, create_time, update_time, coupon_id, status }) {

        const whereOpt = {};
        id && Object.assign(whereOpt, { id });
        user_id && Object.assign(whereOpt, { user_id });
        create_time && Object.assign(whereOpt, { create_time });
        update_time && Object.assign(whereOpt, { update_time });

        coupon_id && Object.assign(whereOpt, { coupon_id });
        status != undefined && Object.assign(whereOpt, { status });

        const res = await CouponUser.findOne({
            where: whereOpt,
            attributes: ['id', 'user_id', 'create_time', 'update_time', 'coupon_id', 'status'],
        })
        return res ? res.dataValues : null;
    }

    //修改用户券状态
    async cgeCoupponU({ id, user_id, coupon_id, status, condition }) {
        const whereOpt = {};
        const CoupponOpt = {}

        id && Object.assign(whereOpt, { id });
        user_id && Object.assign(whereOpt, { user_id });
        coupon_id != undefined && Object.assign(whereOpt, { coupon_id });

        status != undefined && Object.assign(CoupponOpt, { status });
        condition != undefined && Object.assign(CoupponOpt, { status });

        const res = await CouponUser.update(CoupponOpt, {
            where: whereOpt
        })
        return res ? res : null;
    }

    async finOneCouppon({ id, user_id, money, status, del, number = 0, title, condition }) {
        const WhereOpt = {};

        id && Object.assign(WhereOpt, { id });
        money != undefined && Object.assign(WhereOpt, { money });
        condition && Object.assign(WhereOpt, { condition });
        user_id && Object.assign(WhereOpt, { user_id });
        status != undefined && Object.assign(WhereOpt, { status });
        del != undefined && Object.assign(WhereOpt, { del });
        title && Object.assign(WhereOpt, { title });
        Object.assign(WhereOpt, { number: { [Op.gt]: number } });
        console.log("获取值为" + WhereOpt)
        const res = await Coupon.findOne({
            where: WhereOpt
        })

        return res ? res.dataValues : null;

    }


    async CCouponUser({ user_id, coupon_id, status = 0 }) {


        const CouponUserOptList = [];
        const date = new Date();
        console.log(user_id.length);

        for (let i = 0; user_id.length > i; i++) {

            const CouponUserOpt = {}
            coupon_id && Object.assign(CouponUserOpt, { coupon_id });
            status != undefined && Object.assign(CouponUserOpt, { status });

            Object.assign(CouponUserOpt, { user_id: user_id[i] });
            Object.assign(CouponUserOpt, { create_time: date });
            Object.assign(CouponUserOpt, { update_time: date });
            CouponUserOptList.push(CouponUserOpt);
        }
        const res = await CouponUser.bulkCreate(CouponUserOptList);

        return res ? res : null;

    }

    async findGivCopupon({ id, money, condition, user_id, number = 0, status, del = 0, title }) {
        const whereOpt = {};

        id && Object.assign(whereOpt, { id });
        money != undefined && Object.assign(whereOpt, { money });
        condition && Object.assign(whereOpt, { condition });
        user_id && Object.assign(whereOpt, { user_id });
        Object.assign(whereOpt, { number: { [Op.gt]: number } });
        status != undefined && Object.assign(whereOpt, { status });
        del != undefined && Object.assign(whereOpt, { del });
        title && Object.assign(whereOpt, { title: { [Op.startsWith]: title } });

        const res = await Coupon.findAll({
            attributes: ['id', 'money', 'condition', 'user_id', 'number', 'status', 'title'],
            where: whereOpt,
        })

        return res ? res : null;


    }

}




module.exports = new CoupponService()