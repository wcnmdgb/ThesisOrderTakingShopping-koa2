const { object, date, required } = require('joi');
const { Op } = require("sequelize");
const Sequelize = require('sequelize');
const order = require('../db/index').xlxw_order
const ordertrade = require('../db/index').xlxw_order_trade;
const trade = require('../db/index').xlxw_trade;
const coupon = require('../db/index').xlxw_coupon
const xlxwAddress = require('../db/index').xlxw_address;


class orderService {

    //存储订单信息
    async COrder({ order_id, user_id, actual_payment, payment, address_id, ip, status, del, coupon_id }) {
        const OrderOpt = {}
        const date = new Date();

        order_id && Object.assign(OrderOpt, { order_id })
        user_id && Object.assign(OrderOpt, { user_id })
        coupon_id && Object.assign(OrderOpt, { coupon_id })
        actual_payment && Object.assign(OrderOpt, { actual_payment })
        payment && Object.assign(OrderOpt, { payment })
        address_id && Object.assign(OrderOpt, { address_id })
        ip && Object.assign(OrderOpt, { ip })
        status != undefined && Object.assign(OrderOpt, { status })
        del != undefined && Object.assign(OrderOpt, { del })
        Object.assign(OrderOpt, { create_time: date })
        Object.assign(OrderOpt, { update_time: date })

        const res = await order.create(OrderOpt);
        return res ? res : null;
    }


    async findOrder({ order_id, user_id, actual_payment, payment, address_id, ip, status, del, coupon_id }) {
        const whereOpt = {}

        order_id != undefined && Object.assign(whereOpt, { order_id })
        user_id != undefined && Object.assign(whereOpt, { user_id })
        coupon_id != undefined && Object.assign(whereOpt, { coupon_id })
        actual_payment != undefined && Object.assign(whereOpt, { actual_payment })
        payment != undefined && Object.assign(whereOpt, { payment })
        address_id != undefined && Object.assign(whereOpt, { address_id })
        ip != undefined && Object.assign(whereOpt, { ip })
        status != undefined && Object.assign(whereOpt, { status })
        del != undefined && Object.assign(whereOpt, { del })

        const res = await order.findOne({
            where: whereOpt
        });
        return res ? res.dataValues : null;
    }


    //修改订单信息
    async cgeOrder({ order_id, user_id, actual_payment, payment, address_id, ip, status, del, coupon_id }) {
        const whereOpt = {}
        const orderOpt = {}


        order_id && Object.assign(whereOpt, { order_id })
        user_id && Object.assign(whereOpt, { user_id })
        coupon_id && Object.assign(whereOpt, { coupon_id })
        actual_payment && Object.assign(whereOpt, { actual_payment })

        address_id && Object.assign(whereOpt, { address_id })
        ip && Object.assign(whereOpt, { ip })

        payment != undefined && Object.assign(orderOpt, { payment })
        status != undefined && Object.assign(orderOpt, { status })
        del != undefined && Object.assign(orderOpt, { del })

        const res = await order.update(orderOpt, {
            where: whereOpt
        })
        return res ? res : null;
    }



    async COrderTrade(orderTrades) {
        //批量添加数据
        const res = ordertrade.bulkCreate(orderTrades);
        return res ? res : null;
    }


    async derDetails({ order_id, user_id, actual_payment, payment, address_id, ip, status, del, coupon_id }) {


        const whereOpt = {}

        order_id && Object.assign(whereOpt, { order_id })
        user_id && Object.assign(whereOpt, { user_id })
        coupon_id && Object.assign(whereOpt, { coupon_id })
        actual_payment && Object.assign(whereOpt, { actual_payment })
        payment && Object.assign(whereOpt, { payment })
        address_id && Object.assign(whereOpt, { address_id })
        ip && Object.assign(whereOpt, { ip })
        status != undefined && Object.assign(whereOpt, { status })
        del != undefined && Object.assign(whereOpt, { del })

        const res = await order.findOne({
            where: whereOpt,
            attributes: ['id', 'order_id', 'user_id', 'actual_payment', 'payment', 'address_id', 'ip', 'status', 'del', 'coupon_id', 'create_time'],
            include: [
                {
                    model: xlxwAddress
                },
                {
                    model: ordertrade,
                    attributes: ['id', 'order_id', 'trade_id', 'number'],
                    include: [{
                        model: trade,
                    }
                    ]
                }
            ],
        });
        return res ? res : null;
    }



    async findAllOrder({ order_id, user_id, actual_payment, payment, address_id, ip, status, del, coupon_id, index, len = 10 }) {
        const whereOpt = {}

        order_id && Object.assign(whereOpt, { order_id: { [Op.startsWith]: order_id } })
        user_id && Object.assign(whereOpt, { user_id })
        coupon_id && Object.assign(whereOpt, { coupon_id })
        actual_payment && Object.assign(whereOpt, { actual_payment })
        payment && Object.assign(whereOpt, { payment })
        address_id && Object.assign(whereOpt, { address_id })
        ip && Object.assign(whereOpt, { ip })
        status != undefined && Object.assign(whereOpt, { status })
        del != undefined && Object.assign(whereOpt, { del })


        const res = await order.findAndCountAll({
            where: whereOpt,
            attributes: ['id', 'order_id', 'user_id', 'actual_payment', 'payment', 'address_id', 'ip', 'status', 'update_time', 'create_time', 'del', 'coupon_id'],
            distinct: true,
            include: [
                {
                    model: xlxwAddress,
                },
                {
                    model: ordertrade,
                    attributes: ['id', 'order_id', 'trade_id', 'number'],
                    include: [{
                        model: trade,
                    }
                    ]
                }

            ],
            offset: (index - 1) * len,
            limit: len,
            order: [['update_time', 'desc']]

        });
        return res ? res : null;
    }


    async exportfindAllOrder({ order_id, user_id, actual_payment, payment, address_id, ip, status, del, coupon_id }) {
        const whereOpt = {}

        order_id && Object.assign(whereOpt, { order_id })
        user_id && Object.assign(whereOpt, { user_id })
        coupon_id && Object.assign(whereOpt, { coupon_id })
        actual_payment && Object.assign(whereOpt, { actual_payment })
        payment && Object.assign(whereOpt, { payment })
        address_id && Object.assign(whereOpt, { address_id })
        ip && Object.assign(whereOpt, { ip })
        status != undefined && Object.assign(whereOpt, { status })
        del != undefined && Object.assign(whereOpt, { del })


        const res = await order.findAll({
            where: whereOpt,
            attributes: ['id', 'order_id', 'user_id', 'actual_payment', 'payment', 'address_id', 'ip', 'status', 'update_time', 'create_time', 'del', 'coupon_id'],
            include: [
                {
                    model: xlxwAddress
                },
                {
                    model: coupon
                }
            ],

            order: [['update_time', 'desc']]

        });
        return res;
    }

    //根据时间获取订单的全部信息

    async findAllOrderByTime({ beginTime, endTime }) {

        const WhereOpt = {}


        Object.assign(WhereOpt, { create_time: { [Op.between]: [beginTime, endTime] } });

        const res = await order.findAll({
            where: WhereOpt,
            attributes: ['id', 'order_id', 'user_id', 'actual_payment', 'payment', 'address_id', 'ip', 'status', 'update_time', 'create_time', 'del', 'coupon_id'],
        })
        return res ? res : null;

    }

}

module.exports = new orderService()