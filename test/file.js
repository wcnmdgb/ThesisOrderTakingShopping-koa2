const fs = require('fs');
const { readPem } = require('../src/config/file')

// fs.readFile('../src/config/apiclient_cert.pem', 'utf-8', (err, data) => {
//     console.log("文件内容" + data);
// })

const res = readPem('../src/config/apiclient_cert.pem');
console.log(res);