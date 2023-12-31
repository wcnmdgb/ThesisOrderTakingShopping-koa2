const Joi = require('joi');






//参数校验类
class systemMiddleware {
    async veriftySysten(ctx, next) {

        const { title, image } = ctx.request.body;

        const schema = Joi.object({
            title: Joi.string().min(1).max(32).regex(/^\S+$/).required().label('标题'),
            image: Joi.string().min(1).max(64).regex(/^\S+$/).required().label('图片链接'),

        });
        const { error } = schema.validate({ title, image }, { abortEarly: false });
        // 输出验证结果
        if (error) {
            error.details.forEach((err) => {
                ctx.fail(201, '错误：' + err.message)
            });
        } else {
            await next();
        }
    }

    async verifDraw(ctx, next) {
        const { image } = ctx.request.body;


        const schema = Joi.object({
            image: Joi.string().min(1).max(64).regex(/^\S+$/).required().label('图片链接'),
        });
        const { error } = schema.validate({ image }, { abortEarly: false });
        if (error) {
            error.details.forEach((err) => {
                ctx.fail(201, '错误：' + err.message)
            });
        } else {
            await next();
        }
    }
}



module.exports = new systemMiddleware()