const { object, date } = require('joi');
const { Op } = require("sequelize");
const AdminUser = require('../db/index').admin_user;
const User = require("../db/index").xlxw_user;
const uuid = require('uuid');
const CouponUser = require('../db/index').xlxw_coupon_user
const xlxwLog = require('../db/index').xlxw_log
const xlxw_user = require('../db/index').xlxw_user
const admin_user = require('../db/index').admin_user
const xlxw_balance = require('../db/index').xlxw_balance;

class UserService {


    async createUser({ user_name, pass_word, images }) {
        const UserOpt = {}
        const date = new Date();
        const user_id = uuid.v4();

        user_name && Object.assign(UserOpt, { user_name })
        pass_word && Object.assign(UserOpt, { pass_word })
        images && Object.assign(UserOpt, { images })
        Object.assign(UserOpt, { create_time: date })
        Object.assign(UserOpt, { update_time: date })
        Object.assign(UserOpt, { user_id })

        const res = await AdminUser.create(UserOpt);
        return res ? res : null;
    }

    async findOneAdminUser({ id, user_id, user_name, pass_word, create_time, update_time }) {
        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        user_id && Object.assign(whereOpt, { user_id })
        user_name && Object.assign(whereOpt, { user_name })
        pass_word && Object.assign(whereOpt, { pass_word })

        create_time && Object.assign(whereOpt, { create_time })
        update_time && Object.assign(whereOpt, { update_time })
        const res = await AdminUser.findOne({
            attributes: ['id', 'user_name', 'permits', 'user_id', 'pass_word', 'create_time', 'update_time'],
            where: whereOpt
        })
        return res ? res.dataValues : null
    }

    //查询管理员
    async findAdminUser({ id, user_id, user_name, pass_word, create_time, update_time, index, len }) {
        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        user_id && Object.assign(whereOpt, { user_id })
        user_name && Object.assign(whereOpt, { user_name: { [Op.startsWith]: user_name } })
        pass_word && Object.assign(whereOpt, { pass_word })

        create_time && Object.assign(whereOpt, { create_time })
        update_time && Object.assign(whereOpt, { update_time })
        const res = await AdminUser.findAndCountAll({
            attributes: ['id', 'user_name', 'user_id', 'pass_word', 'create_time', 'update_time'],
            where: whereOpt,
            offset: (index - 1) * len,
            limit: len
        })

        return res ? res : null;
    }


    //修改管理员
    async UpdateAdminUser({ id, user_name, user_id, pass_word, create_time }) {
        const AdminUserOpt = {}
        const whereOpt = {}
        const date = new Date()

        id && Object.assign(whereOpt, { id })

        user_id && Object.assign(whereOpt, { user_id })
        user_name && Object.assign(AdminUserOpt, { user_name })
        pass_word && Object.assign(AdminUserOpt, { pass_word })

        create_time && Object.assign(AdminUserOpt, { create_time })

        Object.assign(AdminUserOpt, { update_time: date })

        const res = await AdminUser.update(AdminUserOpt, { where: whereOpt })

        return res ? res : null;
    }




    //查询全部普通用户的信息
    async FindUserviceser({ id, user_name, create_time, vip, index, len, ban }) {
        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        user_name && Object.assign(whereOpt, { user_name: { [Op.startsWith]: user_name } })

        vip && Object.assign(whereOpt, { vip })
        create_time && Object.assign(whereOpt, { create_time })
        ban != undefined && Object.assign(whereOpt, { ban })

        const res = await User.findAndCountAll({
            attributes: ['id', 'user_name', 'user_id', 'ban', 'create_time', 'vip'],
            where: whereOpt,
            distinct: true,
            include: {
                model: xlxw_balance
            },
            offset: (index - 1) * len,
            limit: len
        })

        return res ? res : null;
    }

    async findAllUser({ id, user_name, create_time, vip, ban }) {
        const whereOpt = {};
        id != undefined && Object.assign(whereOpt, { id })
        user_name && Object.assign(whereOpt, { user_name })

        vip && Object.assign(whereOpt, { vip })
        create_time && Object.assign(whereOpt, { create_time })
        ban != undefined && Object.assign(whereOpt, { ban })
        const res = await User.findAll({
            attributes: ['id', 'user_name', 'user_id', 'ban', 'create_time', 'vip'],
            where: whereOpt,
            include: {
                model: xlxw_balance
            },
        })

        return res ? res : null;

    }


    //修改普通用户
    async UpdatUser({ id, user_name, create_time, vip, ban, user_id }) {
        const whereOpt = {};
        const UserOpt = {};
        const date = new Date();

        id && Object.assign(whereOpt, { id })
        user_id && Object.assign(whereOpt, { user_id })

        user_name && Object.assign(UserOpt, { user_name })

        vip && Object.assign(UserOpt, { vip })
        create_time && Object.assign(UserOpt, { create_time })
        ban != undefined && Object.assign(UserOpt, { ban })
        Object.assign(UserOpt, { update_time: date });
        const res = await User.update(UserOpt, { where: whereOpt })
        return res ? res : null;

    }

    // async addUser({ user_name, money, vip, ban }) {
    //     const UserOpt = {};

    //     user_name && Object.assign(UserOpt, { user_name })
    //     money && Object.assign(UserOpt, { money })
    //     vip && Object.assign(UserOpt, { vip })
    //     ban != undefined && Object.assign(UserOpt, { ban })
    //     Object.assign(UserOpt, { update_time: date });
    //     Object.assign(UserOpt, { create_time: date });
    //     const res = await User.create(UserOpt);
    //     return res ? res : null;

    // }
    //查询普通用户是否重复
    async findUserOne({ id, user_id, user_name, vip, ban, create_time }) {
        const whereOpt = {}
        id && Object.assign(whereOpt, { id })
        user_id && Object.assign(whereOpt, { user_id })
        user_name && Object.assign(whereOpt, { user_name })

        vip && Object.assign(whereOpt, { vip })
        create_time && Object.assign(whereOpt, { create_time })
        ban != undefined && Object.assign(whereOpt, { ban })

        const res = await User.findOne({
            attributes: ['id', 'user_name', 'user_id', 'ban', 'create_time', 'vip'],
            where: whereOpt
        })

        return res ? res.dataValues : null;
    }

    async CUniUser({ user_id, user_name, vip = 0, ban = 0 }) {

        const userOpt = {}
        const date = new Date();

        user_id && Object.assign(userOpt, { user_id })
        user_name && Object.assign(userOpt, { user_name })
        vip != undefined && Object.assign(userOpt, { vip })
        ban != undefined && Object.assign(userOpt, { ban })

        Object.assign(userOpt, { create_time: date })
        Object.assign(userOpt, { update_time: date })


        const res = await User.create(userOpt);
        return res ? res : null;

    }

    //查询普通用户 然后查询其绑定的优惠券信息

    async findUserInfo({ id, user_id, user_name, vip, ban, create_time }) {
        const whereOpt = {}

        id && Object.assign(whereOpt, { id })
        user_id && Object.assign(whereOpt, { user_id })
        user_name && Object.assign(whereOpt, { user_name: { [Op.startsWith]: user_name } })

        vip && Object.assign(whereOpt, { vip })
        create_time && Object.assign(whereOpt, { create_time })
        ban != undefined && Object.assign(whereOpt, { ban })

        const res = await User.findOne({
            attributes: ['id', 'user_name', 'user_id', 'ban', 'create_time', 'vip'],
            where: whereOpt,
            include: [
                {
                    model: CouponUser
                }, {
                    model: xlxw_balance
                }
            ],
        })

        return res ? res.dataValues : null;
    }

    async userLog({ id, admin_user_id, status, desc, create_time, index, len, user_name }) {
        const whereOpt = {}

        id && Object.assign(whereOpt, { id });
        admin_user_id && Object.assign(whereOpt, { admin_user_id });
        status != undefined && Object.assign(whereOpt, { status });
        create_time && Object.assign(whereOpt, { create_time });
        desc && Object.assign(whereOpt, { desc });

        const userWhereOpt = {};
        user_name && Object.assign(userWhereOpt, { user_name: { [Op.startsWith]: user_name } });

        const res = await xlxwLog.findAndCountAll({
            where: whereOpt,
            include: {
                model: xlxw_user,
                attributes: ['user_name'],
                where: userWhereOpt
            },
            offset: (index - 1) * len,
            limit: len
        })
        return res ? res : null;
    }



    async adminUserLog({ id, admin_user_id, status, desc, create_time, index, len, user_name }) {

        const whereOpt = {}
        id && Object.assign(whereOpt, { id });
        admin_user_id && Object.assign(whereOpt, { admin_user_id });
        status != undefined && Object.assign(whereOpt, { status });
        create_time && Object.assign(whereOpt, { create_time });
        desc && Object.assign(whereOpt, { desc });

        const userWhereOpt = {};
        user_name && Object.assign(userWhereOpt, { user_name: { [Op.startsWith]: user_name } });
        const res = await xlxwLog.findAndCountAll({
            where: whereOpt,
            include: {
                model: admin_user,
                attributes: ['user_name'],
                where: userWhereOpt
            },
            offset: (index - 1) * len,
            limit: len
        })
        return res ? res : null;

    }

    async loginLogdel({ id, admin_user_id, status, desc, create_time }) {
        const whereOpt = {}

        const logWhereOpt = {}

        id && Object.assign(whereOpt, { id });
        admin_user_id && Object.assign(logWhereOpt, { admin_user_id });
        status != undefined && Object.assign(logWhereOpt, { status });
        create_time && Object.assign(logWhereOpt, { create_time });
        desc && Object.assign(logWhereOpt, { desc });

        const res = await xlxwLog.update(logWhereOpt, {
            where: whereOpt
        })

        return res ? res : null;
    }
}



module.exports = new UserService()