const Router = require('koa-router')
const { address, editAddress, cAddress } = require('../../controller/address')
const { validatorEdit, validatorfind } = require('../../middleware/address')

const router = new Router({ prefix: '/addr' })


router.get('/addr', validatorfind, address);


router.post('/cgeAddr', validatorEdit, editAddress);

router.put('/createAddr', validatorEdit, cAddress)

router.del('/del', editAddress);
module.exports = router