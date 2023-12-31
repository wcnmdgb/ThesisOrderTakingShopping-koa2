const Router = require('koa-router')
const { findAllCoupon, alterCoupon, createCoupon, delCoupon, findGivcouppon, verifyHave, verifyNumber, subGiveCoupon } = require('../../controller/coupon')
const { veriftyCoupon } = require('../../middleware/coupon');
const { verIftyIadmin } = require('../../middleware/user');


const router = new Router({ prefix: '/couppon' })

/**
 *查询全部优惠券
 */
router.get('/findAllCoupon', findAllCoupon);

/**
 * 查询券
 */
router.get('/findGivcouppon', findGivcouppon);

/**
 * 修改优惠券
 */
router.post('/alterCoupon', verIftyIadmin, veriftyCoupon, alterCoupon);



/**
 * 添加优惠券
 */
router.put('/createCoupon', verIftyIadmin, veriftyCoupon, createCoupon);

/**
 * 删除优惠券
 */
router.delete('/delcouppon', verIftyIadmin, delCoupon);


/**
 * 赠送券
 */
router.post('/subGiveCoupon', verIftyIadmin, verifyHave, verifyNumber, subGiveCoupon);

module.exports = router
