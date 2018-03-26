import apiConfig from "./apiConfig.js";
import Axios from "axios";

/**
 * 请求拦截器
 */
Axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
Axios.interceptors.response.use(
  response => {
    // 自定义返回码 作不同处理
    return response;
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "请求错误";
          break;

        case 401:
          err.message = "登录超时，请重新登录";
          break;

        case 403:
          err.message = "拒绝访问";
          break;

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`;
          break;

        case 408:
          err.message = "请求超时";
          break;

        case 500:
          err.message = "服务器内部错误";
          break;

        case 501:
          err.message = "服务未实现";
          break;

        case 502:
          err.message = "网关错误";
          break;

        case 503:
          err.message = "服务不可用";
          break;

        case 504:
          err.message = "网关超时";
          break;

        case 505:
          err.message = "HTTP版本不受支持";
          break;

        default:
      }
    }
    // 对响应错误做点什么
    return Promise.reject(err);
  }
);

const BASR_URL = "http://localhost:3000";

/**
 * 
 * @param {*Object} dataConfig
 * {
 *   url: String 请求路径
 *   method: String 请求类型
 *   payload: Object 请求参数
 * } 
 * @return {*Promise} 返回Promise对象、可在then中处理结果，在catch中捕捉错误
 */
const apiRequestHandler = function (dataConfig) {
  return new Promise((resolve, reject) => {
    /**
     * 默认axios配置
     * 1.根路径
     * 2.超时时间
     * 3.请求路径（这里的url等于 根路径baseURL加上传入的路径）
     */
    let DEFAULT_AXIOS_CONFIG = {
      baseURL: BASR_URL,
      timeout: 10000, // 请求超时时间 
      url: dataConfig.url,
      method: dataConfig.method,
      // headers: {
      //   "Content-Type": "application/json",
      //   "X-Requested-With": "XMLHttpRequest"
      // },
      withCredentials: true//请求时携带cookie
    };
    /**
     *
     * 1.t 请求时间戳、防止浏览器缓存，保证获取到最新数据
     */
    let DEFAULT_PARAMS = {
      t: +new Date()
    };

    /**
     * 区别get和post请求 做不同配置
     * 1.get  携带参数写法为：params:{}
     * 2.post 携带参数写法为：data：{}
     */
    if (dataConfig.method === "get" || dataConfig.method === "delete") {
      let params = Object.assign({}, DEFAULT_PARAMS, dataConfig.payload);
      DEFAULT_AXIOS_CONFIG = Object.assign({}, DEFAULT_AXIOS_CONFIG, {
        params
      });
    } else if (dataConfig.method === "post") {
      let data = Object.assign({}, DEFAULT_PARAMS, dataConfig.payload);
      DEFAULT_AXIOS_CONFIG = Object.assign({}, DEFAULT_AXIOS_CONFIG, {
        data
      });
    }

    Axios(DEFAULT_AXIOS_CONFIG)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export default apiRequestHandler;
