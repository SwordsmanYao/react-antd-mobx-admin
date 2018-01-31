import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Divider, Popconfirm, Alert, Modal } from 'antd';
import moment from 'moment';

import DisplayTree from '@/components/DisplayTree';
import UserForm from './form';
import UserToolBar from './toolBar';
import PwdForm from './pwdForm';
import styles from './index.less';


const { Sider, Content } = Layout;
const { confirm } = Modal;

@inject('user')
@observer
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pwdModalVisible: false,
    }

    this.onSelect = this.onSelect.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.cleanSelectedKeys = this.cleanSelectedKeys.bind(this);
    this.handleRemoveChecked = this.handleRemoveChecked.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  componentWillMount() {
    const { user } = this.props;

    user.fetchTree().then((tree) => {
      if(tree && tree.length > 0) {
        user.setData({
          selectedKeys: [tree[0].id.toString()],
          expandedKeys: [tree[0].id.toString()],
        });
        user.fetchList({
          OrganizationID: user.selectedKeys[0],
          PageSize: user.pagination.pageSize,
          CurrentPage: user.pagination.current,
        });
      }
    });
  }

  setPwdModalVisible = (pwdModalVisible) => {
    this.setState({
      pwdModalVisible,
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

  // 设置模态框显示/隐藏
  setModalVisible(modalVisible) {
    const { user } = this.props;
    user.setData({
      modalVisible,
    });
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
    }).then(result => {
      if(result) {
        // 在选中条目中清除已经删除的
        user.setData({
          selectedRowKeys: user.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
        });
      }
    });
  }

  // 重置密码
  handleResetPwd = (record) => {
    this.setPwdModalVisible(true);
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
      width: 150,
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
            placement="bottom" 
            title="确认要删除这条记录吗？" 
            onConfirm={() => { this.handleRemove(record); }} 
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
        </span>
      ),
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={230} style={{ background: '#fff' }}>
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
          <UserForm
            user={user}
            modalVisible={user.modalVisible}
            setModalVisible={this.setModalVisible}
          />
          <PwdForm
            user={user}
            pwdModalVisible={this.state.pwdModalVisible}
            setPwdModalVisible={this.setPwdModalVisible}
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
