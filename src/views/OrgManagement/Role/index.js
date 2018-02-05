import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Popconfirm, message, Badge } from 'antd';

import RoleForm from './form';
import Auth from './auth';
import Member from './member';
import styles from './index.less';


const { Content } = Layout;

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
    role.refreshList();
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
  handleEdit = (record) => {
    const { role } = this.props;
    console.log('record' ,record);

    role.fetchDetail({
      UniqueID: record.UniqueID,
    }).then(() => {
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }
  // 删除
  handleRemove = (record) => {
    const { role } = this.props;

    role.remove({
      UniqueID: record.UniqueID,
    }).then(() => {
      message.success('删除成功');
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 角色授权
  handleAuth = (record) => {
    const { role } = this.props;
    role.setData({
      currentAuth: record,
    });
    role.fetchRoleMenuTree({
      UniqueID: record.UniqueID,
    });
    this.setAuthModalVisible(true);
  }

  // 角色成员
  handleMember = (record) => {
    const { role } = this.props;
    role.setData({
      currentMemberNode: record,
    });
    role.fetchOrgTree();
    role.fetchRoleMember({
      UniqueID: record.UniqueID,
    });
    role.fetchRoleMemberDetail({
      UniqueID: record.UniqueID,
    });
    
    this.setMemberModalVisible(true);
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  render() {
    const { role } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: '描述',
      dataIndex: 'DescInfo',
      key: 'DescInfo',
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
              this.handleAuth(record);
            }}
          >角色授权
          </a>
          <Divider type="vertical" />
          <a
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleMember(record);
            }}
          >角色成员
          </a>
        </span>
      ),
    }];

    return (
      <Layout className={styles.layout}>
        <Content style={{ background: '#fff', padding: 30 }}>
          <div className={styles.toolbar}>
            <Button
              icon="plus"
              onClick={this.handleNew}
              loading={role.newBtnLoading}
            >新建</Button>
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
            locale={{
              filterTitle: '筛选',
              filterConfirm: '确定',
              filterReset: '重置',
              emptyText: '暂无数据',
            }}
          />
        </Content>
      </Layout>
    );
  }
}
