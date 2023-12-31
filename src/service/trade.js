const { object, date } = require('joi');
const { Op } = require("sequelize");

const Trade = require("../db/index").xlxw_trade;

const productType = require("../db/index").product_type;
const banance = require("../db/index").xlxw_balance;

class tradeService {
    //设置默认展示上架的产品
    async findAllTrade({ id, name, desc, image, product_type_id, money, create_time, update_time, del = 0, index, len, status }) {
        const whereOpt = {};
        id != undefined && Object.assign(whereOpt, { id });
        name != undefined && Object.assign(whereOpt, { name: { [Op.startsWith]: name } });
        desc != undefined && Object.assign(whereOpt, { desc });
        image != undefined && Object.assign(whereOpt, { image });
        product_type_id != undefined && Object.assign(whereOpt, { product_type_id });
        money != undefined && Object.assign(whereOpt, { money });
        create_time != undefined && Object.assign(whereOpt, { create_time });
        update_time != undefined && Object.assign(whereOpt, { update_time });
        del != undefined && Object.assign(whereOpt, { del });
        status != undefined && Object.assign(whereOpt, { status })

        const res = await Trade.findAndCountAll({
            attributes: ['id', 'name', 'desc', 'image', 'money', 'create_time', 'update_time', 'del', 'status', 'product_type_id'],
            where: whereOpt,
            include: [
                {
                    model: productType,
                    attributes: ['label']
                }
            ],
            offset: (index - 1) * len,
            limit: len
        });
        return res ? res : null;
    }


    async findTrade({ id, name, desc, image, product_type_id, money, create_time, update_time, del = 0, status }) {
        const whereOpt = {};
        id && Object.assign(whereOpt, { id });
        name && Object.assign(whereOpt, { name: { [Op.startsWith]: name } });
        desc && Object.assign(whereOpt, { desc });
        image && Object.assign(whereOpt, { image });
        product_type_id && Object.assign(whereOpt, { product_type_id });
        money && Object.assign(whereOpt, { money });
        create_time && Object.assign(whereOpt, { create_time });
        update_time && Object.assign(whereOpt, { update_time });

        status != undefined && Object.assign(whereOpt, { status })
        Object.assign(whereOpt, {
            [Op.or]: [
                {
                    del: {
                        del
                    }
                },
                {
                    status: {
                        status
                    }
                }
            ]
        }
        )

        const res = await Trade.findAll({
            attributes: ['id', 'name', 'desc', 'image', 'money', 'create_time', 'update_time', 'del', 'status', 'product_type_id'],
            where: whereOpt,
        });
        return res ? res : null;
    }



    async findTradeTypeAll({ id, label, create_time, del = 0, status }) {
        const whereOpt = {};

        id && Object.assign(whereOpt, { id });
        label && Object.assign(whereOpt, { label });
        create_time && Object.assign(whereOpt, { create_time });
        del != undefined && Object.assign(whereOpt, { del });
        status != undefined && Object.assign(whereOpt, { status })
        const res = productType.findAll({
            attributes: ['id', 'label', 'create_time', 'del', 'status'],
            where: whereOpt
        });
        return res ? res : null;

    }

    async findOneProductType({ id, label, create_time, del = 0, status }) {
        const whereOpt = {}

        id && Object.assign(whereOpt, { id });
        label && Object.assign(whereOpt, { label });
        create_time && Object.assign(whereOpt, { create_time });
        del != undefined && Object.assign(whereOpt, { del });
        status != undefined && Object.assign(whereOpt, { status })
        const res = productType.findOne({
            attributes: ['id', 'label', 'create_time', 'del', 'status'],
            where: whereOpt
        });
        return res ? res.dataValues : null;

    }

    async addTrade({ name, desc, image, money, del = 0, product_type_id, status }) {
        const tradeOpt = {};
        const date = new Date();

        name && Object.assign(tradeOpt, { name });
        desc && Object.assign(tradeOpt, { desc });
        image && Object.assign(tradeOpt, { image });
        product_type_id && Object.assign(tradeOpt, { product_type_id });
        money && Object.assign(tradeOpt, { money });
        del != undefined && Object.assign(tradeOpt, { del });
        status != undefined && Object.assign(tradeOpt, { status })

        Object.assign(tradeOpt, { update_time: date })
        Object.assign(tradeOpt, { create_time: date })


        const res = await Trade.create(tradeOpt);
        return res ? res.dataValues : null;
    }

    async updateTrade({ id, name, desc, image, money, del, product_type_id, create_time, status }) {
        const tradeOpt = {};
        const whereOpt = {};
        const date = new Date();
        id && Object.assign(whereOpt, { id });
        name && Object.assign(tradeOpt, { name });
        desc != undefined && Object.assign(tradeOpt, { desc });
        image && Object.assign(tradeOpt, { image });
        product_type_id && Object.assign(tradeOpt, { product_type_id });
        money && Object.assign(tradeOpt, { money });
        create_time && Object.assign(create_time, { create_time });
        del != undefined && Object.assign(tradeOpt, { del });
        Object.assign(tradeOpt, { update_time: date });
        status != undefined && Object.assign(tradeOpt, { status })

        const res = await Trade.update(tradeOpt, { where: whereOpt });
        return res ? res : null;

    }


    async updateTradeByTypeId({ id, name, desc, image, money, del, product_type_id, create_time, status }) {
        const tradeOpt = {};
        const whereOpt = {};
        const date = new Date();
        product_type_id && Object.assign(whereOpt, { product_type_id });

        name && Object.assign(tradeOpt, { name });
        desc && Object.assign(tradeOpt, { desc });
        image && Object.assign(tradeOpt, { image });
        id && Object.assign(tradeOpt, { id });
        money && Object.assign(tradeOpt, { money });
        create_time && Object.assign(create_time, { create_time });
        del != undefined && Object.assign(tradeOpt, { del });
        Object.assign(tradeOpt, { update_time: date });
        status != undefined && Object.assign(tradeOpt, { status })

        const res = await Trade.update(tradeOpt, { where: whereOpt });
        return res ? res : null;

    }




    async findTradeTypeAllByIndex({ id, label, create_time, del = 0, index, len, status }) {

        const whereOpt = {}

        id && Object.assign(whereOpt, { id });
        label && Object.assign(whereOpt, { label: { [Op.startsWith]: label } });
        create_time && Object.assign(whereOpt, { create_time });
        del != undefined && Object.assign(whereOpt, { del });
        status != undefined && Object.assign(whereOpt, { status });
        const res = await productType.findAndCountAll({
            attributes: ['id', 'label', 'create_time', 'del', 'status'],
            where: whereOpt,
            offset: (index - 1) * len,
            limit: len
        })
        return res;

    }

    async addTradeType({ label, del = 0, status }) {
        const date = new Date();
        const tradeTypeOpt = {};

        label && Object.assign(tradeTypeOpt, { label });
        del != undefined && Object.assign(tradeTypeOpt, { del });
        Object.assign(tradeTypeOpt, { create_time: date })
        Object.assign(tradeTypeOpt, { update_time: date })
        status != undefined && Object.assign(tradeTypeOpt, { status })
        const res = await productType.create(tradeTypeOpt);
        return res ? res.dataValues : null;
    }

    async updateTradeType({ id, del, label, create_time, status }) {

        console.log(del);
        const date = new Date();
        const tradeTypeOpt = {};
        const whereOpt = {};

        id && Object.assign(whereOpt, { id });
        label && Object.assign(tradeTypeOpt, { label: label });
        create_time && Object.assign(tradeTypeOpt, { create_time });
        del != undefined && Object.assign(tradeTypeOpt, { del });
        status != undefined && Object.assign(tradeTypeOpt, { status })
        Object.assign(tradeTypeOpt, { update_time: date })

        const res = await productType.update(tradeTypeOpt, { where: whereOpt });
        return res ? res : null;
    }


    //查询余额
    async findbanlance({ id, status, create_time, update_time, user_id }) {
        const whereOpt = {};
        id && Object.assign(whereOpt, { id })
        status != undefined && Object.assign(whereOpt, { status })
        create_time && Object.assign(whereOpt, { create_time })
        update_time && Object.assign(whereOpt, { update_time })
        user_id && Object.assign(whereOpt, { user_id })

        console.log(whereOpt);

        const res = await banance.findAll({
            where: whereOpt
        })
        return res ? res : null;

    }

    async Cbalance({ id, status = 0, create_time, update_time, user_id, money }) {

        const balanceOpt = {};
        const date = new Date();
        status != undefined && Object.assign(balanceOpt, { status });
        money != undefined && Object.assign(balanceOpt, { money });
        user_id && Object.assign(balanceOpt, { user_id });
        Object.assign(balanceOpt, { create_time: date });
        Object.assign(balanceOpt, { update_time: date })
        const res = await banance.create(balanceOpt);
        return res ? res : null;
    }
}



module.exports = new tradeService()