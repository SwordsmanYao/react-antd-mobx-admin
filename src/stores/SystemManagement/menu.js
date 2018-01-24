import { observable, action } from 'mobx';
import { queryTree, queryList, insert, remove, queryDetail, update } from '@/services/SystemManagement/menu';

class MenuStore {
  // 树结构数据
  @observable treeList = []; 
  // 当前选中的树节点id
  @observable selectedKeys = ['0']; 
  @observable expandedKeys = ['0'];

  // 列表数据
  @observable list = []; 
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
  // 新建按钮的是否显示加载中
  @observable newBtnLoading = false;

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async commit(data) {

    this.setData({
      newBtnLoading: true,
    });

    let response = null;

    // 当有 id 时为编辑，否则为新建
    if(data.UniqueID) {
      response = await update(data);
    } else {
      response = await insert(data);
    }

    this.setData({
      newBtnLoading: false,
    });

    if(response.Code === 200) {
      this.fetchList({ ParentID: data.ParentID });

      this.fetchTree();
    }
  }

  @action
  async remove(data) {

    const response = await remove(data);
    if(response.Code === 200) {
      this.fetchList({ ParentID: data.ParentID });

      this.fetchTree();
    }
  }

  @action
  async fetchDetail(data) {
    this.clearCurrentNode();

    const response = await queryDetail(data);

    if (response.Code === 200) {
      const data = {};
      // 将数据格式化，以适应组件
      Object.keys(response.Data).forEach((key) => {
        data[key] = { value: response.Data[key] };
      });
      // this.currentNode = data;
      this.setData({
        currentNode: {...data},
      });
    }
  }

  // 查询树的数据
  @action
  async fetchTree() {
    const response = await queryTree();
    if (response.Code === 200) {
      this.setData({
        treeList: response.Data
      });
    }
  }

  @action
  async fetchList(data) {
    this.setData({
      loading: true,
    });

    const response = await queryList(data);

    if (response.Code === 200) {

      this.setData({
        list: response.Data,
        // current/pageSize 来自页面
        // total 来自接口返回
        pagination: {...data,total: response.TotalCount},
      });
    }

    this.setData({
      loading: false,
    });
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

  @action
  setData(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}

export default new MenuStore();
