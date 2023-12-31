const fs = require('fs');

//通过路径读取证书

exports.readPem = (path) => {
    return fs.readFileSync(__dirname+ path,'utf-8');
}

