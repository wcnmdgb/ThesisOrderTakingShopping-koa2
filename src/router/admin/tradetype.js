const Router = require('koa-router');
const { findTypeAll, shoptype, aletshopType, createType, delShopType } = require('../../controller/trade')
const { veriftyTar, VerIfatyTarId, veriftyTarType, verifPayment } = require('../../middleware/trade')


const router = new Router({ prefix: '/tradeType' })
const { verIftyIadmin } = require('../../middleware/user');

// router.get('/findType', findType);

router.get('/shoptype', shoptype);

router.put('/createType', verIftyIadmin, veriftyTarType, createType);

router.post('/alterTradeType', verIftyIadmin, veriftyTarType, aletshopType);


router.delete('/delType', verIftyIadmin, delShopType);

router.get('/findTypeAll', findTypeAll);
module.exports = router