const path = require('path')
const fs = require("fs")
const Koa = require('koa')
const { koaBody } = require('koa-body')
const jwt = require('koa-jwt')
const rateLimit = require('koa2-ratelimit').RateLimit;
const router = require('./router')
const config = require('./config')
const app = new Koa()
const response = require('./utils/handler');
const init = require('./install');
const koaStatic = require('koa-static');


app.use(koaStatic(__dirname + '/public'));
app.use(init.routes());

//设置获取真实ip
app.proxy = true;

app.use(response());
//处理错误
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        let message = err.message;
        switch (ctx.status) {
            case 401:
                message = '未授权token，请重新登录！'
                break;
            case 404:
                message = '未找到资源，请检查是否参数错误!'
                break;
            case 500:
                console.log(err);
                message = '服务器内部错误，请联系管理员！'
                break;
            default:
                message = err.message
        }
        ctx.body = {
            message
        };
    }
})



//身份验证
app.use(jwt({ secret: config.token.adminKey, algorithms: ['HS256'] }).unless({
    path: ['/user/login',
        '/user/unilogin',
        '/user/register',
        '/api/upload',
        '/system/findRotat',
        '/trade/findType',
        '/trade/findAllTarde',
        '/file/upload',
        /\/file\/image\/.*(png|jpg)/,
        '/adminhub/find/login',
        '/user/find/rotat',
        '/user/find/shoptype',
        '/user/find/tarde']
}))


app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 5 * 1024 * 1024,
        uploadDir: path.join(__dirname, './upload'),
        keepExtensions: true,
        onFileBegin: function (name, file) {
            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
                throw new Error('只允许上传jpg或png格式的图片');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('上传文件大小不能超过5MB');
            }
        }
    },
    parsedMethods: ['POST', 'PUT', 'DELETE']
}))

// 使用限制流量
app.use(
    rateLimit.middleware({
        // 根据IP地址进行限流
        getUserId: function (ctx) {
            const ips = ctx.request.ips[0] || ctx.ip;
            if (ips === "::1") {
                return config.uip;
            }
            config.uip = ips.match(/\d+\.\d+\.\d+\.\d+/)[0];

            return config.uip;
        },
        interval: { min: 1 },
        delayAfter: 100,
        timeWait: { sec: 2 },
        max: 120,
        headers: false,
        message: '请求过于频繁，请稍后再试'
    })
);
app.use(router.routes())
//导入


app.use(async (ctx, next) => {
    const method = ctx.method;
    const url = ctx.url;
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (method === 'GET' && url !== '/install') {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(indexPath);
    } else {
        await next(); // 调用下一个中间件
    }
})



app.listen(config.prot, () => {
    console.log(`server is running on prot:${config.prot}`)
})




//统一状态返回
