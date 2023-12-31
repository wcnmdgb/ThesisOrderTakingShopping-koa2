

const menupermission = require("../db/index").menupermission;



class menupermissionService {
    //设置默认展示上架的产品
    async findMenuPermis({ id, menupermissionname, menulists, details, createtime }) {
        const whereOpt = {};
        id && Object.assign(whereOpt, { id });
        menupermissionname && Object.assign(whereOpt, { menupermissionname });
        menulists && Object.assign(whereOpt, { menulists });
        details && Object.assign(whereOpt, { details });

        createtime && Object.assign(whereOpt, { createtime });
        const res = await menupermission.findOne({
            where: whereOpt,
            attributes: ['id', 'menupermissionname', 'menulists', 'details', 'createtime'],
        })
        return res ? res.dataValues : null;

    }

}



module.exports = new menupermissionService()