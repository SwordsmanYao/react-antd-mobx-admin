import { observable, action, computed } from 'mobx';
import { queryMenuTree } from '@/services/global';

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
    } else {
      return await Promise.reject(response.Error);
    }
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

  // 计算当前页面的全路径列表，用于面包屑和页面 title 的数据
  @computed
  get selectedDirList() {
    if(this.menu && this.menu.length > 0 && this.selectedKeys && this.selectedKeys.length > 0) {
      let dirList = [];
      this.menu.forEach(item => {
        const list = this.getDirList(item, this.selectedKeys[0]);
        if(list && list.length > 0) {
          dirList = list;
        }
      });
      return dirList;
    }
    return [];
  }

  // 递归遍历，当 menuObj 的 children 中包涵选中对象或为选中对象的祖先节点时，
  // 把当前对象拼到递归返回的 list 前作为返回值
  getDirList(menuObj, selectedKey) {

    if(menuObj.id === selectedKey) {
      return [menuObj];
    } else {
      if(menuObj.hasChildren && menuObj.children) {
        let dirList = [];
        menuObj.children.forEach(item => {
          const list = this.getDirList(item, selectedKey);
          if(list && list.length > 0) {
            dirList = [menuObj, ...list];
          }
        });
        return dirList;
      }
    }
  }

}

export default new GlobalStore();



  