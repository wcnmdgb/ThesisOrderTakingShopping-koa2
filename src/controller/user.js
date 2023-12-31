const config = require('../config');
const { createUser, findAdminUser, findOneAdminUser, findAllUser, FindUserviceser, UpdateAdminUser, UpdatUser, CUniUser, findUserOne, findUserInfo } = require('../service/user');
const { findMenuPermis } = require('../service/menupermission')
const { findMenu } = require('../service/menu')
const { intolog } = require('../service/system')

const jwt = require('jsonwebtoken');
const { MD5_Encrypt } = require('../utils/crypt');
const { client } = require('../utils/redisClient');
const { wxOption } = require('../api/wxRequest');

class User {
    async login(ctx, next) {
        const { id, userId, userName, createTime, roleId } = ctx.state.userinfo;
        intolog(userId, 0, '登录了系统', config.uip)
        const token = jwt.sign({
            userId,
            roleId
        }, config.token.adminKey, { expiresIn: '3d' });

        const user = {
            ip: config.uip,

            id: id,
            createTime,
            userName: userName,
            token: "Bearer " + token,
            userId,
            roleId
        }
        try {
            ctx.success("登录成功!", user)
        } catch (e) {
            console.log("登陆日志生成异常:" + e);
        }
    }
    async addAdminuser(ctx, next) {
        const { userName, passWord, images } = ctx.request.body;

        try {
            const res = await createUser({ user_name: userName, pass_word: passWord, images: images });
            if (res) {
                ctx.success("添加用户成功")
            } else {
                ctx.fail(201, "请检查请求参数")
            }
        } catch (e) {

            ctx.fail(201, "请检查请求参数")
        }


    }




    async install(ctx, next) {
        const { userName, passWord } = ctx.request.body;
        try {
            const res = await createUser({ user_name: userName, pass_word: passWord });
            if (res) {
                ctx.success("初始化成功")
            } else {
                ctx.fail(201, "请检查请求参数")
            }
        } catch (e) {

            ctx.fail(201, "请检查请求参数")
        }
    }


    //查询user信息[普通用户]
    async findAdminUser(ctx, next) {
        const { userName, index } = ctx.request.query;
        try {
            const res = await findAdminUser({ user_name: userName, index: index, len: 10 });
            ctx.success("查询完毕", res);
        } catch (e) {
            console.log("查询管理员异常:" + e);
        }
    }

    //查询普通用户
    async findUser(ctx, next) {

        const { userName, index, ban } = ctx.request.query;
        try {
            const res = await FindUserviceser({ user_name: userName, index: index, len: 10, ban });
            ctx.success("查询完毕", res);
        } catch (e) {
            console.log("查询普通用户异常:" + e);
        }
    }

    async findAllUser(ctx, next) {
        try {
            const res = await findAllUser({});
            ctx.success("查询成功", res);
        } catch (e) {
            console.log("查询全部用户异常:" + e);
        }

    }

    async cgeAdminUser(ctx, next) {
        const { userName, password } = ctx.request.body
        //需要加密
        try {
            const { userId } = ctx.state.user

            if (await UpdateAdminUser({ user_id: userId, user_name: userName, pass_word: password })) {
                ctx.success("修改完成")
            } else {
                ctx.fail(201, "修改失败");
            }
        } catch (e) {
            console.log("修改管理员信息异常");
        }
    }

    async AddUser(ctx, next) {
        const { userName, money, vip, ban } = ctx.request.body;
        try {
            if (await addUser({ user_name: userName, money: money, vip: vip, ban: ban })) {
                ctx.success("添加完成")
            } else {
                ctx.fail(201, "添加失败");
            }
        } catch (e) {
            console.log("添加用户信息异常:" + e);
        }

    }

    async cgeGUser(ctx, next) {
        const { id, money, vip, ban } = ctx.request.body;
        try {
            if (await UpdatUser({ id: id, money: money, vip: vip, ban: ban })) {
                ctx.success("修改完成")
            } else {
                ctx.fail(201, "修改失败");
            }
        } catch (e) {
            console.log("修改用户信息异常:" + e);
        }

    }

    async UniUserCreated(ctx, next) {
        const { userId, userName } = ctx.state.userinfo;

        const finduser = await findUserOne({ user_id: userId });

        try {
            if (finduser) {

                if (finduser.ban === 0) {

                    ctx.state.userinfo = { id: finduser.id, userId: finduser.user_id, userName: finduser.user_name, createTime: finduser.create_time, roleId: 0 };
                    await next();
                } else {
                    ctx.fail(403, '账号被封禁');
                }

            } else {//创建一列
                const createUser = await CUniUser({ user_id: userId, user_name: userName });

                if (createUser) {

                    ctx.state.userinfo = { id: createUser.id, userId: createUser.user_id, userName: createUser.user_name, createTime: createUser.create_time, roleId: 0 };

                    await next();

                } else {
                    ctx.fail(201, '创建失败');
                }
            }
        } catch (e) {
            console.log("用户登陆异常:" + e);
            ctx.fail(201, '登陆失败');
        }

    }
    async getUserInfo(ctx, next) {
        const { userId } = ctx.state.user;
        try {
            if (userId !== undefined) {
                const res = await findUserInfo({ user_id: userId });
                ctx.success("获取成功", res);
            } else {
                ctx.fail(201, "获取用户信息失败");
            }
        } catch (e) {
            console.log("获取用户信息异常");
        }

    }

    async getOpenId(ctx, next) {
        console.log("登陆")
        const { code } = ctx.request.body;

        let data = '';
        try {
            data = await wxOption(code);

        } catch (e) {
            console.log(e);
            ctx.fail(408, "登录超时,请重试");
        }
        //  console.log("获取用户信息 openid"+data.openid)
        if (data.openid != undefined) {
            ctx.state.userinfo = { userId: data.openid, userName: "微信用户" };
            await next();
        } else {
            ctx.fail(408, "登录超时,请重试");
        }


    }
    async checkedUserName(ctx, next) {
        const { userName } = ctx.request.body;
        try {
            const res = await findUserOne({ user_name: userName });
            if (res) {
                ctx.fail(201, "用户名称重复");
            } else {
                await next();
            }
        } catch (e) {
            console.log("校验用户名称异常:" + e);
        }
    }




    async alterUser(ctx, next) {

        const { userName } = ctx.request.body;
        const { userId } = ctx.state.user;
        try {
            if (await UpdatUser({ user_id: userId, user_name: userName })) {
                ctx.success("修改完成")
            } else {
                ctx.fail(201, "修改失败");
            }
        } catch (e) {
            console.log("修改用户异常");
        }
    }

    async loginout(ctx, next) {
        const { userId } = ctx.state.user;
        try {
            await client.del(userId);
            ctx.success('退出成功');
        } catch (e) {
            console.log("退出异常:" + e);
        }
    }


    /**
     * 获取菜单
     *
     * @param {*} ctx
     * @param {*} next
     */
    async getMenu(ctx, next) {
        const { userId } = ctx.state.user;

        //获取用户信息
        const { permits } = await findOneAdminUser({ user_id: userId });

        //使用权限信息查询全部的权限
        const { menulists } = await findMenuPermis({ id: permits });

        const res = await findMenu({});
        //完整的菜单
        const menu = [];
        //根据角色获取的菜单
        const roleMenu = []

        const groupedData = res.reduce((acc, currentValue) => {
            acc[currentValue?.dataValues?.parent_id] = acc[currentValue?.dataValues?.parent_id] || [];
            acc[currentValue?.dataValues?.parent_id].push(currentValue);
            return acc;
        }, {});

        res.forEach(item => {
            //获取父类结构
            Object.assign(item?.dataValues, { children: groupedData[item?.dataValues?.id] })
            menu.push(item);
        });

        //排除掉非菜单内容
        menu.forEach(item => {

            if (JSON.parse(menulists).includes(item?.dataValues?.id)) {

                roleMenu.push(item);
            }
        })

        ctx.success('菜单', roleMenu);
    }

}

// function getTree(itemP, res) {
//     res.forEach(item => {
//         const children = []

//         if ((item?.dataValues?.parent_id) === (itemP?.dataValues?.id)) {
//             children.push(item);

//             if (item?.dataValues?.parent_id != 0) {
//                 getTree(item, res);
//             }
//         }

//         Object.assign(itemP?.dataValues, { children: children })
//     })


// }



module.exports = new User()