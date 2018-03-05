import { observable, action } from 'mobx';

import { queryTree, queryList, insert, queryDetail, remove, update } from '@/services/SystemManagement/administrativeArea';

class AdministrativeAreaStore {
  // 树结构数据
  @observable treeList; 
  // 当前选中的树节点id
  @observable selectedKeys;
  // 当前选中的树节点的信息
  @observable selectedInfo;

  // 列表数据
  @observable list; 
  // 控制列表是否显示加载中
  @observable loading; 
  // 列表分页数据
  @observable pagination;
  // 被选择行的行标识
  @observable selectedRowKeys;
  // 当前要操作的数据详情
  @observable currentDetail;
  
  // currentForm 的默认值，用于 clear 时的数据
  defaultCurrentForm = {};
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
    if(data.OldUniqueID) {
      response = await update({
        ...data,
        PaiXuMa: data.UniqueID, // 设置 PaiXuMa 和 UniqueID 字段一致
      });
    } else {
      response = await insert({
        ...data,
        PaiXuMa: data.UniqueID, // 设置 PaiXuMa 和 UniqueID 字段一致
      });
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
  async fetchDetail() {

    const response = await queryDetail({
      UniqueID: this.selectedRowKeys[0],
    });

    if (response.Code === 200) {
      this.setData({
        currentDetail: response.Data,
      });
    } else {
      return await Promise.reject(response.Error);
    }
  }

  // 查询树的数据
  @action
  async fetchTree(data) {
    const response = await queryTree(data);
    if (response.Code === 200) {
      this.setData({
        treeList: response.Data
      });
    }
  }

  // 查询树节点的数据
  @action
  async fetchTreeNode(data) {
    const response = await queryTree(data);
    if (response.Code === 200) {
      return response.Data;
    } else {
      return await Promise.reject(response.Error);
    }
  }

  // 使用当前状态刷新列表
  @action
  async refreshList() {
    this.fetchList({
      ParentID: this.selectedKeys[0],
      CurrentPage: this.pagination.current,
      PageSize: this.pagination.pageSize,
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
        pagination: {
          ...this.pagination,
          total: response.TotalCount
        },
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
    // 树结构数据
    this.treeList = []; 
    // 当前选中的树节点id
    this.selectedKeys = ['0'];
    // 当前选中的树节点的信息
    this.selectedInfo = { depthlevel: 0 };

    // 列表数据
    this.list = []; 
    // 控制列表是否显示加载中
    this.loading = false; 
    // 列表分页数据
    this.pagination = {
      current: 1,
      pageSize: 20,
      total: 0, // 总数,由接口提供
    };
    // 被选择行的行标识
    this.selectedRowKeys = [];
    // 当前要操作的数据详情
    this.currentDetail = null;
    
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
  @action
  setCurrentForm(data) {
    // 将数据格式化，以适应组件
    Object.keys(data).forEach((key) => {
      data[key] = {
        name: key, 
        value: data[key],
      };
    });

    this.currentForm = data;
  }
}

export default new AdministrativeAreaStore();
