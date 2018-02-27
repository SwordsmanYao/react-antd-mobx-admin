import { observable, action } from 'mobx';

import { queryCategoryTextValue, queryTree, queryList, insert, remove, queryDetail, update } from '@/services/OrgManagement/org';

class OrgStore {
  // 树结构数据
  @observable treeList; 
  // 当前选中的树节点id
  @observable selectedKeys; 

  // 列表数据
  @observable list; 
  // 控制列表是否显示加载中
  @observable loading; 
  // 列表分页数据
  // @observable pagination;
  
  // currentNode 的默认值，用于 clear 时的数据
  defaultNode = {};
  // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
  @observable currentNode;
  // 新建按钮的是否显示加载中
  @observable newBtnLoading;
  // 组织类别下拉框数据
  @observable categoryTextValue;

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async commit(data) {

    this.setData({
      newBtnLoading: true,
      error: null,
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
      this.refreshList();
      this.fetchTree();
    } else {
      return await Promise.reject(response.Error);
    }
  }

  @action
  async remove(data) {
    const response = await remove(data);
    if(response.Code === 200) {
      this.refreshList();
      this.fetchTree();
    } else {
      return await Promise.reject(response.Error);
    }
  }

  @action
  async fetchDetail(data) {

    const response = await queryDetail(data);

    if (response.Code === 200) {
      const data = {};
      // 将数据格式化，以适应组件
      Object.keys(response.Data).forEach((key) => {
        data[key] = {
          name: key, 
          value: response.Data[key],
        };
      });

      this.setData({
        currentNode: {...data},
      });
    } else {
      return await Promise.reject(response.Error);
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

  // 使用当前状态刷新列表
  @action
  async refreshList() {
    this.fetchList({
      ParentID: this.selectedKeys[0],
      // CurrentPage: this.pagination.current,
      // PageSize: this.pagination.pageSize,
    });
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
        // total 来自接口返回
        // pagination: {
        //   ...this.pagination,
        //   total: response.TotalCount
        // },
      });
    }
    
    this.setData({
      loading: false,
    });
  }

  @action
  async fetchCategoryTextValue() {
    const response = await queryCategoryTextValue();

    if(response.Code === 200) {
      this.setData({
        categoryTextValue: response.Data,
      });
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
  // 用于初始化和切换页面时清空数据
  @action
  reset() {
    // 树结构数据
    this.treeList = []; 
    // 当前选中的树节点id
    this.selectedKeys = ['0']; 

    // 列表数据
    this.list = []; 
    // 控制列表是否显示加载中
    this.loading = false; 
    // 列表分页数据
    // this.pagination = {
    //   current: 1,
    //   pageSize: 200,
    //   total: 0, // 总数,由接口提供
    // };
    
    // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
    this.currentNode = this.defaultNode;
    // 新建按钮的是否显示加载中
    this.newBtnLoading = false;
    // 组织类别下拉框数据
    this.categoryTextValue = [];
  }

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

export default new OrgStore();
