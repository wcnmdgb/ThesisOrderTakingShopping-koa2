
const staticStatus = require('../config/staticStatus')

const { FindAllAddRess, EditAddRess, CAddRes } = require('../service/address');
class Address {

    async address(ctx, next) {
        const { consigneeName, checked } = ctx.request.body

        const { userId } = ctx.state.user
        try {
            const res = await FindAllAddRess({ consignee_name: consigneeName, user_id: userId, checked: checked });
            ctx.success("获取成功", res);
        } catch (e) {
            console.log("通过userId获取用地址异常:" + e);
        }


    }

    async editAddress(ctx, next) {
        const { id, phone, dormitoryNumber, louNumber, desc, consigneeName, checked, del: del } = ctx.request.body;
        const { userId } = ctx.state.user
        try {
            if (checked === 0) {
                //若是选择为默认地址 则需要修改其他信息为未默认
                await EditAddRess({ user_id: userId, checked: 1 })
            }

            const res = await EditAddRess({ id: id, user_id: userId, phone: phone, dormitory_number: dormitoryNumber, lou_number: louNumber, desc: desc, consignee_name: consigneeName, checked: checked, del: del })

            if (res) {
                ctx.success("修改成功");
            } else {
                ctx.fail(201, "修改失败");
            }
        } catch (e) {
            console.log("修改地址异常");
        }
    }

    async delAddress(ctx, next) {
        const { id } = ctx.request.query;
        const { userId } = ctx.state.user;
        try {

            const res = await EditAddRess({ id: JSON.parse(id), user_id: userId, del: 1 })

            if (res) {
                ctx.success("修改成功");
            } else {
                ctx.fail(201, "修改失败");
            }
        } catch (e) {
            console.log("修改地址异常");
        }
    }

    async cAddress(ctx, next) {
        const { phone, dormitoryNumber, louNumber, desc, consigneeName, checked } = ctx.request.body;

        const { userId } = ctx.state.user
        try {
            if (checked === 0) {
                //若是选择为默认地址 则需要修改其他信息为未默认
                await EditAddRess({ user_id: userId, checked: 1 })
            }

            const res = await CAddRes({ user_id: userId, phone: phone, dormitory_number: dormitoryNumber, lou_number: louNumber, desc: desc, consignee_name: consigneeName, checked: checked })
            if (res) {
                ctx.success("添加成功");
            } else {
                ctx.fail(201, "添加失败");
            }
        } catch (e) {
            console.log("添加地址异常" + e);
        }
    }

}
module.exports = new Address();
