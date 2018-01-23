import { observable, action } from 'mobx';
import { insert, update, remove, queryList, queryDetail } from '../services/orgCategory';

class OrgCategoryStore {

  // 列表数据
  @observable orgCategoryList = [];
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
  async commit(data) {

    this.setData({
      loading: true
    });

    let response = null;

    // 当有 id 时为编辑，否则为新建
    if(data.UniqueID) {
      response = await update(data);
    } else {
      response = await insert(data);
    }

    if(response.Code === 200) {
      this.fetchList();
    }

    this.setData({
      loading: false
    });
  }

  @action
  async remove(data) {
    this.setData({
      loading: true
    });

    const response = await remove(data);
    if(response.Code === 200) {
      this.fetchList();
    }

    this.setData({
      loading: false
    });
  }

  @action
  async fetchDetail(data) {
    this.clearCurrentNode();

    const response = await queryDetail(data);

    if (response.Code === 200) {
      const data = {};
      // 将数据格式化，以适应组件
      const keys = Object.keys(response.Data);
      keys.forEach((item) => {
        data[item] = { value: response.Data[item] };
      });
      // this.currentNode = data;
      this.setData({
        currentNode: {...data},
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
        orgCategoryList: response.Data,
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
    const keys = Object.keys(data);
    keys.forEach((item) => {
      this[item] = data[item];
    });
  }
} 

export default new OrgCategoryStore();
