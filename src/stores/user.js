import { observable, action } from 'mobx';
import history from '../history';

import { login } from '../services/user';

class UserStore {
  @observable currentUser = null; // 当前登录用户的信息,也是作为渲染是否登录的依据
  @observable submitting = false; // 登录是否正在提交;

  /**
   * 含有接口请求等异步操作的 action
   */
  
  @action
  async login(data) {

    this.setSubmitting(true);

    const response = await login(data);

    if(response.Code === 200) {
      const user = response.Data;

      // token 单独存储，每次请求都会更新 token
      sessionStorage.setItem('token', user.Token);
      delete user.Token;

      // 将用户信息保存到 sessionStorage 里面
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      this.setCurrentUser(response.Data);

      history.push('/basic');
    }
    
    this.setSubmitting(false);
  }

  /**
   * 不含异步操作的 action
   */

  @action
  logout() {
    this.setCurrentUser(null);
    
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

  @action
  setSubmitting(data) {
    this.submitting = data;
  }

  @action
  setCurrentUser(data) {
    this.currentUser = data;
  }
}

export default new UserStore();