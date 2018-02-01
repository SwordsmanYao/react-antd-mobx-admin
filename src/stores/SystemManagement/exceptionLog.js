import { observable, action } from 'mobx';

import { queryList, remove } from '@/services/SystemManagement/exceptionLog';

class ExceptionLogStore {

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


  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async remove(data) {
    const response = await remove(data);
    if(response.Code === 200) {

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
    } else {
      return await Promise.reject(response.Error);
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
}

export default new ExceptionLogStore();
