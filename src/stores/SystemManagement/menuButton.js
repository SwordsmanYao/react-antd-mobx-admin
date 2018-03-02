import { observable, action } from 'mobx';

import { insert, update, remove, queryList, queryDetail, queryMenuButtonTree } from '@/services/SystemManagement/menuButton';

import menu from './menu';

class MenuButtonStore {

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
  // 表单选择上级的下拉框数据
  @observable menuButtonTree;

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
    } else {
      return await Promise.reject(response.Error);
    }
  }

  @action
  async remove(data) {
    const response = await remove(data);
    if(response.Code === 200) {
      this.refreshList();
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

  // 使用当前状态刷新列表
  @action
  async refreshList() {
    this.fetchList({
      Menu_ID: menu.currentNode.UniqueID.value,
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
  async fetchMenuButtonTree(data) {
    const response = await queryMenuButtonTree(data);
    if(response.Code === 200) {
      this.setData({
        menuButtonTree: this.formatTree(response.Data),
      });
    }
  }

  formatTree(treeList) {
    return treeList.map(item => {
      if(item.hasChildren && item.children) {
        item.children = this.formatTree(item.children);
      }
      return {
        ...item,
        value: item.id,
        key: item.id,
        label: item.name,
      };
    })
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
    // 表单选择上级的下拉框数据
    this.menuButtonTree = [];
  }

  @action
  clearCurrentNode() {
    this.currentNode = this.defaultNode;
    this.error = null;
  }
  @action
  setCurrentNodeField(data) {
    this.currentNode = {
      ...this.currentNode,
      ...data,
    }
  }
} 

export default new MenuButtonStore();

