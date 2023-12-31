const path = require('path');
const fs = require("fs");
const Joi = require('joi');
const { findOneAdminUser, findUserOne } = require('../service/user')

const { MD5_Encrypt } = require('../utils/crypt');

class UserMiddleware {

    async UserValidator(ctx, next) {

        const { userName, passWord } = ctx.request.body;

        // 定义验证规则
        const schema = Joi.object({
            userName: Joi.string().min(4).max(12).regex(/^\S+$/).required().label('用户名'),
            passWord: Joi.string().length(32).regex(/^\S+$/).required().label('密码')
        });
        const { error } = schema.validate({ userName, passWord }, { abortEarly: false });
        // 输出验证结果
        if (error) {
            error.details.forEach((err) => {
                ctx.fail(201, "错误" + err.message)
            });
        } else {
            await next();
        }
    }
    async veriftyAdminUser(ctx, next) {
        const { userName } = ctx.request.body;
        const jsonPath = path.join(__dirname,'../install/.install');
         
        try{
            await fs.promises.access(jsonPath);
            ctx.fail(403, "禁止访问此接口!");
        }catch(error){
            
                fs.promises.writeFile(jsonPath, '')
                .then(() => {
                    console.log('空文件已成功创建！');
                })
                .catch((err) => {
                    console.error(err);
                });
                await next();
            
        }
    }
    
    async veriftyAdminName(ctx,next){
         const { userName } = ctx.request.body;
        if (await findOneAdminUser({ user_name: userName })) {
                ctx.fail(201, "该用户已存在!");
            } else {
                
                await next();
            }
        
    }
    
    async veriftyLogin(ctx, next) {
        const { userName, passWord } = ctx.request.body;
        const res = await findOneAdminUser({ user_name: userName });
      
        if (res == null) {
            ctx.fail(201, "账号不存在")
        }
        //需要加密
        else if (res.pass_word == passWord) {


            ctx.state.userinfo = { id: res.id, userId: res.user_id, images: res.images, userName: res.user_name, createTime: res.create_time,roleId:1 }
            await next();
        } else {
            ctx.fail(201, "密码错误，请重试！")
        }
    }

    async veriftyName(ctx, next) {
        const { userName } = ctx.request.body;
        const res = await findUserOne({ user_name: userName })
        if (res == null) {
            await next();
        } else {
            ctx.fail(201, "该用户已存在!")
        }
    }

    async veriftyUserId(ctx, next) {

        const { id } = ctx.request.body;
        const res = await findUserOne({ id: id })
        if (res == null) {
            ctx.fail(201, "该用户不存在!")
        } else {
            await next();
        }
    }

    async veriftyPassWord(ctx, next) {
        const { oldPassword, password } = ctx.request.body;

        const schema = Joi.object({
             password:Joi.string().length(32).regex(/^\S+$/).required().label('新密码'),
            oldPassword: Joi.string().length(32).regex(/^\S+$/).required().label('旧密码')
        });

        const { error } = schema.validate({ password, oldPassword }, { abortEarly: false });
        if (error) {
            error.details.forEach((err) => {
                ctx.fail(201, "错误" + err.message)
            });
        }
        
        const {userId}= ctx.state.user

        // ctx.state.userinfo = { user_id: userId }

        const res = await findOneAdminUser({ user_id: userId, oldPassword: oldPassword });

        if (res.pass_word != oldPassword) {
            return ctx.fail(201, "旧密码错误");
        }

        if (res.pass_word === password) {
            return ctx.fail(201, "新密码不得与旧密码重复");
        }
        await next();


    }
    
    async verIftyIadmin(ctx,next){
        const {roleId} =ctx.state.user;
        if(roleId === 1){
            await next();
        }else{
            ctx.fail(403,"用户不是管理员");
        }
    }
    
     async veriftyUserName(ctx,next){
        const {userName} =ctx.request.body;
        
        const schema = Joi.object({
            userName: Joi.string().min(2).max(8).regex(/^\S+$/).required().label('用户名'),
        });
        
          const { error } = schema.validate({ userName}, { abortEarly: false });
        // 输出验证结果
        if (error) {
            error.details.forEach((err) => {
                ctx.fail(201, "错误" + err.message)
            });
        } else {
            await next();
        }

    }
 

}

module.exports = new UserMiddleware()