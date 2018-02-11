import { observable, action } from 'mobx';

import { queryList, remove } from '@/services/SystemManagement/exceptionLog';

class ExceptionLogStore {

  // 列表数据
  @observable list;
  // 控制列表是否显示加载中
  @observable loading; 
  // 列表分页数据
  @observable pagination;
  // table 排序字段
  @observable orderField;
  // 是否降序
  @observable isDesc;
  // 被选择行的行标识
  @observable selectedRowKeys;

  // 查询表单数据，在查询时赋值
  @observable searchFormValues;
  // 操作类型下拉框数据
  @observable operateTypeTextValue;
  

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async remove(data) {
    const response = await remove(data);
    if(response.Code === 200) {
      this.refreshList();
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
    this.pagination = {
      current: 1,
      pageSize: 20,
      total: 0, // 总数,由接口提供
    };
    // table 排序字段
    this.orderField = null;
    // 是否降序
    this.isDesc = false;
    // 被选择行的行标识
    this.selectedRowKeys = [];

    // 查询表单数据，在查询时赋值
    this.searchFormValues = {};
    // 操作类型下拉框数据
    this.operateTypeTextValue = [];
  }
}

export default new ExceptionLogStore();
