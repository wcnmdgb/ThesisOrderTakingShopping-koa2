const redis = require('redis') // 引入 redis

// 创建 Redis 客户端
const client = redis.createClient(6379, "127.0.0.1");
const { findOrder, cgeOrder } = require('../service/order');
const XLSX = require('xlsx');
const config = require('../config');
const { formatDate } =require('../utils/date');

client.connect();

const expired_subKey = `__keyevent@*__:expired`;

const subscriber = client.duplicate();
subscriber.on('error', err => console.error(err));

subscriber.connect();

subscriber.on('message', (pattern, channel, expiredKey) => {
    console.log(`Key '${expiredKey}' has expired`);
});

subscriber.pSubscribe(expired_subKey, async(err, count) => {
    if (err) {
        
        //key过期后获取key,查询订单表.状态是否是status是否未支付
        // const reg=/^\d{16,}$/;
        // if(reg.test(err)){
        const res = await findOrder({ order_id: err, status: 0 });

        console.log("过期的信息为" + res)

        if (res) {
            console.log("执行" + err);
            cgeOrder({ order_id: err, status: 6 })
        } else {
            console.log("订单已支付");
        }
}
      
});
const subscriberOrder = client.duplicate();
subscriberOrder.connect();

subscriber.on('message', (pattern, channel, expiredKey) => {
    console.log(`Key '${expiredKey}' has expired`);
});


subscriberOrder.pSubscribe('channel', async(err, count) => {  
   
        const taskName = 'order-task';
         console.log("执行导出");
      
        const data = await client.lPop(taskName);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(JSON.parse(data));
        const fileName=`${formatDate(new Date())}-订单表.xlsx`;
        const filePath=`${config.webPath}/../xsxl/${fileName}`;
      
        try{
              XLSX.utils.book_append_sheet(workbook, worksheet, '订单');
              await XLSX.writeFileSync(workbook, filePath);
             console.log("执行导出");
        }catch(e){
              console.log("导出错误");
        }
        
});


module.exports = {
    client
}













