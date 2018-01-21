import { observable, action } from 'mobx';
import { queryMenu } from '../services/menu';

class GlobalStore {
  @observable collapsed = false; // true 折叠
  @observable menu = [];

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async fetchMenu() {
    const response = await queryMenu();
    if(response.Code === 200) {
      this.menu = response.Data;
    }
  }

  /**
   * 不含异步操作的 action
   */
  @action
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
  @action
  setCollapsed(collapsed) {
    this.collapsed = collapsed;
  }
}

export default new GlobalStore();



  