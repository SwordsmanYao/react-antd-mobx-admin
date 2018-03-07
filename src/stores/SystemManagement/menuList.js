import { observable, action } from 'mobx';

import { insert, update, remove, queryList, queryDetail } from '@/services/SystemManagement/menuList';

import menu from './menu';

class MenuListStore {

  // 列表数据
  @observable list;
  // 控制列表是否显示加载中
  @observable loading; 
  // 列表分页数据
  // @observable pagination;

  // currentForm 的默认值，用于 clear 时的数据
  defaultCurrentForm = {
    IsSortFields: {
      value: false,
    },
  };
  // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
  @observable currentForm;
  // 新建按钮的是否显示加载中
  @observable newBtnLoading;


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
        let value = response.Data[key];
        if(key==='ParentID') {
          value = value.toString();
        }

        data[key] = {
          name: key,
          value,
        };
      });

      this.setData({
        currentForm: {...data},
      });
    } else {
      return await Promise.reject(response.Error);
    }
  }

  // 使用当前状态刷新列表
  @action
  async refreshList() {
    this.fetchList({
      Menu_ID: menu.currentForm.UniqueID.value,
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

    // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
    this.currentForm = this.defaultCurrentForm;
    // 新建按钮的是否显示加载中
    this.newBtnLoading = false;
  }

  @action
  clearCurrentForm() {
    this.currentForm = this.defaultCurrentForm;
    this.error = null;
  }
  @action
  setCurrentFormField(data) {
    this.currentForm = {
      ...this.currentForm,
      ...data,
    }
  }
} 

export default new MenuListStore();

