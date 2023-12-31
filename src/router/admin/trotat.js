const Router = require('koa-router')
const { findRotat, createRotat, cgerota, delrotat } = require("../../controller/rotatchart");



const { veriftySysten } = require('../../middleware/system');

const { verIftyIadmin } = require('../../middleware/user');
const router = new Router({ prefix: '/rotat' })



router.get('/findRotat', findRotat);

//保存 1.是否为空 2.保存
router.put('/createRotat', verIftyIadmin, veriftySysten, createRotat);

//修改 1.校验是否为空 2.保存
router.post('/cgerotat', verIftyIadmin, veriftySysten, cgerota);

router.delete('/delrotat', delrotat);


module.exports = router
