import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Alert, Modal, message } from 'antd';
import moment from 'moment';

import DisplayTree from '@/components/DisplayTree';
import UserForm from './form';
import UserToolBar from './toolBar';
import PwdForm from './pwdForm';
import RoleSelect from './roleSelect';

import styles from './index.less';


const { Sider, Content } = Layout;
const { confirm } = Modal;

@inject('user')
@observer
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      // 修改密码框是否显示
      pwdModalVisible: false,
      // 修改角色框是否显示
      roleModalVisible: false,
    }
  }

  componentWillMount() {
    const { user } = this.props;

    user.reset();
    user.fetchTree().then((tree) => {
      if(tree && tree.length > 0) {
        user.setData({
          selectedKeys: [tree[0].id.toString()],
          expandedKeys: [tree[0].id.toString()],
        });
        user.refreshList();
      }
    });
  }

  componentWillUnmount() {
    const { user } = this.props;
    user.reset();
  }

  // 设置模态框显示/隐藏
  setModalVisible = (modalVisible) => {
    this.setState({
      modalVisible,
    });
  }

  setPwdModalVisible = (pwdModalVisible) => {
    this.setState({
      pwdModalVisible,
    });
  }

  setRoleModalVisible = (roleModalVisible) => {
    this.setState({
      roleModalVisible,
    });
  }

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { user } = this.props;

    if(selectedKeys.length > 0) {
      user.setData({
        selectedKeys: selectedKeys,
        pagination: {
          ...user.pagination,
          current: 1,
        },
      });
  
      let orderData = {};
      if(user.orderField) {
        orderData = {
          OrderField: user.orderField,
          IsDesc: user.isDesc,
        }
      }
      
      user.fetchList({
        OrganizationID: selectedKeys[0],
        CurrentPage: 1,
        PageSize: user.pagination.pageSize,
        ...user.searchFormValues,
        ...orderData,
      });
    }
  }

  // 新建
  handleNew = () => {
    this.setModalVisible(true);
  }

  // 修改
  handleEdit = () => {
    const { user } = this.props;

    user.fetchDetail().then(() => {
      const data = {
        ...user.currentDetail.Employee,
        ...user.currentDetail,
      };
      if(data.DateOfBirth) {
        data.DateOfBirth = moment(data.DateOfBirth);
      }
      user.setCurrentForm(data);
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { user } = this.props;

    user.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { user } = this.props;

    
    confirm({
      title: `确认要删除这 ${user.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(user.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { user } = this.props;

    user.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      user.setData({
        selectedRowKeys: user.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
      });
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 重置密码
  handleResetPwd = () => {
    const { user } = this.props;

    user.fetchDetail().then(() => {
      this.setPwdModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 启用/禁用用户 [1] 启用  [0] 禁用
  handleEnableUser = (Params) => {
    const { user } = this.props;
     user.setStatus({
      UniqueID: user.selectedRowKeys[0],
      Params,
     }).then(() => {
      message.success('操作成功');
     }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
     });
  }

  // 设置成员角色
  handleRoleEdit = () => {
    const { user } = this.props;
    user.getMemberRole({
      UniqueID: user.selectedRowKeys[0],
    }).then(() => {
      this.setRoleModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 表格分页、排序等的回调函数
  handleTableChange = (pagination, filters, sorter) => {
    const { user } = this.props;

    // 排序数据
    const sorterData = {};
    if(sorter.field) {
      sorterData.OrderField = sorter.field;
      if(sorter.order === 'descend') {
        sorterData.IsDesc = true;
      } else {
        sorterData.IsDesc = false;
      }
    }

    // 修改 store 数据
    user.setData({
      pagination: {
        ...user.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      orderField: sorterData.OrderField || null,
      isDesc: sorterData.IsDesc || false,
    });

    // 发起请求
    user.fetchList({
      OrganizationID: user.selectedKeys[0],
      CurrentPage: pagination.current,
      PageSize: pagination.pageSize,
      ...user.searchFormValues,
      ...sorterData,
    });
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { user } = this.props;

    user.setData({
      selectedRowKeys,
    });
  }

  render() {
    const { user } = this.props;

    const columns = [{ 
      title: '序号',
      dataIndex: 'NO',
      width: '7%',
      className:'alignCenter', 
      render: (text, row, index) =>(
        index + 1 + (user.pagination.current - 1) * user.pagination.pageSize
      ),
    }, {
      title: '登录名',
      dataIndex: 'LoginName',
      key: 'LoginName',
      width: '20%',
    }, {
      title: '姓名',
      dataIndex: 'FullName',
      key: 'FullName',
      width: '20%',
    }, {
      title: '工号',
      dataIndex: 'JobNumber',
      key: 'JobNumber',
      width: '20%',
    }, {
      title: '状态',
      dataIndex: 'UserStatus',
      key: 'UserStatus',
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={210} style={{ height: window.innerHeight - 110, overflowY: 'scroll', overflowX: 'auto', background: '#fff' }}>
          <DisplayTree
            treeList={user.treeList.slice()}
            onSelect={this.onSelect}
            selectedKeys={user.selectedKeys.slice()}
            defaultExpandedKeys={user.selectedKeys.slice()}
          />
        </Sider>
        <Content style={{ paddingLeft: 24 }}>
          <UserToolBar 
            user={user}
            handleNew={this.handleNew}
            handleEdit={this.handleEdit}
            handleRemoveChecked={this.handleRemoveChecked}
            handleResetPwd={this.handleResetPwd}
            handleEnableUser={this.handleEnableUser}
            handleRoleEdit={this.handleRoleEdit}
          />
          <UserForm
            user={user}
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
          />
          <PwdForm
            user={user}
            pwdModalVisible={this.state.pwdModalVisible}
            setPwdModalVisible={this.setPwdModalVisible}
          />
          <RoleSelect
            user={user}
            roleModalVisible={this.state.roleModalVisible}
            setRoleModalVisible={this.setRoleModalVisible}
          />
          <div className={styles.tableAlert}>
            <Alert
              message={(
                <div>
                  已选择 <a style={{ fontWeight: 600 }}>{user.selectedRowKeys.length}</a> 项
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={user.selectedRowKeys.length <= 0}>清空</a>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table
            bordered
            loading={user.loading}
            pagination={{
              showSizeChanger: true, 
              showQuickJumper: true,
              showTotal: (total, range) => `共 ${total} 条`,
              ...user.pagination,
            }}
            dataSource={user.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            rowSelection={{
              selectedRowKeys: user.selectedRowKeys,
              onChange: this.onSelectionChange,
            }}
            scroll={{ y: window.innerHeight - 293 }}
            size="small"
          />
        </Content>
      </Layout>
    );
  }
}
