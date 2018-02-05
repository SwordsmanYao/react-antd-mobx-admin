import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Steps, Icon, Modal, message } from 'antd';

import DisplayTree from '@/components/DisplayTree';

import styles from './auth.less';

const Step = Steps.Step;

@observer
export default class RoleForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    }
  }

  // 表单提交
  handleSubmit = (e) => {
    const { role, setAuthModalVisible } = this.props;

    this.setState({
      confirmLoading: true,
    });
    
    role.commitRoleMenu({
      UniqueID: role.currentAuth.UniqueID,
      Params: role.roleMenuCheckedKeys,
    }).then(() => {
      message.success('操作成功');
      setAuthModalVisible(false);
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
      currentAuth: null,
      roleMenuTree: [],
      roleMenuCheckedKeys: [],
    });
  }

  onCheckRoleMenu = (checkedKeys) => {
    const { role } = this.props;

    console.log('onCheckRoleMenu', checkedKeys);
    role.setData({
      roleMenuCheckedKeys: checkedKeys,
    });
  }
  

  render() {
    const { role, authModalVisible, setAuthModalVisible } = this.props;

    return (
      <Modal
        title="角色管理"
        okText="确定"
        cancelText="取消"
        width="750px"
        style={{ top: 20 }}
        confirmLoading={this.state.confirmLoading}
        visible={authModalVisible}
        onOk={this.handleSubmit}
        onCancel={() => setAuthModalVisible(false)}
        afterClose={this.afterClose}
      >
        <Steps>
          <Step status="finish" title="系统功能" icon={<Icon type="user" />} />
          <Step status="finish" title="系统按钮" icon={<Icon type="solution" />} />
          <Step status="process" title="系统视图" icon={<Icon type="loading" />} />
          <Step status="wait" title="数据权限" icon={<Icon type="smile-o" />} />
        </Steps>
        <div className={styles.stepContent}>
          <DisplayTree
            checkable
            defaultExpandAll
            treeList={role.roleMenuTree.slice()}
            onCheck={this.onCheckRoleMenu}
            checkedKeys={role.roleMenuCheckedKeys.slice()}
          />
        </div>
      </Modal>
    );
  }
}