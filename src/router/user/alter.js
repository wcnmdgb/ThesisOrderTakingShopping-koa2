const Router = require('koa-router')


const { checkCouppon, obtainCouppon, seizeCoupons } = require('../../controller/coupon')
const { verifyProStatus, verifyOrderId, verifyMoney, alterOrder, cgeblance, genbanlance } = require('../../controller/trade')
const { address } = require('../../controller/address')
const { validatorfind } = require('../../middleware/address')
const { checkedUserName, alterUser, loginout } = require('../../controller/user');
const { veriftyUserName } = require('../../middleware/user');


const { verifPayment } = require('../../middleware/trade')
const router = new Router({ prefix: '/user/alter' })



//修改地址
router.get('/addr', validatorfind, address);

//抢购
router.post('/alter', checkCouppon, obtainCouppon, seizeCoupons);

//抢购
router.post('/obtaincouppon', checkCouppon, obtainCouppon, seizeCoupons);

//添加商品
router.post('/generateorder', verifyProStatus, verifyOrderId);

//支付方式 , payment,RefundTest
router.post('/payment', verifPayment, verifyMoney)

router.post('/order', alterOrder);

//修改用户名称
router.post('/user', veriftyUserName, checkedUserName, alterUser);

router.post('/loginout', loginout);

//小程序提交后删除
router.post('/blance', cgeblance);
router.post('/genbanlance', genbanlance);

module.exports = router
