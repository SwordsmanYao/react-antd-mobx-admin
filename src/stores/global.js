import { observable, action } from 'mobx';
import { queryMenu } from '../services/menu';

class GlobalStore {
  // 左侧菜单是否折叠， true 折叠
  @observable collapsed = false;
  // 左侧菜单树数据
  @observable menu = [];
  // 展开的 submenu key 数组
  @observable openKeys = [];
  // 菜单选中的叶节点 key
  @observable selectedKeys = [];

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
  setMenu(data) {
    this.menu = data;
  }
  @action
  setOpenKeys(data) {
    this.openKeys = data;
  }
  @action
  setSelectedKeys(data) {
    this.selectedKeys = data;
  }
}

export default new GlobalStore();



  