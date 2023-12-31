const Router = require('koa-router')
const { createCoupon } = require('../../controller/coupon')
const { veriftyCoupon } = require('../../middleware/coupon');
const { UserValidator, verIftyIadmin, veriftyAdminName } = require('../../middleware/user');
const { createDraw, } = require('../../controller/drawing');
const { verifDraw, veriftySysten } = require('../../middleware/system');
const { createTarde, createType } = require('../../controller/trade')
const { veriftyTar, VerIfatyTarId, veriftyTarType } = require('../../middleware/trade')
const { addAdminuser } = require('../../controller/user');
const { createRotat } = require("../../controller/rotatchart");





const router = new Router({ prefix: '/adminhub/put' })

/**
 * 添加优惠券
 */
router.put('/coupon', verIftyIadmin, veriftyCoupon, createCoupon);


//添加展示图

router.put('/draw', verIftyIadmin, verifDraw, createDraw);


//添加商品
router.put('/trade', verIftyIadmin, veriftyTar, VerIfatyTarId, createTarde);

router.put('/shoptype', verIftyIadmin, veriftyTarType, createType);

//保存 1.是否为空 2.保存
router.put('/rotat', verIftyIadmin, veriftySysten, createRotat);

router.put('/admin', UserValidator, veriftyAdminName, addAdminuser);
module.exports = router
