import { observable, action, transaction } from 'mobx';
import { queryMenu, queryMenuList, insertMenu, deleteMenu, queryMenuDetail, updateMenu } from '../services/menu';

class MenuStore {
  // 树结构数据
  @observable treeList = []; 
  // 当前选中的树节点id
  @observable selectedKeys = ['0']; 

  // 列表数据
  @observable menuList = []; 
  // 控制列表是否显示加载中
  @observable loading = false; 
  // 列表分页数据
  @observable pagination = {
    current: 1,
    pageSize: 20,
    total: 20, // 总数,由接口提供
  };
  
  // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
  @observable currentNode = {};
  // currentNode 的默认值，用于 clear 时的数据
  defaultNode = {
    IsDisplayed: {
      value: 1,
    },
  };

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async commitMenu(data) {
    this.loading = true;

    let response = null;

    // 当有 id 时为编辑，否则为新建
    if(data.UniqueID) {
      response = await updateMenu(data);
    } else {
      response = await insertMenu(data);
    }

    if(response.Code === 200) {
      this.fetchMenuList({ ParentID: data.ParentID });

      this.fetchTree();
    }

    this.loading = false;
  }

  @action
  async deleteMenu(data) {
    this.loading = true;

    const response = await deleteMenu(data);

    if(response.Code === 200) {
      this.fetchMenuList({ ParentID: data.ParentID });

      this.fetchTree();
    }

    this.loading = false;
  }

  @action
  async fetchMenuDetail(data) {
    this.clearCurrentNode();

    const response = await queryMenuDetail(data);

    if (response.Code === 200) {
      const data = {};
      // 将数据格式化，以适应组件
      const keys = Object.keys(response.Data);
      keys.forEach((item) => {
        data[item] = { value: response.Data[item] };
      });
      this.currentNode = data;
    }
  }

  // 查询树的数据
  @action
  async fetchTree() {
    const response = await queryMenu();
    if (response.Code === 200) {
      this.treeList = response.Data;
    }
  }

  @action
  async fetchMenuList(data) {
    this.loading = true;

    const response = await queryMenuList(data);

    if (response.Code === 200) {
      // 使用 transaction 只会在函数调用结束后触发一次组件渲染
      transaction(() => {
        this.menuList = response.Data;
        // current/pageSize 来自页面
        // total 来自接口返回
        this.pagination = {...data,total: response.TotalCount};
      });
    }

    this.loading = false;
  }

  /**
   * 不含异步操作的 action
   */
  @action
  clearCurrentNode() {
    this.currentNode = this.defaultNode;
  }
  @action
  setCurrentNodeField(data) {
    this.currentNode = {
      ...this.currentNode,
      ...data,
    }
  } 

}

export default new MenuStore();