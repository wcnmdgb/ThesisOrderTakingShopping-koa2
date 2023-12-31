const Router = require('koa-router')
const { wxsub, generateOrder, subOrder, } = require('../../controller/trade')

const { verifyCoupponU } = require('../../controller/coupon')

const { editAddress } = require('../../controller/address')
const { validatorEdit } = require('../../middleware/address')
const router = new Router({ prefix: '/user/create' })


router.put('/addr', validatorEdit, editAddress);


//此处的数据需要加密存储 ，所以暂时不校验
router.post('/suborder', verifyCoupponU, generateOrder, wxsub, subOrder)

module.exports = router
