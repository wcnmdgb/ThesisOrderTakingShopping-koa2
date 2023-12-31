const Router = require('koa-router')
const { delCoupon, } = require('../../controller/coupon')

const { verIftyIadmin } = require('../../middleware/user');

const { delDraw } = require('../../controller/drawing');

const { delrotat, delLog } = require("../../controller/rotatchart");
const { delTarde, delShopType } = require('../../controller/trade')
const router = new Router({ prefix: '/adminhub/del' })




/**
 * 删除优惠券
 */
router.delete('/coupon', verIftyIadmin, delCoupon);


/**
 *  删除展示图
 */
router.delete('/draw', verIftyIadmin, delDraw);


router.delete('/log', verIftyIadmin, delLog);

//删除商品
router.delete('/trade', verIftyIadmin, delTarde);

router.delete('/shoptype', verIftyIadmin, delShopType);

router.delete('/rotat', delrotat);
module.exports = router
