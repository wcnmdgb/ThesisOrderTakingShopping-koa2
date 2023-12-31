const Router = require('koa-router')

const { findRotat } = require("../../controller/rotatchart");
const { findAllTarde, shoptype, findOrder, derDetails, findbanlance } = require('../../controller/trade')
const { getUserInfo, login, UniUserCreated, getOpenId } = require('../../controller/user');
const { address } = require('../../controller/address')
const { validatorfind } = require('../../middleware/address')
const { findUserCoupon, findCoupon } = require('../../controller/coupon')
const { findDraw } = require('../../controller/drawing');
const router = new Router({ prefix: '/user/find' })

router.get('/rotat', findRotat);
/**
 * 获取商品列表
 */
//获取商品列表
router.get('/tarde', findAllTarde);
/**
 * 商品分类
 */
router.get('/shoptype', shoptype);
/**
 * 获取用户信息
 */
router.get('/userinfo', getUserInfo);


router.get('/addr', validatorfind, address);


//uni-app端的数据登陆 此处需要判断是否存在 然后登陆和注册
router.post('/unilogin', getOpenId, UniUserCreated, login);


//获取用户优惠券
router.get('/coupon', findUserCoupon);


router.get('/couponall', findCoupon);


router.get('/order', findOrder);
//显示订单详情
router.get('/details', derDetails)

router.get('/banlance', findbanlance);

//查询
router.get('/draw', findDraw);

module.exports = router
