import { observable, action } from 'mobx';
import { queryMenuTree } from '../services/menu';

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
    const response = await queryMenuTree();
    if(response.Code === 200) {
      this.setData({
        menu: response.Data
      });
    }
  }

  /**
   * 不含异步操作的 action
   */
  @action
  toggleCollapsed() {
    if(!this.collapsed) {
      this.setData({
        collapsed: !this.collapsed,
        openKeys: [], // 折叠动作时把打开的菜单关上
      });
    } else {
      this.setData({
        collapsed: !this.collapsed,
      });
    }
  }

  @action
  setData(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}

export default new GlobalStore();



  