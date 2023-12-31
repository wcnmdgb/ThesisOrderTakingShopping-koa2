const Router = require('koa-router')


const { delAddress } = require('../../controller/address')

const router = new Router({ prefix: '/user/del' })


router.delete('/addr', delAddress);

module.exports = router
