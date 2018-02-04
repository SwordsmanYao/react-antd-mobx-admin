import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Divider, Popconfirm, Alert, Modal, message } from 'antd';
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
        CurrentPage: user.pagination.current,
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
  handleEdit = (record) => {
    const { user } = this.props;
    console.log('record' ,record);

    const data = {...record};
    if(data.DateOfBirth) {
      data.DateOfBirth = moment(data.DateOfBirth);
    }
    user.setCurrentNode(data);
    this.setModalVisible(true);    
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
  handleResetPwd = (record) => {
    const { user } = this.props;

    this.setPwdModalVisible(true);
    user.setData({
      currentResetPwdUser: record,
    });
  }

  // 启用/禁用用户
  handleEnableUser = (record, Params) => {
    const { user } = this.props;
     user.setStatus({
      UniqueID: record.UniqueID,
      Params,
     }).then(() => {
      message.success('操作成功');
     }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
     });
  }

  // 设置成员角色
  handleRoleEdit = (record) => {
    const { user } = this.props;
    user.getMemberRole({
      UniqueID: record.UniqueID,
    }).then(() => {
      user.setData({
        currentSetRoleUser: record,
      });
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
      title: '登录名',
      dataIndex: 'LoginName',
      key: 'LoginName',
      width: 100,
    }, {
      title: '姓名',
      dataIndex: 'FullName',
      key: 'FullName',
      width: 100,
    }, {
      title: '工号',
      dataIndex: 'JobNumber',
      key: 'JobNumber',
      width: 100,
    }, {
      title: '状态',
      dataIndex: 'UserStatus',
      key: 'UserStatus',
      width: 100,
    }, {
      title: '操作',
      key: 'Action',
      width: 300,
      render: (text, record) => (
        <span>
          <a
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleEdit(record);
            }}
          >编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm 
            placement="bottomLeft"
            title="确认要删除这条记录吗？" 
            onConfirm={() => { this.handleRemove([record.UniqueID]); }} 
            okText="是" 
            cancelText="否"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >删除
            </a>
          </Popconfirm>
          <Divider type="vertical" />
          <a
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleResetPwd(record);
            }}
          >重置密码
          </a>
          <Divider type="vertical" />
          <Popconfirm 
            placement="bottomLeft"
            title="确认要启用该用户吗？" 
            onConfirm={() => { this.handleEnableUser(record, [1]); }} 
            okText="是" 
            cancelText="否"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >启用
            </a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm 
            placement="bottomLeft"
            title="确认要禁用该用户吗？" 
            onConfirm={() => { this.handleEnableUser(record, [0]); }} 
            okText="是" 
            cancelText="否"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >禁用
            </a>
          </Popconfirm>
          <Divider type="vertical" />
          <a
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleRoleEdit(record);
            }}
          >角色
          </a>
        </span>
      ),
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={210} style={{ background: '#fff' }}>
          {
            user.treeList && user.treeList.length > 0 && user.selectedKeys &&
              <DisplayTree
                treeList={user.treeList.slice()}
                onSelect={this.onSelect}
                selectedKeys={user.selectedKeys.slice()}
                defaultExpandedKeys={user.selectedKeys.slice()}
              />
          }
        </Sider>
        <Content style={{ background: '#fff', marginLeft: 10, padding: 30 }}>
          <UserToolBar 
            user={user}
            handleNew={this.handleNew}
           />
          {
            // 需要密码字段在编辑时不显示，这里是为了让form重新挂载，否则表单域中仍然有密码字段
            this.state.modalVisible &&
            <UserForm
              user={user}
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible}
            />
          }
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
                  <a onClick={this.handleRemoveChecked} style={{ marginLeft: 24 }} disabled={user.selectedRowKeys.length <= 0}>删除</a>
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
            scroll={{ y: window.innerHeight - 290 }}
            size="small"
          />
        </Content>
      </Layout>
    );
  }
}
