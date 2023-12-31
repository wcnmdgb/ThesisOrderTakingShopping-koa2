const Router = require('koa-router')
const { findAllCoupon, findGivcouppon, } = require('../../controller/coupon')
const { findDraw } = require('../../controller/drawing');
const { UserValidator, verIftyIadmin, veriftyLogin, } = require('../../middleware/user');

const { findAllTarde, shoptype, salesVolume, findOrderAll, findTypeAll } = require('../../controller/trade')
const { findRotat, findLog } = require("../../controller/rotatchart");
const { findAdminUser, findUser, getMenu, login } = require('../../controller/user');

const router = new Router({ prefix: '/adminhub/find' })

/**
 *查询全部优惠券
 */
router.get('/coupponall', findAllCoupon);

/**
 * 查询券
 */
router.get('/givcouppon', findGivcouppon);

//查询
router.get('/draw', findDraw);

/**
 * 查询日志
 */
router.get('/log', verIftyIadmin, findLog)

/**
 * 获取商品列表
 */
//获取商品列表
router.get('/trade', findAllTarde);

/**
 * 订单
 */
router.get('/order', findOrderAll)

/**
 * 首页信息
 */
router.get('/salesvolume', salesVolume);

/**
 * 商品分类
 */
router.get('/shoptype', shoptype);

router.get('/shoptypeAll', findTypeAll);

router.get('/rotat', findRotat);


router.get('/admin', findAdminUser);

router.get('/user', findUser);

router.get('/routermenu', getMenu);

router.post('/login', UserValidator, veriftyLogin, login);
module.exports = router
