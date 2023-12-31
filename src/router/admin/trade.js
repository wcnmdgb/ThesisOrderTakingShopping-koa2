const Router = require('koa-router');
const { findAllTarde, createTarde, alterTrade, salesVolume, findOrder, verifyMoney, wxsub, generateOrder, subOrder, delTarde, delType, verifyProStatus, verifyOrderId, derDetails, findOrderAll, delFiles, exportOrder, findbanlance, genbanlance, cgeblance, RefundTest, findFile, download, confirm, banlance } = require('../../controller/trade')
const { veriftyTar, VerIfatyTarId, veriftyTarType, verifPayment } = require('../../middleware/trade')
const { verifyCoupponU } = require('../../controller/coupon')

const router = new Router({ prefix: '/trade' })
const { verIftyIadmin } = require('../../middleware/user');

//获取商品列表
router.get('/findAllTarde', findAllTarde);

//添加商品
router.put('/createTarde', verIftyIadmin, veriftyTar, VerIfatyTarId, createTarde);
//修改商品
router.post('/alterTrade', verIftyIadmin, veriftyTar, VerIfatyTarId, alterTrade);

//删除
router.delete('/delTarde', verIftyIadmin, delTarde);



router.post('/findOrder', findOrder);


router.get('/findOrderAll', findOrderAll)

//显示订单详情
router.post('/details', derDetails)



//支付方式 , payment,RefundTest
router.post('/payment', verifPayment, verifyMoney)

router.get('/exportOrder', exportOrder);


router.post('/salesVolume', salesVolume);

router.post('/findbanlance', findbanlance);

//生成余额订单
router.post('/genbanlance', genbanlance);

//小程序提交后删除
router.post('/cgeblance', cgeblance);

//查询文件中存在以订单表结尾的文件
router.post('/findFile', verIftyIadmin, findFile);

router.post('/download', verIftyIadmin, download);

router.post('/delFiles', verIftyIadmin, delFiles);

//支付信息的回调地址;
router.post('/confirm', confirm, RefundTest);

//余额异步处理
router.post('/banlance', banlance, RefundTest);





//使用redis管理订单
//1. 校验商品id是否存在
//2. 校验订单id是否存在
//3. 选择添加订单还是修改订单 或是删除订单
router.post('/generateOrder', verifyProStatus, verifyOrderId);


//此处的数据需要加密存储 ，所以暂时不校验
router.post('/subOrder', verifyCoupponU, generateOrder, wxsub, subOrder)
module.exports = router