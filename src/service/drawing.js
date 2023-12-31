const Sequelize = require('sequelize');
const draw = require('../db/index').xlxw_drawing;
const adminUser = require('../db/index').admin_user;
const { Op } = require("sequelize");

class drawing {

    async findDraw({ del, status, create_time, user_id, image, id, index, len = 10, title }) {

        const whereOpt = {};

        del != undefined && Object.assign(whereOpt, { del });
        status != undefined && Object.assign(whereOpt, { status });
        create_time != undefined && Object.assign(whereOpt, { create_time });
        user_id != undefined && Object.assign(whereOpt, { user_id });
        image != undefined && Object.assign(whereOpt, { image });
        id != undefined && Object.assign(whereOpt, { id });
        title != undefined && Object.assign(whereOpt, { title: { [Op.startsWith]: title } });

        const res = await draw.findAndCountAll({
            where: whereOpt,
            include: [{
                model: adminUser,
                attributes: ['user_name'],
            }],
            offset: (index - 1) * len,
            limit: len

        });
        return res ? res : null;

    }

    async addDraw({ del, status, user_id, image, title }) {
        const drawOpt = {};

        del != undefined && Object.assign(drawOpt, { del });
        status != undefined && Object.assign(drawOpt, { status });
        user_id != undefined && Object.assign(drawOpt, { user_id });
        image != undefined && Object.assign(drawOpt, { image });
        title != undefined && Object.assign(drawOpt, { title });
        Object.assign(drawOpt, { create_time: new Date() });
        const res = await draw.create(drawOpt);
        return res ? res : null;
    }

    async cgeDraw({ id, status, del = 0, image, title }) {
        const whereOpt = {};
        const drawOpt = {};

        id != undefined && Object.assign(whereOpt, { id });

        image != undefined && Object.assign(drawOpt, { image });
        del != undefined && Object.assign(drawOpt, { del });
        status != undefined && Object.assign(drawOpt, { status });
        title != undefined && Object.assign(drawOpt, { title })

        const res = await draw.update(drawOpt, {
            where: whereOpt
        })
        return res ? res : null;

    }




}

module.exports = new drawing()