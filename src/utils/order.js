exports.RandomNumber = (couponId,fristtime) => {
    const now = new Date();
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let firstCode = ((month + day + hour + minutes + seconds) % 10).toString();
    //第一位验证码
    let secondCode = couponId ? "1" : "0";
    //第二位验证码
    let secondtime = new Date().getTime();

    let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + firstCode + secondCode + ( secondtime - fristtime);

    return orderCode;
}



