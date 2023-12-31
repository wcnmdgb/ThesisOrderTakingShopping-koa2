
const send = require('koa-send')
const fs = require('fs');
const { required } = require('joi');
const jwt = require('jsonwebtoken');
const { findDraw, addDraw, cgeDraw } = require('../service/drawing');

const config = require('../config');


class drawing {

    //查询全部的轮播图
    async findDraw(ctx, next) {

        const { index, status, title } = ctx.request.query;
        try {
            const res = await findDraw({ index: index, del: 0, status: status, title: title });
            ctx.success("获取成功", res);
        } catch (e) {
            ctx.fail(201, '获取错误');
        }
    }


    async createDraw(ctx, next) {

        const { image, status, title } = ctx.request.body;

        const { userId } = ctx.state.user;
        try {
            const res = await addDraw({ image: image, status: status, user_id: userId, del: 0, title });
            if (res) {
                ctx.success("保存成功", res);
            } else {
                ctx.fail(201, "存储失败");
            }
        } catch (e) {
            ctx.fail(201, "存储失败");
        }

    }

    async alterDraw(ctx, next) {
        const { id, image, status, del, title } = ctx.request.body;

        // try{
        const res = await cgeDraw({ id: id, image: image, status: status, del: del, title });
        if (res) {
            ctx.success("修改成功");
        } else {
            ctx.fail(201, "修改失败")
        }

        // }catch(e){
        //     ctx.fail(201,"修改失败");
        // }

    }

    async delDraw(ctx, next) {
        const { ids } = ctx.request.query;
        // try{

        const res = await cgeDraw({ id: JSON.parse(ids), del: 1 });
        if (res) {
            ctx.success("修改成功");
        } else {
            ctx.fail(201, "修改失败")
        }

        // }catch(e){
        //     ctx.fail(201,"修改失败");
        // }

    }


}
module.exports = new drawing();