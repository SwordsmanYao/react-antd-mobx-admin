import { observable, action } from 'mobx';

import { queryTree, queryList, insert, remove, queryDetail, update, resetPwd, setStatus, getMemberRole, setMemberRole } from '@/services/OrgManagement/user';

class UserStore {
  // 树结构数据
  @observable treeList; 
  // 当前选中的树节点id
  @observable selectedKeys;

  // 列表数据
  @observable list; 
  // 控制列表是否显示加载中
  @observable loading; 
  // 列表分页数据
  @observable pagination;
  // 被选择行的行标识
  @observable selectedRowKeys;
  // 查询表单数据，在查询时赋值
  @observable searchFormValues;
  // table 排序字段
  @observable orderField;
  // 是否降序
  @observable isDesc;
  // 当前要操作的数据详情
  @observable currentDetail;
  
  // currentForm 的默认值，用于 clear 时的数据
  defaultCurrentForm = {};
  // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
  @observable currentForm;
  // 新建按钮的是否显示加载中
  @observable newBtnLoading;
  // 组织类别下拉框数据
  @observable orgTextValue;

  // 成员角色列表数据
  @observable memberRole;
  // 被选择角色的行标识
  @observable roleSelectedRowKeys;

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
  async fetchTree() {
    const response = await queryTree();
    if (response.Code === 200) {
      this.setData({
        treeList: response.Data,
      });

      return response.Data;
    } else {
      return await Promise.reject(response.Error);
    }
  }

  // 使用当前状态刷新列表
  @action
  async refreshList() {
    let orderData = {};
    if(this.orderField) {
      orderData = {
        OrderField: this.orderField,
        IsDesc: this.isDesc,
      }
    }
    
    this.fetchList({
      OrganizationID: this.selectedKeys[0],
      CurrentPage: this.pagination.current,
      PageSize: this.pagination.pageSize,
      ...this.searchFormValues,
      ...orderData,
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
        pagination: {
          ...this.pagination,
          total: response.TotalCount,
        },
      });
    }

    this.setData({
      loading: false,
    });
  }

  // 重置密码
  @action
  async resetPwd(data) {
    const response = await resetPwd(data);

    if(response.Code !== 200) {
      return await Promise.reject(response.Error);
    }
  }

  // 启用/禁用
  @action
  async setStatus(data) {
    const response = await setStatus(data);

    if(response.Code === 200) {
      this.refreshList();
    } else {
      return await Promise.reject(response.Error);
    }
  }

  // 获取成员角色
  @action
  async getMemberRole(data) {
    const response = await getMemberRole(data);

    if(response.Code === 200) {
      const roleSelectedRowKeys = 
      response.Data
      .filter(item => item.IsMemberRole)
      .map(item => {
        return item.UniqueID;
      });

      this.setData({
        memberRole: response.Data,
        roleSelectedRowKeys,
      });
    } else {
      return await Promise.reject(response.Error);
    }
  }

  // 修改成员角色
  @action
  async setMemberRole(data) {
    const response = await setMemberRole(data);

    if(response.Code !== 200) {
      // response.Error.Message
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
  // 用于初始化和切换页面时清空数据
  @action
  reset() {
    // 树结构数据
    this.treeList = []; 
    // 当前选中的树节点id
    this.selectedKeys = [];

    // 列表数据
    this.list = []; 
    // 控制列表是否显示加载中
    this.loading = false; 
    // 列表分页数据
    this.pagination = {
      current: 1,
      pageSize: 20,
      total: 20, // 总数,由接口提供
    };
    // 被选择行的行标识
    this.selectedRowKeys = [];
    // 查询表单数据，在查询时赋值
    this.searchFormValues = {};
    // table 排序字段
    this.orderField = null;
    // 是否降序
    this.isDesc = false;
    // 当前要操作的数据详情
    this.currentDetail = null;
    
    // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
    this.currentForm = this.defaultCurrentForm;
    // 新建按钮的是否显示加载中
    this.newBtnLoading = false;
    // 组织类别下拉框数据
    this.orgTextValue = [];

    // 成员角色列表数据
    this.memberRole = null;
    // 被选择角色的行标识
    this.roleSelectedRowKeys = [];
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

export default new UserStore();
