import { observable, action } from 'mobx';
import { queryMenu } from '../services/menu';

class GlobalStore {
  // 左侧菜单是否折叠， true 折叠
  @observable collapsed = false;
  // 左侧菜单树数据
  @observable menu = [];

  @observable openKeys = [];

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async fetchMenu() {
    const response = await queryMenu();
    if(response.Code === 200) {
      this.setMenu(response.Data);
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

  @action
  setOpenKeys(data) {
    this.openKeys = data;
  }
  @action
  setMenu(data) {
    this.menu = data;
  }
}

export default new GlobalStore();



  