

const menu = require("../db/index").menu;



class menuService {
    //设置默认展示上架的产品
    async findMenu({ id, menu_name, parent_id, sort, menu_url, icon, perms, type, createtime }) {
        const whereOpt = {};

        id != undefined && Object.assign(whereOpt, { id });
        menu_name != undefined && Object.assign(whereOpt, { menu_name });
        parent_id != undefined && Object.assign(whereOpt, { parent_id });
        sort != undefined && Object.assign(whereOpt, { sort });
        menu_url != undefined && Object.assign(whereOpt, { menu_url });

        icon != undefined && Object.assign(whereOpt, { icon });
        perms != undefined && Object.assign(whereOpt, { perms });
        type != undefined && Object.assign(whereOpt, { type });
        createtime != undefined && Object.assign(whereOpt, { createtime });
        const res = await menu.findAll({
            where: whereOpt,

        })

        return res ? res : null;
    }

}



module.exports = new menuService()