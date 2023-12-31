const path = require('path');
const Router = require('koa-router')
const fs = require("fs");
const router=new Router();

router.get('/install',async(ctx,next)=>{
    const jsonPath = path.join(__dirname,'.install');
    const indexPath = path.join(__dirname, '../public', 'index.html');
    try{
        await fs.promises.access(jsonPath);
        ctx.redirect('/');
    }catch(error){
        ctx.type = 'html';
        ctx.body = fs.createReadStream(indexPath);
    }
})
    
module.exports = router

