const { resp } = require('../config/staticStatus')


handler = (option = {}) => {
    return async (ctx, next) => {
        ctx.success = (msg, data) => {
            ctx.type = option.type || 'json'
            ctx.body = {
                code: resp.status.SUCCESS.code,
                msg: msg || resp.status.SUCCESS.msg,
                data: data
            }
        }

        ctx.fail = (code, msg) => {
            ctx.type = option.type || 'json'
            ctx.body = {
                code: code || resp.status.ERROR.code,
                msg: msg || option.successMsg || resp.status.ERROR.msg
            }

        }
        await next()
    }

}
module.exports = handler
