
const { Op } = require("sequelize");
const RotationChart = require("../db/index").xlxw_rotationchart;
class rotationChartService {

    async findAllRotat({ id, index, del = 0, create_time, title, len, status }) {
        const whereOpt = {}

        id && Object.assign(whereOpt, { id })

        title && Object.assign(whereOpt, { title: { [Op.startsWith]: title } });
        create_time && Object.assign(whereOpt, { create_time });
        del != undefined && Object.assign(whereOpt, { del });
        status != undefined && Object.assign(whereOpt, { status })
        const res = await RotationChart.findAndCountAll({
            attributes: ['id', 'title', 'create_time', 'del', 'status', 'image'],
            where: whereOpt,
            offset: (index - 1) * len,
            limit: len
        })
        return res ? res : null;


    }

    async cgeRotat({ id, title, del = 0, status, image }) {
        const whereOpt = {}
        const RotationOpt = {}

        id && Object.assign(whereOpt, { id });
        title && Object.assign(RotationOpt, { title });
        del != undefined && Object.assign(RotationOpt, { del });
        status != undefined && Object.assign(RotationOpt, { status });
        image && Object.assign(RotationOpt, { image });

        const res = await RotationChart.update(RotationOpt, { where: whereOpt });
        return res ? res : null;

    }

    async createRotat({ title, del = 0, status, image }) {

        const RotationOpt = {}
        const date = new Date();

        title && Object.assign(RotationOpt, { title });
        del != undefined && Object.assign(RotationOpt, { del });
        status != undefined && Object.assign(RotationOpt, { status });
        image && Object.assign(RotationOpt, { image });
        Object.assign(RotationOpt, { create_time: date })

        const res = await RotationChart.create(RotationOpt);
        return res ? res.dataValues : null;


    }
}

module.exports = new rotationChartService()