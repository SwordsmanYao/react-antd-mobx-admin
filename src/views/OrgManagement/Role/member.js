import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, message, Layout, Input, Row, Col } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import MemberCard from '@/components/MemberCard';

const { Header, Sider, Content } = Layout;

@observer
export default class Member extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      queryStr: '',
    }
  }



  // 表单提交
  handleSubmit = (e) => {
    const { role, setMemberModalVisible } = this.props;

    this.setState({
      confirmLoading: true,
    });
    
    const checkedMemberIDs =Array.from(role.selectedRoleMemberIDSet);

    role.commitRoleMember({
      UniqueID: role.currentMemberNode.UniqueID,
      Params: checkedMemberIDs,
    }).then(() => {
      message.success('操作成功');
      setMemberModalVisible(false);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
    
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

  onClickCard = (UniqueID) => {
    const { role } = this.props;
    role.toggleRoleMemberChecked(UniqueID);
  }

  // 角色成员列表，每行显示三个
  RoleMemberListShow = (roleMemberList) => {
    console.log(roleMemberList);
    const rowList = [];
    let row = [];
    roleMemberList.forEach((item, index) => {
      row.push(item);
      if(index % 3 === 2) {
        rowList.push(row);
        row = [];
      }
    });

    if(row.length > 0) {
      rowList.push(row);
    }
    
    return rowList.map((row, index) => (
      <Row key={index} gutter={8}>
        {
          row.map(item => (
            <Col onClick={() => this.onClickCard(item.UniqueID)} key={item.UniqueID} style={{ marginBottom: 8 }} span={8}>
              <MemberCard active={item.IsRoleMember} loginName={item.LoginName} name={item.FullName} />
            </Col>
          ))
        }
      </Row>
    ));
  }

  handleChangeQueryStr = (e) => {
    this.setState({
      queryStr: e.target.value,
    });
  }

  render() {
    const { role, memberModalVisible, setMemberModalVisible } = this.props;

    const showList = role.roleMemberList.filter(item => {
      return `${item.FullName}${item.LoginName}`.indexOf(this.state.queryStr) !== -1;
    });

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
              selectedKeys={role.selectedOrgKeys.slice().map(item => item.toString())}
            />
          </Sider>
          <Layout>
            <Header style={{ background: '#fff' }}>
              <Input
                placeholder="请输入姓名"
                value={this.state.queryStr}
                onChange={this.handleChangeQueryStr}
              />
            </Header>
            <Content style={{ background: '#fff' }}>
              {
                this.RoleMemberListShow(showList)
              }
            </Content>
          </Layout>
        </Layout>
      </Modal>
    );
  }
}