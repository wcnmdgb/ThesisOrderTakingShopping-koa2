// const { object } = require('joi');
// const config = require('../config');
// const { de } = require('date-fns/locale');
const send = require('koa-send')
const fs = require('fs')

class file {

    async upload(ctx, next) {
        const { file } = ctx.request.files;
        ctx.success(file.newFilename);
    }

    async getpic(ctx, next) {
        const npic = ctx.params.npic;
        const path = './src/upload/' + npic;
        try{
            if (fs.existsSync(path)) {
                await send(ctx, path)
            } else {
                ctx.body = 'NOT FOUND IMAGE！'
            }
        }catch(e){
            console.log("获取图片异常"+e);
        }

    }

}
module.exports = new file()