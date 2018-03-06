import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, message, Badge, Modal, Alert } from 'antd';

import RoleToolBar from './toolBar';
import RoleForm from './form';
import Auth from './auth';
import Member from './member';
import styles from './index.less';


const { Content } = Layout;
const { confirm } = Modal;

@inject('role')
@observer
export default class Role extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      authModalVisible: false,
      memberModalVisible: false,
    }
  }

  componentWillMount() {
    const { role } = this.props;
    role.reset();
    role.refreshList();
  }

  componentWillUnmount() {
    const { role } = this.props;
    role.reset();
  }


  // 设置模态框显示/隐藏
  setModalVisible = (modalVisible) => {
    this.setState({
      modalVisible,
    });
  }

  setAuthModalVisible = (authModalVisible) => {
    this.setState({
      authModalVisible,
    });
  }

  setMemberModalVisible = (memberModalVisible) => {
    this.setState({
      memberModalVisible,
    });
  }

  // 新建
  handleNew = () => {
    this.setModalVisible(true);
  }

  // 修改
  handleEdit = () => {
    const { role } = this.props;

    role.fetchDetail().then(() => {
      role.setCurrentForm(role.currentDetail);
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }
  
  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { role } = this.props;

    role.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { role } = this.props;

    
    confirm({
      title: `确认要删除这 ${role.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(role.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { role } = this.props;

    role.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      role.setData({
        selectedRowKeys: role.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
      });
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 角色授权
  handleAuth = () => {
    this.setAuthModalVisible(true);
  }

  // 角色成员
  handleMember = () => {
    const { role } = this.props;

    role.fetchOrgTree().then(tree => {
      role.setData({
        selectedOrgKeys: [tree[0].id],
      });
      role.fetchRoleMemberDetail({
        UniqueID: role.selectedRowKeys[0],
        Params: [tree[0].id],
      });
    });

    role.fetchRoleMember({
      UniqueID: role.selectedRowKeys[0],
    });
    
    this.setMemberModalVisible(true);
  }

  // 表格分页、排序等的回调函数
  handleTableChange = (pagination, filters, sorter) => {
    const { role } = this.props;

    // 修改 store 数据
    role.setData({
      pagination: {
        ...role.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });

    // 发起请求
    role.fetchList({
      CurrentPage: pagination.current,
      PageSize: pagination.pageSize,
    });
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { role } = this.props;

    role.setData({
      selectedRowKeys,
    });
  }

  render() {
    const { role } = this.props;

    const columns = [{ 
      title: '序号',
      dataIndex: 'NO',
      width: '6%',
      className:'alignCenter', 
      render: (text, row, index) =>(
        index + 1 + (role.pagination.current - 1) * role.pagination.pageSize
      ),
    }, {
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: '30%',
    }, {
      title: '描述',
      dataIndex: 'DescInfo',
      key: 'DescInfo',
      width: '30%',
    }, {
      title: '状态',
      dataIndex: 'IsAvailable',
      key: 'IsAvailable',   
      render: (result) => {
        if(result) {
          return <Badge status="success" text="启用" />;
        } else {
          return <Badge status="error" text="禁用" />;
        }
      },
    }];

    return (
      <Layout className={styles.layout}>
        <Content>
          <RoleToolBar 
            role={role}
            handleNew={this.handleNew}
            handleEdit={this.handleEdit}
            handleRemoveChecked={this.handleRemoveChecked}
            handleAuth={this.handleAuth}
            handleMember={this.handleMember}
          />
          <RoleForm
            role={role}
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
          />
          {/* 角色授权窗口 */}
          <Auth
            role={role}
            authModalVisible={this.state.authModalVisible}
            setAuthModalVisible={this.setAuthModalVisible}
          />
          {/* 角色成员设置窗口 */}
          <Member
            role={role}
            memberModalVisible={this.state.memberModalVisible}
            setMemberModalVisible={this.setMemberModalVisible}
          />
          <div className={styles.tableAlert}>
            <Alert
              message={(
                <div>
                  已选择 <a style={{ fontWeight: 600 }}>{role.selectedRowKeys.length}</a> 项
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={role.selectedRowKeys.length <= 0}>清空</a>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table
            bordered
            size="small"
            loading={role.loading}
            pagination={role.pagination}
            dataSource={role.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            rowSelection={{
              selectedRowKeys: role.selectedRowKeys,
              onChange: this.onSelectionChange,
            }}
            scroll={{ y: window.innerHeight - 220 }}
          />
        </Content>
      </Layout>
    );
  }
}
