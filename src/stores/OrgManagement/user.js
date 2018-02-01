import { observable, action } from 'mobx';
import { message } from 'antd';

import { queryTree, queryList, insert, remove, update, resetPwd, setStatus, getMemberRole, setMemberRole } from '@/services/OrgManagement/user';

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

  // 需要修改密码的用户信息
  @observable currentResetPwdUser = null;
  // 修改密码后端返回的错误校验信息
  @observable pwdError = null;

  // 成员角色列表数据
  @observable memberRole = null;
  // 需要设置角色的用户
  @observable currentSetRoleUser = null;
  // 被选择角色的行标识
  @observable roleSelectedRowKeys = [];

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

  // 重置密码
  @action
  async resetPwd(data) {
    const response = await resetPwd(data);

    if(response.Code === 200) {
      return true;
    } else {
      this.setData({
        pwdError: response.Error,
      });
      return false;
    }
  }

  // 启用/禁用
  @action
  async setStatus(data) {
    const response = await setStatus(data);

    if(response.Code === 200) {
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
    } else {
      return await Promise.reject();
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
      // response.Error.Message
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
