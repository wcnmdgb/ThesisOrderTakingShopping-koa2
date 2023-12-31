const Router = require('koa-router')
const { alterCoupon, verifyHave, verifyNumber, subGiveCoupon, } = require('../../controller/coupon')
const { veriftyCoupon } = require('../../middleware/coupon');
const { verIftyIadmin, veriftyUserId } = require('../../middleware/user');
const { alterDraw } = require('../../controller/drawing');
const { verifDraw, veriftySysten } = require('../../middleware/system');
const { aletshopType } = require('../../controller/trade')
const { veriftyTar, VerIfatyTarId, veriftyTarType } = require('../../middleware/trade')
const { alterTrade, alterOrder, genbanlance } = require('../../controller/trade')
const { cgerota } = require("../../controller/rotatchart");

const { cgeGUser } = require('../../controller/user');





const router = new Router({ prefix: '/adminhub/alter' })



/**
 * 修改优惠券
 */
router.post('/coupon', verIftyIadmin, veriftyCoupon, alterCoupon);

/**
 * 赠送券
 */
router.post('/givecoupon', verIftyIadmin, verifyHave, verifyNumber, subGiveCoupon);


router.post('/draw', verIftyIadmin, verifDraw, alterDraw);

//修改商品
router.post('/trade', verIftyIadmin, veriftyTar, VerIfatyTarId, alterTrade);

/**
 * 修改订单
 */
router.post('/order', alterOrder);

router.post('/shoptype', verIftyIadmin, veriftyTarType, aletshopType);

//修改 1.校验是否为空 2.保存
router.post('/rotat', verIftyIadmin, veriftySysten, cgerota);

router.post('/user', veriftyUserId, cgeGUser);


module.exports = router
