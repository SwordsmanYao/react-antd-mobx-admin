import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, message, Layout, Input, Button, Row, Col } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import MemberCard from '@/components/MemberCard';

const { Header, Sider, Content } = Layout;

@observer
export default class Member extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    }
  }

  // 表单提交
  handleSubmit = (e) => {
    const { role, setMemberModalVisible } = this.props;

    this.setState({
      confirmLoading: true,
    });
    
    // role.commitRoleMenu({
    //   UniqueID: role.currentAuth.UniqueID,
    //   Params: role.roleMenuCheckedKeys,
    // }).then(() => {
    //   message.success('操作成功');
    //   setAuthModalVisible(false);
    // }).catch((e) => {
    //   message.error(`操作失败：${e.Message}`);
    // });
    
    this.setState({
      confirmLoading: false,
    });
  }

  afterClose = () => {
    const { role } = this.props;
    role.setData({
      currentMemberNode: null,
      orgTree: [],
      roleMemberList: [],
      selectedRoleMemberIDs: [],
    });
  }

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { role } = this.props;

    if(selectedKeys.length > 0) {
      role.setData({
        selectedOrgKeys: selectedKeys,
      });
      role.fetchRoleMemberDetail({
        UniqueID: role.currentMemberNode.UniqueID,
        Params: selectedKeys,
      });
    }
  }

  render() {
    const { role, memberModalVisible, setMemberModalVisible } = this.props;

    return (
      <Modal
        title="角色管理"
        okText="确定"
        cancelText="取消"
        width="850px"
        style={{ top: 20 }}
        confirmLoading={this.state.confirmLoading}
        visible={memberModalVisible}
        onOk={this.handleSubmit}
        onCancel={() => setMemberModalVisible(false)}
        afterClose={this.afterClose}
      >
        <Layout>
          <Sider width={180} style={{ background: '#fff' }}>
            <DisplayTree
              defaultExpandAll
              treeList={role.orgTree.slice()}
              onSelect={this.onSelect}
              selectedKeys={role.selectedOrgKeys.slice()}
            />
          </Sider>
          <Layout>
            <Header style={{ background: '#fff' }}>
              <Row gutter={8}>
                <Col span={16}>
                  <Input placeholder="请输入姓名" />
                </Col>
                <Col span={8}>
                  <Button>查询</Button>
                </Col>
              </Row>
            </Header>
            <Content style={{ background: '#fff' }}>
              <Row gutter={8}>
                <Col style={{ marginBottom: 8 }} span={12}>
                  <MemberCard loginName={'10418s'} name={'都打飞'} department={'工程一部'} />
                </Col>
                <Col style={{ marginBottom: 8 }} span={12}>
                  <MemberCard active loginName={'10418s'} name={'都打飞'} department={'工程一部'} />
                </Col>
                <Col style={{ marginBottom: 8 }} span={12}>
                  <MemberCard active loginName={'10418s'} name={'都打飞'} department={'工程一部'} />
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Modal>
    );
  }
}