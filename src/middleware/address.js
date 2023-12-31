const Joi = require("joi");

class Address {

    async validatorfind(ctx, next) {
        await next();

    }

    async validatorEdit(ctx, next) {
        const { phone, dormitoryNumber, louNumber, consigneeName, checked } = ctx.request.body;

        const schema = Joi.object({
            phone: Joi.string().length(11).regex(/^1[3-9]\d{9}$/).required().label('手机号'),
            dormitoryNumber: Joi.string().min(1).max(5).regex(/^\S+$/).required().label('楼栋号'),
            louNumber: Joi.string().min(1).max(5).regex(/^\S+$/).required().label('宿舍号'),
            consigneeName: Joi.string().min(1).max(10).regex(/^\S+$/).required().label('收件人名称'),

            checked: Joi.number().default("").label("类型"),
        });
        const { error } = schema.validate({ phone, dormitoryNumber, louNumber, consigneeName, checked }, { abortEarly: false });
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

module.exports = new Address()