import { observable, action } from 'mobx';

import { 
  insert, update, remove, queryList, queryDetail, getRoleMenu, setRoleMenu, getRoleMenuButton,
  setRoleMenuButton, getRoleMenuField, setRoleMenuField, getRoleMember, getRoleMemberDetail,
  setRoleMember, queryOrgTree
} from '@/services/OrgManagement/role';

class RoleStore {

  // 列表数据
  @observable list;
  // 控制列表是否显示加载中
  @observable loading; 
  // 列表分页数据
  @observable pagination;
  @observable selectedRowKeys;
  // 当前要操作的数据详情
  @observable currentDetail;

  // currentForm 的默认值，用于 clear 时的数据
  defaultCurrentForm = {
    IsAvailable: {
      value: 1,
    },
  };
  // 当前正在编辑的节点，属性为对象，包涵错误信息等，eg: {Name: {value: 'test'}},
  @observable currentForm;
  // 新建按钮的是否显示加载中
  @observable newBtnLoading;

  // 角色菜单树
  @observable roleMenuTree;
  // 角色菜单树选中 keys
  @observable roleMenuCheckedKeys;
  // 半选中状态的节点值，向后端提交时也要包涵这部分 keys
  @observable roleMenuHalfCheckedKeys;

  // 角色菜单按钮树
  @observable roleMenuButtonTree;
  // 角色菜单按钮树选中 keys
  @observable roleMenuButtonCheckedKeys;
  // 半选中状态的节点值，向后端提交时也要包涵这部分 keys
  @observable roleMenuButtonHalfCheckedKeys;

  // 角色菜单按钮树
  @observable roleMenuFieldTree;
  // 角色菜单按钮树选中 keys
  @observable roleMenuFieldCheckedKeys;
  // 半选中状态的节点值，向后端提交时也要包涵这部分 keys
  @observable roleMenuFieldHalfCheckedKeys;

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
        roleMenuCheckedKeys: this.getTreeChecked(response.Data).checkedKeys,
        roleMenuHalfCheckedKeys: this.getTreeChecked(response.Data).halfCheckedKeys,
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

  // 获取角色授权窗口的菜单按钮树
  @action
  async fetchRoleMenuButtonTree(data) {
    const response = await getRoleMenuButton(data);
    if(response.Code === 200) {
      const roleMenuButtonTree = this.getRoleMenuTreeWithDetail(
        this.roleMenuTree,
        response.Data,
        this.roleMenuCheckedKeys,
        this.roleMenuHalfCheckedKeys,
      );
      this.setData({
        roleMenuButtonTree,
        roleMenuButtonCheckedKeys: this.getTreeChecked(roleMenuButtonTree).checkedKeys,
        roleMenuButtonHalfCheckedKeys: this.getTreeChecked(roleMenuButtonTree).halfCheckedKeys,
      });
    }
  }

  @action
  async commitRoleMenuButton(data) {
    const response = await setRoleMenuButton(data);
    if(!response.Code === 200) {
      return await Promise.reject(response.Error);
    }
  }

  // 获取角色授权窗口的菜单树
  @action
  async fetchRoleMenuFieldTree(data) {
    const response = await getRoleMenuField(data);
    if(response.Code === 200) {
      const roleMenuFieldTree = this.getRoleMenuTreeWithDetail(
        this.roleMenuTree,
        response.Data,
        this.roleMenuCheckedKeys,
        this.roleMenuHalfCheckedKeys,
      );
      this.setData({
        roleMenuFieldTree,
        roleMenuFieldCheckedKeys: this.getTreeChecked(roleMenuFieldTree).checkedKeys,
        roleMenuFieldHalfCheckedKeys: this.getTreeChecked(roleMenuFieldTree).halfCheckedKeys,
      });
    }
  }

  @action
  async commitRoleMenuField(data) {
    const response = await setRoleMenuField(data);
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

    // 角色菜单树
    this.roleMenuTree = [];
    // 角色菜单树选中 keys
    this.roleMenuCheckedKeys = [];
    // 半选中状态的节点值，向后端提交时也要包涵这部分 keys
    this.roleMenuHalfCheckedKeys = [];

    // 角色菜单按钮树
    this.roleMenuButtonTree = [];
    // 角色菜单按钮树选中 keys
    this.roleMenuButtonCheckedKeys = [];
    // 半选中状态的节点值，向后端提交时也要包涵这部分 keys
    this.roleMenuButtonHalfCheckedKeys = [];

    // 角色菜单按钮树
    this.roleMenuFieldTree = [];
    // 角色菜单按钮树选中 keys
    this.roleMenuFieldCheckedKeys = [];
    // 半选中状态的节点值，向后端提交时也要包涵这部分 keys
    this.roleMenuFieldHalfCheckedKeys = [];

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

  // 合并菜单树和按钮列表/字段列表，把按钮/字段树加到菜单叶节点上
  getRoleMenuTreeWithDetail(roleMenuTree, roleMenuDetailList, roleMenuCheckedKeys, roleMenuHalfCheckedKeys) {
    return roleMenuTree
    .filter(item => ([...roleMenuCheckedKeys, ...roleMenuHalfCheckedKeys].includes(item.id)))
    .map(item => {
      let children = [];
      let selected = false;

      if(item.hasChildren && item.children && item.children.length > 0) {
        children = this.getRoleMenuTreeWithDetail(item.children, roleMenuDetailList, roleMenuCheckedKeys, roleMenuHalfCheckedKeys);
        selected = children.some(item => item.selected);
      } else {
        roleMenuDetailList.forEach(details => {
          if(item.id === details.MenuID.toString()) {
            const itemList = details.Buttons || details.Fields;
            children = this.formatDetails(itemList, details.MenuID);

            selected = itemList.some(detail => detail.selected);
          }
        })
      }
      return {
        id: item.id,
        name: item.name,
        hasChildren: children.length > 0,
        selected,
        children,
      }
    });
  }

  // 格式化按钮/字段数据的 id，把 menuid 加到 id 中，添加 icon
  formatDetails(itemList,  menuID) {
    return itemList.map(item => {
      const data = {
        ...item,
        id: `${menuID}-${item.id}`,
        icon: 'tag',
      };
      if(item.hasChildren && item.children && item.children.length >0) {
        data.children = this.formatDetails(item.children, menuID);
      }
      return data;
    });
  }

  // 从树数组中获取 全选中的id （checkedKeys）和半选中的id （halfCheckedKeys）
  getTreeChecked(tree, { checkedKeys = [], halfCheckedKeys = [], isCheckedAll = true } = {}) {
    
    tree.forEach(item => {
      if(item.selected) {
        if(item.hasChildren && item.children && item.children.length > 0) {
          const result = this.getTreeChecked(item.children);
          // 只有 children 中节点都被选中 item 才为全选中状态否则为半选中状态
          if(!result.isCheckedAll) {
            isCheckedAll = false;
            checkedKeys = [...checkedKeys, ...result.checkedKeys];
            halfCheckedKeys = [...halfCheckedKeys, ...result.halfCheckedKeys, item.id];
          } else {
            checkedKeys = [...checkedKeys, ...result.checkedKeys, item.id];
            halfCheckedKeys = [...halfCheckedKeys, ...result.halfCheckedKeys];
          }
        } else {
          checkedKeys = [...checkedKeys, item.id];
        }
      } else {
        isCheckedAll = false;
      }
    });
    return {
      checkedKeys,
      halfCheckedKeys,
      isCheckedAll,
    }
  }


} 

export default new RoleStore();

