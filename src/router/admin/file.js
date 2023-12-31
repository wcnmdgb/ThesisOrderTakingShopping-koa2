
const fs = require('fs');
const Router = require('koa-router')

const { upload, getpic } = require("../../controller/file")
const router = new Router({ prefix: '/file' })


//校验是否未管理员

router.post('/upload', upload);

router.get('/image/:npic', getpic);

module.exports = router
