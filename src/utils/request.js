const axios =require('axios');

const Axios=axios.create({
      timeout: 　2000 
 });
   
Axios.interceptors.request.use(
            (config) => {
                return config
            },
            (error) => {

                Promise.reject(error)
            },
   );
   
Axios.interceptors.response.use(
            (res) => {
               
                    return Promise.resolve(res);
            },
            (error) => {

                let message = ''
                if (error.message == 'Network Error') {
                    message = '未连接服务器'

                }

                // 请求超时
                if (error.message == 'timeout of 60000ms exceeded') {
                    message = '请求超时'
                }

                switch (error.response.status) {
                    case 400:
                        message = "请求错误(400)";
                        break;
                    case 401:
                        message = "未授权，请重新登录(401)";
                        break;
                    case 403:
                        message = "拒绝访问(403)";
                        break;
                    case 404:
                        message = "请求出错(404)";
                        break;
                    case 408:
                        message = "请求超时(408)";
                        break;
                    case 500:
                        message = "服务器错误(500)";
                        break;
                    case 501:
                        message = "服务未实现(501)";
                        break;
                    case 502:
                        message = "网络错误(502)";
                        break;
                    case 503:
                        message = "服务不可用(503)";
                        break;
                    case 504:
                        message = "网络超时(504)";
                        break;
                    case 505:
                        message = "HTTP版本不受支持(505)";
                        break;
                    default:
                        message = `连接出错(${error.response})!`;
                }

                console.log("访问异常"+message);
                return Promise.reject(message)

            },
        );
   
  

 exports.request=(config)=> {
        
        return new Promise((resolve, reject) => {
            
            Axios.request(config)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }



