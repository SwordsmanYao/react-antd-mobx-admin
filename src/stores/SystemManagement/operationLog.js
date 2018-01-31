import { observable, action } from 'mobx';
import { message } from 'antd';

import { queryList, remove, queryOperateType } from '@/services/SystemManagement/operationLog';

class OperationLogStore {

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
  // 操作类型下拉框数据
  @observable operateTypeTextValue = [];


  /**
   * 含有接口请求等异步操作的 action
   */
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
  async fetchOperateTypeTextValue() {
    const response = await queryOperateType();

    if(response.Code === 200) {
      this.setData({
        operateTypeTextValue: response.Data,
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
}

export default new OperationLogStore();
