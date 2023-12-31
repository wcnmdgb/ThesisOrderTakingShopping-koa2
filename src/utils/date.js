const { format, subDays, addDays} = require('date-fns');

exports.subDay = (date, subnum) => {

    return new Date(format(subDays(date, subnum), 'yyyy-MM-dd'));
}


exports.addDay = (date, addnum) => {
    return new Date(format(addDays(date, addnum), "yyyy-MM-dd"))
}

exports.formatDate=(date)=>{
    return format(date,"yyyy-MM-dd-hh-mm-ss");
}