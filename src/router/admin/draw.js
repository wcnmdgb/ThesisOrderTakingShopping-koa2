const Router = require('koa-router')
const { findDraw, createDraw, alterDraw, delDraw } = require('../../controller/drawing');


const { verifDraw } = require('../../middleware/system');

const { verIftyIadmin } = require('../../middleware/user');
const router = new Router({ prefix: '/draw' })


// router.post('/checkToken', checkToken);

//查询
router.get('/findDraw', findDraw);

//添加

router.put('/createDraw', verIftyIadmin, verifDraw, createDraw);

//删除
router.delete('/delDraw', verIftyIadmin, delDraw);

router.post('/alterDraw', verIftyIadmin, verifDraw, alterDraw);


module.exports = router
