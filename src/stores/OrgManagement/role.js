import { observable, action } from 'mobx';

import { insert, update, remove, queryList, queryDetail, getRoleMenu, setRoleMenu, getRoleMember, getRoleMemberDetail, setRoleMember, queryOrgTree } from '@/services/OrgManagement/role';

class RoleStore {

  // 列表数据
  @observable list;
  // 控制列表是否显示加载中
  @observable loading; 
  // 列表分页数据
  @observable pagination;

  // currentNode 的默认值，用于 clear 时的数据
  defaultNode = {
    IsAvailable: {
      value: 1,
    },
  };
  // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
  @observable currentNode;
  // 新建按钮的是否显示加载中
  @observable newBtnLoading;

  // 当前授权的角色
  @observable currentAuth;
  // 角色菜单树
  @observable roleMenuTree;
  // 角色菜单树选中 keys
  @observable roleMenuCheckedKeys;
  // 半选中状态的节点值，向后端提交时也要包涵这部分 keys
  @observable roleMenuHalfCheckedKeys;

  // 当前设置成员的角色
  @observable currentMemberNode;
  // 角色成员弹窗中的组织机构树
  @observable orgTree;
  // 当前选中的树节点id
  @observable selectedOrgKeys; 
  // 角色成员弹窗中角色成员列表
  @observable roleMemberList;
  // 选中的角色成员id
  @observable selectedRoleMemberIDSet;


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
        data[key] = { value: response.Data[key] };
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

  // 获取角色授权窗口的菜单树
  @action
  async fetchRoleMenuTree(data) {
    const response = await getRoleMenu(data);
    if(response.Code === 200) {
      this.setData({
        roleMenuTree: response.Data,
        roleMenuCheckedKeys: this.getSelectedIDs(response.Data),
      });
    }
  }

  @action
  async commitRoleMenu(data) {
    const response = await setRoleMenu(data);
    if(!response.Code === 200) {
      return await Promise.reject(response.Error);
    }
  }

  // 获取角色成员窗口的组织机构树
  @action
  async fetchOrgTree(data) {
    const response = await queryOrgTree(data);
    if(response.Code === 200) {
      this.setData({
        orgTree: response.Data,
      });
      return response.Data;
    } else {
      return await Promise.reject(response.Error);
    }

  }

  // 获取角色成员窗口选中的角色成员
  @action
  async fetchRoleMember(data) {
    const response = await getRoleMember(data);
    if(response.Code === 200) {
      this.setData({
        selectedRoleMemberIDSet: new Set(response.Data.map(item => (item.UserID))),
      });
    }
  }

  // 获取角色成员窗口选中的角色成员
  @action
  async fetchRoleMemberDetail(data) {
    const response = await getRoleMemberDetail(data);
    if(response.Code === 200) {
      this.setData({
        roleMemberList: response.Data,
      });
    }
  }

  @action
  async commitRoleMember(data) {
    const response = await setRoleMember(data);
    if(!response.Code === 200) {
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

    // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
    this.currentNode = this.defaultNode;
    // 新建按钮的是否显示加载中
    this.newBtnLoading = false;

    // 当前授权的角色
    this.currentAuth = null;
    // 角色菜单树
    this.roleMenuTree = [];
    // 角色菜单树选中 keys
    this.roleMenuCheckedKeys = [];

    // 当前设置成员的角色
    this.currentMemberNode = null;
    // 角色成员弹窗中的组织机构树
    this.orgTree = [];
    // 当前选中的树节点id
    this.selectedOrgKeys = []; 
    // 角色成员弹窗中角色成员列表
    this.roleMemberList = [];
    // 选中的角色成员id
    this.selectedRoleMemberIDSet = new Set();
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

  // 选中或取消角色成员
  @action
  toggleRoleMemberChecked(UniqueID) {
    this.roleMemberList = this.roleMemberList.map(item => {
      if(item.UniqueID === UniqueID) {
        if(item.IsRoleMember) {
          this.selectedRoleMemberIDSet.delete(UniqueID);
        } else {
          this.selectedRoleMemberIDSet.add(UniqueID);
        }
        return {
          ...item,
          IsRoleMember: !item.IsRoleMember,
        };
      }
      return item;
    })
  }

  getSelectedIDs(tree, ids = []) {
    
    tree.forEach(item => {
      if(item.selected) {
        // 如果有 children 就要每一个子节点都被选中时，父节点才选中,否则父节点为半选中状态
        if(!(item.hasChildren && item.children) || item.children.every(item => item.selected)) {
          ids = [...ids, item.id];
        }
      }
      if(item.hasChildren && item.children && item.children.length) {
        ids = this.getSelectedIDs(item.children, ids);
      }
    });
    return ids;
  }
} 

export default new RoleStore();

