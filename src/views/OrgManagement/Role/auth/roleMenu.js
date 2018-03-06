import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { message } from 'antd';

import DisplayTree from '@/components/DisplayTree';

@observer
export default class RoleMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    }
  }

  // StepModal 组件调用方法
  handleNextStep = (e) => {
    const { role, goNext } = this.props;

    this.setState({
      confirmLoading: true,
    });
    
    role.commitRoleMenu({
      UniqueID: role.selectedRowKeys[0],
      Params: [...role.roleMenuCheckedKeys, ...role.roleMenuHalfCheckedKeys],
    }).then(() => {
      message.success('操作成功');
      goNext();
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
    
    this.setState({
      confirmLoading: false,
    });
  }

  componentDidMount = () => {
    const { role } = this.props;
    role.fetchRoleMenuTree({
      UniqueID: role.selectedRowKeys[0],
    });
  }

  onCheck = (checkedKeys, info) => {
    const { role } = this.props;

    console.log('onCheckRoleMenu', checkedKeys, info);
    role.setData({
      roleMenuCheckedKeys: checkedKeys,
      roleMenuHalfCheckedKeys: info.halfCheckedKeys,
    });
  }
  

  render() {
    const { role } = this.props;

    return (
      <DisplayTree
        checkable
        defaultExpandAll
        treeList={role.roleMenuTree.slice()}
        onCheck={this.onCheck}
        checkedKeys={role.roleMenuCheckedKeys.slice()}
      />
    );
  }
}