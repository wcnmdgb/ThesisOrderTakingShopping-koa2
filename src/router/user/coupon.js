const Router = require('koa-router')
const { alterCoupon, findGivcouppon, verifyHave, verifyNumber, subGiveCoupon, findCoupon, checkCouppon, obtainCouppon, seizeCoupons } = require('../../controller/coupon')
const { veriftyCoupon } = require('../../middleware/coupon');
const { verIftyIadmin } = require('../../middleware/user');



const router = new Router({ prefix: '/couppon' })



/**
 * 查询券
 */
router.get('/findGivcouppon', findGivcouppon);


/**
 * 修改优惠券
 */
router.post('/alterCoupon', verIftyIadmin, veriftyCoupon, alterCoupon);




router.get('/findCoupon', findCoupon);

//1.校验是否获取过券   2.校验券数量 3.抢购
router.post('/obtainCouppon', checkCouppon, obtainCouppon, seizeCoupons);


router.post('/findGivcouppon', findGivcouppon);

//提交给用户赠送券
//校验用户是否拥有券
//校验券数量是否足够
//提交券
router.post('/subGiveCoupon', verIftyIadmin, verifyHave, verifyNumber, subGiveCoupon);

module.exports = router
