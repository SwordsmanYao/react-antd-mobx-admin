import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, message, Badge, Dropdown, Icon, Menu, Modal } from 'antd';

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

    role.fetchOrgTree().then(tree => {
      role.setData({
        selectedOrgKeys: [tree[0].id],
      });
      role.fetchRoleMemberDetail({
        UniqueID: record.UniqueID,
        Params: [tree[0].id],
      });
    });

    role.fetchRoleMember({
      UniqueID: record.UniqueID,
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

  render() {
    const { role } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 120,
    }, {
      title: '描述',
      dataIndex: 'DescInfo',
      key: 'DescInfo',
      width: 120,
    }, {
      title: '状态',
      dataIndex: 'IsAvailable',
      key: 'IsAvailable',
      width: 120,      
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
      width: 150,
      render: (text, record) => {

        const menu = (
          <Menu>
            <Menu.Item>
              <a
                onClick={(e) => {
                  this.handleAuth(record);
                }}
              >角色授权
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                onClick={(e) => {
                  this.handleMember(record);
                }}
              >角色成员
              </a>
            </Menu.Item>
          </Menu>
        );

        return (
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
              <a
                onClick={(e) => {
                  confirm({
                    title: "确认要删除这条记录吗？",
                    content: '',
                    onOk: () => {
                      this.handleRemove(record);
                    },
                  });
                }}
              >删除
              </a>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link">
                更多<Icon type="down" />
              </a>
            </Dropdown>
          </span>
        )
      },
    }];

    return (
      <Layout className={styles.layout}>
        <Content style={{ paddingLeft: 30, paddingRight: 30 }}>
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
            scroll={{ y: window.innerHeight - 220 }}
          />
        </Content>
      </Layout>
    );
  }
}
