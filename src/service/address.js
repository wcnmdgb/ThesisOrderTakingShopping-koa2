const { Op } = require("sequelize");

const Sequelize = require('sequelize');
const XlxwAddress = require('../db/index').xlxw_address;
class Address {


    async FindAllAddRess({ id, user_id, del = 0, phone, dormitory_number, lou_number, desc, update_time, create_time, consignee_name, checked }) {

        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        user_id && Object.assign(whereOpt, { user_id })
        del != undefined && Object.assign(whereOpt, { del })
        phone && Object.assign(whereOpt, { phone })
        dormitory_number && Object.assign(whereOpt, { dormitory_number })
        lou_number && Object.assign(whereOpt, { lou_number })
        desc && Object.assign(whereOpt, { desc })
        update_time && Object.assign(whereOpt, { update_time })
        create_time && Object.assign(whereOpt, { create_time })
        consignee_name && Object.assign(whereOpt, { consignee_name })
        checked != undefined && Object.assign(whereOpt, { checked })

        const res = XlxwAddress.findAll({
            where: whereOpt,
            attributes: ['id', 'user_id', 'del', 'phone', 'dormitory_number', 'lou_number', 'desc', 'update_time', 'create_time', 'consignee_name', 'checked'],
        })

        return res ? res : null;
    }


    async EditAddRess({ id, user_id, phone, dormitory_number, lou_number, desc, consignee_name, checked, del }) {
        const whereOpt = {}
        const AddressOpt = {}

        const date = new Date();

        id && Object.assign(whereOpt, { id })
        user_id && Object.assign(whereOpt, { user_id })
        del && Object.assign(AddressOpt, { del })
        phone && Object.assign(AddressOpt, { phone })
        dormitory_number && Object.assign(AddressOpt, { dormitory_number })
        lou_number && Object.assign(AddressOpt, { lou_number })
        desc != undefined && Object.assign(AddressOpt, { desc })

        consignee_name && Object.assign(AddressOpt, { consignee_name })
        checked != undefined && Object.assign(AddressOpt, { checked })
        Object.assign(AddressOpt, { update_time: date })

        const res = await XlxwAddress.update(AddressOpt, { where: whereOpt })

        return res ? res : null;
    }

    async CAddRes({ user_id, phone, dormitory_number, lou_number, desc, consignee_name, checked, del = 0 }) {

        const AddressOpt = {}
        const date = new Date();

        user_id && Object.assign(AddressOpt, { user_id })
        del != undefined && Object.assign(AddressOpt, { del })
        phone && Object.assign(AddressOpt, { phone })
        dormitory_number && Object.assign(AddressOpt, { dormitory_number })
        lou_number && Object.assign(AddressOpt, { lou_number })
        desc && Object.assign(AddressOpt, { desc })

        consignee_name && Object.assign(AddressOpt, { consignee_name })
        checked != undefined && Object.assign(AddressOpt, { checked })
        Object.assign(AddressOpt, { update_time: date })
        Object.assign(AddressOpt, { create_time: date })

        const res = await XlxwAddress.create(AddressOpt)

        return res ? res : null;
    }

}

module.exports = new Address();