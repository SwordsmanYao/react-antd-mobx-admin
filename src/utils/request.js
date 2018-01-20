import axios from 'axios';
import { notification } from 'antd';
import md5 from 'md5';

const service = axios.create({
  timeout: 15000,
  cache: false,
});

// timestamp 时间戳
// token
// #AAA 常量
// axios.defaults.headers.common.Authorization =
// 'Basic timestamp=13123123123,token=tiket,sign=md5(timestamp+#AAA)';

//request 拦截器
service.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');

    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) {
      // 加密常量
      const secret = '#GMS';
      // 时间戳--当前毫秒数
      const timestamp = (new Date()).getTime().toString();
      // 加密后签名
      const sign = md5(timestamp + secret);

      config.headers.Authorization = `Basic timestamp=${timestamp},token=${token},sign=${sign}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 304) {
      const { data } = response;

      if (data.Code === 200 && response.headers.authorization) {
        // 更新本地保存的 token
        sessionStorage.setItem('token', response.headers.authorization);
      }

      if (data.Code === 101) { // 数据校验失败
        // 暂时放在这里处理，后面要放在校验信息显示上
        // 展示 data.Error.ModelState 里面的校验数据
        // data.Error.ModelState[0].key 字段 data.Error.ModelState[0].value 错误描述
        // notification.error({
        //   message: `Code: ${data.Code}, ${response.url}`,
        //   description: data.statusText,
        // });
      } else if (data.Code === 100 || data.Code === 104) {
        // 清空 localstorage 的 user 信息和 token
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');

        // 跳转登录页
        // routerRedux.push('/user/login');
      } else if (data.Code !== 200) {
        notification.error({
          message: `Code: ${data.Code}`,
          description: data.Error.Message,
        });
      }
      return data;
    } else {
      notification.error({
        message: `请求错误 ${response.status}: ${response.url}`,
        description: response.statusText,
      });
      return Promise.reject('error');
    }
  },
  error => {

    notification.error({
      message: `error`,
      description: error.message,
    });
    return Promise.reject(error);
  }
);

export default service;
