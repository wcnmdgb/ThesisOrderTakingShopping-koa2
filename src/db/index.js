const { Sequelize } = require('sequelize');
const config = require('../config/index');
const initModels = require('../models/init-models');

const Seq = new Sequelize(config.MYSQL_DB, config.MYSQL_USER, config.MYSQL_PWD, {
    host: config.MYSQL_HOST,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 30000
    },
    logging:false
});

Seq.authenticate().then(()=>{
    console.log('数据库连接成功!');
}).catch((err)=>{
    console.log('数据库连接失败：'+err);
})

module.exports = initModels(Seq)