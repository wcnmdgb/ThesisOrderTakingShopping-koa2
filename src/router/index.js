const fs = require('fs');
const Router = require('koa-router');
const path = require('path');
const router = new Router();

const adminDir = path.join(__dirname, 'admin');
const userDir = path.join(__dirname, 'user');


// 检查目录是否存在
if (fs.existsSync(adminDir)) {
    // 读取目录下的文件
    fs.readdirSync(adminDir).forEach(file => {
        console.log("[index]======>fs.router_admin ", adminDir, file);
        if (file !== 'index.js') {
            // 使用完整的文件路径
            const filePath = path.join(adminDir, file);
            let r = require(filePath);
            router.use(r.routes());
        }
    });
} else {
    console.error("目录 'admin' 不存在。");
}
if (fs.existsSync(userDir)) {

    fs.readdirSync(userDir).forEach(file => {
        console.log("[index]=====>fs.router_user ", userDir, file);
        if (file !== 'index.js') {
            const filePath = path.join(userDir, file);
            let r = require(filePath)
            router.use(r.routes())
        }
    })
} else {
    console.error("目录 'user' 不存在。");
}
module.exports = router
