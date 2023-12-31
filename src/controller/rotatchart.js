
const send = require('koa-send')
const fs = require('fs');
const { required } = require('joi');
const jwt = require('jsonwebtoken');
const { findAllRotat, cgeRotat, createRotat } = require("../service/rotatchart");

const { userLog, adminUserLog, loginLogdel } = require("../service/user");

const config = require('../config');


class rotationChart {

    //查询全部的轮播图
    async findRotat(ctx, next) {

        const { title, index, status } = ctx.request.query;
        try {
            const res = await findAllRotat({ title: title, index: index, status: status, len: 10 });
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("后台分页查询轮播图异常:" + e);
        }

    }

    async cgerota(ctx, next) {
        const { id, title, image, status, del } = ctx.request.body;

        try {
            if (await cgeRotat({ id: id, title: title, image: image, status: status, del: del })) {

                ctx.success("修改成功");
            } else {
                ctx.fail(201, "修改失败");

            }
        } catch (e) {
            console.log("修改轮播图异常:" + e);
        }

    }

    async createRotat(ctx, next) {

        const { title, image, status } = ctx.request.body;
        try {

            if (await createRotat({ title: title, image: image, status: status })) {

                ctx.success("添加成功");
            } else {

                ctx.fail(201, "添加失败");

            }

        } catch (e) {
            console.log("添加轮播图异常");
        }
    }

    //删除轮播图
    async delrotat(ctx, next) {
        const { ids } = ctx.request.query;
        if (await cgeRotat({ id: JSON.parse(ids), del: 1 })) {
            ctx.success("删除成功");
        } else {
            ctx.fail(201, "添加失败")
        }
    }


    //查询登陆日志
    async findLog(ctx, next) {
        const { userName, status, index } = ctx.request.query;

        console.log('[rotationChart]===>findLog', userName, status, index);
        if (status == 0) {
            //查询管理员
            const res = await adminUserLog({ status: 0, user_name: userName, index: index, len: 10 });
            ctx.success("查询成功", res);
        } else {
            //查询普通用户
            const res = await userLog({ status: 0, user_name: userName, index: index, len: 10 });
            ctx.success("查询成功", res);
        }
    }

    async delLog(ctx, next) {
        const { ids } = ctx.request.query;

        const res = await loginLogdel({ id: JSON.parse(ids), status: 1 });
        if (res) {
            ctx.success("删除成功");
        } else {
            ctx.fail(201, "删除错误");
        }

    }

    //校验token是否过期
    async checkToken(ctx, next) {
        const { userId, roleId } = ctx.state.user;

        try {
            const token = jwt.sign({
                userId,
                roleId
            }, config.token.adminKey, { expiresIn: '2h' });

            const user = {
                token: "Bearer " + token,
            }
            ctx.success("token续期", user);
        } catch (e) {
            console.log("token续期异常:" + e);
        }

    }
}
module.exports = new rotationChart()