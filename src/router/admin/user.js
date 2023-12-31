const Router = require('koa-router');
const { login, addAdminuser, install, findAllUser, findAdminUser, findUser, cgeAdminUser, cgeGUser, AddUser, UniUserCreated, getUserInfo, getOpenId, alterUser, loginout, checkedUserName, getMenu } = require('../../controller/user');
const { UserValidator, verIftyIadmin, veriftyUserName, veriftyLogin, veriftyAdminName, veriftyAdminUser, veriftyUserId, veriftyName, veriftyPassWord } = require('../../middleware/user');


const router = new Router({ prefix: '/user' });

router.post('/login', UserValidator, veriftyLogin, login);

router.put('/register', UserValidator, veriftyAdminName, addAdminuser);

router.post('/install', UserValidator, veriftyAdminUser, install);

router.get('/findAdminUser', findAdminUser);

router.get('/findUser', findUser);

/**
 * 获取菜单
 */
router.get('/routermenu', getMenu);

router.post('/updateAdminUser', verIftyIadmin, UserValidator, veriftyAdminUser, cgeAdminUser);


router.post('/addUser', verIftyIadmin, veriftyName, AddUser);

router.post('/updateUser', veriftyUserId, cgeGUser);

router.post("/adminChangPassword", veriftyPassWord, cgeAdminUser);

//uni-app端的数据登陆 此处需要判断是否存在 然后登陆和注册
router.post('/unilogin', getOpenId, UniUserCreated, login);


router.get('/findAllUser', findAllUser);

//修改用户名称
router.post('/cgeUser', veriftyUserName, checkedUserName, alterUser);


router.post('/loginout', loginout);



module.exports = router;