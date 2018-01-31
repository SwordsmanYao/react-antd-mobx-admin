import { observable, action } from 'mobx';
import { message } from 'antd';

import { queryOrgTextValue, queryTree, queryList, insert, remove, queryDetail, update } from '@/services/OrgManagement/user';

class UserStore {
  // 树结构数据
  @observable treeList = []; 
  // 当前选中的树节点id
  @observable selectedKeys;

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
  // 被选择行的行标识
  @observable selectedRowKeys = [];
  // 查询表单数据，在查询时赋值
  @observable searchFormValues = {};
  // table 排序字段
  @observable orderField = null;
  // 是否降序
  @observable isDesc = false;
  
  // currentNode 的默认值，用于 clear 时的数据
  defaultNode = {};
  // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
  @observable currentNode = this.defaultNode;
  // 新建按钮的是否显示加载中
  @observable newBtnLoading = false;
  // 后端返回的错误校验信息
  @observable error = null;
  // 新建的模态框是否显示
  @observable modalVisible = false; 
  // 组织类别下拉框数据
  @observable orgTextValue = [];

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

      message.success('提交成功');

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

    } else if(response.Code === 101) {
      this.setData({
        error: response.Error,
      });
    }
  }

  @action
  async remove(data) {
    const response = await remove(data);
    if(response.Code === 200) {

      message.success('删除成功');

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
      
      return true;
    }
    return false;
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
    }
    return null;
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

  @action
  async fetchOrgTextValue() {
    const response = await queryOrgTextValue();

    if(response.Code === 200) {
      this.setData({
        orgTextValue: response.Data,
      });
    }
  }

  /**
   * 不含异步操作的 action
   */
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
  @action
  setCurrentNode(data) {
    // 将数据格式化，以适应组件
    Object.keys(data).forEach((key) => {
      data[key] = {
        name: key, 
        value: data[key],
      };
    });

    this.currentNode = data;
  }

  @action
  setData(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }
}

export default new UserStore();
