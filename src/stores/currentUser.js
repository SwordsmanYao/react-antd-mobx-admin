import { observable, action } from 'mobx';
import history from '../history';

import { login } from '../services/currentUser';

class CurrentUserStore {
  @observable currentUser = null; // 当前登录用户的信息,也是作为渲染是否登录的依据
  @observable submitting = false; // 登录是否正在提交;
  @observable error = null; //登录请求的错误信息
  /**
   * 含有接口请求等异步操作的 action
   */
  
  @action
  async login(data) {

    this.setData({
      submitting: true,
    });
    
    const response = await login(data);

    if(response.Code === 200) {
      const user = response.Data;

      // token 单独存储，每次请求都会更新 token
      sessionStorage.setItem('token', user.Token);
      delete user.Token;

      // 将用户信息保存到 sessionStorage 里面
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      this.setData({
        currentUser: response.Data,
        error: null,
      })

      history.push('/basic');
    } else {
      this.setData({
        error: response.Error
      });
      return await Promise.reject(response.Error);
    }
    
    this.setData({
      submitting: false,
    });
  }

  /**
   * 不含异步操作的 action
   */
  @action
  setData(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  @action
  logout() {
    this.setData({
      currentUser: null,
    });
    
    // 清空 sessionStorage 的 user 信息和 token
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');

    history.push('/login');
  }

  @action
  loadCurrentUserFromSession() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.currentUser = user;
  }
}

export default new CurrentUserStore();