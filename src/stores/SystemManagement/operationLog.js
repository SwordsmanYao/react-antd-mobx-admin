import { observable, action } from 'mobx';
import { message } from 'antd';

import { queryList, remove } from '@/services/SystemManagement/operationLog';

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


  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async remove(data) {
    const response = await remove(data);
    if(response.Code === 200) {

      message.success('删除成功');

      this.fetchList();
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
        // current/pageSize 来自页面
        // total 来自接口返回
        pagination: {
          current: data.CurrentPage,
          pageSize: data.PageSize,
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

export default new OperationLogStore();
