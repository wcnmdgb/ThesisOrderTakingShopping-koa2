const Joi = require('joi');


class CoupOnMiddleware {

    async veriftyCoupon(ctx, next) {

        const { title, money, condition, number, status } = ctx.request.body;
        const schema = Joi.object({
            title: Joi.string().min(2).max(24).regex(/^\S+$/).required().label('优惠券标签'),
            money: Joi.number().default("").label("金额"),
            condition: Joi.number().default("").label("见面条件"),
            number: Joi.number().default("").label("数量"),
            status: Joi.number().default("").label("类型"),
        });
        const { error } = schema.validate({ title, money, condition, number, status }, { abortEarly: false });
        // 输出验证结果
        if (error) {
            error.details.forEach((err) => {
                ctx.fail(201, '错误：' + err.message)
            });
        } else {
            await next();
        }
    }



}

module.exports = new CoupOnMiddleware()