const { format, subDays } = require('date-fns');

let date = new Date();
let beginTime =new Date(format(subDays(date, 30),'yyyy-MM-dd'));

console.log(beginTime)
console.log(date);