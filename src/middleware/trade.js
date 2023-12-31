const Joi = require('joi');
const { findOneProductType } = require('../service/trade');



//参数校验类
class tradeMiddleware {



    async veriftyTar(ctx, next) {
        const { name} = ctx.request.body;
        const schema = Joi.object({
            name: Joi.string().min(2).max(12).regex(/^\S+$/).required().label('商品名称'),
        });
        const { error } = schema.validate({ name}, { abortEarly: false });
        // 输出验证结果
        if (error) {
            error.details.forEach((err) => {
                ctx.fail(201, '错误：' + err.message);
            });
        } else {
            await next();
        }

    }


    async VerIfatyTarId(ctx, next) {
        const { product_type_id } = ctx.request.body;
        if (await findOneProductType({ product_type_id: product_type_id })) {
            ctx.fail(201, "商品类型不存在");

        } else {
            await next();
        }

    }

    async veriftyTarType(ctx, next) {

        await next();

    }

    async verifPayment(ctx, next) {

        const { orderId } = ctx.request.body;
        const schema = Joi.object({
            orderId: Joi.string().min(1).max(32).regex(/^\S+$/).required().label('订单id'),
        });
        const { error } = schema.validate({ orderId }, { abortEarly: false });
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



module.exports = new tradeMiddleware()