const Router = require('koa-router')
const { delLog, findLog } = require("../../controller/rotatchart");


const { verIftyIadmin } = require('../../middleware/user');
const router = new Router({ prefix: '/log' })


router.get('/findLog', verIftyIadmin, findLog)

router.delete('/delLog', verIftyIadmin, delLog);


module.exports = router
